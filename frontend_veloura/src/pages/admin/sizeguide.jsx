import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Ruler, AlertCircle, CheckCircle, Loader2, Edit2, Upload, X, Eye, Image, Minus } from 'lucide-react';
import Sidebar from './sidebar';
import { useAuth } from '../../context/authconetxt';
const SizeGuideAdmin = () => {
  const { authToken, user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sizeGuides, setSizeGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [viewingGuide, setViewingGuide] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sizeDetails: [{ label: '', measurement: '', note: '' }]
  });

  const API_BASE_URL = 'https://localhost:3001';

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
  };

  // Fetch all size guides
  const fetchSizeGuides = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/sizeguide`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSizeGuides(data);
      setError('');
    } catch (err) {
      setError(`Failed to fetch size guides: ${err.message}`);
      console.error('Error fetching size guides:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSizeGuides();
  }, []);

  const filteredGuides = sizeGuides.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (guide.description && guide.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each file must be less than 5MB');
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
    
    // Create previews
    const previews = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({
          file,
          url: e.target.result
        });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then(setPreviewImages);
    setError('');
  };

  // Remove preview image
  const removePreviewImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewImages(newPreviews);
  };

  // Handle size detail changes
  const handleSizeDetailChange = (index, field, value) => {
    const newDetails = [...formData.sizeDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData(prev => ({ ...prev, sizeDetails: newDetails }));
  };

  // Add new size detail
  const addSizeDetail = () => {
    setFormData(prev => ({
      ...prev,
      sizeDetails: [...prev.sizeDetails, { label: '', measurement: '', note: '' }]
    }));
  };

  // Remove size detail
  const removeSizeDetail = (index) => {
    if (formData.sizeDetails.length > 1) {
      const newDetails = formData.sizeDetails.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, sizeDetails: newDetails }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sizeDetails: [{ label: '', measurement: '', note: '' }]
    });
    setSelectedFiles([]);
    setPreviewImages([]);
    setShowAddForm(false);
    setEditingGuide(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new size guide
  const handleCreateGuide = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    const validSizeDetails = formData.sizeDetails.filter(detail => 
      detail.label.trim() || detail.measurement.trim()
    );

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('sizeDetails', JSON.stringify(validSizeDetails));
      
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`${API_BASE_URL}/sizeguide`, {
        method: 'POST',
        headers: {
  Authorization: `Bearer ${authToken}`,
},
        credentials: 'include',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newGuide = await response.json();
      setSizeGuides([newGuide, ...sizeGuides]);
      resetForm();
      setSuccess('Size guide created successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error creating size guide:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update size guide
  const handleUpdateGuide = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    const validSizeDetails = formData.sizeDetails.filter(detail => 
      detail.label.trim() || detail.measurement.trim()
    );

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('sizeDetails', JSON.stringify(validSizeDetails));
      
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`${API_BASE_URL}/sizeguide/${editingGuide._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedGuide = await response.json();
      setSizeGuides(sizeGuides.map(guide => 
        guide._id === editingGuide._id ? updatedGuide : guide
      ));
      resetForm();
      setSuccess('Size guide updated successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error updating size guide:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit size guide
  const handleEditGuide = (guide) => {
    setFormData({
      name: guide.name,
      description: guide.description || '',
      sizeDetails: guide.sizeDetails.length > 0 ? guide.sizeDetails : [{ label: '', measurement: '', note: '' }]
    });
    setEditingGuide(guide);
    setShowAddForm(true);
    setSelectedFiles([]);
    setPreviewImages([]);
  };

  // Delete size guide
  const handleDeleteGuide = async (guideId, guideName) => {
    if (!window.confirm(`Are you sure you want to delete "${guideName}"?`)) {
      return;
    }

    setIsDeleting(guideId);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/sizeguide/${guideId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setSizeGuides(sizeGuides.filter(guide => guide._id !== guideId));
      setSuccess('Size guide deleted successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting size guide:', err);
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
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}/${imagePath}`;
  };

  return (
       <div className="flex h-screen bg-white font-poppins">
         <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
       <div className="flex-1 overflow-auto bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Size Guide Management</h1>
          <p className="text-gray-600 mb-6">
           Manage sizing information and guides for your jewelry.
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
                placeholder="Search size guides..."
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
              {editingGuide ? 'Edit Guide' : 'Add Size Guide'}
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Ring Size Guide"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description..."
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Size Details */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Size Details
                    </label>
                    <button
                      type="button"
                      onClick={addSizeDetail}
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Add Detail
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.sizeDetails.map((detail, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          placeholder="Label (e.g., Small, Medium)"
                          value={detail.label}
                          onChange={(e) => handleSizeDetailChange(index, 'label', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isLoading}
                        />
                        <input
                          type="text"
                          placeholder="Measurement (e.g., 16-17mm)"
                          value={detail.measurement}
                          onChange={(e) => handleSizeDetailChange(index, 'measurement', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isLoading}
                        />
                        <input
                          type="text"
                          placeholder="Note (optional)"
                          value={detail.note}
                          onChange={(e) => handleSizeDetailChange(index, 'note', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => removeSizeDetail(index)}
                          disabled={formData.sizeDetails.length === 1}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images (Max 5)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                      disabled={isLoading}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB each</p>
                    </label>
                  </div>
                  
                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removePreviewImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={editingGuide ? handleUpdateGuide : handleCreateGuide}
                    disabled={isLoading || !formData.name.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {isLoading ? 'Processing...' : (editingGuide ? 'Update Guide' : 'Create Guide')}
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

        {/* Size Guides List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Size Guides ({filteredGuides.length})</h3>
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              )}
            </div>
          </div>

          {/* Guides */}
          <div className="divide-y divide-gray-200">
            {filteredGuides.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Ruler className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No size guides found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first size guide.'}
                </p>
              </div>
            ) : (
              filteredGuides.map((guide) => (
                <div key={guide._id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-grow">
                      <div className="flex-shrink-0">
                        {guide.images && guide.images.length > 0 ? (
                          <img
                            src={getImageUrl(guide.images[0])}
                            alt={guide.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="bg-blue-100 p-4 rounded-lg">
                            <Ruler className="h-8 w-8 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{guide.name}</h4>
                          {guide.images && guide.images.length > 0 && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Image className="h-3 w-3" />
                              {guide.images.length}
                            </span>
                          )}
                        </div>
                        {guide.description && (
                          <p className="text-gray-600 mb-2">{guide.description}</p>
                        )}
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">
                            Size Details: {guide.sizeDetails ? guide.sizeDetails.length : 0} entries
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Created: {formatDate(guide.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setViewingGuide(guide)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditGuide(guide)}
                        className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-lg transition-colors"
                        title="Edit guide"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGuide(guide._id, guide.name)}
                        disabled={isDeleting === guide._id}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete guide"
                      >
                        {isDeleting === guide._id ? (
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

        {/* View Guide Modal */}
        {viewingGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{viewingGuide.name}</h2>
                  <button
                    onClick={() => setViewingGuide(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {viewingGuide.description && (
                  <p className="text-gray-600 mb-4">{viewingGuide.description}</p>
                )}

                {/* Images */}
                {viewingGuide.images && viewingGuide.images.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {viewingGuide.images.map((image, index) => (
                        <img
                          key={index}
                          src={getImageUrl(image)}
                          alt={`${viewingGuide.name} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Details */}
                {viewingGuide.sizeDetails && viewingGuide.sizeDetails.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Size Details</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Label</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Measurement</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingGuide.sizeDetails.map((detail, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">{detail.label || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{detail.measurement || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{detail.note || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Total Size Guides: {sizeGuides.length}</p>
        </div>
      </div>
    </div>
  </div>
        
  );
};

export default SizeGuideAdmin;