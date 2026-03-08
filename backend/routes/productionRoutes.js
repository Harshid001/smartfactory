// routes/productionRoutes.js
const express = require('express');
const router = express.Router();
const { Production } = require('../models/index');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const entries = await Production.find().sort({ date: -1 }).limit(30);
    res.json({ success: true, data: entries });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const entry = await Production.create(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
