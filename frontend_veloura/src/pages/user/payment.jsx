import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/cartcontext";
import { useAuth } from "../../context/authconetxt";
import Navbar from "../../layout/navbar";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { authToken } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [createdOrderNumber, setCreatedOrderNumber] = useState(null);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  useEffect(() => {
    if (location.state) {
      setOrderData(location.state);
    } else {
      navigate("/checkout"); 
    }
  }, [location.state, navigate]);

  if (!orderData) return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-poppins">Loading order details...</div>;

  const { selectedShipping, formData, total } = orderData;

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method"); 
      return;
    }

    setLoading(true);
    try {
      const orderCreationResponse = await axios.post(
        "https://localhost:3001/order/create",
        {
          shippingMethod: selectedShipping.method,
          shippingAddress: formData,
          paymentMethod: paymentMethod,
          items: cart.map((item) => ({
            jewelryId: item.jewelry._id,
            quantity: item.quantity,
            price: item.jewelry.price,
          })),
          total: total,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (orderCreationResponse.data && orderCreationResponse.data.success) {
        const { orderNumber, orderId } = orderCreationResponse.data;
        setCreatedOrderNumber(orderNumber);
        setCreatedOrderId(orderId);

        console.log("Order created successfully in backend.");
        console.log("Received orderNumber:", orderNumber);
        console.log("Received orderId (from backend):", orderId);

        if (paymentMethod === "STRIPE") {
          const stripeSessionResponse = await axios.post(
            "https://localhost:3001/stripe/create-checkout-session",
            {
              items: cart.map((item) => ({
                name: item.jewelry.name,
                price: item.jewelry.price,
                quantity: item.quantity,
              })),
              orderId: orderId,
            },
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );

          if (stripeSessionResponse.data && stripeSessionResponse.data.url) {
            window.location.href = stripeSessionResponse.data.url; 
          } else {
            alert("Failed to initiate online payment. Please try again or choose Cash on Delivery.");
            setLoading(false);
          }
        } else if (paymentMethod === "CASH_ON_DELIVERY") {
          setShowSuccess(true);
          setTimeout(() => {
            clearCart();
            navigate(`/order-confirmation/${orderNumber}`);
          }, 3000);
        }
      } else {
        alert(orderCreationResponse.data?.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order or Payment failed", error);
      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      if (paymentMethod === "CASH_ON_DELIVERY") {
        setLoading(false); 
      }
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.jewelry.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 font-poppins"> 
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-gray-800">
              <span className="text-gray-400">Shipping</span> &gt;{" "}
              <span className="text-gray-400">Details</span> &gt;{" "}
              <span className="text-black">Payment</span> 
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10"> 
            {/* Left: Payment Form */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8"> 
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="space-y-4"> 
                  <label
                    className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition-all duration-200 ease-in-out
                      ${paymentMethod === "STRIPE"
                        ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="STRIPE"
                      checked={paymentMethod === "STRIPE"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="font-medium text-gray-800">Pay with Card (Stripe)</span>
                  </label>
                  <label
                    className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition-all duration-200 ease-in-out
                      ${paymentMethod === "CASH_ON_DELIVERY"
                        ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="font-medium text-gray-800">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {paymentMethod === "CASH_ON_DELIVERY" && (
                <div className="bg-green-50 p-6 rounded-lg mb-8 border border-green-200 shadow-sm"> {/* Increased padding, added shadow */}
                  <h4 className="font-semibold text-lg text-green-800 mb-3">Cash on Delivery</h4>
                  <p className="text-sm text-green-700">
                    Pay Rs. {total.toLocaleString()} when your order is delivered to your doorstep.
                  </p>
                </div>
              )}

              {/* Customer Info */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200"> {/* Added border, shadow */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h3>
                <div className="space-y-3 text-gray-700"> {/* Increased space */}
                  <p>
                    <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {formData.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {formData.phone}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span> {formData.streetAddress}, {formData.city}, {formData.province}, {formData.country}
                  </p>
                  <p>
                    <span className="font-medium">Shipping Method:</span> {selectedShipping.displayName}
                  </p>
                </div>
              </div>
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
                        sizes: {item.jewelry.sizes || 'N/A'}
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
                onClick={handlePlaceOrder} 
                disabled={loading} 
              >
                {loading ? "Processing..." : (paymentMethod === "STRIPE" ? `Pay with Stripe - Rs. ${total.toLocaleString()}` : `Place Order - Rs. ${total.toLocaleString()}`)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"> 
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center relative shadow-2xl"> 
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close success message"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"> 
              <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-green-700" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your order has been placed!
            </h3>
            <p className="text-gray-700 mb-8">
              Hi {formData.firstName}, we're processing your order!
              {paymentMethod === "CASH_ON_DELIVERY"
                ? " We will deliver your order soon."
                : ""}
            </p>

            <button
              onClick={() => {
                setShowSuccess(false);
                navigate(`/order-confirmation/${createdOrderNumber}`);
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-md"
            >
              View Order Details
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;