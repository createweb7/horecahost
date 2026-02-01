"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchQuery]);

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

  const filterCategories = () => {
    const query = searchQuery.toLowerCase().trim();
    
    const filtered = categories.filter((category) => {
      const idMatch = category.id.toString().includes(query);
      const nameEnMatch = category.name_en.toLowerCase().includes(query);
      const nameArMatch = category.name_ar.toLowerCase().includes(query);
      const slugMatch = category.slug.toLowerCase().includes(query);

      return idMatch || nameEnMatch || nameArMatch || slugMatch;
    });

    setFilteredCategories(filtered);
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

      {/* Search Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Categories
            </label>
            <input
              type="text"
              placeholder="Search by name, slug, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <button
              onClick={() => setSearchQuery("")}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 px-4 rounded transition"
            >
              Clear Search
            </button>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable<Category>
          columns={[
            { key: "id", label: "ID" },
            { key: "name_en", label: "English Name" },
            { key: "name_ar", label: "Arabic Name" },
            { key: "slug", label: "Slug" },
            {
              key: "active",
              label: "Status",
              render: (value) => (value ? "✓ Active" : "✗ Inactive"),
            },
          ]}
          data={filteredCategories}
          loading={loading}
          onEdit={() => {}}
          onDelete={handleDelete}
          editHref={(item) => `/admin/categories/${item.id}`}
        />
      </div>
    </div>
  );
}
