const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects (with optional filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { domain, difficulty, featured, limit = 20, page = 1 } = req.query;
    
    const filter = { isActive: true };
    
    if (domain) filter.domain = domain;
    if (difficulty) filter.difficulty = difficulty;
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email profile');

    if (!project || !project.isActive) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin only)
router.post('/', adminAuth, [
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('description').trim().isLength({ min: 10 }),
  body('domain').isIn(['AI', 'Climate', 'Biotech', 'Marketing', 'Social Impact']),
  body('skills').isArray().isLength({ min: 1 }),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']),
  body('estimatedDuration').isNumeric(),
  body('tasks').isArray(),
  body('resources').optional().isArray(),
  body('prerequisites').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const projectData = {
      ...req.body,
      createdBy: req.userId
    };

    const project = new Project(projectData);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Project created successfully',
      project: populatedProject
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin only)
router.put('/:id', adminAuth, [
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('domain').optional().isIn(['AI', 'Climate', 'Biotech', 'Marketing', 'Social Impact']),
  body('skills').optional().isArray(),
  body('difficulty').optional().isIn(['Beginner', 'Intermediate', 'Advanced']),
  body('estimatedDuration').optional().isNumeric(),
  body('tasks').optional().isArray(),
  body('resources').optional().isArray(),
  body('prerequisites').optional().isArray(),
  body('featured').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects/:id/tasks/:taskId/status
// @desc    Update task status
// @access  Private
router.post('/:id/tasks/:taskId/status', auth, [
  body('status').isIn(['todo', 'in-progress', 'done'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = project.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    if (status === 'done') {
      task.completedAt = new Date();
    }

    await project.save();

    res.json({
      message: 'Task status updated successfully',
      task,
      completionPercentage: project.completionPercentage
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/user/recommendations
// @desc    Get personalized project recommendations
// @access  Private
router.get('/user/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { limit = 10 } = req.query;
    
    // Get projects based on user interests
    const projects = await Project.find({
      isActive: true,
      domain: { $in: user.interests }
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.json({ projects });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
