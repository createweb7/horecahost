"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/global/Footer";
import BrochuresSection from "@/components/products/BrochuresSection";
import { MdOutlineEmail } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";
import { ProductWithRelations } from "@/lib/types";

interface Props {
  product: ProductWithRelations;
  imageUrls: string[];
  cleanDescription: string;
}

function EnquiryModal({
  product,
  onClose,
}: {
  product: ProductWithRelations;
  onClose: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const recaptchaRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[\d\s+\-()]{10,}$/.test(formData.phone.replace(/\s/g, ""))) newErrors.phone = "Please enter a valid phone number";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const productLink = typeof window !== "undefined" ? window.location.href : "";
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          productName: product.name_en,
          productSlug: product.slug,
          productPrice: product.price,
          productLink,
          recaptchaToken: "placeholder",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(true);
        setFormData({ fullName: "", email: "", phone: "", message: "" });
        setTimeout(() => {
          onClose();
          setSuccessMessage(false);
        }, 3000);
      } else {
        setErrors({ submit: data.error || "Failed to send enquiry. Please try again." });
      }
    } catch {
      setErrors({ submit: "An error occurred. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(200, 200, 200, 0.4)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Enquire Now</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center">
            ✕
          </button>
        </div>
        <div className="p-6 bg-gray-50">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enquire About This Product</h3>
            <p className="text-sm text-gray-600"><span className="font-semibold">Product:</span> {product.name_en}</p>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold">
              ✓ Enquiry submitted successfully! We will contact you soon.
            </div>
          )}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+971 50 123 4567"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us more about your enquiry..." rows={3}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${errors.message ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="g-recaptcha" data-sitekey="6LePm7MqAAAAAMlBqqHi3RTzuXYm5B6JVNVrKz5x" ref={recaptchaRef} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg text-sm transition">
                {isSubmitting ? "Sending..." : "Send Enquiry"}
              </button>
              <button type="button" onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function ProductPageSSR({ product, imageUrls, cleanDescription }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const images = imageUrls.length > 0 ? imageUrls : ["/placeholder.png"];

  return (
    <>
      <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            {" › "}
            <Link href="/products" className="hover:text-gray-900">Products</Link>
            {product.category && (
              <>
                {" › "}
                <Link href={`/${product.category.slug}`} className="hover:text-gray-900">
                  {product.category.name_en}
                </Link>
              </>
            )}
            {product.subcategory && (
              <>
                {" › "}
                <Link href={`/${product.subcategory.slug}`} className="hover:text-gray-900">
                  {product.subcategory.name_en}
                </Link>
              </>
            )}
            {" › "}
            <span className="text-gray-900 font-semibold">{product.name_en}</span>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-12">
            {/* Images */}
            <div>
              <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-white flex items-center justify-center border border-gray-200">
                {images[selectedImage] && (
                  <Image src={images[selectedImage]} alt={product.name_en} fill className="object-contain p-4" />
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) =>
                    image && (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square overflow-hidden rounded border-2 bg-white flex items-center justify-center ${
                          selectedImage === index ? "border-blue-500" : "border-gray-200"
                        }`}
                      >
                        <Image src={image} alt={`${product.name_en} ${index + 1}`} fill className="object-contain p-2" />
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name_en}</h1>

              {product.brand && (
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    {product.brand.image_path && (
                      <div className="shrink-0">
                        <Image
                          src={product.brand.image_path}
                          alt={product.brand.name_en}
                          width={80}
                          height={80}
                          className="h-20 w-auto object-contain border border-gray-200 rounded p-2"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Brand</p>
                      <Link href={`/${product.brand.slug}`} className="text-lg font-semibold text-gray-900 hover:text-red-600">
                        {product.brand.name_en}
                      </Link>
                      {product.brand.country_en && (
                        <p className="text-gray-600 text-sm mt-2">
                          <strong>Made in:</strong> {product.brand.country_en}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {product.model && (
                <p className="text-gray-700 mb-3">
                  <strong className="text-gray-900">Model:</strong> {product.model}
                </p>
              )}

              {product.category && (
                <p className="text-gray-700 mb-6">
                  <strong className="text-gray-900">Category:</strong>{" "}
                  {product.category.name_en}
                  {product.subcategory && ` / ${product.subcategory.name_en}`}
                </p>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 flex items-center justify-center gap-3">
                <span className="text-2xl">🚚</span>
                <span className="text-gray-900 font-semibold">FAST SHIPPING</span>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowEnquiryModal(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition cursor-pointer border-0"
                >
                  <MdOutlineEmail size={24} /> ENQUIRE NOW
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const phoneNumber = "971503079863";
                    const message = `Hi, I'm interested in: ${product.name_en}`;
                    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, "_blank");
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition cursor-pointer border-0"
                >
                  <RiWhatsappFill size={24} /> WHATSAPP NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
              <div
                className="text-gray-700 leading-relaxed [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: cleanDescription }}
              />
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
                <dl className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-4">
                      <dt className="font-semibold text-gray-900 text-sm uppercase tracking-wide">{key}</dt>
                      <dd className="text-gray-700 mt-2">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <BrochuresSection productId={product.id} productName={product.name_en} />
          </div>
        </div>
      </main>

      <Footer />

      {showEnquiryModal && (
        <EnquiryModal product={product} onClose={() => setShowEnquiryModal(false)} />
      )}
    </>
  );
}
