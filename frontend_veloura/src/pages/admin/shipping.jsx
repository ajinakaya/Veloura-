import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Truck, AlertCircle, CheckCircle, Loader2, Edit2, Eye, EyeOff, MapPin } from 'lucide-react';
import Sidebar from './sidebar'; 

const ShippingRateAdmin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [shippingRates, setShippingRates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRate, setEditingRate] = useState(null);

  const [formData, setFormData] = useState({
    method: '',
    displayName: '',
    cost: '',
    description: '',
    isActive: true
  });

  const API_BASE_URL = 'https://localhost:3001';

  
  const shippingMethods = [
    { value: 'IN_STORE_PICKUP', label: 'In Store Pickup' },
    { value: 'OUTSIDE_THE_VALLEY', label: 'Outside the Valley' },
    { value: 'INSIDE_THE_VALLEY', label: 'Inside the Valley' }
  ];

  
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
  };

  // Fetch all shipping rates
  const fetchShippingRates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/shippingrate`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShippingRates(data);
      setError('');
    } catch (err) {
      setError(`Failed to fetch shipping rates: ${err.message}`);
      console.error('Error fetching shipping rates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingRates();
  }, []);

  const filteredRates = shippingRates.filter(rate =>
    rate.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rate.description && rate.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      method: '',
      displayName: '',
      cost: '',
      description: '',
      isActive: true
    });
    setShowAddForm(false);
    setEditingRate(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Create new shipping rate
  const handleCreateRate = async () => {
    if (!formData.method || !formData.displayName || !formData.cost) {
      setError('Method, display name, and cost are required');
      return;
    }

    if (isNaN(formData.cost) || parseFloat(formData.cost) < 0) {
      setError('Cost must be a valid positive number');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/shippingrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          method: formData.method,
          displayName: formData.displayName.trim(),
          cost: parseFloat(formData.cost),
          description: formData.description.trim(),
          isActive: formData.isActive
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setShippingRates([...shippingRates, result.shippingRate]);
      resetForm();
      setSuccess('Shipping rate created successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error creating shipping rate:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update shipping rate
  const handleUpdateRate = async () => {
    if (!formData.displayName || !formData.cost) {
      setError('Display name and cost are required');
      return;
    }

    if (isNaN(formData.cost) || parseFloat(formData.cost) < 0) {
      setError('Cost must be a valid positive number');
      return;
    }

    setIsUpdating(editingRate._id);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/shippingrate/${editingRate._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          displayName: formData.displayName.trim(),
          cost: parseFloat(formData.cost),
          description: formData.description.trim(),
          isActive: formData.isActive
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setShippingRates(shippingRates.map(rate => 
        rate._id === editingRate._id ? result.shippingRate : rate
      ));
      resetForm();
      setSuccess('Shipping rate updated successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error updating shipping rate:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  // Edit shipping rate
  const handleEditRate = (rate) => {
    setFormData({
      method: rate.method,
      displayName: rate.displayName,
      cost: rate.cost.toString(),
      description: rate.description || '',
      isActive: rate.isActive
    });
    setEditingRate(rate);
    setShowAddForm(true);
  };

  // Delete shipping rate
  const handleDeleteRate = async (rateId, rateName) => {
    if (!window.confirm(`Are you sure you want to delete "${rateName}"?`)) {
      return;
    }

    setIsDeleting(rateId);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/shippingrate/${rateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      setShippingRates(shippingRates.filter(rate => rate._id !== rateId));
      setSuccess('Shipping rate deleted successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting shipping rate:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  // Toggle active status
  const toggleActiveStatus = async (rate) => {
    setIsUpdating(rate._id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/shippingrate/${rate._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          ...rate,
          isActive: !rate.isActive
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error);
      }

      const result = await response.json();
      setShippingRates(shippingRates.map(r => 
        r._id === rate._id ? result.shippingRate : r
      ));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(null);
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

  // Get method label
  const getMethodLabel = (method) => {
    const found = shippingMethods.find(m => m.value === method);
    return found ? found.label : method;
  };

  return (
    <div className="flex h-screen bg-white font-poppins">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 overflow-auto bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Shipping Rate Management</h1>
          <p className="text-gray-600 mb-6">
            Manage shipping rates and delivery options for your jewelry store.
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700 flex-grow">{error}</span>
              <button onClick={clearMessages} className="ml-4 text-red-600">×</button>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-green-700 flex-grow">{success}</span>
              <button onClick={clearMessages} className="ml-4 text-green-600">×</button>
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
                placeholder="Search shipping rates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {editingRate ? 'Edit Rate' : 'Add Shipping Rate'}
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Method *
                    </label>
                    <select
                      name="method"
                      value={formData.method}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading || editingRate}
                    >
                      <option value="">Select method...</option>
                      {shippingMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Standard Delivery"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost (NPR) *
                    </label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional information about this shipping option..."
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={editingRate ? handleUpdateRate : handleCreateRate}
                    disabled={isLoading || isUpdating || !formData.method || !formData.displayName || !formData.cost}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    {(isLoading || isUpdating) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {(isLoading || isUpdating) ? 'Processing...' : (editingRate ? 'Update Rate' : 'Create Rate')}
                  </button>
                  <button
                    onClick={() => {resetForm(); clearMessages();}}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipping Rates List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Shipping Rates ({filteredRates.length})</h3>
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              )}
            </div>
          </div>

          {/* Rates */}
          <div className="divide-y divide-gray-200">
            {filteredRates.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Truck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No shipping rates found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first shipping rate.'}
                </p>
              </div>
            ) : (
              filteredRates.map((rate) => (
                <div key={rate._id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-grow">
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-lg ${rate.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Truck className={`h-6 w-6 ${rate.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{rate.displayName}</h4>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {getMethodLabel(rate.method)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            rate.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {rate.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xl font-bold text-green-600">
                            NPR {rate.cost.toFixed(2)}
                          </span>
                        </div>
                        {rate.description && (
                          <p className="text-gray-600 mb-2">{rate.description}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Created: {formatDate(rate.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleActiveStatus(rate)}
                        disabled={isUpdating === rate._id}
                        className={`p-2 rounded-lg transition-colors ${
                          rate.isActive 
                            ? 'bg-red-50 hover:bg-red-100 text-red-600' 
                            : 'bg-green-50 hover:bg-green-100 text-green-600'
                        }`}
                        title={rate.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {isUpdating === rate._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : rate.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditRate(rate)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors"
                        title="Edit rate"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRate(rate._id, rate.displayName)}
                        disabled={isDeleting === rate._id}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete rate"
                      >
                        {isDeleting === rate._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Total Shipping Rates: {shippingRates.length} | Active: {shippingRates.filter(r => r.isActive).length}</p>
        </div>
      </div>
    </div>
        </div>
      
  );
};

export default ShippingRateAdmin;