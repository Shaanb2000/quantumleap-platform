const express = require('express');
const { body, validationResult } = require('express-validator');
const { MentorshipRequest, Mentor } = require('../models/Mentorship');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/mentorship/mentors
// @desc    Get all mentors
// @access  Public
router.get('/mentors', async (req, res) => {
  try {
    const { domain, limit = 20, page = 1 } = req.query;
    
    const filter = { isActive: true };
    if (domain) filter.domains = domain;

    const mentors = await Mentor.find(filter)
      .populate('user', 'name email profile')
      .sort({ 'rating.average': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Mentor.countDocuments(filter);

    res.json({
      mentors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/mentorship/mentors/:id
// @desc    Get single mentor
// @access  Public
router.get('/mentors/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', 'name email profile');

    if (!mentor || !mentor.isActive) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json({ mentor });
  } catch (error) {
    console.error('Get mentor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/mentorship/mentors
// @desc    Create mentor profile
// @access  Private
router.post('/mentors', auth, [
  body('domains').isArray().isLength({ min: 1 }),
  body('bio').trim().isLength({ min: 50, max: 1000 }),
  body('experience').trim().isLength({ min: 10 }),
  body('availability.timezone').trim().isLength({ min: 1 }),
  body('availability.availableDays').isArray().isLength({ min: 1 }),
  body('availability.availableHours.start').trim().isLength({ min: 1 }),
  body('availability.availableHours.end').trim().isLength({ min: 1 }),
  body('hourlyRate').optional().isNumeric().isFloat({ min: 0 }),
  body('maxMentees').optional().isInt({ min: 1, max: 20 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has a mentor profile
    const existingMentor = await Mentor.findOne({ user: req.userId });
    if (existingMentor) {
      return res.status(400).json({ message: 'Mentor profile already exists' });
    }

    const mentorData = {
      ...req.body,
      user: req.userId
    };

    const mentor = new Mentor(mentorData);
    await mentor.save();

    // Update user role to mentor
    await User.findByIdAndUpdate(req.userId, { role: 'mentor' });

    const populatedMentor = await Mentor.findById(mentor._id)
      .populate('user', 'name email profile');

    res.status(201).json({
      message: 'Mentor profile created successfully',
      mentor: populatedMentor
    });
  } catch (error) {
    console.error('Create mentor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/mentorship/mentors/:id
// @desc    Update mentor profile
// @access  Private
router.put('/mentors/:id', auth, [
  body('domains').optional().isArray(),
  body('bio').optional().trim().isLength({ min: 50, max: 1000 }),
  body('experience').optional().trim().isLength({ min: 10 }),
  body('availability').optional(),
  body('hourlyRate').optional().isNumeric().isFloat({ min: 0 }),
  body('maxMentees').optional().isInt({ min: 1, max: 20 }),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if user is the mentor or admin
    if (mentor.user.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this mentor profile' });
    }

    const updatedMentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('user', 'name email profile');

    res.json({
      message: 'Mentor profile updated successfully',
      mentor: updatedMentor
    });
  } catch (error) {
    console.error('Update mentor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/mentorship/requests
// @desc    Create mentorship request
// @access  Private
router.post('/requests', auth, [
  body('mentor').isMongoId(),
  body('projectRef').optional().isMongoId(),
  body('message').trim().isLength({ min: 10, max: 500 }),
  body('scheduledAt').optional().isISO8601(),
  body('duration').optional().isInt({ min: 15, max: 120 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mentor, projectRef, message, scheduledAt, duration } = req.body;

    // Check if mentor exists and is active
    const mentorProfile = await Mentor.findById(mentor);
    if (!mentorProfile || !mentorProfile.isActive) {
      return res.status(404).json({ message: 'Mentor not found or inactive' });
    }

    // Check if mentor has capacity
    if (mentorProfile.currentMentees.length >= mentorProfile.maxMentees) {
      return res.status(400).json({ message: 'Mentor is at capacity' });
    }

    // Check for existing pending request
    const existingRequest = await MentorshipRequest.findOne({
      mentee: req.userId,
      mentor: mentor,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request with this mentor' });
    }

    const requestData = {
      mentee: req.userId,
      mentor,
      projectRef,
      message,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      duration: duration || 30
    };

    const request = new MentorshipRequest(requestData);
    await request.save();

    const populatedRequest = await MentorshipRequest.findById(request._id)
      .populate('mentee', 'name email profile')
      .populate('mentor', 'user')
      .populate('projectRef', 'title domain');

    res.status(201).json({
      message: 'Mentorship request created successfully',
      request: populatedRequest
    });
  } catch (error) {
    console.error('Create mentorship request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/mentorship/requests
// @desc    Get mentorship requests
// @access  Private
router.get('/requests', auth, async (req, res) => {
  try {
    const { status, type = 'all' } = req.query;
    
    let filter = {};
    
    if (type === 'sent') {
      filter.mentee = req.userId;
    } else if (type === 'received') {
      // Get mentor profile for current user
      const mentorProfile = await Mentor.findOne({ user: req.userId });
      if (mentorProfile) {
        filter.mentor = mentorProfile._id;
      } else {
        return res.json({ requests: [], total: 0 });
      }
    } else {
      // Get both sent and received requests
      const mentorProfile = await Mentor.findOne({ user: req.userId });
      filter = {
        $or: [
          { mentee: req.userId },
          ...(mentorProfile ? [{ mentor: mentorProfile._id }] : [])
        ]
      };
    }

    if (status) filter.status = status;

    const requests = await MentorshipRequest.find(filter)
      .populate('mentee', 'name email profile')
      .populate('mentor', 'user')
      .populate('projectRef', 'title domain')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Get mentorship requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/mentorship/requests/:id/status
// @desc    Update mentorship request status
// @access  Private
router.put('/requests/:id/status', auth, [
  body('status').isIn(['accepted', 'declined', 'completed']),
  body('meetingLink').optional().isURL(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, meetingLink, notes } = req.body;
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is the mentor for this request
    const mentorProfile = await Mentor.findById(request.mentor);
    if (!mentorProfile || mentorProfile.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    if (meetingLink) request.meetingLink = meetingLink;
    if (notes) request.notes = notes;

    // If accepted, add mentee to mentor's current mentees
    if (status === 'accepted') {
      mentorProfile.currentMentees.push(request.mentee);
      await mentorProfile.save();
    }

    await request.save();

    const populatedRequest = await MentorshipRequest.findById(request._id)
      .populate('mentee', 'name email profile')
      .populate('mentor', 'user')
      .populate('projectRef', 'title domain');

    res.json({
      message: 'Request status updated successfully',
      request: populatedRequest
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/mentorship/requests/:id/feedback
// @desc    Submit feedback for mentorship session
// @access  Private
router.post('/requests/:id/feedback', auth, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('feedback').trim().isLength({ min: 10, max: 500 }),
  body('type').isIn(['mentee', 'mentor'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, feedback, type } = req.body;
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is authorized to submit feedback
    const isMentee = request.mentee.toString() === req.userId;
    const mentorProfile = await Mentor.findById(request.mentor);
    const isMentor = mentorProfile && mentorProfile.user.toString() === req.userId;

    if (!isMentee && !isMentor) {
      return res.status(403).json({ message: 'Not authorized to submit feedback' });
    }

    if (type === 'mentee' && isMentee) {
      request.feedback.menteeRating = rating;
      request.feedback.menteeFeedback = feedback;
    } else if (type === 'mentor' && isMentor) {
      request.feedback.mentorRating = rating;
      request.feedback.mentorFeedback = feedback;
    } else {
      return res.status(400).json({ message: 'Invalid feedback type for user' });
    }

    await request.save();

    // Update mentor rating if mentee feedback
    if (type === 'mentee' && isMentee) {
      const mentor = await Mentor.findById(request.mentor);
      const allRatings = await MentorshipRequest.find({
        mentor: request.mentor,
        'feedback.menteeRating': { $exists: true }
      }).select('feedback.menteeRating');

      const ratings = allRatings.map(r => r.feedback.menteeRating).filter(r => r);
      const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

      mentor.rating.average = Math.round(average * 10) / 10;
      mentor.rating.count = ratings.length;
      await mentor.save();
    }

    res.json({
      message: 'Feedback submitted successfully',
      request
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
