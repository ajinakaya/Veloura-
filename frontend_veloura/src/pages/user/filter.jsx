import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2, Filter, X, ArrowUpDown } from 'lucide-react';
import Navbar from '../../layout/navbar';
import FilterCard from '../../components/flitercard'; 

const JewelryFilter = () => {
  const location = useLocation();

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500000,
    color: '',
    size: '',
    category: '',
    tag: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const API = 'https://localhost:3001';

  const sortOptions = [
    { value: 'name-asc', label: 'Name A-Z', sortBy: 'name', sortOrder: 'asc' },
    { value: 'name-desc', label: 'Name Z-A', sortBy: 'name', sortOrder: 'desc' },
    { value: 'price-asc', label: 'Price Low to High', sortBy: 'price', sortOrder: 'asc' },
    { value: 'price-desc', label: 'Price High to Low', sortBy: 'price', sortOrder: 'desc' },
    { value: 'createdAt-desc', label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
  ];

  const tags = ['New Arrival', 'Trending', 'Luxury', 'Minimalist', 'Bridal'];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchJewelry();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      const [colorRes, sizeRes, categoryRes] = await Promise.all([
        fetch(`${API}/jewelry/colors`),
        fetch(`${API}/jewelry/sizes`),
        fetch(`${API}/category`),
      ]);

      const colorsData = await colorRes.json();
      const sizesData = await sizeRes.json();
      const categoriesData = await categoryRes.json();

      setColors(colorsData);
      setSizes(sizesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Init load error:', err);
    }
  };

  const fetchJewelry = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      for (let key in filters) {
        if (filters[key]) params.append(key, filters[key]);
      }

      const url = `${API}/jewelry/filter?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (value) => {
    const match = sortOptions.find(opt => opt.value === value);
    if (match) {
      setFilters(prev => ({
        ...prev,
        sortBy: match.sortBy,
        sortOrder: match.sortOrder,
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 500000,
      color: '',
      size: '',
      category: '',
      tag: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2 font-poppins">Price Range</h3>
        <input
          type="range"
          min="0"
          max="500000"
          step="5000"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
        />
        <input
          type="range"
          min="0"
          max="500000"
          step="5000"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
        />
        <p className="text-sm mt-1 text-gray-600">
          Rs {filters.minPrice} - Rs {filters.maxPrice}
        </p>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2 font-poppins">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                filters.tag === tag
                  ? 'bg-[#D4AF37] text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => handleFilterChange('tag', filters.tag === tag ? '' : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2 font-poppins">Category</h3>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full rounded-lg border border-black/30 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>
              {c.category}
            </option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2 font-poppins">Size</h3>
        <select
          value={filters.size}
          onChange={(e) => handleFilterChange('size', e.target.value)}
          className="w-full rounded-lg border  border-black/30 px-3 py-2 text-sm"
        >
          <option value="">All Sizes</option>
          {sizes.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c.name}
              style={{ backgroundColor: c.code }}
              className={`w-7 h-7 rounded-full border-2 ${
                filters.color === c.name ? 'border-black' : 'border-gray-300'
              }`}
              onClick={() => handleFilterChange('color', filters.color === c.name ? '' : c.name)}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg text-sm"
      >
        Clear Filters
      </button>
    </div>
  );



return (
  <div>
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Filter Sidebar */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white border border-black/40 rounded-xl p-5 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
            <FilterSection />
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1">
          {/* Heading and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">Jewelry Collection</h1>
            <div className="flex items-center gap-2">
              <ArrowUpDown size={18} className="text-gray-600" />
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-black/30 rounded-md px-3 py-2 text-sm text-gray-700  "
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

         
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No jewelry pieces match your filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <FilterCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  </div>
);

};

export default JewelryFilter;
