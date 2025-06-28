
const mongoose = require("mongoose");

const returnPolicySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: "30 Days",
    },
    conditions: [
      {
        type: String,
      },
    ],
    icon: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReturnPolicy", returnPolicySchema);
