import { useEffect, useState } from "react";
import { useAuth } from "../../context/authconetxt";
import Sidebar from "./sidebar"; // Adjust path if needed

const API_BASE_URL = 'https://localhost:3001';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      if (!authToken) {
        setError("Unauthorized: Admin token missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/activitylog`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const data = await response.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error("Error fetching activity logs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [authToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700 font-semibold">Loading activity logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center">
          <p className="font-bold text-xl mb-2">Error!</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white font-poppins">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 overflow-auto bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Activity Logs</h1>
          <p className="text-gray-600 mb-6">
            Monitor system activities and user interactions across the platform.
          </p>

          {/* Activity Logs Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Activity Logs ({logs.length})</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Last updated: {new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs found</h3>
                  <p className="text-gray-500">
                    Start interacting with the system to see logs here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
                          User
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
                          email
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
                          User Agent
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log, index) => (
                        <tr 
                          key={log._id} 
                          className={`hover:bg-blue-50 transition-colors duration-150 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 font-medium">
                            {log.userId && typeof log.userId === "object"
                              ? log.userId.username || log.userId.email || "Unknown"
                              : "System/Unknown"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="bg-gray-50 p-2 rounded-md border border-gray-200 text-xs font-mono max-h-24 overflow-y-auto whitespace-pre-wrap">
                              {typeof log.userId.email === "object"
                                ? JSON.stringify(log.userId.email, null, 2)
                                : log.userId.email || "No details"}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700 font-mono">
                            {log.ipAddress || "N/A"}
                          </td>
                          <td className="py-3 px-4 max-w-[180px] truncate text-gray-700" title={log.userAgent}>
                            {log.userAgent || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {new Date(log.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(log.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Total Activity Logs: {logs.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;