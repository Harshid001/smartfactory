// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');
const Worker = require('../models/Worker');
const { Inventory, Production, Alert } = require('../models/index');
const { protect } = require('../middleware/auth');

router.get('/overview', protect, async (req, res) => {
  try {
    const [machines, workers, inventory, alerts, production] = await Promise.all([
      Machine.find({ isActive: true }),
      Worker.find(),
      Inventory.find(),
      Alert.find({ read: false }),
      Production.find().sort({ date: -1 }).limit(7),
    ]);

    const machineStats = machines.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1; return acc;
    }, {});

    const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;
    const avgEfficiency = machines.length ? Math.round(machines.reduce((s, m) => s + m.efficiency, 0) / machines.length) : 0;

    res.json({
      success: true,
      data: {
        machines: { total: machines.length, ...machineStats, avgEfficiency },
        workers: { total: workers.length, active: workers.filter(w => w.status === 'active').length },
        inventory: { total: inventory.length, lowStock: lowStockCount },
        alerts: { unread: alerts.length },
        production: production.slice(0, 7),
      }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
