import React, { useState } from 'react';
import { WORKERS, WORKER_PERFORMANCE } from '../data/dummyData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { User, Star, CheckCircle, Clock, Shield, Cpu, Search, ChevronRight, Award } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-factory-panel border border-factory-border rounded p-3 font-mono text-xs">
      <div className="text-factory-dim mb-1">{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>)}
    </div>
  );
};

function WorkerCard({ worker, onClick }) {
  const statusColor = worker.status === 'active' ? 'text-factory-green' : 'text-factory-amber';
  const statusDot = worker.status === 'active' ? 'bg-factory-green' : 'bg-factory-amber';
  return (
    <div className="factory-card cursor-pointer hover:border-factory-accent/50 hover:scale-105 transition-all duration-200 animate-fade-up" onClick={() => onClick(worker)}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-factory-accent/10 border border-factory-accent/30 flex items-center justify-center font-display text-base font-bold text-factory-accent flex-shrink-0">
          {worker.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="status-dot" style={{ width: 7, height: 7, borderRadius: '50%', display: 'inline-block', background: worker.status === 'active' ? '#00FF94' : '#FFB800' }}></div>
            <span className="font-medium text-factory-text">{worker.name}</span>
          </div>
          <div className="font-mono text-xs text-factory-dim">{worker.id} · {worker.role}</div>
          <div className="font-mono text-xs text-factory-dim">{worker.department} · {worker.shift} Shift</div>
        </div>
        <div className={`text-xs font-mono ${statusColor}`}>{worker.status.toUpperCase()}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-factory-bg/50 rounded p-2 text-center">
          <div className="font-display text-lg font-bold text-factory-accent">{worker.performance}%</div>
          <div className="font-mono text-xs text-factory-dim">PERF</div>
        </div>
        <div className="bg-factory-bg/50 rounded p-2 text-center">
          <div className="font-display text-lg font-bold text-factory-green">{worker.completedTasks}</div>
          <div className="font-mono text-xs text-factory-dim">DONE</div>
        </div>
        <div className="bg-factory-bg/50 rounded p-2 text-center">
          <div className={`font-display text-lg font-bold ${worker.safetyScore === 100 ? 'text-factory-green' : 'text-factory-amber'}`}>{worker.safetyScore}</div>
          <div className="font-mono text-xs text-factory-dim">SAFE</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-factory-dim">Performance</span>
          <span className="text-factory-text">{worker.performance}%</span>
        </div>
        <div className="h-1.5 bg-factory-bg rounded overflow-hidden">
          <div className={`h-full rounded ${worker.performance > 90 ? 'bg-factory-green' : worker.performance > 75 ? 'bg-factory-amber' : 'bg-factory-red'}`} style={{ width: `${worker.performance}%` }}></div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {worker.skills.slice(0, 3).map(skill => (
          <span key={skill} className="text-xs font-mono px-2 py-0.5 bg-factory-border rounded text-factory-dim">{skill}</span>
        ))}
      </div>
    </div>
  );
}

function WorkerModal({ worker, onClose }) {
  const radarData = [
    { skill: 'Productivity', value: worker.performance },
    { skill: 'Safety', value: worker.safetyScore },
    { skill: 'Task Comp.', value: Math.min(100, worker.completedTasks * 1.5) },
    { skill: 'Punctuality', value: 85 + Math.floor(Math.random() * 15) },
    { skill: 'Quality', value: 80 + Math.floor(Math.random() * 20) },
  ];
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="factory-card w-full max-w-2xl max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-factory-accent/10 border border-factory-accent/30 flex items-center justify-center font-display text-xl font-bold text-factory-accent">
              {worker.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-factory-accent">{worker.name}</h2>
              <div className="font-mono text-xs text-factory-dim">{worker.id} · {worker.department}</div>
              <div className="font-mono text-xs text-factory-dim">{worker.role} · {worker.shift} Shift</div>
            </div>
          </div>
          <button onClick={onClose} className="text-factory-dim hover:text-factory-text font-mono text-xl">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="section-title mb-3">SKILL RADAR</div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1E3A5F" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
                <Radar name="Score" dataKey="value" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Performance', value: `${worker.performance}%`, icon: Star, color: 'text-factory-accent' },
              { label: 'Safety Score', value: `${worker.safetyScore}/100`, icon: Shield, color: 'text-factory-green' },
              { label: 'Tasks Done', value: worker.completedTasks, icon: CheckCircle, color: 'text-factory-green' },
              { label: 'Pending Tasks', value: worker.pendingTasks, icon: Clock, color: worker.pendingTasks > 5 ? 'text-factory-amber' : 'text-factory-dim' },
              { label: 'Assigned Machine', value: worker.assignedMachine || 'None', icon: Cpu, color: 'text-factory-accent' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-3 bg-factory-bg rounded p-2.5">
                <Icon size={14} className={color} />
                <div className="flex-1">
                  <div className="font-mono text-xs text-factory-dim">{label}</div>
                  <div className={`font-medium text-sm ${color}`}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title mb-3">SKILLS</div>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map(skill => (
              <span key={skill} className="text-xs font-mono px-3 py-1 border border-factory-accent/30 bg-factory-accent/10 rounded text-factory-accent">{skill}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <div className="font-mono text-xs text-factory-dim mb-1">CONTACT</div>
            <div className="text-factory-text font-mono text-sm">{worker.phone}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-factory-dim mb-1">JOIN DATE</div>
            <div className="text-factory-text font-mono text-sm">{worker.joinDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkersPage() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');
  const [selected, setSelected] = useState(null);

  const departments = [...new Set(WORKERS.map(w => w.department))];
  const filtered = WORKERS.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'all' || w.department === dept;
    return matchSearch && matchDept;
  });

  const avgPerformance = Math.round(WORKERS.reduce((s, w) => s + w.performance, 0) / WORKERS.length);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between animate-slide-in">
        <div>
          <h1 className="page-title">WORKFORCE MANAGEMENT</h1>
          <p className="text-factory-dim font-body text-sm mt-1">Worker profiles, performance tracking, and skill-based assignments</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up">
        {[
          { label: 'Total Workers', value: WORKERS.length, color: 'text-factory-accent' },
          { label: 'Active', value: WORKERS.filter(w => w.status === 'active').length, color: 'text-factory-green' },
          { label: 'On Leave', value: WORKERS.filter(w => w.status === 'on-leave').length, color: 'text-factory-amber' },
          { label: 'Avg Performance', value: `${avgPerformance}%`, color: 'text-factory-accent' },
        ].map(({ label, value, color }) => (
          <div key={label} className="factory-card text-center">
            <div className={`font-display text-3xl font-bold ${color}`}>{value}</div>
            <div className="font-mono text-xs text-factory-dim mt-1">{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Performance chart */}
      <div className="factory-card animate-fade-up stagger-2">
        <div className="section-title mb-4">4-WEEK PERFORMANCE TREND (TOP WORKERS)</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={WORKER_PERFORMANCE} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
            <XAxis dataKey="week" tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <YAxis domain={[75, 100]} tick={{ fill: '#5A7A9A', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="arjun" stroke="#00D4FF" strokeWidth={2} dot={false} name="Arjun" />
            <Line type="monotone" dataKey="vikram" stroke="#00FF94" strokeWidth={2} dot={false} name="Vikram" />
            <Line type="monotone" dataKey="priya" stroke="#FFB800" strokeWidth={2} dot={false} name="Priya" />
            <Line type="monotone" dataKey="sneha" stroke="#FF3860" strokeWidth={2} dot={false} name="Sneha" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex gap-3 animate-fade-up stagger-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-factory-dim" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search workers..." />
        </div>
        <select value={dept} onChange={e => setDept(e.target.value)} className="input-field w-44">
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Worker grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((w, i) => (
          <div key={w.id} style={{ animationDelay: `${i * 50}ms` }}>
            <WorkerCard worker={w} onClick={setSelected} />
          </div>
        ))}
      </div>

      {/* Worker-Machine correlation */}
      <div className="factory-card animate-fade-up">
        <div className="section-title mb-4">WORKER–MACHINE CORRELATION ANALYSIS</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-factory-border">
                <th className="text-left py-2 text-factory-dim text-xs tracking-wider">WORKER</th>
                <th className="text-left py-2 text-factory-dim text-xs tracking-wider">MACHINE</th>
                <th className="text-left py-2 text-factory-dim text-xs tracking-wider">DEPT</th>
                <th className="text-left py-2 text-factory-dim text-xs tracking-wider">PERFORMANCE</th>
                <th className="text-left py-2 text-factory-dim text-xs tracking-wider">MATCH SCORE</th>
              </tr>
            </thead>
            <tbody>
              {WORKERS.filter(w => w.assignedMachine).map(w => {
                const matchScore = Math.round(w.performance * 0.4 + w.safetyScore * 0.3 + (100 - w.pendingTasks * 10) * 0.3);
                return (
                  <tr key={w.id} className="border-b border-factory-border/30 hover:bg-factory-border/20 transition-colors">
                    <td className="py-2.5 text-factory-text">{w.name}</td>
                    <td className="py-2.5 text-factory-accent">{w.assignedMachine}</td>
                    <td className="py-2.5 text-factory-dim">{w.department}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-factory-bg rounded overflow-hidden">
                          <div className={`h-full rounded ${w.performance > 90 ? 'bg-factory-green' : 'bg-factory-amber'}`} style={{ width: `${w.performance}%` }}></div>
                        </div>
                        <span className={w.performance > 90 ? 'text-factory-green' : 'text-factory-amber'}>{w.performance}%</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${matchScore > 85 ? 'bg-factory-green/10 text-factory-green border border-factory-green/30' : 'bg-factory-amber/10 text-factory-amber border border-factory-amber/30'}`}>
                        {matchScore}/100
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <WorkerModal worker={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
