import React, { useState } from 'react';
import { MACHINES, MACHINE_HISTORY } from '../data/dummyData';
import { useLive } from '../context/LiveDataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Thermometer, Activity, Clock, User, MapPin, Wrench, Search, Filter } from 'lucide-react';

const statusConfig = {
  operational: { dot: 'bg-factory-green', badge: 'badge-operational', glow: 'glow-green', label: 'OPERATIONAL' },
  warning: { dot: 'bg-factory-amber', badge: 'badge-warning', glow: 'glow-amber', label: 'WARNING' },
  critical: { dot: 'bg-factory-red', badge: 'badge-critical', glow: 'glow-red', label: 'CRITICAL' },
  offline: { dot: 'bg-gray-500', badge: 'badge-offline', glow: '', label: 'OFFLINE' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-factory-panel border border-factory-border rounded p-3 font-mono text-xs">
      <div className="text-factory-dim mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong></div>
      ))}
    </div>
  );
};

function MachineDetail({ machine, onClose }) {
  const s = statusConfig[machine.status];
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="factory-card w-full max-w-2xl max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="status-dot" style={{ width: 10, height: 10, borderRadius: '50%', display: 'inline-block', background: machine.status === 'operational' ? '#00FF94' : machine.status === 'warning' ? '#FFB800' : machine.status === 'critical' ? '#FF3860' : '#666' }}></div>
              <h2 className="font-display text-lg font-bold text-factory-accent">{machine.name}</h2>
            </div>
            <div className="font-mono text-xs text-factory-dim mt-1">{machine.id} · {machine.type} · {machine.department}</div>
          </div>
          <button onClick={onClose} className="text-factory-dim hover:text-factory-text font-mono text-xl leading-none">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: Thermometer, label: 'Temperature', value: `${machine.temperature}°C`, color: machine.temperature > 90 ? 'text-factory-red' : machine.temperature > 75 ? 'text-factory-amber' : 'text-factory-green' },
            { icon: Activity, label: 'Vibration', value: `${machine.vibration} mm/s`, color: machine.vibration > 2 ? 'text-factory-red' : machine.vibration > 1 ? 'text-factory-amber' : 'text-factory-green' },
            { icon: Clock, label: 'Runtime', value: `${machine.runtime} hrs`, color: 'text-factory-accent' },
            { icon: Cpu, label: 'Efficiency', value: `${machine.efficiency}%`, color: machine.efficiency > 80 ? 'text-factory-green' : machine.efficiency > 60 ? 'text-factory-amber' : 'text-factory-red' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-factory-bg border border-factory-border rounded-lg p-3 flex items-center gap-3">
              <Icon size={16} className={color} />
              <div>
                <div className="font-mono text-xs text-factory-dim">{label}</div>
                <div className={`font-display text-lg font-bold ${color}`}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="section-title mb-3">24-HOUR PERFORMANCE</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={MACHINE_HISTORY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
              <XAxis dataKey="hour" tick={{ fill: '#5A7A9A', fontSize: 9, fontFamily: 'Share Tech Mono' }} interval={3} />
              <YAxis tick={{ fill: '#5A7A9A', fontSize: 9, fontFamily: 'Share Tech Mono' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="temperature" stroke="#FF3860" strokeWidth={1.5} dot={false} name="Temp °C" />
              <Line type="monotone" dataKey="efficiency" stroke="#00FF94" strokeWidth={1.5} dot={false} name="Efficiency %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-mono text-xs text-factory-dim mb-1">ASSIGNED WORKER</div>
            <div className="text-factory-text font-medium">{machine.assignedWorker || '—'}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-factory-dim mb-1">LOCATION</div>
            <div className="text-factory-text font-medium">{machine.location}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-factory-dim mb-1">LAST MAINTENANCE</div>
            <div className="text-factory-text font-medium">{machine.lastMaintenance}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-factory-dim mb-1">NEXT MAINTENANCE</div>
            <div className={`font-medium ${new Date(machine.nextMaintenance) < new Date() ? 'text-factory-red' : 'text-factory-text'}`}>{machine.nextMaintenance}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MachinesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const { machines } = useLive();

  const filtered = machines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.department.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = machines.reduce((acc, m) => { acc[m.status] = (acc[m.status] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between animate-slide-in">
        <div>
          <h1 className="page-title">MACHINE HEALTH MONITORING</h1>
          <p className="text-factory-dim font-body text-sm mt-1">Real-time status and performance of all factory machines</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up">
        {[
          { label: 'Operational', count: counts.operational || 0, color: 'text-factory-green', bg: 'bg-factory-green/10', border: 'border-factory-green/30' },
          { label: 'Warning', count: counts.warning || 0, color: 'text-factory-amber', bg: 'bg-factory-amber/10', border: 'border-factory-amber/30' },
          { label: 'Critical', count: counts.critical || 0, color: 'text-factory-red', bg: 'bg-factory-red/10', border: 'border-factory-red/30' },
          { label: 'Offline', count: counts.offline || 0, color: 'text-gray-500', bg: 'bg-gray-900/30', border: 'border-gray-700/30' },
        ].map(({ label, count, color, bg, border }) => (
          <div key={label} className={`factory-card ${bg} border ${border} text-center cursor-pointer hover:scale-105 transition-transform`} onClick={() => setFilter(filter === label.toLowerCase() ? 'all' : label.toLowerCase())}>
            <div className={`font-display text-3xl font-bold ${color}`}>{count}</div>
            <div className="font-mono text-xs text-factory-dim mt-1">{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 animate-fade-up stagger-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-factory-dim" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search machines..." />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field w-40">
          <option value="all">All Status</option>
          <option value="operational">Operational</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Machine grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((m, i) => {
          const s = statusConfig[m.status];
          return (
            <div key={m.id} className={`factory-card ${s.glow} cursor-pointer hover:scale-105 transition-all duration-200 animate-fade-up`}
              style={{ animationDelay: `${i * 50}ms` }} onClick={() => setSelected(m)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`status-dot ${s.dot}`}></div>
                    <span className="font-medium text-factory-text">{m.name}</span>
                  </div>
                  <div className="font-mono text-xs text-factory-dim mt-0.5">{m.id} · {m.department}</div>
                </div>
                <span className={s.badge}>{s.label}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-factory-bg/50 rounded p-2 text-center">
                  <div className={`font-display text-lg font-bold ${m.temperature > 90 ? 'text-factory-red' : m.temperature > 75 ? 'text-factory-amber' : 'text-factory-accent'}`}>{m.temperature}°</div>
                  <div className="font-mono text-xs text-factory-dim">TEMP</div>
                </div>
                <div className="bg-factory-bg/50 rounded p-2 text-center">
                  <div className={`font-display text-lg font-bold ${m.vibration > 2 ? 'text-factory-red' : m.vibration > 1 ? 'text-factory-amber' : 'text-factory-green'}`}>{m.vibration}</div>
                  <div className="font-mono text-xs text-factory-dim">VIB</div>
                </div>
                <div className="bg-factory-bg/50 rounded p-2 text-center">
                  <div className={`font-display text-lg font-bold ${m.efficiency > 80 ? 'text-factory-green' : m.efficiency > 60 ? 'text-factory-amber' : 'text-factory-red'}`}>{m.efficiency}%</div>
                  <div className="font-mono text-xs text-factory-dim">EFF</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-factory-dim">Efficiency</span>
                  <span className="font-mono text-xs text-factory-text">{m.efficiency}%</span>
                </div>
                <div className="h-1.5 bg-factory-bg rounded overflow-hidden">
                  <div className={`h-full rounded transition-all duration-700 ${m.efficiency > 80 ? 'bg-factory-green' : m.efficiency > 60 ? 'bg-factory-amber' : 'bg-factory-red'}`}
                    style={{ width: `${m.efficiency}%` }}></div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-factory-border/50 text-xs text-factory-dim font-mono">
                <div className="flex items-center gap-1"><MapPin size={10} />{m.location}</div>
                <div className="flex items-center gap-1"><Clock size={10} />{m.runtime}h</div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && <MachineDetail machine={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
