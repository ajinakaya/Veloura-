import React, { useState, useEffect } from 'react';
import { Gem, Users, Package, DollarSign, TrendingUp, Clock, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios'; 
import { useAuth } from '../../context/authconetxt'; 
import Sidebar from "./sidebar";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalJewelry: '...',
    totalUsers: '...',
    pendingOrders: '...',
    totalRevenue: '...',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [errorActivities, setErrorActivities] = useState(null);

  const { authToken } = useAuth();
  const API_BASE_URL = "https://localhost:3001";

  const fetchDashboardData = async () => {
    if (!authToken) {
      setErrorStats("Authentication token not found. Please log in.");
      setErrorActivities("Authentication token not found. Please log in.");
      setLoadingStats(false);
      setLoadingActivities(false);
      return;
    }

    let allOrders = [];
    let allJewelry = [];
    let allUsers = [];

    // Fetch Stats
    setLoadingStats(true);
    setErrorStats(null);
    try {

      const ordersRes = await axios.get(`${API_BASE_URL}/order/admin/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      allOrders = ordersRes.data; 

      const jewelryRes = await axios.get(`${API_BASE_URL}/jewelry/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      allJewelry = jewelryRes.data; 

      const usersRes = await axios.get(`${API_BASE_URL}/users/users`, { 
        headers: { Authorization: `Bearer ${authToken}` },
      });
      allUsers = usersRes.data; 

      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.payment?.status === 'PAID' ? order.total : 0), 0);
      const pendingOrdersCount = allOrders.filter(order => order.status === 'PENDING' || order.status === 'CONFIRMED').length;

      setStats({
        totalJewelry: allJewelry.length.toLocaleString(),
        totalUsers: allUsers.length.toLocaleString(),
        pendingOrders: pendingOrdersCount.toLocaleString(),
        totalRevenue: `Rs. ${totalRevenue.toLocaleString()}`,
      });

    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setErrorStats(`Failed to load stats: ${err.response?.data?.message || err.message}`);
   
      setLoadingStats(false);
      setLoadingActivities(false); 
      return; 
    } finally {
      setLoadingStats(false);
    }

    
    setLoadingActivities(true);
    setErrorActivities(null);
    try {
      const recentOrders = allOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(order => ({
          id: order._id,
          type: 'Order',
          description: `New order #${order.orderNumber} placed by ${order.user?.username || 'N/A'}`,
          time: new Date(order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          icon: Package,
        }));

      setRecentActivities(recentOrders);

    } catch (err) {
      console.error("Error fetching recent activities:", err);
      setErrorActivities(`Failed to load activities: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [authToken]);

  const renderCardContent = (isLoading, isError, value) => {
    if (isLoading) {
      return <Loader2 className="h-6 w-6 animate-spin text-gray-400" />;
    }
    if (isError) {
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    }
    return value;
  };

  return (
   <div className="flex h-screen bg-white font-poppins">
        <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
       <div className="flex-1 overflow-auto bg-white p-8">
        <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Jewelry */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Gem size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Jewelry</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                {renderCardContent(loadingStats, errorStats, stats.totalJewelry)}
              </h2>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                {renderCardContent(loadingStats, errorStats, stats.totalUsers)}
              </h2>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <Package size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500"> Orders</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                {renderCardContent(loadingStats, errorStats, stats.pendingOrders)}
              </h2>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-purple-100">
              <DollarSign size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                {renderCardContent(loadingStats, errorStats, stats.totalRevenue)}
              </h2>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activities</h2>
          {loadingActivities ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : errorActivities ? (
            <div className="text-center text-red-600 py-4">
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              <p>{errorActivities}</p>
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <Clock className="mx-auto h-8 w-8 mb-2" />
              <p>No recent activities found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="p-2 rounded-full bg-gray-100 flex-shrink-0">
                    <activity.icon size={20} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-Regular">{activity.description}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" /> {activity.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full
                    ${activity.type === 'Order' ? 'bg-blue-100 text-blue-800' :
                      activity.type === 'User' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'}`}>
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default DashboardPage;