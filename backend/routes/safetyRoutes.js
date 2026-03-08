const express = require('express');
const router = express.Router();
const { SafetyIncident } = require('../models/index');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const incidents = await SafetyIncident.find().sort({ date: -1 });
    res.json({ success: true, data: incidents });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const incident = await SafetyIncident.create(req.body);
    res.status(201).json({ success: true, data: incident });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id/resolve', protect, async (req, res) => {
  try {
    const incident = await SafetyIncident.findByIdAndUpdate(req.params.id, { status: 'resolved', resolvedAt: new Date() }, { new: true });
    res.json({ success: true, data: incident });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
