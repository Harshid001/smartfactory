import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Package, Cpu, Users } from 'lucide-react';
import { INVENTORY, WORKERS, ANALYTICS } from '../data/dummyData';
import { useLive } from '../context/LiveDataContext';

const MONTHLY_REVENUE = [
  { month: 'Oct', revenue: 4200000, cost: 2800000, profit: 1400000 },
  { month: 'Nov', revenue: 3900000, cost: 2700000, profit: 1200000 },
  { month: 'Dec', revenue: 4800000, cost: 3100000, profit: 1700000 },
  { month: 'Jan', revenue: 3600000, cost: 2600000, profit: 1000000 },
  { month: 'Feb', revenue: 4500000, cost: 2900000, profit: 1600000 },
  { month: 'Mar', revenue: 1200000, cost: 750000, profit: 450000 },
];

const COST_BREAKDOWN = [
  { name: 'Raw Materials', value: 42, color: '#00D4FF' },
  { name: 'Labor', value: 28, color: '#00FF94' },
  { name: 'Energy', value: 12, color: '#FFB800' },
  { name: 'Maintenance', value: 10, color: '#FF3860' },
  { name: 'Overhead', value: 8, color: '#8B5CF6' },
];

const PRODUCT_REVENUE = [
  { product: 'Auto Parts', revenue: 1800000, units: 1200, margin: 35 },
  { product: 'Hydraulic Comp.', revenue: 1100000, units: 430, margin: 42 },
  { product: 'Welded Assy.', revenue: 900000, units: 680, margin: 28 },
  { product: 'Plastic Molds', revenue: 600000, units: 950, margin: 22 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-factory-panel border border-factory-border rounded p-3 font-mono text-xs">
      <div className="text-factory-dim mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: <strong>₹{Number(p.value).toLocaleString()}</strong></div>
      ))}
    </div>
  );
};

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className="factory-card">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg bg-factory-bg border border-factory-border flex items-center justify-center`}>
          <Icon size={16} className={color} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-mono ${trend >= 0 ? 'text-factory-green' : 'text-factory-red'}`}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm font-medium text-factory-text mt-0.5">{label}</div>
      <div className="font-mono text-xs text-factory-dim">{sub}</div>
    </div>
  );
}

export default function CostRevenuePage() {
  const { analytics } = useLive();

  const todayRevenue = Math.round(analytics.productionToday * 2200);
  const todayCost = Math.round(todayRevenue * 0.63);
  const todayProfit = todayRevenue - todayCost;
  const inventoryValue = INVENTORY.reduce((s, i) => s + i.stock * i.unitCost, 0);
  const avgWorkerCost = 35000;
  const monthlyLabor = WORKERS.length * avgWorkerCost;

  return (
    <div className="space-y-6">
      <div className="animate-slide-in">
        <h1 className="page-title">COST & REVENUE ANALYTICS</h1>
        <p className="text-factory-dim font-body text-sm mt-1">Financial performance, cost breakdown, and profitability tracking</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up">
        <StatCard icon={TrendingUp} label="Today's Revenue" value={`₹${(todayRevenue / 1000).toFixed(0)}K`} sub={`${analytics.productionToday} units × avg ₹2,200`} color="text-factory-green" trend={4.2} />
        <StatCard icon={DollarSign} label="Today's Profit" value={`₹${(todayProfit / 1000).toFixed(0)}K`} sub={`${Math.round((todayProfit / todayRevenue) * 100)}% margin`} color="text-factory-accent" trend={2.1} />
        <StatCard icon={Package} label="Inventory Value" value={`₹${(inventoryValue / 100000).toFixed(1)}L`} sub="Current stock worth" color="text-factory-amber" />
        <StatCard icon={Users} label="Monthly Labor" value={`₹${(monthlyLabor / 100000).toFixed(1)}L`} sub={`${WORKERS.length} workers × ₹35K avg`} color="text-factory-dim" />
      </div>

      {/* Revenue vs Cost chart */}
      <div className="factory-card animate-fade-up stagger-2">
        <div className="section-title mb-4">REVENUE vs COST vs PROFIT — 6 MONTHS</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FF94" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00FF94" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
            <XAxis dataKey="month" tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <YAxis tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#00D4FF" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
            <Area type="monotone" dataKey="cost" stroke="#FF3860" fill="none" strokeWidth={1.5} strokeDasharray="5 5" name="Cost" />
            <Area type="monotone" dataKey="profit" stroke="#00FF94" fill="url(#profGrad)" strokeWidth={2} name="Profit" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-2">
          {[['Revenue', '#00D4FF'], ['Cost', '#FF3860'], ['Profit', '#00FF94']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs font-mono text-factory-dim">
              <div className="w-5 h-0.5 rounded" style={{ background: color }}></div> {label}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cost Breakdown Pie */}
        <div className="factory-card animate-fade-up stagger-3">
          <div className="section-title mb-4">COST BREAKDOWN</div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={COST_BREAKDOWN} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {COST_BREAKDOWN.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} contentStyle={{ background: '#111E32', border: '1px solid #1E3A5F', fontFamily: 'Share Tech Mono', fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {COST_BREAKDOWN.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: item.color }}></div>
                    <span className="font-mono text-xs text-factory-dim">{item.name}</span>
                  </div>
                  <span className="font-display font-bold text-sm text-factory-text">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Revenue */}
        <div className="factory-card animate-fade-up stagger-4">
          <div className="section-title mb-4">REVENUE BY PRODUCT</div>
          <div className="space-y-3">
            {PRODUCT_REVENUE.map(p => (
              <div key={p.product}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-factory-text text-sm">{p.product}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-factory-green">{p.margin}% margin</span>
                    <span className="font-display font-bold text-sm text-factory-accent">₹{(p.revenue / 100000).toFixed(1)}L</span>
                  </div>
                </div>
                <div className="h-2 bg-factory-bg rounded overflow-hidden">
                  <div className="h-full rounded bg-factory-accent transition-all duration-700"
                    style={{ width: `${(p.revenue / PRODUCT_REVENUE[0].revenue) * 100}%`, opacity: 0.7 }}></div>
                </div>
                <div className="font-mono text-xs text-factory-dim mt-0.5">{p.units} units sold</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI of AI/Automation */}
      <div className="factory-card glow-green animate-fade-up stagger-5">
        <div className="section-title mb-4 text-factory-green">AI & AUTOMATION ROI CALCULATOR</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Downtime Reduction', saving: '₹2.1L/month', how: 'Predictive maintenance prevents failures', icon: Cpu, color: 'text-factory-accent' },
            { label: 'Inventory Savings', saving: '₹85K/month', how: 'Auto-alerts prevent overstocking/stockouts', icon: Package, color: 'text-factory-amber' },
            { label: 'Productivity Gain', saving: '₹1.4L/month', how: 'Skill-based worker assignment (+12% efficiency)', icon: Users, color: 'text-factory-green' },
          ].map(({ label, saving, how, icon: Icon, color }) => (
            <div key={label} className="bg-factory-bg border border-factory-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={color} />
                <span className="font-medium text-factory-text text-sm">{label}</span>
              </div>
              <div className={`font-display text-xl font-bold ${color}`}>{saving}</div>
              <div className="font-mono text-xs text-factory-dim mt-1">{how}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-factory-border flex items-center justify-between">
          <div>
            <div className="font-mono text-xs text-factory-dim">TOTAL MONTHLY SAVINGS WITH AI AUTOMATION</div>
            <div className="font-display text-2xl font-bold text-factory-green mt-1">₹3.95L / month</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-factory-dim">ESTIMATED ROI PAYBACK PERIOD</div>
            <div className="font-display text-2xl font-bold text-factory-accent mt-1">4.2 months</div>
          </div>
        </div>
      </div>
    </div>
  );
}
