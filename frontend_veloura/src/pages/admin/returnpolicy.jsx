import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Shield, AlertCircle, CheckCircle, Loader2, Edit2, Upload, X, Eye } from 'lucide-react';
import Sidebar from "./sidebar";

const ReturnPolicyAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '30 Days',
    conditions: '',
    icon: null
  });

  const API_BASE_URL = 'https://localhost:3001';

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
  };

  // Fetch all return policies
  const fetchReturnPolicies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/returnpolicy`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPolicies(data);
      setError('');
    } catch (err) {
      setError(`Failed to fetch return policies: ${err.message}`);
      console.error('Error fetching return policies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnPolicies();
  }, []);


  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
      
      setError('');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '30 Days',
      conditions: '',
      icon: null
    });
    setSelectedFile(null);
    setPreviewImage(null);
    setShowAddForm(false);
    setEditingPolicy(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new return policy
  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('conditions', formData.conditions.trim());
      
      if (selectedFile) {
        formDataToSend.append('icon', selectedFile);
      }

      const response = await fetch(`${API_BASE_URL}/returnpolicy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPolicies([...policies, result.returnPolicy]);
      resetForm();
      setSuccess('Return policy created successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error creating return policy:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete return policy
  const handleDeletePolicy = async (policyId, policyTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${policyTitle}"?`)) {
      return;
    }

    setIsDeleting(policyId);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/returnpolicy/${policyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setPolicies(policies.filter(policy => policy._id !== policyId));
      setSuccess('Return policy deleted successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting return policy:', err);
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

  // Get full image URL
  const getImageUrl = (iconPath) => {
    if (!iconPath) return null;
    return iconPath.startsWith('https') ? iconPath : `${API_BASE_URL}/${iconPath}`;
  };

  return (
    <div className="flex h-screen bg-white font-poppins">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 overflow-auto bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Return Policy </h1>
          <p className="text-gray-600 mb-6">
            Manage return policies for your jewelry store.
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
        <div className="bg-white rounded-lg shadow-sm border  border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search return policies..."
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
              Add Return Policy
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 30-Day Return Policy"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    >
                      <option value="7 Days">7 Days</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                      <option value="90 Days">90 Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the return policy..."
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conditions
                  </label>
                  <textarea
                    name="conditions"
                    value={formData.conditions}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional conditions and terms..."
                    disabled={isLoading}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 transition-colors">
                      <Upload className="h-4 w-4" />
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </label>
                    {selectedFile && (
                      <span className="text-sm text-gray-600">{selectedFile.name}</span>
                    )}
                  </div>
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreatePolicy}
                    disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {isLoading ? 'Creating...' : 'Create Policy'}
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

        {/* Policies List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Return Policies ({filteredPolicies.length})</h3>
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              )}
            </div>
          </div>

          {/* Policies */}
          <div className="divide-y divide-gray-200">
            {filteredPolicies.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No return policies found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first return policy.'}
                </p>
              </div>
            ) : (
              filteredPolicies.map((policy) => (
                <div key={policy._id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-grow">
                      <div className="flex-shrink-0">
                        {policy.icon ? (
                          <img
                            src={`https://localhost:3001/${policy.icon}`}
                            alt={policy.title}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <Shield className="h-6 w-6 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{policy.title}</h4>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {policy.duration}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 line-clamp-2">{policy.description}</p>
                        {policy.conditions && (
                          <p className="text-sm text-gray-500 mb-2">
                            <strong>Conditions:</strong> {policy.conditions}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          Created: {formatDate(policy.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleDeletePolicy(policy._id, policy.title)}
                        disabled={isDeleting === policy._id}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete policy"
                      >
                        {isDeleting === policy._id ? (
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
          <p>Total Return Policies: {policies.length}</p>
        </div>
      </div>
    </div>
        </div>
        
  );
};

export default ReturnPolicyAdmin;