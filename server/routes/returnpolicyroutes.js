const express = require("express");
const router = express.Router();
const upload = require('../middlewares/upload');
const { authenticateToken ,authorizeRole } = require('../security/authentication');

const {
   createReturnPolicy,
   getAllReturnPolicies,
} = require("../controller/returnpolicyController");

router.get("/", getAllReturnPolicies);
router.post("/", authenticateToken,
  authorizeRole('admin'),upload.single("icon"),  createReturnPolicy);
;

module.exports = router;
