// ============================================================
// DUMMY DATA — SmartFactory AI Management System
// ============================================================

export const CURRENT_USER = {
  id: 'u001',
  name: 'Rajesh Kumar',
  role: 'Admin',
  department: 'Management',
  avatar: 'RK',
  email: 'rajesh@smartfactory.in',
};

// --- MACHINES ---
export const MACHINES = [
  { id: 'M001', name: 'CNC Lathe Alpha', type: 'CNC Lathe', department: 'Machining', status: 'operational', temperature: 68, vibration: 0.3, runtime: 1420, efficiency: 94, lastMaintenance: '2026-02-10', nextMaintenance: '2026-04-10', assignedWorker: 'W003', location: 'Bay A1' },
  { id: 'M002', name: 'Hydraulic Press X2', type: 'Hydraulic Press', department: 'Forming', status: 'warning', temperature: 89, vibration: 1.2, runtime: 2100, efficiency: 71, lastMaintenance: '2026-01-05', nextMaintenance: '2026-03-05', assignedWorker: 'W002', location: 'Bay B2' },
  { id: 'M003', name: 'Welding Bot WB-7', type: 'Robotic Welder', department: 'Assembly', status: 'operational', temperature: 72, vibration: 0.5, runtime: 980, efficiency: 98, lastMaintenance: '2026-02-20', nextMaintenance: '2026-05-20', assignedWorker: 'W005', location: 'Bay C1' },
  { id: 'M004', name: 'Mill Pro 5000', type: 'Milling Machine', department: 'Machining', status: 'critical', temperature: 104, vibration: 2.8, runtime: 3200, efficiency: 45, lastMaintenance: '2025-11-15', nextMaintenance: '2026-01-15', assignedWorker: 'W001', location: 'Bay A3' },
  { id: 'M005', name: 'Conveyor Belt C3', type: 'Conveyor', department: 'Logistics', status: 'operational', temperature: 45, vibration: 0.2, runtime: 4100, efficiency: 99, lastMaintenance: '2026-02-28', nextMaintenance: '2026-05-28', assignedWorker: 'W006', location: 'Bay D1' },
  { id: 'M006', name: 'Drill Press DP-2', type: 'Drill Press', department: 'Machining', status: 'offline', temperature: 25, vibration: 0.0, runtime: 0, efficiency: 0, lastMaintenance: '2026-01-20', nextMaintenance: '2026-03-20', assignedWorker: null, location: 'Bay A2' },
  { id: 'M007', name: 'Injection Mold IM1', type: 'Injection Molder', department: 'Plastics', status: 'operational', temperature: 78, vibration: 0.4, runtime: 2300, efficiency: 91, lastMaintenance: '2026-02-15', nextMaintenance: '2026-05-15', assignedWorker: 'W004', location: 'Bay E1' },
  { id: 'M008', name: 'Laser Cutter LC9', type: 'Laser Cutter', department: 'Cutting', status: 'warning', temperature: 85, vibration: 0.9, runtime: 1750, efficiency: 76, lastMaintenance: '2026-01-30', nextMaintenance: '2026-03-30', assignedWorker: 'W007', location: 'Bay F1' },
];

export const MACHINE_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  temperature: 65 + Math.sin(i * 0.5) * 15 + Math.random() * 8,
  vibration: 0.2 + Math.sin(i * 0.3) * 0.5 + Math.random() * 0.3,
  efficiency: 80 + Math.sin(i * 0.4) * 15 + Math.random() * 5,
}));

// --- PRODUCTION ---
export const PRODUCTION_DATA = [
  { date: 'Mar 01', target: 500, actual: 487, efficiency: 97.4 },
  { date: 'Mar 02', target: 500, actual: 512, efficiency: 102.4 },
  { date: 'Mar 03', target: 500, actual: 498, efficiency: 99.6 },
  { date: 'Mar 04', target: 500, actual: 445, efficiency: 89.0 },
  { date: 'Mar 05', target: 500, actual: 521, efficiency: 104.2 },
  { date: 'Mar 06', target: 500, actual: 476, efficiency: 95.2 },
  { date: 'Mar 07', target: 500, actual: 503, efficiency: 100.6 },
  { date: 'Mar 08', target: 500, actual: 462, efficiency: 92.4 },
];

export const PRODUCTION_CATEGORIES = [
  { name: 'Auto Components', value: 38, color: '#00D4FF' },
  { name: 'Hydraulic Parts', value: 24, color: '#00FF94' },
  { name: 'Welded Assemblies', value: 20, color: '#FFB800' },
  { name: 'Plastic Molds', value: 18, color: '#FF3860' },
];

// --- INVENTORY ---
export const INVENTORY = [
  { id: 'INV001', name: 'Steel Rods (Grade A)', category: 'Raw Material', unit: 'kg', stock: 1200, minStock: 500, maxStock: 5000, unitCost: 85, supplier: 'Tata Steel', lastUpdated: '2026-03-07' },
  { id: 'INV002', name: 'Aluminum Sheets', category: 'Raw Material', unit: 'sheets', stock: 45, minStock: 100, maxStock: 1000, unitCost: 320, supplier: 'Hindalco', lastUpdated: '2026-03-06' },
  { id: 'INV003', name: 'Hydraulic Fluid', category: 'Consumable', unit: 'liters', stock: 280, minStock: 200, maxStock: 1000, unitCost: 45, supplier: 'Castrol', lastUpdated: '2026-03-08' },
  { id: 'INV004', name: 'Cutting Tools Set', category: 'Tool', unit: 'sets', stock: 12, minStock: 20, maxStock: 100, unitCost: 4500, supplier: 'Sandvik', lastUpdated: '2026-03-05' },
  { id: 'INV005', name: 'Welding Wire MIG', category: 'Consumable', unit: 'rolls', stock: 68, minStock: 30, maxStock: 200, unitCost: 850, supplier: 'ESAB', lastUpdated: '2026-03-07' },
  { id: 'INV006', name: 'Safety Gloves', category: 'Safety', unit: 'pairs', stock: 156, minStock: 50, maxStock: 500, unitCost: 120, supplier: 'Honeywell', lastUpdated: '2026-03-08' },
  { id: 'INV007', name: 'Bearing 6205', category: 'Spare Part', unit: 'pcs', stock: 8, minStock: 25, maxStock: 200, unitCost: 750, supplier: 'SKF', lastUpdated: '2026-03-04' },
  { id: 'INV008', name: 'Finished Gears', category: 'Finished Good', unit: 'pcs', stock: 342, minStock: 100, maxStock: 1000, unitCost: 2200, supplier: 'In-house', lastUpdated: '2026-03-08' },
];

// --- WORKERS ---
export const WORKERS = [
  { id: 'W001', name: 'Arjun Sharma', department: 'Machining', role: 'Senior Operator', skills: ['CNC', 'Milling', 'Quality Control'], shift: 'Morning', status: 'active', performance: 92, completedTasks: 48, pendingTasks: 3, safetyScore: 98, joinDate: '2019-06-15', assignedMachine: 'M004', phone: '+91-98765-43210' },
  { id: 'W002', name: 'Priya Patel', department: 'Forming', role: 'Machine Operator', skills: ['Hydraulic Press', 'Safety', 'Inspection'], shift: 'Morning', status: 'active', performance: 87, completedTasks: 42, pendingTasks: 5, safetyScore: 100, joinDate: '2020-03-22', assignedMachine: 'M002', phone: '+91-98765-43211' },
  { id: 'W003', name: 'Vikram Singh', department: 'Machining', role: 'CNC Specialist', skills: ['CNC', 'CAD/CAM', 'Turning'], shift: 'Morning', status: 'active', performance: 96, completedTasks: 55, pendingTasks: 2, safetyScore: 95, joinDate: '2018-09-10', assignedMachine: 'M001', phone: '+91-98765-43212' },
  { id: 'W004', name: 'Sneha Reddy', department: 'Plastics', role: 'Injection Specialist', skills: ['Injection Molding', 'Polymer', 'QC'], shift: 'Evening', status: 'active', performance: 89, completedTasks: 38, pendingTasks: 4, safetyScore: 97, joinDate: '2021-01-15', assignedMachine: 'M007', phone: '+91-98765-43213' },
  { id: 'W005', name: 'Rahul Mehta', department: 'Assembly', role: 'Welding Expert', skills: ['MIG Welding', 'TIG Welding', 'Robotics'], shift: 'Morning', status: 'active', performance: 94, completedTasks: 52, pendingTasks: 1, safetyScore: 99, joinDate: '2017-11-20', assignedMachine: 'M003', phone: '+91-98765-43214' },
  { id: 'W006', name: 'Anita Joshi', department: 'Logistics', role: 'Logistics Operator', skills: ['Conveyor Systems', 'Forklift', 'Inventory'], shift: 'Evening', status: 'on-leave', performance: 78, completedTasks: 31, pendingTasks: 8, safetyScore: 92, joinDate: '2022-05-18', assignedMachine: 'M005', phone: '+91-98765-43215' },
  { id: 'W007', name: 'Deepak Nair', department: 'Cutting', role: 'Laser Technician', skills: ['Laser Cutting', 'CAD', 'Precision Work'], shift: 'Morning', status: 'active', performance: 91, completedTasks: 46, pendingTasks: 3, safetyScore: 96, joinDate: '2020-08-12', assignedMachine: 'M008', phone: '+91-98765-43216' },
  { id: 'W008', name: 'Kavya Iyer', department: 'Management', role: 'Production Supervisor', skills: ['Production Planning', 'Team Management', 'ERP'], shift: 'Morning', status: 'active', performance: 98, completedTasks: 62, pendingTasks: 0, safetyScore: 100, joinDate: '2016-04-05', assignedMachine: null, phone: '+91-98765-43217' },
];

export const WORKER_PERFORMANCE = [
  { week: 'W1', arjun: 88, priya: 82, vikram: 94, sneha: 85 },
  { week: 'W2', arjun: 90, priya: 85, vikram: 95, sneha: 87 },
  { week: 'W3', arjun: 91, priya: 84, vikram: 97, sneha: 86 },
  { week: 'W4', arjun: 92, priya: 87, vikram: 96, sneha: 89 },
];

// --- ALERTS ---
export const ALERTS = [
  { id: 'A001', type: 'critical', category: 'Machine', title: 'Mill Pro 5000 — Critical Temperature', message: 'Machine M004 temperature at 104°C. Immediate shutdown recommended.', time: '2 min ago', machine: 'M004', read: false },
  { id: 'A002', type: 'warning', category: 'Machine', title: 'Hydraulic Press X2 — High Vibration', message: 'Vibration level 1.2 mm/s exceeds safe threshold. Schedule maintenance.', time: '15 min ago', machine: 'M002', read: false },
  { id: 'A003', type: 'warning', category: 'Inventory', title: 'Aluminum Sheets — Low Stock', message: 'Stock at 45 sheets (minimum: 100). Place order immediately.', time: '1 hr ago', machine: null, read: false },
  { id: 'A004', type: 'warning', category: 'Inventory', title: 'Cutting Tools — Below Minimum', message: 'Only 12 sets remaining. Minimum threshold is 20 sets.', time: '2 hr ago', machine: null, read: true },
  { id: 'A005', type: 'info', category: 'Production', title: 'Production Target Achieved', message: 'March 5 production exceeded target by 4.2%. Great performance!', time: '1 day ago', machine: null, read: true },
  { id: 'A006', type: 'critical', category: 'Maintenance', title: 'Mill Pro 5000 — Overdue Maintenance', message: 'Scheduled maintenance was due on Jan 15, 2026. Overdue by 52 days.', time: '3 hr ago', machine: 'M004', read: false },
  { id: 'A007', type: 'warning', category: 'Inventory', title: 'Bearings 6205 — Critical Low Stock', message: 'Only 8 pieces in stock. Minimum is 25. Production may halt.', time: '4 hr ago', machine: null, read: false },
  { id: 'A008', type: 'info', category: 'Worker', title: 'Anita Joshi — On Leave', message: 'Worker W006 is on leave. Conveyor Belt C3 needs reassignment.', time: '8 hr ago', machine: 'M005', read: true },
];

// --- SAFETY INCIDENTS ---
export const SAFETY_INCIDENTS = [
  { id: 'SI001', date: '2026-02-20', worker: 'Arjun Sharma', type: 'Near Miss', severity: 'low', description: 'Slippery floor near M004 station. Incident avoided.', status: 'resolved' },
  { id: 'SI002', date: '2026-01-15', worker: 'Priya Patel', type: 'Minor Injury', severity: 'medium', description: 'Minor hand cut from metal burr. First aid applied.', status: 'resolved' },
  { id: 'SI003', date: '2025-12-08', worker: 'Unknown', type: 'Equipment Damage', severity: 'high', description: 'Hydraulic hose burst on Press X2. No injuries.', status: 'resolved' },
];

// --- ANALYTICS OVERVIEW ---
export const ANALYTICS = {
  totalMachines: 8,
  operational: 5,
  warning: 2,
  critical: 1,
  offline: 1,
  overallEfficiency: 82,
  productionToday: 462,
  productionTarget: 500,
  activeWorkers: 7,
  totalWorkers: 8,
  alertCount: 5,
  inventoryAlerts: 3,
  revenueToday: 1014400,
  revenueTarget: 1100000,
};

export const MONTHLY_PERFORMANCE = [
  { month: 'Oct', production: 14200, efficiency: 91, incidents: 1 },
  { month: 'Nov', production: 13800, efficiency: 88, incidents: 2 },
  { month: 'Dec', production: 15100, efficiency: 94, incidents: 1 },
  { month: 'Jan', production: 13200, efficiency: 85, incidents: 3 },
  { month: 'Feb', target: 14000, production: 14650, efficiency: 92, incidents: 1 },
  { month: 'Mar', production: 3688, efficiency: 82, incidents: 0 },
];

export const DEPARTMENT_STATS = [
  { dept: 'Machining', efficiency: 80, workers: 3, machines: 3 },
  { dept: 'Assembly', efficiency: 98, workers: 1, machines: 1 },
  { dept: 'Forming', efficiency: 71, workers: 1, machines: 1 },
  { dept: 'Plastics', efficiency: 91, workers: 1, machines: 1 },
  { dept: 'Cutting', efficiency: 76, workers: 1, machines: 1 },
  { dept: 'Logistics', efficiency: 99, workers: 1, machines: 1 },
];
