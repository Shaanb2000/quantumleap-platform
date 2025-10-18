const express = require('express');
const { body, validationResult } = require('express-validator');
const CommunityPost = require('../models/CommunityPost');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/community
// @desc    Get all community posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, projectId, authorId } = req.query;
    
    const filter = {};
    if (projectId) filter.projectRef = projectId;
    if (authorId) filter.author = authorId;

    const posts = await CommunityPost.find(filter)
      .populate('author', 'name email profile')
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
    console.error('Get community posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/community/:id
// @desc    Get single community post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('author', 'name email profile')
      .populate('projectRef', 'title domain')
      .populate('comments.author', 'name email profile');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Get community post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/community
// @desc    Create new community post
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('text').trim().isLength({ min: 10, max: 2000 }),
  body('projectRef').optional().isMongoId(),
  body('tags').optional().isArray(),
  body('attachments').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const postData = {
      ...req.body,
      author: req.userId
    };

    const post = new CommunityPost(postData);
    await post.save();

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('author', 'name email profile')
      .populate('projectRef', 'title domain');

    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    console.error('Create community post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/community/:id
// @desc    Update community post
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('text').optional().trim().isLength({ min: 10, max: 2000 }),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const updatedPost = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { ...req.body, isEdited: true },
        $currentDate: { updatedAt: true }
      },
      { new: true, runValidators: true }
    )
    .populate('author', 'name email profile')
    .populate('projectRef', 'title domain');

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Update community post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/community/:id
// @desc    Delete community post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete community post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/community/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.userId;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      isLiked: !isLiked,
      likeCount: post.likeCount
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/community/:id/comments
// @desc    Add comment to post
// @access  Private
router.post('/:id/comments', auth, [
  body('text').trim().isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      author: req.userId,
      text: req.body.text
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('comments.author', 'name email profile');

    const newComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/community/:id/comments/:commentId
// @desc    Update comment
// @access  Private
router.put('/:id/comments/:commentId', auth, [
  body('text').trim().isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.text = req.body.text;
    comment.isEdited = true;
    await post.save();

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/community/:id/comments/:commentId
// @desc    Delete comment
// @access  Private
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author or admin
    if (comment.author.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    post.comments.pull(req.params.commentId);
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
