const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const upload = require('../middlewares/upload');
const { authenticateToken } = require('../security/authentication');
const {validateRegister,validateLogin,validateForgot,validateReset,validateChangePassword} = require('../validation/authvalidation');
const {registerUser,loginUser,forgetPassword,resetPassword,imageUpload,verifyOtp,changePassword} = require('../controller/authController');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false, 
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { error: 'Too many password reset requests, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', validateRegister, registerUser);
router.post('/login', loginLimiter,validateLogin, loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/forgetpassword',validateForgot, forgetPassword);
router.post('/resetpassword',passwordResetLimiter,validateReset, resetPassword);
router.post('/change-password', authenticateToken,validateChangePassword, changePassword);
router.post('/imageupload', authenticateToken, upload.single('image'), imageUpload);

module.exports = router;
