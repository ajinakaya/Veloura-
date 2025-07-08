import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/logo.png";

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");
  const code = localStorage.getItem("resetCode");

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const res = await axios.post("/resetpassword", {
        email,
        code,
        newPassword,
      });
      toast.success(res.data.message || "Password reset successful!");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetCode");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden font-Dosis relative">
      <div className="absolute top-6 left-10">
        <img src={logo} alt="Logo" className="h-24" />
      </div>

      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-2xl p-16 shadow-sm border border-gray-200 w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-medium text-gray-900 mb-2">
              Set new password
            </h1>
            <p className="text-gray-600">Must be at least 8 characters</p>
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full h-12 bg-[#3D3735] text-white rounded-lg text-base font-medium hover:bg-[#2D2623] transition-colors mb-6"
          >
            Reset Password
          </button>

          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:text-gray-800 flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
