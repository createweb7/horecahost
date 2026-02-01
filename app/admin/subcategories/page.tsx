"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { SubcategoryWithRelations } from "@/lib/types";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<SubcategoryWithRelations[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<SubcategoryWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubcategories();
  }, []);

  useEffect(() => {
    filterSubcategories();
  }, [subcategories, searchQuery]);

  const fetchSubcategories = async () => {
    try {
      const res = await fetch("/api/admin/subcategories");
      const data = await res.json();
      setSubcategories(data.subcategories || []);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubcategories = () => {
    const query = searchQuery.toLowerCase().trim();
    
    const filtered = subcategories.filter((subcategory) => {
      const idMatch = subcategory.id.toString().includes(query);
      const nameEnMatch = subcategory.name_en.toLowerCase().includes(query);
      const nameArMatch = subcategory.name_ar.toLowerCase().includes(query);
      const categoryMatch = subcategory.category?.name_en.toLowerCase().includes(query);

      return idMatch || nameEnMatch || nameArMatch || (categoryMatch ?? false);
    });

    setFilteredSubcategories(filtered);
  };

  const handleDelete = async (subcategory: SubcategoryWithRelations) => {
    try {
      await fetch(`/api/admin/subcategories/${subcategory.id}`, {
        method: "DELETE",
      });
      setSubcategories(
        subcategories.filter((s) => s.id !== subcategory.id)
      );
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
        <Link
          href="/admin/subcategories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        >
          + Add Subcategory
        </Link>
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Subcategories
            </label>
            <input
              type="text"
              placeholder="Search by name, category, or ID..."
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
          Showing {filteredSubcategories.length} of {subcategories.length} subcategories
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable<SubcategoryWithRelations>
          columns={[
            { key: "id", label: "ID" },
            {
              key: "category_id",
              label: "Category",
              render: (value, item) => item.category?.name_en || "-",
            },
            { key: "name_en", label: "English Name" },
            { key: "name_ar", label: "Arabic Name" },
            {
              key: "active",
              label: "Status",
              render: (value) => (value ? "✓ Active" : "✗ Inactive"),
            },
          ]}
          data={filteredSubcategories}
          loading={loading}
          onEdit={() => {}}
          onDelete={handleDelete}
          editHref={(item) => `/admin/subcategories/${item.id}`}
        />
      </div>
    </div>
  );
}
