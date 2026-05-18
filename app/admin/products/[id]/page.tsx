"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import FormField from "@/components/admin/FormField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { getProductImageUrl } from "@/lib/utils";
import { Product, Brand, Category, Subcategory } from "@/lib/types";

function ProductFormComponent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productImages, setProductImages] = useState<Array<{ filename: string; order: number }>>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    brand_id: 0,
    category_id: 0,
    subcategory_id: 0,
    name_en: "",
    name_ar: "",
    slug: "",
    description_en: "",
    description_ar: "",
    active: true,
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);

  const fetchRelations = useCallback(async () => {
    try {
      const [brandsRes, catsRes, subcatsRes] = await Promise.all([
        fetch("/api/admin/brands"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/subcategories"),
      ]);

      const brandsData = await brandsRes.json();
      const catsData = await catsRes.json();
      const subcatsData = await subcatsRes.json();

      setBrands(brandsData.brands || []);
      setCategories(catsData.categories || []);
      setSubcategories(subcatsData.subcategories || []);
    } catch (error) {
      console.error("Failed to fetch relations:", error);
    }
  }, []);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const data = await res.json();
      
      if (data.error) {
        console.error('API Error:', data.error);
        return;
      }
      
      const product = data.product;
      setFormData(product);
      setSlugManuallyEdited(false); // Reset slug editing state when loading product
      
      // Load all product images
      if (product?.images && Array.isArray(product.images)) {
        setProductImages(product.images);
        
        // Set images from database
        if (product.images.length > 0) {
          setProductImages(product.images);
        }
      } else {
        setProductImages([]);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchRelations();
    if (id) {
      fetchProduct();
    }
  }, [id, fetchRelations, fetchProduct]);

  // Filter subcategories when category or subcategory list changes — never auto-reset subcategory_id
  useEffect(() => {
    if (formData.category_id && formData.category_id > 0) {
      setFilteredSubcategories(
        subcategories.filter((sub) => sub.category_id === formData.category_id)
      );
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.category_id, subcategories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? !prev[name as keyof Product]
          : ["brand_id", "category_id", "subcategory_id"].includes(name)
          ? parseInt(value)
          : value,
      // Reset subcategory when user explicitly changes category
      ...(name === "category_id" ? { subcategory_id: 0 } : {}),
    }));

    // Auto-generate slug from English name if not manually edited
    if (name === "name_en" && !slugManuallyEdited) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen

      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }

    // Track if slug was manually edited
    if (name === "slug") {
      setSlugManuallyEdited(true);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!id) {
      setImageUploadError('Product ID is not available');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageUploadError('Only JPG, PNG, GIF, and WebP files are allowed');
      return;
    }

    setUploadingImage(true);
    setImageUploadError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      console.log('Uploading file:', file.name, file.type, file.size);
      
      const res = await fetch(`/api/admin/products/${id}/images`, {
        method: 'POST',
        body: formDataToSend,
      });

      const responseData = await res.json();
      console.log('Upload response:', responseData);

      if (!res.ok) {
        setImageUploadError(responseData.error || 'Failed to upload image');
        return;
      }

      setProductImages(responseData.images || []);
      setImageUploadError(null);

      // Reset file input
      e.target.value = '';
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      console.error('Upload error:', errorMsg);
      setImageUploadError(errorMsg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await fetch(`/api/admin/products/${id}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });

      if (!res.ok) {
        const error = await res.json();
        setImageUploadError(error.error || 'Failed to delete image');
        return;
      }

      const data = await res.json();
      setProductImages(data.images || []);
    } catch (error) {
      setImageUploadError(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const url = id ? `/api/admin/products/${id}` : "/api/admin/products";
      const method = id ? "PUT" : "POST";

      // Auto-generate slug if empty
      const dataToSubmit = {
        ...formData,
        slug: formData.slug?.trim() || (formData.name_en || "")
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (!res.ok) {
        const error = await res.json();
        setErrors({ form: error.error });
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "An error occurred";
      setErrors({ form: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? "Edit Product" : "Create Product"}
        </h1>

        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            <FormField
              label="Brand"
              name="brand_id"
              type="select"
              value={String(formData.brand_id || "")}
              onChange={handleChange}
              options={brands.map((b) => ({
                value: String(b.id),
                label: b.name_en,
              }))}
              required
            />

            <FormField
              label="Category"
              name="category_id"
              type="select"
              value={String(formData.category_id || "")}
              onChange={handleChange}
              options={categories.map((c) => ({
                value: String(c.id),
                label: c.name_en,
              }))}
              required
            />

            <FormField
              label="Subcategory"
              name="subcategory_id"
              type="select"
              value={String(formData.subcategory_id || "")}
              onChange={handleChange}
              options={filteredSubcategories.map((s) => ({
                value: String(s.id),
                label: s.name_en,
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              label="English Name"
              name="name_en"
              value={formData.name_en || ""}
              onChange={handleChange}
              placeholder="Enter English name"
              required
            />

            <FormField
              label="Arabic Name"
              name="name_ar"
              value={formData.name_ar || ""}
              onChange={handleChange}
              placeholder="أدخل الاسم بالعربية"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
              <span className="text-xs font-normal text-gray-500 ml-2">
                (auto-generated from English Name)
              </span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug || ""}
              onChange={handleChange}
              placeholder="e.g., vulcan-6-burner-range"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {slugManuallyEdited && (
              <button
                type="button"
                onClick={() => {
                  const autoSlug = (formData.name_en || "")
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-");
                  setFormData((prev) => ({
                    ...prev,
                    slug: autoSlug,
                  }));
                  setSlugManuallyEdited(false);
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                ↻ Reset to auto-generated
              </button>
            )}
          </div>

          <FormField
            label="Product Number (Model)"
            name="model"
            value={formData.model || ""}
            onChange={handleChange}
            placeholder="e.g., VL-6B-2025"
            required
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            
            {imageUploadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {imageUploadError}
              </div>
            )}

            {/* Image Gallery */}
            {productImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Current Images ({productImages.length})
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {productImages.map((img) => (
                    <div
                      key={img.filename}
                      className="relative group rounded border border-gray-200 overflow-hidden bg-gray-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getProductImageUrl(formData.id as number, img.filename)}
                        alt={img.filename}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.filename)}
                          disabled={uploadingImage}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:bg-gray-400"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-sm px-3 py-2 font-medium">
                        Order: {img.order}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition ${id ? 'border-gray-300 hover:border-blue-500' : 'border-gray-200 bg-gray-50'}`}>
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .gif, .webp"
                onChange={handleImageUpload}
                disabled={uploadingImage || !id}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={id && !uploadingImage ? 'cursor-pointer' : 'cursor-not-allowed'}
              >
                {!id ? (
                  <>
                    <p className="text-gray-600">Save product first to upload images</p>
                  </>
                ) : uploadingImage ? (
                  <>
                    <p className="text-gray-600">Uploading...</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 font-medium">Click to upload or drag image</p>
                    <p className="text-sm text-gray-500 mt-1">Supported formats: JPG, PNG, GIF, WebP (will be converted to WebP)</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (English)
              </label>
              <RichTextEditor
                value={formData.description_en || ""}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description_en: value }))
                }
                placeholder="Enter English description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Arabic)
              </label>
              <RichTextEditor
                value={formData.description_ar || ""}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description_ar: value }))
                }
                placeholder="أدخل الوصف بالعربية"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={formData.active || false}
              onChange={handleChange}
              className="h-4 w-4 rounded"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-6 rounded transition"
            >
              {isLoading ? "Saving..." : "Save Product"}
            </button>
            <Link
              href="/admin/products"
              className="bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 px-6 rounded transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return <ProductFormComponent />;
}
