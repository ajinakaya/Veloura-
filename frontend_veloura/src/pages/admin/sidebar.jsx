import {
  Gem,Grid3X3, Ruler,RotateCcw, Users,LayoutDashboard,LogOut,Truck,Settings,Package,ChevronLeft,ChevronRight,
  ShipWheel,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const sidebarItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Jewelry", path: "/admin/jewelry", icon: Gem },
    { name: "Categories", path: "/admin/categories", icon: Grid3X3 },
    { name: "Size Guide", path: "/admin/size-guide", icon: Ruler },
    { name: "Return Policy", path: "/admin/return-policy", icon: RotateCcw },
    { name: "Shipping Rates", path: "/admin/shipping-rate", icon: Truck },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Orders", path: "/admin/orders", icon: Package },
  ];

  return (
    <div
      className={`
        ${isSidebarOpen ? "w-64" : "w-20"}
        bg-white text-gray-800 
        shadow-xl transition-all duration-300 ease-in-out relative
        flex flex-col min-h-screen rounded-r-xl overflow-hidden
        font-poppins
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200"> 
        {isSidebarOpen && (
          <h1 className="text-3xl font-semibold text-black tracking-wide"> 
            Veloura
          </h1>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" // Adjusted button colors
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 space-y-2 px-3">
        {sidebarItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            className={`flex items-center w-full p-3 rounded-lg text-left
              ${location.pathname === item.path
                ? "bg-blue-100 text-blue-700 shadow-sm" 
                : "hover:bg-gray-100 text-gray-700" 
              } transition-all duration-200 ease-in-out
            `}
          >
            <item.icon
              className={`${isSidebarOpen ? "mr-3" : "mx-auto"}`}
              size={20}
            />
            {isSidebarOpen && <span className="font-medium text-base">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-200 pt-4 pb-3 px-3"> 
        {isSidebarOpen && (
          <div className="mb-2">
            <Link to="/admin/settings" className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-left"> {/* Adjusted colors */}
              <Settings className="mr-3" size={20} />
              <span className="font-medium text-base">Settings</span>
            </Link>
          </div>
        )}
        <button className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors text-left"> {/* Adjusted colors */}
          <LogOut
            className={`${isSidebarOpen ? "mr-3" : "mx-auto"}`}
            size={20}
          />
          {isSidebarOpen && <span className="font-medium text-base">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;