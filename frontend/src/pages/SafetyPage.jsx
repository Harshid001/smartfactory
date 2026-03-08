import React from 'react';
import { SAFETY_INCIDENTS, WORKERS } from '../data/dummyData';
import { ShieldCheck, AlertTriangle, Clock, User, CheckCircle } from 'lucide-react';

export default function SafetyPage() {
  const avgSafetyScore = Math.round(WORKERS.reduce((s, w) => s + w.safetyScore, 0) / WORKERS.length);
  const resolvedCount = SAFETY_INCIDENTS.filter(i => i.status === 'resolved').length;

  const severityConfig = {
    low: { badge: 'badge-operational', color: 'text-factory-green', border: 'border-factory-green/30', bg: 'bg-factory-green/5' },
    medium: { badge: 'badge-warning', color: 'text-factory-amber', border: 'border-factory-amber/30', bg: 'bg-factory-amber/5' },
    high: { badge: 'badge-critical', color: 'text-factory-red', border: 'border-factory-red/30', bg: 'bg-factory-red/5' },
  };

  return (
    <div className="space-y-6">
      <div className="animate-slide-in">
        <h1 className="page-title">SAFETY MONITORING</h1>
        <p className="text-factory-dim font-body text-sm mt-1">Incident tracking, safety scores, and compliance monitoring</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up">
        {[
          { label: 'Avg Safety Score', value: `${avgSafetyScore}/100`, color: 'text-factory-green' },
          { label: 'Total Incidents', value: SAFETY_INCIDENTS.length, color: 'text-factory-amber' },
          { label: 'Resolved', value: resolvedCount, color: 'text-factory-green' },
          { label: 'Days Since Incident', value: 16, color: 'text-factory-accent' },
        ].map(({ label, value, color }) => (
          <div key={label} className="factory-card text-center">
            <div className={`font-display text-3xl font-bold ${color}`}>{value}</div>
            <div className="font-mono text-xs text-factory-dim mt-1">{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Worker safety scores */}
      <div className="factory-card animate-fade-up stagger-2">
        <div className="section-title mb-4">WORKER SAFETY SCORES</div>
        <div className="space-y-3">
          {[...WORKERS].sort((a, b) => b.safetyScore - a.safetyScore).map(w => (
            <div key={w.id} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-factory-accent/10 border border-factory-accent/30 flex items-center justify-center font-display text-xs font-bold text-factory-accent flex-shrink-0">
                {w.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-factory-text">{w.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-display font-bold text-sm ${w.safetyScore === 100 ? 'text-factory-green' : w.safetyScore >= 95 ? 'text-factory-green' : 'text-factory-amber'}`}>{w.safetyScore}</span>
                    {w.safetyScore === 100 && <CheckCircle size={14} className="text-factory-green" />}
                  </div>
                </div>
                <div className="h-1.5 bg-factory-bg rounded overflow-hidden">
                  <div className={`h-full rounded ${w.safetyScore >= 95 ? 'bg-factory-green' : 'bg-factory-amber'}`} style={{ width: `${w.safetyScore}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incidents */}
      <div className="factory-card animate-fade-up stagger-3">
        <div className="section-title mb-4">SAFETY INCIDENT LOG</div>
        <div className="space-y-3">
          {SAFETY_INCIDENTS.map((incident, i) => {
            const s = severityConfig[incident.severity];
            return (
              <div key={incident.id} className={`${s.bg} border ${s.border} rounded-lg p-4 animate-fade-up`} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className={s.color} />
                      <span className="font-medium text-factory-text">{incident.type}</span>
                    </div>
                    <div className="font-mono text-xs text-factory-dim mt-0.5">{incident.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={s.badge}>{incident.severity.toUpperCase()}</span>
                    <span className={incident.status === 'resolved' ? 'badge-operational' : 'badge-warning'}>
                      {incident.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-factory-dim font-body">{incident.description}</p>
                <div className="flex items-center gap-4 mt-2 font-mono text-xs text-factory-dim">
                  <div className="flex items-center gap-1"><User size={10} />{incident.worker}</div>
                  <div className="flex items-center gap-1"><Clock size={10} />{incident.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety tips */}
      <div className="factory-card glow-green animate-fade-up stagger-4">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={16} className="text-factory-green" />
          <div className="section-title text-factory-green">SAFETY COMPLIANCE CHECKLIST</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'PPE worn at all workstations ✓',
            'Emergency exits clearly marked ✓',
            'Fire extinguishers checked this month ✓',
            'Machine guards in place ✓',
            'Hazardous materials properly labeled ✓',
            'First aid kits stocked and accessible ✓',
            'Electrical safety inspections current ✓',
            'Worker safety training up to date ✓',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm font-body text-factory-dim">
              <CheckCircle size={14} className="text-factory-green flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
