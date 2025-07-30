import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layout/navbar";
import { useCart } from "../../context/cartcontext";
import { useAuth } from "../../context/authconetxt"; 

const Checkout = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { authToken } = useAuth();

  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loadingShipping, setLoadingShipping] = useState(true); // New loading state for shipping rates

  useEffect(() => {
    fetchShippingRates();
  }, []);

  const fetchShippingRates = async () => {
    setLoadingShipping(true);
    try {
 
      const res = await axios.get("https://localhost:3001/shippingrate", {
        headers: { Authorization: `Bearer ${authToken}` }, // Add auth header
      });
      setShippingOptions(res.data || []);
     
      if (res.data && res.data.length > 0 && !selectedShipping) {
        setSelectedShipping(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch shipping rates", err);
      // Handle error for shipping rates (e.g., display message to user)
    } finally {
      setLoadingShipping(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.jewelry.price * item.quantity,
    0
  );

  const total = subtotal + (selectedShipping?.cost || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" })); 
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "streetAddress",
      "city",
      "province",
      "phone",
      "email",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^\d{10}$/.test(String(formData.phone).replace(/\D/g, ""))) { // Convert to string for replace
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!selectedShipping) {
      alert("Please select a shipping method");
      return;
    }

    if (!validateForm()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    navigate("/payment", {
      state: {
        selectedShipping,
        formData,
        total,
        subtotal,
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 font-poppins">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs/Navigation Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-gray-800">
              <span className="text-black">Shipping</span> &gt;{" "}
              <span
                className={`${
                  selectedShipping ? "text-black" : "text-gray-400"
                }`}
              >
                Details
              </span>{" "}
              &gt; <span className="text-gray-400">Payment</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Shipping Method + Billing Details */}
            <div>
              {/* Shipping Method Section */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Method</h3>
                {loadingShipping ? (
                  <div className="text-center py-4 text-gray-500">Loading shipping options...</div>
                ) : shippingOptions.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No shipping options available.</div>
                ) : (
                  <div className="space-y-4">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.method}
                        className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition-all duration-200 ease-in-out
                          ${selectedShipping?.method === option.method
                            ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping?.method === option.method}
                          onChange={() => setSelectedShipping(option)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="flex-1 text-gray-800">
                          <p className="font-medium">{option.displayName}</p>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        <span className="font-semibold text-lg text-gray-900">Rs. {option.cost.toLocaleString()}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Billing Details Section */}
              {selectedShipping && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Billing Details</h3>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName || ""}
                          onChange={handleChange}
                          type="text"
                          className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.firstName ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName || ""}
                          onChange={handleChange}
                          type="text"
                          className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.lastName ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
                      <input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName || ""}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country / Region *</label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country || "Nepal"} // Default to Nepal
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.country ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="Nepal">Nepal</option>
                        <option value="India">India</option>
                        <option value="China">China</option>
                      </select>
                      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                    </div>

                    <div>
                      <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                      <input
                        id="streetAddress"
                        name="streetAddress"
                        value={formData.streetAddress || ""}
                        onChange={handleChange}
                        type="text"
                        className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.streetAddress ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Town / City *</label>
                        <input
                          id="city"
                          name="city"
                          value={formData.city || ""}
                          onChange={handleChange}
                          type="text"
                          className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                        <select
                          id="province"
                          name="province"
                          value={formData.province || ""}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.province ? "border-red-500" : "border-gray-300"
                          }`}
                          required
                        >
                          <option value="" disabled>Select Province</option>
                          <option value="Province 1">Province 1</option>
                          <option value="Province 2">Province 2</option>
                          <option value="Bagmati">Bagmati</option>
                          <option value="Gandaki">Gandaki</option>
                          <option value="Lumbini">Lumbini</option>
                          <option value="Karnali">Karnali</option>
                          <option value="Sudurpaschim">Sudurpaschim</option>
                        </select>
                        {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          id="phone"
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleChange}
                          type="text"
                          className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                        <input
                          id="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          type="email"
                          className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information (Optional)</label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo || ""}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit sticky top-24">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Order Summary</h3>
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-4">Your cart is empty.</div>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex gap-4 border-b border-gray-200 pb-4 mb-4 items-start">
                    <img
                      src={`https://localhost:3001/${item.jewelry.thumbnail}`}
                      alt={item.jewelry.name}
                      className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                      
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.jewelry.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        Size: {item.jewelry.sizes || 'N/A'}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Color:</span>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.jewelry.colorOptions?.[0]?.colorCode || "#000" }}
                        />
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">Rs. {(item.jewelry.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))
              )}

              <div className="space-y-3 text-base"> 
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>Rs. {selectedShipping?.cost?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-3 font-semibold text-xl text-gray-900">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="w-full mt-6 py-3.5 bg-black/80 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-md"
                onClick={handleProceedToPayment}
                disabled={!selectedShipping || cart.length === 0}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
