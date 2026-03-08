import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ANALYTICS, MACHINES, ALERTS, PRODUCTION_DATA, MONTHLY_PERFORMANCE, DEPARTMENT_STATS } from '../data/dummyData';
import { useLive } from '../context/LiveDataContext';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { Cpu, Users, AlertTriangle, TrendingUp, Package, Activity, ArrowUpRight, ArrowDownRight, Factory, Zap, Shield } from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'accent', trend, delay = 0 }) => {
  const colors = {
    accent: { text: 'text-factory-accent', bg: 'bg-factory-accent/10', border: 'border-factory-accent/30', glow: '0 0 20px #00D4FF22' },
    green: { text: 'text-factory-green', bg: 'bg-factory-green/10', border: 'border-factory-green/30', glow: '0 0 20px #00FF9422' },
    amber: { text: 'text-factory-amber', bg: 'bg-factory-amber/10', border: 'border-factory-amber/30', glow: '0 0 20px #FFB80022' },
    red: { text: 'text-factory-red', bg: 'bg-factory-red/10', border: 'border-factory-red/30', glow: '0 0 20px #FF386022' },
  };
  const c = colors[color];
  return (
    <div className="factory-card animate-fade-up" style={{ animationDelay: `${delay}ms`, boxShadow: c.glow }}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon size={18} className={c.text} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-mono ${trend >= 0 ? 'text-factory-green' : 'text-factory-red'}`}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className={`font-display text-3xl font-bold ${c.text} mb-1`} style={{ textShadow: `0 0 20px ${c.glow}` }}>
        {value}
      </div>
      <div className="font-body text-sm font-semibold text-factory-text">{title}</div>
      {subtitle && <div className="font-mono text-xs text-factory-dim mt-1">{subtitle}</div>}
    </div>
  );
};

const MachineStatusRow = ({ m }) => {
  const statusConfig = {
    operational: { dot: 'bg-factory-green', badge: 'badge-operational', label: 'OPERATIONAL' },
    warning: { dot: 'bg-factory-amber', badge: 'badge-warning', label: 'WARNING' },
    critical: { dot: 'bg-factory-red', badge: 'badge-critical', label: 'CRITICAL' },
    offline: { dot: 'bg-gray-500', badge: 'badge-offline', label: 'OFFLINE' },
  };
  const s = statusConfig[m.status];
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-factory-border/50 last:border-0">
      <div className={`status-dot ${s.dot}`}></div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-factory-text truncate">{m.name}</div>
        <div className="font-mono text-xs text-factory-dim">{m.location}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-xs text-factory-dim">{m.temperature}°C</div>
        <span className={s.badge}>{s.label}</span>
      </div>
      <div className="w-16">
        <div className="text-right font-mono text-xs text-factory-dim mb-1">{m.efficiency}%</div>
        <div className="h-1 bg-factory-border rounded overflow-hidden">
          <div className={`h-full rounded ${m.efficiency > 80 ? 'bg-factory-green' : m.efficiency > 60 ? 'bg-factory-amber' : 'bg-factory-red'}`}
            style={{ width: `${m.efficiency}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-factory-panel border border-factory-border rounded p-3 font-mono text-xs">
      <div className="text-factory-dim mb-2">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex gap-2" style={{ color: p.color }}>
          <span>{p.name}:</span><span className="font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [time, setTime] = useState(new Date());
  const { machines, alerts, analytics, lastUpdate, unreadCount } = useLive();
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const unread = alerts.filter(a => !a.read);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between animate-slide-in">
        <div>
          <h1 className="page-title">COMMAND CENTER</h1>
          <p className="text-factory-dim font-body text-sm mt-1">Real-time factory intelligence dashboard</p>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl text-factory-accent font-bold">{time.toLocaleTimeString('en-IN')}</div>
          <div className="font-mono text-xs text-factory-dim">{time.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      {/* Status banner */}
      <div className="flex items-center gap-4 bg-factory-panel border border-factory-border rounded-lg px-4 py-3 animate-fade-up">
        <div className="flex items-center gap-2">
          <div className="status-dot bg-factory-green"></div>
          <span className="font-mono text-xs text-factory-green">ALL SYSTEMS MONITORED</span>
        </div>
        <div className="h-4 w-px bg-factory-border"></div>
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-factory-amber" />
          <span className="font-mono text-xs text-factory-amber">{ANALYTICS.critical + ANALYTICS.warning} MACHINES NEED ATTENTION</span>
        </div>
        <div className="h-4 w-px bg-factory-border"></div>
        <div className="flex items-center gap-2">
          <AlertTriangle size={12} className="text-factory-red" />
          <span className="font-mono text-xs text-factory-red">{unread.length} UNREAD ALERTS</span>
        </div>
        <div className="ml-auto font-mono text-xs text-factory-dim">SHIFT: 08:00 — 16:00</div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Machines Online" value={`${machines.filter(m=>m.status==='operational').length}/${machines.length}`} subtitle={`${machines.filter(m=>m.status==='critical').length} critical · ${machines.filter(m=>m.status==='warning').length} warning`} icon={Cpu} color="accent" trend={5} delay={0} />
        <MetricCard title="Today's Production" value={analytics.productionToday} subtitle={`Target: ${analytics.productionTarget} units`} icon={Factory} color="green" trend={-7.6} delay={50} />
        <MetricCard title="Active Workers" value={`${analytics.activeWorkers}/${analytics.totalWorkers}`} subtitle="1 on leave" icon={Users} color="amber" trend={0} delay={100} />
        <MetricCard title="Active Alerts" value={unread.length} subtitle={`${analytics.inventoryAlerts} inventory · ${machines.filter(m=>m.status==='critical').length} critical`} icon={AlertTriangle} color="red" delay={150} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Production chart */}
        <div className="lg:col-span-2 factory-card animate-fade-up stagger-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-title">PRODUCTION OVERVIEW</div>
              <div className="text-sm font-medium text-factory-text mt-1">March 2026 — Daily Performance</div>
            </div>
            <NavLink to="/production" className="btn-secondary text-xs py-1 px-3">VIEW ALL</NavLink>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PRODUCTION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF94" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00FF94" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
              <XAxis dataKey="date" tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
              <YAxis tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="target" stroke="#00D4FF" strokeWidth={1.5} strokeDasharray="5 5" fill="url(#targetGrad)" name="Target" />
              <Area type="monotone" dataKey="actual" stroke="#00FF94" strokeWidth={2} fill="url(#actualGrad)" name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-factory-dim">
              <div className="w-6 h-px border border-dashed border-factory-accent"></div> Target
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-factory-dim">
              <div className="w-6 h-0.5 bg-factory-green rounded"></div> Actual
            </div>
          </div>
        </div>

        {/* Department radar */}
        <div className="factory-card animate-fade-up stagger-4">
          <div className="section-title mb-4">DEPT EFFICIENCY</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={DEPARTMENT_STATS}>
              <PolarGrid stroke="#1E3A5F" />
              <PolarAngleAxis dataKey="dept" tick={{ fill: '#5A7A9A', fontSize: 9, fontFamily: 'Share Tech Mono' }} />
              <Radar name="Efficiency" dataKey="efficiency" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.1} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Machine status */}
        <div className="factory-card animate-fade-up stagger-4">
          <div className="flex items-center justify-between mb-4">
            <div className="section-title">MACHINE STATUS</div>
            <NavLink to="/machines" className="btn-secondary text-xs py-1 px-3">VIEW ALL</NavLink>
          </div>
          <div>{machines.slice(0, 6).map(m => <MachineStatusRow key={m.id} m={m} />)}</div>
        </div>

        {/* Recent alerts */}
        <div className="factory-card animate-fade-up stagger-5">
          <div className="flex items-center justify-between mb-4">
            <div className="section-title">RECENT ALERTS</div>
            <NavLink to="/alerts" className="btn-secondary text-xs py-1 px-3">VIEW ALL</NavLink>
          </div>
          <div className="space-y-3">
            {unread.slice(0, 5).map(alert => (
              <div key={alert.id} className={`border rounded-lg p-3 ${alert.type === 'critical' ? 'border-factory-red/40 bg-factory-red/5' : alert.type === 'warning' ? 'border-factory-amber/40 bg-factory-amber/5' : 'border-factory-border'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-factory-text truncate">{alert.title}</div>
                    <div className="font-mono text-xs text-factory-dim mt-0.5">{alert.message.substring(0, 70)}...</div>
                  </div>
                  <span className={alert.type === 'critical' ? 'badge-critical' : alert.type === 'warning' ? 'badge-warning' : 'badge-operational'}>
                    {alert.type.toUpperCase()}
                  </span>
                </div>
                <div className="font-mono text-xs text-factory-dim mt-2">{alert.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly performance */}
      <div className="factory-card animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="section-title">6-MONTH PRODUCTION TREND</div>
            <div className="text-sm font-medium text-factory-text mt-1">Production units vs efficiency %</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={MONTHLY_PERFORMANCE} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
            <XAxis dataKey="month" tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <YAxis yAxisId="left" tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="production" fill="#00D4FF" fillOpacity={0.6} name="Production" radius={[3, 3, 0, 0]} />
            <Bar yAxisId="right" dataKey="efficiency" fill="#00FF94" fillOpacity={0.6} name="Efficiency %" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
