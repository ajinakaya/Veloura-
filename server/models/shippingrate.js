const mongoose = require('mongoose');

const ShippingRateSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["IN_STORE_PICKUP", "OUTSIDE_THE_VALLEY", "INSIDE_THE_VALLEY"],
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("ShippingRate", ShippingRateSchema);
