"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { SubcategoryWithRelations } from "@/lib/types";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<SubcategoryWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubcategories();
  }, []);

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

      <div className="bg-white rounded-lg shadow">
        <DataTable<SubcategoryWithRelations>
          columns={[
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
          data={subcategories}
          loading={loading}
          onEdit={() => {}}
          onDelete={handleDelete}
          editHref={(item) => `/admin/subcategories/${item.id}`}
        />
      </div>
    </div>
  );
}
