"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

interface ProductRow {
  id: number;
  name_en: string;
  name_ar: string;
  brands: { name_en: string } | null;
  categories: { name_en: string } | null;
  active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    const query = searchQuery.toLowerCase().trim();
    
    const filtered = products.filter((product) => {
      // Search by product ID, name, category, or brand
      const idMatch = product.id.toString().includes(query);
      const nameMatch = product.name_en.toLowerCase().includes(query);
      const categoryMatch = product.categories?.name_en.toLowerCase().includes(query);
      const brandMatch = product.brands?.name_en.toLowerCase().includes(query);

      return idMatch || nameMatch || categoryMatch || brandMatch;
    });

    setFilteredProducts(filtered);
  };

  const handleDelete = async (product: ProductRow) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      setProducts(products.filter((p) => p.id !== product.id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        >
          + Add Product
        </Link>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <input
              type="text"
              placeholder="Search by product name, ID, category, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <button
              onClick={() => {
                setSearchQuery("");
              }}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 px-4 rounded transition"
            >
              Clear Search
            </button>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable<ProductRow>
          columns={[
            { key: "id", label: "ID" },
            { key: "name_en", label: "English Name" },
            {
              key: "brands",
              label: "Brand",
              render: (value) => {
                const brand = value as ProductRow["brands"];
                return brand?.name_en || "-";
              },
            },
            {
              key: "categories",
              label: "Category",
              render: (value) => {
                const category = value as ProductRow["categories"];
                return category?.name_en || "-";
              },
            },
            {
              key: "active",
              label: "Status",
              render: (value) => (value ? "✓ Active" : "✗ Inactive"),
            },
          ]}
          data={filteredProducts}
          loading={loading}
          onEdit={() => {}}
          onDelete={handleDelete}
          editHref={(item) => `/admin/products/${item.id}`}
        />
      </div>
    </div>
  );
}
