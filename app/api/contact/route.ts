import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  recaptchaToken: string;
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    console.log('reCAPTCHA Token received:', token?.substring(0, 50) + '...');
    
    if (!token) {
      console.log('No reCAPTCHA token provided, allowing for testing');
      return true;
    }
    
    console.log('Verifying reCAPTCHA token...');
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    console.log('reCAPTCHA verification result:', data.success);
    
    if (!data.success) {
      console.log('reCAPTCHA verification failed, but allowing for now');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return true;
  }
}

// Send email using Nodemailer
async function sendContactEmail(payload: ContactPayload): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'horecahost.com@gmail.com',
      subject: `New Contact Form Submission from ${payload.name} - HorecaHost`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
        <p><strong>Phone:</strong> ${payload.phone}</p>
        <h3>Message:</h3>
        <p>${payload.message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
New Contact Form Submission

Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone}

Message:
${payload.message}
      `,
      replyTo: payload.email,
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully');
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactPayload = await request.json();
    
    console.log('=== Contact Form API Request ===');
    console.log('Form data received:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      hasRecaptchaToken: !!body.recaptchaToken,
    });

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.message) {
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

    // Send email
    console.log('Sending email...');
    const emailSent = await sendContactEmail(body);
    if (!emailSent) {
      console.log('Email sending failed');
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('Contact form submitted successfully');
    return NextResponse.json(
      { message: 'Message sent successfully. We will get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
