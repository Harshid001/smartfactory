import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Factory, Zap, Eye, EyeOff, Lock, Mail } from 'lucide-react';

const DEMO_CREDS = [
  { role: 'Admin', email: 'admin@factory.com', password: 'admin123', color: 'text-factory-accent' },
  { role: 'Manager', email: 'manager@factory.com', password: 'manager123', color: 'text-factory-green' },
  { role: 'Worker', email: 'worker@factory.com', password: 'worker123', color: 'text-factory-amber' },
];

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const fillDemo = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen bg-factory-bg bg-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 bg-factory-accent blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5 bg-factory-green blur-3xl"></div>
        {/* Animated lines */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute h-px bg-gradient-to-r from-transparent via-factory-accent/20 to-transparent w-full"
            style={{ top: `${20 + i * 15}%`, animationDelay: `${i * 0.5}s` }}></div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-factory-accent/10 border border-factory-accent/30 mb-4" style={{boxShadow: '0 0 40px #00D4FF33'}}>
            <Factory size={32} className="text-factory-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-factory-accent tracking-widest">SMARTFACTORY</h1>
          <p className="font-mono text-xs text-factory-dim tracking-widest mt-1">AI MANAGEMENT SYSTEM v2.1</p>
        </div>

        {/* Card */}
        <div className="factory-card corner-bracket p-8" style={{boxShadow: '0 0 60px #00D4FF11'}}>
          <div className="flex items-center gap-2 mb-6">
            <Zap size={14} className="text-factory-accent" />
            <span className="section-title">OPERATOR LOGIN</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-factory-dim mb-2 tracking-wider">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-factory-dim" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field pl-9"
                  placeholder="operator@factory.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-factory-dim mb-2 tracking-wider">PASSWORD</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-factory-dim" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pl-9 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-factory-dim hover:text-factory-text">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-factory-red/10 border border-factory-red/30 rounded px-3 py-2 text-factory-red text-sm font-mono">
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-factory-bg border-t-transparent rounded-full animate-spin"></div>
                  AUTHENTICATING...
                </>
              ) : 'ACCESS SYSTEM'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-factory-border">
            <div className="section-title mb-3">DEMO CREDENTIALS</div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDS.map(cred => (
                <button
                  key={cred.role}
                  onClick={() => fillDemo(cred)}
                  className={`text-xs font-mono p-2 border border-factory-border rounded hover:border-factory-accent/50 transition-colors text-center ${cred.color}`}
                >
                  {cred.role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-factory-dim font-mono text-xs mt-6">
          SMARTFACTORY AI © 2026 — INDUSTRIAL GRADE SYSTEM
        </p>
      </div>
    </div>
  );
}
