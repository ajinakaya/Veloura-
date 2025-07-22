import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryContainer = ({ onClose }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (filterType, filterValue) => {
    onClose();
    const params = new URLSearchParams();
    if (filterValue) {
      params.append(filterType, filterValue);
      navigate(`/filter?${params.toString()}`);
    } else {
      navigate('/filter');
    }
  };

  const handleTagClick = (tag) => {
    handleCategoryClick('tag', tag);
  };

  const handleCategoryHeaderClick = (category) => {
    handleCategoryClick('category', category);
  };

  const handleSectorClick = (sector) => {
    handleCategoryClick('sector', sector);
  };

  const handleAllProductsClick = () => {
    handleCategoryClick('', '');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#D9D9D960] flex justify-center items-start pt-24 px-4 font-poppins"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-lg rounded-lg p-4 mx-auto relative"
        style={{ width: '414px', height: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-3 gap-4 text-[13px]">
          {/* Column 1: Tags */}
          <div className="space-y-1 border-r border-gray-200 pr-3">
            <button onClick={handleAllProductsClick} className="block text-gray-800 hover:text-blue-800 font-semibold text-left w-full">
              All Jewelry
            </button>
            <button onClick={() => handleTagClick('New Arrival')} className="block text-gray-800 hover:text-blue-600 text-left w-full">
              New Arrival
            </button>
            <button onClick={() => handleTagClick('Best Seller')} className="block text-gray-800 hover:text-blue-600 text-left w-full">
              Best Seller
            </button>
            <button onClick={() => handleTagClick('Trending')} className="block text-gray-800 hover:text-blue-600 text-left w-full">
              Trending
            </button>
            <button onClick={() => handleTagClick('Featured')} className="block text-gray-800 hover:text-blue-600 text-left w-full">
              Featured
            </button>
            <button onClick={() => handleTagClick('Limited Edition')} className="block text-gray-800 hover:text-blue-600 text-left w-full">
              Limited Edition
            </button>
          </div>

          {/* Column 2: Necklaces & Earrings */}
          <div className="space-y-1">
            <button onClick={() => handleCategoryHeaderClick('Necklaces')} className="text-gray-900 font-semibold mb-1 hover:text-blue-600 text-left w-full">
              Necklaces
            </button>
            <button onClick={() => handleSectorClick('Chains')} className="block text-gray-600 hover:text-blue-600 text-left w-full">
              Chains
            </button>
            <button onClick={() => handleSectorClick('Pendants')} className="block text-gray-600 hover:text-blue-600 text-left w-full">
              Pendants
            </button>
            <button onClick={() => handleSectorClick('Lockets')} className="block text-gray-600 hover:text-blue-600 text-left w-full">
              Lockets
            </button>

            <button onClick={() => handleCategoryHeaderClick('Earrings')} className="text-gray-900 font-semibold mt-2 mb-1 hover:text-blue-600 text-left w-full">
              Earrings
            </button>
            <button onClick={() => handleSectorClick('Studs')} className="block text-gray-600 hover:text-blue-600 text-left w-full">
              Studs
            </button>
            <button onClick={() => handleSectorClick('Hoops')} className="block text-gray-600 hover:text-blue-600 text-left w-full">
              Hoops
            </button>
            <button onClick={() => handleSectorClick('Dangles')} className="block text-gray-600 hover:text-blue-600 text-left w-full">
              Dangles
            </button>
          </div>

          {/* Column 3: Rings */}
          <div className="space-y-1">
            <button onClick={() => handleCategoryHeaderClick('Rings')} className="text-gray-900 font-semibold mb-1 hover:text-blue-600 text-left w-full">
              Rings
            </button>
            <button onClick={() => handleSectorClick('Engagement Rings')} className="block text-gray-600 hover:text-blue-600 text-left w-full">
              Engagement Rings
            </button>
            <button onClick={() => handleSectorClick('Statement Rings')} className="block text-gray-600 hover:text-blue-600 text-left w-full">
              Statement Rings
            </button>
            <button onClick={() => handleSectorClick('Stackable Rings')} className="block text-gray-600 hover:text-blue-600 text-left w-full">
              Stackable Rings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryContainer;
