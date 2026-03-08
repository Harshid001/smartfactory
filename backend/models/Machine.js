const mongoose = require('mongoose');

/**
 * Machine Schema — stores machine health and performance data
 */
const MachineSchema = new mongoose.Schema({
  machineId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ['operational', 'warning', 'critical', 'offline'],
    default: 'operational'
  },
  sensors: {
    temperature: { type: Number, default: 0 },  // Celsius
    vibration:   { type: Number, default: 0 },  // mm/s
    runtime:     { type: Number, default: 0 },  // hours
  },
  efficiency: { type: Number, default: 100, min: 0, max: 100 },
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', default: null },
  maintenance: {
    lastDate: { type: Date },
    nextDate: { type: Date },
    history: [{
      date: Date,
      type: String,
      technician: String,
      notes: String,
    }]
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Machine', MachineSchema);
