import React, { useState } from 'react';
import { Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-50 text-gray-800 font-poppins border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          
          {/* Brand */}
          <div>
            <h2 className="text-[25px] font-bold mb-3 text-[#00000]">Veloura</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Timeless elegance crafted in gold, silver & gemstones. Discover brilliance in every piece.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">Collections</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Necklaces</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Rings</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Earrings</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Bracelets</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Warranty</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800"></h3>
            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#B88E2F]"
                  required
                />
                <button
                  type="submit"
                  className="px-2 py-2 bg-[#B88E2F] text-white text-[10px] font-medium hover:bg-[#A67E2A] transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
            
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#B88E2F] hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#B88E2F] hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#B88E2F] hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-sm text-gray-500">
            © 2025 <span className="text-[#000000] font-medium">Veloura</span>. Crafted with love & luxury.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
