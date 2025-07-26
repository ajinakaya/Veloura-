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
        const response = await axios.get(`http://localhost:3001/jewelry/${id}`);
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

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!jewelry) return <div className="p-10 text-center">No jewelry found.</div>;

  const currentImages = jewelry.colorOptions?.[selectedColorIndex]?.jewelryImages || [];
  const getImageUrl = (path) => `https://localhost:3001/${path}`;


  return (
    <div className="p-8 md:p-16 font-poppins"> 
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Images */}
        <div className="w-full md:w-1/2">
          <div className="relative border rounded-2xl overflow-hidden shadow-md aspect-square">
            {currentImages.length > 0 ? (
              <img
                src={getImageUrl(currentImages[selectedImageIndex])} 
                alt={`Jewelry main view ${selectedImageIndex + 1}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
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
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === currentImages.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <div className="flex mt-4 gap-2 overflow-x-auto pb-2 no-scrollbar"> 
            {currentImages.map((img, idx) => (
              <img
                key={idx}
                src={getImageUrl(img)} 
                alt={`Jewelry thumbnail ${idx + 1}`}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  selectedImageIndex === idx ? "border-black" : "border-gray-200"
                } transition-all duration-200`}
              />
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-semibold text-gray-900">{jewelry.name}</h1>
            <Heart className="w-6 h-6 text-gray-500 hover:text-red-500 cursor-pointer transition-colors duration-200" />
          </div>

          <div className="flex items-center gap-2 text-yellow-500">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} fill="currentColor" stroke="currentColor" className="w-5 h-5" />
            ))}
            <span className="text-gray-500 ml-2 text-sm">(500 Reviews)</span>
          </div>

          <p className="text-3xl font-bold text-pink-600">${jewelry.price.toFixed(2)}</p> 

          {/* Color selection */}
          {jewelry.colorOptions && jewelry.colorOptions.length > 0 && (
            <div>
              <h2 className="font-medium text-gray-800 mb-2">Color: <span className="font-normal text-gray-600">{jewelry.colorOptions[selectedColorIndex]?.color}</span></h2>
              <div className="flex gap-2 mt-2">
                {jewelry.colorOptions.map((option, idx) => (
                  <button 
                    key={idx}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      selectedColorIndex === idx ? "border-black ring-2 ring-black ring-offset-1" : "border-gray-300"
                    } transition-all duration-200`}
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
            <div>
              <h2 className="font-medium text-gray-800 mb-2">Size: <span className="font-normal text-gray-600">{selectedSize}</span></h2>
              <div className="flex gap-2 mt-2 flex-wrap">
                {jewelry.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    className={`border rounded-full px-4 py-2 text-sm font-semibold ${ 
                      selectedSize === size ? "bg-black text-white shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    } transition-all duration-200`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {/* Size Guide Link */}
              {jewelry.sizeGuide && (
                <div className="mt-4 text-sm text-center md:text-left">
                  <a
                    href={`https://localhost:3001/sizeguide/${jewelry.sizeGuide}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Need help with your size? Size Guide
                  </a>
                </div>
              )}
            </div>
          )}

          {jewelry.materials && jewelry.materials.length > 0 && (
            <div>
              <h2 className="font-medium text-gray-800 mb-2">Material: <span className="font-normal text-gray-600">{selectedMaterial ? selectedMaterial.label : 'Select a material'}</span></h2>
              <div className="flex gap-2 mt-2 flex-wrap">
                {jewelry.materials.map((materialObj) => ( 
                  <button
                    key={materialObj._id} 
                    onClick={() => setSelectedMaterial(materialObj)} 
                    className={`border rounded-full px-4 py-2 text-sm font-semibold ${
                      selectedMaterial?._id === materialObj._id ? "bg-black text-white shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    } transition-all duration-200`}
                  >
                    {materialObj.label} 
                  </button>
                ))}
              </div>
            </div>
          )}


          {/* Action buttons */}
          <div className="flex gap-4 mt-6">
            <button className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-200 text-lg">
              Add to Cart
            </button>
            <button className="bg-white border border-gray-300 text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 text-lg">
              Buy Now
            </button>
          </div>

       
          <div className="mt-8 space-y-4 border-t border-gray-200 pt-8"> 
            {/* Description Section */}
            {jewelry.description && (
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="font-semibold text-base uppercase text-gray-800">Description</span>
                  {showDescription ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                </button>
                {showDescription && (
                  <div className="p-4 border-t border-gray-200 text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-line">{jewelry.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* Details Section */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="font-semibold text-base uppercase text-gray-800">Details</span>
                {showDetails ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
              </button>
              {showDetails && (
                <div className="p-4 border-t border-gray-200 text-gray-700">
                  {jewelry.details && jewelry.details.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                          {jewelry.details.map((detail, i) => (
                            <tr key={i}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">{detail.label}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{detail.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">No additional details available.</div>
                  )}
                </div>
              )}
            </div>

            {/* Materials Accordion Section */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <button
                    onClick={() => setShowMaterialsAccordion(!showMaterialsAccordion)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                    <span className="font-semibold text-base uppercase text-gray-800">Materials Information</span>
                    {showMaterialsAccordion ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                </button>
                {showMaterialsAccordion && (
                    <div className="p-4 border-t border-gray-200 text-gray-700">
                        {jewelry.materials && jewelry.materials.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {jewelry.materials.map((materialItem) => (
                                            <tr key={materialItem._id}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 flex items-center gap-2">
                                                    {materialItem.icon && (
                                                        <img
                                                            src={getImageUrl(materialItem.icon)}
                                                            alt={`${materialItem.label} icon`}
                                                            className="w-5 h-5 object-contain"
                                                        />
                                                    )}
                                                    {materialItem.label}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{materialItem.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">No materials information available.</div>
                        )}
                    </div>
                )}
            </div>

          </div>


          {/* Policy Icons */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-700">
            <div className="flex items-center gap-3">
              <Shield className="text-pink-600 w-5 h-5" />
              <span>Lifetime Warranty</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="text-pink-600 w-5 h-5" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="text-pink-600 w-5 h-5" />
              <span>30 Day Returns</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="text-pink-600 w-5 h-5" />
              <span>100% Handmade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryDetailPage;