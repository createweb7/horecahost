"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      setCategories(categories.filter((c) => c.id !== category.id));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        >
          + Add Category
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable<Category>
          columns={[
            { key: "name_en", label: "English Name" },
            { key: "name_ar", label: "Arabic Name" },
            { key: "slug", label: "Slug" },
            {
              key: "active",
              label: "Status",
              render: (value) => (value ? "✓ Active" : "✗ Inactive"),
            },
          ]}
          data={categories}
          loading={loading}
          onEdit={() => {}}
          onDelete={handleDelete}
          editHref={(item) => `/admin/categories/${item.id}`}
        />
      </div>
    </div>
  );
}
