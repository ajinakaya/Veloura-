const express = require("express");
const router = express.Router();
const { authenticateToken , authorizeRole} = require("../security/authentication");
const AuthValidation = require("../validation/authvalidation");
const {
  findAllUsers,
  findUserById,
  updateUser,
  Profile,
  deleteUser,
} = require("../controller/userController");

router.get("/users", authenticateToken, authorizeRole("admin"), findAllUsers);
router.get("/users/:id", authenticateToken, authorizeRole("admin"), findUserById);
router.put("/users/:id",authenticateToken, updateUser);
router.delete("/users/:id",authenticateToken, deleteUser);
router.get("/Profile", authenticateToken, Profile);

module.exports = router;
