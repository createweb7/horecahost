'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface Brand {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface Subcategory {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface Metadata {
  id: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

const COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MV', name: 'Maldives' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
];

export default function SEOMetadataPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'brands' | 'categories' | 'subcategories'>('products');
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Brands state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Subcategories state
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

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
    h1_tag: '',
    h2_tag: '',
    paragraph_text: '',
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

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name_en, name_ar, slug')
        .order('id', { ascending: false })
        .limit(500);

      if (error) {
        console.error('Error fetching brands:', error);
      } else {
        setBrands(data || []);
      }
    };

    fetchBrands();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name_en, name_ar, slug')
        .order('id', { ascending: false })
        .limit(500);

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name_en, name_ar, slug')
        .order('id', { ascending: false })
        .limit(500);

      if (error) {
        console.error('Error fetching subcategories:', error);
      } else {
        setSubcategories(data || []);
      }
    };

    fetchSubcategories();
  }, []);

  // Fetch metadata when selection changes
  useEffect(() => {
    let entityId: number | null = null;
    let table: string = '';

    if (activeTab === 'products' && selectedProduct) {
      entityId = selectedProduct.id;
      table = 'product_metadata_locations';
    } else if (activeTab === 'brands' && selectedBrand) {
      entityId = selectedBrand.id;
      table = 'brand_metadata_locations';
    } else if (activeTab === 'categories' && selectedCategory) {
      entityId = selectedCategory.id;
      table = 'category_metadata_locations';
    } else if (activeTab === 'subcategories' && selectedSubcategory) {
      entityId = selectedSubcategory.id;
      table = 'subcategory_metadata_locations';
    }

    if (!entityId || !table) return;

    const fetchMetadata = async () => {
      setLoading(true);
      const columnName = 
        activeTab === 'products' ? 'product_id' :
        activeTab === 'brands' ? 'brand_id' :
        activeTab === 'categories' ? 'category_id' : 'subcategory_id';

      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(columnName, entityId)
        .eq('country_code', selectedCountry)
        .eq('language', selectedLanguage)
        .single();

      if (error) {
        setMetadata(null);
        setFormData({
          meta_title: '',
          meta_description: '',
          meta_keywords: '',
          h1_tag: '',
          h2_tag: '',
          paragraph_text: '',
        });
      } else {
        setMetadata(data);
        setFormData({
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
          h1_tag: data.h1_tag || '',
          h2_tag: data.h2_tag || '',
          paragraph_text: data.paragraph_text || '',
        });
      }
      setLoading(false);
    };

    fetchMetadata();
  }, [activeTab, selectedProduct, selectedBrand, selectedCategory, selectedSubcategory, selectedCountry, selectedLanguage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    let entityId: number | null = null;
    let table: string = '';
    let columnName: string = '';

    if (activeTab === 'products' && selectedProduct) {
      entityId = selectedProduct.id;
      table = 'product_metadata_locations';
      columnName = 'product_id';
    } else if (activeTab === 'brands' && selectedBrand) {
      entityId = selectedBrand.id;
      table = 'brand_metadata_locations';
      columnName = 'brand_id';
    } else if (activeTab === 'categories' && selectedCategory) {
      entityId = selectedCategory.id;
      table = 'category_metadata_locations';
      columnName = 'category_id';
    } else if (activeTab === 'subcategories' && selectedSubcategory) {
      entityId = selectedSubcategory.id;
      table = 'subcategory_metadata_locations';
      columnName = 'subcategory_id';
    }

    if (!entityId || !table || !columnName) return;

    setSaving(true);
    setMessage('');

    try {
      const payload: any = {
        [columnName]: entityId,
        country_code: selectedCountry,
        language: selectedLanguage,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
        h1_tag: formData.h1_tag,
        h2_tag: formData.h2_tag,
        paragraph_text: formData.paragraph_text,
      };

      const { error } = await supabase
        .from(table)
        .upsert(payload, {
          onConflict: `${columnName},country_code,language`,
        });

      if (error) throw error;

      // Revalidate the affected page(s) immediately
      const slug =
        activeTab === 'products' ? selectedProduct!.slug :
        activeTab === 'brands' ? selectedBrand!.slug :
        activeTab === 'categories' ? selectedCategory!.slug :
        selectedSubcategory!.slug;

      const pathsByCountry: Record<string, string> = {
        AE: `/${slug}`,
        MU: `/mu/${slug}`,
        MV: `/mv/${slug}`,
        SA: `/sa/${slug}`,
        QA: `/qa/${slug}`,
        KW: `/kw/${slug}`,
        BH: `/bh/${slug}`,
        OM: `/om/${slug}`,
      };

      const pathToRevalidate = pathsByCountry[selectedCountry] || `/${slug}`;
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: [pathToRevalidate] }),
      });

      setMessage('✅ Metadata saved & page refreshed!');
      setTimeout(() => setMessage(''), 3000);

      // Refresh metadata
      const { data } = await supabase
        .from(table)
        .select('*')
        .eq(columnName, entityId)
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

  const filteredBrands = brands.filter(b =>
    b.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.name_ar.includes(searchTerm) ||
    b.slug.includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(c =>
    c.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name_ar.includes(searchTerm) ||
    c.slug.includes(searchTerm.toLowerCase())
  );

  const filteredSubcategories = subcategories.filter(s =>
    s.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name_ar.includes(searchTerm) ||
    s.slug.includes(searchTerm.toLowerCase())
  );

  const languageLabel = selectedLanguage === 'en' ? 'English' : 'العربية (Arabic)';

  const getSelectedEntity = () => {
    if (activeTab === 'products') return selectedProduct;
    if (activeTab === 'brands') return selectedBrand;
    if (activeTab === 'categories') return selectedCategory;
    return selectedSubcategory;
  };

  const getFilteredList = () => {
    if (activeTab === 'products') return filteredProducts;
    if (activeTab === 'brands') return filteredBrands;
    if (activeTab === 'categories') return filteredCategories;
    return filteredSubcategories;
  };

  const getEntityLabel = () => {
    if (activeTab === 'products') return 'Product';
    if (activeTab === 'brands') return 'Brand';
    if (activeTab === 'categories') return 'Category';
    return 'Subcategory';
  };

  const getTitlePlaceholder = () => {
    if (activeTab === 'products') return 'e.g., Hot/Cold Shelves - Best Cooking Ranges in Dubai | Hatco';
    if (activeTab === 'brands') return 'e.g., Hatco - Premium Commercial Kitchen Equipment';
    if (activeTab === 'categories') return 'e.g., Cooking Equipment - Commercial Kitchen Solutions';
    return 'e.g., Hot/Cold Shelves - Food Warming Equipment';
  };

  const getDescriptionPlaceholder = () => {
    if (activeTab === 'products') return 'e.g., Discover premium Hot/Cold Shelves by Hatco in Dubai. Perfect for professional kitchens and restaurants.';
    if (activeTab === 'brands') return 'e.g., Hatco - Leading manufacturer of commercial food warmers and holding equipment.';
    if (activeTab === 'categories') return 'e.g., Explore our range of cooking equipment from world-class brands.';
    return 'e.g., Premium hot and cold shelves for food storage and display in commercial kitchens.';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SEO Metadata Manager</h1>
          <p className="text-gray-600 mt-2">Edit SEO title, description, and keywords for products, brands, categories, and subcategories</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-0">
            {(['products', 'brands', 'categories', 'subcategories'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchTerm('');
                  setSelectedProduct(null);
                  setSelectedBrand(null);
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                className={`px-6 py-3 font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select {getEntityLabel()}</h2>

                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-4"
                />

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getFilteredList().length === 0 ? (
                    <p className="text-gray-500 text-sm py-4">No {activeTab} found</p>
                  ) : (
                    getFilteredList().map((item: any) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (activeTab === 'products') setSelectedProduct(item);
                          else if (activeTab === 'brands') setSelectedBrand(item);
                          else if (activeTab === 'categories') setSelectedCategory(item);
                          else setSelectedSubcategory(item);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                          getSelectedEntity()?.id === item.id
                            ? 'bg-blue-100 text-blue-900 font-semibold'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium truncate">{item.name_en}</div>
                        <div className="text-xs text-gray-500 truncate">ID: {item.id}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Editor */}
          <div className="lg:col-span-2">
            {!getSelectedEntity() ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Select a {getEntityLabel().toLowerCase()} to edit its SEO metadata</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {getSelectedEntity()?.name_en}
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
                    {/* H1 Tag */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">H1 Tag (Page Title)</label>
                      <input
                        type="text"
                        name="h1_tag"
                        value={formData.h1_tag}
                        onChange={handleInputChange}
                        placeholder={`Default: ${getSelectedEntity()?.name_en || 'Brand/Category Name'}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Leave empty to use default: {getSelectedEntity()?.name_en}</p>
                    </div>

                    {/* H2 Tag */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">H2 Tag (Subheading)</label>
                      <input
                        type="text"
                        name="h2_tag"
                        value={formData.h2_tag}
                        onChange={handleInputChange}
                        placeholder="e.g., Premium Quality Equipment"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Subheading displayed under H1</p>
                    </div>

                    {/* Paragraph Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph Text</label>
                      <textarea
                        name="paragraph_text"
                        value={formData.paragraph_text}
                        onChange={handleInputChange}
                        placeholder="e.g., Explore our premium collection"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Main description text displayed on the page header</p>
                    </div>

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
                        placeholder={getTitlePlaceholder()}
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
                        placeholder={getDescriptionPlaceholder()}
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
                        placeholder={`${getEntityLabel()} related keywords, separated by commas`}
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
