import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { getClientAddress, isRateLimited } from '@/lib/request-rate-limit';

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  recaptchaToken: string;
}

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
async function sendContactEmail(payload: ContactPayload): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD,
      },
    });

    const nameHtml = escapeHtml(payload.name);
    const emailHtml = escapeHtml(payload.email);
    const phoneHtml = escapeHtml(payload.phone);
    const messageHtml = escapeHtml(payload.message).replace(/\n/g, "<br>");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'gm@horecahost.com, info@horecahost.com',
      subject: `New Contact Form Submission from ${payload.name} - HorecaHost`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${nameHtml}</p>
        <p><strong>Email:</strong> <a href="mailto:${emailHtml}">${emailHtml}</a></p>
        <p><strong>Phone:</strong> ${phoneHtml}</p>
        <h3>Message:</h3>
        <p>${messageHtml}</p>
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
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactPayload;

    const clientAddress = getClientAddress(request.headers);
    if (clientAddress && isRateLimited(clientAddress)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429 },
      );
    }

    if (
      typeof body.name !== 'string' || !body.name.trim() || body.name.length > 100 ||
      typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || body.email.length > 254 ||
      typeof body.phone !== 'string' || !body.phone.trim() || body.phone.length > 40 ||
      typeof body.message !== 'string' || !body.message.trim() || body.message.length > 5000
    ) {
      return NextResponse.json({ error: 'Please check the contact details and try again.' }, { status: 400 });
    }

    const isValidCaptcha = await verifyRecaptcha(
      body.recaptchaToken,
      'contact',
      request.nextUrl.hostname,
    );
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'Security check failed. Please refresh the page and try again.' },
        { status: 400 },
      );
    }

    // Send email
    const emailSent = await sendContactEmail(body);
    if (!emailSent) {
      console.log('Email sending failed');
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

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
