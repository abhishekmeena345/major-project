const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const Student = require('../models/Student');

// ============================================
// @desc    Get notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
// ============================================
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  // Build query: global notifications OR targeted to user's role/branch/year
  let query = {
    $or: [
      { isGlobal: true },
      { targetRoles: userRole }
    ]
  };

  // If student, also filter by branch/year
  if (userRole === 'student') {
    const student = await Student.findOne({ userId });
    if (student) {
      const userBranch = student.personalInfo?.branch;
      const userYear = student.personalInfo?.year?.toString();
      
      // Add OR condition for targeted notifications matching branch/year
      query.$or.push({
        $and: [
          { targetBranches: { $in: [userBranch] } },
          { targetYears: { $in: [userYear] } }
        ]
      });
      
      // Also show if only branch matches (year not specified)
      query.$or.push({
        targetBranches: { $in: [userBranch] },
        targetYears: { $size: 0 }
      });
    }
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(50);

  // Add read status to each notification
  const notificationsWithReadStatus = notifications.map(notif => {
    const isRead = notif.readBy.some(r => r.userId.toString() === userId.toString());
    return {
      _id: notif._id,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      createdAt: notif.createdAt,
      read: isRead
    };
  });

  res.status(200).json({
    success: true,
    count: notificationsWithReadStatus.length,
    data: notificationsWithReadStatus
  });
});

// ============================================
// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
// ============================================
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  const alreadyRead = notification.readBy.some(
    r => r.userId.toString() === req.user._id.toString()
  );

  if (!alreadyRead) {
    notification.readBy.push({ userId: req.user._id, readAt: new Date() });
    await notification.save();
  }

  res.status(200).json({
    success: true,
    message: 'Marked as read'
  });
});

// ============================================
// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
// ============================================
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Notification.updateMany(
    { 'readBy.userId': { $ne: userId } },
    { $push: { readBy: { userId, readAt: new Date() } } }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// ============================================
// @desc    Delete notification (for user)
// @route   DELETE /api/notifications/:id
// @access  Private
// ============================================
const deleteNotification = asyncHandler(async (req, res) => {
  // For now, just mark as deleted per user or actually delete if TPO
  // Simple approach: TPO can delete, users just hide
  await Notification.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Notification removed'
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};