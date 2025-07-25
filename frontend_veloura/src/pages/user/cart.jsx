import React from "react";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Edit3, 
  Tag,
  Package,
} from "lucide-react";
import Navbar from "../../layout/navbar";
import { useCart } from "../../context/cartcontext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, loading, error, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce(
      (sum, item) => sum + (item.jewelry ? item.jewelry.price * item.quantity : 0),
      0
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600 font-poppins">Loading your cart...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg font-poppins">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">
              Your cart is empty
            </h2>
            <p className="text-gray-600 font-poppins">
              Add some products to get started
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-poppins"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-poppins">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">{cart.length} items in your cart</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            {/* Table Header - Desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 border-b border-gray-200 pb-4 mb-6">
              <div className="col-span-6">PRODUCT</div>
              <div className="col-span-2">QUANTITY</div>
              <div className="col-span-2">PRICE</div>
              <div className="col-span-2">TOTAL</div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item) => (
        
                item.jewelry ? (
                  <div
                    key={item.jewelry._id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="lg:col-span-6 flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={item.jewelry.thumbnail ? `https://localhost:3001/${item.jewelry.thumbnail}` : '/path/to/placeholder-image.jpg'} 
                            alt={item.jewelry.name || "No name"}
                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {item.jewelry.name || "No name"}
                          </h3>

                          {/* Color */}
                          <div className="flex items-center mt-2 space-x-2">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Color:</span>
                            <div
                              className="w-5 h-5 rounded-full border border-gray-300"
                              style={{
                            
                                backgroundColor:
                                  item.jewelry.colorOptions?.[0]?.colorCode || "#ccc",
                              }}
                            />
                          </div>

                          {item.jewelry.sizes && item.jewelry.sizes.length > 0 && (
                            <div className="flex items-center mt-1 space-x-2">
                              <Package className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                Size: {item.jewelry.sizes[0]}{" "}
                              </span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center mt-3 space-x-4">
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                              <Edit3 className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => removeFromCart(item.jewelry._id)}
                              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="lg:col-span-2 flex items-center justify-center lg:justify-start">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                addToCart(item.jewelry._id, -1);
                              }
                            }}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 h-10 flex items-center justify-center font-medium text-gray-900 border-x border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item.jewelry._id, 1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="lg:col-span-2 text-center lg:text-left">
                        <span className="text-lg font-semibold text-gray-900">
                          Rs. {item.jewelry.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="lg:col-span-2 text-center lg:text-right">
                        <span className="text-lg font-bold text-gray-900">
                          Rs.{" "}
                          {(item.jewelry.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                
                  <div key={`missing-${item._id}`} className="bg-white border border-red-200 rounded-xl p-4 text-red-600">
                    <p>Warning: Item with ID "{item.jewelry}" could not be loaded. It might have been deleted.</p>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Summary Details */}
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cart.length})</span>
                  <span>Rs. {calculateTotal().toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Rs. 0</span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>Rs. {calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 mt-6"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate("/")}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 mt-3"
              >
                Continue Shopping
              </button>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure checkout guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;