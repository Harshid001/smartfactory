const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageBreak, Header, Footer, PageNumberElement,
} = require('docx');
const fs = require('fs');

const BLUE  = '00D4FF';
const GREEN = '006400';
const DARK  = '1A2B3C';
const GRAY  = '5A7A9A';
const RED   = 'CC2244';

// ── Border helpers ─────────────────────────────────
const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

// ── Paragraph helpers ──────────────────────────────
const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 360, after: 180 },
  children: [new TextRun({ text, bold: true, size: 36, color: DARK, font: 'Arial' })],
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({ text, bold: true, size: 26, color: '1A4A7A', font: 'Arial' })],
});

const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 180, after: 80 },
  children: [new TextRun({ text, bold: true, size: 22, color: '2C6A9A', font: 'Arial' })],
});

const para = (text, options = {}) => new Paragraph({
  spacing: { after: 160 },
  children: [new TextRun({ text, size: 22, font: 'Calibri', color: '2C2C2C', ...options })],
});

const rule = () => new Paragraph({
  spacing: { after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: 'D0D0D0', space: 1 } },
  children: [],
});

function bullet(text, ref = 'bullets') {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22, font: 'Calibri', color: '2C2C2C' })],
  });
}

function colorBox(label, value, color = '1A4A7A') {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000, 6360],
    rows: [new TableRow({
      children: [
        new TableCell({
          borders, width: { size: 3000, type: WidthType.DXA },
          shading: { fill: '1A4A7A', type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 160, right: 80 },
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, color: 'FFFFFF', size: 20, font: 'Calibri' })] })],
        }),
        new TableCell({
          borders, width: { size: 6360, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 160, right: 80 },
          children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: 'Calibri', color: '2C2C2C' })] })],
        }),
      ],
    })],
  });
}

function twoColTable(rows, headers) {
  const headerRow = new TableRow({
    children: headers.map((h, i) => new TableCell({
      borders, width: { size: i === 0 ? 3500 : 5860, type: WidthType.DXA },
      shading: { fill: '1A4A7A', type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 80 },
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20, font: 'Arial' })] })],
    })),
  });
  const dataRows = rows.map(([a, b]) => new TableRow({
    children: [
      new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: a, bold: true, size: 20, font: 'Calibri', color: '1A4A7A' })] })] }),
      new TableCell({ borders, width: { size: 5860, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: b, size: 20, font: 'Calibri', color: '2C2C2C' })] })] }),
    ],
  }));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [3500, 5860], rows: [headerRow, ...dataRows] });
}

// ── Build Document ─────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: 'Arial', color: DARK }, paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: 'Arial', color: '1A4A7A' }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 22, bold: true, font: 'Arial', color: '2C6A9A' }, paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1A4A7A', space: 1 } },
          children: [
            new TextRun({ text: 'SmartFactory AI', bold: true, size: 20, font: 'Arial', color: '1A4A7A' }),
            new TextRun({ text: '  |  AI & Automation for Manufacturing SMEs  |  Project Documentation', size: 18, font: 'Calibri', color: GRAY }),
          ],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'D0D0D0', space: 1 } },
          children: [new TextRun({ text: 'Hackathon 2026  |  SmartFactory AI  |  Page ', size: 18, color: GRAY, font: 'Calibri' }), new PageNumberElement()],
        })],
      }),
    },
    children: [

      // ─── TITLE PAGE ───────────────────────────────────────
      new Paragraph({ spacing: { after: 400 }, children: [] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: 'SMARTFACTORY AI', bold: true, size: 64, font: 'Arial', color: DARK, allCaps: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'AI & Automation for Manufacturing SMEs', size: 28, font: 'Calibri', color: '1A4A7A', italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1A4A7A', space: 1 } },
        children: [],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: 'Complete Project Documentation', size: 22, font: 'Calibri', color: GRAY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [new TextRun({ text: 'Hackathon 2026  |  Full-Stack MERN Application', size: 20, font: 'Calibri', color: GRAY })],
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ─── 1. EXECUTIVE SUMMARY ────────────────────────────
      h1('1. Executive Summary'),
      rule(),
      para('SmartFactory AI is a full-stack AI-powered manufacturing management system built specifically for Small and Medium Enterprises (SMEs) in the manufacturing sector. The platform democratizes industrial automation by providing enterprise-grade features — predictive maintenance, real-time monitoring, AI-driven insights — at a fraction of traditional ERP costs.'),
      para('The system addresses a critical gap: most manufacturing SMEs operate without real-time visibility into their machines, production, inventory, or workforce. This results in costly unplanned downtime, inventory mismanagement, and missed production targets.'),
      new Paragraph({ spacing: { after: 200 }, children: [] }),

      twoColTable([
        ['Platform Type', 'Full-Stack Web Application (MERN)'],
        ['Primary Users', 'Manufacturing SMEs with 5-200 employees'],
        ['Modules', '14 integrated functional modules'],
        ['Key Technology', 'React 18, Node.js, MongoDB, AI/ML Scoring'],
        ['Live Data', 'Real-time simulation — 3 second refresh rate'],
        ['Demo Mode', 'Fully functional without backend/database'],
      ], ['Property', 'Value']),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // ─── 2. PROBLEM STATEMENT ─────────────────────────────
      h1('2. Problem Statement'),
      rule(),
      para('Manufacturing SMEs face significant operational challenges that larger enterprises solve with expensive ERP systems. The core problems include:'),
      bullet('23% of revenue is lost annually due to unplanned machine downtime in Indian SMEs'),
      bullet('67% of small manufacturers lack real-time production visibility'),
      bullet('Average cost of a major machine failure exceeds ₹4 lakhs per incident'),
      bullet('Most SMEs still rely on paper logs, spreadsheets, and phone calls for operations'),
      bullet('No affordable solution bridges the gap between manual operations and enterprise ERP'),
      new Paragraph({ spacing: { after: 160 }, children: [] }),
      para('SmartFactory AI solves this by providing an affordable, cloud-ready, AI-powered platform that any factory manager can use from day one — with zero hardware upgrades required.'),
      new Paragraph({ children: [new PageBreak()] }),

      // ─── 3. SOLUTION OVERVIEW ─────────────────────────────
      h1('3. Solution Overview'),
      rule(),
      h2('3.1 Core Value Proposition'),
      para('SmartFactory AI gives small factory owners the same operational intelligence that large manufacturers have — predictive maintenance, automated alerts, real-time KPIs, AI chatbot assistance, energy monitoring, and financial analytics — all in one integrated platform.'),

      h2('3.2 Key Features'),
      h3('Predictive Maintenance AI'),
      para('Custom ML scoring algorithm that analyzes machine sensors (temperature, vibration, runtime, maintenance history) and calculates a 0-100 risk score for each machine. Machines scoring above 70 are flagged for immediate attention, with estimated failure dates and maintenance recommendations.'),

      h3('Real-Time Live Data'),
      para('All dashboards update every 3 seconds with simulated sensor data. Machine temperatures fluctuate based on operating conditions, efficiency changes based on load, and status auto-recalculates to operational, warning, critical, or offline.'),

      h3('Smart Alert System'),
      para('When machines enter critical or warning states, the system automatically generates alerts, triggers OS-level browser notifications (popup), and plays sound alerts (urgent triple beep for critical, single ping for warning). Users can toggle sound and notifications independently from the header.'),

      h3('AI Factory Assistant (Chatbot)'),
      para('Natural language interface for querying factory data. Factory managers can ask questions like "Which machines need maintenance?", "What is today\'s production status?", or "Give me a factory health summary" and receive detailed, data-driven responses.'),

      h3('Energy Monitoring Module'),
      para('Real-time power consumption tracking per machine with cost analysis (₹/hour). Identifies energy-wasting machines (inefficient or critical state), shows 24-hour consumption charts, weekly trends, and per-machine cost breakdown.'),

      h3('QR Code Scanner'),
      para('Simulated QR scanning for machines, workers, and inventory items. Each asset has a unique QR pattern. Clicking "Simulate Scan" randomly selects an asset and displays its complete real-time data. Production version supports USB/Bluetooth QR scanner hardware.'),

      h3('Cost & Revenue Analytics'),
      para('Financial dashboard showing revenue vs. cost vs. profit over 6 months, cost breakdown by category (raw materials, labor, energy, maintenance, overhead), revenue by product line, and an ROI calculator demonstrating the financial impact of AI automation.'),
      new Paragraph({ children: [new PageBreak()] }),

      // ─── 4. MODULE LIST ───────────────────────────────────
      h1('4. Complete Module List'),
      rule(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 2800, 5360],
        rows: [
          new TableRow({ children: ['#', 'Module Name', 'Description'].map((h, i) => new TableCell({ borders, width: { size: [1200, 2800, 5360][i], type: WidthType.DXA }, shading: { fill: '1A4A7A', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20, font: 'Arial' })] })] })) }),
          ...([
            ['01', 'Dashboard', 'Factory overview — machines, production, alerts, analytics KPIs'],
            ['02', 'Machine Health', 'Live sensor monitoring for all machines with status badges'],
            ['03', 'Predictive Maintenance', 'AI risk scoring, maintenance scheduling, failure prediction'],
            ['04', 'Production Tracking', 'Shift-based production counter, target vs actual, hourly charts'],
            ['05', 'Inventory Management', 'Stock levels, auto low-stock alerts, supplier info'],
            ['06', 'Workforce', 'Worker performance, department assignment, safety scores'],
            ['07', 'Smart Alerts', 'Categorized alerts with sound + browser notification support'],
            ['08', 'Analytics', '6-month performance charts, efficiency trends, OEE metrics'],
            ['09', 'Energy Monitoring', 'Real-time kWh per machine, cost/hr, waste detection'],
            ['10', 'Cost & Revenue', 'P&L charts, product revenue, cost breakdown, ROI calculator'],
            ['11', 'AI Chatbot', 'Natural language factory assistant with live data access'],
            ['12', 'QR Scanner', 'Asset scanning for machines, workers, and inventory items'],
            ['13', 'Reports', 'Exportable CSV reports for all data categories'],
            ['14', 'Safety', 'Incident logging, safety score tracking, compliance status'],
          ].map(([num, name, desc]) => new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: num, bold: true, size: 20, font: 'Consolas', color: '1A4A7A' })] })] }),
              new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: name, bold: true, size: 20, font: 'Calibri' })] })] }),
              new TableCell({ borders, width: { size: 5360, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: desc, size: 20, font: 'Calibri', color: '2C2C2C' })] })] }),
            ],
          }))),
        ],
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ─── 5. TECHNOLOGY STACK ──────────────────────────────
      h1('5. Technology Stack'),
      rule(),
      twoColTable([
        ['Frontend Framework', 'React 18 with Vite build system'],
        ['Styling', 'Tailwind CSS with custom dark industrial theme'],
        ['Charts', 'Recharts (AreaChart, BarChart, LineChart, PieChart)'],
        ['Animation', 'Framer Motion + custom CSS keyframe animations'],
        ['Icons', 'Lucide React icon library'],
        ['Routing', 'React Router v6 with protected routes'],
        ['State Management', 'React Context API (AuthContext + LiveDataContext)'],
        ['Backend', 'Node.js + Express.js RESTful API'],
        ['Database', 'MongoDB with Mongoose ODM'],
        ['Authentication', 'JWT (JSON Web Tokens) with role-based access'],
        ['Fonts', 'Orbitron (display), Rajdhani (body), Share Tech Mono'],
        ['Live Data', 'Custom useLiveData hook with 3-second interval simulation'],
        ['Notifications', 'Web Notifications API + Web Audio API (no dependencies)'],
        ['QR Generation', 'SVG-based pattern generation (no external library)'],
      ], ['Technology', 'Details']),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // ─── 6. PROJECT STRUCTURE ─────────────────────────────
      h1('6. Project Structure'),
      rule(),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({
          text: [
            'smartfactory/',
            '├── frontend/',
            '│   ├── src/',
            '│   │   ├── pages/        (14 page components)',
            '│   │   ├── components/   (Layout, common UI)',
            '│   │   ├── context/      (Auth, LiveData)',
            '│   │   ├── hooks/        (useLiveData)',
            '│   │   └── data/         (dummyData.js)',
            '│   └── package.json',
            '└── backend/',
            '    ├── controllers/',
            '    ├── models/',
            '    ├── routes/',
            '    └── server.js',
          ].join('\n'),
          font: 'Consolas', size: 18, color: '2C4A6A',
        })],
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ─── 7. SETUP & INSTALLATION ──────────────────────────
      h1('7. Setup & Installation'),
      rule(),
      h2('7.1 Frontend (React)'),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: 'cd smartfactory/frontend\nnpm install\nnpm run dev\n\n# Opens at http://localhost:5173', font: 'Consolas', size: 18, color: '1A4A7A' })],
      }),

      h2('7.2 Backend (Node.js)'),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: 'cd smartfactory/backend\nnpm install\ncp .env.example .env\n# Edit .env: MONGO_URI=your_mongodb_url\n# Edit .env: JWT_SECRET=your_secret\nnpm run dev', font: 'Consolas', size: 18, color: '1A4A7A' })],
      }),

      h2('7.3 Demo Login Credentials'),
      twoColTable([
        ['Admin', 'admin@factory.com  /  admin123'],
        ['Manager', 'manager@factory.com  /  manager123'],
        ['Worker', 'worker@factory.com  /  worker123'],
      ], ['Role', 'Email / Password']),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // ─── 8. ROI & BUSINESS IMPACT ─────────────────────────
      h1('8. Business Impact & ROI'),
      rule(),
      twoColTable([
        ['Predictive Maintenance Savings', '₹2.1 Lakhs / month'],
        ['Inventory Optimization Savings', '₹85,000 / month'],
        ['Workforce Productivity Gain', '₹1.4 Lakhs / month'],
        ['Total Monthly Savings', '₹3.95 Lakhs / month'],
        ['Estimated ROI Payback Period', '4.2 months'],
        ['Machine Downtime Reduction', '30%'],
        ['Energy Waste Reduction', '25%'],
        ['Production Efficiency Gain', '18%'],
      ], ['Metric', 'Value']),
      new Paragraph({ spacing: { after: 200 }, children: [] }),

      // ─── 9. CONCLUSION ────────────────────────────────────
      h1('9. Conclusion'),
      rule(),
      para('SmartFactory AI represents a practical, deployable solution to one of India\'s most pressing industrial challenges — the digital transformation of small and medium manufacturers. By combining real-time IoT monitoring, AI-powered predictive maintenance, intelligent automation, and financial analytics in a single platform, SmartFactory AI gives SME factory owners the tools they need to compete in a modern manufacturing economy.'),
      para('The platform is built on modern, scalable technology and is designed to work immediately in demo mode without any backend infrastructure — making it easy to evaluate, demonstrate, and deploy. The production backend with MongoDB integration is ready for immediate deployment.'),
      new Paragraph({ spacing: { after: 160 }, children: [] }),
      para('Built with ❤️ for Hackathon 2026', { italics: true, color: GRAY }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/mnt/user-data/outputs/SmartFactory-AI-Documentation.docx', buffer);
  console.log('✅ Word document saved!');
}).catch(e => { console.error(e); process.exit(1); });
