import React, { useState } from 'react';
import { MACHINES, WORKERS, INVENTORY } from '../data/dummyData';
import { QrCode, Search, Cpu, Users, Package, CheckCircle, AlertTriangle, Camera } from 'lucide-react';

// Generate simple QR-like SVG pattern for display
function QRPattern({ data, size = 120 }) {
  const seed = data.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const grid = 10;
  const cells = Array.from({ length: grid * grid }, (_, i) => ((seed * (i + 1) * 17) % 100) > 45);
  const cellSize = size / grid;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded">
      <rect width={size} height={size} fill="#060B14" />
      {/* Corner squares */}
      {[[0,0],[0,7],[7,0]].map(([cx, cy], i) => (
        <g key={i}>
          <rect x={cx*cellSize} y={cy*cellSize} width={cellSize*3} height={cellSize*3} fill="#00D4FF" opacity={0.9} rx={2} />
          <rect x={cx*cellSize+cellSize*0.4} y={cy*cellSize+cellSize*0.4} width={cellSize*2.2} height={cellSize*2.2} fill="#060B14" rx={1} />
          <rect x={cx*cellSize+cellSize*0.8} y={cy*cellSize+cellSize*0.8} width={cellSize*1.4} height={cellSize*1.4} fill="#00D4FF" opacity={0.9} rx={1} />
        </g>
      ))}
      {cells.map((on, i) => {
        const x = (i % grid) * cellSize;
        const y = Math.floor(i / grid) * cellSize;
        const isCorner = (x < cellSize*3 && y < cellSize*3) || (x < cellSize*3 && y >= cellSize*7) || (x >= cellSize*7 && y < cellSize*3);
        return on && !isCorner ? <rect key={i} x={x+1} y={y+1} width={cellSize-2} height={cellSize-2} fill="#00D4FF" opacity={0.7} rx={1} /> : null;
      })}
    </svg>
  );
}

const ALL_ITEMS = [
  ...MACHINES.map(m => ({ type: 'machine', id: m.id, name: m.name, sub: `${m.type} · ${m.department} · ${m.location}`, status: m.status, data: m })),
  ...WORKERS.map(w => ({ type: 'worker', id: w.id, name: w.name, sub: `${w.role} · ${w.department}`, status: w.status, data: w })),
  ...INVENTORY.map(i => ({ type: 'inventory', id: i.id, name: i.name, sub: `${i.category} · ${i.supplier}`, status: i.stock <= i.minStock ? 'low' : 'ok', data: i })),
];

function ItemDetail({ item, onClose }) {
  const { type, data } = item;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="factory-card w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-mono text-xs text-factory-dim">{item.id}</div>
            <div className="font-display text-lg font-bold text-factory-accent mt-0.5">{item.name}</div>
          </div>
          <button onClick={onClose} className="text-factory-dim hover:text-factory-text text-xl font-mono">✕</button>
        </div>
        {/* QR Code display */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-factory-bg border border-factory-border rounded-xl">
            <QRPattern data={item.id} size={140} />
            <div className="font-mono text-xs text-factory-dim text-center mt-2">{item.id}</div>
          </div>
        </div>
        {/* Details */}
        <div className="space-y-2 text-sm font-mono">
          {type === 'machine' && (
            <>
              {[['Status', data.status.toUpperCase()], ['Temperature', `${data.temperature}°C`], ['Vibration', `${data.vibration} mm/s`], ['Efficiency', `${data.efficiency}%`], ['Location', data.location], ['Last Maintenance', data.lastMaintenance]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-factory-border/30 pb-1">
                  <span className="text-factory-dim">{k}</span>
                  <span className={k === 'Status' ? (data.status === 'operational' ? 'text-factory-green' : data.status === 'warning' ? 'text-factory-amber' : 'text-factory-red') : 'text-factory-text'}>{v}</span>
                </div>
              ))}
            </>
          )}
          {type === 'worker' && (
            <>
              {[['Department', data.department], ['Role', data.role], ['Shift', data.shift], ['Performance', `${data.performance}%`], ['Safety Score', `${data.safetyScore}/100`], ['Status', data.status.toUpperCase()]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-factory-border/30 pb-1">
                  <span className="text-factory-dim">{k}</span>
                  <span className="text-factory-text">{v}</span>
                </div>
              ))}
            </>
          )}
          {type === 'inventory' && (
            <>
              {[['Category', data.category], ['Stock', `${data.stock} ${data.unit}`], ['Minimum', `${data.minStock} ${data.unit}`], ['Unit Cost', `₹${data.unitCost.toLocaleString()}`], ['Supplier', data.supplier], ['Status', data.stock <= data.minStock ? 'LOW STOCK' : 'OK']].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-factory-border/30 pb-1">
                  <span className="text-factory-dim">{k}</span>
                  <span className={k === 'Status' ? (data.stock <= data.minStock ? 'text-factory-red' : 'text-factory-green') : 'text-factory-text'}>{v}</span>
                </div>
              ))}
            </>
          )}
        </div>
        <button className="btn-primary w-full mt-4 text-sm">PRINT QR CODE</button>
      </div>
    </div>
  );
}

export default function QRPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [scanSimulating, setScanSimulating] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);

  const filtered = ALL_ITEMS.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || item.type === filter;
    return matchSearch && matchFilter;
  });

  const simulateScan = async () => {
    setScanSimulating(true);
    setScannedItem(null);
    await new Promise(r => setTimeout(r, 1800));
    const randomItem = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
    setScannedItem(randomItem);
    setScanSimulating(false);
  };

  const typeIcon = { machine: Cpu, worker: Users, inventory: Package };
  const typeColor = { machine: 'text-factory-accent', worker: 'text-factory-green', inventory: 'text-factory-amber' };
  const statusBadge = (item) => {
    if (item.type === 'machine') return item.status === 'operational' ? 'badge-operational' : item.status === 'warning' ? 'badge-warning' : item.status === 'critical' ? 'badge-critical' : 'badge-offline';
    if (item.type === 'worker') return item.status === 'active' ? 'badge-operational' : 'badge-warning';
    return item.status === 'low' ? 'badge-critical' : 'badge-operational';
  };

  return (
    <div className="space-y-6">
      <div className="animate-slide-in">
        <h1 className="page-title">QR CODE SCANNER</h1>
        <p className="text-factory-dim font-body text-sm mt-1">Scan machine tags, worker IDs, and inventory barcodes for instant info</p>
      </div>

      {/* Scanner simulation */}
      <div className="factory-card glow-accent animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <Camera size={16} className="text-factory-accent" />
          <div className="section-title">QR SCANNER SIMULATION</div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <button onClick={simulateScan} disabled={scanSimulating}
            className="btn-primary flex items-center gap-2 disabled:opacity-60">
            {scanSimulating ? (
              <><div className="w-4 h-4 border-2 border-factory-bg border-t-transparent rounded-full animate-spin"></div> SCANNING...</>
            ) : (
              <><QrCode size={14} /> SIMULATE SCAN</>
            )}
          </button>
          {scannedItem && (
            <div className="flex items-center gap-3 bg-factory-green/10 border border-factory-green/30 rounded-lg px-4 py-2 animate-fade-up">
              <CheckCircle size={14} className="text-factory-green" />
              <div>
                <div className="font-medium text-factory-text text-sm">{scannedItem.name}</div>
                <div className="font-mono text-xs text-factory-dim">{scannedItem.id} — <button onClick={() => setSelected(scannedItem)} className="text-factory-accent hover:underline">View Details</button></div>
              </div>
            </div>
          )}
        </div>
        <div className="font-mono text-xs text-factory-dim mt-3">In production: connect a USB/Bluetooth QR scanner to auto-populate this field</div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-wrap animate-fade-up stagger-2">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-factory-dim" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search by name or ID..." />
        </div>
        {['all', 'machine', 'worker', 'inventory'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`font-mono text-xs px-3 py-2 rounded border transition-colors capitalize ${filter === f ? 'border-factory-accent text-factory-accent bg-factory-accent/10' : 'border-factory-border text-factory-dim hover:border-factory-accent/50'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 animate-fade-up stagger-3">
        {filtered.map((item, i) => {
          const Icon = typeIcon[item.type];
          return (
            <div key={item.id} onClick={() => setSelected(item)}
              className="factory-card flex items-center gap-4 cursor-pointer hover:border-factory-accent/50 hover:scale-105 transition-all duration-200"
              style={{ animationDelay: `${i * 30}ms` }}>
              {/* Mini QR */}
              <div className="flex-shrink-0">
                <QRPattern data={item.id} size={56} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon size={12} className={typeColor[item.type]} />
                  <span className="font-mono text-xs text-factory-dim uppercase">{item.type}</span>
                </div>
                <div className="font-medium text-factory-text text-sm truncate mt-0.5">{item.name}</div>
                <div className="font-mono text-xs text-factory-dim truncate">{item.sub}</div>
              </div>
              <div className="flex-shrink-0">
                <span className={statusBadge(item)}>{item.status.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {selected && <ItemDetail item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
