// routes/notifications.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const auth =require ("../middlewares/auth");

// Create a new notification
router.post("/create", auth, async (req, res) => {
  try {
    const { userId, type, title, message, data } = req.body;
    
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data,
    });

    await notification.save();
    
    res.status(201).json(notification);
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all notifications for a user
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      userId: req.params.userId 
    }).sort({ createdAt: -1 }); // Most recent first
    
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Mark all notifications as read for a user
router.put("/mark-read/:userId", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { $set: { read: true } }
    );
    
    res.json({ msg: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Mark a specific notification as read
router.put("/mark-read/:notificationId/single", auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { $set: { read: true } },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }
    
    res.json(notification);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;