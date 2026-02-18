"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { Brand } from "@/lib/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    filterBrands();
  }, [brands, searchQuery]);

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

  const filterBrands = () => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = brands.filter((brand) => {
      const idMatch = brand.id.toString().includes(query);
      const nameEnMatch = brand.name_en.toLowerCase().includes(query);
      const nameArMatch = brand.name_ar.toLowerCase().includes(query);
      const countryMatch =
        brand.country_en?.toLowerCase().includes(query) ?? false;

      return idMatch || nameEnMatch || nameArMatch || countryMatch;
    });

    setFilteredBrands(filtered);
  };

  const handleDelete = async (brand: Brand) => {
    if (!window.confirm(`Are you sure you want to delete ${brand.name_en}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/brands/${brand.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Delete failed: ${errorData.error || "Unknown error"}`);
        return;
      }

      setBrands(brands.filter((b) => b.id !== brand.id));
      alert(`${brand.name_en} deleted successfully!`);
      // Refetch to ensure sync
      await fetchBrands();
    } catch (error) {
      console.error("Failed to delete brand:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Failed to delete"}`,
      );
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

      {/* Search Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Brands
            </label>
            <input
              type="text"
              placeholder="Search by name, country, or ID..."
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
          Showing {filteredBrands.length} of {brands.length} brands
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable<Brand>
          columns={[
            { key: "id", label: "ID" },
            { key: "name_en", label: "English Name" },
            { key: "name_ar", label: "Arabic Name" },
            { key: "country_en", label: "Country" },
            {
              key: "active",
              label: "Status",
              render: (value) => (value ? "✓ Active" : "✗ Inactive"),
            },
          ]}
          data={filteredBrands}
          loading={loading}
          onEdit={() => {}}
          onDelete={handleDelete}
          editHref={(item) => `/admin/brands/${item.id}`}
        />
      </div>
    </div>
  );
}
