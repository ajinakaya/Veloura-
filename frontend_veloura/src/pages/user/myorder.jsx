import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../../context/ordercontext";
import Navbar from "../../layout/navbar";

const statusOrder = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

const OrderStatusTracker = ({ currentStatus }) => {
  return (
    <div className="mt-6 bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between relative">
        {statusOrder.map((step, index) => {
          const isReached = statusOrder.indexOf(currentStatus) >= index;
          const isActive = currentStatus === step;
          return (
            <div key={step} className="flex flex-col items-center z-10 relative">
              <div
                className={`w-8 h-8 rounded-full border-3 mb-2 flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 border-blue-600 shadow-lg scale-110"
                    : isReached
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                {isReached && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? "text-blue-700 font-bold"
                    : isReached
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
        
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full" style={{ zIndex: 1 }}>
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{
              width: `${(statusOrder.indexOf(currentStatus) / (statusOrder.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const { orders, loading, error, fetchOrders, cancelOrder } = useOrder();
  const navigate = useNavigate();
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelClick = (e, order) => {
    e.stopPropagation();
    setOrderToCancel(order);
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (!orderToCancel) return;

    setCancellingOrder(orderToCancel.orderNumber);
    setShowCancelDialog(false);

    try {
      await cancelOrder(orderToCancel.orderNumber);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setCancellingOrder(null);
      setOrderToCancel(null);
    }
  };

  const cancelDialog = () => {
    setShowCancelDialog(false);
    setOrderToCancel(null);
  };

  const canCancelOrder = (status) => {
    return status === "PENDING" || status === "CONFIRMED";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "border-l-emerald-500 bg-emerald-50";
      case "PENDING":
        return "border-l-amber-500 bg-amber-50";
      case "CANCELLED":
        return "border-l-red-500 bg-red-50";
      case "DELIVERED":
        return "border-l-blue-500 bg-blue-50";
      case "PROCESSING":
        return "border-l-purple-500 bg-purple-50";
      case "SHIPPED":
        return "border-l-indigo-500 bg-indigo-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "PENDING":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border border-red-200";
      case "DELIVERED":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "text-emerald-700 font-semibold";
      case "FAILED":
        return "text-red-700 font-semibold";
      default:
        return "text-amber-700 font-semibold";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your orders...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-poppins">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    My Orders
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">
                  Track and manage all your jewelry orders
                </p>
              </div>
              <div className="text-right">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {orders.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`bg-white rounded-2xl shadow-sm border-l-4 ${getStatusColor(
                    order.status
                  )} overflow-hidden hover:shadow-md transition-shadow duration-300`}
                >
                  <div className="p-8">
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            Order #{order.orderNumber}
                          </h3>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        
                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8V9m0 2h.01M15 21H9a2 2 0 01-2-2V9a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Order Date</span>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Total Amount</span>
                            </div>
                            <p className="font-bold text-xl text-gray-900">
                              Rs. {order.total.toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Payment Status</span>
                            </div>
                            <p className={`font-semibold ${getPaymentStatusColor(order.payment?.status)}`}>
                              {order.payment?.status || "PENDING"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {canCancelOrder(order.status) && (
                          <button
                            onClick={(e) => handleCancelClick(e, order)}
                            disabled={cancellingOrder === order.orderNumber}
                            className="px-6 py-3 border-2 border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:border-red-400"
                          >
                            {cancellingOrder === order.orderNumber ? (
                              <span className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-red-300 border-t-red-700 rounded-full animate-spin"></div>
                                <span>Cancelling...</span>
                              </span>
                            ) : (
                              "Cancel Order"
                            )}
                          </button>
                        )}
                        <button
                          className="px-6 py-3 bg-black/80 text-white rounded-xl hover:bg-black transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                          onClick={() =>
                            navigate(`/order-confirmation/${order.orderNumber}`)
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                    
                    {/* Status Tracker */}
                    <OrderStatusTracker currentStatus={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Cancel Confirmation Modal */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Cancel Order
                  </h3>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-gray-700 mb-4 text-lg">
                  Are you sure you want to cancel this order?
                </p>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Order Number:</span>
                    <span className="font-mono text-gray-700">#{orderToCancel?.orderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Amount:</span>
                    <span className="font-bold text-xl text-gray-900">Rs. {orderToCancel?.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={cancelDialog}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg"
                >
                  Keep Order
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;