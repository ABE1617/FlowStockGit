const express = require('express');
const router = express.Router();
const path = require('path');

// Authentication and role checking middleware
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');
//const authorizeRoles = require('../middleware/authorizeRoles');

// Notification controller
const notificationController = require('../Controller/notificationController');

// Route to send a notification
router.post('/admin/notifications/send', authenticate, authorizeRoles('admin'), notificationController.sendNotification);

// Route to get the notification history
router.get('/admin/notifications/history', authenticate, authorizeRoles('admin'), notificationController.getNotificationHistory);

module.exports = router;
