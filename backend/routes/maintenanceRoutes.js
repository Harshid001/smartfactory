// routes/maintenanceRoutes.js
const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');
const { protect } = require('../middleware/auth');

// Predictive maintenance — AI scoring logic
router.get('/predict', protect, async (req, res) => {
  try {
    const machines = await Machine.find({ isActive: true });
    const predictions = machines.map(m => {
      let riskScore = 0;
      if (m.sensors.temperature > 95) riskScore += 40;
      else if (m.sensors.temperature > 80) riskScore += 20;
      if (m.sensors.vibration > 2) riskScore += 30;
      else if (m.sensors.vibration > 1) riskScore += 15;
      const daysSince = m.maintenance.lastDate
        ? Math.floor((Date.now() - m.maintenance.lastDate) / (1000 * 60 * 60 * 24)) : 100;
      if (daysSince > 90) riskScore += 25;
      else if (daysSince > 60) riskScore += 15;
      if (m.efficiency < 60) riskScore += 15;
      else if (m.efficiency < 80) riskScore += 8;
      return {
        machineId: m.machineId, name: m.name, department: m.department,
        riskScore: Math.min(100, riskScore),
        riskLevel: riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW',
      };
    });
    res.json({ success: true, data: predictions.sort((a, b) => b.riskScore - a.riskScore) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
