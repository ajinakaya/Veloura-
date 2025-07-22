import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("pendingEmail");

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      navigate("/register");
    }
  }, [email, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Enter all 6 digits");
      return;
    }

    try {
      const res = await axios.post("/verify-otp", {
        email,
        otp: enteredOtp,
      });

      const { token } = res.data;
      localStorage.removeItem("pendingEmail");
    
      toast.success("OTP verified!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">
          OTP Verification
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>
        <div className="flex justify-between mb-6 space-x-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputRefs.current[idx] = el)}
              className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpVerification;
