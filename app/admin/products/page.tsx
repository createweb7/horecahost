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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

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

      <div className="bg-white rounded-lg shadow">
        <DataTable<ProductRow>
          columns={[
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
          data={products}
          loading={loading}
          onEdit={() => {}}
          onDelete={handleDelete}
          editHref={(item) => `/admin/products/${item.id}`}
        />
      </div>
    </div>
  );
}
