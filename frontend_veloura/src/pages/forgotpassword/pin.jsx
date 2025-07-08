import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/logo.png";

const VerificationCode = () => {
  const [code, setCode] = useState(["", "", "", ""]);
 const email = localStorage.getItem("resetEmail") || "";
  const navigate = useNavigate();

  const handleCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    try {
      toast.success("Code verified");
      localStorage.setItem("resetCode", fullCode); 
      navigate("/set-new-password");
    } catch (err) {
      toast.error("Invalid code or expired");
    }
  };

  const handleResendCode = async () => {
    try {
      await axios.post("/forgetpassword", { email });
      toast.success("Code resent to your email");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to resend code");
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
              Enter your code
            </h1>
            <p className="text-gray-600">We sent a code to {email}</p>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-16 h-16 border border-gray-300 rounded-lg text-center text-2xl font-medium focus:outline-none"
                maxLength={1}
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full h-12 bg-[#3D3735] text-white rounded-lg text-base font-medium hover:bg-[#2D2623] transition-colors mb-6"
          >
            Continue
          </button>

          <div className="text-center mb-6">
            <span className="text-gray-600">Didn't receive code? </span>
            <button
              onClick={handleResendCode}
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Click here
            </button>
          </div>

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

export default VerificationCode;
