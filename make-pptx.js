const PptxGenJS = require('pptxgenjs');

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_16x9';
pres.title = 'SmartFactory AI — Pitch Deck';

// ── Color Palette (Dark Industrial) ──────────────────────────
const C = {
  bg:      '060B14',
  panel:   '0D1B2E',
  border:  '1E3A5F',
  accent:  '00D4FF',
  green:   '00FF94',
  amber:   'FFB800',
  red:     'FF3860',
  purple:  '8B5CF6',
  text:    'C8DCF0',
  dim:     '5A7A9A',
  white:   'FFFFFF',
};

const makeShadow = () => ({ type: 'outer', blur: 12, offset: 4, angle: 135, color: '000000', opacity: 0.4 });

// ── Helper: slide background ──────────────────────────────────
function darkBg(slide) {
  slide.background = { color: C.bg };
  // Subtle top accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent, transparency: 30 }, line: { color: C.accent, width: 0 }
  });
}

// ── Helper: section label ─────────────────────────────────────
function sectionLabel(slide, text, x, y) {
  slide.addText(text, {
    x, y, w: 4, h: 0.25,
    fontFace: 'Consolas', fontSize: 9, color: C.accent, charSpacing: 4, margin: 0,
  });
}

// ── Helper: stat box ──────────────────────────────────────────
function statBox(slide, x, y, w, h, value, label, color = C.accent) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: C.panel }, line: { color: C.border, width: 1 }, shadow: makeShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h: 0.04, fill: { color }, line: { color, width: 0 }
  });
  slide.addText(value, {
    x: x + 0.15, y: y + 0.15, w: w - 0.3, h: h * 0.55,
    fontFace: 'Arial Black', fontSize: 26, bold: true, color, align: 'center', valign: 'middle', margin: 0,
  });
  slide.addText(label, {
    x: x + 0.1, y: y + h * 0.6, w: w - 0.2, h: h * 0.35,
    fontFace: 'Calibri', fontSize: 10, color: C.dim, align: 'center', valign: 'top', margin: 0,
  });
}

// ── Helper: feature card ──────────────────────────────────────
function featureCard(slide, x, y, w, h, title, body, accentColor = C.accent) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: C.panel }, line: { color: C.border, width: 1 }, shadow: makeShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.05, h, fill: { color: accentColor }, line: { color: accentColor, width: 0 }
  });
  slide.addText(title, {
    x: x + 0.18, y: y + 0.12, w: w - 0.25, h: 0.28,
    fontFace: 'Arial', fontSize: 12, bold: true, color: C.white, margin: 0,
  });
  slide.addText(body, {
    x: x + 0.18, y: y + 0.44, w: w - 0.25, h: h - 0.55,
    fontFace: 'Calibri', fontSize: 10, color: C.dim, margin: 0,
  });
}

// ════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Large glow circle behind title
  s.addShape(pres.shapes.OVAL, {
    x: 2.5, y: -1.5, w: 5, h: 5, fill: { color: C.accent, transparency: 90 }, line: { color: C.accent, width: 0 }
  });

  // Top bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });

  // SMARTFACTORY
  s.addText('SMARTFACTORY AI', {
    x: 0.5, y: 1.2, w: 9, h: 1.1,
    fontFace: 'Arial Black', fontSize: 52, bold: true, color: C.white, align: 'center', charSpacing: 6, margin: 0,
  });

  // Tagline accent bar
  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 2.5, w: 3, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });

  s.addText('AI & Automation for Manufacturing SMEs', {
    x: 0.5, y: 2.65, w: 9, h: 0.5,
    fontFace: 'Calibri', fontSize: 20, color: C.accent, align: 'center', italic: true, margin: 0,
  });

  s.addText('Reducing downtime · Optimizing production · Empowering small factories with enterprise-grade AI', {
    x: 0.8, y: 3.3, w: 8.4, h: 0.4,
    fontFace: 'Calibri', fontSize: 13, color: C.dim, align: 'center', margin: 0,
  });

  // Bottom stats row
  const stats = [['14', 'Modules'], ['Real-Time', 'Live Data'], ['AI-Powered', 'Predictions'], ['₹0', 'Extra Hardware']];
  stats.forEach(([val, lbl], i) => {
    const x = 0.8 + i * 2.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 4.0, w: 1.8, h: 0.9, fill: { color: C.panel }, line: { color: C.border, width: 1 } });
    s.addText(val, { x, y: 4.05, w: 1.8, h: 0.45, fontFace: 'Arial Black', fontSize: 16, bold: true, color: C.accent, align: 'center', margin: 0 });
    s.addText(lbl, { x, y: 4.5, w: 1.8, h: 0.3, fontFace: 'Calibri', fontSize: 9, color: C.dim, align: 'center', margin: 0 });
  });

  s.addText('HACKATHON PROJECT 2026', {
    x: 0.5, y: 5.2, w: 9, h: 0.25,
    fontFace: 'Consolas', fontSize: 8, color: C.dim, align: 'center', charSpacing: 3, margin: 0,
  });
}

// ════════════════════════════════════════════════════
// SLIDE 2 — THE PROBLEM
// ════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  sectionLabel(s, 'THE PROBLEM', 0.5, 0.2);
  s.addText('SME Factories Are Flying Blind', {
    x: 0.5, y: 0.55, w: 9, h: 0.7,
    fontFace: 'Arial Black', fontSize: 32, bold: true, color: C.white, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.25, w: 1.2, h: 0.04, fill: { color: C.red }, line: { color: C.red, width: 0 } });

  const problems = [
    ['23%', 'Revenue lost due to\nunplanned machine downtime', C.red],
    ['67%', 'SMEs lack real-time\nproduction visibility', C.amber],
    ['₹4L+', 'Average cost per\nmajor machine failure', C.red],
    ['Manual', 'Most SMEs still use\nspreadsheets & paper logs', C.amber],
  ];

  problems.forEach(([val, lbl, col], i) => {
    const x = 0.5 + (i % 2) * 4.6;
    const y = 1.5 + Math.floor(i / 2) * 1.5;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.2, h: 1.2, fill: { color: C.panel }, line: { color: col, width: 1 }, shadow: makeShadow() });
    s.addText(val, { x: x + 0.2, y: y + 0.12, w: 1.2, h: 0.7, fontFace: 'Arial Black', fontSize: 28, bold: true, color: col, margin: 0 });
    s.addText(lbl, { x: x + 1.5, y: y + 0.18, w: 2.5, h: 0.9, fontFace: 'Calibri', fontSize: 12, color: C.text, margin: 0 });
  });

  s.addText('Small & medium manufacturers cannot afford enterprise ERP systems — yet they face the same operational challenges.', {
    x: 0.5, y: 4.9, w: 9, h: 0.5,
    fontFace: 'Calibri', fontSize: 11, color: C.dim, italic: true, align: 'center', margin: 0,
  });
}

// ════════════════════════════════════════════════════
// SLIDE 3 — OUR SOLUTION
// ════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  sectionLabel(s, 'OUR SOLUTION', 0.5, 0.2);
  s.addText('SmartFactory AI — One Platform, Complete Control', {
    x: 0.5, y: 0.55, w: 9, h: 0.65,
    fontFace: 'Arial Black', fontSize: 26, bold: true, color: C.white, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 1.5, h: 0.04, fill: { color: C.green }, line: { color: C.green, width: 0 } });

  const features = [
    ['🤖 AI Predictive Maintenance', 'Detects failure before it happens using temperature, vibration & runtime ML scoring', C.accent],
    ['⚡ Real-Time Dashboards', 'Live sensor data updates every 3 seconds across all machines and KPIs', C.green],
    ['🔔 Smart Alert System', 'Auto-alerts with browser notifications + sound when machines go critical', C.amber],
    ['💬 AI Factory Assistant', 'Chat with your factory — ask about machines, production, inventory in plain language', C.purple],
    ['📊 Energy Monitoring', 'Real-time power consumption tracking per machine with cost analytics', C.amber],
    ['📦 QR Code Scanner', 'Scan machine tags, worker IDs, inventory barcodes for instant data lookup', C.green],
  ];

  features.forEach(([title, body, col], i) => {
    const col2 = i % 2;
    const row = Math.floor(i / 2);
    featureCard(s, 0.4 + col2 * 4.65, 1.45 + row * 1.25, 4.3, 1.1, title, body, col);
  });
}

// ════════════════════════════════════════════════════
// SLIDE 4 — KEY MODULES (14 Total)
// ════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  sectionLabel(s, 'PLATFORM MODULES', 0.5, 0.2);
  s.addText('14 Integrated Modules', {
    x: 0.5, y: 0.55, w: 6, h: 0.6,
    fontFace: 'Arial Black', fontSize: 30, bold: true, color: C.white, margin: 0,
  });

  const modules = [
    ['Dashboard', C.accent], ['Machine Health', C.accent], ['Predictive AI', C.red],
    ['Production', C.green], ['Inventory', C.amber], ['Workforce', C.green],
    ['Smart Alerts', C.red], ['Analytics', C.accent], ['Energy Monitor', C.amber],
    ['Cost & Revenue', C.green], ['AI Chatbot', C.purple], ['QR Scanner', C.accent],
    ['Reports', C.dim], ['Safety', C.red],
  ];

  modules.forEach(([name, col], i) => {
    const cols = 5;
    const row = Math.floor(i / cols);
    const c = i % cols;
    const x = 0.4 + c * 1.85;
    const y = 1.4 + row * 0.85;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 1.7, h: 0.65, fill: { color: C.panel }, line: { color: col, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 1.7, h: 0.04, fill: { color: col }, line: { color: col, width: 0 } });
    s.addText(name, { x, y: y + 0.12, w: 1.7, h: 0.45, fontFace: 'Calibri', fontSize: 10, bold: true, color: C.text, align: 'center', valign: 'middle', margin: 0 });
  });

  s.addText('All modules share live data — no silos, no data duplication', {
    x: 0.5, y: 5.1, w: 9, h: 0.3,
    fontFace: 'Calibri', fontSize: 11, color: C.dim, italic: true, align: 'center', margin: 0,
  });
}

// ════════════════════════════════════════════════════
// SLIDE 5 — AI FEATURES DEEP DIVE
// ════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  sectionLabel(s, 'AI & AUTOMATION DEEP DIVE', 0.5, 0.2);
  s.addText('How Our AI Works', {
    x: 0.5, y: 0.55, w: 9, h: 0.65,
    fontFace: 'Arial Black', fontSize: 30, bold: true, color: C.white, margin: 0,
  });

  // Predictive Maintenance scoring breakdown
  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.35, w: 4.4, h: 3.8, fill: { color: C.panel }, line: { color: C.accent, width: 1 }, shadow: makeShadow() });
  s.addText('PREDICTIVE MAINTENANCE AI', { x: 0.55, y: 1.5, w: 4.1, h: 0.3, fontFace: 'Consolas', fontSize: 9, color: C.accent, charSpacing: 2, margin: 0 });
  s.addText('Risk Score Algorithm', { x: 0.55, y: 1.85, w: 4.1, h: 0.35, fontFace: 'Arial', fontSize: 14, bold: true, color: C.white, margin: 0 });

  const factors = [
    ['Temperature', '40 pts', C.red, 40],
    ['Vibration', '30 pts', C.amber, 30],
    ['Maint. Overdue', '25 pts', C.amber, 25],
    ['Low Efficiency', '15 pts', C.green, 15],
  ];
  factors.forEach(([label, pts, col, pct], i) => {
    const y = 2.3 + i * 0.62;
    s.addText(label, { x: 0.6, y, w: 2.2, h: 0.25, fontFace: 'Calibri', fontSize: 11, color: C.text, margin: 0 });
    s.addText(pts, { x: 2.9, y, w: 0.8, h: 0.25, fontFace: 'Consolas', fontSize: 11, bold: true, color: col, align: 'right', margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: y + 0.27, w: 3.5, h: 0.1, fill: { color: C.bg }, line: { color: C.border, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: y + 0.27, w: 3.5 * (pct / 40), h: 0.1, fill: { color: col }, line: { color: col, width: 0 } });
  });
  s.addText('Score 0–100 → Low / Medium / High / Critical risk', { x: 0.6, y: 4.8, w: 4, h: 0.25, fontFace: 'Calibri', fontSize: 10, color: C.dim, italic: true, margin: 0 });

  // Right column — AI Chatbot + Alerts
  s.addShape(pres.shapes.RECTANGLE, { x: 5.15, y: 1.35, w: 4.4, h: 1.75, fill: { color: C.panel }, line: { color: C.purple, width: 1 }, shadow: makeShadow() });
  s.addText('AI FACTORY ASSISTANT', { x: 5.3, y: 1.5, w: 4.1, h: 0.3, fontFace: 'Consolas', fontSize: 9, color: C.purple, charSpacing: 2, margin: 0 });
  s.addText('Chat with your factory data in plain language — machine status, production targets, inventory levels, worker performance, failure predictions.', { x: 5.3, y: 1.85, w: 4.0, h: 0.9, fontFace: 'Calibri', fontSize: 11, color: C.text, margin: 0 });
  s.addText('Powered by real-time live data feed', { x: 5.3, y: 2.8, w: 4.0, h: 0.2, fontFace: 'Consolas', fontSize: 9, color: C.dim, margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.15, y: 3.3, w: 4.4, h: 1.85, fill: { color: C.panel }, line: { color: C.amber, width: 1 }, shadow: makeShadow() });
  s.addText('SMART ALERT ENGINE', { x: 5.3, y: 3.45, w: 4.1, h: 0.3, fontFace: 'Consolas', fontSize: 9, color: C.amber, charSpacing: 2, margin: 0 });
  const alertItems = ['Auto-detects critical/warning states every 3 sec', 'OS-level browser notifications (popup)', 'Sound alerts — urgent triple beep for critical', 'Role-based notification routing'];
  alertItems.forEach((txt, i) => {
    s.addText([{ text: '▸  ', options: { color: C.amber, bold: true } }, { text: txt, options: { color: C.text } }],
      { x: 5.3, y: 3.85 + i * 0.3, w: 4.0, h: 0.28, fontFace: 'Calibri', fontSize: 10, margin: 0 });
  });
}

// ════════════════════════════════════════════════════
// SLIDE 6 — ROI & IMPACT
// ════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  sectionLabel(s, 'BUSINESS IMPACT', 0.5, 0.2);
  s.addText('Measurable ROI for Manufacturing SMEs', {
    x: 0.5, y: 0.55, w: 9, h: 0.65,
    fontFace: 'Arial Black', fontSize: 26, bold: true, color: C.white, margin: 0,
  });

  // Big 3 ROI stats
  const roiStats = [
    ['₹2.1L', 'Saved/month from\npredictive maintenance', C.accent],
    ['₹85K', 'Inventory savings\nper month', C.amber],
    ['₹1.4L', 'Productivity gain\nvia workforce AI', C.green],
  ];
  roiStats.forEach(([val, lbl, col], i) => statBox(s, 0.4 + i * 3.1, 1.4, 2.8, 1.4, val, lbl, col));

  // Total ROI
  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 3.05, w: 9.2, h: 1.1, fill: { color: C.panel }, line: { color: C.green, width: 2 }, shadow: makeShadow() });
  s.addText('TOTAL SAVINGS', { x: 0.7, y: 3.15, w: 3, h: 0.3, fontFace: 'Consolas', fontSize: 10, color: C.dim, charSpacing: 3, margin: 0 });
  s.addText('₹3.95L / month', { x: 0.7, y: 3.45, w: 4, h: 0.55, fontFace: 'Arial Black', fontSize: 28, bold: true, color: C.green, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 3.1, w: 0.04, h: 0.9, fill: { color: C.border }, line: { color: C.border, width: 0 } });
  s.addText('PAYBACK PERIOD', { x: 5.7, y: 3.15, w: 3.5, h: 0.3, fontFace: 'Consolas', fontSize: 10, color: C.dim, charSpacing: 3, margin: 0 });
  s.addText('4.2 months', { x: 5.7, y: 3.45, w: 3.5, h: 0.55, fontFace: 'Arial Black', fontSize: 28, bold: true, color: C.accent, margin: 0 });

  // Efficiency metrics
  const metrics = [['30%', 'Reduction in unplanned downtime'], ['25%', 'Energy waste reduced via AI'], ['18%', 'Production efficiency gain'], ['40%', 'Faster maintenance response']];
  metrics.forEach(([pct, lbl], i) => {
    const x = 0.4 + (i % 2) * 4.65;
    const y = 4.3 + Math.floor(i / 2) * 0.55;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.3, h: 0.42, fill: { color: C.panel }, line: { color: C.border, width: 1 } });
    s.addText(pct, { x: x + 0.15, y, w: 0.9, h: 0.42, fontFace: 'Arial Black', fontSize: 18, bold: true, color: C.amber, align: 'center', valign: 'middle', margin: 0 });
    s.addText(lbl, { x: x + 1.1, y, w: 3.0, h: 0.42, fontFace: 'Calibri', fontSize: 11, color: C.text, valign: 'middle', margin: 0 });
  });
}

// ════════════════════════════════════════════════════
// SLIDE 7 — TECH STACK
// ════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  sectionLabel(s, 'TECHNOLOGY STACK', 0.5, 0.2);
  s.addText('Built with Modern, Scalable Tech', {
    x: 0.5, y: 0.55, w: 9, h: 0.65,
    fontFace: 'Arial Black', fontSize: 28, bold: true, color: C.white, margin: 0,
  });

  const stack = [
    { layer: 'FRONTEND', items: ['React 18 + Vite', 'Tailwind CSS', 'Recharts (live charts)', 'Framer Motion', 'Lucide Icons'], color: C.accent },
    { layer: 'BACKEND', items: ['Node.js + Express', 'MongoDB + Mongoose', 'JWT Authentication', 'RESTful APIs', 'Role-based Access'], color: C.green },
    { layer: 'AI / DATA', items: ['Custom ML Scoring', 'Web Audio API (alerts)', 'Browser Notifications API', 'Real-time WebSocket ready', 'CSV Export Engine'], color: C.purple },
    { layer: 'DEVOPS', items: ['Vite Build System', 'Environment Config', 'Seed Data Scripts', 'Production-ready MVC', 'Modular Architecture'], color: C.amber },
  ];

  stack.forEach(({ layer, items, color }, i) => {
    const x = 0.4 + (i % 2) * 4.65;
    const y = 1.45 + Math.floor(i / 2) * 2.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.3, h: 1.95, fill: { color: C.panel }, line: { color: color, width: 1 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.3, h: 0.06, fill: { color }, line: { color, width: 0 } });
    s.addText(layer, { x: x + 0.2, y: y + 0.12, w: 3.9, h: 0.3, fontFace: 'Consolas', fontSize: 11, bold: true, color, charSpacing: 3, margin: 0 });
    items.forEach((item, j) => {
      s.addText([
        { text: '• ', options: { color, bold: true } },
        { text: item, options: { color: C.text } },
      ], { x: x + 0.2, y: y + 0.52 + j * 0.27, w: 3.9, h: 0.25, fontFace: 'Calibri', fontSize: 11, margin: 0 });
    });
  });
}

// ════════════════════════════════════════════════════
// SLIDE 8 — LIVE DEMO FEATURES
// ════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  sectionLabel(s, 'LIVE DEMO', 0.5, 0.2);
  s.addText('What You\'ll See in the Demo', {
    x: 0.5, y: 0.55, w: 9, h: 0.65,
    fontFace: 'Arial Black', fontSize: 30, bold: true, color: C.white, margin: 0,
  });

  const demoSteps = [
    { step: '01', title: 'Live Machine Dashboard', desc: 'Watch 8 machines update every 3 seconds — temperature, vibration, efficiency changing in real-time', color: C.accent },
    { step: '02', title: 'Critical Alert Triggered', desc: 'Machine goes critical → browser popup notification appears + urgent alarm sound plays automatically', color: C.red },
    { step: '03', title: 'AI Predictive Maintenance', desc: 'AI scores each machine 0-100 for failure risk. Shows predicted failure date and recommended action', color: C.amber },
    { step: '04', title: 'AI Factory Chat', desc: 'Type "Which machines need maintenance?" → AI responds with live data from factory floor', color: C.purple },
    { step: '05', title: 'Energy & Cost Analytics', desc: 'Real-time kWh consumption per machine, monthly P&L, cost breakdown, and ROI calculator', color: C.green },
    { step: '06', title: 'QR Code Lookup', desc: 'Click Simulate Scan → instantly shows complete details for a machine, worker, or inventory item', color: C.accent },
  ];

  demoSteps.forEach(({ step, title, desc, color }, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.4 + col * 4.7;
    const y = 1.45 + row * 1.35;

    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.3, h: 1.2, fill: { color: C.panel }, line: { color: C.border, width: 1 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 1.2, fill: { color }, line: { color, width: 0 } });

    s.addText(step, { x: x + 0.18, y: y + 0.1, w: 0.5, h: 0.35, fontFace: 'Consolas', fontSize: 14, bold: true, color, margin: 0 });
    s.addText(title, { x: x + 0.7, y: y + 0.1, w: 3.4, h: 0.32, fontFace: 'Arial', fontSize: 12, bold: true, color: C.white, margin: 0 });
    s.addText(desc, { x: x + 0.18, y: y + 0.5, w: 3.9, h: 0.62, fontFace: 'Calibri', fontSize: 10, color: C.dim, margin: 0 });
  });
}

// ════════════════════════════════════════════════════
// SLIDE 9 — CLOSING / CTA
// ════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.OVAL, { x: -1, y: -1, w: 6, h: 6, fill: { color: C.accent, transparency: 93 }, line: { color: C.accent, width: 0 } });
  s.addShape(pres.shapes.OVAL, { x: 6, y: 2, w: 5, h: 5, fill: { color: C.green, transparency: 93 }, line: { color: C.green, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.green }, line: { color: C.green, width: 0 } });

  s.addText('THE FUTURE OF', { x: 0.5, y: 1.0, w: 9, h: 0.45, fontFace: 'Consolas', fontSize: 14, color: C.dim, align: 'center', charSpacing: 5, margin: 0 });
  s.addText('SMART MANUFACTURING', { x: 0.5, y: 1.5, w: 9, h: 1.0, fontFace: 'Arial Black', fontSize: 44, bold: true, color: C.white, align: 'center', charSpacing: 4, margin: 0 });
  s.addText('IS ACCESSIBLE TO EVERY SME', { x: 0.5, y: 2.55, w: 9, h: 0.6, fontFace: 'Arial Black', fontSize: 22, bold: true, color: C.accent, align: 'center', charSpacing: 2, margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.3, w: 3, h: 0.04, fill: { color: C.green }, line: { color: C.green, width: 0 } });

  s.addText('SmartFactory AI democratizes industrial automation — giving small factories the same competitive advantage as large enterprises, at a fraction of the cost.', {
    x: 1, y: 3.5, w: 8, h: 0.7,
    fontFace: 'Calibri', fontSize: 13, color: C.dim, align: 'center', italic: true, margin: 0,
  });

  const ctaItems = ['🏭  14 Integrated Modules', '⚡  Real-Time Live Data', '🤖  AI Predictions', '📱  Zero Extra Hardware'];
  ctaItems.forEach((txt, i) => {
    s.addText(txt, { x: 0.8 + i * 2.1, y: 4.4, w: 2.0, h: 0.35, fontFace: 'Calibri', fontSize: 12, bold: true, color: C.accent, align: 'center', margin: 0 });
  });

  s.addText('SMARTFACTORY AI  ·  HACKATHON 2026', {
    x: 0.5, y: 5.1, w: 9, h: 0.3,
    fontFace: 'Consolas', fontSize: 9, color: C.dim, align: 'center', charSpacing: 3, margin: 0,
  });
}

// ── Save ────────────────────────────────────────────
pres.writeFile({ fileName: '/mnt/user-data/outputs/SmartFactory-AI-PitchDeck.pptx' })
  .then(() => console.log('✅ PowerPoint saved!'))
  .catch(e => { console.error('Error:', e); process.exit(1); });
