import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Tag, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Sidebar from "./sidebar";

const CategoryAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const API_BASE_URL = 'https://localhost:3001';

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/category`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
      setError('');
    } catch (err) {
      setError(`Failed to fetch categories: ${err.message}`);
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('Category name is required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          category: newCategory.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const newCategoryData = await response.json();
      setCategories([...categories, newCategoryData]);
      setNewCategory('');
      setShowAddForm(false);
      setSuccess('Category added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error adding category:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    setIsDeleting(categoryId);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/category/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Remove category from local state
      setCategories(categories.filter(cat => cat._id !== categoryId));
      setSuccess('Category deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting category:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
       <div className="flex h-screen bg-white font-poppins">
         <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
       <div className="flex-1 overflow-auto bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Category Management </h1>
          <p className="text-gray-600 mb-6">
           Manage jewelry categories for your store
          </p>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
            <span className="text-red-700 flex-grow">{error}</span>
            <button 
              onClick={clearMessages}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-green-700 flex-grow">{success}</span>
            <button 
              onClick={clearMessages}
              className="text-green-500 hover:text-green-700 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <form onSubmit={handleAddCategory} className="flex gap-4">
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Enter category name..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !newCategory.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {isLoading ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {setShowAddForm(false); setNewCategory(''); clearMessages();}}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Categories ({filteredCategories.length})</h3>
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="divide-y divide-gray-200">
            {filteredCategories.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first category.'}
                </p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Tag className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{category.category}</h4>
                        <p className="text-sm text-gray-500">
                          Created: {formatDate(category.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteCategory(category._id, category.category)}
                      disabled={isDeleting === category._id}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete category"
                    >
                      {isDeleting === category._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Total Categories: {categories.length}</p>
        </div>
      </div>
    </div>
        </div>
        
  );
};

export default CategoryAdmin;