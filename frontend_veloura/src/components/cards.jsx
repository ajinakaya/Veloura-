import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/wishlistcontext";
import { useCart } from "../context/cartcontext";
import { toast } from "react-toastify";

const Productcards = ({ headline, subheading, products, tag }) => {
  const [visibleProducts] = useState(7);
  const { toggleWishlist, wishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isInWishlist = (productId) =>
    wishlist?.some(
      (item) => item.jewelry?._id === productId || item._id === productId
    );

  const handleWishlistToggle = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const wasInWishlist = isInWishlist(productId);

    try {
      toggleWishlist(productId);
      toast[wasInWishlist ? "info" : "success"](
        wasInWishlist ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch (error) {
      console.error("Wishlist toggle failed", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleSeeMore = () => {
    navigate(tag ? `/filter?tag=${encodeURIComponent(tag)}` : `/filter`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-poppins">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-gray-900">{headline}</h2>
        {subheading && (
          <p className="text-gray-500 mt-1 text-base">{subheading}</p>
        )}
      </div>

      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {Array.isArray(products) && products.length > 0 ? (
            products.slice(0, visibleProducts).map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="min-w-[300px] max-w-[300px] bg-white border border-black/20 rounded-xl hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative w-full h-[250px] overflow-hidden rounded-t-xl">
                  <img
                    src={`http://localhost:3001/${product.thumbnail}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => handleWishlistToggle(e, product._id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isInWishlist(product._id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                      fill={isInWishlist(product._id) ? "red" : "none"}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-grow p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Size: {product.sizes}
                    </p>
                    <p className="text-sm text-gray-500">Colors:</p>
                    <div className="flex gap-2 mt-1 mb-2">
                      {product.colorOptions?.slice(0, 4).map((option, idx) => (
                        <div
                          key={idx}
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: option.colorCode }}
                          title={option.color}
                        />
                      ))}
                    </div>
                    <p className="text-base font-medium text-gray-800">
                      Rs. {product.price?.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        await addToCart(product._id, 1);
                        toast.success("Added to cart");
                      } catch (err) {
                        console.error("Add to cart failed", err);
                        toast.error("Failed to add to cart");
                      }
                    }}
                    className="mt-2 bg-black/80 text-white text-sm font-medium rounded-md py-2 px-4 hover:bg-gray-800 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-lg text-center w-full">
              No products available.
            </p>
          )}

          {/* See More */}
          {products && visibleProducts < products.length && (
            <div className="flex-shrink-0 flex items-center justify-center min-w-[200px]">
              <button
                onClick={handleSeeMore}
                className="bg-[#B88E2F] text-white px-6 py-3 rounded-md hover:bg-[#9A7528] transition font-semibold"
              >
                See More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productcards;
