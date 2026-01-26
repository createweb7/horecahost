"use client";

import { useState, useEffect, useLayoutEffect, use, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import DOMPurify from "dompurify";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import EnquiryForm from "@/components/enquiry/EnquiryForm";
import Footer from "@/components/global/Footer";
import { MdOutlineEmail } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";
import { getProductImageUrls } from "@/lib/utils";
import {
  ProductWithRelations,
  Brand,
  Subcategory,
  SubcategoryWithRelations,
  Category,
} from "@/lib/types";

// Helper function to clean HTML and remove empty paragraphs
const cleanHTML = (html: string): string => {
  // First sanitize the HTML
  let sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
  
  // Remove HTML entities and normalize whitespace
  sanitized = sanitized
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8226;/g, '•')
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
  
  // Remove paragraphs that contain only whitespace, carriage returns, bullets, or nbsp
  sanitized = sanitized.replace(/<p>[\s•]*<\/p>/g, '');
  
  // Fix broken sentences split across paragraphs
  // Join incomplete sentences: </p><p>word -> </p> word
  // But keep bullet points on separate lines
  sanitized = sanitized.replace(/<\/p><p>([^•\s])/g, ' $1</p><p>');
  
  // Remove duplicate bullets at start of new paragraphs
  sanitized = sanitized.replace(/<\/p>\s*<p>\s*•\s*/g, '</p><p>• ');
  
  // Trim whitespace inside paragraphs
  sanitized = sanitized.replace(/<p>\s+/g, '<p>');
  sanitized = sanitized.replace(/\s+<\/p>/g, '</p>');
  
  return sanitized;
};

interface SlugPageProps {
  params: Promise<{ slug: string[] }>;
}

interface ResolvedContent {
  type: "product" | "brand" | "category" | "subcategory" | "brand-subcategory";
  data?: ProductWithRelations | Brand | Category | Subcategory;
  brand?: Brand;
  subcategory?: SubcategoryWithRelations;
  products?: ProductWithRelations[];
  subcategorySlug?: string;
}

export default function SlugPage({ params }: SlugPageProps) {
  const [content, setContent] = useState<ResolvedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [subcategoryProducts, setSubcategoryProducts] = useState<
    ProductWithRelations[]
  >([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [subcategoryProductsPage, setSubcategoryProductsPage] = useState(1);
  const [subcategoryProductsTotal, setSubcategoryProductsTotal] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState<
    ProductWithRelations[]
  >([]);
  const [categoryProductsLoading, setCategoryProductsLoading] = useState(true);
  const [categoryProductsPage, setCategoryProductsPage] = useState(1);
  const [categoryProductsTotal, setCategoryProductsTotal] = useState(0);
  const [categorySubcategories, setCategorySubcategories] = useState<
    Subcategory[]
  >([]);
  const [brandProducts, setBrandProducts] = useState<ProductWithRelations[]>(
    []
  );
  const [brandProductsLoading, setBrandProductsLoading] = useState(true);
  const [brandProductsPage, setBrandProductsPage] = useState(1);
  const [brandProductsTotal, setBrandProductsTotal] = useState(0);
  const [brandSubcategories, setBrandSubcategories] = useState<
    (SubcategoryWithRelations & { productCount?: number })[]
  >([]);
  const [showAllBrandSubcategories, setShowAllBrandSubcategories] =
    useState(false);
  const [brandSubcategoryProducts, setBrandSubcategoryProducts] = useState<
    ProductWithRelations[]
  >([]);
  const [brandSubcategoryProductsLoading, setBrandSubcategoryProductsLoading] =
    useState(false);
  const [brandSubcategoryProductsPage, setBrandSubcategoryProductsPage] =
    useState(1);
  const [brandSubcategoryProductsTotal, setBrandSubcategoryProductsTotal] =
    useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const { slug } = use(params);

  const slugPath = Array.isArray(slug) ? slug.join("-") : slug;
  const subcategoryProductsLimit = 12;
  const categoryProductsLimit = 12;
  const brandProductsLimit = 12;
  const brandSubcategoryProductsLimit = 12;
  const initialBrandSubcategoriesShow = 4;

  // Modal Component
  const EnquiryModal = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      phone: "",
      message: ""
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const recaptchaRef = useRef<any>(null);

    useEffect(() => {
      setIsMounted(true);
      // Load reCAPTCHA script
      if (!window.grecaptcha) {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }, []);

    const validateForm = () => {
      const newErrors: {[key: string]: string} = {};
      
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }
      
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = "Please enter a valid phone number";
      }
      
      if (!formData.message.trim()) {
        newErrors.message = "Message is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      
      // Get product link - use current page URL
      const productLink = typeof window !== 'undefined' ? window.location.href : '';
      
      try {
        const response = await fetch('/api/enquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            productName: content?.data && "name_en" in content.data ? (content.data as ProductWithRelations).name_en : undefined,
            productSlug: content?.data && "slug" in content.data ? (content.data as ProductWithRelations).slug : undefined,
            productPrice: content?.data && "price" in content.data ? (content.data as ProductWithRelations).price : undefined,
            productLink: productLink,
            recaptchaToken: "placeholder"
          })
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage(true);
          setFormData({ fullName: "", email: "", phone: "", message: "" });
          // Auto-close modal after 3 seconds
          setTimeout(() => {
            setShowEnquiryModal(false);
            setSuccessMessage(false);
          }, 3000);
        } else {
          setErrors({ submit: data.error || "Failed to send enquiry. Please try again." });
        }
      } catch (error) {
        console.error('Submission error:', error);
        setErrors({ submit: "An error occurred. Please check your connection and try again." });
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isMounted || !showEnquiryModal) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setShowEnquiryModal(false);
      }
    };

    return createPortal(
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(200, 200, 200, 0.4)" }}
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Enquire Now</h2>
            <button
              type="button"
              onClick={() => setShowEnquiryModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enquire About This Product</h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Product:</span> {
                  content?.data && "name_en" in content.data
                    ? (content.data as ProductWithRelations).name_en
                    : "N/A"
                }
              </p>
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
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name" 
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com" 
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+971 50 123 4567" 
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your enquiry..." 
                  rows={3} 
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <div className="flex items-center justify-center mb-4">
                <div className="g-recaptcha" data-sitekey="6LePm7MqAAAAAMlBqqHi3RTzuXYm5B6JVNVrKz5x" ref={recaptchaRef}></div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
                >
                  {isSubmitting ? "Sending..." : "Send Enquiry"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEnquiryModal(false)} 
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg text-sm transition"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  useEffect(() => {
    // Scroll to top on slug change
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const resolveSlug = async () => {
      try {
        const res = await fetch(`/api/resolve-slug?slug=${slugPath}`);
        if (!res.ok) throw new Error("Content not found");
        const data = await res.json();
        setContent(data);
        // Scroll again after content loads
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch {
        setError("Content not found");
      } finally {
        setLoading(false);
      }
    };

    resolveSlug();
  }, [slugPath]);

  useEffect(() => {
    if (content?.type === "subcategory") {
      const subcategory = content.data as Subcategory;
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            `/api/products?subcategory=${subcategory.id}&page=${subcategoryProductsPage}&limit=${subcategoryProductsLimit}`
          );
          if (res.ok) {
            const data = await res.json();
            setSubcategoryProducts(data.products || []);
            setSubcategoryProductsTotal(data.total || 0);
          }
        } catch (err) {
          console.error("Failed to fetch products:", err);
        } finally {
          setProductsLoading(false);
        }
      };

      if (subcategory?.id) {
        fetchProducts();
      }
    }

    if (content?.type === "category") {
      const category = content.data as Category;

      // Fetch subcategories
      const fetchSubcategories = async () => {
        try {
          const res = await fetch(
            `/api/categories/${category.id}/subcategories`
          );
          if (res.ok) {
            const data = await res.json();
            setCategorySubcategories(data.subcategories || []);
          }
        } catch (err) {
          console.error("Failed to fetch subcategories:", err);
        }
      };

      // Fetch products
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            `/api/products?category=${category.id}&page=${categoryProductsPage}&limit=${categoryProductsLimit}`
          );
          if (res.ok) {
            const data = await res.json();
            setCategoryProducts(data.products || []);
            setCategoryProductsTotal(data.total || 0);
          }
        } catch (err) {
          console.error("Failed to fetch products:", err);
        } finally {
          setCategoryProductsLoading(false);
        }
      };

      if (category?.id) {
        fetchSubcategories();
        fetchProducts();
      }
    }
  }, [content, subcategoryProductsPage, categoryProductsPage]);

  useEffect(() => {
    if (content?.type === "brand") {
      const brand = content.data as Brand;

      // Fetch subcategories for this brand
      const fetchSubcategories = async () => {
        try {
          const res = await fetch(`/api/brands/${brand.id}/subcategories`);
          if (res.ok) {
            const data = await res.json();
            setBrandSubcategories(data.subcategories || []);
          }
        } catch (err) {
          console.error("Failed to fetch subcategories:", err);
        }
      };

      // Fetch products
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            `/api/products?brand=${brand.id}&page=${brandProductsPage}&limit=${brandProductsLimit}`
          );
          if (res.ok) {
            const data = await res.json();
            setBrandProducts(data.products || []);
            setBrandProductsTotal(data.total || 0);
          }
        } catch (err) {
          console.error("Failed to fetch products:", err);
        } finally {
          setBrandProductsLoading(false);
        }
      };

      if (brand?.id) {
        fetchSubcategories();
        fetchProducts();
      }
    }
  }, [content, brandProductsPage]);

  useEffect(() => {
    if (
      content?.type === "brand-subcategory" &&
      content.brand &&
      content.subcategory
    ) {
      const brand = content.brand;
      const subcategory = content.subcategory;
      const fetchProducts = async () => {
        setBrandSubcategoryProductsLoading(true);
        try {
          const res = await fetch(
            `/api/products?brand=${brand.id}&subcategory=${subcategory.id}&page=${brandSubcategoryProductsPage}&limit=${brandSubcategoryProductsLimit}`
          );
          if (res.ok) {
            const data = await res.json();
            setBrandSubcategoryProducts(data.products || []);
            setBrandSubcategoryProductsTotal(data.total || 0);
          }
        } catch (err) {
          console.error("Failed to fetch brand-subcategory products:", err);
        } finally {
          setBrandSubcategoryProductsLoading(false);
        }
      };

      fetchProducts();
    }
  }, [content, brandSubcategoryProductsPage]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{error || "Content not found"}</p>
      </main>
    );
  }

  // Product page
  if (content.type === "product") {
    const product = content.data as ProductWithRelations;
    const images = product.images && product.images.length > 0
      ? getProductImageUrls(product.id, product.images)
      : ["/placeholder.png"];

    return (
      <>
        {/* Breadcrumb Header */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              {" › "}
              <Link href="/products" className="hover:text-gray-900">
                Products
              </Link>
              {product.category && (
                <>
                  {" › "}
                  <Link
                    href={`/${product.category.slug}`}
                    className="hover:text-gray-900"
                  >
                    {product.category.name_en}
                  </Link>
                </>
              )}
              {product.subcategory && (
                <>
                  {" › "}
                  <Link
                    href={`/${product.subcategory.slug}`}
                    className="hover:text-gray-900"
                  >
                    {product.subcategory.name_en}
                  </Link>
                </>
              )}
              {" › "}
              <span className="text-gray-900 font-semibold">
                {product.name_en}
              </span>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Main Content: Image and Details Side by Side */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-12">
              {/* Images */}
              <div>
                <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-white flex items-center justify-center border border-gray-200">
                  {images[selectedImage] && (
                    <Image
                      src={images[selectedImage]}
                      alt={product.name_en}
                      fill
                      className="object-contain p-4"
                    />
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map(
                      (image, index) =>
                        image && (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative aspect-square overflow-hidden rounded border-2 bg-white flex items-center justify-center ${
                              selectedImage === index
                                ? "border-blue-500"
                                : "border-gray-200"
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${product.name_en} ${index + 1}`}
                              fill
                              className="object-contain p-2"
                            />
                          </button>
                        )
                    )}
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name_en}
                </h1>

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
                        <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">
                          Brand
                        </p>
                        <Link
                          href={`/${product.brand.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-red-600"
                        >
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
                    <strong className="text-gray-900">Model:</strong>{" "}
                    {product.model}
                  </p>
                )}

                {product.category && (
                  <p className="text-gray-700 mb-6">
                    <strong className="text-gray-900">Category:</strong>{" "}
                    {product.category.name_en}
                    {product.subcategory && ` / ${product.subcategory.name_en}`}
                  </p>
                )}

                {/* Fast Shipping Banner */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 flex items-center justify-center gap-3">
                  <span className="text-2xl">🚚</span>
                  <span className="text-gray-900 font-semibold">
                    FAST SHIPPING
                  </span>
                </div>

                {/* Enquiry Buttons */}
                <div className="flex gap-3 mt-8">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Enquiry button clicked");
                      setShowEnquiryModal(true);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition cursor-pointer border-0">
                    <MdOutlineEmail size={24} /> ENQUIRE NOW
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const phoneNumber = "971503079863";
                      const message = `Hi, I'm interested in: ${content?.data && 'name_en' in content.data ? (content.data as ProductWithRelations).name_en : 'Your Product'}`;
                      window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition cursor-pointer border-0">
                    <RiWhatsappFill size={24} /> WHATSAPP NOW
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Description Section - Outside max-w container */}
          <div className="border-t bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              {/* Description */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Description
                </h2>
                <div
                  className="text-gray-700 leading-relaxed [&_p]:mb-3"
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(product.description_en || ''),
                  }}
                />
              </div>

              {/* Specifications Sidebar */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Specifications
                    </h2>
                    <dl className="space-y-4">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="border-b pb-4">
                            <dt className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                              {key}
                            </dt>
                            <dd className="text-gray-700 mt-2">
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                            </dd>
                          </div>
                        )
                      )}
                    </dl>
                  </div>
                )}
            </div>
          </div>
        </main>
        <Footer />
        <EnquiryModal />
      </>
    );
  }

  // Brand page
  if (content.type === "brand") {
    const brand = content.data as Brand;
    return (
      <>
        {/* Breadcrumb */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              {" › "}
              <span className="text-gray-900 font-semibold">
                {brand.name_en}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gray-50 py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {brand.name_en}
              </h1>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1 bg-red-600"></div>
              </div>
              {brand.country_en && (
                <p className="text-lg text-gray-600 mb-2">
                  📍 {brand.country_en}
                </p>
              )}
              <p className="text-gray-600">Explore our premium collection</p>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Popular Products by Type */}
            {brandSubcategories.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                  Popular Products by Type
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {brandSubcategories
                    .slice(
                      0,
                      showAllBrandSubcategories
                        ? brandSubcategories.length
                        : initialBrandSubcategoriesShow
                    )
                    .map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/${brand.slug}-${subcategory.slug}`}
                        className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:shadow-md hover:border-blue-500"
                      >
                        {/* Brand Image */}
                        {brand.image_path && (
                          <div className="mb-3 flex items-center justify-center h-16">
                            <Image
                              src={brand.image_path}
                              alt={brand.name_en}
                              className="h-full w-auto object-contain"
                              width={64}
                              height={64}
                            />
                          </div>
                        )}
                        <span className="font-semibold text-gray-900">
                          {brand.name_en} {subcategory.name_en}
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          ({subcategory.productCount}{" "}
                          {subcategory.productCount === 1
                            ? "product"
                            : "products"}
                          )
                        </span>
                      </Link>
                    ))}
                </div>

                {/* View More / Show Less Button */}
                {brandSubcategories.length > initialBrandSubcategoriesShow && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() =>
                        setShowAllBrandSubcategories(!showAllBrandSubcategories)
                      }
                      className="inline-block rounded-lg bg-red-600 text-white px-6 py-2 font-medium hover:bg-red-700 transition-colors"
                    >
                      {showAllBrandSubcategories
                        ? `Show Less (${initialBrandSubcategoriesShow} of ${brandSubcategories.length})`
                        : `View More (${
                            brandSubcategories.length -
                            initialBrandSubcategoriesShow
                          } more)`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {brandProductsLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : brandProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                  {brandProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale="en"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {Math.ceil(brandProductsTotal / brandProductsLimit) > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setBrandProductsPage(Math.max(1, brandProductsPage - 1))
                      }
                      disabled={brandProductsPage === 1}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      {
                        length: Math.ceil(
                          brandProductsTotal / brandProductsLimit
                        ),
                      },
                      (_, i) => i + 1
                    )
                      .filter((p) => {
                        const totalPages = Math.ceil(
                          brandProductsTotal / brandProductsLimit
                        );
                        return (
                          p === 1 ||
                          p === totalPages ||
                          (p >= brandProductsPage - 1 &&
                            p <= brandProductsPage + 1)
                        );
                      })
                      .map((p, idx, arr) => (
                        <div key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setBrandProductsPage(p)}
                            className={`px-4 py-2 rounded border ${
                              brandProductsPage === p
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      ))}

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setBrandProductsPage(
                          Math.min(
                            Math.ceil(brandProductsTotal / brandProductsLimit),
                            brandProductsPage + 1
                          )
                        )
                      }
                      disabled={
                        brandProductsPage ===
                        Math.ceil(brandProductsTotal / brandProductsLimit)
                      }
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">
                  No products found from this brand.
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Category page
  if (content.type === "category") {
    const category = content.data as Category;

    return (
      <>
        {/* Breadcrumb */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              {" › "}
              <Link href="/products" className="hover:text-gray-900">
                Products
              </Link>
              {" › "}
              <span className="text-gray-900 font-semibold">
                {category.name_en}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gray-50 py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {category.name_en}
              </h1>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1 bg-red-600"></div>
              </div>
              <p className="text-lg text-gray-600">
                {categoryProductsTotal} products available
              </p>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Subcategories Filter */}
            {categorySubcategories.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Filter by Subcategory
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/${(content.data as Category).slug}`}
                    className={`rounded-full px-4 py-2 font-medium transition-colors ${
                      slugPath === (content.data as Category).slug
                        ? "bg-red-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All
                  </Link>
                  {categorySubcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/${subcategory.slug}`}
                      className={`rounded-full px-4 py-2 font-medium transition-colors ${
                        slugPath === subcategory.slug
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {subcategory.name_en}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {categoryProductsLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : categoryProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale="en"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {Math.ceil(categoryProductsTotal / categoryProductsLimit) >
                  1 && (
                  <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setCategoryProductsPage(
                          Math.max(1, categoryProductsPage - 1)
                        )
                      }
                      disabled={categoryProductsPage === 1}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      {
                        length: Math.ceil(
                          categoryProductsTotal / categoryProductsLimit
                        ),
                      },
                      (_, i) => i + 1
                    )
                      .filter((p) => {
                        const totalPages = Math.ceil(
                          categoryProductsTotal / categoryProductsLimit
                        );
                        return (
                          p === 1 ||
                          p === totalPages ||
                          (p >= categoryProductsPage - 1 &&
                            p <= categoryProductsPage + 1)
                        );
                      })
                      .map((p, idx, arr) => (
                        <div key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setCategoryProductsPage(p)}
                            className={`px-4 py-2 rounded border ${
                              categoryProductsPage === p
                                ? "bg-red-600 text-white border-red-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      ))}

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setCategoryProductsPage(
                          Math.min(
                            Math.ceil(
                              categoryProductsTotal / categoryProductsLimit
                            ),
                            categoryProductsPage + 1
                          )
                        )
                      }
                      disabled={
                        categoryProductsPage ===
                        Math.ceil(categoryProductsTotal / categoryProductsLimit)
                      }
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Subcategory page
  if (content.type === "subcategory") {
    const subcategory = content.data as SubcategoryWithRelations;

    return (
      <>
        {/* Breadcrumb */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              {" › "}
              <Link href="/products" className="hover:text-gray-900">
                Products
              </Link>
              {subcategory.category && (
                <>
                  {" › "}
                  <Link
                    href={`/${subcategory.category.slug}`}
                    className="hover:text-gray-900"
                  >
                    {subcategory.category.name_en}
                  </Link>
                </>
              )}
              {" › "}
              <span className="text-gray-900 font-semibold">
                {subcategory.name_en}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gray-50 py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {subcategory.name_en}
              </h1>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1 bg-red-600"></div>
              </div>
              <p className="text-lg text-gray-600">
                {subcategoryProductsTotal} products available
              </p>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : subcategoryProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                  {subcategoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale="en"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {Math.ceil(
                  subcategoryProductsTotal / subcategoryProductsLimit
                ) > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setSubcategoryProductsPage(
                          Math.max(1, subcategoryProductsPage - 1)
                        )
                      }
                      disabled={subcategoryProductsPage === 1}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      {
                        length: Math.ceil(
                          subcategoryProductsTotal / subcategoryProductsLimit
                        ),
                      },
                      (_, i) => i + 1
                    )
                      .filter((p) => {
                        const totalPages = Math.ceil(
                          subcategoryProductsTotal / subcategoryProductsLimit
                        );
                        return (
                          p === 1 ||
                          p === totalPages ||
                          (p >= subcategoryProductsPage - 1 &&
                            p <= subcategoryProductsPage + 1)
                        );
                      })
                      .map((p, idx, arr) => (
                        <div key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setSubcategoryProductsPage(p)}
                            className={`px-4 py-2 rounded border ${
                              subcategoryProductsPage === p
                                ? "bg-blue-500 text-white border-blue-500"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      ))}

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setSubcategoryProductsPage(
                          Math.min(
                            Math.ceil(
                              subcategoryProductsTotal /
                                subcategoryProductsLimit
                            ),
                            subcategoryProductsPage + 1
                          )
                        )
                      }
                      disabled={
                        subcategoryProductsPage ===
                        Math.ceil(
                          subcategoryProductsTotal / subcategoryProductsLimit
                        )
                      }
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Brand + Subcategory page
  if (
    content.type === "brand-subcategory" &&
    content.brand &&
    content.subcategory &&
    content.products
  ) {
    return (
      <>
        {/* Breadcrumb Header */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              {" › "}
              <Link
                href={`/${content.brand.slug}`}
                className="hover:text-gray-900"
              >
                {content.brand.name_en}
              </Link>
              {" › "}
              <span className="text-gray-900 font-semibold">
                {content.subcategory.name_en}
              </span>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-white">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8 py-12">
            {" "}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900">
                {content.brand.name_en} {content.subcategory.name_en}
              </h1>
              <p className="text-gray-600 mt-4">
                {brandSubcategoryProductsTotal} products available
              </p>
            </div>
            {brandSubcategoryProductsLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : brandSubcategoryProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                  {brandSubcategoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale="en"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {Math.ceil(
                  brandSubcategoryProductsTotal / brandSubcategoryProductsLimit
                ) > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setBrandSubcategoryProductsPage(
                          Math.max(1, brandSubcategoryProductsPage - 1)
                        )
                      }
                      disabled={brandSubcategoryProductsPage === 1}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      {
                        length: Math.ceil(
                          brandSubcategoryProductsTotal /
                            brandSubcategoryProductsLimit
                        ),
                      },
                      (_, i) => i + 1
                    )
                      .filter((p) => {
                        const totalPages = Math.ceil(
                          brandSubcategoryProductsTotal /
                            brandSubcategoryProductsLimit
                        );
                        return (
                          p === 1 ||
                          p === totalPages ||
                          (p >= brandSubcategoryProductsPage - 1 &&
                            p <= brandSubcategoryProductsPage + 1)
                        );
                      })
                      .map((p, idx, arr) => (
                        <div key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setBrandSubcategoryProductsPage(p)}
                            className={`px-4 py-2 rounded border ${
                              brandSubcategoryProductsPage === p
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      ))}

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setBrandSubcategoryProductsPage(
                          Math.min(
                            Math.ceil(
                              brandSubcategoryProductsTotal /
                                brandSubcategoryProductsLimit
                            ),
                            brandSubcategoryProductsPage + 1
                          )
                        )
                      }
                      disabled={
                        brandSubcategoryProductsPage ===
                        Math.ceil(
                          brandSubcategoryProductsTotal /
                            brandSubcategoryProductsLimit
                        )
                      }
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">
                  No products found for this brand and subcategory.
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
        <EnquiryModal />
      </>
    );
  }

  return null;
}