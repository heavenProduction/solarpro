import { useState, useEffect, useRef } from "react";

// ============================================================
// CONSTANTS & MOCK DATA
// ============================================================
const ROLES = { SUPER_ADMIN: "super_admin", DEV_ADMIN: "dev_admin", USER: "user" };
const PLAN_DURATIONS = {
  "Monthly": 1,
  "Quarterly": 3,
  "Half Yearly": 6,
  "Annual": 12,
  "2 Year": 24,
};
const PLAN_PRICES = { Starter: 4999, Professional: 14999, Enterprise: 29999 };

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

const today = new Date().toISOString().split("T")[0];

const initialDevelopers = [
  { id: "d1", companyName: "SunPower Solutions", email: "ceo@sunpower.com", phone: "+91-98001-11111", address: "1234 Solar Ave, Mumbai, MH 400001", website: "https://sunpower.com", seats: 10, usedSeats: 2, active: true, paused: false, plan: "Professional", planDuration: "Annual", subscriptionStart: "2024-01-15", subscriptionEnd: "2025-01-15", logo: null, electricityPrice: 8.5, solarGenerationFactor: 1400, costPerKW: 55000, bankDetails: "Bank: HDFC\nAccount: 1234567890\nIFSC: HDFC0001234", terms: "Payment due within 30 days of installation.", paymentTerms: "50% advance, 50% on completion", customerScope: "Residential and small commercial customers across Maharashtra", companyScope: "Pan-India solar installation with focus on rooftop systems", createdAt: "2024-01-15" },
  { id: "d2", companyName: "GreenWatt Energy", email: "admin@greenwatt.com", phone: "+91-98002-22222", address: "5678 Energy Blvd, Pune, MH 411001", website: "https://greenwatt.com", seats: 5, usedSeats: 1, active: true, paused: false, plan: "Starter", planDuration: "Monthly", subscriptionStart: "2024-06-01", subscriptionEnd: "2024-07-01", logo: null, electricityPrice: 7.8, solarGenerationFactor: 1350, costPerKW: 50000, bankDetails: "Bank: SBI\nAccount: 9876543210\nIFSC: SBIN0001234", terms: "Full payment before installation.", paymentTerms: "100% advance", customerScope: "Commercial and industrial clients", companyScope: "Western Maharashtra operations", createdAt: "2024-03-01" },
];

const initialUsers = [
  { id: "u1", email: "admin@solarpro.io", password: "Admin@123", name: "Platform Admin", role: ROLES.SUPER_ADMIN, developerId: null, active: true, paused: false, permissions: [], createdAt: "2024-01-01", phone: "" },
  { id: "u2", email: "ceo@sunpower.com", password: "Sun@123", name: "James Rivera", role: ROLES.DEV_ADMIN, developerId: "d1", active: true, paused: false, permissions: [], createdAt: "2024-01-15", phone: "+91-98001-11111" },
  { id: "u3", email: "sales@sunpower.com", password: "Sales@123", name: "Mia Chen", role: ROLES.USER, developerId: "d1", active: true, paused: false, permissions: ["projects", "proposals", "notes", "documents"], createdAt: "2024-02-01", phone: "+91-98001-22222" },
  { id: "u4", email: "admin@greenwatt.com", password: "Green@123", name: "Tom Okafor", role: ROLES.DEV_ADMIN, developerId: "d2", active: true, paused: false, permissions: [], createdAt: "2024-03-01", phone: "+91-98002-22222" },
];

const initialProjects = [
  { id: "p1", developerId: "d1", userId: "u3", customerName: "Robert Kim", customerPhone: "+91-98111-00001", customerEmail: "r.kim@email.com", customerAddress: "789 Oak St, Pune, MH 411001", projectSize: 8.5, projectType: "Residential", status: "Active", createdAt: "2024-06-01" },
  { id: "p2", developerId: "d1", userId: "u2", customerName: "Apex Corp", customerPhone: "+91-98111-00002", customerEmail: "facilities@apex.com", customerAddress: "100 Business Park, Mumbai, MH 400001", projectSize: 45, projectType: "Commercial", status: "Proposal Sent", createdAt: "2024-05-20" },
  { id: "p3", developerId: "d2", userId: "u4", customerName: "Warehouse Co.", customerPhone: "+91-98111-00003", customerEmail: "ops@warehouse.com", customerAddress: "200 Industrial Way, Pune, MH 411028", projectSize: 120, projectType: "Industrial", status: "Active", createdAt: "2024-06-05" },
];

const initialNotes = [
  { id: "n1", projectId: "p1", userId: "u3", content: "Customer interested in battery backup. Discussed options.", createdAt: "2024-06-02T14:30:00Z" },
];

const initialDocuments = [
  { id: "doc1", projectId: "p1", name: "Site Survey Photos.pdf", type: "PDF", size: "2.3 MB", uploadDate: "2024-06-05", uploadedBy: "Mia Chen" },
];

const initialTemplates = [
  { id: "t1", name: "Residential Solar Proposal", description: "Standard proposal for residential installations", assignedTo: ["d1", "d2"], variables: ["company_name", "customer_name", "project_size", "total_cost", "annual_savings", "payback_period"], createdAt: "2024-01-01" },
  { id: "t2", name: "Commercial Solar Proposal", description: "Detailed proposal for commercial projects", assignedTo: ["d1"], variables: ["company_name", "customer_name", "project_size", "total_cost", "annual_savings", "payback_period", "roi"], createdAt: "2024-02-01" },
];

const initialProposals = [
  { id: "pr1", projectId: "p1", templateId: "t1", status: "Generated", createdAt: "2024-06-04", data: { company_name: "SunPower Solutions", customer_name: "Robert Kim", project_size: 8.5, totalCost: 467500, annualSavings: 85000, paybackPeriod: "5.5", roi25: "280", annualGeneration: 11900, electricityPrice: 8.5, annualBillBefore: 110500 } },
];

const initialInvoices = [
  { id: "inv1", developerId: "d1", amount: 14999, status: "Paid", date: "2024-05-01", plan: "Professional", planDuration: "Monthly" },
  { id: "inv2", developerId: "d1", amount: 14999, status: "Paid", date: "2024-04-01", plan: "Professional", planDuration: "Monthly" },
  { id: "inv3", developerId: "d2", amount: 4999, status: "Pending", date: "2024-06-01", plan: "Starter", planDuration: "Monthly" },
];

// ============================================================
// UTILITIES
// ============================================================
const useLS = (key, init) => {
  const [val, setVal] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
};

const fmtDate = (d) => { try { return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }); } catch { return d; } };
const fmtINR = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const statusColor = (s) => ({
  "Active": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  "Paused": "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  "Proposal Sent": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "Completed": "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  "Cancelled": "bg-red-500/20 text-red-300 border border-red-500/30",
  "Paid": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  "Pending": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "Generated": "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  "Draft": "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  "Inactive": "bg-red-500/20 text-red-300 border border-red-500/30",
}[s] || "bg-slate-500/20 text-slate-300");

// ============================================================
// INLINE SVG ICONS
// ============================================================
const Icon = ({ name, size = 18 }) => {
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
    invoice: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    template: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    pause: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    play: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    image: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    key: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
    leaf: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8C8 10 5.9 16.17 3.82 19.34l1.43.86C6.5 18 9 15 12 14c0 0-2 3-2 6h2s1-4 5-7c0 0-3 1-5 4 0 0 3-1 5-5 0 0-1 4 1 6 0 0 3-5 3-10 0-5-4-7-4-7z"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    print: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  };
  return <span style={{display:"inline-flex",alignItems:"center"}}>{icons[name] || <span>?</span>}</span>;
};

// ============================================================
// UI PRIMITIVES
// ============================================================
const Modal = ({ title, onClose, children, wide = false }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className={`bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl ${wide ? "w-full max-w-3xl" : "w-full max-w-lg"} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between p-5 border-b border-slate-700/60 sticky top-0 bg-[#0f172a] z-10">
        <h2 className="text-base font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"><Icon name="x" size={18}/></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const Field = ({ label, type = "text", value, onChange, placeholder, options, rows, required, hint }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}{required && <span className="text-amber-400 ml-1">*</span>}</label>}
    {hint && <p className="text-xs text-slate-500 mb-1.5">{hint}</p>}
    {type === "select" ? (
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors text-sm">
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none text-sm"/>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-sm"/>
    )}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled, className = "", type = "button" }) => {
  const v = { primary: "bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold", secondary: "bg-slate-700 hover:bg-slate-600 text-white", danger: "bg-red-600 hover:bg-red-500 text-white", ghost: "text-slate-300 hover:text-white hover:bg-slate-700/70", outline: "border border-slate-600 text-slate-300 hover:border-amber-400 hover:text-amber-400", success: "bg-emerald-600 hover:bg-emerald-500 text-white font-bold" };
  const s = { sm: "px-2.5 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-2.5 text-sm" };
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-1.5 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${v[variant]} ${s[size]} ${className}`}>{children}</button>;
};

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon name="search" size={16}/></span>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-[#0c1929] border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-colors"/>
  </div>
);

const StatCard = ({ label, value, icon, color = "amber", sub }) => (
  <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-5">
    <div className={`w-9 h-9 rounded-lg bg-${color}-500/15 flex items-center justify-center text-${color}-400 mb-3`}><Icon name={icon} size={18}/></div>
    <div className="text-xl font-bold text-white mb-0.5">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
    {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
  </div>
);

// ============================================================
// CHARTS
// ============================================================
const PaybackChart = ({ data }) => {
  const { totalCost, annualSavings, years = 25 } = data;
  const pts = Array.from({ length: years + 1 }, (_, i) => ({ y: i, val: i * annualSavings - totalCost }));
  const maxV = Math.max(...pts.map(p => p.val)), minV = Math.min(...pts.map(p => p.val));
  const range = maxV - minV || 1;
  const W = 360, H = 150, PAD = 36;
  const x = i => PAD + (i / years) * (W - PAD * 2);
  const y = v => H - PAD - ((v - minV) / range) * (H - PAD * 2);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.y)},${y(p.val)}`).join(" ");
  return (
    <svg width={W} height={H} className="w-full">
      <line x1={PAD} y1={H-PAD} x2={W-PAD} y2={H-PAD} stroke="#334155" strokeWidth="1"/>
      <line x1={PAD} y1={PAD} x2={PAD} y2={H-PAD} stroke="#334155" strokeWidth="1"/>
      {minV < 0 && maxV > 0 && <line x1={PAD} y1={y(0)} x2={W-PAD} y2={y(0)} stroke="#475569" strokeWidth="1" strokeDasharray="3,3"/>}
      {[0,5,10,15,20,25].map(yr => <text key={yr} x={x(yr)} y={H-6} textAnchor="middle" fill="#64748b" fontSize="9">{yr}y</text>)}
      <path d={`${path} L${x(years)},${H-PAD} L${x(0)},${H-PAD} Z`} fill="url(#gAmber)" opacity="0.3"/>
      <defs><linearGradient id="gAmber" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5"/><stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/></linearGradient></defs>
      <path d={path} stroke="#f59e0b" strokeWidth="2" fill="none"/>
    </svg>
  );
};

// ============================================================
// PDF PRINT HELPER
// ============================================================
const printDiv = (id, title) => {
  const el = document.getElementById(id);
  if (!el) return;
  const w = window.open("", "_blank");
  w.document.write(`<html><head><title>${title}</title><style>body{font-family:sans-serif;padding:24px;color:#111;background:#fff}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f3f4f6}h1,h2,h3{margin:0 0 8px}@media print{body{padding:0}}</style></head><body>${el.innerHTML}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); w.close(); }, 500);
};

// ============================================================
// LOGIN PAGE
// ============================================================
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users] = useLS("sp_users", initialUsers);

  const handle = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 500));
    const user = users.find(u => u.email === email && u.password === password && u.active && !u.paused);
    if (user) onLogin(user);
    else setError("Invalid credentials, or account is inactive/paused.");
    setLoading(false);
  };

  const demos = [["Super Admin","admin@solarpro.io","Admin@123"],["Dev Admin","ceo@sunpower.com","Sun@123"],["User","sales@sunpower.com","Sales@123"]];

  return (
    <div className="min-h-screen bg-[#060c18] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[5%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl"/>
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl"/>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]"><defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f59e0b" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"><Icon name="sun" size={22}/></div>
            <div className="text-2xl font-black text-white tracking-tight" style={{fontFamily:"'Orbitron',monospace"}}>SOLAR<span className="text-amber-400">PRO</span></div>
          </div>
          <p className="text-slate-400 text-sm">Solar CRM & Proposal Platform</p>
        </div>
        <div className="bg-[#0c1929]/90 backdrop-blur border border-slate-700/50 rounded-2xl p-7 shadow-2xl">
          <h1 className="text-lg font-bold text-white mb-5">Sign in to your account</h1>
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm"><Icon name="alert" size={15}/>{error}</div>}
          <form onSubmit={handle}>
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" required/>
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required/>
            <button type="submit" disabled={loading} className="w-full mt-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"/><span>Signing in...</span></> : <><Icon name="zap" size={16}/>Sign In</>}
            </button>
          </form>
          <div className="mt-5 pt-5 border-t border-slate-700/40">
            <p className="text-xs text-slate-500 mb-2 font-semibold">DEMO ACCOUNTS</p>
            {demos.map(([role, e, p]) => (
              <button key={e} onClick={() => { setEmail(e); setPassword(p); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-700/40 transition-colors">
                <span className="text-xs text-amber-400 font-bold">{role}: </span><span className="text-xs text-slate-400">{e}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SIDEBAR
// ============================================================
const Sidebar = ({ user, currentPage, setPage, onLogout, developer }) => {
  const superNav = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "developers", label: "Developers", icon: "building" },
    { id: "templates", label: "Templates", icon: "template" },
    { id: "invoices", label: "Invoices", icon: "invoice" },
    { id: "users", label: "All Users", icon: "users" },
  ];
  const devNav = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "projects", label: "Projects", icon: "folder" },
    { id: "team", label: "My Team", icon: "users" },
    { id: "templates", label: "Templates", icon: "template" },
    { id: "settings", label: "Account Settings", icon: "settings" },
  ];
  const userNav = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "projects", label: "Projects", icon: "folder" },
  ];
  const nav = user.role === ROLES.SUPER_ADMIN ? superNav : user.role === ROLES.DEV_ADMIN ? devNav : userNav;

  return (
    <div className="w-56 bg-[#070e1c] border-r border-slate-800 flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          {developer?.logo
            ? <img src={developer.logo} alt="logo" className="w-8 h-8 rounded-lg object-cover"/>
            : <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20"><Icon name="sun" size={16}/></div>
          }
          <div>
            <div className="text-sm font-black text-white" style={{fontFamily:"'Orbitron',monospace"}}>SOLAR<span className="text-amber-400">PRO</span></div>
            <div className="text-[10px] text-slate-500 truncate max-w-[110px]">{user.role === ROLES.SUPER_ADMIN ? "Platform Admin" : developer?.companyName || "Dashboard"}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {nav.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === item.id ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}>
            <Icon name={item.icon} size={16}/>{item.label}
          </button>
        ))}
      </nav>
      <div className="p-2 border-t border-slate-800">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{user.name.charAt(0)}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">{user.name}</div>
            <div className="text-[10px] text-slate-500 capitalize">{user.role.replace("_"," ")}</div>
          </div>
          <button onClick={onLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="Logout"><Icon name="logout" size={15}/></button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DASHBOARDS
// ============================================================
const SuperAdminDashboard = ({ developers, users, projects, invoices }) => {
  const revenue = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Platform Overview</h1>
      <p className="text-slate-400 text-sm mb-5">Manage all developer accounts and platform settings</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active Developers" value={developers.filter(d => d.active && !d.paused).length} icon="building" color="amber"/>
        <StatCard label="Total Users" value={users.filter(u => u.role !== ROLES.SUPER_ADMIN).length} icon="users" color="sky"/>
        <StatCard label="Total Projects" value={projects.length} icon="folder" color="emerald"/>
        <StatCard label="Platform Revenue" value={fmtINR(revenue)} icon="invoice" color="purple"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Developers</h3>
          {developers.map(d => (
            <div key={d.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
              <div>
                <div className="text-sm font-medium text-white">{d.companyName}</div>
                <div className="text-xs text-slate-400">{d.plan} · {d.usedSeats}/{d.seats} seats</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(d.paused ? "Paused" : d.active ? "Active" : "Inactive")}`}>{d.paused ? "Paused" : d.active ? "Active" : "Inactive"}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Recent Invoices</h3>
          {invoices.slice(0,5).map(inv => {
            const dev = developers.find(d => d.id === inv.developerId);
            return (
              <div key={inv.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                <div><div className="text-sm font-medium text-white">{dev?.companyName}</div><div className="text-xs text-slate-400">{fmtDate(inv.date)}</div></div>
                <div className="text-right"><div className="text-sm font-bold text-white">{fmtINR(inv.amount)}</div><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(inv.status)}`}>{inv.status}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DevDashboard = ({ developer, projects, users }) => {
  const devProjects = projects.filter(p => p.developerId === developer.id);
  const devUsers = users.filter(u => u.developerId === developer.id);
  const isExpired = developer.subscriptionEnd && new Date(developer.subscriptionEnd) < new Date();
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white">{developer.companyName}</h1>
          <p className="text-slate-400 text-sm">Solar Management Dashboard</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${isExpired ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
          <Icon name="calendar" size={14}/>{developer.plan} · {isExpired ? "Expired" : `Until ${fmtDate(developer.subscriptionEnd)}`}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Projects" value={devProjects.length} icon="folder" color="amber"/>
        <StatCard label="Active Projects" value={devProjects.filter(p => p.status === "Active").length} icon="zap" color="emerald"/>
        <StatCard label="Team Members" value={devUsers.length} icon="users" color="sky"/>
        <StatCard label="Seats Used" value={`${developer.usedSeats}/${developer.seats}`} icon="key" color="purple"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Recent Projects</h3>
          {devProjects.length === 0 ? <p className="text-slate-400 text-sm">No projects yet.</p> : devProjects.slice(0,5).map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
              <div><div className="text-sm font-medium text-white">{p.customerName}</div><div className="text-xs text-slate-400">{p.projectSize} kW · {p.projectType}</div></div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.status)}`}>{p.status}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Key Variables</h3>
          <div className="space-y-2">
            {[["Electricity Rate", `${fmtINR(developer.electricityPrice)}/kWh`],["Solar Gen Factor",`${developer.solarGenerationFactor} kWh/kWp`],["Cost/kW",fmtINR(developer.costPerKW)]].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm"><span className="text-slate-400">{k}</span><span className="text-white font-medium">{v}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LOGO UPLOADER COMPONENT
// ============================================================
const LogoUploader = ({ value, onChange }) => {
  const ref = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-300 mb-1.5">Company Logo <span className="text-amber-400">*</span></label>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="logo" className="w-16 h-16 rounded-xl object-cover border border-slate-600"/>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-slate-800 border border-dashed border-slate-600 flex items-center justify-center text-slate-500"><Icon name="image" size={24}/></div>
        )}
        <div>
          <input ref={ref} type="file" accept="image/*" onChange={handleFile} className="hidden"/>
          <Btn size="sm" variant="outline" onClick={() => ref.current?.click()}><Icon name="upload" size={14}/>Upload Logo</Btn>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 2MB</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TEMPLATE ASSIGNMENT DROPDOWN (checkbox style)
// ============================================================
const TemplateAssignDropdown = ({ developers, assignedTo, onChange }) => {
  const [open, setOpen] = useState(false);
  const toggle = (id) => onChange(assignedTo.includes(id) ? assignedTo.filter(x => x !== id) : [...assignedTo, id]);
  const names = developers.filter(d => assignedTo.includes(d.id)).map(d => d.companyName);
  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium text-slate-300 mb-1.5">Assign to Developer Accounts</label>
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-left text-sm text-white flex items-center justify-between focus:outline-none focus:border-amber-400">
        <span className={names.length ? "text-white" : "text-slate-500"}>{names.length ? names.join(", ") : "Select accounts..."}</span>
        <span className="text-slate-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden">
          {developers.map(d => (
            <label key={d.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 cursor-pointer transition-colors">
              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${assignedTo.includes(d.id) ? "bg-amber-500 border-amber-500" : "border-slate-500"}`}>
                {assignedTo.includes(d.id) && <Icon name="check" size={11}/>}
              </div>
              <input type="checkbox" checked={assignedTo.includes(d.id)} onChange={() => toggle(d.id)} className="hidden"/>
              <div>
                <div className="text-sm text-white font-medium">{d.companyName}</div>
                <div className="text-xs text-slate-400">{d.email}</div>
              </div>
            </label>
          ))}
          {developers.length === 0 && <div className="px-4 py-3 text-sm text-slate-400">No developers found.</div>}
        </div>
      )}
    </div>
  );
};

// ============================================================
// DEVELOPERS PAGE (Super Admin)
// ============================================================
const DevelopersPage = ({ developers, setDevelopers, users, setUsers, invoices, setInvoices }) => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editDev, setEditDev] = useState(null);
  const [viewDev, setViewDev] = useState(null);

  const blank = { companyName:"", email:"", phone:"", address:"", website:"", seats:5, plan:"Starter", planDuration:"Monthly", subscriptionStart: today, subscriptionEnd: addMonths(today, 1), logo:null, electricityPrice:8.5, solarGenerationFactor:1350, costPerKW:50000, bankDetails:"", terms:"", paymentTerms:"", customerScope:"", companyScope:"", adminName:"", adminPassword:"" };
  const [form, setForm] = useState(blank);
  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // auto-calc end date when start/duration changes
  const updateEnd = (start, dur) => {
    const months = PLAN_DURATIONS[dur] || 1;
    F("subscriptionEnd", addMonths(start || form.subscriptionStart, months));
  };

  const filtered = developers.filter(d => d.companyName.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    if (editDev) {
      setDevelopers(ds => ds.map(d => d.id === editDev.id ? { ...d, ...form } : d));
    } else {
      const newId = `d${Date.now()}`;
      setDevelopers(ds => [...ds, { ...form, id: newId, active: true, paused: false, usedSeats: 0, createdAt: today }]);
      // Create admin user for the new developer
      if (form.adminName && form.email && form.adminPassword) {
        setUsers(us => [...us, { id: `u${Date.now()}`, email: form.email, password: form.adminPassword, name: form.adminName, role: ROLES.DEV_ADMIN, developerId: newId, active: true, paused: false, permissions: [], createdAt: today, phone: form.phone }]);
      }
    }
    setShowForm(false); setEditDev(null); setForm(blank);
  };

  const openEdit = (dev) => { setForm({ ...dev, adminName:"", adminPassword:"" }); setEditDev(dev); setShowForm(true); };

  const genInvoice = (dev) => {
    const inv = { id: `inv${Date.now()}`, developerId: dev.id, amount: PLAN_PRICES[dev.plan] || 4999, status: "Pending", date: today, plan: dev.plan, planDuration: dev.planDuration };
    setInvoices(is => [...is, inv]);
  };

  const togglePause = (dev) => setDevelopers(ds => ds.map(d => d.id === dev.id ? { ...d, paused: !d.paused } : d));
  const toggleActive = (dev) => setDevelopers(ds => ds.map(d => d.id === dev.id ? { ...d, active: !d.active } : d));

  const devUsers = (devId) => users.filter(u => u.developerId === devId && u.role !== ROLES.SUPER_ADMIN);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="text-xl font-bold text-white">Developer Accounts</h1><p className="text-slate-400 text-sm">Manage solar company accounts</p></div>
        <Btn onClick={() => { setForm(blank); setEditDev(null); setShowForm(true); }}><Icon name="plus" size={15}/>New Developer</Btn>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by company name or email..."/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(dev => (
          <div key={dev.id} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {dev.logo ? <img src={dev.logo} alt="logo" className="w-10 h-10 rounded-lg object-cover border border-slate-600"/> : <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-base font-bold text-white">{dev.companyName.charAt(0)}</div>}
                <div>
                  <h3 className="font-bold text-white">{dev.companyName}</h3>
                  <p className="text-slate-400 text-xs">{dev.email}</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(dev.paused ? "Paused" : dev.active ? "Active" : "Inactive")}`}>{dev.paused ? "Paused" : dev.active ? "Active" : "Inactive"}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{dev.plan}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="bg-slate-800/40 rounded-lg p-2"><span className="text-slate-500">Seats:</span> <span className="text-white ml-1">{dev.usedSeats}/{dev.seats}</span></div>
              <div className="bg-slate-800/40 rounded-lg p-2"><span className="text-slate-500">Duration:</span> <span className="text-white ml-1">{dev.planDuration}</span></div>
              <div className="bg-slate-800/40 rounded-lg p-2"><span className="text-slate-500">Start:</span> <span className="text-white ml-1">{fmtDate(dev.subscriptionStart)}</span></div>
              <div className="bg-slate-800/40 rounded-lg p-2"><span className="text-slate-500">End:</span> <span className="text-white ml-1">{fmtDate(dev.subscriptionEnd)}</span></div>
              <div className="bg-slate-800/40 rounded-lg p-2 col-span-2"><span className="text-slate-500">Team:</span> <span className="text-white ml-1">{devUsers(dev.id).length} users</span></div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Btn size="sm" variant="ghost" onClick={() => openEdit(dev)}><Icon name="edit" size={13}/>Edit</Btn>
              <Btn size="sm" variant="ghost" onClick={() => setViewDev(dev)}><Icon name="eye" size={13}/>View</Btn>
              <Btn size="sm" variant="ghost" onClick={() => togglePause(dev)}>{dev.paused ? <><Icon name="play" size={13}/>Resume</> : <><Icon name="pause" size={13}/>Pause</>}</Btn>
              <Btn size="sm" variant="ghost" onClick={() => toggleActive(dev)}>{dev.active ? "Deactivate" : "Activate"}</Btn>
              <Btn size="sm" variant="ghost" onClick={() => genInvoice(dev)}><Icon name="invoice" size={13}/>Invoice</Btn>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal title={editDev ? `Edit: ${editDev.companyName}` : "New Developer Account"} onClose={() => { setShowForm(false); setEditDev(null); }} wide>
          <div className="space-y-1">
            <LogoUploader value={form.logo} onChange={v => F("logo", v)}/>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Company Name" value={form.companyName} onChange={v => F("companyName", v)} required/>
              <Field label="Email" type="email" value={form.email} onChange={v => F("email", v)} required/>
              <Field label="Phone" value={form.phone} onChange={v => F("phone", v)}/>
              <Field label="Website" value={form.website} onChange={v => F("website", v)}/>
              <Field label="Plan" type="select" value={form.plan} onChange={v => F("plan", v)} options={Object.keys(PLAN_PRICES).map(p => ({ value: p, label: `${p} — ${fmtINR(PLAN_PRICES[p])}/mo` }))}/>
              <Field label="User Seats" type="number" value={form.seats} onChange={v => F("seats", parseInt(v)||0)}/>
              <Field label="Plan Duration" type="select" value={form.planDuration} onChange={v => { F("planDuration", v); updateEnd(form.subscriptionStart, v); }} options={Object.keys(PLAN_DURATIONS)}/>
              <Field label="Subscription Start" type="date" value={form.subscriptionStart} onChange={v => { F("subscriptionStart", v); updateEnd(v, form.planDuration); }}/>
              <Field label="Subscription End (auto)" type="date" value={form.subscriptionEnd} onChange={v => F("subscriptionEnd", v)} hint="Auto-calculated but can be overridden"/>
              <Field label="Electricity Price (₹/kWh)" type="number" value={form.electricityPrice} onChange={v => F("electricityPrice", parseFloat(v)||0)}/>
              <Field label="Solar Gen Factor (kWh/kWp/yr)" type="number" value={form.solarGenerationFactor} onChange={v => F("solarGenerationFactor", parseInt(v)||0)}/>
              <Field label="Cost per kW (₹)" type="number" value={form.costPerKW} onChange={v => F("costPerKW", parseInt(v)||0)}/>
            </div>
            <Field label="Address" type="textarea" rows={2} value={form.address} onChange={v => F("address", v)}/>
            <Field label="Payment Terms" value={form.paymentTerms} onChange={v => F("paymentTerms", v)} placeholder="e.g. 50% advance, 50% on completion"/>
            <Field label="Customer Scope" type="textarea" rows={2} value={form.customerScope} onChange={v => F("customerScope", v)} placeholder="Describe the type of customers this company serves"/>
            <Field label="Company Scope" type="textarea" rows={2} value={form.companyScope} onChange={v => F("companyScope", v)} placeholder="Describe the company's service area and offerings"/>
            <Field label="Bank Details" type="textarea" rows={3} value={form.bankDetails} onChange={v => F("bankDetails", v)}/>
            <Field label="Terms & Conditions" type="textarea" rows={2} value={form.terms} onChange={v => F("terms", v)}/>
            {!editDev && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-2">
                <p className="text-amber-400 text-sm font-bold mb-3"><Icon name="key" size={14}/> Admin Account Credentials</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Admin Full Name" value={form.adminName} onChange={v => F("adminName", v)} required/>
                  <Field label="Admin Password" type="password" value={form.adminPassword} onChange={v => F("adminPassword", v)} required hint="Must be set manually"/>
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Btn onClick={save} className="flex-1">Save Developer</Btn>
              <Btn variant="secondary" onClick={() => { setShowForm(false); setEditDev(null); }}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {viewDev && (
        <Modal title={viewDev.companyName} onClose={() => setViewDev(null)} wide>
          <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-700">
            {viewDev.logo ? <img src={viewDev.logo} alt="logo" className="w-16 h-16 rounded-xl object-cover"/> : <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center text-2xl font-bold text-white">{viewDev.companyName.charAt(0)}</div>}
            <div><h2 className="text-lg font-bold text-white">{viewDev.companyName}</h2><p className="text-slate-400 text-sm">{viewDev.email} · {viewDev.phone}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            {[["Plan", viewDev.plan],["Duration", viewDev.planDuration],["Seats", `${viewDev.usedSeats}/${viewDev.seats}`],["Subscription Start", fmtDate(viewDev.subscriptionStart)],["Subscription End", fmtDate(viewDev.subscriptionEnd)],["Electricity Price", `₹${viewDev.electricityPrice}/kWh`],["Cost/kW", fmtINR(viewDev.costPerKW)],["Solar Gen", `${viewDev.solarGenerationFactor} kWh/kWp`]].map(([k,v]) => (
              <div key={k} className="bg-slate-800/50 rounded-lg p-3"><div className="text-slate-400 text-xs mb-0.5">{k}</div><div className="text-white font-medium">{v||"—"}</div></div>
            ))}
          </div>
          {viewDev.paymentTerms && <div className="bg-slate-800/50 rounded-lg p-3 mb-3"><div className="text-slate-400 text-xs mb-1">Payment Terms</div><div className="text-white text-sm">{viewDev.paymentTerms}</div></div>}
          {viewDev.customerScope && <div className="bg-slate-800/50 rounded-lg p-3 mb-3"><div className="text-slate-400 text-xs mb-1">Customer Scope</div><div className="text-white text-sm">{viewDev.customerScope}</div></div>}
          {viewDev.companyScope && <div className="bg-slate-800/50 rounded-lg p-3 mb-3"><div className="text-slate-400 text-xs mb-1">Company Scope</div><div className="text-white text-sm">{viewDev.companyScope}</div></div>}
          {viewDev.bankDetails && <div className="bg-slate-800/50 rounded-lg p-3 mb-3"><div className="text-slate-400 text-xs mb-1">Bank Details</div><pre className="text-white text-xs whitespace-pre-wrap">{viewDev.bankDetails}</pre></div>}

          {/* Team members table */}
          <TeamDetailTable devId={viewDev.id}/>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// TEAM DETAIL TABLE (used in developer view)
// ============================================================
const TeamDetailTable = ({ devId }) => {
  const [users] = useLS("sp_users", initialUsers);
  const [projects] = useLS("sp_projects", initialProjects);
  const [proposals] = useLS("sp_proposals", initialProposals);

  const devUsers = users.filter(u => u.developerId === devId && u.role !== ROLES.SUPER_ADMIN);

  if (devUsers.length === 0) return <p className="text-slate-400 text-sm mt-4">No team members found.</p>;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-bold text-white mb-3">Team Members ({devUsers.length})</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/40">
              {["Name","Phone","Role","Created","Projects","Proposals","Status"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-slate-400 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {devUsers.map(u => {
              const userProjects = projects.filter(p => p.userId === u.id);
              const userProposals = proposals.filter(pr => userProjects.some(p => p.id === pr.projectId));
              return (
                <tr key={u.id} className="border-b border-slate-700/20 hover:bg-slate-800/20">
                  <td className="px-3 py-2 text-white font-medium">{u.name}</td>
                  <td className="px-3 py-2 text-slate-400">{u.phone || "—"}</td>
                  <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 capitalize">{u.role.replace("_"," ")}</span></td>
                  <td className="px-3 py-2 text-slate-400">{fmtDate(u.createdAt)}</td>
                  <td className="px-3 py-2 text-center text-amber-400 font-bold">{userProjects.length}</td>
                  <td className="px-3 py-2 text-center text-sky-400 font-bold">{userProposals.length}</td>
                  <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(u.paused ? "Paused" : u.active ? "Active" : "Inactive")}`}>{u.paused ? "Paused" : u.active ? "Active" : "Inactive"}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// INVOICES PAGE
// ============================================================
const InvoicesPage = ({ invoices, setInvoices, developers }) => {
  const [viewInv, setViewInv] = useState(null);
  const dev = viewInv ? developers.find(d => d.id === viewInv.developerId) : null;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Invoices</h1>
      <p className="text-slate-400 text-sm mb-5">Platform subscription invoices</p>
      <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/30">
              {["Invoice","Developer","Plan","Duration","Amount","Date","Status","Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => {
              const d = developers.find(x => x.id === inv.developerId);
              return (
                <tr key={inv.id} className="border-b border-slate-700/30 hover:bg-slate-800/20">
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{inv.id.toUpperCase()}</td>
                  <td className="px-4 py-3 text-white font-medium">{d?.companyName || "—"}</td>
                  <td className="px-4 py-3 text-slate-300">{inv.plan}</td>
                  <td className="px-4 py-3 text-slate-300">{inv.planDuration || "Monthly"}</td>
                  <td className="px-4 py-3 text-white font-bold">{fmtINR(inv.amount)}</td>
                  <td className="px-4 py-3 text-slate-400">{fmtDate(inv.date)}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(inv.status)}`}>{inv.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Btn size="sm" variant="ghost" onClick={() => setViewInv(inv)}><Icon name="eye" size={13}/>View</Btn>
                      {inv.status === "Pending" && <Btn size="sm" variant="ghost" onClick={() => setInvoices(is => is.map(i => i.id === inv.id ? { ...i, status: "Paid" } : i))}><Icon name="check" size={13}/>Mark Paid</Btn>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {viewInv && dev && (
        <Modal title="Invoice Details" onClose={() => setViewInv(null)}>
          <div id="invoice-print-area" className="space-y-4">
            <div className="flex items-start justify-between pb-4 border-b border-slate-700">
              <div>
                {dev.logo && <img src={dev.logo} alt="logo" className="h-10 mb-2 rounded"/>}
                <div className="font-bold text-white text-lg">{dev.companyName}</div>
                <div className="text-slate-400 text-xs">{dev.address}</div>
                <div className="text-slate-400 text-xs">{dev.phone} · {dev.email}</div>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-black text-xl">INVOICE</div>
                <div className="text-slate-400 text-xs mt-1">#{viewInv.id.toUpperCase()}</div>
                <div className="text-slate-400 text-xs">{fmtDate(viewInv.date)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Plan", viewInv.plan],["Duration", viewInv.planDuration||"Monthly"],["Status", viewInv.status],["Invoice Date", fmtDate(viewInv.date)]].map(([k,v]) => (
                <div key={k} className="bg-slate-800/50 rounded-lg p-3"><div className="text-slate-400 text-xs">{k}</div><div className="text-white font-medium">{v}</div></div>
              ))}
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div><div className="text-white font-bold">{viewInv.plan} Plan — {viewInv.planDuration}</div><div className="text-slate-400 text-xs">SolarPro Platform Subscription</div></div>
                <div className="text-2xl font-black text-amber-400">{fmtINR(viewInv.amount)}</div>
              </div>
            </div>
            {dev.bankDetails && <div className="bg-slate-800/50 rounded-lg p-3"><div className="text-slate-400 text-xs mb-1">Payment Details</div><pre className="text-white text-xs whitespace-pre-wrap">{dev.bankDetails}</pre></div>}
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
            <Btn className="flex-1" onClick={() => printDiv("invoice-print-area", `Invoice-${viewInv.id}`)}><Icon name="print" size={15}/>Download / Print PDF</Btn>
            <Btn variant="secondary" onClick={() => setViewInv(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// USERS PAGE
// ============================================================
const UsersPage = ({ users, setUsers, currentUser }) => {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", password:"", phone:"", role: ROLES.USER, permissions:[] });
  const F = (k,v) => setForm(f=>({...f,[k]:v}));
  const perms = ["projects","proposals","notes","documents","settings"];

  const myUsers = currentUser.role === ROLES.SUPER_ADMIN
    ? users.filter(u => u.role !== ROLES.SUPER_ADMIN)
    : users.filter(u => u.developerId === currentUser.developerId && u.id !== currentUser.id);

  const filtered = myUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    setUsers(us => [...us, { ...form, id:`u${Date.now()}`, active:true, paused:false, developerId: currentUser.role === ROLES.SUPER_ADMIN ? null : currentUser.developerId, createdAt: today }]);
    setShowAdd(false); setForm({ name:"",email:"",password:"",phone:"",role:ROLES.USER,permissions:[] });
  };

  const togglePause = (u) => setUsers(us => us.map(x => x.id === u.id ? { ...x, paused: !x.paused } : x));
  const toggleActive = (u) => setUsers(us => us.map(x => x.id === u.id ? { ...x, active: !x.active } : x));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">{currentUser.role === ROLES.SUPER_ADMIN ? "All Users" : "Team Members"}</h1>
        {currentUser.role === ROLES.DEV_ADMIN && <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={15}/>Add User</Btn>}
      </div>
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..."/></div>
      <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/30">
              {["Name","Email","Phone","Role","Permissions","Status","Actions"].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-slate-700/30 hover:bg-slate-800/20">
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white">{u.name.charAt(0)}</div><span className="text-white font-medium">{u.name}</span></div></td>
                <td className="px-4 py-3 text-slate-400 text-xs">{u.email}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{u.phone||"—"}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 capitalize">{u.role.replace("_"," ")}</span></td>
                <td className="px-4 py-3 text-slate-400 text-xs max-w-[120px] truncate">{u.permissions.length ? u.permissions.join(", ") : "all"}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(u.paused?"Paused":u.active?"Active":"Inactive")}`}>{u.paused?"Paused":u.active?"Active":"Inactive"}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Btn size="sm" variant="ghost" onClick={() => togglePause(u)}>{u.paused?<Icon name="play" size={12}/>:<Icon name="pause" size={12}/>}</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => toggleActive(u)}>{u.active?"Deactivate":"Activate"}</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Add Team Member" onClose={() => setShowAdd(false)}>
          <Field label="Full Name" value={form.name} onChange={v=>F("name",v)} required/>
          <Field label="Email" type="email" value={form.email} onChange={v=>F("email",v)} required/>
          <Field label="Phone" value={form.phone} onChange={v=>F("phone",v)}/>
          <Field label="Password" type="password" value={form.password} onChange={v=>F("password",v)} required hint="Set a strong password manually"/>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Permissions</label>
            <div className="flex flex-wrap gap-2">
              {perms.map(p => (
                <button key={p} type="button" onClick={() => F("permissions", form.permissions.includes(p) ? form.permissions.filter(x=>x!==p) : [...form.permissions,p])} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${form.permissions.includes(p)?"bg-amber-500/20 text-amber-400 border-amber-500/30":"bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-500"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Btn onClick={save} className="flex-1" disabled={!form.name||!form.email||!form.password}>Add User</Btn>
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
  const [form, setForm] = useState({ name:"", description:"", assignedTo:[], variables:[] });
  const myTemplates = currentUser.role === ROLES.SUPER_ADMIN ? templates : templates.filter(t => t.assignedTo.includes(currentUser.developerId));

  const save = () => {
    setTemplates(ts => [...ts, { ...form, id:`t${Date.now()}`, createdAt: today }]);
    setShowAdd(false); setForm({ name:"", description:"", assignedTo:[], variables:[] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-white">Proposal Templates</h1>
        {currentUser.role === ROLES.SUPER_ADMIN && <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={15}/>New Template</Btn>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {myTemplates.map(t => {
          const assignedDevs = developers.filter(d => t.assignedTo.includes(d.id));
          return (
            <div key={t.id} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0"><Icon name="template" size={18}/></div>
                <div><h3 className="font-bold text-white">{t.name}</h3><p className="text-slate-400 text-xs">{t.description}</p></div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {t.variables.map(v => <span key={v} className="text-xs px-1.5 py-0.5 bg-slate-700/50 text-slate-400 rounded font-mono">{"{{"+v+"}}"}</span>)}
              </div>
              <div className="text-xs text-slate-500">
                Assigned to: {assignedDevs.length ? assignedDevs.map(d => d.companyName).join(", ") : "None"}
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <Modal title="New Proposal Template" onClose={() => setShowAdd(false)} wide>
          <Field label="Template Name" value={form.name} onChange={v => setForm(f=>({...f,name:v}))} required/>
          <Field label="Description" type="textarea" rows={2} value={form.description} onChange={v => setForm(f=>({...f,description:v}))}/>
          <TemplateAssignDropdown developers={developers} assignedTo={form.assignedTo} onChange={v => setForm(f=>({...f,assignedTo:v}))}/>
          <div className="flex gap-3 mt-2">
            <Btn onClick={save} className="flex-1" disabled={!form.name}>Create Template</Btn>
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// SETTINGS PAGE
// ============================================================
const SettingsPage = ({ developer, setDevelopers }) => {
  const [form, setForm] = useState({ ...developer });
  const F = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = () => setDevelopers(ds => ds.map(d => d.id === developer.id ? { ...d, ...form } : d));

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Account Settings</h1>
      <p className="text-slate-400 text-sm mb-5">Manage your company profile and solar variables</p>
      <LogoUploader value={form.logo} onChange={v => F("logo", v)}/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Company Profile</h3>
          <Field label="Company Name" value={form.companyName} onChange={v=>F("companyName",v)}/>
          <Field label="Email" type="email" value={form.email} onChange={v=>F("email",v)}/>
          <Field label="Phone" value={form.phone} onChange={v=>F("phone",v)}/>
          <Field label="Website" value={form.website} onChange={v=>F("website",v)}/>
          <Field label="Address" type="textarea" rows={2} value={form.address} onChange={v=>F("address",v)}/>
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Solar Variables</h3>
          <Field label="Electricity Price (₹/kWh)" type="number" value={form.electricityPrice} onChange={v=>F("electricityPrice",parseFloat(v)||0)}/>
          <Field label="Solar Gen Factor (kWh/kWp/yr)" type="number" value={form.solarGenerationFactor} onChange={v=>F("solarGenerationFactor",parseInt(v)||0)}/>
          <Field label="Cost per kW (₹)" type="number" value={form.costPerKW} onChange={v=>F("costPerKW",parseInt(v)||0)}/>
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Business Details</h3>
          <Field label="Payment Terms" value={form.paymentTerms} onChange={v=>F("paymentTerms",v)}/>
          <Field label="Customer Scope" type="textarea" rows={2} value={form.customerScope} onChange={v=>F("customerScope",v)}/>
          <Field label="Company Scope" type="textarea" rows={2} value={form.companyScope} onChange={v=>F("companyScope",v)}/>
        </div>
        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Finance & Legal</h3>
          <Field label="Bank Details" type="textarea" rows={3} value={form.bankDetails} onChange={v=>F("bankDetails",v)}/>
          <Field label="Terms & Conditions" type="textarea" rows={3} value={form.terms} onChange={v=>F("terms",v)}/>
        </div>
      </div>
      <div className="mt-4"><Btn onClick={save} size="lg"><Icon name="check" size={16}/>Save All Settings</Btn></div>
    </div>
  );
};

// ============================================================
// PROJECTS PAGE
// ============================================================
const ProjectsPage = ({ projects, setProjects, currentUser, setCurrentProjectId }) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const blank = { customerName:"",customerPhone:"",customerEmail:"",customerAddress:"",projectSize:"",projectType:"Residential",status:"Active" };
  const [form, setForm] = useState(blank);

  const myProjects = projects.filter(p => {
    const mine = p.developerId === currentUser.developerId;
    const matchS = p.customerName.toLowerCase().includes(search.toLowerCase()) || p.customerAddress.toLowerCase().includes(search.toLowerCase());
    const matchT = filterType === "All" || p.projectType === filterType;
    return mine && matchS && matchT;
  });

  const save = () => {
    setProjects(ps => [...ps, { ...form, id:`p${Date.now()}`, developerId: currentUser.developerId, userId: currentUser.id, createdAt: today }]);
    setShowAdd(false); setForm(blank);
  };

  const typeColor = { Residential:"bg-sky-500/20 text-sky-300", Commercial:"bg-amber-500/20 text-amber-300", Industrial:"bg-purple-500/20 text-purple-300" };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div><h1 className="text-xl font-bold text-white">Projects</h1><p className="text-slate-400 text-sm">{myProjects.length} projects</p></div>
        <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={15}/>New Project</Btn>
      </div>
      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search by customer or address..."/></div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-[#0c1929] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 text-sm">
          {["All","Residential","Commercial","Industrial"].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {myProjects.length === 0 ? (
        <div className="text-center py-20 bg-[#0c1929] border border-slate-700/50 rounded-xl">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3"><Icon name="folder" size={24}/></div>
          <h3 className="text-base font-bold text-white mb-1">No projects yet</h3>
          <p className="text-slate-400 text-sm mb-4">Create your first solar project</p>
          <Btn onClick={() => setShowAdd(true)}><Icon name="plus" size={15}/>Create Project</Btn>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {myProjects.map(p => (
            <button key={p.id} onClick={() => setCurrentProjectId(p.id)} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 text-left hover:border-amber-500/40 hover:bg-[#0f1f38] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors"><Icon name="zap" size={18}/></div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.status)}`}>{p.status}</span>
              </div>
              <h3 className="font-bold text-white mb-0.5">{p.customerName}</h3>
              <p className="text-slate-400 text-xs mb-2 truncate">{p.customerAddress}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[p.projectType]||"bg-slate-700 text-slate-300"}`}>{p.projectType}</span>
                <span className="text-xs text-slate-400">{p.projectSize} kW</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-700/30 text-xs text-slate-500">{fmtDate(p.createdAt)}</div>
            </button>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="New Project" onClose={() => setShowAdd(false)} wide>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Customer Name" value={form.customerName} onChange={v=>setForm(f=>({...f,customerName:v}))} required/>
            <Field label="Phone" value={form.customerPhone} onChange={v=>setForm(f=>({...f,customerPhone:v}))}/>
            <Field label="Email" type="email" value={form.customerEmail} onChange={v=>setForm(f=>({...f,customerEmail:v}))}/>
            <Field label="Project Size (kW)" type="number" value={form.projectSize} onChange={v=>setForm(f=>({...f,projectSize:parseFloat(v)||0}))} required/>
            <Field label="Project Type" type="select" value={form.projectType} onChange={v=>setForm(f=>({...f,projectType:v}))} options={["Residential","Commercial","Industrial"]}/>
            <Field label="Status" type="select" value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} options={["Active","Proposal Sent","Completed","Cancelled"]}/>
          </div>
          <Field label="Address" type="textarea" rows={2} value={form.customerAddress} onChange={v=>setForm(f=>({...f,customerAddress:v}))}/>
          <div className="flex gap-3 mt-2">
            <Btn onClick={save} className="flex-1" disabled={!form.customerName||!form.projectSize}>Create Project</Btn>
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// PROJECT DETAIL
// ============================================================
const ProjectDetailPage = ({ project, notes, setNotes, documents, setDocuments, proposals, setProposals, templates, developer, currentUser, onBack }) => {
  const [tab, setTab] = useState("info");
  const [newNote, setNewNote] = useState("");
  const [showGen, setShowGen] = useState(false);
  const [selectedTmpl, setSelectedTmpl] = useState("");
  const [pForm, setPForm] = useState({});
  const [viewProposal, setViewProposal] = useState(null);
  const fileRef = useRef();

  const projNotes = notes.filter(n => n.projectId === project.id);
  const projDocs = documents.filter(d => d.projectId === project.id);
  const projProposals = proposals.filter(p => p.projectId === project.id);
  const avlTemplates = templates.filter(t => t.assignedTo.includes(project.developerId));

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(ns => [...ns, { id:`n${Date.now()}`, projectId: project.id, userId: currentUser.id, content: newNote, createdAt: new Date().toISOString() }]);
    setNewNote("");
  };

  const handleUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const types = { pdf:"PDF",doc:"Word",docx:"Word",xls:"Excel",xlsx:"Excel",jpg:"Image",jpeg:"Image",png:"Image",mp4:"Video",mov:"Video" };
    const ext = file.name.split(".").pop().toLowerCase();
    setDocuments(ds => [...ds, { id:`doc${Date.now()}`, projectId: project.id, name: file.name, type: types[ext]||"File", size:`${(file.size/1024).toFixed(0)} KB`, uploadDate: today, uploadedBy: currentUser.name }]);
  };

  const calcVars = (f = {}) => {
    const size = parseFloat(project.projectSize || 0);
    const ePrice = parseFloat(f.electricityPrice ?? developer.electricityPrice ?? 8.5);
    const costPerKW = parseFloat(f.costPerKW ?? developer.costPerKW ?? 50000);
    const genFactor = parseFloat(f.solarGenerationFactor ?? developer.solarGenerationFactor ?? 1350);
    const totalCost = size * costPerKW;
    const annualGeneration = size * genFactor;
    const annualSavings = annualGeneration * ePrice;
    const paybackPeriod = annualSavings > 0 ? (totalCost / annualSavings).toFixed(1) : "N/A";
    const roi25 = annualSavings > 0 ? (((annualSavings * 25 - totalCost) / totalCost) * 100).toFixed(0) : 0;
    const annualBillBefore = parseFloat(f.annualBillBefore) || annualSavings * 1.3;
    return { totalCost, annualGeneration, annualSavings, paybackPeriod, roi25, annualBillBefore, electricityPrice: ePrice };
  };

  const generateProposal = () => {
    const tmpl = templates.find(t => t.id === selectedTmpl); if (!tmpl) return;
    const vars = calcVars(pForm);
    const data = { ...pForm, ...vars, company_name: developer.companyName, company_address: developer.address, company_phone: developer.phone, company_email: developer.email, company_website: developer.website, payment_terms: developer.paymentTerms, customer_name: project.customerName, customer_address: project.customerAddress, customer_phone: project.customerPhone, customer_email: project.customerEmail, project_size: project.projectSize, project_type: project.projectType };
    const np = { id:`pr${Date.now()}`, projectId: project.id, templateId: selectedTmpl, status:"Generated", createdAt: today, data };
    setProposals(ps => [...ps, np]);
    setShowGen(false); setViewProposal(np);
  };

  const vars = calcVars();

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{project.customerName}</h1>
          <p className="text-slate-400 text-xs">{project.customerAddress}</p>
        </div>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${statusColor(project.status)}`}>{project.status}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">{project.projectType}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[["Size",`${project.projectSize} kW`,"zap"],["Total Cost",fmtINR(vars.totalCost),"invoice"],["Annual Savings",fmtINR(vars.annualSavings),"leaf"],["Payback",`${vars.paybackPeriod} yrs`,"chart"]].map(([l,v,ic]) => (
          <div key={l} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-3">
            <div className="text-slate-400 text-xs mb-1">{l}</div>
            <div className="text-white font-bold">{v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-[#070e1c] border border-slate-800 rounded-xl p-1 mb-5 w-fit">
        {["info","notes","documents","proposal"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${tab===t?"bg-amber-500 text-slate-900":"text-slate-400 hover:text-white"}`}>{t}</button>
        ))}
      </div>

      {tab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
            <h3 className="font-bold text-white mb-3 text-sm">Customer</h3>
            {[["Name",project.customerName],["Email",project.customerEmail],["Phone",project.customerPhone],["Address",project.customerAddress]].map(([k,v]) => (
              <div key={k} className="flex gap-3 text-sm py-1.5 border-b border-slate-700/20 last:border-0"><span className="text-slate-400 w-16 flex-shrink-0">{k}</span><span className="text-white">{v||"—"}</span></div>
            ))}
          </div>
          <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
            <h3 className="font-bold text-white mb-3 text-sm">Solar Calculations</h3>
            {[["Total Cost",fmtINR(vars.totalCost)],["Annual Generation",`${vars.annualGeneration.toLocaleString()} kWh`],["Annual Savings",fmtINR(vars.annualSavings)],["Payback Period",`${vars.paybackPeriod} years`],["25yr ROI",`${vars.roi25}%`]].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm py-1.5 border-b border-slate-700/20 last:border-0"><span className="text-slate-400">{k}</span><span className="text-amber-400 font-bold">{v}</span></div>
            ))}
          </div>
        </div>
      )}

      {tab === "notes" && (
        <div>
          <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 mb-4">
            <textarea value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Add a note..." rows={3} className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none text-sm mb-3"/>
            <Btn onClick={addNote} disabled={!newNote.trim()}><Icon name="plus" size={15}/>Add Note</Btn>
          </div>
          <div className="space-y-2">
            {projNotes.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No notes yet.</p> : projNotes.map(n => (
              <div key={n.id} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4">
                <p className="text-white text-sm mb-2">{n.content}</p>
                <p className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "documents" && (
        <div>
          <div className="mb-4">
            <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.mov"/>
            <Btn onClick={() => fileRef.current?.click()}><Icon name="upload" size={15}/>Upload Document</Btn>
          </div>
          {projDocs.length === 0 ? (
            <div className="text-center py-14 bg-[#0c1929] border border-dashed border-slate-700 rounded-xl">
              <Icon name="upload" size={28}/><p className="text-slate-400 mt-2">No documents yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {projDocs.map(doc => (
                <div key={doc.id} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400"><Icon name="file" size={18}/></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{doc.name}</div>
                    <div className="text-xs text-slate-400">{doc.type} · {doc.size} · {fmtDate(doc.uploadDate)}</div>
                  </div>
                  <Btn size="sm" variant="ghost" onClick={() => setDocuments(ds => ds.filter(d => d.id !== doc.id))}><Icon name="trash" size={13}/></Btn>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "proposal" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Proposals</h3>
            <Btn onClick={() => setShowGen(true)}><Icon name="plus" size={15}/>Create Proposal</Btn>
          </div>
          {projProposals.length === 0 ? (
            <div className="text-center py-14 bg-[#0c1929] border border-slate-700/50 rounded-xl">
              <Icon name="file" size={28}/><p className="text-slate-400 mt-2">No proposals yet</p>
              <Btn onClick={() => setShowGen(true)} className="mt-3"><Icon name="plus" size={15}/>Create First Proposal</Btn>
            </div>
          ) : projProposals.map(pr => {
            const tmpl = templates.find(t => t.id === pr.templateId);
            return (
              <div key={pr.id} className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400"><Icon name="file" size={18}/></div>
                <div className="flex-1"><div className="text-sm font-medium text-white">{tmpl?.name || "Proposal"}</div><div className="text-xs text-slate-400">{fmtDate(pr.createdAt)}</div></div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(pr.status)}`}>{pr.status}</span>
                <Btn size="sm" variant="outline" onClick={() => setViewProposal(pr)}><Icon name="eye" size={13}/>View</Btn>
              </div>
            );
          })}
        </div>
      )}

      {/* Proposal Generator */}
      {showGen && (
        <Modal title="Generate Proposal" onClose={() => setShowGen(false)} wide>
          <Field label="Select Template" type="select" value={selectedTmpl} onChange={setSelectedTmpl} options={[{value:"",label:"— Select Template —"}, ...avlTemplates.map(t=>({value:t.id,label:t.name}))]}/>
          {selectedTmpl && (() => {
            const v = calcVars(pForm);
            return (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Field label="Electricity Price (₹/kWh)" type="number" value={pForm.electricityPrice??developer.electricityPrice} onChange={val=>setPForm(f=>({...f,electricityPrice:val}))}/>
                  <Field label="Cost per kW (₹)" type="number" value={pForm.costPerKW??developer.costPerKW} onChange={val=>setPForm(f=>({...f,costPerKW:val}))}/>
                  <Field label="Solar Gen Factor" type="number" value={pForm.solarGenerationFactor??developer.solarGenerationFactor} onChange={val=>setPForm(f=>({...f,solarGenerationFactor:val}))}/>
                  <Field label="Annual Bill Before Solar (₹)" type="number" value={pForm.annualBillBefore||""} placeholder={fmtINR(v.annualBillBefore)} onChange={val=>setPForm(f=>({...f,annualBillBefore:val}))}/>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4 grid grid-cols-2 gap-2 text-sm">
                  {[["Total Cost",fmtINR(v.totalCost)],["Annual Gen",`${v.annualGeneration.toLocaleString()} kWh`],["Annual Savings",fmtINR(v.annualSavings)],["Payback",`${v.paybackPeriod} yrs`],["25yr ROI",`${v.roi25}%`]].map(([k,val])=>(
                    <div key={k} className="flex justify-between"><span className="text-slate-400">{k}</span><span className="text-amber-400 font-bold">{val}</span></div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Btn onClick={generateProposal} className="flex-1"><Icon name="zap" size={15}/>Generate Proposal</Btn>
                  <Btn variant="secondary" onClick={() => setShowGen(false)}>Cancel</Btn>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Proposal Preview */}
      {viewProposal && (
        <Modal title="Proposal Preview" onClose={() => setViewProposal(null)} wide>
          <ProposalPreview proposal={viewProposal} project={project} developer={developer} templates={templates}/>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// PROPOSAL PREVIEW (with print/download)
// ============================================================
const ProposalPreview = ({ proposal, project, developer, templates }) => {
  const d = proposal.data;
  const tmpl = templates.find(t => t.id === proposal.templateId);
  const printId = `proposal-print-${proposal.id}`;

  return (
    <div>
      <div id={printId}>
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-xl p-5 mb-4">
          <div className="flex items-start justify-between">
            <div>
              {developer.logo && <img src={developer.logo} alt="logo" className="h-10 mb-2 rounded"/>}
              <div className="text-lg font-black text-white">{d.company_name}</div>
              <div className="text-slate-400 text-xs">{d.company_address}</div>
              <div className="text-slate-400 text-xs">{d.company_phone} · {d.company_email}</div>
              {d.company_website && <div className="text-slate-400 text-xs">{d.company_website}</div>}
            </div>
            <div className="text-right">
              <div className="text-amber-400 font-black text-lg">SOLAR PROPOSAL</div>
              <div className="text-slate-400 text-xs">Date: {fmtDate(proposal.createdAt)}</div>
              <div className="text-slate-400 text-xs">{tmpl?.name}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-white mb-3 text-sm">Prepared For</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[["Name",d.customer_name],["Email",d.customer_email],["Phone",d.customer_phone],["Address",d.customer_address],["Project Size",`${d.project_size} kW`],["Project Type",d.project_type]].map(([k,v])=>(
              <div key={k}><span className="text-slate-400">{k}: </span><span className="text-white font-medium">{v||"—"}</span></div>
            ))}
          </div>
        </div>

        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-white mb-3 text-sm">Financial Summary</h4>
          <div className="grid grid-cols-2 gap-2">
            {[["System Size",`${d.project_size} kW`],["Total System Cost",fmtINR(d.totalCost)],["Annual Generation",`${(d.annualGeneration||0).toLocaleString()} kWh`],["Annual Savings",fmtINR(d.annualSavings)],["Payback Period",`${d.paybackPeriod} years`],["25-Year ROI",`${d.roi25}%`],["Electricity Rate",`₹${d.electricityPrice}/kWh`]].map(([k,v])=>(
              <div key={k} className="bg-slate-800/40 rounded-lg p-3 flex justify-between items-center">
                <span className="text-slate-400 text-xs">{k}</span><span className="text-amber-400 font-bold text-sm">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-white mb-3 text-sm">10-Year Savings Projection</h4>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-700">{["Year","Bill Before Solar","Bill After Solar","Annual Savings","Cumulative Savings"].map(h=><th key={h} className="text-left py-2 px-2 text-slate-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {Array.from({length:10},(_,i)=>{
                const yr=i+1;
                const before=(d.annualBillBefore||d.annualSavings*1.3)*Math.pow(1.03,yr);
                const savings=(d.annualSavings||0)*Math.pow(1.01,yr);
                const after=Math.max(0,before-savings);
                const cumulative=Array.from({length:yr},(_,j)=>(d.annualSavings||0)*Math.pow(1.01,j+1)).reduce((s,x)=>s+x,0);
                return <tr key={yr} className="border-b border-slate-700/20 hover:bg-slate-800/20">
                  <td className="py-2 px-2 text-white">{yr}</td>
                  <td className="py-2 px-2 text-red-400">{fmtINR(before)}</td>
                  <td className="py-2 px-2 text-emerald-400">{fmtINR(after)}</td>
                  <td className="py-2 px-2 text-amber-400">{fmtINR(savings)}</td>
                  <td className="py-2 px-2 text-sky-400">{fmtINR(cumulative)}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-white mb-3 text-sm">ROI Payback Chart</h4>
          <PaybackChart data={{ totalCost: d.totalCost, annualSavings: d.annualSavings }}/>
          <p className="text-xs text-slate-500 text-center mt-2">Break-even at year {d.paybackPeriod}</p>
        </div>

        {d.payment_terms && <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 mb-4"><h4 className="font-bold text-white mb-2 text-sm">Payment Terms</h4><p className="text-slate-400 text-xs">{d.payment_terms}</p></div>}
        {developer.bankDetails && <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 mb-4"><h4 className="font-bold text-white mb-2 text-sm">Bank Details</h4><pre className="text-slate-400 text-xs whitespace-pre-wrap">{developer.bankDetails}</pre></div>}
        {developer.terms && <div className="bg-[#0c1929] border border-slate-700/50 rounded-xl p-4 mb-4"><h4 className="font-bold text-white mb-2 text-sm">Terms & Conditions</h4><p className="text-slate-400 text-xs">{developer.terms}</p></div>}
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
        <Btn className="flex-1" onClick={() => printDiv(printId, `Proposal-${project.customerName}`)}><Icon name="print" size={15}/>Download / Print PDF</Btn>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function SolarProApp() {
  const [currentUser, setCurrentUser] = useLS("sp_currentUser", null);
  const [developers, setDevelopers] = useLS("sp_developers", initialDevelopers);
  const [users, setUsers] = useLS("sp_users", initialUsers);
  const [projects, setProjects] = useLS("sp_projects", initialProjects);
  const [notes, setNotes] = useLS("sp_notes", initialNotes);
  const [documents, setDocuments] = useLS("sp_documents", initialDocuments);
  const [templates, setTemplates] = useLS("sp_templates", initialTemplates);
  const [proposals, setProposals] = useLS("sp_proposals", initialProposals);
  const [invoices, setInvoices] = useLS("sp_invoices", initialInvoices);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentProjectId, setCurrentProjectId] = useState(null);

  if (!currentUser) return <LoginPage onLogin={u => { setCurrentUser(u); setCurrentPage("dashboard"); }}/>;

  const developer = developers.find(d => d.id === currentUser.developerId);
  const currentProject = currentProjectId ? projects.find(p => p.id === currentProjectId) : null;

  const setPage = (p) => { setCurrentPage(p); setCurrentProjectId(null); };

  const renderPage = () => {
    if (currentProject && developer) {
      return <ProjectDetailPage project={currentProject} notes={notes} setNotes={setNotes} documents={documents} setDocuments={setDocuments} proposals={proposals} setProposals={setProposals} templates={templates} developer={developer} currentUser={currentUser} onBack={() => setCurrentProjectId(null)}/>;
    }
    switch (currentPage) {
      case "dashboard": return currentUser.role === ROLES.SUPER_ADMIN ? <SuperAdminDashboard developers={developers} users={users} projects={projects} invoices={invoices}/> : <DevDashboard developer={developer} projects={projects} users={users}/>;
      case "developers": return <DevelopersPage developers={developers} setDevelopers={setDevelopers} users={users} setUsers={setUsers} invoices={invoices} setInvoices={setInvoices}/>;
      case "templates": return <TemplatesPage templates={templates} setTemplates={setTemplates} developers={developers} currentUser={currentUser}/>;
      case "invoices": return <InvoicesPage invoices={invoices} setInvoices={setInvoices} developers={developers}/>;
      case "users": case "team": return <UsersPage users={users} setUsers={setUsers} currentUser={currentUser}/>;
      case "projects": return <ProjectsPage projects={projects} setProjects={setProjects} currentUser={currentUser} setCurrentProjectId={setCurrentProjectId}/>;
      case "settings": return developer ? <SettingsPage developer={developer} setDevelopers={setDevelopers}/> : null;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#060c18] text-white overflow-hidden" style={{fontFamily:"'Inter','system-ui',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>
      <Sidebar user={currentUser} currentPage={currentPage} setPage={setPage} onLogout={() => { setCurrentUser(null); setCurrentPage("dashboard"); setCurrentProjectId(null); }} developer={developer}/>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-5 lg:p-7">{renderPage()}</div>
      </main>
    </div>
  );
}
