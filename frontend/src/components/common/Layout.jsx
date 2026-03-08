import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLive } from '../../context/LiveDataContext';
import {
  LayoutDashboard, Cpu, BarChart3, Package, Users, Bell, BellOff,
  LineChart, FileText, ShieldCheck, Wrench, LogOut,
  X, ChevronRight, Zap, Factory, Volume2, VolumeX,
  Bot, Zap as Energy, QrCode, DollarSign
} from 'lucide-react';


const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/machines', icon: Cpu, label: 'Machine Health' },
  { path: '/maintenance', icon: Wrench, label: 'Predictive Maint.' },
  { path: '/production', icon: BarChart3, label: 'Production' },
  { path: '/inventory', icon: Package, label: 'Inventory' },
  { path: '/workers', icon: Users, label: 'Workforce' },
  { path: '/alerts', icon: Bell, label: 'Smart Alerts' },
  { path: '/analytics', icon: LineChart, label: 'Analytics' },
  { path: '/energy', icon: Energy, label: 'Energy Monitor' },
  { path: '/cost-revenue', icon: DollarSign, label: 'Cost & Revenue' },
  { path: '/chatbot', icon: Bot, label: 'AI Assistant' },
  { path: '/qr-scanner', icon: QrCode, label: 'QR Scanner' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/safety', icon: ShieldCheck, label: 'Safety' },
];



export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { unreadCount, lastUpdate, soundEnabled, setSoundEnabled, notifEnabled, setNotifEnabled } = useLive();
  const unreadAlerts = unreadCount;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-factory-bg overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-factory-panel border-r border-factory-border flex flex-col transition-all duration-300 relative z-20`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-factory-border ${sidebarOpen ? '' : 'justify-center'}`}>
          <div className="w-8 h-8 bg-factory-accent/20 border border-factory-accent/50 rounded flex items-center justify-center flex-shrink-0">
            <Factory size={16} className="text-factory-accent" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-display text-xs font-bold text-factory-accent tracking-widest">SMARTFACTORY</div>
              <div className="font-mono text-xs text-factory-dim tracking-wider">AI MANAGEMENT</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {sidebarOpen && <div className="section-title px-2 mb-3">Navigation</div>}
          {NAV_ITEMS.map(({ path, icon: Icon, label, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${sidebarOpen ? '' : 'justify-center px-0'} mb-1 relative`}
            >
              <div className="relative">
                <Icon size={18} />
                {label === 'Smart Alerts' && unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-factory-red rounded-full text-xs flex items-center justify-center font-mono" style={{fontSize: '7px'}}>{unreadAlerts}</span>
                )}
              </div>
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className={`border-t border-factory-border p-3 ${sidebarOpen ? '' : 'flex justify-center'}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-factory-accent/20 border border-factory-accent/40 rounded-full flex items-center justify-center font-display text-xs font-bold text-factory-accent flex-shrink-0">
                {user?.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-factory-text truncate">{user?.name}</div>
                <div className="text-xs text-factory-dim">{user?.role}</div>
              </div>
              <button onClick={handleLogout} className="text-factory-dim hover:text-factory-red transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-factory-dim hover:text-factory-red transition-colors">
              <LogOut size={18} />
            </button>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-factory-panel border border-factory-border rounded-full flex items-center justify-center text-factory-dim hover:text-factory-accent transition-colors z-30"
        >
          {sidebarOpen ? <X size={12} /> : <ChevronRight size={12} />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-factory-panel border-b border-factory-border flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="status-dot bg-factory-green animate-pulse"></div>
              <span className="font-mono text-xs text-factory-green">LIVE</span>
            </div>
            <div className="h-4 w-px bg-factory-border"></div>
            <div className="font-mono text-xs text-factory-dim">
              Updated: {lastUpdate?.toLocaleTimeString('en-IN')}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-factory-amber">
              <Zap size={14} />
              <span className="font-mono text-xs">SHIFT: MORNING</span>
            </div>
            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(p => !p)}
              title={soundEnabled ? 'Mute alert sound' : 'Unmute alert sound'}
              className={`p-1.5 rounded transition-colors ${soundEnabled ? 'text-factory-accent hover:text-factory-dim' : 'text-factory-dim hover:text-factory-accent'}`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            {/* Notification toggle */}
            <button
              onClick={() => setNotifEnabled(p => !p)}
              title={notifEnabled ? 'Disable notifications' : 'Enable notifications'}
              className={`p-1.5 rounded transition-colors ${notifEnabled ? 'text-factory-accent hover:text-factory-dim' : 'text-factory-dim hover:text-factory-accent'}`}
            >
              {notifEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            </button>
            <NavLink to="/alerts" className="relative p-2 text-factory-dim hover:text-factory-accent transition-colors">
              <Bell size={18} />
              {unreadAlerts > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-factory-red rounded-full text-xs flex items-center justify-center font-mono text-white animate-pulse">{unreadAlerts}</span>
              )}
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-grid p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
