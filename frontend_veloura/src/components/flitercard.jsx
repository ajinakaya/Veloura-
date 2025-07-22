import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cartcontext";
import { toast } from "react-toastify";

const FilterCard = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="bg-white rounded-2xl transition-transform transform hover:scale-[1.03] border border-black/20 font-poppins">
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={`https://localhost:3001/${product.thumbnail}`}
          alt={product.name}
          className="w-full h-60 object-cover rounded-t-2xl"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-1">
            Size: {product.sizes || "N/A"}
          </p>
          <p className="text-lg font-medium text-black mb-3">
            Rs: {product.price?.toLocaleString()}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              await addToCart(product._id, 1);
              toast.success("Added to cart successfully");
            } catch (err) {
              console.error("Add to cart failed", err);
              toast.error("Failed to add to cart");
            }
          }}
          className="w-full bg-black/70 text-white py-2 rounded-xl font-medium hover:bg-black/80 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FilterCard;
