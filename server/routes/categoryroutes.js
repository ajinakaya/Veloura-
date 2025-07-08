const express = require("express");
const router = express.Router();
const { authenticateToken , authorizeRole } = require("../security/authentication");

const {
  createCategory,
  getAllCategories,
  deleteCategory
} = require("../controller/categoryController");

router.get("/", getAllCategories);
router.post("/", authenticateToken, authorizeRole('admin'), createCategory);
router.delete("/:id", authenticateToken, authorizeRole('admin'), deleteCategory);


module.exports = router;
