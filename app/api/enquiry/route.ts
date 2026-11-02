import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { getClientAddress, isRateLimited } from '@/lib/request-rate-limit';

interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  productName?: string;
  productSlug?: string;
  productLink?: string;
  source?: string;
  recaptchaToken: string;
  companyWebsite?: string;
}

const SOURCE_LABELS: Record<string, string> = {
  quick: 'Quick Enquiry',
  consultation: 'Consultation Request',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char] || char);
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

    const sourceLabel = payload.source ? SOURCE_LABELS[payload.source] || payload.source : null;
    const nameHtml = escapeHtml(payload.name);
    const emailHtml = escapeHtml(payload.email);
    const phoneHtml = escapeHtml(payload.phone);
    const messageHtml = escapeHtml(payload.message).replace(/\n/g, "<br>");
    const productNameHtml = payload.productName ? escapeHtml(payload.productName) : "";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'gm@horecahost.com, info@horecahost.com',
      subject: `New ${sourceLabel ? `${sourceLabel} ` : ''}Enquiry from ${payload.name} - HorecaHost`,
      html: `
        <h2>New ${sourceLabel || 'Product'} Enquiry</h2>
        ${sourceLabel ? `<p><strong>Source:</strong> ${sourceLabel}</p>` : ''}
        <p><strong>Name:</strong> ${nameHtml}</p>
        <p><strong>Email:</strong> <a href="mailto:${emailHtml}">${emailHtml}</a></p>
        <p><strong>Phone:</strong> ${phoneHtml}</p>
        ${payload.productName ? `<p><strong>Product:</strong> ${productNameHtml}</p>` : ''}
        <h3>Message:</h3>
        <p>${messageHtml}</p>
      `,
      text: `
New ${sourceLabel || 'Product'} Enquiry
${sourceLabel ? `Source: ${sourceLabel}` : ''}

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
    
    const { error } = await supabase
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
          source: payload.source || null,
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
    const body = (await request.json()) as EnquiryPayload;

    const clientAddress = getClientAddress(request.headers);
    if (clientAddress && isRateLimited(clientAddress)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429 },
      );
    }

    // Silently accept bot submissions trapped by the form honeypot.
    if (body.companyWebsite?.trim()) {
      return NextResponse.json({ message: 'Enquiry submitted successfully.' });
    }

    const requiredFields = [body.name, body.email, body.phone, body.message];
    if (
      requiredFields.some((value) => typeof value !== 'string' || !value.trim()) ||
      body.name.length > 100 ||
      body.email.length > 254 ||
      body.phone.length > 40 ||
      body.message.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
    ) {
      return NextResponse.json({ error: 'Please check the enquiry details and try again.' }, { status: 400 });
    }

    const isValidCaptcha = await verifyRecaptcha(
      body.recaptchaToken,
      'enquiry',
      request.nextUrl.hostname,
    );
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'Security check failed. Please refresh the page and try again.' },
        { status: 400 },
      );
    }

    // Save to database
    const dbSaved = await saveEnquiryToDatabase(body);
    if (!dbSaved) {
      console.error('Failed to save enquiry to database; sending email anyway');
    }

    // Send email
    const emailSent = await sendEnquiryEmail(body);
    if (!emailSent) {
      console.log('Email sending failed');
      return NextResponse.json(
        { error: 'Failed to send enquiry. Please try again later.' },
        { status: 500 }
      );
    }

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
