import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "../../context/ordercontext";
import Navbar from "../../layout/navbar";

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { currentOrder, loading, error, getOrderDetails } = useOrder();

  useEffect(() => {
    if (orderNumber) {
      getOrderDetails(orderNumber);
    }
  }, [orderNumber, getOrderDetails]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !currentOrder) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center ">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Order not found"}</p>
            <button
              onClick={() => navigate("/my-orders")}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              View All Orders
            </button>
          </div>
        </div>
      </>
    );
  }

  const order = currentOrder.order || currentOrder;
  const customer = currentOrder.customer || order.customer;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 font-poppins">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-[32px] font-semiblod text-black/90 mb-4">
              THANKS FOR YOUR ORDER !
            </h1>
            <p className="text-black/60 text-lg font-Regular">
              Hi {order.shippingAddress?.firstName || "Customer"}, we're getting
              your order to be shipped ! We will notify when it has been sent.
            </p>
            <p className="text-gray-500 text-sm mt-2  font-Regular">
              Order Number: {order.orderNumber || id}
            </p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-lg  border border-black/32 overflow-hidden max-w-2xl mx-auto">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-300">
              <h2 className="text-[24px] font-medium text-center">
                ORDER SUMMARY
              </h2>
            </div>

            {/* Items */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {order.cartItems &&
                  order.cartItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`https://localhost:3001/${item.jewelry.thumbnail}`}
                          alt={item.jewelry?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {item.jewelry?.name || "Product Name"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Size:{" "}
                          {item.jewelry.sizes ||
                            "N/A"}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Colors:</span>
                          <div
                            className="w-4 h-4  rounded-full border border-gray-300"
                            style={{
                              backgroundColor:
                                item.jewelry.colorOptions?.[0]?.colorCode ||
                                "#000",
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Sub Total</span>
                  <span>
                    Rs.{" "}
                    {order.subtotal?.toLocaleString() ||
                      (
                        order.total - (order.shippingCost || 100)
                      ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>
                    Rs. {order.shippingCost?.toLocaleString() || "100"}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 ">
                  <span>Total</span>
                  <span>Rs. {order.total?.toLocaleString() || "0"}</span>
                </div>
              </div>

              {/* Details Section */}
              <div className="mt-4 pt-6 border-t border-gray-300">
                <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span>{" "}
                      {order.shippingAddress?.email || customer?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Shipping Method:</span>{" "}
                      {order.shippingMethod?.method || "Standard Delivery"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Address:</span>{" "}
                      {order.shippingAddress
                        ? `${order.shippingAddress.streetAddress}, ${order.shippingAddress.city}`
                        : "Address not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h3 className="font-semibold text-gray-900 mb-4">Payment</h3>
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Method:</span>{" "}
                    {order.payment?.method || "N/A"}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Payment:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        order.payment?.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : order.payment?.status === "FAILED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.payment?.status || "Pending"}
                    </span>
                  </p>
                  {order.payment?.method === "DIRECT_BANK_TRANSFER" && (
                    <p className=" text-sm text-gray-600">
                      <span className="font-medium">Reference:</span>{" "}
                      {order.orderNumber}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">Order Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        order.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-8 space-x-4">
            <button
              onClick={() => navigate("/my-orders")}
              className="bg-black/80 text-white px-8 py-3 rounded-md hover:bg-black/90 transition-colors font-medium"
            >
              View All Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>

          {order.payment?.method === "DIRECT_BANK_TRANSFER" &&
            order.payment?.status === "PENDING" && (
              <div className="mt-8 max-w-2xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    Complete Your Payment
                  </h3>
                  <p className="text-blue-800 text-sm mb-4">
                    Please complete your bank transfer using the details
                    provided during checkout. Send the transaction receipt to
                    our WhatsApp: +977-9801234567
                  </p>
                  <div className="bg-white p-4 rounded border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Reference Number:</strong>{" "}
                      {order.orderNumber || id}
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Amount:</strong> Rs.{" "}
                      {order.total?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
