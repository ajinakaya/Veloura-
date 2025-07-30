const bcrypt = require('bcrypt');
const User = require('../models/user');
const comparePassword = require('../helpers/auth').comparePassword;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { createNotification } = require("../controller/notificationController");
const { logActivity } = require("../utils/activitylogger");


const PASSWORD_EXPIRY_DAYS = 90;


const registerUser = async (req, res) => {
  try {
    const {username, email, password, confirmpassword, role } = req.body;

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password should be at least 8 characters long' });
    }
    if (password !== confirmpassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = Date.now() + 5 * 60 * 1000;

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      confirmpassword: hashedPassword,
      role,
      passwordChangedAt: new Date(),
      passwordHistory: [hashedPassword],
      otp,
      otpExpires: otpExpiry,
    });

    await createNotification(user.id, 'Welcome! You have successfully registered.');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `Veloura <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Veloura: Your Registration OTP Code',
      html: `<h2>Verify your account using this OTP:</h2><h1>${otp}</h1><p>This code will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({  message: 'User registered successfully. OTP sent to email.',
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Something went wrong during registration' });
  }
};

const isPasswordExpired = (user) => {
  if (!user.passwordChangedAt) return false;
  const expiryDate = new Date(user.passwordChangedAt);
  expiryDate.setDate(expiryDate.getDate() + PASSWORD_EXPIRY_DAYS);
  return new Date() > expiryDate;
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ error: 'Account is locked. Try again later.' });
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); 
        await user.save();
        return res.status(403).json({ error: 'Account locked due to failed login attempts.' });
      }
      await user.save();
      await logActivity({
      req,
      userId: user._id,
      action: "USER_LOGIN",
      details: {
        username: user.username,
        email: user.email,
      },
    });
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password expiry
    if (isPasswordExpired(user)) {
      return res.status(403).json({ error: 'Password expired. Please reset your password.' });
    }

    // Reset failed attempts & lock
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = Date.now();

    let warningMessage = null;
    if (user.passwordChangedAt) {
      const expiryDate = new Date(user.passwordChangedAt);
      expiryDate.setDate(expiryDate.getDate() + PASSWORD_EXPIRY_DAYS);
      const daysLeft = Math.floor((expiryDate - Date.now()) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 7 && daysLeft > 0) {
        warningMessage = `Your password will expire in ${daysLeft} day(s). Please consider changing it.`;
      }
    }

    await user.save();

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.cookie('jwtoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      warning: warningMessage,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `Veloura <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Veloura: Your Password Reset Code',
      html: `<h2>Enter this code to reset your password</h2><h1>${resetCode}</h1><p>This code will expire in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Code sent to email' });
  } catch (error) {
    console.error('Error in forgetPassword:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.resetCode !== code || !user.resetCodeExpires || user.resetCodeExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired reset code' });
    }

    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/;
    if (!passwordPolicy.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must include uppercase, lowercase, number, and special character.',
      });
    }

    // Check password reuse
    for (const oldHashed of user.passwordHistory || []) {
      const isSame = await bcrypt.compare(newPassword, oldHashed);
      if (isSame) {
        return res.status(400).json({
          error: 'You cannot reuse a recently used password.',
        });
      }
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      return res.status(400).json({
        error: 'New password cannot be the same as your current password.',
      });
    }

    user.passwordHistory = user.passwordHistory || [];
    user.passwordHistory.unshift(user.password);
    if (user.passwordHistory.length > 5) user.passwordHistory.pop();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    user.passwordChangedAt = new Date();
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/;
    if (!passwordPolicy.test(newPassword)) {
      return res.status(400).json({
        error: 'New password must include uppercase, lowercase, number, and special character.',
      });
    }

    // Check password reuse in history
    for (const oldHashed of user.passwordHistory || []) {
      const isSame = await bcrypt.compare(newPassword, oldHashed);
      if (isSame) {
        return res.status(400).json({
          error: 'You cannot reuse a recently used password.',
        });
      }
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      return res.status(400).json({
        error: 'New password cannot be the same as your current password.',
      });
    }

    user.passwordHistory = user.passwordHistory || [];
    user.passwordHistory.unshift(user.password);
    if (user.passwordHistory.length > 5) user.passwordHistory.pop();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


const imageUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const image = req.file.path || null;

    if (!image) return res.status(400).json({ error: 'Invalid file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.image = image;
    await user.save();

    await createNotification(user._id, 'Your profile image has been updated.');

    res.status(200).json({ message: 'Image uploaded successfully', imageUrl: image });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ error: 'OTP not generated or expired' });
    }

    if (Date.now() > user.otpExpires || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.cookie('jwtoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'An error occurred while verifying OTP' });
  }
};

// Logout user by clearing the JWT cookie
const logoutUser = (req, res) => {
  res.clearCookie('jwtoken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};


module.exports = {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  imageUpload,
  verifyOtp,
  changePassword,
  logoutUser
};
