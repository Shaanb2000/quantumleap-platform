const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed'],
    default: 'pending'
  },
  scheduledAt: Date,
  duration: {
    type: Number, // in minutes
    default: 30
  },
  meetingLink: String,
  notes: String,
  feedback: {
    menteeRating: {
      type: Number,
      min: 1,
      max: 5
    },
    menteeFeedback: String,
    mentorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    mentorFeedback: String
  }
}, {
  timestamps: true
});

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  domains: [{
    type: String,
    enum: ['AI', 'Climate', 'Biotech', 'Marketing', 'Social Impact']
  }],
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  experience: {
    type: String,
    required: true
  },
  availability: {
    timezone: String,
    availableDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    availableHours: {
      start: String, // e.g., "09:00"
      end: String    // e.g., "17:00"
    }
  },
  hourlyRate: {
    type: Number,
    default: 0 // 0 for free mentorship
  },
  maxMentees: {
    type: Number,
    default: 5
  },
  currentMentees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for mentor profile completeness
mentorSchema.virtual('profileCompleteness').get(function() {
  let score = 0;
  const fields = ['bio', 'experience', 'domains', 'availability'];
  fields.forEach(field => {
    if (this[field] && (Array.isArray(this[field]) ? this[field].length > 0 : this[field])) {
      score += 25;
    }
  });
  return score;
});

// Ensure virtual fields are serialized
mentorSchema.set('toJSON', { virtuals: true });

module.exports = {
  MentorshipRequest: mongoose.model('MentorshipRequest', mentorshipRequestSchema),
  Mentor: mongoose.model('Mentor', mentorSchema)
};
