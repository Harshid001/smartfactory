# 🏭 SmartFactory AI — Industrial Management System

> **Hackathon Project** — AI-Powered Smart Manufacturing Management System with Machine & Workforce Optimization

![SmartFactory Dashboard](https://via.placeholder.com/1200x600/060B14/00D4FF?text=SmartFactory+AI+Dashboard)

---

## 🚀 Overview

SmartFactory AI is a full-stack industrial management platform that provides real-time monitoring, predictive analytics, and AI-driven optimization for manufacturing facilities.

## ✨ Key Features

| Module | Description |
|--------|-------------|
| 🖥️ Machine Health Monitoring | Real-time temperature, vibration, runtime tracking |
| 🔮 Predictive Maintenance | AI-powered failure prediction scoring |
| 📊 Production Tracking | Daily targets vs actual with efficiency analytics |
| 📦 Inventory Automation | Automated low-stock alerts and stock management |
| 🔔 Smart Alert System | Multi-category alert system with severity levels |
| 📈 Analytics Dashboard | Factory-wide KPIs and performance charts |
| 👥 Worker Management | Profiles, performance, skill-based assignment |
| 🛡️ Safety Monitoring | Incident tracking and compliance dashboard |
| 📄 Report Generation | CSV/PDF export for all modules |
| 🔐 Role-Based Auth | Admin / Manager / Worker access control |

---

## 🏗️ Project Structure

```
smartfactory/
├── frontend/                 # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       └── Layout.jsx        # Sidebar + Header
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # JWT Auth state
│   │   ├── data/
│   │   │   └── dummyData.js          # Complete sample data
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx     # Command Center
│   │   │   ├── MachinesPage.jsx      # Machine Health
│   │   │   ├── MaintenancePage.jsx   # Predictive Maint.
│   │   │   ├── ProductionPage.jsx    # Production Tracking
│   │   │   ├── InventoryPage.jsx     # Inventory Automation
│   │   │   ├── WorkersPage.jsx       # Workforce Mgmt
│   │   │   ├── AlertsPage.jsx        # Smart Alerts
│   │   │   ├── AnalyticsPage.jsx     # Analytics Dashboard
│   │   │   ├── ReportsPage.jsx       # Report Generation
│   │   │   └── SafetyPage.jsx        # Safety Monitoring
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
|   |__public
       |___ _redirects
|   |__ netlify.toml
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                  # Node.js + Express.js + MongoDB
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js           # JWT protection + role authorization
│   ├── models/
│   │   ├── Machine.js        # Machine schema
│   │   ├── Worker.js         # Worker schema
│   │   ├── User.js           # User/auth schema
│   │   └── index.js          # Inventory, Production, Alert, Safety
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── machineRoutes.js
│   │   ├── workerRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── productionRoutes.js
│   │   ├── alertRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   └── safetyRoutes.js
│   ├── utils/
│   └── seed.js           # Database seeder
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd smartfactory
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend will run at **http://localhost:5173**

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```
API will run at **http://localhost:5000**

### 4. Seed Database (Optional)

```bash
cd backend
npm run seed
```

---

## 🔐 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@factory.com | admin123 |
| Manager | manager@factory.com | manager123 |
| Worker | worker@factory.com | worker123 |

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      Register new user
POST   /api/auth/login         Login
GET    /api/auth/me            Get current user
```

### Machines
```
GET    /api/machines           All machines (filterable)
GET    /api/machines/:id       Machine by ID
POST   /api/machines           Create machine
PUT    /api/machines/:id       Update machine
PUT    /api/machines/:id/sensors  Update sensor data
DELETE /api/machines/:id       Deactivate machine
```

### Workers
```
GET    /api/workers            All workers
GET    /api/workers/:id        Worker by ID
POST   /api/workers            Create worker
PUT    /api/workers/:id        Update worker
```

### Inventory
```
GET    /api/inventory          All inventory
GET    /api/inventory/low-stock   Low stock items
POST   /api/inventory          Add item
PUT    /api/inventory/:id      Update item
```

### Analytics
```
GET    /api/analytics/overview   Factory overview stats
```

### Predictive Maintenance
```
GET    /api/maintenance/predict  AI failure risk predictions
```

---

## 🤖 AI Predictive Maintenance Algorithm

The failure risk score is calculated using weighted factors:

```
Risk Score = Temperature Weight (40 pts max)
           + Vibration Weight (30 pts max)
           + Maintenance Overdue Weight (25 pts max)
           + Efficiency Weight (15 pts max)
```

- **HIGH RISK** (≥70): Immediate maintenance required
- **MEDIUM RISK** (40-69): Schedule within 30 days
- **LOW RISK** (<40): Normal monitoring

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router v6 |
| Auth | JWT (simulated in frontend) |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Fonts | Orbitron, Rajdhani, Share Tech Mono |

---

## 📊 Database Schema

### Machine
```json
{
  "machineId": "M001",
  "name": "CNC Lathe Alpha",
  "type": "CNC Lathe",
  "department": "Machining",
  "location": "Bay A1",
  "status": "operational | warning | critical | offline",
  "sensors": { "temperature": 68, "vibration": 0.3, "runtime": 1420 },
  "efficiency": 94,
  "assignedWorker": "ObjectId",
  "maintenance": { "lastDate": "2026-02-10", "nextDate": "2026-04-10" }
}
```

### Worker
```json
{
  "workerId": "W001",
  "name": "Arjun Sharma",
  "department": "Machining",
  "role": "Senior Operator",
  "skills": ["CNC", "Milling", "QC"],
  "shift": "Morning",
  "status": "active",
  "performance": { "score": 92, "completedTasks": 48 },
  "safetyScore": 98,
  "assignedMachine": "ObjectId"
}
```

---

## 🏆 Hackathon Highlights

- ✅ **10 complete modules** covering all requirements
- ✅ **Full-stack MERN** with proper MVC architecture  
- ✅ **AI Predictive Engine** with multi-factor risk scoring
- ✅ **Professional dark theme** — Industrial grade UI
- ✅ **Role-based access** — Admin, Manager, Worker
- ✅ **Real-time charts** — Area, Bar, Radar, Pie charts
- ✅ **Export functionality** — CSV report downloads
- ✅ **Responsive design** — Works on all screen sizes
- ✅ **Worker-Machine Correlation Analysis**
- ✅ **Safety incident tracking** with compliance checklist

---

## 👨‍💻 Developer

**SmartFactory AI** — Built for hackathon showcase
Technology: MERN Stack + AI Analytics

---

*"Industry 4.0 — where intelligence meets manufacturing"*
