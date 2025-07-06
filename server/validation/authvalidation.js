const Joi = require('joi');

// Password policy: Strong password
const passwordPolicy = Joi.string()
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/)
  .message('Password must include uppercase, lowercase, number, and special character.');

// Register validation
const registerSchema = Joi.object({
  username: Joi.string().trim().required().min(3).max(255),
  email: Joi.string().trim().lowercase().required().email(),
  password: passwordPolicy.required(),
  confirmpassword: Joi.any().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' }),
  role: Joi.string().valid('user', 'admin').default('user'),
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().required().email(),
  password: Joi.string().required(),
});

// Forgot password (email only)
const forgotSchema = Joi.object({
  email: Joi.string().trim().lowercase().required().email(),
});

// Reset password (code + password)
const resetSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
  newPassword: passwordPolicy.required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordPolicy.required(),
  confirmNewPassword: Joi.any().valid(Joi.ref('newPassword')).required()
    .messages({ 'any.only': 'New passwords do not match' }),
});

// Middleware factory
function validate(schema) {
  return function (req, res, next) {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
  };
}

// Export validators
module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateForgot: validate(forgotSchema),
  validateReset: validate(resetSchema),
  validateChangePassword: validate(changePasswordSchema),
};
