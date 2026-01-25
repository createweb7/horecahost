'use client';

import { useState } from 'react';
import { MdEmail, MdPhone, MdPerson } from 'react-icons/md';

interface EnquiryFormProps {
  productName?: string;
  productSlug?: string;
  productPrice?: number;
}

export default function EnquiryForm({
  productName,
  productSlug,
  productPrice,
}: EnquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get reCAPTCHA token from Google
      let recaptchaToken = '';
      
      if (typeof window !== 'undefined' && window.grecaptcha) {
        console.log('Executing reCAPTCHA...');
        recaptchaToken = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
          { action: 'enquiry' }
        );
        console.log('reCAPTCHA token obtained:', recaptchaToken?.substring(0, 50) + '...');
      } else {
        console.warn('reCAPTCHA not available, proceeding without token');
        // Continue without token (API will still be called, just bypass reCAPTCHA)
      }

      // Send enquiry
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productName: productName || undefined,
          productSlug: productSlug || undefined,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      console.error('Enquiry submission error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full z-10">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Enquire About This Product</h2>
        {productName && (
          <p className="text-gray-600 mb-6">
            Product: <span className="font-semibold">{productName}</span>
            {productPrice && <span className="ml-4">Price: AED {productPrice}</span>}
          </p>
        )}

        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">
              ✓ Enquiry submitted successfully! We will contact you soon.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">✗ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              <MdPerson className="inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              <MdEmail className="inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-2">
              <MdPhone className="inline mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+971 50 123 4567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Tell us more about your enquiry..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include any specific requirements or questions you have.
            </p>
          </div>

          {/* reCAPTCHA notice */}
          <p className="text-xs text-gray-500">
            This site is protected by reCAPTCHA and the Google{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Terms of Service
            </a>{' '}
            apply.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative z-20 border-0 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Sending Enquiry...
              </>
            ) : (
              <>
                <MdEmail />
                Send Enquiry
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Declare grecaptcha for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
