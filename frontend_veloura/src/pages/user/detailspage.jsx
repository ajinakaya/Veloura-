import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Star,
  Shield,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ChevronDown,
  ChevronUp, 
} from "lucide-react";
import Navbar from "../../layout/navbar";

const JewelryDetailPage = () => {
  const { id } = useParams(); 
  const [jewelry, setJewelry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null); 

  // Accordion states
  const [showDescription, setShowDescription] = useState(false);
  const [showDetails, setShowDetails] = useState(true); 
  const [showMaterialsAccordion, setShowMaterialsAccordion] = useState(false); 

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await axios.get(`https://localhost:3001/jewelry/${id}`);
        const data = response.data;
        setJewelry(data);

        if (data.colorOptions && data.colorOptions.length > 0) {
          setSelectedColorIndex(0);
          setSelectedImageIndex(0);
        }

        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

        if (data.materials && data.materials.length > 0) {
          setSelectedMaterial(data.materials[0]); 
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jewelry details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJewelry();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-600">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!jewelry) return <div className="p-10 text-center text-gray-600">No jewelry found.</div>;

  const currentImages = jewelry.colorOptions?.[selectedColorIndex]?.jewelryImages || [];
  const getImageUrl = (path) => `https://localhost:3001/${path}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Images */}
            <div className="p-6 lg:p-8">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4">
                {currentImages.length > 0 ? (
                  <img
                    src={getImageUrl(currentImages[selectedImageIndex])} 
                    alt={`Jewelry main view ${selectedImageIndex + 1}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available for this color.
                  </div>
                )}
                {currentImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === 0 ? currentImages.length - 1 : prev - 1
                        )
                      }
                      className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === currentImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2"> 
                {currentImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={getImageUrl(img)} 
                    alt={`Jewelry thumbnail ${idx + 1}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                      selectedImageIndex === idx 
                        ? "border-gray-900 shadow-md" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="p-6 lg:p-8 border-l border-gray-100">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl lg:text-3xl font-light text-gray-900 leading-tight">
                    {jewelry.name}
                  </h1>
                  <Heart className="w-6 h-6 text-gray-400 hover:text-red-400 cursor-pointer transition-colors duration-200" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} fill="currentColor" className="w-4 h-4" />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-1">(500 Reviews)</span>
                </div>

                <div className="text-2xl lg:text-3xl font-light text-gray-900">
                  Rs.{jewelry.price.toFixed(2)}
                </div>

                {/* Color selection */}
                {jewelry.colorOptions && jewelry.colorOptions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                      Color: <span className="font-normal text-gray-600">{jewelry.colorOptions[selectedColorIndex]?.jewelryImages}</span>
                    </h3>
                    <div className="flex gap-3">
                      {jewelry.colorOptions.map((option, idx) => (
                        <button 
                          key={idx}
                          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                            selectedColorIndex === idx 
                              ? "border-gray-900 ring-2 ring-gray-300 ring-offset-2" 
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: option.colorCode || '#ccc' }}
                          onClick={() => {
                            setSelectedColorIndex(idx);
                            setSelectedImageIndex(0);
                          }}
                          title={option.color} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size selection */}
                {jewelry.sizes && jewelry.sizes.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                      Size: <span className="font-normal text-gray-600">{selectedSize}</span>
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {jewelry.sizes.map((size, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSize(size)}
                          className={`border rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                            selectedSize === size 
                              ? "bg-gray-900 text-white border-gray-900" 
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {jewelry.sizeGuide && (
                      <div className="mt-3">
                        <a
                          href={`https://localhost:3001/sizeguide/${jewelry.sizeGuide}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 underline"
                        >
                          Size Guide
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Material selection */}
                {jewelry.materials && jewelry.materials.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                      Material: <span className="font-normal text-gray-600">{selectedMaterial ? selectedMaterial.label : 'Select a material'}</span>
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {jewelry.materials.map((materialObj) => ( 
                        <button
                          key={materialObj._id} 
                          onClick={() => setSelectedMaterial(materialObj)} 
                          className={`border rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                            selectedMaterial?._id === materialObj._id 
                              ? "bg-gray-900 text-white border-gray-900" 
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {materialObj.label} 
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex-1">
                    Add to Cart
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex-1">
                    Buy Now
                  </button>
                </div>

                {/* Policy Icons */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="text-blue-600 w-4 h-4" />
                    <span>Lifetime Warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="text-green-600 w-4 h-4" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RotateCcw className="text-orange-600 w-4 h-4" />
                    <span>30 Day Returns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="text-purple-600 w-4 h-4" />
                    <span>100% Handmade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="border-t border-gray-100">
            <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-4">
              {/* Description Section */}
              {jewelry.description && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-sm">Description</span>
                    {showDescription ? 
                      <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    }
                  </button>
                  {showDescription && (
                    <div className="p-4 border-t border-gray-200 text-gray-700 leading-relaxed">
                      <p className="whitespace-pre-line">{jewelry.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Details Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-900 uppercase tracking-wide text-sm">Details</span>
                  {showDetails ? 
                    <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </button>
                {showDetails && (
                  <div className="border-t border-gray-200">
                    {jewelry.details && jewelry.details.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {jewelry.details.map((detail, i) => (
                          <div key={i} className="flex py-3 px-4">
                            <div className="w-1/3 text-sm font-medium text-gray-900">{detail.label}</div>
                            <div className="w-2/3 text-sm text-gray-700">{detail.value}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-gray-500 text-sm">No additional details available.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Materials Accordion Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowMaterialsAccordion(!showMaterialsAccordion)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-900 uppercase tracking-wide text-sm">Materials Information</span>
                  {showMaterialsAccordion ? 
                    <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </button>
                {showMaterialsAccordion && (
                  <div className="border-t border-gray-200">
                    {jewelry.materials && jewelry.materials.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {jewelry.materials.map((materialItem) => (
                          <div key={materialItem._id} className="flex py-3 px-4">
                            <div className="w-1/3 text-sm font-medium text-gray-900 flex items-center gap-2">
                              {materialItem.icon && (
                                <img
                                  src={getImageUrl(materialItem.icon)}
                                  alt={`${materialItem.label} icon`}
                                  className="w-4 h-4 object-contain"
                                />
                              )}
                              {materialItem.label}
                            </div>
                            <div className="w-2/3 text-sm text-gray-700">{materialItem.description}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-gray-500 text-sm">No materials information available.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryDetailPage;