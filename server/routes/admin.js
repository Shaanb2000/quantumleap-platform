const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Project = require('../models/Project');
const CommunityPost = require('../models/CommunityPost');
const { MentorshipRequest, Mentor } = require('../models/Mentorship');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalPosts,
      totalMentors,
      totalRequests,
      recentUsers,
      recentProjects,
      recentPosts
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Project.countDocuments({ isActive: true }),
      CommunityPost.countDocuments(),
      Mentor.countDocuments({ isActive: true }),
      MentorshipRequest.countDocuments(),
      User.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      Project.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).select('title domain createdAt'),
      CommunityPost.find().sort({ createdAt: -1 }).limit(5).populate('author', 'name email')
    ]);

    const userGrowth = await User.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalProjects,
        totalPosts,
        totalMentors,
        totalRequests
      },
      recent: {
        users: recentUsers,
        projects: recentProjects,
        posts: recentPosts
      },
      userGrowth
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    
    const filter = { isActive: true };
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/users/:id/role', adminAuth, [
  body('role').isIn(['user', 'mentor', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Deactivate user
// @access  Private (Admin only)
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/posts
// @desc    Get all community posts for moderation
// @access  Private (Admin only)
router.get('/posts', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, moderated } = req.query;
    
    const filter = {};
    if (moderated !== undefined) filter.isModerated = moderated === 'true';

    const posts = await CommunityPost.find(filter)
      .populate('author', 'name email')
      .populate('projectRef', 'title domain')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommunityPost.countDocuments(filter);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get posts for moderation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/posts/:id/moderate
// @desc    Moderate community post
// @access  Private (Admin only)
router.put('/posts/:id/moderate', adminAuth, [
  body('isModerated').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isModerated } = req.body;
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { 
        isModerated,
        moderatedBy: req.userId
      },
      { new: true }
    ).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      message: `Post ${isModerated ? 'approved' : 'flagged'}`,
      post
    });
  } catch (error) {
    console.error('Moderate post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/requests
// @desc    Get all mentorship requests
// @access  Private (Admin only)
router.get('/requests', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const requests = await MentorshipRequest.find(filter)
      .populate('mentee', 'name email')
      .populate('mentor', 'user')
      .populate('projectRef', 'title domain')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MentorshipRequest.countDocuments(filter);

    res.json({
      requests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get mentorship requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/requests/:id/status
// @desc    Update mentorship request status (admin override)
// @access  Private (Admin only)
router.put('/requests/:id/status', adminAuth, [
  body('status').isIn(['pending', 'accepted', 'declined', 'completed']),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;
    const request = await MentorshipRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(notes && { notes })
      },
      { new: true }
    )
    .populate('mentee', 'name email')
    .populate('mentor', 'user')
    .populate('projectRef', 'title domain');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({
      message: 'Request status updated successfully',
      request
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/seed
// @desc    Seed database with sample data
// @access  Private (Admin only)
router.post('/seed', adminAuth, async (req, res) => {
  try {
    // This endpoint can trigger the seed script
    // In production, you might want to disable this
    res.json({ message: 'Seed endpoint - use npm run seed instead' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
