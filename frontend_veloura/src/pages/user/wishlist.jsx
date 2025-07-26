import React from "react";
import { Heart, ShoppingCart, X, Star } from "lucide-react";
import Navbar from "../../layout/navbar";
import { useWishlist } from "../../context/wishlistcontext";
import { useCart } from "../../context/cartcontext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (jewelryId) => {
    try {
      await addToCart(jewelryId, 1);
      toast.success("Added to cart successfully");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Something went wrong");
    }
  };

  const handleAddAllToCart = async () => {
    try {
      for (const item of wishlist) {
        await addToCart(item.jewelry._id, 1);
      }
      toast.success("All items added to cart successfully");
    } catch (error) {
      console.error("Failed to add all items to cart:", error);
      toast.error("Something went wrong while adding all items");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600 font-poppins">
              Loading your wishlist...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg font-poppins">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 font-poppins">
              Add some products to get started
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-poppins">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[35px] font-medium mb-15 text-center">
            Wishlist
          </h1>
          <p className="text-gray-600">{wishlist.length} items saved</p>
        </div>

        <div className="hidden lg:grid grid-cols-12 gap-4 text-sm font-medium text-black/80 border-b border-gray-200 pb-4 mb-6">
          <div className="col-span-6">PRODUCT</div>
          <div className="col-span-2">COLOR</div>
          <div className="col-span-2">PRICE</div>
          <div className="col-span-2">ACTIONS</div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {wishlist.map((item) => {
            const jewelry = item?.jewelry || {};
            const color = jewelry.colorOptions?.[0]?.colorCode || "#ccc";
            const name = jewelry.name || "Unnamed";
            const price =
              typeof jewelry.price === "number"
                ? jewelry.price.toLocaleString()
                : "N/A";
            const thumbnail = jewelry.thumbnail;
            const rating = jewelry.rating || 4.5;
            const key = jewelry._id || item._id || Math.random();

            return (
              <div
                key={key}
                className="flex justify-between items-center border border-black/24 rounded-lg p-4 mb-6 "
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="lg:col-span-6 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {thumbnail ? (
                        <img
                          src={`https://localhost:3001/${thumbnail}`}
                          alt={name}
                          className="w-40 h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {name}
                      </h3>
                    </div>
                  </div>

                  {/* Color */}
                  <div className="lg:col-span-2 flex items-center space-x-2">
                    <span className="text-sm text-gray-600 lg:hidden">
                      Color:
                    </span>
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  </div>

                  {/* Price */}
                  <div className="lg:col-span-2">
                    <span className="text-sm text-gray-600 lg:hidden">
                      Price:{" "}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      Rs. {price}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex items-center space-x-3">
                    <button
                      onClick={() => handleAddToCart(jewelry._id)}
                      className="flex-1 lg:flex-none bg-black/80 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black/85 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(jewelry._id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-between items-center">
          <div className="space-x-4">
            <Link
              to="/"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
            <button
              onClick={handleAddAllToCart}
              className="px-6 py-2  bg-black/80 text-white rounded-md hover:bg-black/85 transition-colors duration-200"
            >
              Add All to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
