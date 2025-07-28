const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    // required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  cartItems: [
    {
      jewelry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jewelry",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  // Shipping method
  shippingMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingRate",
    required: true
  },

  // Shipping address 
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, default: "Nepal" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    additionalInfo: { type: String }
  },
  // Payment Info
  payment: {
    method: {
      type: String,
      enum: ["STRIPE", "CASH_ON_DELIVERY","ONLINE_PAYMENT"],
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED"],
      default: "PENDING"
    },
    transactionId: { type: String }
  },
  // Pricing
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 }, 
  total: { type: Number, required: true },

  // Order Status
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING"
  }
}, { timestamps: true });

// Auto-generate order number
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `STY-${Date.now().toString().slice(-6)}-${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
