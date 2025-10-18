const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  deadline: Date,
  completedAt: Date
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['AI', 'Climate', 'Biotech', 'Marketing', 'Social Impact']
  },
  skills: [{
    type: String,
    required: true
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedDuration: {
    type: Number, // in days
    required: true
  },
  tasks: [taskSchema],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['article', 'video', 'tutorial', 'tool', 'other']
    }
  }],
  prerequisites: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for project completion percentage
projectSchema.virtual('completionPercentage').get(function() {
  if (this.tasks.length === 0) return 0;
  const completedTasks = this.tasks.filter(task => task.status === 'done').length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

// Ensure virtual fields are serialized
projectSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);
