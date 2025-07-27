import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/authconetxt';
import Sidebar from "./sidebar";

const AdminOrderManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const { authToken } = useAuth();

 
  useEffect(() => {
    const fetchOrders = async () => {
      if (!authToken) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('https://localhost:3001/order/admin/all', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
       
        setOrders(response.data);
        setFilteredOrders(response.data);
        
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authToken]);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (paymentFilter !== 'ALL') {
      filtered = filtered.filter(order => order.payment?.status === paymentFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'PROCESSING': return <Package className="w-4 h-4 text-orange-500" />;
      case 'SHIPPED': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'DELIVERED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-orange-100 text-orange-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`https://localhost:3001/order/admin/${orderId}/status`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      if (response.data.success) {
        const updatedOrders = orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      setError("Failed to update order status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderModal = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Order Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins">
            <div>
              <h3 className="font-medium text-lg mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-Regular">Order Number:</span> {order.orderNumber}</p>
                <p><span className="font-Regular">Date:</span> {formatDate(order.createdAt)}</p>
                <p><span className="font-Regular">Customer:</span> {order.user?.username || 'N/A'}</p>
                <p><span className="font-Regular">Email:</span> {order.user?.email || 'N/A'}</p>
                <div className="flex items-center gap-2">
                  <span className="font-Regular">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-Regular ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className='font-poppins'>
              <h3 className="font-medium text-lg mb-3">Payment Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-Regular">Method:</span> {order.payment?.method?.replace('_', ' ') || 'N/A'}</p>
                <div className="flex items-center gap-2">
                  <span className="font-Regular">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-Regular ${getPaymentStatusColor(order.payment?.status)}`}>
                    {order.payment?.status || 'N/A'}
                  </span>
                </div>
                {order.payment?.transactionId && (
                  <p><span className="font-Regular">Transaction ID:</span> {order.payment.transactionId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className='font-poppins'>
            <h3 className="font-medium text-lg mb-3">Shipping Address</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <p className="font-Regular">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
              {order.shippingAddress?.companyName && <p>{order.shippingAddress.companyName}</p>}
              <p>{order.shippingAddress?.streetAddress}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
              <p>{order.shippingAddress?.country}</p>
              <p>Phone: {order.shippingAddress?.phone}</p>
              
            </div>
          </div>

          {/* Order Items */}
          <div className="font-poppins">
            <h3 className="font-medium text-lg mb-3 ">Order Items</h3>
            <div className="space-y-3">
              {order.cartItems?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <img 
                    src={item.jewelry?.thumbnail ? `https://localhost:3001/${item.jewelry.thumbnail}` : '/placeholder-image.jpg'}
                    alt={item.jewelry?.name || 'Product'}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {e.target.src = '/placeholder-image.jpg'}}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.jewelry?.name || 'Product Name'}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">NPR {item.price?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-gray-600">Total: NPR {((item.price || 0) * (item.quantity || 0)).toLocaleString()}</p>
                  </div>
                </div>
              )) || <p>No items found</p>}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg font-poppins">
            <h3 className="font-medium text-lg mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>NPR {order.subtotal?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>NPR {order.shippingCost?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>NPR {order.total?.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className='font-poppins mt-6'>
            <h3 className="font-medium text-lg mb-3">Update Order Status</h3>
            <div className="flex gap-2 flex-wrap">
              {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(order._id, status)}
                  className={`px-3 py-1 rounded text-sm font-Regular transition-colors ${
                    order.status === status 
                      ? getStatusColor(status)
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-poppins">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
     <div className="flex h-screen bg-white font-poppins">
         <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 overflow-auto">
        {/* Header */}
       <div className="min-h-screen bg-gray-20 p-10">
          <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600 mb-5">Manage and track all customer orders</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Payments</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.orderNumber || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.cartItems?.length || 0} items</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.user?.username || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        NPR {order.total?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.payment?.status)}`}>
                          {order.payment?.status || 'N/A'}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{order.payment?.method?.replace('_', ' ') || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Modal */}
        {showOrderModal && selectedOrder && (
          <OrderModal 
            order={selectedOrder} 
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }} 
          />
        )}
      </div>
    </div>
  </div>
  );
};

export default AdminOrderManagement;