'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface Metadata {
  id: number;
  product_id: number;
  country_code: string;
  language: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

const COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
];

export default function SEOMetadataPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('AE');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name_en, name_ar, slug')
        .order('id', { ascending: false })
        .limit(500);

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
    };

    fetchProducts();
  }, []);

  // Fetch metadata when product/country/language changes
  useEffect(() => {
    if (!selectedProduct) return;

    const fetchMetadata = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_metadata_locations')
        .select('*')
        .eq('product_id', selectedProduct.id)
        .eq('country_code', selectedCountry)
        .eq('language', selectedLanguage)
        .single();

      if (error) {
        console.log('No metadata found, showing empty form');
        setMetadata(null);
        setFormData({
          meta_title: '',
          meta_description: '',
          meta_keywords: '',
        });
      } else {
        setMetadata(data);
        setFormData({
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
        });
      }
      setLoading(false);
    };

    fetchMetadata();
  }, [selectedProduct, selectedCountry, selectedLanguage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedProduct) return;

    setSaving(true);
    setMessage('');

    try {
      const payload = {
        product_id: selectedProduct.id,
        country_code: selectedCountry,
        language: selectedLanguage,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
      };

      const { error } = await supabase
        .from('product_metadata_locations')
        .upsert(payload, {
          onConflict: 'product_id,country_code,language',
        });

      if (error) throw error;

      setMessage('✅ Metadata saved successfully!');
      setTimeout(() => setMessage(''), 3000);

      // Refresh metadata
      const { data } = await supabase
        .from('product_metadata_locations')
        .select('*')
        .eq('product_id', selectedProduct.id)
        .eq('country_code', selectedCountry)
        .eq('language', selectedLanguage)
        .single();

      if (data) setMetadata(data);
    } catch (error) {
      console.error('Error saving:', error);
      setMessage('❌ Error saving metadata');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name_ar.includes(searchTerm) ||
    p.slug.includes(searchTerm.toLowerCase())
  );

  const languageLabel = selectedLanguage === 'en' ? 'English' : 'العربية (Arabic)';

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SEO Metadata Manager</h1>
          <p className="text-gray-600 mt-2">Edit SEO title, description, and keywords for each product and country</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Search */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Product</h2>

                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-4"
                />

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4">No products found</p>
                  ) : (
                    filteredProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                          selectedProduct?.id === product.id
                            ? 'bg-blue-100 text-blue-900 font-semibold'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium truncate">{product.name_en}</div>
                        <div className="text-xs text-gray-500 truncate">ID: {product.id}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Editor */}
          <div className="lg:col-span-2">
            {!selectedProduct ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Select a product to edit its SEO metadata</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedProduct.name_en}
                  </h2>

                  {/* Country & Language Selectors */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        {COUNTRIES.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.name} ({country.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية (Arabic)</option>
                      </select>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {metadata ? (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">✅ Metadata exists for {selectedCountry} ({languageLabel})</p>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">📝 New metadata - will be created when saved</p>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="p-6 text-center text-gray-500">Loading...</div>
                ) : (
                  <div className="p-6 space-y-6">
                    {/* Meta Title */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                        <span className={`text-xs ${formData.meta_title.length > 255 ? 'text-red-600' : formData.meta_title.length > 60 ? 'text-orange-600' : 'text-green-600'}`}>
                          {formData.meta_title.length}/255
                        </span>
                      </div>
                      <input
                        type="text"
                        name="meta_title"
                        value={formData.meta_title}
                        onChange={handleInputChange}
                        placeholder="e.g., Hot/Cold Shelves - Best Cooking Ranges in Dubai | Hatco"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Recommended: 50-60 characters</p>
                    </div>

                    {/* Meta Description */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                        <span className={`text-xs ${formData.meta_description.length > 160 ? 'text-orange-600' : 'text-green-600'}`}>
                          {formData.meta_description.length}/160
                        </span>
                      </div>
                      <textarea
                        name="meta_description"
                        value={formData.meta_description}
                        onChange={handleInputChange}
                        placeholder="e.g., Discover premium Hot/Cold Shelves by Hatco in Dubai. Perfect for professional kitchens and restaurants."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Recommended: 150-160 characters</p>
                    </div>

                    {/* Meta Keywords */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                      <textarea
                        name="meta_keywords"
                        value={formData.meta_keywords}
                        onChange={handleInputChange}
                        placeholder="e.g., Hot/Cold Shelves, Cooking Ranges, Hatco, Dubai, restaurant equipment"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Comma-separated keywords (5-8 recommended)</p>
                    </div>

                    {/* Message */}
                    {message && (
                      <div className={`p-3 rounded-md text-sm ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {message}
                      </div>
                    )}

                    {/* Save Button */}
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {saving ? 'Saving...' : '💾 Save Metadata'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
