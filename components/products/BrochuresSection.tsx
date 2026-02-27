"use client";

import { useState, useEffect } from "react";

interface Brochure {
  id: number;
  product_id: number;
  filename: string;
  file_path: string;
  is_main: boolean;
  active: boolean;
}

interface BrochuresSectionProps {
  productId: number;
  productName: string;
}

export default function BrochuresSection({
  productId,
  productName,
}: BrochuresSectionProps) {
  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrochures = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching brochures for product:", productId);
        const res = await fetch("/api/brochures", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: productId }),
        });

        console.log("API Response status:", res.status, res.statusText);

        if (!res.ok) {
          const errorData = await res.text();
          console.error("API Error Response:", errorData);
          throw new Error(`API returned ${res.status}: ${errorData}`);
        }

        const data = await res.json();
        console.log("Brochures received:", data);
        setBrochures(data.brochures || []);
      } catch (err) {
        console.error("Error fetching brochures:", err);
        setError("Unable to load brochures");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchBrochures();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-600 text-sm font-medium">
          📄 Loading brochures...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!brochures || brochures.length === 0) {
    return (
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-sm">No brochures available</p>
      </div>
    );
  }

  const handleOpenBrochure = (filePath: string) => {
    const fullPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    console.log("Opening:", fullPath);
    window.open(fullPath, "_blank");
  };

  const handleDownloadBrochure = (filePath: string, filename: string) => {
    const fullPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    const link = document.createElement("a");
    link.href = fullPath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
        <svg
          className="w-8 h-8 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M4 4a2 2 0 012-2h6a1 1 0 00-1-1h-6a3 3 0 00-3 3v10a3 3 0 003 3h6a1 1 0 001-1V4z" />
          <path d="M10 12a1 1 0 100-2 1 1 0 000 2z" />
          <path d="M10 5a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
        <span>Brochures & Documents</span>
        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold ml-auto">
          {brochures.length} available
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {brochures.map((brochure) => (
          <div
            key={brochure.id}
            className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:shadow-lg hover:border-blue-400 transition-all hover:scale-105"
          >
            {/* Left: Icon and Content */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 012-2h6a1 1 0 00-1-1h-6a3 3 0 00-3 3v10a3 3 0 003 3h6a1 1 0 001-1V4z" />
                  <path d="M10 12a1 1 0 100-2 1 1 0 000 2z" />
                  <path d="M10 5a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {brochure.filename.replace(/\.[^.]+$/, "")}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {brochure.is_main ? (
                    <span className="inline-flex items-center gap-1">
                      <span>⭐</span>
                      <span>Featured Document</span>
                    </span>
                  ) : (
                    "Document"
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleOpenBrochure(brochure.file_path)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-sm"
                title="View Brochure"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                View
              </button>
              <button
                onClick={() =>
                  handleDownloadBrochure(brochure.file_path, brochure.filename)
                }
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-sm"
                title="Download Brochure"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
