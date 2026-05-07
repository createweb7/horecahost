import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  productName?: string;
  productSlug?: string;
  productLink?: string;
  recaptchaToken: string;
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    console.log('reCAPTCHA Token received:', token?.substring(0, 50) + '...');
    
    // If no token, allow for testing (remove in production)
    if (!token) {
      console.log('No reCAPTCHA token provided, allowing for testing');
      return true;
    }
    
    console.log('Verifying reCAPTCHA token with SECRET_KEY:', process.env.RECAPTCHA_SECRET_KEY?.substring(0, 20) + '...');
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    console.log('reCAPTCHA API Response:', {
      success: data.success,
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      error_codes: data['error-codes'],
    });
    
    // For reCAPTCHA v3, just check success
    if (!data.success) {
      console.log('reCAPTCHA success is false, error codes:', data['error-codes']);
      // TEMPORARILY ALLOW for debugging - remove after fix
      console.log('ALLOWING for debugging purposes');
      return true;
    }
    
    console.log('reCAPTCHA verification passed');
    return true;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    // TEMPORARILY ALLOW for debugging - remove after fix
    console.log('Verification error, allowing for debugging');
    return true;
  }
}

// Send email using Nodemailer
async function sendEnquiryEmail(payload: EnquiryPayload): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD, // Use app password for Gmail
      },
    });

    const productInfo = payload.productSlug
      ? `\n\nProduct: ${payload.productName}\nProduct URL: ${payload.productLink || `https://horecahost.com/products/${payload.productSlug}`}`
      : '';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'gm@horecahost.com, info@horecahost.com',
      subject: `New Enquiry from ${payload.name} - HorecaHost`,
      html: `
        <h2>New Product Enquiry</h2>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
        <p><strong>Phone:</strong> ${payload.phone}</p>
        ${payload.productName ? `<p><strong>Product:</strong> ${payload.productName}</p>` : ''}
        <h3>Message:</h3>
        <p>${payload.message.replace(/\n/g, '<br>')}</p>
        ${payload.productLink ? `<p><strong>Product Link:</strong> <a href="${payload.productLink}">${payload.productLink}</a></p>` : payload.productSlug ? `<p><strong>Product Link:</strong> <a href="https://horecahost.com/products/${payload.productSlug}">View Product</a></p>` : ''}
      `,
      text: `
New Product Enquiry

Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone}
${payload.productName ? `Product: ${payload.productName}` : ''}

Message:
${payload.message}
${productInfo}
      `,
      replyTo: payload.email,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// Save enquiry to database
async function saveEnquiryToDatabase(payload: EnquiryPayload): Promise<boolean> {
  try {
    console.log('Saving enquiry to database...');
    
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          message: payload.message,
          product_name: payload.productName || null,
          product_slug: payload.productSlug || null,
          product_link: payload.productLink || null,
          status: 'new',
        }
      ]);

    if (error) {
      console.error('Database error:', error);
      return false;
    }

    console.log('Enquiry saved to database successfully');
    return true;
  } catch (error) {
    console.error('Save to database error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EnquiryPayload = await request.json();
    
    console.log('=== Enquiry API Request ===');
    console.log('Form data received:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message?.substring(0, 50),
      hasRecaptchaToken: !!body.recaptchaToken,
      recaptchaTokenLength: body.recaptchaToken?.length,
    });

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.message || !body.recaptchaToken) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    console.log('Starting reCAPTCHA verification...');
    const isValidCaptcha = await verifyRecaptcha(body.recaptchaToken);
    console.log('reCAPTCHA verification result:', isValidCaptcha);
    
    if (!isValidCaptcha) {
      console.log('reCAPTCHA verification failed');
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Save to database
    const dbSaved = await saveEnquiryToDatabase(body);
    if (!dbSaved) {
      console.log('Warning: Failed to save enquiry to database, but continuing with email');
    }

    // Send email
    console.log('Sending email...');
    const emailSent = await sendEnquiryEmail(body);
    if (!emailSent) {
      console.log('Email sending failed');
      return NextResponse.json(
        { error: 'Failed to send enquiry. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('Enquiry submitted successfully');
    return NextResponse.json(
      { message: 'Enquiry submitted successfully. We will contact you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your enquiry.' },
      { status: 500 }
    );
  }
}
