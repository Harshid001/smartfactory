import React, { useState } from 'react';
import { MACHINES, MACHINE_HISTORY } from '../data/dummyData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wrench, AlertTriangle, Brain, Clock, TrendingUp, CheckCircle } from 'lucide-react';

// Simulated AI prediction logic
function predictFailure(machine) {
  let riskScore = 0;
  if (machine.temperature > 95) riskScore += 40;
  else if (machine.temperature > 80) riskScore += 20;
  else riskScore += 5;
  if (machine.vibration > 2) riskScore += 30;
  else if (machine.vibration > 1) riskScore += 15;
  else riskScore += 2;
  const daysSinceMaint = Math.floor((new Date() - new Date(machine.lastMaintenance)) / (1000 * 60 * 60 * 24));
  if (daysSinceMaint > 90) riskScore += 25;
  else if (daysSinceMaint > 60) riskScore += 15;
  else riskScore += 3;
  if (machine.efficiency < 60) riskScore += 15;
  else if (machine.efficiency < 80) riskScore += 8;
  return Math.min(100, riskScore);
}

function getRiskLevel(score) {
  if (score >= 70) return { label: 'HIGH', color: 'text-factory-red', bg: 'bg-factory-red/10', border: 'border-factory-red/40', badge: 'badge-critical' };
  if (score >= 40) return { label: 'MEDIUM', color: 'text-factory-amber', bg: 'bg-factory-amber/10', border: 'border-factory-amber/40', badge: 'badge-warning' };
  return { label: 'LOW', color: 'text-factory-green', bg: 'bg-factory-green/10', border: 'border-factory-green/30', badge: 'badge-operational' };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-factory-panel border border-factory-border rounded p-3 font-mono text-xs">
      <div className="text-factory-dim mb-1">{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong></div>)}
    </div>
  );
};

export default function MaintenancePage() {
  const [selected, setSelected] = useState(null);
  
  const machinesWithRisk = MACHINES.map(m => ({ ...m, riskScore: predictFailure(m) }))
    .sort((a, b) => b.riskScore - a.riskScore);

  const highRisk = machinesWithRisk.filter(m => m.riskScore >= 70);
  const medRisk = machinesWithRisk.filter(m => m.riskScore >= 40 && m.riskScore < 70);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between animate-slide-in">
        <div>
          <h1 className="page-title">PREDICTIVE MAINTENANCE</h1>
          <p className="text-factory-dim font-body text-sm mt-1">AI-powered failure prediction and maintenance scheduling</p>
        </div>
        <div className="flex items-center gap-2 bg-factory-accent/10 border border-factory-accent/30 rounded-lg px-3 py-2">
          <Brain size={14} className="text-factory-accent" />
          <span className="font-mono text-xs text-factory-accent">AI ENGINE ACTIVE</span>
        </div>
      </div>

      {/* AI Summary */}
      <div className="factory-card glow-accent animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <Brain size={18} className="text-factory-accent" />
          <div className="section-title text-factory-accent">AI ANALYSIS SUMMARY</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-factory-red/5 border border-factory-red/30 rounded-lg p-3 text-center">
            <div className="font-display text-2xl font-bold text-factory-red">{highRisk.length}</div>
            <div className="font-mono text-xs text-factory-dim mt-1">HIGH RISK MACHINES</div>
            <div className="text-xs text-factory-dim mt-1">Maintenance required within 7 days</div>
          </div>
          <div className="bg-factory-amber/5 border border-factory-amber/30 rounded-lg p-3 text-center">
            <div className="font-display text-2xl font-bold text-factory-amber">{medRisk.length}</div>
            <div className="font-mono text-xs text-factory-dim mt-1">MEDIUM RISK</div>
            <div className="text-xs text-factory-dim mt-1">Schedule within 30 days</div>
          </div>
          <div className="bg-factory-green/5 border border-factory-green/30 rounded-lg p-3 text-center">
            <div className="font-display text-2xl font-bold text-factory-green">{machinesWithRisk.filter(m => m.riskScore < 40).length}</div>
            <div className="font-mono text-xs text-factory-dim mt-1">LOW RISK</div>
            <div className="text-xs text-factory-dim mt-1">Normal operation</div>
          </div>
        </div>
      </div>

      {/* Risk cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {machinesWithRisk.map((m, i) => {
          const risk = getRiskLevel(m.riskScore);
          const daysSinceMaint = Math.floor((new Date() - new Date(m.lastMaintenance)) / (1000 * 60 * 60 * 24));
          const daysUntilMaint = Math.floor((new Date(m.nextMaintenance) - new Date()) / (1000 * 60 * 60 * 24));
          return (
            <div key={m.id} className={`factory-card ${risk.bg} border ${risk.border} cursor-pointer hover:scale-105 transition-all duration-200 animate-fade-up`}
              style={{ animationDelay: `${i * 50}ms` }} onClick={() => setSelected(selected?.id === m.id ? null : m)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium text-factory-text">{m.name}</div>
                  <div className="font-mono text-xs text-factory-dim">{m.id} · {m.department}</div>
                </div>
                <div className="text-right">
                  <div className={`font-display text-2xl font-bold ${risk.color}`}>{m.riskScore}%</div>
                  <span className={risk.badge}>{risk.label} RISK</span>
                </div>
              </div>

              {/* Risk bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs font-mono text-factory-dim mb-1">
                  <span>Failure Risk Score</span>
                  <span>{m.riskScore}%</span>
                </div>
                <div className="h-2 bg-factory-bg rounded overflow-hidden">
                  <div className={`h-full rounded transition-all duration-700 ${m.riskScore >= 70 ? 'bg-factory-red' : m.riskScore >= 40 ? 'bg-factory-amber' : 'bg-factory-green'}`}
                    style={{ width: `${m.riskScore}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="flex items-center gap-1">
                  <Clock size={10} className="text-factory-dim" />
                  <span className="text-factory-dim">Last maint: </span>
                  <span className="text-factory-text">{daysSinceMaint}d ago</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wrench size={10} className={daysUntilMaint < 0 ? 'text-factory-red' : 'text-factory-dim'} />
                  <span className="text-factory-dim">Next: </span>
                  <span className={daysUntilMaint < 0 ? 'text-factory-red' : 'text-factory-text'}>{daysUntilMaint < 0 ? `${Math.abs(daysUntilMaint)}d OVERDUE` : `${daysUntilMaint}d`}</span>
                </div>
              </div>

              {/* AI Recommendation */}
              {m.riskScore >= 40 && (
                <div className="mt-3 pt-3 border-t border-factory-border/50">
                  <div className="flex items-start gap-2">
                    <Brain size={12} className="text-factory-accent mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-factory-dim">
                      <span className="text-factory-accent font-medium">AI Recommendation: </span>
                      {m.riskScore >= 70
                        ? `Immediate inspection required. ${m.temperature > 90 ? 'Critical temperature detected. ' : ''}${m.vibration > 1 ? 'Abnormal vibration levels. ' : ''}${daysUntilMaint < 0 ? 'Maintenance overdue.' : ''}`
                        : `Schedule maintenance within 30 days. Monitor ${m.temperature > 75 ? 'temperature' : 'vibration'} closely.`}
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded chart */}
              {selected?.id === m.id && (
                <div className="mt-4 pt-4 border-t border-factory-border" onClick={e => e.stopPropagation()}>
                  <div className="section-title mb-3">24-HOUR SENSOR HISTORY</div>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={MACHINE_HISTORY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
                      <XAxis dataKey="hour" tick={{ fill: '#5A7A9A', fontSize: 9, fontFamily: 'Share Tech Mono' }} interval={4} />
                      <YAxis tick={{ fill: '#5A7A9A', fontSize: 9, fontFamily: 'Share Tech Mono' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="temperature" stroke="#FF3860" strokeWidth={1.5} dot={false} name="Temp °C" />
                      <Line type="monotone" dataKey="efficiency" stroke="#00FF94" strokeWidth={1.5} dot={false} name="Efficiency %" />
                    </LineChart>
                  </ResponsiveContainer>
                  <button className="mt-3 btn-primary w-full text-sm flex items-center justify-center gap-2">
                    <CheckCircle size={14} /> SCHEDULE MAINTENANCE
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
