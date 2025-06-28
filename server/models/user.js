const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  resetCode: {
    type: String,
  },
  resetCodeExpires: {
    type: Date,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  
  passwordChangedAt: {
    type: Date,
  },
  passwordHistory: {
    type: [String], 
    default: [],
  },

  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
