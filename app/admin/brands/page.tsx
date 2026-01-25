"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { Brand } from "@/lib/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (brand: Brand) => {
    try {
      await fetch(`/api/admin/brands/${brand.id}`, {
        method: "DELETE",
      });
      setBrands(brands.filter((b) => b.id !== brand.id));
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
        <Link
          href="/admin/brands/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        >
          + Add Brand
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable<Brand>
          columns={[
            { key: "name_en", label: "English Name" },
            { key: "name_ar", label: "Arabic Name" },
            { key: "country_en", label: "Country" },
            {
              key: "active",
              label: "Status",
              render: (value) => (value ? "✓ Active" : "✗ Inactive"),
            },
          ]}
          data={brands}
          loading={loading}
          onEdit={() => {}}
          onDelete={handleDelete}
          editHref={(item) => `/admin/brands/${item.id}`}
        />
      </div>
    </div>
  );
}
