import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { Link } from "react-router-dom";

const Search = ({ onClose }) => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchText(value);
    setHasSearched(true);

    if (value.trim()) {
      try {
        const res = await axios.get(`/jewelry/search?search=${value}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error", err);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleSearchIconClick = () => {
    setHasSearched(true);
    if (searchText.trim()) {
      handleChange({ target: { value: searchText } });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex justify-center items-start pt-32 px-4 md:px-0"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl text-gray-400 hover:text-gray-700 z-50"
        >
          &times;
        </button>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jewelry..."
              value={searchText}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 text-sm border rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-300 outline-none"
            />
            <FiSearch
              onClick={handleSearchIconClick}
              className="absolute left-4 top-3.5 text-gray-500 text-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {!hasSearched ? (
            <div className="flex flex-col items-center justify-center h-60 text-center text-gray-500">
              <FiSearch className="text-3xl mb-3" />
              <p className="text-lg font-medium">Start your search</p>
              <p className="text-sm">Search by product name or category</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex justify-center items-center h-60 text-gray-500 text-sm">
              No results found.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  onClick={onClose}
                  className="flex gap-4 items-start p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
                >
                  <img
                    src={`https://localhost:3001/${item.thumbnail}`}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl border"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-gray-800 text-base line-clamp-1">
                        {item.name}
                      </h4>
                      <span className="text-gray-800 font-medium text-sm">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Size: {item.specifications?.dimensions?.overall || "N/A"}
                    </p>
                    <div className="flex items-center gap-1">
                      {item.colorOptions?.slice(0, 4).map((option, idx) => (
                        <div
                          key={idx}
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: option.colorCode }}
                          title={option.color}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
