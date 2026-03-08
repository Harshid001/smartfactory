import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Trash2, Cpu, Package, Users, BarChart3, Wrench, Zap } from 'lucide-react';
import { MACHINES, WORKERS, INVENTORY, ANALYTICS } from '../data/dummyData';
import { useLive } from '../context/LiveDataContext';

// Quick prompt suggestions
const QUICK_PROMPTS = [
  { icon: Cpu, text: 'Which machines need maintenance?', color: 'text-factory-red' },
  { icon: Package, text: 'Show low stock items', color: 'text-factory-amber' },
  { icon: Users, text: 'Top performing workers today?', color: 'text-factory-green' },
  { icon: BarChart3, text: "What is today's production status?", color: 'text-factory-accent' },
  { icon: Wrench, text: 'Predict failure risk for all machines', color: 'text-factory-red' },
  { icon: Zap, text: 'Give me a factory health summary', color: 'text-factory-green' },
];

// Local AI engine — answers based on live factory data
function generateAIResponse(userMessage, liveData) {
  const msg = userMessage.toLowerCase();
  const { machines, alerts, analytics } = liveData;

  const criticalMachines = machines.filter(m => m.status === 'critical');
  const warningMachines = machines.filter(m => m.status === 'warning');
  const lowStock = INVENTORY.filter(i => i.stock <= i.minStock);
  const unreadAlerts = alerts.filter(a => !a.read);

  // Maintenance / machine health
  if (msg.includes('maintenance') || msg.includes('repair') || msg.includes('fix')) {
    if (criticalMachines.length === 0) return `✅ Good news! No machines are in critical condition right now.\n\n${warningMachines.length > 0 ? `⚠️ However, ${warningMachines.length} machine(s) need attention:\n${warningMachines.map(m => `• **${m.name}** — Temp: ${m.temperature}°C, Vibration: ${m.vibration} mm/s`).join('\n')}` : 'All machines are running normally.'}`;
    return `🔴 **${criticalMachines.length} machine(s) require IMMEDIATE maintenance:**\n\n${criticalMachines.map(m => `• **${m.name}** (${m.id})\n  Temp: ${m.temperature}°C | Vibration: ${m.vibration} mm/s | Efficiency: ${m.efficiency}%\n  Location: ${m.location}`).join('\n\n')}${warningMachines.length > 0 ? `\n\n⚠️ Also ${warningMachines.length} machine(s) in warning state: ${warningMachines.map(m => m.name).join(', ')}` : ''}`;
  }

  // Inventory / stock
  if (msg.includes('stock') || msg.includes('inventory') || msg.includes('material')) {
    if (lowStock.length === 0) return `✅ All inventory items are above minimum stock levels. Total ${INVENTORY.length} items tracked.`;
    return `📦 **${lowStock.length} item(s) are critically low on stock:**\n\n${lowStock.map(i => `• **${i.name}**\n  Stock: ${i.stock} ${i.unit} | Minimum: ${i.minStock} ${i.unit}\n  Supplier: ${i.supplier}`).join('\n\n')}\n\n💡 Recommendation: Place purchase orders immediately to avoid production halt.`;
  }

  // Workers / performance
  if (msg.includes('worker') || msg.includes('employee') || msg.includes('staff') || msg.includes('perform')) {
    const sorted = [...WORKERS].sort((a, b) => b.performance - a.performance);
    const top3 = sorted.slice(0, 3);
    const onLeave = WORKERS.filter(w => w.status === 'on-leave');
    return `👷 **Worker Performance Summary:**\n\n🏆 Top Performers:\n${top3.map((w, i) => `${i + 1}. **${w.name}** — ${w.performance}% efficiency | Safety: ${w.safetyScore}/100\n   ${w.department} · ${w.role}`).join('\n\n')}${onLeave.length > 0 ? `\n\n⚠️ On Leave: ${onLeave.map(w => w.name).join(', ')} — reassignment may be needed.` : ''}`;
  }

  // Production
  if (msg.includes('production') || msg.includes('output') || msg.includes('target')) {
    const pct = Math.round((analytics.productionToday / analytics.productionTarget) * 100);
    const status = pct >= 100 ? '✅ TARGET MET' : pct >= 90 ? '🟡 ON TRACK' : '🔴 BELOW TARGET';
    return `🏭 **Today's Production Status:**\n\n${status}\n\n• Actual Output: **${analytics.productionToday} units**\n• Target: ${analytics.productionTarget} units\n• Achievement: **${pct}%**\n\n${pct < 100 ? `💡 Need ${analytics.productionTarget - analytics.productionToday} more units to hit target.` : '🎉 Great work! Target exceeded today.'}`;
  }

  // Failure / risk prediction
  if (msg.includes('predict') || msg.includes('failure') || msg.includes('risk')) {
    const withRisk = machines.map(m => {
      let risk = 0;
      if (m.temperature > 95) risk += 40; else if (m.temperature > 80) risk += 20;
      if (m.vibration > 2) risk += 30; else if (m.vibration > 1) risk += 15;
      if (m.efficiency < 60) risk += 15; else if (m.efficiency < 80) risk += 8;
      return { ...m, risk: Math.min(100, risk) };
    }).sort((a, b) => b.risk - a.risk).slice(0, 4);
    return `🤖 **AI Failure Risk Predictions:**\n\n${withRisk.map(m => `• **${m.name}** — Risk Score: **${m.risk}%** ${m.risk >= 70 ? '🔴 HIGH' : m.risk >= 40 ? '🟡 MEDIUM' : '🟢 LOW'}\n  Temp: ${m.temperature}°C | Vibration: ${m.vibration} mm/s`).join('\n\n')}`;
  }

  // Factory summary / health
  if (msg.includes('summary') || msg.includes('health') || msg.includes('overview') || msg.includes('status')) {
    return `🏭 **SmartFactory Health Summary:**\n\n🖥️ **Machines:** ${machines.filter(m => m.status === 'operational').length}/${machines.length} operational | ${criticalMachines.length} critical | ${warningMachines.length} warning\n\n👷 **Workers:** ${WORKERS.filter(w => w.status === 'active').length}/${WORKERS.length} active today\n\n📦 **Inventory:** ${lowStock.length} items low on stock out of ${INVENTORY.length} total\n\n🔔 **Alerts:** ${unreadAlerts.length} unread alerts\n\n📊 **Production:** ${analytics.productionToday}/${analytics.productionTarget} units (${Math.round((analytics.productionToday / analytics.productionTarget) * 100)}%)\n\n${criticalMachines.length > 0 || lowStock.length > 0 ? '⚠️ Action required in critical areas.' : '✅ Factory is running smoothly!'}`;
  }

  // Alerts
  if (msg.includes('alert') || msg.includes('notification') || msg.includes('warning')) {
    if (unreadAlerts.length === 0) return `✅ No unread alerts at the moment. All systems normal.`;
    return `🔔 **${unreadAlerts.length} Unread Alerts:**\n\n${unreadAlerts.slice(0, 5).map(a => `${a.type === 'critical' ? '🔴' : '🟡'} **${a.title}**\n   ${a.message}`).join('\n\n')}`;
  }

  // Energy (general answer)
  if (msg.includes('energy') || msg.includes('power') || msg.includes('electricity')) {
    const totalRuntime = machines.filter(m => m.status !== 'offline').reduce((s, m) => s + m.runtime, 0);
    return `⚡ **Energy Usage Estimate:**\n\nBased on current machine runtime data:\n• Total runtime hours today: ~${Math.round(totalRuntime / machines.length)} hrs/machine avg\n• ${criticalMachines.length} critical machines consuming excess energy\n• Estimated savings if M004 is shut down: ~15% reduction\n\n💡 Tip: Predictive maintenance can reduce energy waste by 10-25% in manufacturing SMEs.`;
  }

  // Default / greeting
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.length < 10) {
    return `👋 Hello! I'm your **SmartFactory AI Assistant**.\n\nI can help you with:\n• Machine health & maintenance status\n• Production targets & efficiency\n• Inventory & stock levels\n• Worker performance\n• AI failure risk predictions\n• Factory health summary\n\nWhat would you like to know?`;
  }

  return `🤖 I understand you're asking about: *"${userMessage}"*\n\nI can best help with:\n• **Machine status** — "Which machines need maintenance?"\n• **Production** — "What is today's production status?"\n• **Inventory** — "Show low stock items"\n• **Workers** — "Top performing workers?"\n• **Risk** — "Predict failure risk"\n• **Summary** — "Give me a factory health summary"\n\nTry one of the quick prompts below!`;
}

export default function ChatbotPage() {
  const liveData = useLive();
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant',
      text: `👋 **SmartFactory AI Assistant** online!\n\nI have real-time access to all factory data — machines, workers, inventory, production, and alerts.\n\nWhat would you like to know?`,
      time: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: userText, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 600));

    const aiText = generateAIResponse(userText, liveData);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: aiText, time: new Date() }]);
    setLoading(false);
  };

  const clearChat = () => setMessages([{
    id: Date.now(), role: 'assistant',
    text: `🔄 Chat cleared. I'm ready to help! Ask me anything about the factory.`,
    time: new Date(),
  }]);

  // Render markdown-like bold text
  const renderText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1
        ? <strong key={i} className="text-factory-accent font-semibold">{part}</strong>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-4" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-in">
        <div>
          <h1 className="page-title">AI FACTORY ASSISTANT</h1>
          <p className="text-factory-dim font-body text-sm mt-1">Real-time factory intelligence — ask anything about your plant</p>
        </div>
        <button onClick={clearChat} className="btn-secondary flex items-center gap-2 text-xs">
          <Trash2 size={12} /> CLEAR CHAT
        </button>
      </div>

      {/* Quick prompts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 animate-fade-up">
        {QUICK_PROMPTS.map(({ icon: Icon, text, color }) => (
          <button key={text} onClick={() => sendMessage(text)}
            className="factory-card text-left hover:border-factory-accent/50 hover:scale-105 transition-all duration-200 py-2.5 px-3 flex items-center gap-2">
            <Icon size={14} className={color} />
            <span className="font-body text-xs text-factory-dim">{text}</span>
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="factory-card flex-1 overflow-y-auto space-y-4 animate-fade-up stagger-2" style={{ minHeight: 0 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-factory-accent/20 border border-factory-accent/40' : 'bg-factory-border'}`}>
              {msg.role === 'assistant'
                ? <Bot size={16} className="text-factory-accent" />
                : <User size={16} className="text-factory-dim" />}
            </div>
            {/* Bubble */}
            <div className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.role === 'assistant' ? 'bg-factory-card border border-factory-border' : 'bg-factory-accent/10 border border-factory-accent/30'}`}>
              <div className="font-body text-sm text-factory-text whitespace-pre-line leading-relaxed">
                {renderText(msg.text)}
              </div>
              <div className="font-mono text-xs text-factory-dim mt-1.5">
                {msg.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-factory-accent/20 border border-factory-accent/40 flex items-center justify-center">
              <Bot size={16} className="text-factory-accent" />
            </div>
            <div className="bg-factory-card border border-factory-border rounded-xl px-4 py-3 flex items-center gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-factory-accent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="factory-card animate-fade-up stagger-3">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask about machines, production, inventory, workers..."
            className="input-field flex-1"
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="btn-primary flex items-center gap-2 px-5 disabled:opacity-50 disabled:cursor-not-allowed">
            <Send size={14} /> SEND
          </button>
        </div>
        <div className="font-mono text-xs text-factory-dim mt-2">
          AI has real-time access to {liveData.machines.length} machines · {WORKERS.length} workers · {INVENTORY.length} inventory items
        </div>
      </div>
    </div>
  );
}
