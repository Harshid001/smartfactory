/**
 * useLiveData — Real-time simulation hook
 * - Har 3 seconds mein machine sensors update hote hain
 * - Browser Notification popup aata hai
 * - Sound alert bhi bajta hai (Web Audio API)
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { MACHINES as BASE_MACHINES, ALERTS as BASE_ALERTS, ANALYTICS as BASE_ANALYTICS } from '../data/dummyData';

// ─── Web Audio — Alert Sound ───────────────────────────────────
function playAlertSound(type = 'warning') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'critical') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.setValueAtTime(450, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(900, ctx.currentTime + 0.24);
      osc.frequency.setValueAtTime(450, ctx.currentTime + 0.36);
      osc.frequency.setValueAtTime(900, ctx.currentTime + 0.48);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.65);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {}
}

// ─── Browser Notification ──────────────────────────────────────
function sendBrowserNotification(alert) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const emoji = alert.type === 'critical' ? '🔴' : alert.type === 'warning' ? '🟡' : '🔵';
  try {
    new Notification(`${emoji} SmartFactory — ${alert.title}`, {
      body: alert.message,
      icon: '/factory-icon.svg',
      tag: alert.id,
      requireInteraction: alert.type === 'critical',
    });
  } catch (e) {}
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// ─── Helpers ───────────────────────────────────────────────────
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function calcStatus(temp, vibration, baseStatus) {
  if (baseStatus === 'offline') return 'offline';
  if (temp > 100 || vibration > 2.5) return 'critical';
  if (temp > 82 || vibration > 1.0) return 'warning';
  return 'operational';
}

function fluctuate(base, range, min, max) {
  return +Math.min(max, Math.max(min, base + (Math.random() - 0.5) * range)).toFixed(2);
}

function maybeGenerateAlert(machine) {
  const r = Math.random();
  if (machine.status === 'critical' && r < 0.3) {
    return { id: `A${Date.now()}_${machine.id}`, type: 'critical', category: 'Machine', title: `${machine.name} — Critical Alert`, message: `Temperature ${machine.temperature}°C · Vibration ${machine.vibration} mm/s. Immediate action needed!`, time: 'just now', machine: machine.id, read: false };
  }
  if (machine.status === 'warning' && r < 0.12) {
    return { id: `A${Date.now()}_${machine.id}`, type: 'warning', category: 'Machine', title: `${machine.name} — Warning`, message: `Elevated readings: Temp ${machine.temperature}°C · Vibration ${machine.vibration} mm/s`, time: 'just now', machine: machine.id, read: false };
  }
  return null;
}

// ─── Main Hook ─────────────────────────────────────────────────
export function useLiveData(intervalMs = 3000) {
  const [machines, setMachines] = useState(BASE_MACHINES);
  const [alerts, setAlerts] = useState(BASE_ALERTS);
  const [production, setProduction] = useState({ today: 462, target: 500 });
  const [analytics, setAnalytics] = useState(BASE_ANALYTICS);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const prevStatusRef = useRef({});

  const tick = useCallback(() => {
    setMachines(prev => {
      const newAlerts = [];
      const updated = prev.map(m => {
        if (m.status === 'offline') return m;
        const temp = fluctuate(m.temperature, 4, 30, 115);
        const vibration = fluctuate(m.vibration, 0.3, 0.0, 3.5);
        const efficiency = fluctuate(m.efficiency, 3, 0, 100);
        const runtime = +(m.runtime + intervalMs / 3600000).toFixed(3);
        const status = calcStatus(temp, vibration, m.status);
        const updatedM = { ...m, temperature: temp, vibration, efficiency: Math.round(efficiency), runtime, status };
        const alert = maybeGenerateAlert(updatedM);
        if (alert) newAlerts.push(alert);
        // Status change alert
        const prev = prevStatusRef.current[m.id];
        if (prev && prev !== status && (status === 'critical' || status === 'warning')) {
          newAlerts.push({ id: `SC${Date.now()}_${m.id}`, type: status, category: 'Machine', title: `${m.name} — Status: ${status.toUpperCase()}`, message: `Machine changed ${prev} → ${status}. Temp: ${temp}°C, Vibration: ${vibration}`, time: 'just now', machine: m.id, read: false });
        }
        prevStatusRef.current[m.id] = status;
        return updatedM;
      });
      if (newAlerts.length > 0) {
        const worst = newAlerts.find(a => a.type === 'critical') || newAlerts[0];
        if (soundEnabled) playAlertSound(worst.type);
        if (notifEnabled) newAlerts.forEach(a => sendBrowserNotification(a));
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 25));
      }
      return updated;
    });
    setProduction(prev => {
      const hour = new Date().getHours();
      if (hour < 8 || hour >= 20) return prev;
      const inc = Math.random() < 0.6 ? randInt(0, 3) : 0;
      return { ...prev, today: Math.min(prev.target + 30, prev.today + inc) };
    });
    setLastUpdate(new Date());
  }, [intervalMs, soundEnabled, notifEnabled]);

  useEffect(() => {
    const timer = setInterval(tick, intervalMs);
    return () => clearInterval(timer);
  }, [tick, intervalMs]);

  useEffect(() => { requestNotificationPermission(); }, []);

  const markAlertRead = useCallback((id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a)), []);
  const markAllRead = useCallback(() => setAlerts(prev => prev.map(a => ({ ...a, read: true }))), []);

  return { machines, alerts, production, analytics: { ...analytics, productionToday: production.today }, lastUpdate, markAlertRead, markAllRead, unreadCount: alerts.filter(a => !a.read).length, soundEnabled, setSoundEnabled, notifEnabled, setNotifEnabled };
}
