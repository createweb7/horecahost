"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import FormField from "@/components/admin/FormField";
import { SubcategoryWithRelations, Category } from "@/lib/types";

function SubcategoryFormComponent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<SubcategoryWithRelations>>({
    category_id: 0,
    name_en: "",
    name_ar: "",
    slug: "",
    active: true,
  });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchSubcategory = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/subcategories/${id}`);
      const data = await res.json();
      setFormData(data.subcategory);
    } catch (error) {
      console.error("Failed to fetch subcategory:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchSubcategory();
    }
  }, [id, fetchCategories, fetchSubcategory]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? !prev[name as keyof SubcategoryWithRelations]
          : name === "category_id"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const url = id
        ? `/api/admin/subcategories/${id}`
        : "/api/admin/subcategories";
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

      router.push("/admin/subcategories");
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
        <Link
          href="/admin/subcategories"
          className="text-blue-600 hover:underline"
        >
          ← Back to Subcategories
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? "Edit Subcategory" : "Create Subcategory"}
        </h1>

        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {errors.form}
            </div>
          )}

          <FormField
            label="Category"
            name="category_id"
            type="select"
            value={formData.category_id || ""}
            onChange={handleChange}
            options={categories.map((c) => ({
              value: c.id,
              label: c.name_en,
            }))}
            required
          />

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

          <FormField
            label="Slug"
            name="slug"
            value={formData.slug || ""}
            onChange={handleChange}
            placeholder="e.g., baking-ovens"
            required
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
              {isLoading ? "Saving..." : "Save Subcategory"}
            </button>
            <Link
              href="/admin/subcategories"
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

export default function SubcategoryPage() {
  return <SubcategoryFormComponent />;
}
