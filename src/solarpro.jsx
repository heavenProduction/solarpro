import { useState, useEffect, useRef } from "react";

// ============================================================
// MOCK DATA & CONSTANTS
// ============================================================
const ROLES = { SUPER_ADMIN: "super_admin", DEV_ADMIN: "dev_admin", USER: "user" };

const initialUsers = [
  { id: "u1", email: "admin@solarpro.io", password: "admin123", name: "Platform Admin", role: ROLES.SUPER_ADMIN, developerId: null, active: true, permissions: [] },
  { id: "u2", email: "ceo@sunpower.com", password: "pass123", name: "James Rivera", role: ROLES.DEV_ADMIN, developerId: "d1", active: true, permissions: [] },
  { id: "u3", email: "sales@sunpower.com", password: "pass123", name: "Mia Chen", role: ROLES.USER, developerId: "d1", active: true, permissions: ["projects", "proposals", "notes", "documents"] },
  { id: "u4", email: "admin@greenwatt.com", password: "pass123", name: "Tom Okafor", role: ROLES.DEV_ADMIN, developerId: "d2", active: true, permissions: [] },
];

const initialDevelopers = [
  { id: "d1", companyName: "SunPower Solutions", email: "ceo@sunpower.com", phone: "+1-555-0101", address: "1234 Solar Ave, Phoenix, AZ 85001", website: "https://sunpower.com", seats: 10, usedSeats: 2, active: true, plan: "Professional", logo: null, electricityPrice: 0.14, solarGenerationFactor: 1400, costPerKW: 2800, bankDetails: "Bank: Chase\nAccount: 1234567890\nRouting: 021000021", terms: "Payment due within 30 days of installation completion.", createdAt: "2024-01-15" },
  { id: "d2", companyName: "GreenWatt Energy", email: "admin@greenwatt.com", phone: "+1-555-0202", address: "5678 Energy Blvd, Austin, TX 78701", website: "https://greenwatt.com", seats: 5, usedSeats: 1, active: true, plan: "Starter", logo: null, electricityPrice: 0.12, solarGenerationFactor: 1350, costPerKW: 2600, bankDetails: "Bank: Wells Fargo\nAccount: 9876543210\nRouting: 121042882", terms: "50% upfront, 50% on completion.", createdAt: "2024-03-01" },
];

const initialProjects = [
  { id: "p1", developerId: "d1", userId: "u3", customerName: "Robert Kim", customerPhone: "+1-555-1001", customerEmail: "r.kim@email.com", customerAddress: "789 Oak St, Scottsdale, AZ 85251", projectSize: 8.5, projectType: "Residential", status: "Active", createdAt: "2024-06-01" },
  { id: "p2", developerId: "d1", userId: "u2", customerName: "Apex Corp", customerPhone: "+1-555-2001", customerEmail: "facilities@apex.com", customerAddress: "100 Business Park, Phoenix, AZ 85004", projectSize: 45, projectType: "Commercial", status: "Proposal Sent", createdAt: "2024-05-20" },
  { id: "p3", developerId: "d2", userId: "u4", customerName: "Warehouse Co.", customerPhone: "+1-555-3001", customerEmail: "ops@warehouse.com", customerAddress: "200 Industrial Way, Austin, TX 78728", projectSize: 120, projectType: "Industrial", status: "Active", createdAt: "2024-06-05" },
];

const initialNotes = [
  { id: "n1", projectId: "p1", userId: "u3", content: "Customer interested in battery backup. Discussed Powerwall options.", createdAt: "2024-06-02T14:30:00Z" },
  { id: "n2", projectId: "p1", userId: "u2", content: "Site survey scheduled for June 10th.", createdAt: "2024-06-03T09:00:00Z" },
];

const initialDocuments = [
  { id: "doc1", projectId: "p1", name: "Site Survey Photos.pdf", type: "PDF", size: "2.3 MB", uploadDate: "2024-06-05", uploadedBy: "Mia Chen" },
  { id: "doc2", projectId: "p2", name: "Contract Draft.docx", type: "Word", size: "128 KB", uploadDate: "2024-05-22", uploadedBy: "James Rivera" },
];

const initialTemplates = [
  { id: "t1", name: "Residential Solar Proposal", description: "Standard proposal for residential installations", assignedTo: ["d1", "d2"], variables: ["company_name", "customer_name", "project_size", "total_cost", "annual_savings", "payback_period"], createdAt: "2024-01-01" },
  { id: "t2", name: "Commercial Solar Proposal", description: "Detailed proposal for commercial projects", assignedTo: ["d1"], variables: ["company_name", "customer_name", "project_size", "total_cost", "annual_savings", "payback_period", "roi"], createdAt: "2024-02-01" },
];

const initialProposals = [
  { id: "pr1", projectId: "p1", templateId: "t1", status: "Draft", createdAt: "2024-06-04", data: {} },
];

const invoicesInit = [
  { id: "inv1", developerId: "d1", amount: 299, status: "Paid", date: "2024-05-01", plan: "Professional" },
  { id: "inv2", developerId: "d1", amount: 299, status: "Paid", date: "2024-04-01", plan: "Professional" },
  { id: "inv3", developerId: "d2", amount: 99, status: "Pending", date: "2024-06-01", plan: "Starter" },
];

// ============================================================
// ICONS (inline SVG components)
// ============================================================
const Icon = ({ name, size = 18, className = "" }) => {
  const icons = {
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    folder: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    file: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    building: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
    invoice: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    template: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    note: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    key: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    leaf: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8C8 10 5.9 16.17 3.82 19.34l1.43.86c.47-.81.96-1.59 1.47-2.3M12.84 2C12.84 2 2.53 5.56 2 14c0 0 3.08-2.37 6.08-2 0 0-2.43 2.61-2.43 5.18 0 0 1.85-1.65 3.97-1.65 0 0-.82 2.06-.5 3.15 0 0 1.19-1.64 2.88-1.92 0 0 3.12 2.21 3.12 5.27 0 0 2.94-1.72 5.09-7.08 0 0-3.88 2.34-4.86 1.42C16.35 16.37 22 11.57 22 2c0 0-5.79-.4-9.16 0z"/></svg>,
  };
  return <span className={className}>{icons[name] || <span>?</span>}</span>;
};

// ============================================================
// UTILITY HOOKS & HELPERS
// ============================================================
const useLocalStorage = (key, init) => {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
};

const statusColor = (s) => ({
  "Active": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  "Proposal Sent": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "Completed": "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  "Cancelled": "bg-red-500/20 text-red-300 border border-red-500/30",
  "Paid": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  "Pending": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "Draft": "bg-slate-500/20 text-slate-300 border border-slate-500/30",
}[s] || "bg-slate-500/20 text-slate-300");

const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
const fmtCurrency = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

// ============================================================
// CHART COMPONENTS
// ============================================================
const PaybackChart = ({ data }) => {
  const { totalCost, annualSavings, years = 25 } = data;
  const pts = Array.from({ length: years + 1 }, (_, i) => ({ y: i, val: i * annualSavings - totalCost }));
  const maxV = Math.max(...pts.map(p => p.val));
  const minV = Math.min(...pts.map(p => p.val));
  const range = maxV - minV || 1;
  const W = 380, H = 160, PAD = 40;
  const x = (i) => PAD + (i / years) * (W - PAD * 2);
  const y = (v) => H - PAD - ((v - minV) / range) * (H - PAD * 2);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.y)},${y(p.val)}`).join(" ");
  const zeroY = y(0);
  return (
    <svg width={W} height={H} className="w-full">
      <defs>
        <linearGradient id="gUp" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4"/><stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/></linearGradient>
        <linearGradient id="gDown" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity="0"/><stop offset="100%" stopColor="#ef4444" stopOpacity="0.3"/></linearGradient>
      </defs>
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#334155" strokeWidth="1"/>
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#334155" strokeWidth="1"/>
      {minV < 0 && maxV > 0 && <line x1={PAD} y1={zeroY} x2={W - PAD} y2={zeroY} stroke="#475569" strokeWidth="1" strokeDasharray="4,4"/>}
      {[0, 5, 10, 15, 20, 25].map(yr => (
        <text key={yr} x={x(yr)} y={H - 8} textAnchor="middle" fill="#64748b" fontSize="10">{yr}y</text>
      ))}
      <path d={`${path} L${x(years)},${H - PAD} L${x(0)},${H - PAD} Z`} fill={pts[pts.length - 1].val > 0 ? "url(#gUp)" : "url(#gDown)"}/>
      <path d={path} stroke="#f59e0b" strokeWidth="2" fill="none"/>
      {pts.map((p, i) => p.val === 0 && <circle key={i} cx={x(p.y)} cy={y(p.val)} r="4" fill="#f59e0b"/>)}
    </svg>
  );
};

const SavingsBarChart = ({ data }) => {
  const { annualBillBefore, annualSavings, years = 10 } = data;
  const annualBillAfter = annualBillBefore - annualSavings;
  const max = annualBillBefore || 1;
  const W = 380, H = 160, PAD = 40, bW = 18, gap = 8;
  const cols = Array.from({ length: years }, (_, i) => i + 1);
  const totalW = cols.length * (bW * 2 + gap + 8);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={PAD} y1={H - PAD} x2={W - 10} y2={H - PAD} stroke="#334155" strokeWidth="1"/>
      {cols.slice(0, 8).map((yr, i) => {
        const base = PAD + i * (bW * 2 + gap + 6);
        const bH1 = ((annualBillBefore * (1 + yr * 0.03)) / (max * 1.3)) * (H - PAD * 2);
        const bH2 = ((annualBillAfter * (1 + yr * 0.01)) / (max * 1.3)) * (H - PAD * 2);
        return (
          <g key={yr}>
            <rect x={base} y={H - PAD - bH1} width={bW} height={bH1} fill="#ef4444" rx="2" opacity="0.7"/>
            <rect x={base + bW + 2} y={H - PAD - bH2} width={bW} height={bH2} fill="#10b981" rx="2" opacity="0.7"/>
            <text x={base + bW} y={H - 6} textAnchor="middle" fill="#64748b" fontSize="9">{yr}</text>
          </g>
        );
      })}
      <g><rect x={W - 90} y={10} width="10" height="10" fill="#ef4444" rx="1"/><text x={W - 76} y="19" fill="#94a3b8" fontSize="9">Before</text></g>
      <g><rect x={W - 90} y={26} width="10" height="10" fill="#10b981" rx="1"/><text x={W - 76} y="35" fill="#94a3b8" fontSize="9">After</text></g>
    </svg>
  );
};

// ============================================================
// MODAL COMPONENT
// ============================================================
const Modal = ({ title, onClose, children, wide = false }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className={`bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl ${wide ? "w-full max-w-3xl" : "w-full max-w-lg"} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white font-display">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"><Icon name="x" size={20}/></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ============================================================
// FORM COMPONENTS
// ============================================================
const Field = ({ label, type = "text", value, onChange, placeholder, required, options, rows }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}{required && <span className="text-amber-400 ml-1">*</span>}</label>
    {type === "select" ? (
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors">
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"/>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"/>
    )}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled, className = "", type = "button" }) => {
  const base = "inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-400 text-slate-900",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    ghost: "text-slate-300 hover:text-white hover:bg-slate-700",
    outline: "border border-slate-600 text-slate-300 hover:border-amber-400 hover:text-amber-400",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };
  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>{children}</button>;
};

// ============================================================
// LOGIN PAGE
// ============================================================
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 600));
    const user = initialUsers.find(u => u.email === email && u.password === password && u.active);
    if (user) onLogin(user);
    else setError("Invalid credentials or account inactive.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#060c18] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl"/>
        <div className="absolute bottom-[-20%] right-[5%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/3 rounded-full blur-3xl"/>
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f59e0b" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Icon name="sun" size={24} className="text-white"/>
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tight" style={{fontFamily: "'Orbitron', 'Space Mono', monospace"}}>SOLAR<span className="text-amber-400">PRO</span></div>
              <div className="text-xs text-slate-400 tracking-widest uppercase">Solar CRM Platform</div>
            </div>
          </div>
        </div>

        <div className="bg-[#0c1929]/80 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-6">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <Icon name="alert" size={16}/>{error}
            </div>
          )}

          <form onSubmit={handle}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"/>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"/>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"/><span>Signing in...</span></> : <><Icon name="zap" size={18}/>Sign In</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 mb-2 font-medium">Demo Accounts:</p>
            <div className="space-y-1">
              {[["Super Admin", "admin@solarpro.io", "admin123"], ["Dev Admin", "ceo@sunpower.com", "pass123"], ["User", "sales@sunpower.com", "pass123"]].map(([role, e, p]) => (
                <button key={e} onClick={() => { setEmail(e); setPassword(p); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-700/50 transition-colors group">
                  <span className="text-xs text-amber-400 font-medium">{role}: </span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-300">{e}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SIDEBAR NAVIGATION
// ============================================================
const Sidebar = ({ user, currentPage, setPage, onLogout, developer }) => {
  const superAdminNav = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "developers", label: "Developers", icon: "building" },
    { id: "templates", label: "Templates", icon: "template" },
    { id: "invoices", label: "Invoices", icon: "invoice" },
    { id: "users", label: "All Users", icon: "users" },
  ];
  const devAdminNav = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "projects", label: "Projects", icon: "folder" },
    { id: "team", label: "Team", icon: "users" },
    { id: "templates", label: "Templates", icon: "template" },
    { id: "settings", label: "Account Settings", icon: "settings" },
  ];
  const userNav = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "projects", label: "Projects", icon: "folder" },
  ];

  const nav = user.role === ROLES.SUPER_ADMIN ? superAdminNav : user.role === ROLES.DEV_ADMIN ? devAdminNav : userNav;

  return (
    <div className="w-60 bg-[#070e1c] border-r border-slate-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Icon name="sun" size={18} className="text-white"/>
          </div>
          <div>
            <div className="text-base font-black text-white" style={{fontFamily:"'Orbitron','monospace'"}}>SOLAR<span className="text-amber-400">PRO</span></div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
              {user.role === ROLES.SUPER_ADMIN ? "Platform" : developer?.companyName || "Dashboard"}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${currentPage === item.id ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/70"}`}>
            <Icon name={item.icon} size={17}/>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User info */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-sm font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user.name}</div>
            <div className="text-xs text-slate-500 capitalize">{user.role.replace("_", " ")}</div>
          </div>
          <button onClick={onLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="Logout">
            <Icon name="logout" size={17}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DASHBOARD PAGES
// ============================================================
const StatCard = ({ label, value, icon, color = "amber", sub }) => (
  <div className={`bg-[#0c1929] border border-slate-700/50 rounded-xl p-5 hover:border-${color}-500/30 transition-colors`}>
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-lg bg-${color}-500/15 flex items-center justify-center text-${color}-400`}>
        <Icon name={icon} size={20}/>
      </div>
    </div>
    <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
    {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
  </div>
);

const SuperAdminDashboard = ({ developers, users, projects, invoices }) => {
  const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const activeDevs = developers.filter(d => d.active).length;
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Platform Overview</h1>
      <p className="text-slate-400 mb-6">Manage all developer accounts and platform settings</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Developers" value={activeDevs} icon="building" color="amber"/>
        <StatCard label="Total Users" value={users.filter(u => u.role !== ROLES.SUPER_ADMIN).length} icon="users" color="sky"/>
        <StatCard label="Total Projects" value={projects.length} icon="folder" color="emerald"/>
        <StatCard label="Platform Revenue" value={fmtCurrency(totalRevenue)} icon="invoice" color="purple"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
          <h3 className="font-bold text-white mb-4">Recent Developers</h3>
          <div className="space-y-3">
            {developers.map(d => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                <div>
                  <div className="text-sm font-medium text-white">{d.companyName}</div>
                  <div className="text-xs text-slate-400">{d.plan} · {d.usedSeats}/{d.seats} seats</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(d.active ? "Active" : "Cancelled")}`}>
                  {d.active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
          <h3 className="font-bold text-white mb-4">Recent Invoices</h3>
          <div className="space-y-3">
            {invoices.slice(0, 5).map(inv => {
              const dev = developers.find(d => d.id === inv.developerId);
              return (
                <div key={inv.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-white">{dev?.companyName}</div>
                    <div className="text-xs text-slate-400">{fmtDate(inv.date)} · {inv.plan}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{fmtCurrency(inv.amount)}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(inv.status)}`}>{inv.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const DevDashboard = ({ developer, projects, users, proposals }) => {
  const devProjects = projects.filter(p => p.developerId === developer.id);
  const devUsers = users.filter(u => u.developerId === developer.id);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{developer.companyName}</h1>
          <p className="text-slate-400">Welcome to your solar management dashboard</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <Icon name="shield" size={16} className="text-emerald-400"/>
          <span className="text-sm text-emerald-400 font-medium">{developer.plan} Plan</span>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Projects" value={devProjects.length} icon="folder" color="amber"/>
        <StatCard label="Active Projects" value={devProjects.filter(p => p.status === "Active").length} icon="zap" color="emerald"/>
        <StatCard label="Team Members" value={devUsers.length} icon="users" color="sky"/>
        <StatCard label="Seats Used" value={`${developer.usedSeats}/${developer.seats}`} icon="key" color="purple" sub="user seats"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
          <h3 className="font-bold text-white mb-4">Recent Projects</h3>
          {devProjects.length === 0 ? <p className="text-slate-400 text-sm">No projects yet.</p> : (
            <div className="space-y-3">
              {devProjects.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-white">{p.customerName}</div>
                    <div className="text-xs text-slate-400">{p.projectSize} kW · {p.projectType}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.status)}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
          <h3 className="font-bold text-white mb-4">Account Info</h3>
          <div className="space-y-3">
            {[["Electricity Price", `$${developer.electricityPrice}/kWh`], ["Solar Gen Factor", `${developer.solarGenerationFactor} kWh/kWp`], ["Cost per kW", fmtCurrency(developer.costPerKW)]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-slate-400">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DEVELOPERS MANAGEMENT (Super Admin)
// ============================================================
const DevelopersPage = ({ developers, setDevelopers, users, setUsers, invoices, setInvoices }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editDev, setEditDev] = useState(null);
  const [viewDev, setViewDev] = useState(null);
  const blank = { companyName: "", email: "", phone: "", address: "", website: "", seats: 5, plan: "Starter", electricityPrice: 0.12, solarGenerationFactor: 1350, costPerKW: 2600, bankDetails: "", terms: "" };
  const [form, setForm] = useState(blank);

  const save = () => {
    if (editDev) {
      setDevelopers(ds => ds.map(d => d.id === editDev.id ? { ...d, ...form } : d));
    } else {
      const newD = { ...form, id: `d${Date.now()}`, active: true, usedSeats: 0, logo: null, createdAt: new Date().toISOString().split("T")[0] };
      setDevelopers(ds => [...ds, newD]);
      // Auto-create admin user
      const newU = { id: `u${Date.now()}`, email: form.email, password: "changeme", name: `${form.companyName} Admin`, role: ROLES.DEV_ADMIN, developerId: newD.id, active: true, permissions: [] };
      setUsers(us => [...us, newU]);
    }
    setShowAdd(false); setEditDev(null); setForm(blank);
  };

  const genInvoice = (dev) => {
    const amounts = { Starter: 99, Professional: 299, Enterprise: 599 };
    const inv = { id: `inv${Date.now()}`, developerId: dev.id, amount: amounts[dev.plan] || 99, status: "Pending", date: new Date().toISOString().split("T")[0], plan: dev.plan };
    setInvoices(is => [...is, inv]);
  };

  const openEdit = (dev) => { setForm({ ...dev }); setEditDev(dev); setShowAdd(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Developer Accounts</h1><p className="text-slate-400">Manage solar company accounts</p></div>
        <Btn onClick={() => { setForm(blank); setEditDev(null); setShowAdd(true); }}><Icon name="plus" size={16}/>New Developer</Btn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {developers.map(dev => (
          <div key={dev.id} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-lg">{dev.companyName}</h3>
                <p className="text-slate-400 text-sm">{dev.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(dev.active ? "Active" : "Cancelled")}`}>{dev.active ? "Active" : "Inactive"}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{dev.plan}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div><span className="text-slate-500">Seats:</span> <span className="text-white ml-1">{dev.usedSeats}/{dev.seats}</span></div>
              <div><span className="text-slate-500">Phone:</span> <span className="text-white ml-1">{dev.phone}</span></div>
              <div><span className="text-slate-500">Projects:</span> <span className="text-white ml-1">{users.filter(u => u.developerId === dev.id).length} users</span></div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Btn size="sm" variant="ghost" onClick={() => openEdit(dev)}><Icon name="edit" size={14}/>Edit</Btn>
              <Btn size="sm" variant="ghost" onClick={() => setDevelopers(ds => ds.map(d => d.id === dev.id ? { ...d, active: !d.active } : d))}>
                {dev.active ? <><Icon name="x" size={14}/>Deactivate</> : <><Icon name="check" size={14}/>Activate</>}
              </Btn>
              <Btn size="sm" variant="ghost" onClick={() => genInvoice(dev)}><Icon name="invoice" size={14}/>Gen Invoice</Btn>
              <Btn size="sm" variant="ghost" onClick={() => setViewDev(dev)}><Icon name="eye" size={14}/>View</Btn>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title={editDev ? "Edit Developer" : "New Developer Account"} onClose={() => { setShowAdd(false); setEditDev(null); }} wide>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company Name" value={form.companyName} onChange={v => setForm(f => ({ ...f, companyName: v }))} required/>
            <Field label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} required/>
            <Field label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))}/>
            <Field label="Website" value={form.website} onChange={v => setForm(f => ({ ...f, website: v }))}/>
            <Field label="Plan" type="select" value={form.plan} onChange={v => setForm(f => ({ ...f, plan: v }))} options={[{ value: "Starter", label: "Starter - $99/mo" }, { value: "Professional", label: "Professional - $299/mo" }, { value: "Enterprise", label: "Enterprise - $599/mo" }]}/>
            <Field label="User Seats" type="number" value={form.seats} onChange={v => setForm(f => ({ ...f, seats: parseInt(v) || 0 }))}/>
            <Field label="Electricity Price ($/kWh)" type="number" value={form.electricityPrice} onChange={v => setForm(f => ({ ...f, electricityPrice: parseFloat(v) || 0 }))}/>
            <Field label="Solar Generation Factor" type="number" value={form.solarGenerationFactor} onChange={v => setForm(f => ({ ...f, solarGenerationFactor: parseInt(v) || 0 }))}/>
            <Field label="Cost per kW ($)" type="number" value={form.costPerKW} onChange={v => setForm(f => ({ ...f, costPerKW: parseInt(v) || 0 }))}/>
          </div>
          <Field label="Address" type="textarea" rows={2} value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))}/>
          <Field label="Bank Details" type="textarea" rows={3} value={form.bankDetails} onChange={v => setForm(f => ({ ...f, bankDetails: v }))}/>
          <Field label="Terms & Conditions" type="textarea" rows={3} value={form.terms} onChange={v => setForm(f => ({ ...f, terms: v }))}/>
          <div className="flex gap-3 mt-2">
            <Btn onClick={save} className="flex-1">Save Developer</Btn>
            <Btn variant="secondary" onClick={() => { setShowAdd(false); setEditDev(null); }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {viewDev && (
        <Modal title={viewDev.companyName} onClose={() => setViewDev(null)} wide>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[["Email", viewDev.email], ["Phone", viewDev.phone], ["Website", viewDev.website], ["Plan", viewDev.plan], ["Seats", `${viewDev.usedSeats}/${viewDev.seats}`], ["Created", fmtDate(viewDev.createdAt)], ["Electricity Price", `$${viewDev.electricityPrice}/kWh`], ["Solar Gen", `${viewDev.solarGenerationFactor} kWh/kWp`], ["Cost/kW", fmtCurrency(viewDev.costPerKW)]].map(([k, v]) => (
              <div key={k} className="bg-slate-800/50 rounded-lg p-3"><div className="text-slate-400 mb-0.5">{k}</div><div className="text-white font-medium">{v || "—"}</div></div>
            ))}
          </div>
          {viewDev.address && <div className="mt-4 bg-slate-800/50 rounded-lg p-3"><div className="text-slate-400 text-sm mb-0.5">Address</div><div className="text-white text-sm">{viewDev.address}</div></div>}
          {viewDev.terms && <div className="mt-3 bg-slate-800/50 rounded-lg p-3"><div className="text-slate-400 text-sm mb-0.5">Terms & Conditions</div><div className="text-white text-sm">{viewDev.terms}</div></div>}
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// INVOICES PAGE (Super Admin)
// ============================================================
const InvoicesPage = ({ invoices, setInvoices, developers }) => (
  <div>
    <h1 className="text-2xl font-bold text-white mb-1">Invoices</h1>
    <p className="text-slate-400 mb-6">Platform subscription invoices</p>
    <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800/30">
            {["Invoice ID", "Developer", "Plan", "Amount", "Date", "Status", "Actions"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => {
            const dev = developers.find(d => d.id === inv.developerId);
            return (
              <tr key={inv.id} className="border-b border-slate-700/30 hover:bg-slate-800/20">
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">{inv.id.toUpperCase()}</td>
                <td className="px-4 py-3 text-white font-medium">{dev?.companyName || "—"}</td>
                <td className="px-4 py-3 text-slate-300">{inv.plan}</td>
                <td className="px-4 py-3 text-white font-bold">{fmtCurrency(inv.amount)}</td>
                <td className="px-4 py-3 text-slate-400">{fmtDate(inv.date)}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(inv.status)}`}>{inv.status}</span></td>
                <td className="px-4 py-3">
                  {inv.status === "Pending" && (
                    <Btn size="sm" variant="ghost" onClick={() => setInvoices(is => is.map(i => i.id === inv.id ? { ...i, status: "Paid" } : i))}>
                      <Icon name="check" size={14}/>Mark Paid
                    </Btn>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ============================================================
// USERS MANAGEMENT
// ============================================================
const UsersPage = ({ users, setUsers, currentUser, developer }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "changeme", role: ROLES.USER, permissions: [] });

  const myUsers = currentUser.role === ROLES.SUPER_ADMIN
    ? users.filter(u => u.role !== ROLES.SUPER_ADMIN)
    : users.filter(u => u.developerId === currentUser.developerId);

  const perms = ["projects", "proposals", "notes", "documents", "settings"];

  const save = () => {
    const nu = { ...form, id: `u${Date.now()}`, active: true, developerId: currentUser.role === ROLES.SUPER_ADMIN ? null : currentUser.developerId };
    setUsers(us => [...us, nu]);
    setShowAdd(false);
    setForm({ name: "", email: "", password: "changeme", role: ROLES.USER, permissions: [] });
  };

  const togglePerm = (p) => setForm(f => ({ ...f, permissions: f.permissions.includes(p) ? f.permissions.filter(x => x !== p) : [...f.permissions, p] }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">{currentUser.role === ROLES.SUPER_ADMIN ? "All Users" : "Team Members"}</h1></div>
        {(currentUser.role === ROLES.DEV_ADMIN) && (
          <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={16}/>Add User</Btn>
        )}
      </div>
      <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/30">
              {["Name", "Email", "Role", "Permissions", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myUsers.map(u => (
              <tr key={u.id} className="border-b border-slate-700/30 hover:bg-slate-800/20">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold text-white">{u.name.charAt(0)}</div>
                    <span className="text-white font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400">{u.email}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 capitalize">{u.role.replace("_", " ")}</span></td>
                <td className="px-4 py-3 text-slate-400 text-xs">{u.permissions.join(", ") || "all"}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(u.active ? "Active" : "Cancelled")}`}>{u.active ? "Active" : "Inactive"}</span></td>
                <td className="px-4 py-3">
                  {u.id !== currentUser.id && (
                    <Btn size="sm" variant="ghost" onClick={() => setUsers(us => us.map(x => x.id === u.id ? { ...x, active: !x.active } : x))}>
                      {u.active ? "Deactivate" : "Activate"}
                    </Btn>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Add Team Member" onClose={() => setShowAdd(false)}>
          <Field label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required/>
          <Field label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} required/>
          <Field label="Password" type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))}/>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Permissions</label>
            <div className="flex flex-wrap gap-2">
              {perms.map(p => (
                <button key={p} onClick={() => togglePerm(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${form.permissions.includes(p) ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-500"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Btn onClick={save} className="flex-1">Add User</Btn>
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// TEMPLATES PAGE
// ============================================================
const TemplatesPage = ({ templates, setTemplates, developers, currentUser }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", assignedTo: [], variables: [] });

  const myTemplates = currentUser.role === ROLES.SUPER_ADMIN ? templates : templates.filter(t => t.assignedTo.includes(currentUser.developerId));

  const save = () => {
    const nt = { ...form, id: `t${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] };
    setTemplates(ts => [...ts, nt]);
    setShowAdd(false);
    setForm({ name: "", description: "", assignedTo: [], variables: [] });
  };

  const toggleAssign = (devId) => setForm(f => ({ ...f, assignedTo: f.assignedTo.includes(devId) ? f.assignedTo.filter(x => x !== devId) : [...f.assignedTo, devId] }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Proposal Templates</h1><p className="text-slate-400">Manage proposal templates</p></div>
        {currentUser.role === ROLES.SUPER_ADMIN && <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={16}/>New Template</Btn>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {myTemplates.map(t => (
          <div key={t.id} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400"><Icon name="template" size={20}/></div>
              <div>
                <h3 className="font-bold text-white">{t.name}</h3>
                <p className="text-slate-400 text-sm">{t.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {t.variables.map(v => (
                <span key={v} className="text-xs px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded font-mono">{"{{" + v + "}}"}</span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Assigned to {t.assignedTo.length} developer{t.assignedTo.length !== 1 ? "s" : ""}</span>
              <span>{fmtDate(t.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="New Proposal Template" onClose={() => setShowAdd(false)} wide>
          <Field label="Template Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required/>
          <Field label="Description" type="textarea" rows={2} value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))}/>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Assign to Developers</label>
            <div className="space-y-2">
              {developers.map(d => (
                <label key={d.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-700/30">
                  <input type="checkbox" checked={form.assignedTo.includes(d.id)} onChange={() => toggleAssign(d.id)} className="rounded"/>
                  <span className="text-sm text-white">{d.companyName}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Btn onClick={save} className="flex-1">Create Template</Btn>
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// ACCOUNT SETTINGS PAGE
// ============================================================
const SettingsPage = ({ developer, setDevelopers }) => {
  const [form, setForm] = useState({ ...developer });
  const save = () => { setDevelopers(ds => ds.map(d => d.id === developer.id ? { ...d, ...form } : d)); };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Account Settings</h1>
      <p className="text-slate-400 mb-6">Manage your company profile and default variables</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Company Profile</h3>
          <Field label="Company Name" value={form.companyName} onChange={v => setForm(f => ({ ...f, companyName: v }))}/>
          <Field label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))}/>
          <Field label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))}/>
          <Field label="Website" value={form.website} onChange={v => setForm(f => ({ ...f, website: v }))}/>
          <Field label="Address" type="textarea" rows={2} value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))}/>
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Solar Variables</h3>
          <Field label="Default Electricity Price ($/kWh)" type="number" value={form.electricityPrice} onChange={v => setForm(f => ({ ...f, electricityPrice: parseFloat(v) || 0 }))}/>
          <Field label="Solar Generation Factor (kWh/kWp/yr)" type="number" value={form.solarGenerationFactor} onChange={v => setForm(f => ({ ...f, solarGenerationFactor: parseInt(v) || 0 }))}/>
          <Field label="Cost per kW ($)" type="number" value={form.costPerKW} onChange={v => setForm(f => ({ ...f, costPerKW: parseInt(v) || 0 }))}/>
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Bank Details</h3>
          <Field label="" type="textarea" rows={4} value={form.bankDetails} onChange={v => setForm(f => ({ ...f, bankDetails: v }))}/>
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Terms & Conditions</h3>
          <Field label="" type="textarea" rows={4} value={form.terms} onChange={v => setForm(f => ({ ...f, terms: v }))}/>
        </div>
      </div>
      <div className="mt-6">
        <Btn onClick={save} size="lg"><Icon name="check" size={18}/>Save Settings</Btn>
      </div>
    </div>
  );
};

// ============================================================
// PROJECTS PAGE
// ============================================================
const ProjectsPage = ({ projects, setProjects, currentUser, setCurrentProjectId }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const blank = { customerName: "", customerPhone: "", customerEmail: "", customerAddress: "", projectSize: "", projectType: "Residential", status: "Active" };
  const [form, setForm] = useState(blank);

  const myProjects = projects.filter(p => {
    const mine = currentUser.role === ROLES.DEV_ADMIN ? p.developerId === currentUser.developerId : p.developerId === currentUser.developerId && (p.userId === currentUser.id || true);
    const matchSearch = p.customerName.toLowerCase().includes(search.toLowerCase()) || p.customerAddress.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || p.projectType === filterType;
    return mine && matchSearch && matchType;
  });

  const save = () => {
    const np = { ...form, id: `p${Date.now()}`, developerId: currentUser.developerId, userId: currentUser.id, createdAt: new Date().toISOString().split("T")[0] };
    setProjects(ps => [...ps, np]);
    setShowAdd(false); setForm(blank);
  };

  const typeColors = { Residential: "bg-sky-500/20 text-sky-300", Commercial: "bg-amber-500/20 text-amber-300", Industrial: "bg-purple-500/20 text-purple-300" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Projects</h1><p className="text-slate-400">{myProjects.length} total projects</p></div>
        <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={16}/>New Project</Btn>
      </div>

      <div className="flex gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="flex-1 bg-[#0c1929] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"/>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-[#0c1929] border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 text-sm">
          {["All", "Residential", "Commercial", "Industrial"].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {myProjects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4"><Icon name="folder" size={28} className="text-slate-500"/></div>
          <h3 className="text-lg font-bold text-white mb-1">No projects yet</h3>
          <p className="text-slate-400 mb-4">Create your first solar project to get started</p>
          <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={16}/>Create Project</Btn>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {myProjects.map(p => (
            <button key={p.id} onClick={() => setCurrentProjectId(p.id)} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5 text-left hover:border-amber-500/40 hover:bg-[#0f1f38] transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                  <Icon name="zap" size={20}/>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.status)}`}>{p.status}</span>
              </div>
              <h3 className="font-bold text-white text-base mb-0.5">{p.customerName}</h3>
              <p className="text-slate-400 text-sm mb-3 truncate">{p.customerAddress}</p>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[p.projectType] || "bg-slate-700 text-slate-300"}`}>{p.projectType}</span>
                <span className="text-xs text-slate-400">{p.projectSize} kW</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/30 text-xs text-slate-500">{fmtDate(p.createdAt)}</div>
            </button>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="New Project" onClose={() => setShowAdd(false)} wide>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Customer Name" value={form.customerName} onChange={v => setForm(f => ({ ...f, customerName: v }))} required/>
            <Field label="Customer Phone" value={form.customerPhone} onChange={v => setForm(f => ({ ...f, customerPhone: v }))}/>
            <Field label="Customer Email" type="email" value={form.customerEmail} onChange={v => setForm(f => ({ ...f, customerEmail: v }))}/>
            <Field label="Project Size (kW)" type="number" value={form.projectSize} onChange={v => setForm(f => ({ ...f, projectSize: parseFloat(v) || 0 }))} required/>
            <Field label="Project Type" type="select" value={form.projectType} onChange={v => setForm(f => ({ ...f, projectType: v }))} options={["Residential", "Commercial", "Industrial"]}/>
            <Field label="Status" type="select" value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} options={["Active", "Proposal Sent", "Completed", "Cancelled"]}/>
          </div>
          <Field label="Customer Address" type="textarea" rows={2} value={form.customerAddress} onChange={v => setForm(f => ({ ...f, customerAddress: v }))}/>
          <div className="flex gap-3 mt-2">
            <Btn onClick={save} className="flex-1">Create Project</Btn>
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// PROJECT DETAIL PAGE
// ============================================================
const ProjectDetailPage = ({ project, notes, setNotes, documents, setDocuments, proposals, setProposals, templates, developer, currentUser, onBack }) => {
  const [tab, setTab] = useState("info");
  const [newNote, setNewNote] = useState("");
  const [showProposalGen, setShowProposalGen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [proposalForm, setProposalForm] = useState({});
  const [showProposalPreview, setShowProposalPreview] = useState(null);
  const fileInputRef = useRef();

  const projNotes = notes.filter(n => n.projectId === project.id);
  const projDocs = documents.filter(d => d.projectId === project.id);
  const projProposals = proposals.filter(p => p.projectId === project.id);
  const avlTemplates = templates.filter(t => t.assignedTo.includes(project.developerId));

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(ns => [...ns, { id: `n${Date.now()}`, projectId: project.id, userId: currentUser.id, content: newNote, createdAt: new Date().toISOString() }]);
    setNewNote("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const types = { pdf: "PDF", doc: "Word", docx: "Word", xls: "Excel", xlsx: "Excel", jpg: "Image", jpeg: "Image", png: "Image", mp4: "Video", mov: "Video" };
    const ext = file.name.split(".").pop().toLowerCase();
    setDocuments(ds => [...ds, { id: `doc${Date.now()}`, projectId: project.id, name: file.name, type: types[ext] || "File", size: `${(file.size / 1024).toFixed(0)} KB`, uploadDate: new Date().toISOString().split("T")[0], uploadedBy: currentUser.name }]);
  };

  // Compute solar formulas
  const calcProposalVars = (form) => {
    const size = parseFloat(form.projectSize || project.projectSize || 0);
    const ePrice = parseFloat(form.electricityPrice || developer.electricityPrice || 0.12);
    const costPerKW = parseFloat(form.costPerKW || developer.costPerKW || 2800);
    const genFactor = parseFloat(form.solarGenerationFactor || developer.solarGenerationFactor || 1400);
    const totalCost = size * costPerKW;
    const annualGeneration = size * genFactor;
    const annualSavings = annualGeneration * ePrice;
    const paybackPeriod = annualSavings > 0 ? (totalCost / annualSavings).toFixed(1) : "N/A";
    const roi25 = annualSavings > 0 ? (((annualSavings * 25 - totalCost) / totalCost) * 100).toFixed(0) : 0;
    const annualBillBefore = parseFloat(form.annualBillBefore || annualGeneration * ePrice * 1.3);
    return { totalCost, annualGeneration, annualSavings, paybackPeriod, roi25, annualBillBefore, electricityPrice: ePrice, costPerKW, solarGenerationFactor: genFactor };
  };

  const generateProposal = () => {
    const tmpl = templates.find(t => t.id === selectedTemplate);
    if (!tmpl) return;
    const vars = calcProposalVars(proposalForm);
    const fullData = {
      ...proposalForm,
      ...vars,
      company_name: developer.companyName,
      company_address: developer.address,
      company_phone: developer.phone,
      company_email: developer.email,
      customer_name: project.customerName,
      customer_address: project.customerAddress,
      customer_phone: project.customerPhone,
      customer_email: project.customerEmail,
      project_size: project.projectSize,
      template: tmpl,
    };
    const np = { id: `pr${Date.now()}`, projectId: project.id, templateId: selectedTemplate, status: "Generated", createdAt: new Date().toISOString().split("T")[0], data: fullData };
    setProposals(ps => [...ps, np]);
    setShowProposalGen(false);
    setShowProposalPreview(np);
  };

  const typeIcons = { PDF: "file", Word: "file", Excel: "chart", Image: "eye", Video: "zap", File: "file" };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{project.customerName}</h1>
          <p className="text-slate-400 text-sm">{project.customerAddress}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-sm px-3 py-1 rounded-full ${statusColor(project.status)}`}>{project.status}</span>
          <span className="text-sm px-3 py-1 rounded-full bg-slate-700 text-slate-300">{project.projectType}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[["Project Size", `${project.projectSize} kW`, "zap"], ["Total Cost", fmtCurrency((project.projectSize || 0) * developer.costPerKW), "invoice"], ["Annual Savings", fmtCurrency((project.projectSize || 0) * developer.solarGenerationFactor * developer.electricityPrice), "leaf"], ["Payback Period", `${((project.projectSize || 0) * developer.costPerKW / ((project.projectSize || 0) * developer.solarGenerationFactor * developer.electricityPrice || 1)).toFixed(1)} yrs`, "chart"]].map(([l, v, ic]) => (
          <div key={l} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-xs mb-1">{l}</div>
            <div className="text-white font-bold text-lg">{v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#070e1c] border border-slate-800 rounded-xl p-1 mb-6 w-fit">
        {["info", "notes", "documents", "proposal"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"}`}>{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Customer Information</h3>
            <div className="space-y-3">
              {[["Name", project.customerName], ["Email", project.customerEmail], ["Phone", project.customerPhone], ["Address", project.customerAddress]].map(([k, v]) => (
                <div key={k} className="flex gap-3 text-sm"><span className="text-slate-400 w-20 shrink-0">{k}:</span><span className="text-white">{v || "—"}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Project Details</h3>
            <div className="space-y-3">
              {[["Size", `${project.projectSize} kW`], ["Type", project.projectType], ["Status", project.status], ["Created", fmtDate(project.createdAt)]].map(([k, v]) => (
                <div key={k} className="flex gap-3 text-sm"><span className="text-slate-400 w-20 shrink-0">{k}:</span><span className="text-white">{v || "—"}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5 lg:col-span-2">
            <h3 className="font-bold text-white mb-4">Solar Calculations</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(() => {
                const v = calcProposalVars({});
                return [["Total System Cost", fmtCurrency(v.totalCost)], ["Annual Generation", `${v.annualGeneration.toLocaleString()} kWh`], ["Annual Savings", fmtCurrency(v.annualSavings)], ["Payback Period", `${v.paybackPeriod} years`], ["25yr ROI", `${v.roi25}%`], ["Electricity Price", `$${v.electricityPrice}/kWh`]].map(([k, val]) => (
                  <div key={k} className="bg-slate-800/50 rounded-lg p-3"><div className="text-slate-400 text-xs mb-0.5">{k}</div><div className="text-white font-bold">{val}</div></div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {tab === "notes" && (
        <div>
          <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5 mb-4">
            <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." rows={3} className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none mb-3"/>
            <Btn onClick={addNote} disabled={!newNote.trim()}><Icon name="plus" size={16}/>Add Note</Btn>
          </div>
          <div className="space-y-3">
            {projNotes.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No notes yet.</p> : projNotes.map(n => (
              <div key={n.id} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
                <p className="text-white text-sm mb-2">{n.content}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "documents" && (
        <div>
          <div className="mb-4">
            <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.mov"/>
            <Btn onClick={() => fileInputRef.current?.click()}><Icon name="upload" size={16}/>Upload Document</Btn>
          </div>
          {projDocs.length === 0 ? (
            <div className="text-center py-16 bg-[#0c1929] border border-slate-700/50 rounded-xl border-dashed">
              <Icon name="upload" size={32} className="text-slate-600 mx-auto mb-3"/>
              <p className="text-slate-400">No documents uploaded yet</p>
              <p className="text-slate-500 text-sm">Supports PDF, Word, Excel, Images, Videos</p>
            </div>
          ) : (
            <div className="space-y-2">
              {projDocs.map(doc => (
                <div key={doc.id} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400">
                    <Icon name={typeIcons[doc.type] || "file"} size={20}/>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{doc.name}</div>
                    <div className="text-xs text-slate-400">{doc.type} · {doc.size} · {fmtDate(doc.uploadDate)} · by {doc.uploadedBy}</div>
                  </div>
                  <Btn size="sm" variant="ghost" onClick={() => setDocuments(ds => ds.filter(d => d.id !== doc.id))}><Icon name="trash" size={14}/></Btn>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "proposal" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Proposals</h3>
            <Btn onClick={() => setShowProposalGen(true)}><Icon name="plus" size={16}/>Create Proposal</Btn>
          </div>
          {projProposals.length === 0 ? (
            <div className="text-center py-16 bg-[#0c1929] border border-slate-700/50 rounded-xl">
              <Icon name="file" size={32} className="text-slate-600 mx-auto mb-3"/>
              <p className="text-slate-400">No proposals yet</p>
              <Btn onClick={() => setShowProposalGen(true)} className="mt-3"><Icon name="plus" size={16}/>Create First Proposal</Btn>
            </div>
          ) : (
            <div className="space-y-3">
              {projProposals.map(pr => {
                const tmpl = templates.find(t => t.id === pr.templateId);
                return (
                  <div key={pr.id} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400"><Icon name="file" size={20}/></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{tmpl?.name || "Proposal"}</div>
                      <div className="text-xs text-slate-400">{fmtDate(pr.createdAt)}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(pr.status)}`}>{pr.status}</span>
                    <Btn size="sm" variant="outline" onClick={() => setShowProposalPreview(pr)}><Icon name="eye" size={14}/>Preview</Btn>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Proposal Generator Modal */}
      {showProposalGen && (
        <Modal title="Create Proposal" onClose={() => setShowProposalGen(false)} wide>
          <div className="mb-4">
            <Field label="Select Template" type="select" value={selectedTemplate} onChange={setSelectedTemplate}
              options={[{ value: "", label: "— Select Template —" }, ...avlTemplates.map(t => ({ value: t.id, label: t.name }))]}/>
          </div>
          {selectedTemplate && (() => {
            const vars = calcProposalVars(proposalForm);
            return (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Field label="Electricity Price ($/kWh)" type="number" value={proposalForm.electricityPrice || developer.electricityPrice} onChange={v => setProposalForm(f => ({ ...f, electricityPrice: v }))}/>
                  <Field label="Cost per kW ($)" type="number" value={proposalForm.costPerKW || developer.costPerKW} onChange={v => setProposalForm(f => ({ ...f, costPerKW: v }))}/>
                  <Field label="Solar Generation Factor" type="number" value={proposalForm.solarGenerationFactor || developer.solarGenerationFactor} onChange={v => setProposalForm(f => ({ ...f, solarGenerationFactor: v }))}/>
                  <Field label="Annual Bill Before Solar ($)" type="number" value={proposalForm.annualBillBefore || ""} placeholder={fmtCurrency(vars.annualBillBefore)} onChange={v => setProposalForm(f => ({ ...f, annualBillBefore: v }))}/>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-bold text-white mb-3">Calculated Values</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[["Total Cost", fmtCurrency(vars.totalCost)], ["Annual Generation", `${vars.annualGeneration.toLocaleString()} kWh`], ["Annual Savings", fmtCurrency(vars.annualSavings)], ["Payback Period", `${vars.paybackPeriod} years`], ["25yr ROI", `${vars.roi25}%`]].map(([k, v]) => (
                      <div key={k} className="flex justify-between"><span className="text-slate-400">{k}:</span><span className="text-amber-400 font-bold">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Btn onClick={generateProposal} className="flex-1"><Icon name="zap" size={16}/>Generate Proposal</Btn>
                  <Btn variant="secondary" onClick={() => setShowProposalGen(false)}>Cancel</Btn>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Proposal Preview Modal */}
      {showProposalPreview && (
        <Modal title="Proposal Preview" onClose={() => setShowProposalPreview(null)} wide>
          <ProposalPreview proposal={showProposalPreview} project={project} developer={developer} templates={templates}/>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// PROPOSAL PREVIEW
// ============================================================
const ProposalPreview = ({ proposal, project, developer, templates }) => {
  const d = proposal.data;
  const tmpl = templates.find(t => t.id === proposal.templateId);

  return (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-2xl font-black text-white mb-0.5" style={{fontFamily:"'Orbitron',monospace"}}>{d.company_name}</div>
            <div className="text-slate-400">{d.company_address}</div>
            <div className="text-slate-400">{d.company_phone} · {d.company_email}</div>
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-bold text-lg">SOLAR PROPOSAL</div>
            <div className="text-slate-400">Generated {fmtDate(proposal.createdAt)}</div>
            <div className="text-slate-400">{tmpl?.name}</div>
          </div>
        </div>
      </div>

      {/* Customer */}
      <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
        <h4 className="font-bold text-white mb-3">Prepared For</h4>
        <div className="grid grid-cols-2 gap-2">
          {[["Name", d.customer_name], ["Email", d.customer_email], ["Phone", d.customer_phone], ["Address", d.customer_address], ["Project Size", `${d.project_size} kW`]].map(([k, v]) => (
            <div key={k}><span className="text-slate-400">{k}: </span><span className="text-white font-medium">{v}</span></div>
          ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
        <h4 className="font-bold text-white mb-4">Financial Summary</h4>
        <div className="grid grid-cols-2 gap-4">
          {[["System Size", `${d.project_size} kW`], ["Total System Cost", fmtCurrency(d.totalCost)], ["Annual Generation", `${(d.annualGeneration || 0).toLocaleString()} kWh`], ["Annual Savings", fmtCurrency(d.annualSavings)], ["Payback Period", `${d.paybackPeriod} years`], ["25yr ROI", `${d.roi25}%`], ["Electricity Rate", `$${d.electricityPrice}/kWh`]].map(([k, v]) => (
            <div key={k} className="bg-slate-800/40 rounded-lg p-3 flex justify-between items-center">
              <span className="text-slate-400">{k}</span>
              <span className="text-amber-400 font-bold">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Table */}
      <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
        <h4 className="font-bold text-white mb-4">10-Year Savings Projection</h4>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700">
              {["Year", "Bill Before Solar", "Bill After Solar", "Annual Savings", "Cumulative Savings"].map(h => (
                <th key={h} className="text-left py-2 px-2 text-slate-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, i) => {
              const yr = i + 1;
              const before = (d.annualBillBefore || d.annualSavings * 1.3) * Math.pow(1.03, yr);
              const savings = (d.annualSavings || 0) * Math.pow(1.01, yr);
              const after = before - savings;
              const cumulative = Array.from({ length: yr }, (_, j) => (d.annualSavings || 0) * Math.pow(1.01, j + 1)).reduce((s, x) => s + x, 0);
              return (
                <tr key={yr} className="border-b border-slate-700/20 hover:bg-slate-800/20">
                  <td className="py-2 px-2 text-white">{yr}</td>
                  <td className="py-2 px-2 text-red-400">{fmtCurrency(before)}</td>
                  <td className="py-2 px-2 text-emerald-400">{fmtCurrency(Math.max(0, after))}</td>
                  <td className="py-2 px-2 text-amber-400">{fmtCurrency(savings)}</td>
                  <td className="py-2 px-2 text-sky-400">{fmtCurrency(cumulative)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
          <h4 className="font-bold text-white mb-3">ROI Payback Chart</h4>
          <PaybackChart data={{ totalCost: d.totalCost, annualSavings: d.annualSavings }}/>
          <p className="text-xs text-slate-500 mt-2 text-center">Break-even at year {d.paybackPeriod}</p>
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
          <h4 className="font-bold text-white mb-3">Bill Before vs After Solar</h4>
          <SavingsBarChart data={{ annualBillBefore: d.annualBillBefore || d.annualSavings * 1.3, annualSavings: d.annualSavings }}/>
          <p className="text-xs text-slate-500 mt-2 text-center">Projected 8-year bill comparison</p>
        </div>
      </div>

      {/* Bank & Terms */}
      {developer.bankDetails && (
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
          <h4 className="font-bold text-white mb-2">Payment Details</h4>
          <pre className="text-slate-400 text-xs whitespace-pre-wrap">{developer.bankDetails}</pre>
        </div>
      )}
      {developer.terms && (
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
          <h4 className="font-bold text-white mb-2">Terms & Conditions</h4>
          <p className="text-slate-400 text-xs">{developer.terms}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Btn className="flex-1"><Icon name="download" size={16}/>Export PDF</Btn>
        <Btn variant="secondary" className="flex-1"><Icon name="download" size={16}/>Export DOCX</Btn>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function SolarProApp() {
  const [currentUser, setCurrentUser] = useLocalStorage("solarpro_user", null);
  const [developers, setDevelopers] = useLocalStorage("solarpro_devs", initialDevelopers);
  const [users, setUsers] = useLocalStorage("solarpro_users", initialUsers);
  const [projects, setProjects] = useLocalStorage("solarpro_projects", initialProjects);
  const [notes, setNotes] = useLocalStorage("solarpro_notes", initialNotes);
  const [documents, setDocuments] = useLocalStorage("solarpro_docs", initialDocuments);
  const [templates, setTemplates] = useLocalStorage("solarpro_templates", initialTemplates);
  const [proposals, setProposals] = useLocalStorage("solarpro_proposals", initialProposals);
  const [invoices, setInvoices] = useLocalStorage("solarpro_invoices", invoicesInit);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const handleLogin = (user) => { setCurrentUser(user); setCurrentPage("dashboard"); };
  const handleLogout = () => { setCurrentUser(null); setCurrentPage("dashboard"); setCurrentProjectId(null); };

  if (!currentUser) return <LoginPage onLogin={handleLogin}/>;

  const developer = developers.find(d => d.id === currentUser.developerId);
  const currentProject = currentProjectId ? projects.find(p => p.id === currentProjectId) : null;

  const handleSetPage = (p) => { setCurrentPage(p); setCurrentProjectId(null); };

  const renderPage = () => {
    if (currentProject) {
      return (
        <ProjectDetailPage
          project={currentProject}
          notes={notes} setNotes={setNotes}
          documents={documents} setDocuments={setDocuments}
          proposals={proposals} setProposals={setProposals}
          templates={templates}
          developer={developer}
          currentUser={currentUser}
          onBack={() => setCurrentProjectId(null)}
        />
      );
    }
    switch (currentPage) {
      case "dashboard":
        return currentUser.role === ROLES.SUPER_ADMIN
          ? <SuperAdminDashboard developers={developers} users={users} projects={projects} invoices={invoices}/>
          : <DevDashboard developer={developer} projects={projects} users={users} proposals={proposals}/>;
      case "developers":
        return <DevelopersPage developers={developers} setDevelopers={setDevelopers} users={users} setUsers={setUsers} invoices={invoices} setInvoices={setInvoices}/>;
      case "templates":
        return <TemplatesPage templates={templates} setTemplates={setTemplates} developers={developers} currentUser={currentUser}/>;
      case "invoices":
        return <InvoicesPage invoices={invoices} setInvoices={setInvoices} developers={developers}/>;
      case "users":
      case "team":
        return <UsersPage users={users} setUsers={setUsers} currentUser={currentUser} developer={developer}/>;
      case "projects":
        return <ProjectsPage projects={projects} setProjects={setProjects} currentUser={currentUser} setCurrentProjectId={setCurrentProjectId}/>;
      case "settings":
        return <SettingsPage developer={developer} setDevelopers={setDevelopers}/>;
      default:
        return <div className="text-white">Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#060c18] text-white overflow-hidden" style={{fontFamily:"'Inter','system-ui',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        .font-display { font-family: 'Orbitron', monospace; }
      `}</style>

      <Sidebar user={currentUser} currentPage={currentPage} setPage={handleSetPage} onLogout={handleLogout} developer={developer}/>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
