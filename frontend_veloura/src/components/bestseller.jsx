import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BestsellerSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleShopNowClick = () => {
    navigate(`/filter?tag=${encodeURIComponent("Best Seller")}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/jewelry/tag/Best Seller");
        setProducts(response.data.slice(0, 4)); // Limit to 4 items
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#f9f3ee] font-[Poppins] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10">
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Timeless <span className="text-[#B88E2F]">Jewelry Best Sellers</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-md">
              Explore our most adored pieces—where luxury meets elegance.
            </p>
          </div>

          <button
            onClick={handleShopNowClick}
            className="bg-[#B88E2F] hover:bg-[#9A7528] text-white px-6 py-3 rounded-md font-medium transition"
          >
            Buy Now
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={`http://localhost:3001/${product.thumbnail}`}
                  alt={product.name}
                  className="w-full h-56 object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-[#B88E2F] font-medium">Rs {product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestsellerSection;
