import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Filter, X } from 'lucide-react';

const typeConfig = {
  critical: { icon: AlertTriangle, color: 'text-factory-red', bg: 'bg-factory-red/5', border: 'border-factory-red/40', badge: 'badge-critical' },
  warning: { icon: AlertTriangle, color: 'text-factory-amber', bg: 'bg-factory-amber/5', border: 'border-factory-amber/40', badge: 'badge-warning' },
  info: { icon: Info, color: 'text-factory-accent', bg: 'bg-factory-accent/5', border: 'border-factory-accent/30', badge: 'badge-operational' },
};

import { useLive } from '../context/LiveDataContext';

export default function AlertsPage() {
  const { alerts, markAlertRead, markAllRead, unreadCount } = useLive();
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');

  const categories = [...new Set(alerts.map(a => a.category))];
  const filtered = alerts.filter(a => {
    const matchFilter = filter === 'all' || (filter === 'unread' ? !a.read : a.read);
    const matchCat = category === 'all' || a.category === category;
    return matchFilter && matchCat;
  });

  const unread = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between animate-slide-in">
        <div>
          <h1 className="page-title">SMART ALERT SYSTEM</h1>
          <p className="text-factory-dim font-body text-sm mt-1">Automated alerts for machines, inventory, and production</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-xs flex items-center gap-2">
            <CheckCircle size={12} /> MARK ALL READ
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up">
        {[
          { label: 'Total Alerts', value: alerts.length, color: 'text-factory-accent' },
          { label: 'Unread', value: unread, color: 'text-factory-red' },
          { label: 'Critical', value: alerts.filter(a => a.type === 'critical').length, color: 'text-factory-red' },
          { label: 'Warnings', value: alerts.filter(a => a.type === 'warning').length, color: 'text-factory-amber' },
        ].map(({ label, value, color }) => (
          <div key={label} className="factory-card text-center">
            <div className={`font-display text-3xl font-bold ${color}`}>{value}</div>
            <div className="font-mono text-xs text-factory-dim mt-1">{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap animate-fade-up stagger-2">
        {['all', 'unread', 'critical', 'warning'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`font-mono text-xs px-3 py-1.5 rounded border transition-colors ${filter === f ? 'border-factory-accent text-factory-accent bg-factory-accent/10' : 'border-factory-border text-factory-dim hover:border-factory-accent/50'}`}>
            {f.toUpperCase()}
          </button>
        ))}
        <div className="h-4 w-px bg-factory-border self-center"></div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input-field w-36 py-1.5">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Alert list */}
      <div className="space-y-3 animate-fade-up stagger-3">
        {filtered.length === 0 && (
          <div className="factory-card text-center py-12 text-factory-dim font-mono">
            No alerts found for current filters
          </div>
        )}
        {filtered.map((alert, i) => {
          const { icon: Icon, color, bg, border, badge } = typeConfig[alert.type];
          return (
            <div key={alert.id} className={`${bg} border ${border} rounded-lg p-4 transition-all duration-200 ${!alert.read ? 'opacity-100' : 'opacity-60'} animate-fade-up`} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${bg} border ${border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={16} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-factory-text">{alert.title}</span>
                        {!alert.read && <span className="w-2 h-2 bg-factory-accent rounded-full animate-pulse"></span>}
                      </div>
                      <div className="text-sm text-factory-dim mt-1 font-body">{alert.message}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={badge}>{alert.type.toUpperCase()}</span>
                      {!alert.read && (
                        <button onClick={() => markAlertRead(alert.id)} className="text-factory-dim hover:text-factory-text transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-mono text-xs text-factory-dim">{alert.time}</span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-factory-border rounded text-factory-dim">{alert.category}</span>
                    {alert.machine && <span className="font-mono text-xs text-factory-accent">{alert.machine}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
