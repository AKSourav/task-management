const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description:{
    type: String,
    required: false,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        // Convert both startTime and endTime to Date objects before comparison
        const start = new Date(this.startTime);
        const end = new Date(v);
  
        // Ensure both are valid Date objects and endTime is after startTime
        return this.startTime && end > start;
      },
      message: 'End time must be after start time',
    },
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

// Middleware to update endTime on task completion
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'finished') {
    this.endTime = new Date();
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;