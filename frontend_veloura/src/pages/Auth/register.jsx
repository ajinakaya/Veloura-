import React, { useState } from "react";
import { Eye, EyeOff, Mail, KeyRound, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import rightsideImage from "../../assets/circle1.jpg";
import logo from "../../assets/logo.png";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const evaluatePasswordStrength = (password) => {
    if (!password) return "";

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[\W_]/.test(password);
    const isLongEnough = password.length >= 8;

    const passedChecks = [
      hasLower,
      hasUpper,
      hasNumber,
      hasSpecial,
      isLongEnough,
    ].filter(Boolean).length;

    if (passedChecks <= 2) return "Weak";
    if (passedChecks === 3 || passedChecks === 4) return "Moderate";
    if (passedChecks === 5) return "Strong";

    return "";
  };
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });

    if (field === "password") {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!form.username) newErrors.username = "Username is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!form.email.includes("@")) newErrors.email = "Invalid email";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Password should be at least 8 characters";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords doesn't match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post("/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        confirmpassword: form.confirmPassword,
      });
      localStorage.setItem("pendingEmail", form.email);
      toast.success("Registration successful. Please verify your email.");
      navigate("/otp-verify");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden font-Dosis relative">
      {/* Logo */}
      <div className="absolute top-6 left-10">
        <img src={logo} alt="Logo" className="h-24" />
      </div>

      <div className="flex w-full h-full px-5 gap-x-10">
        {/* Left section */}
        <div className="w-[55%] flex items-center justify-end">
          <div className="w-full max-w-xl">
            <h1 className="text-[40px] font-medium text-black mb-5 text-center">
              Create your account
            </h1>

            {/* Username */}
            <div className="mb-3">
              <label className="block text-base font-medium text-gray-800 text-[16px] mb-2">
                Username
              </label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-[551px] h-[51.93px] pl-12 pr-4 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-base font-medium text-gray-800 text-[16px] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-[551px] h-[51.93px] pl-12 pr-4 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-base font-medium text-gray-800  text-[16px] mb-2">
                Password
              </label>
              <div className="relative w-[551px] h-[51.93px]">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full h-full pl-12 pr-12 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}

              {form.password && (
                <p
                  className={`text-sm mt-1 ${
                    passwordStrength === "Strong"
                      ? "text-green-600"
                      : passwordStrength === "Moderate"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Strength: {passwordStrength}
                </p>
              )}
            </div>

            {/* Confirm Password */}

            <div className="mb-3">
              <label className="block text-base font-medium text-gray-800 text-[16px] mb-2">
                Confirm Password
              </label>
              <div className="relative w-[551px] h-[51.93px]">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className="w-full h-full pl-12 pr-12 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <p className="text-[16px] text-center text-gray-700 mb-5">
              By signing up, you agree to our{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Terms of use
              </span>{" "}
              and{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Privacy policy
              </span>
            </p>

            {/* Sign Up Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ width: "378.37px", height: "55.93px" }}
              className={`bg-[#3D3735] text-white rounded-lg text-[20px] font-medium flex items-center justify-center mx-auto mb-2 ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#2D2623]"
              } transition-colors`}
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </button>

            <p className="text-base text-center text-gray-700 mt-2">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-500 hover:underline transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Right section - Image */}
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

export default RegisterPage;
