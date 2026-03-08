import React, { useState } from 'react';
import { PRODUCTION_DATA, PRODUCTION_CATEGORIES, MONTHLY_PERFORMANCE } from '../data/dummyData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Target, CheckCircle, BarChart3 } from 'lucide-react';

const COLORS = ['#00D4FF', '#00FF94', '#FFB800', '#FF3860'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-factory-panel border border-factory-border rounded p-3 font-mono text-xs">
      <div className="text-factory-dim mb-1">{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>)}
    </div>
  );
};

export default function ProductionPage() {
  const todayData = PRODUCTION_DATA[PRODUCTION_DATA.length - 1];
  const weekTotal = PRODUCTION_DATA.reduce((s, d) => s + d.actual, 0);
  const weekTarget = PRODUCTION_DATA.reduce((s, d) => s + d.target, 0);
  const avgEfficiency = (PRODUCTION_DATA.reduce((s, d) => s + d.efficiency, 0) / PRODUCTION_DATA.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="animate-slide-in">
        <h1 className="page-title">PRODUCTION TRACKING SYSTEM</h1>
        <p className="text-factory-dim font-body text-sm mt-1">Daily targets, actual output, and efficiency analysis</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up">
        {[
          { label: "Today's Output", value: todayData.actual, sub: `Target: ${todayData.target}`, color: 'text-factory-green', icon: CheckCircle },
          { label: "Today's Efficiency", value: `${todayData.efficiency}%`, sub: todayData.efficiency >= 100 ? '✓ TARGET MET' : '↓ BELOW TARGET', color: todayData.efficiency >= 100 ? 'text-factory-green' : 'text-factory-amber', icon: TrendingUp },
          { label: 'Week Total', value: weekTotal, sub: `Target: ${weekTarget}`, color: 'text-factory-accent', icon: BarChart3 },
          { label: 'Week Efficiency', value: `${avgEfficiency}%`, sub: 'Average this week', color: 'text-factory-accent', icon: Target },
        ].map(({ label, value, sub, color, icon: Icon }, i) => (
          <div key={label} className="factory-card animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className={color} />
              <span className="font-mono text-xs text-factory-dim">{label.toUpperCase()}</span>
            </div>
            <div className={`font-display text-3xl font-bold ${color}`}>{value}</div>
            <div className="font-mono text-xs text-factory-dim mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 factory-card animate-fade-up stagger-2">
          <div className="section-title mb-4">DAILY PRODUCTION — TARGET vs ACTUAL (MARCH 2026)</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={PRODUCTION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
              <XAxis dataKey="date" tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
              <YAxis tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="target" fill="#00D4FF" fillOpacity={0.3} name="Target" radius={[3, 3, 0, 0]} />
              <Bar dataKey="actual" fill="#00FF94" fillOpacity={0.8} name="Actual" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="factory-card animate-fade-up stagger-3">
          <div className="section-title mb-4">PRODUCTION BY CATEGORY</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PRODUCTION_CATEGORIES} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {PRODUCTION_CATEGORIES.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#111E32', border: '1px solid #1E3A5F', fontFamily: 'Share Tech Mono', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {PRODUCTION_CATEGORIES.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ background: COLORS[i] }}></div>
                  <span className="font-mono text-xs text-factory-dim">{cat.name}</span>
                </div>
                <span className="font-mono text-xs text-factory-text">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Efficiency trend */}
      <div className="factory-card animate-fade-up stagger-4">
        <div className="section-title mb-4">DAILY EFFICIENCY TREND (%)</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={PRODUCTION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
            <XAxis dataKey="date" tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <YAxis domain={[80, 110]} tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="efficiency" stroke="#00D4FF" strokeWidth={2} dot={{ fill: '#00D4FF', r: 3 }} name="Efficiency %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily production table */}
      <div className="factory-card animate-fade-up stagger-5">
        <div className="section-title mb-4">DAILY PRODUCTION REPORT</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-factory-border">
                {['Date', 'Target', 'Actual', 'Variance', 'Efficiency', 'Status'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-xs text-factory-dim tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRODUCTION_DATA.map(d => {
                const variance = d.actual - d.target;
                const isAbove = variance >= 0;
                return (
                  <tr key={d.date} className="border-b border-factory-border/30 hover:bg-factory-border/20 transition-colors">
                    <td className="py-3 px-3 text-factory-text">{d.date}</td>
                    <td className="py-3 px-3 text-factory-dim">{d.target}</td>
                    <td className={`py-3 px-3 font-bold ${isAbove ? 'text-factory-green' : 'text-factory-amber'}`}>{d.actual}</td>
                    <td className={`py-3 px-3 ${isAbove ? 'text-factory-green' : 'text-factory-red'}`}>{isAbove ? '+' : ''}{variance}</td>
                    <td className={`py-3 px-3 ${d.efficiency >= 100 ? 'text-factory-green' : d.efficiency >= 90 ? 'text-factory-accent' : 'text-factory-amber'}`}>{d.efficiency}%</td>
                    <td className="py-3 px-3">
                      <span className={d.efficiency >= 100 ? 'badge-operational' : d.efficiency >= 90 ? 'badge-warning' : 'badge-warning'}>
                        {d.efficiency >= 100 ? 'EXCEEDED' : d.efficiency >= 90 ? 'ON TRACK' : 'BELOW'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
