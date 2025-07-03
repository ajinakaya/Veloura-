const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead, deleteNotification } = require("../controller/notificationController");
const { authenticateToken } = require('../security/authentication');

router.get("/", authenticateToken, getNotifications);
router.patch("/:id", authenticateToken, markAsRead);
router.delete("/:id", authenticateToken, deleteNotification);

module.exports = router;