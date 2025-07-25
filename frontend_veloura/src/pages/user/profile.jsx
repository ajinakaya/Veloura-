import React, { useState, useEffect } from "react";
import { Camera, Edit, Mail, User, Calendar, LogOut, ShoppingBag, Settings, Shield, Trash2 } from "lucide-react";
import { useAuth } from "../../context/authconetxt"; 
import { useOrder } from "../../context/ordercontext";
import axios from "axios";
import Navbar from "../../layout/navbar";

const UserProfile = () => {
  const { user: authUser, authToken, logout } = useAuth();
  const { orders, loading, error: orderError, fetchOrders, } = useOrder();
  const [user, setUser] = useState(authUser);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      fetchOrders();
    }
  }, [authUser, fetchOrders]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post('/imageupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`
        }
      });
       window.location.reload();
      
      if (response.data.imageUrl) {
        setUser(prev => ({
          ...prev,
          image: response.data.imageUrl
        }));
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
    setError(null);
  };

  const handleSave = async () => {
    if (!user?._id) return;

    try {
      setError(null);
      const response = await axios.put(`/users/users/${user._id}`, {
        username: editedUser.username,
        email: editedUser.email
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
       window.location.reload();
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({});
    setError(null);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      return;
    }

    try {
      setError(null);
      await axios.delete(`/users/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      alert('Account deleted successfully');
      logout(); 
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.response?.data?.error || 'Failed to delete account');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-poppins">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Main Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100 bg-gray-100">
                  {user?.image ? (
                    <img
                      src={`https://localhost:3001/${user.image}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/150/150';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <label className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                
             
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editedUser.username || ''}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editedUser.email || ''}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h2 className="text-3xl font-semiblod text-black">{user?.username || 'User'}</h2>
                      <button
                        onClick={handleEdit}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 ">{user?.email || 'No email'}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                        <User className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 capitalize">{user?.role || 'user'}</span>
                      </div>
                      
                      {user?.createdAt && (
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                          <Calendar className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">
                            Member since {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-semi-bold text-blue-600">
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    orders.length
                  )}
                </p>
                {orderError && (
                  <p className="text-xs text-red-500 mt-1">Failed to load orders</p>
                )}
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <ShoppingBag className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your password regularly for security</p>
                </div>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Logout</h4>
                  <p className="text-sm text-gray-600">Sign out of your account</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Delete Account</h4>
                  <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                </div>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Loading Overlay */}
        {isUploading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
              <span className="font-medium">Uploading image...</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;