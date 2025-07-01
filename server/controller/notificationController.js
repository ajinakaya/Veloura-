const Notification = require("../models/notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: "Notification not found" });

    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: "Notification not found" });

    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await notification.deleteOne();
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      userId,
      message,
    });
    await notification.save();
  } catch (error) {
    console.error("Error creating notification:", error.message);
  }
};

module.exports = { getNotifications, markAsRead, deleteNotification, createNotification };
