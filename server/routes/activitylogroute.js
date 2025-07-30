const express = require("express");
const router = express.Router();
const { getActivityLogs } = require("../controller/activitylogcontroller");
const { authenticateToken ,authorizeRole } = require('../security/authentication');


router.get("/", authenticateToken, authorizeRole("admin"), getActivityLogs);

module.exports = router;
