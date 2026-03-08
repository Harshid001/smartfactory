const mongoose = require('mongoose');

/**
 * Worker Schema — employee profile and performance data
 */
const WorkerSchema = new mongoose.Schema({
  workerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  department: { type: String, required: true },
  role: { type: String, required: true },
  skills: [String],
  shift: {
    type: String,
    enum: ['Morning', 'Evening', 'Night'],
    default: 'Morning'
  },
  status: {
    type: String,
    enum: ['active', 'on-leave', 'inactive'],
    default: 'active'
  },
  performance: {
    score: { type: Number, default: 0, min: 0, max: 100 },
    completedTasks: { type: Number, default: 0 },
    pendingTasks: { type: Number, default: 0 },
  },
  safetyScore: { type: Number, default: 100, min: 0, max: 100 },
  assignedMachine: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', default: null },
  joinDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Worker', WorkerSchema);
