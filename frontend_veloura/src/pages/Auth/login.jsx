import React, { useState } from "react";
import { Eye, EyeOff, Mail, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { useAuth } from "../../context/authconetxt"; 
import rightsideImage from "../../assets/circle1.jpg";
import logo from "../../assets/logo.png";

const SignInPage = () => {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!formValues.email.includes("@")) {
      newErrors.email = "Invalid email address";
    }

    if (!formValues.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post("https://localhost:3001/login", formValues);
      const { token, message, warning } = response.data;

      if (token) {
        const decoded = jwtDecode(token);
        const role = decoded.role;

        login(token); 
        toast.success(message || "Login successful!");
        if (warning) toast.warn(warning);

        if (role.toLowerCase() === "admin") {
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 300); 
        } else {
          navigate("/");
          window.location.reload(); 
        }
      } else {
        toast.error(message || "Login failed: No token received.");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.error || error.message);
      const errorMessage = error.response?.data?.error || "Login failed";
      toast.error(errorMessage);

      if (errorMessage.includes("Email not verified")) {
        toast.info("Please check your email for the verification code.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden font-Dosis relative">
      <div className="absolute top-6 left-10">
        <img src={logo} alt="Logo" className="h-24" />
      </div>

      <div className="flex w-full h-full px-5 gap-x-10">
        {/* Left Section */}
        <div className="w-[55%] flex items-center justify-end">
          <form onSubmit={handleSubmit} className="w-full max-w-xl">
            <h1 className="text-[54px] font-medium text-black mb-8 text-center">
              Sign in
            </h1>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-[17px] mb-3 text-gray-800">Email</label>
              <div className="relative w-[551px] h-[51.93px]">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="w-full h-full pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-[17px] mb-3 text-gray-800">Password</label>
              <div className="relative w-[551px] h-[51.93px]">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  className="w-full h-full pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Forgot Password */}
            <div className="w-[551px] text-right mb-8">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[16px] text-gray-600 hover:text-gray-700"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-[378.37px] h-[55.93px] bg-[#3D3735] text-white rounded-lg text-[20px] font-medium flex items-center justify-center mx-auto mb-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2D2623]"
              } transition-colors`}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            {/* Signup */}
            <p className="text-base text-center text-gray-700 mt-2">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:underline"
              >
                Signup
              </button>
            </p>
          </form>
        </div>

        {/* Right Section */}
        <div className="w-[52%] h-full flex items-center justify-start">
          <img
            src={rightsideImage}
            alt="Visual"
            className="w-[555px] h-[676px] object-cover rounded-[60px] rounded-br-[30px]"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
