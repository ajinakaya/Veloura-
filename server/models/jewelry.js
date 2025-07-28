const mongoose = require("mongoose");

const jewelrySchema = new mongoose.Schema({
  name: String,

  description: {
    type: String,
  },

  sizes: [{ type: String }],
  price: Number,

  thumbnail: {
    type: String,
    required: false,
  },

  colorOptions: [
    {
      color: { type: String, required: true },
      colorCode: { type: String, required: false },
      furnitureimages: { type: [String], required: true },
    },
  ],

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  materials: [
    {
      icon: { type: String, required: false },
      label: { type: String, required: true },
      description: { type: String },
    },
  ],

  details: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],

  sizeGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SizeGuide",
  },

  tags: {
    type: [String],
    enum: ["New Arrival", "Best Seller", "Featured", "Popular", "Recommended"],
    default: [],
  },
});

module.exports = mongoose.model("Jewelry", jewelrySchema);
