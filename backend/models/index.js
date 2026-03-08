const mongoose = require('mongoose');

// ─── Inventory Item ─────────────────────────────────────────────
const InventorySchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Raw Material', 'Consumable', 'Tool', 'Spare Part', 'Finished Good', 'Safety'],
    required: true
  },
  unit: { type: String, required: true },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 0 },
  maxStock: { type: Number, default: 1000 },
  unitCost: { type: Number, default: 0 },
  supplier: { type: String },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

// Auto-check if low stock
InventorySchema.virtual('isLowStock').get(function() {
  return this.stock <= this.minStock;
});

// ─── Production Entry ───────────────────────────────────────────
const ProductionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  shift: { type: String, enum: ['Morning', 'Evening', 'Night'] },
  target: { type: Number, required: true },
  actual: { type: Number, default: 0 },
  department: { type: String },
  category: { type: String },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
}, { timestamps: true });

ProductionSchema.virtual('efficiency').get(function() {
  return ((this.actual / this.target) * 100).toFixed(2);
});

// ─── Alert ──────────────────────────────────────────────────────
const AlertSchema = new mongoose.Schema({
  type: { type: String, enum: ['critical', 'warning', 'info'], required: true },
  category: { type: String, enum: ['Machine', 'Inventory', 'Production', 'Worker', 'Maintenance', 'Safety'] },
  title: { type: String, required: true },
  message: { type: String, required: true },
  machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', default: null },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', default: null },
  read: { type: Boolean, default: false },
  resolvedAt: { type: Date },
}, { timestamps: true });

// ─── Safety Incident ────────────────────────────────────────────
const SafetyIncidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  worker: { type: String },
  type: { type: String },
  severity: { type: String, enum: ['low', 'medium', 'high'] },
  description: { type: String },
  status: { type: String, enum: ['open', 'investigating', 'resolved'], default: 'open' },
  resolvedAt: { type: Date },
}, { timestamps: true });

module.exports = {
  Inventory: mongoose.model('Inventory', InventorySchema),
  Production: mongoose.model('Production', ProductionSchema),
  Alert: mongoose.model('Alert', AlertSchema),
  SafetyIncident: mongoose.model('SafetyIncident', SafetyIncidentSchema),
};
