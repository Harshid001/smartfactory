// routes/machineRoutes.js
const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');
const { protect, authorize } = require('../middleware/auth');

// GET /api/machines — get all machines
router.get('/', protect, async (req, res) => {
  try {
    const { status, department } = req.query;
    const filter = { isActive: true };
    if (status) filter.status = status;
    if (department) filter.department = department;
    const machines = await Machine.find(filter).populate('assignedWorker', 'name workerId department');
    res.json({ success: true, count: machines.length, data: machines });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/machines/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const machine = await Machine.findOne({ machineId: req.params.id }).populate('assignedWorker');
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json({ success: true, data: machine });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/machines — create machine (Admin/Manager only)
router.post('/', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const machine = await Machine.create(req.body);
    res.status(201).json({ success: true, data: machine });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/machines/:id — update machine
router.put('/:id', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const machine = await Machine.findOneAndUpdate({ machineId: req.params.id }, req.body, { new: true, runValidators: true });
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json({ success: true, data: machine });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/machines/:id/sensors — update sensor readings
router.put('/:id/sensors', protect, async (req, res) => {
  try {
    const { temperature, vibration, runtime, efficiency } = req.body;
    const machine = await Machine.findOneAndUpdate(
      { machineId: req.params.id },
      { 'sensors.temperature': temperature, 'sensors.vibration': vibration, 'sensors.runtime': runtime, efficiency },
      { new: true }
    );
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json({ success: true, data: machine });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/machines/:id — soft delete
router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    await Machine.findOneAndUpdate({ machineId: req.params.id }, { isActive: false });
    res.json({ success: true, message: 'Machine deactivated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
