import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Search as SearchIcon,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Settings,
  LogOut,
  Bell,
  PackageCheck,
} from "lucide-react";
import logo from "../assets/logo.png";
import Search from "../components/search";
import CategoryContainer from "../components/categorycontainer";
import { useCart } from "../context/cartcontext";
import { useWishlist } from "../context/wishlistcontext";
import { useAuth } from "../context/authconetxt";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Shop Now", action: "category" },
    { name: "About", path: "/aboutus" },
    { name: "Contact Us", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {!isHomePage && <div className="h-22"></div>}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-poppins ${
          isHomePage
            ? isScrolled
              ? "bg-white shadow-sm border-gray-300"
              : "bg-white/60 border-b border-black/28"
            : "bg-white shadow-sm border-b border-gray-300"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-22 relative">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Styelo Logo"
                  className="h-30 object-contain relative left-[-10px]"
                />
              </Link>
            </div>

            {/* Center Nav Links */}
            <nav className="hidden md:flex space-x-13 absolute left-1/3 transform translate-x-8">
              {navLinks.map(({ name, path, action }) =>
                action === "category" ? (
                  <button
                    key={name}
                    onClick={() => setShowCategory(true)}
                    className="text-[15px] font-medium text-black/90 hover:text-[#B88E2F]"
                  >
                    {name}
                  </button>
                ) : (
                  <Link
                    key={name}
                    to={path}
                    className={`text-[15px] font-medium transition ${
                      isActive(path)
                        ? "text-[#B88E2F]"
                        : "text-black/90 hover:text-[#B88E2F]"
                    }`}
                  >
                    {name}
                  </Link>
                )
              )}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-9">
        
              <div
                className="relative w-80 cursor-pointer"
                onClick={() => setShowSearch(true)}
              >
                <div className="w-full pl-4 pr-10 py-2 border border-black/30 rounded-full text-sm bg-white text-gray-500 flex items-center transition-all duration-200">
                  <SearchIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">Search for Jewelry...</span>
                </div>
              </div>

              {/* Wishlist */}
              <div className="relative">
                <Link to="/wishlist">
                  <Heart className="w-5 h-5 cursor-pointer stroke-2 text-black hover:text-[#B88E2F]" />
                  {wishlistCount > 0 && (
                    <span className="absolute -bottom-1 -right-2 bg-[#B88E2F] text-white text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Cart */}
              <div className="relative">
                <Link to="/cart">
                  <ShoppingCart className="w-5 h-5 cursor-pointer stroke-2 text-black hover:text-[#B88E2F]" />
                  {cartCount > 0 && (
                    <span className="absolute -bottom-1 -right-2 bg-[#B88E2F] text-white text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* User Icon */}
              <div className="relative">
                <User
                  className="w-5 h-5 cursor-pointer stroke-2 text-black hover:text-[#B88E2F]"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                />
                {showUserDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {user ? (
                      <div className="py-1 text-sm text-gray-800">
                        <div className="px-3 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            {user.image ? (
                              <img
                                src={`http://localhost:3001/${user.image}`}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-500" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {user?.username || "No Name"}
                              </div>
                              <div className="text-gray-500 text-xs truncate">
                                {user?.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Link
                          to="/profile-edit"
                          className="flex items-center px-3 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Settings className="w-4 h-4 mr-2 text-gray-500" />
                          Account
                        </Link>
                        <Link
                          to="/notifications"
                          className="flex items-center px-3 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Bell className="w-4 h-4 mr-2 text-gray-500" />
                          Notifications
                        </Link>
                        <Link
                          to="/my-orders"
                          className="flex items-center px-3 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <PackageCheck className="w-4 h-4 mr-2 text-gray-500" />
                          Orders
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2 text-red-500" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="py-1 text-sm text-gray-700">
                        <Link
                          to="/login"
                          className="block px-3 py-2 hover:bg-gray-50"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="block px-3 py-2 hover:bg-gray-50"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Register
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-black hover:text-[#B88E2F]"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 stroke-2" />
                ) : (
                  <Menu className="w-5 h-5 stroke-2" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div
              className={`md:hidden mt-2 border-t pt-2 ${
                isHomePage
                  ? isScrolled
                    ? "border-gray-300 bg-white"
                    : "border-white/30 bg-white/25"
                  : "border-gray-300 bg-white"
              }`}
            >
              {navLinks.map(({ name, path, action }) =>
                action === "category" ? (
                  <button
                    key={name}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowCategory(true);
                    }}
                    className="block w-full text-left px-3 py-2 font-medium text-black hover:text-[#B88E2F]"
                  >
                    {name}
                  </button>
                ) : (
                  <Link
                    key={name}
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 font-medium transition ${
                      isActive(path)
                        ? "text-[#B88E2F]"
                        : "text-black hover:text-[#B88E2F]"
                    }`}
                  >
                    {name}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      {showSearch && <Search onClose={() => setShowSearch(false)} />}
      {showCategory && <CategoryContainer onClose={() => setShowCategory(false)} />}
    </>
  );
};

export default Navbar;
