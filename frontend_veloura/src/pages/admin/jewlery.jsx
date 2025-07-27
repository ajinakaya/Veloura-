import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  X,
  Save,
  Package,
  UploadCloud, // Added for upload icon
  ImageIcon, // Added for image placeholder
} from "lucide-react";
import Sidebar from "./sidebar";

const JewelryManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [jewelry, setJewelry] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizeGuides, setSizeGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingJewelry, setEditingJewelry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sizes: [],
    category: "",
    materials: [],
    details: [],
    colorOptions: [],
    tags: [],
    sizeGuide: "",
    thumbnailFile: null, 
    colorOptionImageFiles: [],
  });

  // API base URL
  const API_BASE_URL = "https://localhost:3001";

  // Fetch data from APIs
  useEffect(() => {
    fetchJewelry();
    fetchCategories();
    fetchSizeGuides();
  }, []);

  const fetchJewelry = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/jewelry/all`);
      if (response.ok) {
        const data = await response.json();
        setJewelry(data);
      } else {
        console.error("Failed to fetch jewelry");
      }
    } catch (error) {
      console.error("Error fetching jewelry:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched categories:", data); 

      setCategories(data); 
      setError("");
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(`Failed to fetch categories: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSizeGuides = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sizeguide`);
      if (response.ok) {
        const data = await response.json();
        setSizeGuides(data);
      } else {
        console.error("Failed to fetch size guides");
      }
    } catch (error) {
      console.error("Error fetching size guides:", error);
    }
  };

  const availableTags = [
    "New Arrival",
    "Best Seller",
    "Featured",
    "Popular",
    "Recommended",
  ];
  const availableSizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    '16"',
    '18"',
    '20"',
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      sizes: [],
      category: "",
      materials: [],
      details: [],
      colorOptions: [],
      tags: [],
      sizeGuide: "",
      thumbnailFile: null,
      colorOptionImageFiles: [],
    });
    setEditingJewelry(null);
  };

  const handleFileChange = (e, field, index = -1) => {
    if (field === "thumbnail") {
      setFormData((prev) => ({
        ...prev,
        thumbnailFile: e.target.files[0],
      }));
    } else if (field === "colorOptionImages" && index !== -1) {
      const newColorOptionImageFiles = [...formData.colorOptionImageFiles];
      newColorOptionImageFiles[index] = e.target.files; // Store the FileList
      setFormData((prev) => ({
        ...prev,
        colorOptionImageFiles: newColorOptionImageFiles,
      }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("sizeGuide", formData.sizeGuide);

      // Append files
      if (formData.thumbnailFile) {
        formDataToSend.append("thumbnail", formData.thumbnailFile);
      }

      // Append color option images
      formData.colorOptionImageFiles.forEach((fileList, colorIndex) => {
        if (fileList) {
          Array.from(fileList).forEach((file) => {
            formDataToSend.append(`jewelryImages`, file); 
          });
        }
      });

      formDataToSend.append("sizes", JSON.stringify(formData.sizes));
      formDataToSend.append("materials", JSON.stringify(formData.materials));
      formDataToSend.append("details", JSON.stringify(formData.details));
      formDataToSend.append(
        "colorOptions",
        JSON.stringify(formData.colorOptions)
      );
      formDataToSend.append("tags", JSON.stringify(formData.tags));

      const url = editingJewelry
        ? `${API_BASE_URL}/jewelry/${editingJewelry._id}`
        : `${API_BASE_URL}/jewelry`;

      const method = editingJewelry ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();

        if (editingJewelry) {
          setJewelry((prev) =>
            prev.map((item) =>
              item._id === editingJewelry._id ? result.jewelry : item
            )
          );
        } else {
          setJewelry((prev) => [result.jewelry, ...prev]);
        }

        setShowModal(false);
        resetForm();
        alert(result.message || "Jewelry saved successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save jewelry");
      }
    } catch (error) {
      console.error("Error saving jewelry:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingJewelry(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      price: item.price?.toString() || "",
      sizes: item.sizes || [],
      category: item.category?._id || "",
      materials: item.materials || [],
      details: item.details || [],
      colorOptions: item.colorOptions || [],
      tags: item.tags || [],
      sizeGuide: item.sizeGuide?._id || "",
      thumbnailFile: null,
      colorOptionImageFiles: item.colorOptions 
        ? item.colorOptions.map((co) => ({
           
            currentImages: co.furnitureimages,
          }))
        : [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this jewelry item?")) {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE_URL}/jewelry/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setJewelry((prev) => prev.filter((item) => item._id !== id));
          alert(result.message || "Jewelry deleted successfully!");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete jewelry");
        }
      } catch (error) {
        console.error("Error deleting jewelry:", error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const addMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, { label: "", description: "", icon: "" }],
    }));
  };

  const updateMaterial = (index, field, value) => {
    const newMaterials = [...formData.materials];
    newMaterials[index][field] = value;
    setFormData((prev) => ({ ...prev, materials: newMaterials }));
  };

  const removeMaterial = (index) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const addDetail = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, { label: "", value: "" }],
    }));
  };

  const updateDetail = (index, field, value) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;
    setFormData((prev) => ({ ...prev, details: newDetails }));
  };

  const removeDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const addColorOption = () => {
    setFormData((prev) => ({
      ...prev,
      colorOptions: [
        ...prev.colorOptions,
        { color: "", colorCode: "", furnitureimages: [] },
      ],
     
      colorOptionImageFiles: [...prev.colorOptionImageFiles, null],
    }));
  };

  const updateColorOption = (index, field, value) => {
    const newColorOptions = [...formData.colorOptions];
    newColorOptions[index][field] = value;
    setFormData((prev) => ({ ...prev, colorOptions: newColorOptions }));
  };

  const removeColorOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      colorOptions: prev.colorOptions.filter((_, i) => i !== index),
      colorOptionImageFiles: prev.colorOptionImageFiles.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const filteredJewelry = jewelry.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-white font-poppins">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {/* Header */}
      <div className="flex-1 overflow-auto ">
       
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Jewelry Management
              </h1>
              <button
                onClick={() => {
                  setShowModal(true);
                  resetForm(); 
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto mt-4"
              >
                <Plus size={20} />
                Add New Jewelry
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search jewelry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Jewelry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              : filteredJewelry.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {item.thumbnail ? (
                        <img
                          src={`${API_BASE_URL}/${item.thumbnail}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={48} className="text-gray-400" />
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <span className="text-lg font-bold text-purple-600">
                          ${item.price}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {item.category?.category || "No Category"} 
                        </span>
                        {item.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-1">
                          {item.colorOptions?.map((color, idx) => (
                            <div
                              key={idx}
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{
                                backgroundColor: color.colorCode || "#ccc",
                              }}
                              title={color.color}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.sizes?.length || 0} sizes available
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.materials?.length || 0} materials
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* Add */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-2xl font-bold">
                    {editingJewelry ? "Edit Jewelry" : "Add New Jewelry"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size Guide
                      </label>
                      <select
                        value={formData.sizeGuide}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sizeGuide: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Size Guide</option>
                        {sizeGuides.map((guide) => (
                          <option key={guide._id} value={guide._id}>
                            {guide.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Thumbnail Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "thumbnail")}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {editingJewelry?.thumbnail && !formData.thumbnailFile && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <ImageIcon size={16} /> Current:{" "}
                        <a
                          href={`${API_BASE_URL}/${editingJewelry.thumbnail}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          View Thumbnail
                        </a>
                      </div>
                    )}
                    {formData.thumbnailFile && (
                      <p className="mt-2 text-sm text-gray-500">
                        Selected: {formData.thumbnailFile.name}
                      </p>
                    )}
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <label key={size} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.sizes.includes(size)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  sizes: [...prev.sizes, size],
                                }));
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  sizes: prev.sizes.filter((s) => s !== size),
                                }));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {size}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <label key={tag} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.tags.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  tags: [...prev.tags, tag],
                                }));
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  tags: prev.tags.filter((t) => t !== tag),
                                }));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded">
                            {tag}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Materials */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Materials
                      </label>
                      <button
                        type="button"
                        onClick={addMaterial}
                        className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
                      >
                        <Plus size={16} /> Add Material
                      </button>
                    </div>
                    {formData.materials.map((material, index) => (
                      <div key={index} className="flex gap-2 mb-2 items-center">
                        <input
                          type="text"
                          placeholder="Material name"
                          value={material.label}
                          onChange={(e) =>
                            updateMaterial(index, "label", e.target.value)
                          }
                          className="flex-1 p-2 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={material.description}
                          onChange={(e) =>
                            updateMaterial(index, "description", e.target.value)
                          }
                          className="flex-1 p-2 border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeMaterial(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove Material"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Details
                      </label>
                      <button
                        type="button"
                        onClick={addDetail}
                        className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
                      >
                        <Plus size={16} /> Add Detail
                      </button>
                    </div>
                    {formData.details.map((detail, index) => (
                      <div key={index} className="flex gap-2 mb-2 items-center">
                        <input
                          type="text"
                          placeholder="Label"
                          value={detail.label}
                          onChange={(e) =>
                            updateDetail(index, "label", e.target.value)
                          }
                          className="flex-1 p-2 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={detail.value}
                          onChange={(e) =>
                            updateDetail(index, "value", e.target.value)
                          }
                          className="flex-1 p-2 border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeDetail(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove Detail"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Color Options */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Color Options
                      </label>
                      <button
                        type="button"
                        onClick={addColorOption}
                        className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
                      >
                        <Plus size={16} /> Add Color
                      </button>
                    </div>
                    {formData.colorOptions.map((color, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg mb-4 space-y-3"
                      >
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Color name"
                            value={color.color}
                            onChange={(e) =>
                              updateColorOption(index, "color", e.target.value)
                            }
                            className="flex-1 p-2 border border-gray-300 rounded"
                          />
                          <input
                            type="color"
                            value={color.colorCode}
                            onChange={(e) =>
                              updateColorOption(
                                index,
                                "colorCode",
                                e.target.value
                              )
                            }
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => removeColorOption(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove Color Option"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {/* Images for this Color Option */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Images for {color.color || "this color"} (multiple)
                          </label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(e, "colorOptionImages", index)
                            }
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                          />
                          {editingJewelry?.colorOptions?.[index]
                            ?.furnitureimages?.length > 0 &&
                            !formData.colorOptionImageFiles[index] && (
                              <div className="mt-2 text-sm text-gray-600">
                                Current Images:
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {editingJewelry.colorOptions[
                                    index
                                  ].furnitureimages.map((img, imgIdx) => (
                                    <a
                                      key={imgIdx}
                                      href={`${API_BASE_URL}/${img}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block relative group"
                                    >
                                      <img
                                        src={`${API_BASE_URL}/${img}`}
                                        alt={`Color variant ${imgIdx}`}
                                        className="w-12 h-12 object-cover rounded-md border border-gray-300"
                                      />
                                      <span className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                        View
                                      </span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          {formData.colorOptionImageFiles[index] &&
                            Array.from(
                              formData.colorOptionImageFiles[index]
                            ).map((file) => (
                              <p
                                key={file.name}
                                className="mt-1 text-xs text-gray-500"
                              >
                                Selected: {file.name}
                              </p>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          {editingJewelry ? "Update" : "Save"} Jewelry
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredJewelry.length === 0 && (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No jewelry found
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first jewelry item"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JewelryManagement;