/**
 * SmartFactory — Database Seed Script
 * Run: node utils/seed.js
 */
const mongoose = require('mongoose');
require('dotenv').config();

const Machine = require('../models/Machine');
const Worker = require('../models/Worker');
const User = require('../models/User');
const { Inventory, Production, Alert, SafetyIncident } = require('../models/index');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartfactory';

const SEED_MACHINES = [
  { machineId: 'M001', name: 'CNC Lathe Alpha', type: 'CNC Lathe', department: 'Machining', location: 'Bay A1', status: 'operational', sensors: { temperature: 68, vibration: 0.3, runtime: 1420 }, efficiency: 94, maintenance: { lastDate: new Date('2026-02-10'), nextDate: new Date('2026-04-10') } },
  { machineId: 'M002', name: 'Hydraulic Press X2', type: 'Hydraulic Press', department: 'Forming', location: 'Bay B2', status: 'warning', sensors: { temperature: 89, vibration: 1.2, runtime: 2100 }, efficiency: 71, maintenance: { lastDate: new Date('2026-01-05'), nextDate: new Date('2026-03-05') } },
  { machineId: 'M003', name: 'Welding Bot WB-7', type: 'Robotic Welder', department: 'Assembly', location: 'Bay C1', status: 'operational', sensors: { temperature: 72, vibration: 0.5, runtime: 980 }, efficiency: 98, maintenance: { lastDate: new Date('2026-02-20'), nextDate: new Date('2026-05-20') } },
  { machineId: 'M004', name: 'Mill Pro 5000', type: 'Milling Machine', department: 'Machining', location: 'Bay A3', status: 'critical', sensors: { temperature: 104, vibration: 2.8, runtime: 3200 }, efficiency: 45, maintenance: { lastDate: new Date('2025-11-15'), nextDate: new Date('2026-01-15') } },
];

const SEED_USERS = [
  { name: 'Rajesh Kumar', email: 'admin@factory.com', password: 'admin123', role: 'Admin', department: 'Management' },
  { name: 'Kavya Iyer', email: 'manager@factory.com', password: 'manager123', role: 'Manager', department: 'Production' },
  { name: 'Arjun Sharma', email: 'worker@factory.com', password: 'worker123', role: 'Worker', department: 'Machining' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([Machine.deleteMany(), Worker.deleteMany(), User.deleteMany(), Inventory.deleteMany(), Alert.deleteMany()]);
  console.log('Cleared existing data');

  // Seed data
  await Machine.insertMany(SEED_MACHINES);
  console.log(`✅ Seeded ${SEED_MACHINES.length} machines`);

  for (const u of SEED_USERS) {
    await User.create(u);
  }
  console.log(`✅ Seeded ${SEED_USERS.length} users`);

  console.log('🌱 Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
