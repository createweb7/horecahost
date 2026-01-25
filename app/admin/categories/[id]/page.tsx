"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import FormField from "@/components/admin/FormField";
import { Category } from "@/lib/types";

function CategoryForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<Category>>({
    name_en: "",
    name_ar: "",
    slug: "",
    active: true,
  });

  const fetchCategory = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`);
      const data = await res.json();
      setFormData(data.category);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Failed to fetch category";
      console.error(errMsg);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id, fetchCategory]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? !prev[name as keyof Category] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const url = id ? `/api/admin/categories/${id}` : "/api/admin/categories";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        setErrors({ form: error.error });
        return;
      }

      router.push("/admin/categories");
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
        <Link href="/admin/categories" className="text-blue-600 hover:underline">
          ← Back to Categories
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? "Edit Category" : "Create Category"}
        </h1>

        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <FormField
              label="English Name"
              name="name_en"
              value={formData.name_en || ""}
              onChange={handleChange}
              placeholder="Enter English name"
              required
              error={errors.name_en}
            />

            <FormField
              label="Arabic Name"
              name="name_ar"
              value={formData.name_ar || ""}
              onChange={handleChange}
              placeholder="أدخل الاسم بالعربية"
              required
              error={errors.name_ar}
            />
          </div>

          <FormField
            label="Slug"
            name="slug"
            value={formData.slug || ""}
            onChange={handleChange}
            placeholder="e.g., kitchen-equipment"
            required
            error={errors.slug}
          />

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
              {isLoading ? "Saving..." : "Save Category"}
            </button>
            <Link
              href="/admin/categories"
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

export default function CategoryPage() {
  return <CategoryForm />;
}
