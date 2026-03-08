import React, { useState } from 'react';
import { useLive } from '../context/LiveDataContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Zap, TrendingDown, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

// Energy consumption estimate per machine type (kWh/hr)
const MACHINE_POWER = {
  'CNC Lathe': 7.5, 'Hydraulic Press': 15, 'Robotic Welder': 5, 'Milling Machine': 12,
  'Conveyor': 2.5, 'Drill Press': 3, 'Injection Molder': 10, 'Laser Cutter': 8,
};

const HOURLY_ENERGY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  consumed: i >= 8 && i < 20 ? 45 + Math.sin(i * 0.6) * 12 + Math.random() * 8 : 8 + Math.random() * 4,
  cost: 0,
})).map(d => ({ ...d, cost: +(d.consumed * 6.5).toFixed(1) }));

const WEEKLY = [
  { day: 'Mon', kwh: 520, cost: 3380 }, { day: 'Tue', kwh: 495, cost: 3217 },
  { day: 'Wed', kwh: 541, cost: 3516 }, { day: 'Thu', kwh: 478, cost: 3107 },
  { day: 'Fri', kwh: 512, cost: 3328 }, { day: 'Sat', kwh: 210, cost: 1365 },
  { day: 'Sun', kwh: 0, cost: 0 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-factory-panel border border-factory-border rounded p-3 font-mono text-xs">
      <div className="text-factory-dim mb-1">{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>)}
    </div>
  );
};

export default function EnergyPage() {
  const { machines } = useLive();
  const [unit, setUnit] = useState('kwh'); // kwh or cost

  // Calculate energy per machine
  const machineEnergy = machines.map(m => ({
    ...m,
    powerKw: MACHINE_POWER[m.type] || 5,
    consumption: m.status === 'offline' ? 0 : +(((MACHINE_POWER[m.type] || 5) * (m.efficiency / 100)) + (m.status === 'critical' ? 3 : 0)).toFixed(1),
    costPerHr: +(((MACHINE_POWER[m.type] || 5) * (m.efficiency / 100)) * 6.5).toFixed(0),
    isWasting: m.status === 'critical' || (m.efficiency < 60 && m.status !== 'offline'),
  }));

  const totalKw = machineEnergy.filter(m => m.status !== 'offline').reduce((s, m) => s + m.consumption, 0);
  const totalCostHr = machineEnergy.filter(m => m.status !== 'offline').reduce((s, m) => s + m.costPerHr, 0);
  const wastingMachines = machineEnergy.filter(m => m.isWasting);
  const todayTotal = HOURLY_ENERGY.reduce((s, h) => s + h.consumed, 0).toFixed(0);
  const todayCost = HOURLY_ENERGY.reduce((s, h) => s + h.cost, 0).toFixed(0);

  return (
    <div className="space-y-6">
      <div className="animate-slide-in">
        <h1 className="page-title">ENERGY MONITORING</h1>
        <p className="text-factory-dim font-body text-sm mt-1">Real-time power consumption tracking and cost analysis</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up">
        {[
          { label: 'Current Load', value: `${totalKw.toFixed(1)} kW`, color: 'text-factory-accent', sub: 'Active machines' },
          { label: 'Cost / Hour', value: `₹${totalCostHr}`, color: 'text-factory-amber', sub: '@ ₹6.5/kWh' },
          { label: "Today's Usage", value: `${todayTotal} kWh`, color: 'text-factory-green', sub: `₹${parseInt(todayCost).toLocaleString()} spent` },
          { label: 'Wasting Energy', value: wastingMachines.length, color: 'text-factory-red', sub: 'Critical/inefficient' },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="factory-card text-center">
            <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
            <div className="font-body text-sm font-medium text-factory-text mt-1">{label}</div>
            <div className="font-mono text-xs text-factory-dim">{sub}</div>
          </div>
        ))}
      </div>

      {/* Waste alert */}
      {wastingMachines.length > 0 && (
        <div className="factory-card glow-red animate-fade-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-factory-red" />
            <div className="section-title text-factory-red">ENERGY WASTE DETECTED</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {wastingMachines.map(m => (
              <div key={m.id} className="bg-factory-red/5 border border-factory-red/30 rounded-lg p-3">
                <div className="font-medium text-factory-text text-sm">{m.name}</div>
                <div className="font-mono text-xs text-factory-dim mt-0.5">{m.status.toUpperCase()} · {m.efficiency}% efficiency</div>
                <div className="mt-2 font-display text-lg font-bold text-factory-red">{m.consumption} kW</div>
                <div className="font-mono text-xs text-factory-dim">consuming at low efficiency</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="factory-card animate-fade-up stagger-3">
          <div className="section-title mb-4">24-HOUR ENERGY CONSUMPTION (kWh)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={HOURLY_ENERGY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
              <XAxis dataKey="hour" tick={{ fill: '#5A7A9A', fontSize: 9, fontFamily: 'Share Tech Mono' }} interval={3} />
              <YAxis tick={{ fill: '#5A7A9A', fontSize: 9, fontFamily: 'Share Tech Mono' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="consumed" stroke="#00D4FF" fill="url(#energyGrad)" strokeWidth={2} name="kWh" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="factory-card animate-fade-up stagger-4">
          <div className="section-title mb-4">WEEKLY CONSUMPTION (kWh)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
              <XAxis dataKey="day" tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
              <YAxis tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="kwh" fill="#00FF94" fillOpacity={0.7} name="kWh" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-machine energy table */}
      <div className="factory-card animate-fade-up stagger-5">
        <div className="section-title mb-4">MACHINE ENERGY CONSUMPTION</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-factory-border">
                {['Machine', 'Type', 'Rated (kW)', 'Current (kW)', 'Cost/Hr', 'Efficiency', 'Status'].map(h => (
                  <th key={h} className="text-left py-3 px-2 text-xs text-factory-dim tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {machineEnergy.map(m => (
                <tr key={m.id} className={`border-b border-factory-border/30 hover:bg-factory-border/20 transition-colors ${m.isWasting ? 'bg-factory-red/5' : ''}`}>
                  <td className="py-2.5 px-2 text-factory-text font-medium">{m.name}</td>
                  <td className="py-2.5 px-2 text-factory-dim text-xs">{m.type}</td>
                  <td className="py-2.5 px-2 text-factory-dim">{m.powerKw}</td>
                  <td className={`py-2.5 px-2 font-bold ${m.isWasting ? 'text-factory-red' : 'text-factory-green'}`}>{m.consumption}</td>
                  <td className="py-2.5 px-2 text-factory-amber">₹{m.costPerHr}</td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-factory-bg rounded overflow-hidden">
                        <div className={`h-full rounded ${m.efficiency > 80 ? 'bg-factory-green' : m.efficiency > 60 ? 'bg-factory-amber' : 'bg-factory-red'}`} style={{ width: `${m.efficiency}%` }}></div>
                      </div>
                      <span className={m.efficiency > 80 ? 'text-factory-green' : m.efficiency > 60 ? 'text-factory-amber' : 'text-factory-red'}>{m.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={m.status === 'operational' ? 'badge-operational' : m.status === 'warning' ? 'badge-warning' : m.status === 'critical' ? 'badge-critical' : 'badge-offline'}>
                      {m.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
