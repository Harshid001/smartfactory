import React, { useState } from 'react';
import { INVENTORY } from '../data/dummyData';
import { Package, AlertTriangle, TrendingDown, Search, Plus, Download } from 'lucide-react';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = [...new Set(INVENTORY.map(i => i.category))];
  const filtered = INVENTORY.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.supplier.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || item.category === category;
    return matchSearch && matchCat;
  });

  const lowStock = INVENTORY.filter(i => i.stock <= i.minStock);
  const totalValue = INVENTORY.reduce((s, i) => s + i.stock * i.unitCost, 0);

  const getStockStatus = (item) => {
    const pct = (item.stock / item.maxStock) * 100;
    if (item.stock <= item.minStock) return { label: 'CRITICAL', color: 'text-factory-red', barColor: 'bg-factory-red', badge: 'badge-critical' };
    if (pct < 30) return { label: 'LOW', color: 'text-factory-amber', barColor: 'bg-factory-amber', badge: 'badge-warning' };
    return { label: 'OK', color: 'text-factory-green', barColor: 'bg-factory-green', badge: 'badge-operational' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between animate-slide-in">
        <div>
          <h1 className="page-title">INVENTORY AUTOMATION</h1>
          <p className="text-factory-dim font-body text-sm mt-1">Real-time stock tracking with automated low-stock alerts</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus size={14} /> ADD ITEM</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up">
        {[
          { label: 'Total Items', value: INVENTORY.length, color: 'text-factory-accent', sub: 'In inventory' },
          { label: 'Low Stock Alerts', value: lowStock.length, color: 'text-factory-red', sub: 'Need reorder' },
          { label: 'Total Value', value: `₹${(totalValue / 100000).toFixed(1)}L`, color: 'text-factory-green', sub: 'Inventory worth' },
          { label: 'Suppliers', value: new Set(INVENTORY.map(i => i.supplier)).size, color: 'text-factory-amber', sub: 'Active vendors' },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="factory-card text-center">
            <div className={`font-display text-3xl font-bold ${color}`}>{value}</div>
            <div className="font-body text-sm font-medium text-factory-text mt-1">{label}</div>
            <div className="font-mono text-xs text-factory-dim">{sub}</div>
          </div>
        ))}
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="factory-card glow-red animate-fade-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-factory-red" />
            <div className="section-title text-factory-red">LOW STOCK ALERTS — IMMEDIATE ACTION REQUIRED</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lowStock.map(item => (
              <div key={item.id} className="bg-factory-red/5 border border-factory-red/30 rounded-lg p-3">
                <div className="font-medium text-factory-text text-sm">{item.name}</div>
                <div className="font-mono text-xs text-factory-dim mt-0.5">{item.supplier}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-factory-red">{item.stock} {item.unit}</span>
                  <span className="font-mono text-xs text-factory-dim">Min: {item.minStock}</span>
                </div>
                <button className="mt-2 w-full text-xs font-mono py-1.5 border border-factory-red/50 text-factory-red rounded hover:bg-factory-red/20 transition-colors">
                  PLACE ORDER
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 animate-fade-up stagger-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-factory-dim" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search inventory..." />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input-field w-44">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Inventory table */}
      <div className="factory-card animate-fade-up stagger-4">
        <div className="flex items-center justify-between mb-4">
          <div className="section-title">STOCK LEVELS</div>
          <button className="btn-secondary flex items-center gap-2 text-xs"><Download size={12} /> EXPORT</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-factory-border">
                {['ID', 'Name', 'Category', 'Stock', 'Min/Max', 'Stock Level', 'Unit Cost', 'Value', 'Supplier', 'Status'].map(h => (
                  <th key={h} className="text-left py-3 px-2 font-mono text-xs text-factory-dim tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const s = getStockStatus(item);
                const pct = Math.min(100, (item.stock / item.maxStock) * 100);
                return (
                  <tr key={item.id} className="border-b border-factory-border/30 hover:bg-factory-border/20 transition-colors">
                    <td className="py-3 px-2 font-mono text-xs text-factory-dim">{item.id}</td>
                    <td className="py-3 px-2 font-medium text-factory-text whitespace-nowrap">{item.name}</td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-xs px-2 py-0.5 bg-factory-border rounded text-factory-dim">{item.category}</span>
                    </td>
                    <td className="py-3 px-2 font-mono font-bold">
                      <span className={s.color}>{item.stock} {item.unit}</span>
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-factory-dim">{item.minStock}/{item.maxStock}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2 min-w-24">
                        <div className="flex-1 h-1.5 bg-factory-bg rounded overflow-hidden">
                          <div className={`h-full rounded ${s.barColor}`} style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="font-mono text-xs text-factory-dim w-8">{Math.round(pct)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-factory-dim">₹{item.unitCost.toLocaleString()}</td>
                    <td className="py-3 px-2 font-mono text-xs text-factory-text">₹{(item.stock * item.unitCost).toLocaleString()}</td>
                    <td className="py-3 px-2 text-xs text-factory-dim">{item.supplier}</td>
                    <td className="py-3 px-2"><span className={s.badge}>{s.label}</span></td>
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
