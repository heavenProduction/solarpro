// ============================================================
// SOLARPRO v3 - PART 1: CONSTANTS, DATA, UTILITIES
// ============================================================

import { useState, useEffect, useRef, createContext, useContext } from "react";

// ── ROLES ────────────────────────────────────────────────────
const ROLES = { SUPER_ADMIN: "super_admin", DEV_ADMIN: "dev_admin", USER: "user" };

// ── PLAN CONFIG ──────────────────────────────────────────────
const PLAN_DURATIONS = { "Monthly":1, "Quarterly":3, "Half Yearly":6, "Annual":12, "2 Year":24 };
const PLAN_PRICES    = { Starter:4999, Professional:14999, Enterprise:29999 };

function addMonths(date, months) {
  const d = new Date(date); d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}
const TODAY = new Date().toISOString().split("T")[0];

// ── THEME CONTEXT ────────────────────────────────────────────
const ThemeCtx = createContext({ dark: true, toggle: () => {} });

// ── SEED DATA ────────────────────────────────────────────────
const SEED_DEVELOPERS = [
  { id:"d1", companyName:"SunPower Solutions", email:"ceo@sunpower.com", phone:"+91-98001-11111", address:"1234 Solar Ave, Mumbai, MH 400001", website:"https://sunpower.com", seats:10, usedSeats:2, active:true, paused:false, plan:"Professional", planDuration:"Annual", subscriptionStart:"2025-01-01", subscriptionEnd:"2026-01-01", logo:null, electricityPrice:8.5, solarGenerationFactor:1400, costPerKW:55000, bankDetails:"Bank: HDFC\nAccount: 1234567890\nIFSC: HDFC0001234", terms:"Payment due within 30 days.", paymentTerms:"50% advance,\n25% on equipment delivery,\n25% on completion", customerScope:"Residential and small commercial customers across Maharashtra", companyScope:"Pan-India solar installation with focus on rooftop systems", createdAt:"2024-01-15" },
  { id:"d2", companyName:"GreenWatt Energy", email:"admin@greenwatt.com", phone:"+91-98002-22222", address:"5678 Energy Blvd, Pune, MH 411001", website:"https://greenwatt.com", seats:5, usedSeats:1, active:true, paused:false, plan:"Starter", planDuration:"Monthly", subscriptionStart:"2025-12-01", subscriptionEnd:"2026-01-01", logo:null, electricityPrice:7.8, solarGenerationFactor:1350, costPerKW:50000, bankDetails:"Bank: SBI\nAccount: 9876543210\nIFSC: SBIN0001234", terms:"Full payment before installation.", paymentTerms:"100% advance before work begins", customerScope:"Commercial and industrial clients", companyScope:"Western Maharashtra operations", createdAt:"2024-03-01" },
];

const SEED_USERS = [
  { id:"u1", email:"admin@solarpro.io", password:"Admin@123", name:"Platform Admin", role:ROLES.SUPER_ADMIN, developerId:null, active:true, paused:false, permissions:[], createdAt:"2024-01-01", phone:"" },
  { id:"u2", email:"ceo@sunpower.com", password:"Sun@123", name:"James Rivera", role:ROLES.DEV_ADMIN, developerId:"d1", active:true, paused:false, permissions:[], createdAt:"2024-01-15", phone:"+91-98001-11111" },
  { id:"u3", email:"sales@sunpower.com", password:"Sales@123", name:"Mia Chen", role:ROLES.USER, developerId:"d1", active:true, paused:false, permissions:["projects","proposals","notes","documents","invoices"], createdAt:"2024-02-01", phone:"+91-98001-22222" },
  { id:"u4", email:"admin@greenwatt.com", password:"Green@123", name:"Tom Okafor", role:ROLES.DEV_ADMIN, developerId:"d2", active:true, paused:false, permissions:[], createdAt:"2024-03-01", phone:"+91-98002-22222" },
];

const SEED_PROJECTS = [
  { id:"p1", developerId:"d1", userId:"u3", customerName:"Robert Kim", customerPhone:"+91-98111-00001", customerEmail:"r.kim@email.com", customerAddress:"789 Oak St, Pune, MH 411001", projectSize:8.5, projectType:"Residential", status:"Active", createdAt:"2024-06-01" },
  { id:"p2", developerId:"d1", userId:"u2", customerName:"Apex Corp", customerPhone:"+91-98111-00002", customerEmail:"facilities@apex.com", customerAddress:"100 Business Park, Mumbai, MH 400001", projectSize:45, projectType:"Commercial", status:"Proposal Sent", createdAt:"2024-05-20" },
  { id:"p3", developerId:"d2", userId:"u4", customerName:"Warehouse Co.", customerPhone:"+91-98111-00003", customerEmail:"ops@warehouse.com", customerAddress:"200 Industrial Way, Pune, MH 411028", projectSize:120, projectType:"Industrial", status:"Active", createdAt:"2024-06-05" },
];

const SEED_NOTES = [
  { id:"n1", projectId:"p1", userId:"u3", content:"Customer interested in battery backup.", createdAt:"2024-06-02T14:30:00Z" },
];

const SEED_DOCUMENTS = [
  { id:"doc1", projectId:"p1", name:"Site Survey Photos.pdf", type:"PDF", size:"2.3 MB", uploadDate:"2024-06-05", uploadedBy:"Mia Chen" },
];

const SEED_TEMPLATES = [
  { id:"t1", name:"Residential Solar Proposal", description:"Standard residential proposal", assignedTo:["d1","d2"], variables:["company_name","customer_name","project_size","total_cost","annual_savings","payback_period"], createdAt:"2024-01-01" },
  { id:"t2", name:"Commercial Solar Proposal", description:"Detailed commercial proposal", assignedTo:["d1"], variables:["company_name","customer_name","project_size","total_cost","annual_savings","payback_period","roi"], createdAt:"2024-02-01" },
];

const SEED_PROPOSALS = [
  { id:"pr1", projectId:"p1", templateId:"t1", status:"Generated", createdAt:"2024-06-04", data:{ company_name:"SunPower Solutions", customer_name:"Robert Kim", project_size:8.5, totalCost:467500, annualSavings:85000, paybackPeriod:"5.5", roi25:"280", annualGeneration:11900, electricityPrice:8.5, annualBillBefore:110500, payment_terms:"50% advance" } },
];

const SEED_INVOICES = [
  { id:"inv1", type:"platform", developerId:"d1", amount:14999, status:"Paid", date:"2024-05-01", plan:"Professional", planDuration:"Monthly", items:[{ name:"Professional Plan - Monthly", qty:1, price:14999, gst:18 }], customerName:"SunPower Solutions" },
  { id:"inv2", type:"platform", developerId:"d2", amount:4999, status:"Pending", date:"2024-06-01", plan:"Starter", planDuration:"Monthly", items:[{ name:"Starter Plan - Monthly", qty:1, price:4999, gst:18 }], customerName:"GreenWatt Energy" },
  { id:"inv3", type:"project", developerId:"d1", projectId:"p1", userId:"u2", amount:467500, status:"Sent", date:"2024-06-10", items:[{ name:"8.5 kW Rooftop Solar System", qty:1, price:467500, gst:12 }], customerName:"Robert Kim", customerAddress:"789 Oak St, Pune" },
];

// ── UTILITIES ────────────────────────────────────────────────
const useLS = (key, init) => {
  const [val, setVal] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }});
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
};

const fmtDate = (d) => { try { return new Date(d).toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"numeric"}); } catch { return d||""; }};
const fmtINR  = (n) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n||0);

const daysUntil = (dateStr) => {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const statusColor = (s, dark=true) => {
  const map = {
    "Active":        dark ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "Paused":        dark ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"   : "bg-yellow-100 text-yellow-700 border border-yellow-200",
    "Proposal Sent": dark ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"       : "bg-amber-100 text-amber-700 border border-amber-200",
    "Completed":     dark ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"             : "bg-sky-100 text-sky-700 border border-sky-200",
    "Cancelled":     dark ? "bg-red-500/20 text-red-300 border border-red-500/30"             : "bg-red-100 text-red-700 border border-red-200",
    "Paid":          dark ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "Pending":       dark ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"       : "bg-amber-100 text-amber-700 border border-amber-200",
    "Sent":          dark ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"             : "bg-sky-100 text-sky-700 border border-sky-200",
    "Generated":     dark ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"             : "bg-sky-100 text-sky-700 border border-sky-200",
    "Draft":         dark ? "bg-slate-500/20 text-slate-300 border border-slate-500/30"       : "bg-slate-100 text-slate-600 border border-slate-200",
    "Inactive":      dark ? "bg-red-500/20 text-red-300 border border-red-500/30"             : "bg-red-100 text-red-700 border border-red-200",
    "Deactivated":   dark ? "bg-red-500/20 text-red-300 border border-red-500/30"             : "bg-red-100 text-red-700 border border-red-200",
  };
  return map[s] || (dark ? "bg-slate-500/20 text-slate-300" : "bg-slate-100 text-slate-600");
};

// solar formula helper
const calcSolar = (projectSize, dev, overrides = {}) => {
  const size      = parseFloat(projectSize || 0);
  const ePrice    = parseFloat(overrides.electricityPrice   ?? dev?.electricityPrice   ?? 8.5);
  const costPerKW = parseFloat(overrides.costPerKW          ?? dev?.costPerKW          ?? 50000);
  const genFactor = parseFloat(overrides.solarGenerationFactor ?? dev?.solarGenerationFactor ?? 1350);
  const totalCost        = size * costPerKW;
  const annualGeneration = size * genFactor;
  const annualSavings    = annualGeneration * ePrice;
  const paybackPeriod    = annualSavings > 0 ? (totalCost / annualSavings).toFixed(1) : "N/A";
  const roi25            = annualSavings > 0 ? (((annualSavings*25 - totalCost)/totalCost)*100).toFixed(0) : 0;
  const annualBillBefore = parseFloat(overrides.annualBillBefore) || annualSavings * 1.3;
  return { totalCost, annualGeneration, annualSavings, paybackPeriod, roi25, annualBillBefore, electricityPrice:ePrice };
};

// invoice total helper
const calcInvoiceTotal = (items=[]) => {
  const net  = items.reduce((s,i) => s + (i.price||0)*(i.qty||1), 0);
  const gst  = items.reduce((s,i) => s + (i.price||0)*(i.qty||1)*(i.gst||0)/100, 0);
  return { net, gst, total: net + gst };
};
// ============================================================
// SOLARPRO v3 - PART 2: UI PRIMITIVES & SHARED COMPONENTS
// ============================================================

// ── ICONS ────────────────────────────────────────────────────
const Icon = ({ name, size=18 }) => {
  const p = { stroke:"currentColor", strokeWidth:"2", fill:"none", width:size, height:size, viewBox:"0 0 24 24" };
  const icons = {
    sun:      <svg {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon:     <svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    users:    <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    folder:   <svg {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    file:     <svg {...p}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
    chart:    <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    settings: <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    plus:     <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit:     <svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:    <svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    upload:   <svg {...p}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    download: <svg {...p}><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>,
    logout:   <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    building: <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
    invoice:  <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    template: <svg {...p}><rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    zap:      <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    check:    <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    x:        <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    home:     <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    search:   <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    pause:    <svg {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    play:     <svg {...p}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    eye:      <svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    calendar: <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    image:    <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    key:      <svg {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
    leaf:     <svg {...p}><path d="M17 8C8 10 5.9 16.17 3.82 19.34l1.43.86C6.5 18 9 15 12 14c0 0-2 3-2 6h2s1-4 5-7c0 0-3 1-5 4 0 0 3-1 5-5 0 0-1 4 1 6 0 0 3-5 3-10 0-5-4-7-4-7z"/></svg>,
    alert:    <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    print:    <svg {...p}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
    back:     <svg {...p}><polyline points="15 18 9 12 15 6"/></svg>,
    award:    <svg {...p}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    trending: <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    lock:     <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    bell:     <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    shield:   <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    user:     <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return <span style={{display:"inline-flex",alignItems:"center",flexShrink:0}}>{icons[name]||<span>?</span>}</span>;
};

// ── THEME-AWARE CLASSES ───────────────────────────────────────
const useTheme = () => useContext(ThemeCtx);
const tc = (dark, darkCls, lightCls) => dark ? darkCls : lightCls;

// ── MODAL ─────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide=false }) => {
  const { dark } = useTheme();
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`${tc(dark,"bg-[#0f172a] border-slate-700","bg-white border-slate-200")} border rounded-2xl shadow-2xl ${wide?"w-full max-w-3xl":"w-full max-w-lg"} max-h-[90vh] overflow-y-auto`} onClick={e=>e.stopPropagation()}>
        <div className={`flex items-center justify-between p-5 border-b ${tc(dark,"border-slate-700/60 bg-[#0f172a]","border-slate-200 bg-white")} sticky top-0 z-10 rounded-t-2xl`}>
          <h2 className={`text-base font-bold ${tc(dark,"text-white","text-slate-800")}`}>{title}</h2>
          <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${tc(dark,"text-slate-400 hover:text-white hover:bg-slate-700","text-slate-400 hover:text-slate-600 hover:bg-slate-100")}`}><Icon name="x" size={18}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// ── FIELD ─────────────────────────────────────────────────────
const Field = ({ label, type="text", value, onChange, placeholder, options, rows, required, hint }) => {
  const { dark } = useTheme();
  const base = `w-full border rounded-lg px-3 py-2.5 focus:outline-none transition-colors text-sm ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-amber-400","bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-amber-500")}`;
  return (
    <div className="mb-4">
      {label && <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>{label}{required&&<span className="text-amber-400 ml-1">*</span>}</label>}
      {hint  && <p className={`text-xs mb-1.5 ${tc(dark,"text-slate-500","text-slate-400")}`}>{hint}</p>}
      {type==="select" ? (
        <select value={value} onChange={e=>onChange(e.target.value)} className={base}>{options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}</select>
      ) : type==="textarea" ? (
        <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows||3} className={`${base} resize-none`}/>
      ) : (
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={base}/>
      )}
    </div>
  );
};

// ── BUTTON ─────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant="primary", size="md", disabled, className="", type="button" }) => {
  const variants = {
    primary:  "bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold",
    secondary:"bg-slate-700 hover:bg-slate-600 text-white",
    danger:   "bg-red-600 hover:bg-red-500 text-white",
    ghost:    "text-slate-300 hover:text-white hover:bg-slate-700/70",
    ghostL:   "text-slate-600 hover:text-slate-800 hover:bg-slate-100",
    outline:  "border border-slate-600 text-slate-300 hover:border-amber-400 hover:text-amber-400",
    success:  "bg-emerald-600 hover:bg-emerald-500 text-white font-bold",
  };
  const sizes = { sm:"px-2.5 py-1.5 text-xs", md:"px-4 py-2 text-sm", lg:"px-6 py-2.5 text-sm" };
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-1.5 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]||variants.primary} ${sizes[size]} ${className}`}>{children}</button>;
};

// ── SEARCH BAR ────────────────────────────────────────────────
const SearchBar = ({ value, onChange, placeholder="Search..." }) => {
  const { dark } = useTheme();
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon name="search" size={16}/></span>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={`w-full border rounded-lg pl-9 pr-4 py-2.5 focus:outline-none text-sm transition-colors ${tc(dark,"bg-[#0c1929] border-slate-700 text-white placeholder-slate-500 focus:border-amber-400","bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-amber-500")}`}/>
    </div>
  );
};

// ── STAT CARD ─────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color="amber", sub }) => {
  const { dark } = useTheme();
  return (
    <div className={`border rounded-xl p-5 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-${color}-500/15 text-${color}-400`}><Icon name={icon} size={18}/></div>
      <div className={`text-xl font-bold mb-0.5 ${tc(dark,"text-white","text-slate-800")}`}>{value}</div>
      <div className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>{label}</div>
      {sub && <div className={`text-xs mt-0.5 ${tc(dark,"text-slate-500","text-slate-400")}`}>{sub}</div>}
    </div>
  );
};

// ── LOGO UPLOADER ─────────────────────────────────────────────
const LogoUploader = ({ value, onChange }) => {
  const ref = useRef();
  const { dark } = useTheme();
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Company Logo</label>
      <div className="flex items-center gap-3">
        {value ? <img src={value} alt="logo" className="w-16 h-16 rounded-xl object-cover border border-slate-600"/> : <div className={`w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center ${tc(dark,"border-slate-600 text-slate-500","border-slate-300 text-slate-400")}`}><Icon name="image" size={22}/></div>}
        <div>
          <input ref={ref} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onChange(ev.target.result);r.readAsDataURL(f);}} className="hidden"/>
          <Btn size="sm" variant="outline" onClick={()=>ref.current?.click()}><Icon name="upload" size={14}/>Upload Logo</Btn>
          {value && <button onClick={()=>onChange(null)} className="ml-2 text-xs text-red-400 hover:text-red-300">Remove</button>}
        </div>
      </div>
    </div>
  );
};

// ── TEMPLATE ASSIGN DROPDOWN ──────────────────────────────────
const TemplateAssignDropdown = ({ developers, assignedTo, onChange }) => {
  const [open, setOpen] = useState(false);
  const { dark } = useTheme();
  const toggle = id => onChange(assignedTo.includes(id) ? assignedTo.filter(x=>x!==id) : [...assignedTo, id]);
  const names = developers.filter(d=>assignedTo.includes(d.id)).map(d=>d.companyName);
  return (
    <div className="mb-4 relative">
      <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Assign to Developer Accounts</label>
      <button type="button" onClick={()=>setOpen(o=>!o)} className={`w-full border rounded-lg px-3 py-2.5 text-left text-sm flex items-center justify-between ${tc(dark,"bg-slate-800 border-slate-600 text-white focus:border-amber-400","bg-white border-slate-300 text-slate-800 focus:border-amber-500")}`}>
        <span className={names.length?"":"text-slate-500"}>{names.length ? names.join(", ") : "Select accounts..."}</span>
        <span className="text-slate-400 text-xs">{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div className={`absolute z-20 w-full mt-1 border rounded-xl shadow-xl overflow-hidden ${tc(dark,"bg-slate-800 border-slate-600","bg-white border-slate-200")}`}>
          {developers.map(d=>(
            <label key={d.id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${tc(dark,"hover:bg-slate-700","hover:bg-slate-50")}`}>
              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${assignedTo.includes(d.id)?"bg-amber-500 border-amber-500":"border-slate-500"}`}>{assignedTo.includes(d.id)&&<Icon name="check" size={11}/>}</div>
              <input type="checkbox" checked={assignedTo.includes(d.id)} onChange={()=>toggle(d.id)} className="hidden"/>
              <div><div className={`text-sm font-medium ${tc(dark,"text-white","text-slate-800")}`}>{d.companyName}</div><div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{d.email}</div></div>
            </label>
          ))}
          {!developers.length && <div className="px-4 py-3 text-sm text-slate-400">No developers found.</div>}
        </div>
      )}
    </div>
  );
};

// ── PERMISSIONS PICKER ────────────────────────────────────────
const PermissionsPicker = ({ value, onChange, label="Permissions" }) => {
  const { dark } = useTheme();
  const ALL_PERMS = ["projects","proposals","notes","documents","invoices","settings","team"];
  const toggle = p => onChange(value.includes(p) ? value.filter(x=>x!==p) : [...value, p]);
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-2 ${tc(dark,"text-slate-300","text-slate-700")}`}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {ALL_PERMS.map(p=>(
          <button key={p} type="button" onClick={()=>toggle(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${value.includes(p) ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : tc(dark,"bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-500","bg-slate-100 text-slate-500 border-slate-300 hover:border-slate-400")}`}>{p}</button>
        ))}
      </div>
    </div>
  );
};

// ── PAYBACK CHART ─────────────────────────────────────────────
const PaybackChart = ({ totalCost, annualSavings }) => {
  const years=25, W=360, H=150, PAD=36;
  const pts = Array.from({length:years+1},(_,i)=>({y:i, val:i*annualSavings-totalCost}));
  const maxV=Math.max(...pts.map(p=>p.val)), minV=Math.min(...pts.map(p=>p.val));
  const range=maxV-minV||1;
  const x=i=>PAD+(i/years)*(W-PAD*2), y=v=>H-PAD-((v-minV)/range)*(H-PAD*2);
  const path=pts.map((p,i)=>`${i===0?"M":"L"}${x(p.y)},${y(p.val)}`).join(" ");
  return (
    <svg width={W} height={H} className="w-full">
      <defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4"/><stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/></linearGradient></defs>
      <line x1={PAD} y1={H-PAD} x2={W-PAD} y2={H-PAD} stroke="#334155" strokeWidth="1"/>
      <line x1={PAD} y1={PAD} x2={PAD} y2={H-PAD} stroke="#334155" strokeWidth="1"/>
      {minV<0&&maxV>0&&<line x1={PAD} y1={y(0)} x2={W-PAD} y2={y(0)} stroke="#475569" strokeWidth="1" strokeDasharray="3,3"/>}
      {[0,5,10,15,20,25].map(yr=><text key={yr} x={x(yr)} y={H-6} textAnchor="middle" fill="#64748b" fontSize="9">{yr}y</text>)}
      <path d={`${path} L${x(years)},${H-PAD} L${x(0)},${H-PAD} Z`} fill="url(#ga)"/>
      <path d={path} stroke="#f59e0b" strokeWidth="2" fill="none"/>
    </svg>
  );
};

// ── PRINT HELPER ─────────────────────────────────────────────
const printElement = (id, title) => {
  const el = document.getElementById(id);
  if (!el) return;
  const w = window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;color:#111;background:#fff;padding:32px}
    table{width:100%;border-collapse:collapse}
    th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:13px}
    th{background:#f3f4f6;font-weight:700}
    h1,h2,h3{margin-bottom:8px}
    .amber{color:#d97706} .green{color:#059669} .red{color:#dc2626}
    img{max-height:60px;margin-bottom:8px}
    @media print{body{padding:0}@page{margin:1cm}}
  </style></head><body>${el.innerHTML}</body></html>`);
  w.document.close(); w.focus();
  setTimeout(()=>{w.print();w.close();},600);
};

// ── SUBSCRIPTION BANNER ───────────────────────────────────────
const SubscriptionBanner = ({ developer }) => {
  const { dark } = useTheme();
  if (!developer) return null;
  const days = daysUntil(developer.subscriptionEnd);
  if (developer.paused) return (
    <div className="bg-red-500/10 border-b border-red-500/30 px-6 py-2.5 flex items-center gap-3">
      <Icon name="alert" size={16}/><span className="text-red-400 text-sm font-medium flex-1">Your subscription is paused. Please contact your account manager to resume access.</span>
    </div>
  );
  if (days <= 0) return (
    <div className="bg-red-500/10 border-b border-red-500/30 px-6 py-2.5 flex items-center gap-3">
      <Icon name="alert" size={16}/><span className="text-red-400 text-sm font-medium flex-1">⚠ Your subscription has expired. Contact your account manager to renew.</span>
    </div>
  );
  if (days <= 15) return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2.5 flex items-center gap-3">
      <Icon name="bell" size={16}/><span className="text-amber-400 text-sm font-medium flex-1">⏰ Your {developer.plan} plan expires in <strong>{days} day{days!==1?"s":""}</strong>. Contact your account manager to renew before losing access.</span>
    </div>
  );
  return null;
};

// ── LOCKED PAGE (subscription expired) ───────────────────────
const LockedPage = ({ developer }) => {
  const { dark } = useTheme();
  const days = daysUntil(developer?.subscriptionEnd || "2000-01-01");
  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] text-center p-8`}>
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20"><Icon name="lock" size={36}/></div>
      <h2 className={`text-2xl font-black mb-2 ${tc(dark,"text-white","text-slate-800")}`}>{developer?.paused ? "Subscription Paused" : "Subscription Expired"}</h2>
      <p className={`text-base mb-4 max-w-md ${tc(dark,"text-slate-400","text-slate-500")}`}>
        {developer?.paused ? "Your account has been paused by the platform admin." : `Your ${developer?.plan} plan expired ${Math.abs(days)} day${Math.abs(days)!==1?"s":""} ago.`}
      </p>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-8 py-4">
        <p className="text-amber-400 font-bold">📞 Contact your Account Manager to restore access.</p>
      </div>
    </div>
  );
};
// ============================================================
// SOLARPRO v3 - PART 3: INVOICE GENERATOR (shared by all roles)
// ============================================================

// ── INVOICE HTML RENDERER (matches the provided Templid style) ──
const buildInvoiceHTML = ({ inv, developer, customer }) => {
  const { net, gst, total } = calcInvoiceTotal(inv.items);
  const rows = (inv.items||[]).map((item,i) => {
    const sub = item.price * item.qty;
    const vatAmt = sub * (item.gst||0) / 100;
    return `<tr>
      <td style="border-bottom:1px solid #e5e7eb;padding:12px 8px">${i+1}.</td>
      <td style="border-bottom:1px solid #e5e7eb;padding:12px 8px">${item.name}</td>
      <td style="border-bottom:1px solid #e5e7eb;padding:12px 8px;text-align:right">₹${Number(item.price).toLocaleString("en-IN")}</td>
      <td style="border-bottom:1px solid #e5e7eb;padding:12px 8px;text-align:center">${item.qty}</td>
      <td style="border-bottom:1px solid #e5e7eb;padding:12px 8px;text-align:center">${item.gst||0}%</td>
      <td style="border-bottom:1px solid #e5e7eb;padding:12px 8px;text-align:right">₹${Number(sub).toLocaleString("en-IN")}</td>
      <td style="border-bottom:1px solid #e5e7eb;padding:12px 8px;text-align:right">₹${Number(sub+vatAmt).toLocaleString("en-IN")}</td>
    </tr>`;
  }).join("");
  const logoTag = developer?.logo ? `<img src="${developer.logo}" style="height:48px;margin-bottom:8px;display:block"/>` : `<div style="font-size:20px;font-weight:900;color:#5c6ac4;margin-bottom:8px">${developer?.companyName||"Company"}</div>`;
  return `<!DOCTYPE html><html><head><title>Invoice ${inv.id}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#404040;background:#fff}@page{margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
  </head><body>
  <div style="padding:40px 56px">
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <tr>
        <td style="vertical-align:top;width:100%">${logoTag}<div style="font-size:13px;color:#525252">${developer?.address||""}<br/>${developer?.phone||""} | ${developer?.email||""}</div></td>
        <td style="vertical-align:top;white-space:nowrap;text-align:right">
          <div style="font-size:13px;color:#94a3b8">Date</div>
          <div style="font-size:14px;font-weight:700;color:#5c6ac4">${inv.date}</div>
          <div style="font-size:13px;color:#94a3b8;margin-top:8px">Invoice #</div>
          <div style="font-size:14px;font-weight:700;color:#5c6ac4">${inv.id.toUpperCase()}</div>
        </td>
      </tr>
    </table>
    <div style="background:#f1f5f9;padding:24px 0;margin-bottom:24px">
      <table style="width:100%;border-collapse:collapse;padding:0 0">
        <tr>
          <td style="width:50%;vertical-align:top;padding:0 56px">
            <div style="font-size:13px;color:#525252"><strong>${developer?.companyName||"Supplier"}</strong><br/>${developer?.address||""}<br/>GSTIN: ${developer?.gstIn||"—"}</div>
          </td>
          <td style="width:50%;vertical-align:top;text-align:right;padding:0 56px">
            <div style="font-size:13px;color:#525252">
              <strong>${customer?.name||inv.customerName||""}</strong><br/>
              ${customer?.address||inv.customerAddress||""}<br/>
              ${customer?.phone||inv.customerPhone||""}<br/>
              ${customer?.email||inv.customerEmail||""}
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div style="padding:0">
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="border-bottom:2px solid #5c6ac4">
          <th style="padding:8px;color:#5c6ac4;text-align:left">#</th>
          <th style="padding:8px;color:#5c6ac4;text-align:left">Description</th>
          <th style="padding:8px;color:#5c6ac4;text-align:right">Price</th>
          <th style="padding:8px;color:#5c6ac4;text-align:center">Qty</th>
          <th style="padding:8px;color:#5c6ac4;text-align:center">GST</th>
          <th style="padding:8px;color:#5c6ac4;text-align:right">Subtotal</th>
          <th style="padding:8px;color:#5c6ac4;text-align:right">Subtotal+GST</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr><td colspan="7">
            <table style="width:100%;border-collapse:collapse;margin-top:8px">
              <tr><td style="width:100%"></td><td style="white-space:nowrap">
                <table style="border-collapse:collapse">
                  <tr><td style="border-bottom:1px solid #e5e7eb;padding:8px 12px;color:#94a3b8">Net total:</td><td style="border-bottom:1px solid #e5e7eb;padding:8px 12px;text-align:right;font-weight:700;color:#5c6ac4">₹${Number(net).toLocaleString("en-IN")}</td></tr>
                  <tr><td style="padding:8px 12px;color:#94a3b8">GST total:</td><td style="padding:8px 12px;text-align:right;font-weight:700;color:#5c6ac4">₹${Number(gst).toLocaleString("en-IN")}</td></tr>
                  <tr><td style="background:#5c6ac4;padding:10px 12px;font-weight:700;color:#fff">Total:</td><td style="background:#5c6ac4;padding:10px 12px;text-align:right;font-weight:700;color:#fff">₹${Number(total).toLocaleString("en-IN")}</td></tr>
                </table>
              </td></tr>
            </table>
          </td></tr>
        </tfoot>
      </table>
    </div>
    ${developer?.bankDetails ? `<div style="margin-top:32px;font-size:13px"><strong style="color:#5c6ac4">PAYMENT DETAILS</strong><br/><pre style="font-family:Arial,sans-serif;white-space:pre-wrap;color:#525252">${developer.bankDetails}</pre></div>` : ""}
    ${inv.notes ? `<div style="margin-top:24px;font-size:13px"><strong style="color:#5c6ac4">Notes</strong><br/><em style="color:#525252">${inv.notes}</em></div>` : ""}
    <footer style="position:fixed;bottom:0;left:0;width:100%;background:#f1f5f9;text-align:center;padding:10px;font-size:11px;color:#525252">${developer?.companyName||""} | ${developer?.email||""} | ${developer?.phone||""}</footer>
  </div></body></html>`;
};

const printInvoice = (inv, developer, customer) => {
  const html = buildInvoiceHTML({ inv, developer, customer });
  const w = window.open("","_blank");
  w.document.write(html); w.document.close(); w.focus();
  setTimeout(()=>{w.print();w.close();},700);
};

// ── INVOICE ITEM EDITOR ───────────────────────────────────────
const InvoiceItemEditor = ({ items, setItems }) => {
  const { dark } = useTheme();
  const addItem = () => setItems(it=>[...it,{name:"",qty:1,price:0,gst:18}]);
  const updateItem = (i,k,v) => setItems(it=>it.map((x,idx)=>idx===i?{...x,[k]:v}:x));
  const removeItem = i => setItems(it=>it.filter((_,idx)=>idx!==i));
  const { net, gst, total } = calcInvoiceTotal(items);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={`text-sm font-medium ${tc(dark,"text-slate-300","text-slate-700")}`}>Line Items</label>
        <Btn size="sm" variant="outline" onClick={addItem}><Icon name="plus" size={13}/>Add Item</Btn>
      </div>
      <div className="space-y-2 mb-3">
        {items.map((item,i)=>(
          <div key={i} className={`border rounded-xl p-3 ${tc(dark,"bg-slate-800/50 border-slate-700","bg-slate-50 border-slate-200")}`}>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5"><input value={item.name} onChange={e=>updateItem(i,"name",e.target.value)} placeholder="Description" className={`w-full text-sm px-2 py-1.5 rounded-lg border ${tc(dark,"bg-slate-700 border-slate-600 text-white placeholder-slate-400","bg-white border-slate-300 text-slate-800")} focus:outline-none`}/></div>
              <div className="col-span-2"><input type="number" value={item.qty} onChange={e=>updateItem(i,"qty",parseFloat(e.target.value)||1)} placeholder="Qty" className={`w-full text-sm px-2 py-1.5 rounded-lg border ${tc(dark,"bg-slate-700 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")} focus:outline-none`}/></div>
              <div className="col-span-2"><input type="number" value={item.price} onChange={e=>updateItem(i,"price",parseFloat(e.target.value)||0)} placeholder="Price" className={`w-full text-sm px-2 py-1.5 rounded-lg border ${tc(dark,"bg-slate-700 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")} focus:outline-none`}/></div>
              <div className="col-span-2"><select value={item.gst} onChange={e=>updateItem(i,"gst",parseFloat(e.target.value))} className={`w-full text-sm px-2 py-1.5 rounded-lg border ${tc(dark,"bg-slate-700 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")} focus:outline-none`}>{[0,5,12,18,28].map(r=><option key={r} value={r}>{r}%</option>)}</select></div>
              <div className="col-span-1 flex items-center justify-center"><button onClick={()=>removeItem(i)} className="text-red-400 hover:text-red-300 transition-colors"><Icon name="trash" size={14}/></button></div>
            </div>
          </div>
        ))}
        {!items.length && <p className={`text-sm text-center py-3 ${tc(dark,"text-slate-500","text-slate-400")}`}>No items yet. Click "Add Item" above.</p>}
      </div>
      <div className={`border rounded-xl p-3 space-y-1 text-sm ${tc(dark,"bg-slate-800/30 border-slate-700","bg-slate-50 border-slate-200")}`}>
        <div className="flex justify-between"><span className={tc(dark,"text-slate-400","text-slate-500")}>Net Total:</span><span className={tc(dark,"text-white","text-slate-800")} style={{fontWeight:600}}>{fmtINR(net)}</span></div>
        <div className="flex justify-between"><span className={tc(dark,"text-slate-400","text-slate-500")}>GST:</span><span className={tc(dark,"text-white","text-slate-800")} style={{fontWeight:600}}>{fmtINR(gst)}</span></div>
        <div className={`flex justify-between border-t pt-1 ${tc(dark,"border-slate-700","border-slate-200")}`}><span className="text-amber-400 font-bold">Total:</span><span className="text-amber-400 font-black text-base">{fmtINR(total)}</span></div>
      </div>
    </div>
  );
};

// ── INVOICE LIST VIEW (shared) ────────────────────────────────
const InvoiceListView = ({ invoices, developers, projects, users, onView, onPrint, onMarkPaid, currentUser }) => {
  const { dark } = useTheme();
  if (!invoices.length) return (
    <div className={`text-center py-16 border rounded-xl ${tc(dark,"bg-[#0c1929] border-slate-700","bg-white border-slate-200")}`}>
      <Icon name="invoice" size={28}/><p className={`mt-2 ${tc(dark,"text-slate-400","text-slate-500")}`}>No invoices yet.</p>
    </div>
  );
  return (
    <div className={`border rounded-xl overflow-hidden ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
      <table className="w-full text-sm">
        <thead><tr className={`border-b ${tc(dark,"border-slate-700 bg-slate-800/30","border-slate-200 bg-slate-50")}`}>
          {["Invoice #","Customer / Developer","Amount","Date","Status","Actions"].map(h=>(
            <th key={h} className={`text-left px-4 py-3 font-medium text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {invoices.map(inv=>{
            const dev = developers?.find(d=>d.id===inv.developerId);
            const proj= projects?.find(p=>p.id===inv.projectId);
            const { total } = calcInvoiceTotal(inv.items||[]);
            const displayAmt = total || inv.amount || 0;
            return (
              <tr key={inv.id} className={`border-b transition-colors ${tc(dark,"border-slate-700/30 hover:bg-slate-800/20","border-slate-100 hover:bg-slate-50")}`}>
                <td className={`px-4 py-3 font-mono text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{inv.id.toUpperCase()}</td>
                <td className="px-4 py-3">
                  <div className={`font-medium ${tc(dark,"text-white","text-slate-800")}`}>{inv.customerName || dev?.companyName || "—"}</div>
                  {proj && <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{proj.customerName}</div>}
                </td>
                <td className={`px-4 py-3 font-bold ${tc(dark,"text-white","text-slate-800")}`}>{fmtINR(displayAmt)}</td>
                <td className={`px-4 py-3 ${tc(dark,"text-slate-400","text-slate-500")}`}>{fmtDate(inv.date)}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(inv.status,dark)}`}>{inv.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onView(inv)}><Icon name="eye" size={13}/>View</Btn>
                    <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onPrint(inv)}><Icon name="print" size={13}/>PDF</Btn>
                    {inv.status==="Pending"&&onMarkPaid&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onMarkPaid(inv.id)}><Icon name="check" size={13}/>Paid</Btn>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
// ============================================================
// SOLARPRO v3 - PART 4: AUTH, SIDEBAR, DASHBOARDS
// ============================================================

// ── LOGIN ─────────────────────────────────────────────────────
const LoginPage = ({ onLogin, allUsers }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    await new Promise(r=>setTimeout(r,500));
    const user = allUsers.find(u=>u.email===email && u.password===password);
    if (!user) { setError("Invalid email or password."); setLoading(false); return; }
    if (!user.active) { setError("Your account has been deactivated. Please contact your admin."); setLoading(false); return; }
    if (user.paused) { setError("Your account is paused. Please contact your admin."); setLoading(false); return; }
    onLogin(user);
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
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm"><Icon name="alert" size={15}/><span>{error}</span></div>}
          <form onSubmit={handle}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-sm"/>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-sm"/>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"/><span>Signing in…</span></> : <><Icon name="zap" size={16}/>Sign In</>}
            </button>
          </form>
          <div className="mt-5 pt-5 border-t border-slate-700/40">
            <p className="text-xs text-slate-500 mb-2 font-semibold">DEMO ACCOUNTS</p>
            {demos.map(([role,e,p])=>(
              <button key={e} onClick={()=>{setEmail(e);setPassword(p);}} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-700/40 transition-colors">
                <span className="text-xs text-amber-400 font-bold">{role}: </span><span className="text-xs text-slate-400">{e}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SIDEBAR ────────────────────────────────────────────────────
const Sidebar = ({ user, currentPage, setPage, onLogout, developer }) => {
  const { dark, toggle } = useTheme();
  const superNav = [
    {id:"dashboard",label:"Dashboard",icon:"home"},
    {id:"developers",label:"Developers",icon:"building"},
    {id:"templates",label:"Templates",icon:"template"},
    {id:"invoices",label:"Invoices",icon:"invoice"},
    {id:"create-invoice",label:"Create Invoice",icon:"plus"},
    {id:"users",label:"All Users",icon:"users"},
  ];
  const devNav = [
    {id:"dashboard",label:"Dashboard",icon:"home"},
    {id:"projects",label:"Projects",icon:"folder"},
    {id:"team",label:"My Team",icon:"users"},
    {id:"invoices",label:"Invoices",icon:"invoice"},
    {id:"templates",label:"Templates",icon:"template"},
    {id:"settings",label:"Settings",icon:"settings"},
  ];
  const userNav = [
    {id:"dashboard",label:"Dashboard",icon:"home"},
    {id:"projects",label:"Projects",icon:"folder"},
    {id:"invoices",label:"Invoices",icon:"invoice"},
  ];
  const nav = user.role===ROLES.SUPER_ADMIN ? superNav : user.role===ROLES.DEV_ADMIN ? devNav : userNav;
  const bg = tc(dark,"bg-[#070e1c] border-slate-800","bg-white border-slate-200");
  const itemActive = tc(dark,"bg-amber-500/15 text-amber-400 border border-amber-500/20","bg-amber-50 text-amber-700 border border-amber-200");
  const itemInactive = tc(dark,"text-slate-400 hover:text-white hover:bg-slate-800/60","text-slate-500 hover:text-slate-800 hover:bg-slate-100");

  return (
    <div className={`w-56 border-r flex flex-col h-full flex-shrink-0 ${bg}`}>
      <div className={`p-4 border-b ${tc(dark,"border-slate-800","border-slate-200")}`}>
        <div className="flex items-center gap-2.5">
          {developer?.logo ? <img src={developer.logo} alt="logo" className="w-8 h-8 rounded-lg object-cover border border-slate-200"/> : <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20"><Icon name="sun" size={16}/></div>}
          <div>
            <div className={`text-sm font-black ${tc(dark,"text-white","text-slate-800")}`} style={{fontFamily:"'Orbitron',monospace"}}>SOLAR<span className="text-amber-400">PRO</span></div>
            <div className={`text-[10px] truncate max-w-[110px] ${tc(dark,"text-slate-500","text-slate-400")}`}>{user.role===ROLES.SUPER_ADMIN?"Platform Admin":developer?.companyName||"Dashboard"}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {nav.map(item=>(
          <button key={item.id} onClick={()=>setPage(item.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage===item.id ? itemActive : itemInactive}`}>
            <Icon name={item.icon} size={16}/>{item.label}
          </button>
        ))}
      </nav>
      <div className={`p-2 border-t ${tc(dark,"border-slate-800","border-slate-200")}`}>
        {/* Dark / Light toggle */}
        <button onClick={toggle} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-1 ${tc(dark,"text-slate-400 hover:text-white hover:bg-slate-800/60","text-slate-500 hover:text-slate-800 hover:bg-slate-100")}`}>
          <Icon name={dark?"sun":"moon"} size={16}/>{dark?"Light Mode":"Dark Mode"}
        </button>
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${tc(dark,"bg-slate-700","bg-amber-500")}`}>{user.name.charAt(0)}</div>
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-medium truncate ${tc(dark,"text-white","text-slate-800")}`}>{user.name}</div>
            <div className={`text-[10px] capitalize ${tc(dark,"text-slate-500","text-slate-400")}`}>{user.role.replace("_"," ")}</div>
          </div>
          <button onClick={onLogout} className={`transition-colors ${tc(dark,"text-slate-500 hover:text-red-400","text-slate-400 hover:text-red-500")}`} title="Logout"><Icon name="logout" size={15}/></button>
        </div>
      </div>
    </div>
  );
};

// ── SUPER ADMIN DASHBOARD ──────────────────────────────────────
const SuperAdminDashboard = ({ developers, users, projects, invoices, proposals }) => {
  const { dark } = useTheme();
  const revenue = invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+(calcInvoiceTotal(i.items||[]).total||i.amount||0),0);

  // Engagement score per developer
  const engagementData = developers.map(dev=>{
    const devUsers    = users.filter(u=>u.developerId===dev.id && u.role!==ROLES.SUPER_ADMIN);
    const devProjects = projects.filter(p=>p.developerId===dev.id);
    const devProposals= proposals.filter(pr=>devProjects.some(p=>p.id===pr.projectId));
    const devInvoices = invoices.filter(i=>i.developerId===dev.id && i.type==="project");
    const score = devUsers.length*10 + devProjects.length*20 + devProposals.length*15 + devInvoices.length*10;
    return { dev, devUsers, devProjects, devProposals, devInvoices, score };
  }).sort((a,b)=>b.score-a.score);

  const maxScore = Math.max(...engagementData.map(e=>e.score), 1);

  return (
    <div>
      <h1 className={`text-xl font-bold mb-1 ${tc(dark,"text-white","text-slate-800")}`}>Platform Overview</h1>
      <p className={`text-sm mb-5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Manage all developer accounts and platform settings</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active Developers" value={developers.filter(d=>d.active&&!d.paused).length} icon="building" color="amber"/>
        <StatCard label="Total Users" value={users.filter(u=>u.role!==ROLES.SUPER_ADMIN).length} icon="users" color="sky"/>
        <StatCard label="Total Projects" value={projects.length} icon="folder" color="emerald"/>
        <StatCard label="Platform Revenue" value={fmtINR(revenue)} icon="invoice" color="purple"/>
      </div>

      {/* Developer Engagement */}
      <div className={`border rounded-xl p-5 mb-5 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
        <h3 className={`font-bold mb-4 flex items-center gap-2 ${tc(dark,"text-white","text-slate-800")}`}><Icon name="trending" size={16}/> Developer Engagement Scores</h3>
        <div className="space-y-3">
          {engagementData.map(({dev,score,devProjects,devProposals,devUsers,devInvoices},i)=>(
            <div key={dev.id} className={`rounded-xl p-3 ${tc(dark,"bg-slate-800/40","bg-slate-50")}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`text-sm font-bold w-5 text-center ${tc(dark,"text-slate-400","text-slate-500")}`}>{i+1}</div>
                {dev.logo?<img src={dev.logo} className="w-7 h-7 rounded-lg object-cover" alt=""/>:<div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${tc(dark,"bg-slate-600","bg-amber-500")}`}>{dev.companyName.charAt(0)}</div>}
                <div className="flex-1">
                  <div className={`text-sm font-bold ${tc(dark,"text-white","text-slate-800")}`}>{dev.companyName}</div>
                  <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{devUsers.length} users · {devProjects.length} projects · {devProposals.length} proposals · {devInvoices.length} invoices</div>
                </div>
                <div className="text-amber-400 font-black text-sm">{score} pts</div>
              </div>
              <div className={`w-full h-2 rounded-full ${tc(dark,"bg-slate-700","bg-slate-200")}`}>
                <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all" style={{width:`${(score/maxScore)*100}%`}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Developer Accounts</h3>
          {developers.map(d=>(
            <div key={d.id} className={`flex items-center justify-between py-2 border-b last:border-0 ${tc(dark,"border-slate-700/30","border-slate-100")}`}>
              <div><div className={`text-sm font-medium ${tc(dark,"text-white","text-slate-800")}`}>{d.companyName}</div><div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{d.plan} · {d.usedSeats}/{d.seats} seats · until {fmtDate(d.subscriptionEnd)}</div></div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(d.paused?"Paused":d.active?"Active":"Inactive",dark)}`}>{d.paused?"Paused":d.active?"Active":"Inactive"}</span>
            </div>
          ))}
        </div>
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Recent Invoices</h3>
          {invoices.slice(0,5).map(inv=>{
            const dev=developers.find(d=>d.id===inv.developerId);
            const {total}=calcInvoiceTotal(inv.items||[]);
            return (
              <div key={inv.id} className={`flex items-center justify-between py-2 border-b last:border-0 ${tc(dark,"border-slate-700/30","border-slate-100")}`}>
                <div><div className={`text-sm font-medium ${tc(dark,"text-white","text-slate-800")}`}>{inv.customerName||dev?.companyName||"—"}</div><div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{fmtDate(inv.date)}</div></div>
                <div className="text-right"><div className={`text-sm font-bold ${tc(dark,"text-white","text-slate-800")}`}>{fmtINR(total||inv.amount)}</div><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(inv.status,dark)}`}>{inv.status}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── DEV ADMIN DASHBOARD ────────────────────────────────────────
const DevDashboard = ({ developer, projects, users, proposals, invoices }) => {
  const { dark } = useTheme();
  const devProjects  = projects.filter(p=>p.developerId===developer.id);
  const devUsers     = users.filter(u=>u.developerId===developer.id && u.role!==ROLES.SUPER_ADMIN);
  const isExpired    = developer.subscriptionEnd && new Date(developer.subscriptionEnd)<new Date();

  // Top performer users
  const userPerf = devUsers.map(u=>{
    const uProjects  = devProjects.filter(p=>p.userId===u.id);
    const uProposals = proposals.filter(pr=>uProjects.some(p=>p.id===pr.projectId));
    const uInvoices  = invoices.filter(i=>i.userId===u.id && i.type==="project");
    const revenue    = uInvoices.reduce((s,i)=>s+(calcInvoiceTotal(i.items||[]).total||i.amount||0),0);
    const score      = uProjects.length*20 + uProposals.length*15 + uInvoices.length*10;
    return { u, uProjects, uProposals, uInvoices, revenue, score };
  }).sort((a,b)=>b.score-a.score);
  const maxScore = Math.max(...userPerf.map(e=>e.score),1);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>{developer.companyName}</h1><p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>Solar Management Dashboard</p></div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${isExpired?"bg-red-500/10 border-red-500/30 text-red-400":"bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
          <Icon name="calendar" size={14}/>{developer.plan} · {isExpired?"Expired":`Until ${fmtDate(developer.subscriptionEnd)}`}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Projects" value={devProjects.length} icon="folder" color="amber"/>
        <StatCard label="Active Projects" value={devProjects.filter(p=>p.status==="Active").length} icon="zap" color="emerald"/>
        <StatCard label="Team Members" value={devUsers.length} icon="users" color="sky"/>
        <StatCard label="Seats Used" value={`${developer.usedSeats}/${developer.seats}`} icon="key" color="purple"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Performers */}
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm flex items-center gap-2 ${tc(dark,"text-white","text-slate-800")}`}><Icon name="award" size={15}/>Top Performers</h3>
          {userPerf.length===0 ? <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>No team members yet.</p> : userPerf.slice(0,5).map(({u,uProjects,uProposals,uInvoices,revenue,score},i)=>(
            <div key={u.id} className={`rounded-xl p-3 mb-2 ${tc(dark,"bg-slate-800/40","bg-slate-50")}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`text-xs font-bold w-4 ${tc(dark,"text-slate-500","text-slate-400")}`}>{i+1}</div>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${tc(dark,"bg-slate-600","bg-amber-500")}`}>{u.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold truncate ${tc(dark,"text-white","text-slate-800")}`}>{u.name}</div>
                  <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{uProjects.length} proj · {uProposals.length} prop · {fmtINR(revenue)}</div>
                </div>
                <div className="text-amber-400 font-bold text-xs">{score}pts</div>
              </div>
              <div className={`w-full h-1.5 rounded-full ${tc(dark,"bg-slate-700","bg-slate-200")}`}>
                <div className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-400" style={{width:`${(score/maxScore)*100}%`}}/>
              </div>
            </div>
          ))}
        </div>

        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Recent Projects</h3>
          {devProjects.length===0 ? <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>No projects yet.</p> : devProjects.slice(0,5).map(p=>(
            <div key={p.id} className={`flex items-center justify-between py-2 border-b last:border-0 ${tc(dark,"border-slate-700/30","border-slate-100")}`}>
              <div><div className={`text-sm font-medium ${tc(dark,"text-white","text-slate-800")}`}>{p.customerName}</div><div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{p.projectSize} kW · {p.projectType}</div></div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.status,dark)}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// ============================================================
// SOLARPRO v3 - PART 5: SUPER ADMIN PAGES
// ============================================================

// ── DEVELOPERS PAGE ───────────────────────────────────────────
const DevelopersPage = ({ developers, setDevelopers, users, setUsers, invoices, setInvoices }) => {
  const { dark } = useTheme();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editDev, setEditDev] = useState(null);
  const [viewDev, setViewDev] = useState(null);
  const [showInvForm, setShowInvForm] = useState(null); // developer for quick invoice

  const blank = { companyName:"",email:"",phone:"",address:"",website:"",seats:5,plan:"Starter",planDuration:"Monthly",subscriptionStart:TODAY,subscriptionEnd:addMonths(TODAY,1),logo:null,electricityPrice:8.5,solarGenerationFactor:1350,costPerKW:50000,bankDetails:"",terms:"",paymentTerms:"",customerScope:"",companyScope:"",gstIn:"",adminName:"",adminPassword:"",permissions:[] };
  const [form, setForm] = useState(blank);
  const F = (k,v) => setForm(f=>({...f,[k]:v}));

  const updateEnd = (start,dur) => F("subscriptionEnd", addMonths(start||form.subscriptionStart, PLAN_DURATIONS[dur]||1));

  const filtered = developers.filter(d=>d.companyName.toLowerCase().includes(search.toLowerCase())||d.email.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    if (editDev) {
      setDevelopers(ds=>ds.map(d=>d.id===editDev.id?{...d,...form}:d));
      // Also update the dev admin user's email/name if changed
      if (form.email !== editDev.email) setUsers(us=>us.map(u=>u.developerId===editDev.id&&u.role===ROLES.DEV_ADMIN?{...u,email:form.email}:u));
    } else {
      const newId=`d${Date.now()}`;
      setDevelopers(ds=>[...ds,{...form,id:newId,active:true,paused:false,usedSeats:0,createdAt:TODAY}]);
      if (form.adminName&&form.adminPassword) setUsers(us=>[...us,{id:`u${Date.now()}`,email:form.email,password:form.adminPassword,name:form.adminName,role:ROLES.DEV_ADMIN,developerId:newId,active:true,paused:false,permissions:form.permissions||[],createdAt:TODAY,phone:form.phone}]);
    }
    setShowForm(false); setEditDev(null); setForm(blank);
  };

  const togglePause  = dev => setDevelopers(ds=>ds.map(d=>d.id===dev.id?{...d,paused:!d.paused}:d));
  const toggleActive = dev => setDevelopers(ds=>ds.map(d=>d.id===dev.id?{...d,active:!d.active}:d));
  const openEdit     = dev => { setForm({...dev,adminName:"",adminPassword:""}); setEditDev(dev); setShowForm(true); };

  const genPlatformInvoice = (dev) => {
    const inv = { id:`inv${Date.now()}`, type:"platform", developerId:dev.id, amount:PLAN_PRICES[dev.plan]||4999, status:"Pending", date:TODAY, plan:dev.plan, planDuration:dev.planDuration, customerName:dev.companyName, customerAddress:dev.address, customerPhone:dev.phone, customerEmail:dev.email, items:[{name:`${dev.plan} Plan — ${dev.planDuration}`,qty:1,price:PLAN_PRICES[dev.plan]||4999,gst:18}], notes:"" };
    setInvoices(is=>[...is,inv]);
  };

  const DevCardRow = ({label,value}) => (
    <div className={`text-xs ${tc(dark,"bg-slate-800/40","bg-slate-50")} rounded-lg p-1.5`}>
      <span className={tc(dark,"text-slate-500","text-slate-400")}>{label}: </span>
      <span className={`font-medium ${tc(dark,"text-white","text-slate-700")}`}>{value||"—"}</span>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div><h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>Developer Accounts</h1><p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>Manage solar company accounts</p></div>
        <Btn onClick={()=>{setForm(blank);setEditDev(null);setShowForm(true);}}><Icon name="plus" size={15}/>New Developer</Btn>
      </div>
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search by company name or email…"/></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(dev=>{
          const days = daysUntil(dev.subscriptionEnd);
          return (
          <div key={dev.id} className={`border rounded-xl p-4 transition-colors ${tc(dark,"bg-[#0c1929] border-slate-700/50 hover:border-slate-600","bg-white border-slate-200 hover:border-slate-300 shadow-sm")}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {dev.logo?<img src={dev.logo} alt="logo" className="w-10 h-10 rounded-lg object-cover border border-slate-200"/>:<div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold text-white ${tc(dark,"bg-slate-700","bg-amber-500")}`}>{dev.companyName.charAt(0)}</div>}
                <div><h3 className={`font-bold ${tc(dark,"text-white","text-slate-800")}`}>{dev.companyName}</h3><p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{dev.email}</p></div>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(dev.paused?"Paused":dev.active?"Active":"Inactive",dark)}`}>{dev.paused?"Paused":dev.active?"Active":"Inactive"}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${tc(dark,"bg-slate-700 text-slate-300","bg-slate-100 text-slate-600")}`}>{dev.plan}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              <DevCardRow label="Seats" value={`${dev.usedSeats}/${dev.seats}`}/>
              <DevCardRow label="Duration" value={dev.planDuration}/>
              <DevCardRow label="Start" value={fmtDate(dev.subscriptionStart)}/>
              <DevCardRow label="End" value={fmtDate(dev.subscriptionEnd)}/>
              {days<=15&&days>0&&<div className="col-span-2 text-xs text-amber-400 font-medium bg-amber-500/10 rounded-lg p-1.5 text-center">⏰ Expires in {days} days</div>}
              {days<=0&&<div className="col-span-2 text-xs text-red-400 font-medium bg-red-500/10 rounded-lg p-1.5 text-center">⚠ Subscription Expired</div>}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>openEdit(dev)}><Icon name="edit" size={13}/>Edit</Btn>
              <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>setViewDev(dev)}><Icon name="eye" size={13}/>View</Btn>
              <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>togglePause(dev)}>{dev.paused?<><Icon name="play" size={13}/>Resume</>:<><Icon name="pause" size={13}/>Pause</>}</Btn>
              <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>toggleActive(dev)}>{dev.active?"Deactivate":"Activate"}</Btn>
              <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>genPlatformInvoice(dev)}><Icon name="invoice" size={13}/>Invoice</Btn>
            </div>
          </div>
          );
        })}
      </div>

      {/* ADD / EDIT FORM */}
      {showForm&&(
        <Modal title={editDev?`Edit: ${editDev.companyName}`:"New Developer Account"} onClose={()=>{setShowForm(false);setEditDev(null);}} wide>
          <LogoUploader value={form.logo} onChange={v=>F("logo",v)}/>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company Name" value={form.companyName} onChange={v=>F("companyName",v)} required/>
            <Field label="Email" type="email" value={form.email} onChange={v=>F("email",v)} required/>
            <Field label="Phone" value={form.phone} onChange={v=>F("phone",v)}/>
            <Field label="Website" value={form.website} onChange={v=>F("website",v)}/>
            <Field label="GSTIN" value={form.gstIn||""} onChange={v=>F("gstIn",v)} placeholder="22AAAAA0000A1Z5"/>
            <Field label="Plan" type="select" value={form.plan} onChange={v=>F("plan",v)} options={Object.keys(PLAN_PRICES).map(p=>({value:p,label:`${p} — ${fmtINR(PLAN_PRICES[p])}/mo`}))}/>
            <Field label="User Seats" type="number" value={form.seats} onChange={v=>F("seats",parseInt(v)||0)}/>
            <Field label="Plan Duration" type="select" value={form.planDuration} onChange={v=>{F("planDuration",v);updateEnd(form.subscriptionStart,v);}} options={Object.keys(PLAN_DURATIONS)}/>
            <Field label="Subscription Start" type="date" value={form.subscriptionStart} onChange={v=>{F("subscriptionStart",v);updateEnd(v,form.planDuration);}}/>
            <Field label="Subscription End" type="date" value={form.subscriptionEnd} onChange={v=>F("subscriptionEnd",v)} hint="Auto-calculated, override if needed"/>
            <Field label="Electricity Price (₹/kWh)" type="number" value={form.electricityPrice} onChange={v=>F("electricityPrice",parseFloat(v)||0)}/>
            <Field label="Solar Gen Factor (kWh/kWp/yr)" type="number" value={form.solarGenerationFactor} onChange={v=>F("solarGenerationFactor",parseInt(v)||0)}/>
            <Field label="Cost per kW (₹)" type="number" value={form.costPerKW} onChange={v=>F("costPerKW",parseInt(v)||0)}/>
          </div>
          <Field label="Address" type="textarea" rows={2} value={form.address} onChange={v=>F("address",v)}/>
          <Field label="Payment Terms" type="textarea" rows={3} value={form.paymentTerms} onChange={v=>F("paymentTerms",v)} placeholder="e.g. 50% advance,&#10;25% on delivery,&#10;25% on completion"/>
          <Field label="Customer Scope" type="textarea" rows={2} value={form.customerScope} onChange={v=>F("customerScope",v)}/>
          <Field label="Company Scope" type="textarea" rows={2} value={form.companyScope} onChange={v=>F("companyScope",v)}/>
          <Field label="Bank Details" type="textarea" rows={3} value={form.bankDetails} onChange={v=>F("bankDetails",v)}/>
          <Field label="Terms & Conditions" type="textarea" rows={2} value={form.terms} onChange={v=>F("terms",v)}/>
          {!editDev&&(
            <div className={`rounded-xl p-4 mt-1 mb-3 ${tc(dark,"bg-amber-500/10 border border-amber-500/20","bg-amber-50 border border-amber-200")}`}>
              <p className="text-amber-400 text-sm font-bold mb-3 flex items-center gap-2"><Icon name="key" size={14}/>Admin Account (required)</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Admin Full Name" value={form.adminName} onChange={v=>F("adminName",v)} required/>
                <Field label="Admin Password" type="password" value={form.adminPassword} onChange={v=>F("adminPassword",v)} required hint="Set manually — write it down!"/>
              </div>
            </div>
          )}
          <PermissionsPicker value={form.permissions||[]} onChange={v=>F("permissions",v)} label="Default Permissions for Users"/>
          <div className="flex gap-3 pt-2">
            <Btn onClick={save} className="flex-1" disabled={!form.companyName||!form.email}>Save Developer</Btn>
            <Btn variant="secondary" onClick={()=>{setShowForm(false);setEditDev(null);}}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* VIEW DETAIL MODAL */}
      {viewDev&&(
        <Modal title={viewDev.companyName} onClose={()=>setViewDev(null)} wide>
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-700/50">
            {viewDev.logo?<img src={viewDev.logo} alt="logo" className="w-16 h-16 rounded-xl object-cover"/>:<div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black text-white ${tc(dark,"bg-slate-700","bg-amber-500")}`}>{viewDev.companyName.charAt(0)}</div>}
            <div><h2 className={`text-lg font-bold ${tc(dark,"text-white","text-slate-800")}`}>{viewDev.companyName}</h2><p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>{viewDev.email} · {viewDev.phone}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            {[["Plan",viewDev.plan],["Duration",viewDev.planDuration],["Seats",`${viewDev.usedSeats}/${viewDev.seats}`],["Sub Start",fmtDate(viewDev.subscriptionStart)],["Sub End",fmtDate(viewDev.subscriptionEnd)],["GSTIN",viewDev.gstIn||"—"],["Elec Price",`₹${viewDev.electricityPrice}/kWh`],["Cost/kW",fmtINR(viewDev.costPerKW)]].map(([k,v])=>(
              <div key={k} className={`rounded-lg p-2.5 ${tc(dark,"bg-slate-800/50","bg-slate-50")}`}><div className={`text-xs mb-0.5 ${tc(dark,"text-slate-400","text-slate-500")}`}>{k}</div><div className={`font-medium text-sm ${tc(dark,"text-white","text-slate-800")}`}>{v}</div></div>
            ))}
          </div>
          {viewDev.paymentTerms&&<div className={`rounded-lg p-3 mb-2 ${tc(dark,"bg-slate-800/50","bg-slate-50")}`}><div className={`text-xs mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>Payment Terms</div><pre className={`text-sm whitespace-pre-wrap ${tc(dark,"text-white","text-slate-800")}`}>{viewDev.paymentTerms}</pre></div>}
          {viewDev.customerScope&&<div className={`rounded-lg p-3 mb-2 ${tc(dark,"bg-slate-800/50","bg-slate-50")}`}><div className={`text-xs mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>Customer Scope</div><p className={`text-sm ${tc(dark,"text-white","text-slate-800")}`}>{viewDev.customerScope}</p></div>}
          {viewDev.companyScope&&<div className={`rounded-lg p-3 mb-2 ${tc(dark,"bg-slate-800/50","bg-slate-50")}`}><div className={`text-xs mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>Company Scope</div><p className={`text-sm ${tc(dark,"text-white","text-slate-800")}`}>{viewDev.companyScope}</p></div>}
          {/* Team table */}
          <TeamDetailInModal devId={viewDev.id} users={users} setUsers={setUsers}/>
        </Modal>
      )}
    </div>
  );
};

// Team detail inside developer view modal (Super Admin can activate/deactivate)
const TeamDetailInModal = ({ devId, users, setUsers }) => {
  const { dark } = useTheme();
  const devUsers = users.filter(u=>u.developerId===devId && u.role!==ROLES.SUPER_ADMIN);
  if (!devUsers.length) return <p className={`text-sm mt-4 ${tc(dark,"text-slate-400","text-slate-500")}`}>No team members.</p>;
  const toggleActive = u => setUsers(us=>us.map(x=>x.id===u.id?{...x,active:!x.active}:x));
  const togglePause  = u => setUsers(us=>us.map(x=>x.id===u.id?{...x,paused:!x.paused}:x));
  return (
    <div className="mt-4">
      <h4 className={`text-sm font-bold mb-2 ${tc(dark,"text-white","text-slate-800")}`}>Team Members ({devUsers.length})</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className={`border-b ${tc(dark,"border-slate-700 bg-slate-800/40","border-slate-200 bg-slate-50")}`}>
            {["Name","Phone","Role","Status","Actions"].map(h=><th key={h} className={`text-left px-3 py-2 font-semibold ${tc(dark,"text-slate-400","text-slate-500")}`}>{h}</th>)}
          </tr></thead>
          <tbody>
            {devUsers.map(u=>(
              <tr key={u.id} className={`border-b ${tc(dark,"border-slate-700/20 hover:bg-slate-800/20","border-slate-100 hover:bg-slate-50")}`}>
                <td className={`px-3 py-2 font-medium ${tc(dark,"text-white","text-slate-800")}`}>{u.name}</td>
                <td className={`px-3 py-2 ${tc(dark,"text-slate-400","text-slate-500")}`}>{u.phone||"—"}</td>
                <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded ${tc(dark,"bg-slate-700 text-slate-300","bg-slate-100 text-slate-600")} capitalize`}>{u.role.replace("_"," ")}</span></td>
                <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(u.paused?"Paused":u.active?"Active":"Deactivated",dark)}`}>{u.paused?"Paused":u.active?"Active":"Deactivated"}</span></td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>toggleActive(u)}>{u.active?"Deactivate":"Activate"}</Btn>
                    <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>togglePause(u)}>{u.paused?<Icon name="play" size={12}/>:<Icon name="pause" size={12}/>}</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── SUPER ADMIN INVOICES PAGE ──────────────────────────────────
const SuperAdminInvoicesPage = ({ invoices, setInvoices, developers, projects, users }) => {
  const { dark } = useTheme();
  const [viewInv, setViewInv] = useState(null);
  const platformInvoices = invoices; // show all

  const getDev = id => developers.find(d=>d.id===id);
  const getCustomer = inv => ({ name: inv.customerName, address: inv.customerAddress, phone: inv.customerPhone, email: inv.customerEmail });

  return (
    <div>
      <h1 className={`text-xl font-bold mb-1 ${tc(dark,"text-white","text-slate-800")}`}>All Invoices</h1>
      <p className={`text-sm mb-5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Platform subscription and project invoices</p>
      <InvoiceListView invoices={platformInvoices} developers={developers} projects={projects} users={users}
        onView={inv=>setViewInv(inv)}
        onPrint={inv=>printInvoice(inv, getDev(inv.developerId), getCustomer(inv))}
        onMarkPaid={id=>setInvoices(is=>is.map(i=>i.id===id?{...i,status:"Paid"}:i))}
        currentUser={null}/>
      {viewInv&&(
        <Modal title={`Invoice — ${viewInv.id.toUpperCase()}`} onClose={()=>setViewInv(null)} wide>
          <InvoicePreviewContent inv={viewInv} developer={getDev(viewInv.developerId)} customer={getCustomer(viewInv)}/>
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
            <Btn className="flex-1" onClick={()=>printInvoice(viewInv,getDev(viewInv.developerId),getCustomer(viewInv))}><Icon name="print" size={15}/>Download / Print PDF</Btn>
            <Btn variant="secondary" onClick={()=>setViewInv(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── CREATE INVOICE PAGE (Super Admin) ─────────────────────────
const CreateInvoicePage = ({ developers, users, projects, invoices, setInvoices }) => {
  const { dark } = useTheme();
  const [selectedDev, setSelectedDev] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [items, setItems] = useState([{name:"",qty:1,price:0,gst:18}]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Pending");
  const [preview, setPreview] = useState(null);

  const devUsers = users.filter(u=>u.developerId===selectedDev && u.role!==ROLES.SUPER_ADMIN);
  const targetUser = users.find(u=>u.id===selectedUser);
  const dev = developers.find(d=>d.id===selectedDev);

  const generate = () => {
    const {total}=calcInvoiceTotal(items);
    const inv = {
      id:`INV-${Date.now().toString().slice(-6)}`,
      type:"platform", developerId:selectedDev, userId:selectedUser,
      amount:total, status, date:TODAY,
      customerName: targetUser?.name || dev?.companyName || "",
      customerAddress: dev?.address || "",
      customerPhone: targetUser?.phone || dev?.phone || "",
      customerEmail: targetUser?.email || dev?.email || "",
      items:[...items], notes,
    };
    setInvoices(is=>[...is,inv]);
    setPreview(inv);
  };

  return (
    <div>
      <h1 className={`text-xl font-bold mb-1 ${tc(dark,"text-white","text-slate-800")}`}>Create Invoice</h1>
      <p className={`text-sm mb-5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Generate a new invoice for a developer or user</p>
      <div className={`border rounded-xl p-5 mb-5 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Select Developer" type="select" value={selectedDev} onChange={v=>{setSelectedDev(v);setSelectedUser("");}}
            options={[{value:"",label:"— Select Developer —"},...developers.map(d=>({value:d.id,label:d.companyName}))]}/>
          {selectedDev&&(
            <Field label="Select User (optional)" type="select" value={selectedUser} onChange={setSelectedUser}
              options={[{value:"",label:"— Developer Account —"},...devUsers.map(u=>({value:u.id,label:u.name}))]}/>
          )}
          <Field label="Status" type="select" value={status} onChange={setStatus} options={["Pending","Paid","Sent","Draft"]}/>
        </div>
        <InvoiceItemEditor items={items} setItems={setItems}/>
        <Field label="Notes" type="textarea" rows={2} value={notes} onChange={setNotes} placeholder="Additional notes for this invoice…"/>
        <Btn onClick={generate} disabled={!selectedDev||!items.length||!items[0].name}><Icon name="zap" size={15}/>Generate Invoice</Btn>
      </div>

      {preview&&(
        <Modal title="Invoice Generated" onClose={()=>setPreview(null)} wide>
          <InvoicePreviewContent inv={preview} developer={dev} customer={{name:preview.customerName,address:preview.customerAddress,phone:preview.customerPhone,email:preview.customerEmail}}/>
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
            <Btn className="flex-1" onClick={()=>printInvoice(preview,dev,{name:preview.customerName})}><Icon name="print" size={15}/>Download / Print PDF</Btn>
            <Btn variant="secondary" onClick={()=>setPreview(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Shared invoice preview content (in-app dark/light)
const InvoicePreviewContent = ({ inv, developer, customer }) => {
  const { dark } = useTheme();
  const { net, gst, total } = calcInvoiceTotal(inv.items||[]);
  return (
    <div>
      <div className={`flex items-start justify-between mb-4 pb-4 border-b ${tc(dark,"border-slate-700","border-slate-200")}`}>
        <div>
          {developer?.logo&&<img src={developer.logo} alt="logo" className="h-10 mb-2 rounded"/>}
          <div className={`font-black text-lg ${tc(dark,"text-white","text-slate-800")}`}>{developer?.companyName||"Company"}</div>
          <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{developer?.address}</div>
          <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{developer?.phone} · {developer?.email}</div>
        </div>
        <div className="text-right">
          <div className="text-amber-400 font-black text-lg">INVOICE</div>
          <div className={`text-xs mt-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>#{inv.id.toUpperCase()}</div>
          <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{fmtDate(inv.date)}</div>
        </div>
      </div>
      <div className={`rounded-xl p-3 mb-4 ${tc(dark,"bg-slate-800/40","bg-slate-50")}`}>
        <div className={`text-xs mb-1 font-bold ${tc(dark,"text-slate-400","text-slate-500")}`}>BILLED TO</div>
        <div className={`text-sm font-bold ${tc(dark,"text-white","text-slate-800")}`}>{customer?.name||inv.customerName}</div>
        <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{customer?.address||inv.customerAddress}</div>
        <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{customer?.phone||inv.customerPhone} · {customer?.email||inv.customerEmail}</div>
      </div>
      <table className="w-full text-xs mb-4">
        <thead><tr className={`border-b-2 ${tc(dark,"border-amber-500/50","border-amber-300")}`}>
          {["#","Description","Price","Qty","GST","Subtotal","Total+GST"].map(h=><th key={h} className={`py-2 px-1.5 text-left font-bold ${tc(dark,"text-amber-400","text-amber-600")}`}>{h}</th>)}
        </tr></thead>
        <tbody>
          {(inv.items||[]).map((item,i)=>{
            const sub=item.price*item.qty, vatAmt=sub*(item.gst||0)/100;
            return <tr key={i} className={`border-b ${tc(dark,"border-slate-700/30","border-slate-100")}`}>
              <td className="py-2 px-1.5">{i+1}</td>
              <td className={`py-2 px-1.5 ${tc(dark,"text-white","text-slate-800")}`}>{item.name}</td>
              <td className="py-2 px-1.5">{fmtINR(item.price)}</td>
              <td className="py-2 px-1.5 text-center">{item.qty}</td>
              <td className="py-2 px-1.5 text-center">{item.gst||0}%</td>
              <td className="py-2 px-1.5">{fmtINR(sub)}</td>
              <td className={`py-2 px-1.5 font-bold ${tc(dark,"text-white","text-slate-800")}`}>{fmtINR(sub+vatAmt)}</td>
            </tr>;
          })}
        </tbody>
      </table>
      <div className="flex justify-end mb-4">
        <div className={`rounded-xl overflow-hidden min-w-[200px] ${tc(dark,"border border-slate-700","border border-slate-200")}`}>
          <div className={`flex justify-between px-4 py-2 border-b ${tc(dark,"border-slate-700","border-slate-200")}`}><span className={tc(dark,"text-slate-400","text-slate-500")}>Net:</span><span className={`font-medium ${tc(dark,"text-white","text-slate-800")}`}>{fmtINR(net)}</span></div>
          <div className={`flex justify-between px-4 py-2 border-b ${tc(dark,"border-slate-700","border-slate-200")}`}><span className={tc(dark,"text-slate-400","text-slate-500")}>GST:</span><span className={`font-medium ${tc(dark,"text-white","text-slate-800")}`}>{fmtINR(gst)}</span></div>
          <div className="flex justify-between px-4 py-2.5 bg-amber-500"><span className="text-slate-900 font-black">TOTAL:</span><span className="text-slate-900 font-black">{fmtINR(total)}</span></div>
        </div>
      </div>
      {developer?.bankDetails&&<div className={`rounded-lg p-3 mb-3 ${tc(dark,"bg-slate-800/50","bg-slate-50")}`}><p className="text-amber-400 text-xs font-bold mb-1">PAYMENT DETAILS</p><pre className={`text-xs whitespace-pre-wrap ${tc(dark,"text-slate-300","text-slate-600")}`}>{developer.bankDetails}</pre></div>}
      {inv.notes&&<div className={`rounded-lg p-3 ${tc(dark,"bg-slate-800/50","bg-slate-50")}`}><p className="text-amber-400 text-xs font-bold mb-1">NOTES</p><p className={`text-xs italic ${tc(dark,"text-slate-300","text-slate-600")}`}>{inv.notes}</p></div>}
    </div>
  );
};
// ============================================================
// SOLARPRO v3 - PART 6: DEV ADMIN & USER PAGES
// ============================================================

// ── USERS / TEAM PAGE (used by both Super Admin & Dev Admin) ──
const UsersPage = ({ users, setUsers, currentUser, developers }) => {
  const { dark } = useTheme();
  const [search, setSearch]   = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const blank = { name:"", email:"", password:"", phone:"", role:ROLES.USER, permissions:[], active:true, paused:false };
  const [form, setForm] = useState(blank);
  const F = (k,v) => setForm(f=>({...f,[k]:v}));

  const isSuperAdmin = currentUser.role === ROLES.SUPER_ADMIN;

  const visibleUsers = isSuperAdmin
    ? users.filter(u => u.role !== ROLES.SUPER_ADMIN)
    : users.filter(u => u.developerId === currentUser.developerId && u.id !== currentUser.id);

  const filtered = visibleUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const save = () => {
    if (editUser) {
      setUsers(us => us.map(u => u.id === editUser.id ? { ...u, ...form } : u));
    } else {
      setUsers(us => [...us, {
        ...form,
        id: `u${Date.now()}`,
        developerId: currentUser.role === ROLES.DEV_ADMIN ? currentUser.developerId : null,
        createdAt: TODAY
      }]);
    }
    setShowAdd(false); setEditUser(null); setForm(blank);
  };

  const openEdit = (u) => { setForm({ ...u }); setEditUser(u); setShowAdd(true); };
  const toggleActive = (u) => setUsers(us => us.map(x => x.id===u.id ? {...x,active:!x.active} : x));
  const togglePause  = (u) => setUsers(us => us.map(x => x.id===u.id ? {...x,paused:!x.paused} : x));

  const devName = (devId) => developers?.find(d=>d.id===devId)?.companyName || "—";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>{isSuperAdmin?"All Users":"Team Members"}</h1>
          <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>{filtered.length} account{filtered.length!==1?"s":""}</p>
        </div>
        <Btn onClick={()=>{setForm(blank);setEditUser(null);setShowAdd(true);}}><Icon name="plus" size={15}/>Add User</Btn>
      </div>
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…"/></div>

      <div className={`border rounded-xl overflow-x-auto ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
        <table className="w-full text-sm">
          <thead><tr className={`border-b ${tc(dark,"border-slate-700 bg-slate-800/30","border-slate-200 bg-slate-50")}`}>
            {[isSuperAdmin&&"Company","Name","Email","Phone","Role","Status","Actions"].filter(Boolean).map(h=>(
              <th key={h} className={`text-left px-4 py-3 font-medium text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(u=>(
              <tr key={u.id} className={`border-b transition-colors ${tc(dark,"border-slate-700/30 hover:bg-slate-800/20","border-slate-100 hover:bg-slate-50")}`}>
                {isSuperAdmin&&<td className={`px-4 py-3 text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{devName(u.developerId)}</td>}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${tc(dark,"bg-slate-700","bg-amber-500")}`}>{u.name.charAt(0)}</div>
                    <span className={`font-medium ${tc(dark,"text-white","text-slate-800")}`}>{u.name}</span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{u.email}</td>
                <td className={`px-4 py-3 text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{u.phone||"—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${tc(dark,"bg-slate-700 text-slate-300","bg-slate-100 text-slate-600")}`}>{u.role.replace("_"," ")}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(u.paused?"Paused":u.active?"Active":"Deactivated",dark)}`}>{u.paused?"Paused":u.active?"Active":"Deactivated"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>openEdit(u)}><Icon name="edit" size={12}/></Btn>
                    <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>toggleActive(u)} title={u.active?"Deactivate":"Activate"}>
                      {u.active ? <Icon name="x" size={12}/> : <Icon name="check" size={12}/>}
                      {u.active?"Deactivate":"Activate"}
                    </Btn>
                    <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>togglePause(u)}>
                      {u.paused?<><Icon name="play" size={12}/>Resume</>:<><Icon name="pause" size={12}/>Pause</>}
                    </Btn>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length&&<tr><td colSpan="7" className={`text-center py-10 text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>No users found.</td></tr>}
          </tbody>
        </table>
      </div>

      {showAdd&&(
        <Modal title={editUser?"Edit User":"Add User"} onClose={()=>{setShowAdd(false);setEditUser(null);}}>
          <Field label="Full Name" value={form.name} onChange={v=>F("name",v)} required/>
          <Field label="Email" type="email" value={form.email} onChange={v=>F("email",v)} required/>
          <Field label="Phone" value={form.phone} onChange={v=>F("phone",v)}/>
          <Field label="Password" type="password" value={form.password} onChange={v=>F("password",v)}
            hint={editUser?"Leave blank to keep existing password":"Set a strong password — write it down!"} required={!editUser}/>
          <Field label="Role" type="select" value={form.role} onChange={v=>F("role",v)}
            options={[{value:ROLES.USER,label:"User"},{value:ROLES.DEV_ADMIN,label:"Dev Admin"}]}/>
          <PermissionsPicker value={form.permissions||[]} onChange={v=>F("permissions",v)}/>
          <div className="flex gap-3 mt-2">
            <Btn onClick={save} className="flex-1" disabled={!form.name||!form.email||(!editUser&&!form.password)}>
              {editUser?"Save Changes":"Add User"}
            </Btn>
            <Btn variant="secondary" onClick={()=>{setShowAdd(false);setEditUser(null);}}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── TEMPLATES PAGE ─────────────────────────────────────────────
const TemplatesPage = ({ templates, setTemplates, developers, currentUser }) => {
  const { dark } = useTheme();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", description:"", assignedTo:[], variables:[] });
  const isSA = currentUser.role === ROLES.SUPER_ADMIN;
  const myTemplates = isSA ? templates : templates.filter(t=>t.assignedTo.includes(currentUser.developerId));

  const save = () => {
    setTemplates(ts=>[...ts,{...form,id:`t${Date.now()}`,createdAt:TODAY}]);
    setShowAdd(false); setForm({name:"",description:"",assignedTo:[],variables:[]});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>Proposal Templates</h1>
        {isSA&&<Btn onClick={()=>setShowAdd(true)}><Icon name="plus" size={15}/>New Template</Btn>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {myTemplates.map(t=>{
          const assignedDevs = developers.filter(d=>t.assignedTo.includes(d.id));
          return (
            <div key={t.id} className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0"><Icon name="template" size={18}/></div>
                <div><h3 className={`font-bold ${tc(dark,"text-white","text-slate-800")}`}>{t.name}</h3><p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{t.description}</p></div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">{t.variables.map(v=><span key={v} className={`text-xs px-1.5 py-0.5 rounded font-mono ${tc(dark,"bg-slate-700/50 text-slate-400","bg-slate-100 text-slate-600")}`}>{"{{"+v+"}}"}</span>)}</div>
              <div className={`text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>Assigned: {assignedDevs.length ? assignedDevs.map(d=>d.companyName).join(", ") : "None"}</div>
            </div>
          );
        })}
      </div>
      {showAdd&&(
        <Modal title="New Template" onClose={()=>setShowAdd(false)} wide>
          <Field label="Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} required/>
          <Field label="Description" type="textarea" rows={2} value={form.description} onChange={v=>setForm(f=>({...f,description:v}))}/>
          <TemplateAssignDropdown developers={developers} assignedTo={form.assignedTo} onChange={v=>setForm(f=>({...f,assignedTo:v}))}/>
          <div className="flex gap-3 mt-2">
            <Btn onClick={save} className="flex-1" disabled={!form.name}>Create Template</Btn>
            <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── SETTINGS PAGE (Dev Admin) ─────────────────────────────────
const SettingsPage = ({ developer, setDevelopers }) => {
  const { dark } = useTheme();
  const [form, setForm] = useState({...developer});
  const F = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = () => { setDevelopers(ds=>ds.map(d=>d.id===developer.id?{...d,...form}:d)); alert("Settings saved!"); };

  return (
    <div>
      <h1 className={`text-xl font-bold mb-1 ${tc(dark,"text-white","text-slate-800")}`}>Account Settings</h1>
      <p className={`text-sm mb-5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Manage your company profile and solar variables</p>
      <LogoUploader value={form.logo} onChange={v=>F("logo",v)}/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Company Profile</h3>
          <Field label="Company Name" value={form.companyName} onChange={v=>F("companyName",v)}/>
          <Field label="Email" type="email" value={form.email} onChange={v=>F("email",v)}/>
          <Field label="Phone" value={form.phone} onChange={v=>F("phone",v)}/>
          <Field label="Website" value={form.website||""} onChange={v=>F("website",v)}/>
          <Field label="GSTIN" value={form.gstIn||""} onChange={v=>F("gstIn",v)}/>
          <Field label="Address" type="textarea" rows={2} value={form.address} onChange={v=>F("address",v)}/>
        </div>
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Solar Variables</h3>
          <Field label="Electricity Price (₹/kWh)" type="number" value={form.electricityPrice} onChange={v=>F("electricityPrice",parseFloat(v)||0)}/>
          <Field label="Solar Gen Factor (kWh/kWp/yr)" type="number" value={form.solarGenerationFactor} onChange={v=>F("solarGenerationFactor",parseInt(v)||0)}/>
          <Field label="Cost per kW (₹)" type="number" value={form.costPerKW} onChange={v=>F("costPerKW",parseInt(v)||0)}/>
        </div>
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Business Details</h3>
          <Field label="Payment Terms" type="textarea" rows={4} value={form.paymentTerms||""} onChange={v=>F("paymentTerms",v)} placeholder={"50% advance\n25% on delivery\n25% on completion"}/>
          <Field label="Customer Scope" type="textarea" rows={2} value={form.customerScope||""} onChange={v=>F("customerScope",v)}/>
          <Field label="Company Scope" type="textarea" rows={2} value={form.companyScope||""} onChange={v=>F("companyScope",v)}/>
        </div>
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Finance & Legal</h3>
          <Field label="Bank Details" type="textarea" rows={4} value={form.bankDetails||""} onChange={v=>F("bankDetails",v)}/>
          <Field label="Terms & Conditions" type="textarea" rows={3} value={form.terms||""} onChange={v=>F("terms",v)}/>
        </div>
      </div>
      <div className="mt-4"><Btn onClick={save} size="lg"><Icon name="check" size={16}/>Save All Settings</Btn></div>
    </div>
  );
};

// ── PROJECTS PAGE ─────────────────────────────────────────────
const ProjectsPage = ({ projects, setProjects, currentUser, setCurrentProjectId, developer }) => {
  const { dark } = useTheme();
  const [search, setSearch]   = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const blank = { customerName:"",customerPhone:"",customerEmail:"",customerAddress:"",projectSize:"",projectType:"Residential",status:"Active" };
  const [form, setForm] = useState(blank);

  const isLocked = developer && (developer.paused || (developer.subscriptionEnd && new Date(developer.subscriptionEnd)<new Date()));

  const myProjects = projects.filter(p=>{
    const mine = currentUser.role===ROLES.DEV_ADMIN ? p.developerId===currentUser.developerId : p.userId===currentUser.id || p.developerId===currentUser.developerId;
    const matchS = p.customerName.toLowerCase().includes(search.toLowerCase()) || (p.customerAddress||"").toLowerCase().includes(search.toLowerCase());
    const matchT = filterType==="All" || p.projectType===filterType;
    return mine && matchS && matchT;
  });

  const save = () => {
    setProjects(ps=>[...ps,{...form,id:`p${Date.now()}`,developerId:currentUser.developerId,userId:currentUser.id,createdAt:TODAY}]);
    setShowAdd(false); setForm(blank);
  };

  const typeColor = {Residential:"bg-sky-500/20 text-sky-300",Commercial:"bg-amber-500/20 text-amber-300",Industrial:"bg-purple-500/20 text-purple-300"};
  const typeColorL = {Residential:"bg-sky-100 text-sky-700",Commercial:"bg-amber-100 text-amber-700",Industrial:"bg-purple-100 text-purple-700"};

  if (isLocked) return <LockedPage developer={developer}/>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>Projects</h1>
          <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>{myProjects.length} projects</p>
        </div>
        <Btn onClick={()=>setShowAdd(true)}><Icon name="plus" size={15}/>New Project</Btn>
      </div>
      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search customer or address…"/></div>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} className={`border rounded-lg px-3 py-2 focus:outline-none text-sm ${tc(dark,"bg-[#0c1929] border-slate-700 text-white","bg-white border-slate-300 text-slate-800")}`}>
          {["All","Residential","Commercial","Industrial"].map(t=><option key={t}>{t}</option>)}
        </select>
      </div>
      {!myProjects.length ? (
        <div className={`text-center py-20 border rounded-xl ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${tc(dark,"bg-slate-800","bg-slate-100")}`}><Icon name="folder" size={24}/></div>
          <h3 className={`text-base font-bold mb-1 ${tc(dark,"text-white","text-slate-800")}`}>No projects yet</h3>
          <p className={`text-sm mb-4 ${tc(dark,"text-slate-400","text-slate-500")}`}>Create your first solar project</p>
          <Btn onClick={()=>setShowAdd(true)}><Icon name="plus" size={15}/>Create Project</Btn>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {myProjects.map(p=>(
            <button key={p.id} onClick={()=>setCurrentProjectId(p.id)} className={`border rounded-xl p-4 text-left transition-all group ${tc(dark,"bg-[#0c1929] border-slate-700/50 hover:border-amber-500/40 hover:bg-[#0f1f38]","bg-white border-slate-200 hover:border-amber-300 hover:shadow-md shadow-sm")}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400"><Icon name="zap" size={18}/></div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.status,dark)}`}>{p.status}</span>
              </div>
              <h3 className={`font-bold mb-0.5 ${tc(dark,"text-white","text-slate-800")}`}>{p.customerName}</h3>
              <p className={`text-xs mb-2 truncate ${tc(dark,"text-slate-400","text-slate-500")}`}>{p.customerAddress}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${tc(dark,typeColor[p.projectType]||"bg-slate-700 text-slate-300",typeColorL[p.projectType]||"bg-slate-100 text-slate-600")}`}>{p.projectType}</span>
                <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{p.projectSize} kW</span>
              </div>
              <div className={`mt-2 pt-2 border-t text-xs ${tc(dark,"border-slate-700/30 text-slate-500","border-slate-100 text-slate-400")}`}>{fmtDate(p.createdAt)}</div>
            </button>
          ))}
        </div>
      )}
      {showAdd&&(
        <Modal title="New Project" onClose={()=>setShowAdd(false)} wide>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Customer Name" value={form.customerName} onChange={v=>setForm(f=>({...f,customerName:v}))} required/>
            <Field label="Phone" value={form.customerPhone} onChange={v=>setForm(f=>({...f,customerPhone:v}))}/>
            <Field label="Email" type="email" value={form.customerEmail} onChange={v=>setForm(f=>({...f,customerEmail:v}))}/>
            <Field label="Project Size (kW)" type="number" value={form.projectSize} onChange={v=>setForm(f=>({...f,projectSize:parseFloat(v)||0}))} required/>
            <Field label="Type" type="select" value={form.projectType} onChange={v=>setForm(f=>({...f,projectType:v}))} options={["Residential","Commercial","Industrial"]}/>
            <Field label="Status" type="select" value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} options={["Active","Proposal Sent","Completed","Cancelled"]}/>
          </div>
          <Field label="Address" type="textarea" rows={2} value={form.customerAddress} onChange={v=>setForm(f=>({...f,customerAddress:v}))}/>
          <div className="flex gap-3 mt-2">
            <Btn onClick={save} className="flex-1" disabled={!form.customerName||!form.projectSize}>Create Project</Btn>
            <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── PROJECT INVOICES PAGE (Dev + User) ────────────────────────
const ProjectInvoicesPage = ({ invoices, setInvoices, projects, developer, currentUser }) => {
  const { dark } = useTheme();
  const [showCreate, setShowCreate] = useState(false);
  const [viewInv, setViewInv] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [items, setItems] = useState([{name:"",qty:1,price:0,gst:12}]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Pending");

  const myProjects = projects.filter(p =>
    currentUser.role===ROLES.DEV_ADMIN ? p.developerId===currentUser.developerId : p.userId===currentUser.id
  );
  const myInvoices = invoices.filter(i =>
    i.type==="project" && (
      currentUser.role===ROLES.DEV_ADMIN
        ? myProjects.some(p=>p.id===i.projectId)
        : i.userId===currentUser.id
    )
  );

  const selProject = myProjects.find(p=>p.id===selectedProject);

  // Auto-fill items from project when selected
  const onSelectProject = (pid) => {
    setSelectedProject(pid);
    const p = myProjects.find(x=>x.id===pid);
    if (p && developer) {
      const vars = calcSolar(p.projectSize, developer);
      setItems([{name:`${p.projectSize} kW ${p.projectType} Solar System`,qty:1,price:Math.round(vars.totalCost),gst:12}]);
    }
  };

  const generate = () => {
    if (!selectedProject) return;
    const p = myProjects.find(x=>x.id===selectedProject);
    const {total} = calcInvoiceTotal(items);
    const inv = {
      id:`INV-${Date.now().toString().slice(-6)}`,
      type:"project", developerId:developer.id,
      projectId:selectedProject, userId:currentUser.id,
      amount:total, status, date:TODAY,
      customerName:p?.customerName||"",
      customerAddress:p?.customerAddress||"",
      customerPhone:p?.customerPhone||"",
      customerEmail:p?.customerEmail||"",
      items:[...items], notes,
    };
    setInvoices(is=>[...is,inv]);
    setViewInv(inv); setShowCreate(false);
    setSelectedProject(""); setItems([{name:"",qty:1,price:0,gst:12}]); setNotes(""); setStatus("Pending");
  };

  const isLocked = developer && (developer.paused || (developer.subscriptionEnd && new Date(developer.subscriptionEnd)<new Date()));
  if (isLocked) return <LockedPage developer={developer}/>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>Invoices</h1>
          <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>{myInvoices.length} invoice{myInvoices.length!==1?"s":""}</p>
        </div>
        <Btn onClick={()=>setShowCreate(true)}><Icon name="plus" size={15}/>Create Invoice</Btn>
      </div>

      <InvoiceListView
        invoices={myInvoices}
        developers={[developer]}
        projects={myProjects}
        onView={inv=>setViewInv(inv)}
        onPrint={inv=>printInvoiceTemplid(inv,developer)}
        onMarkPaid={id=>setInvoices(is=>is.map(i=>i.id===id?{...i,status:"Paid"}:i))}
        currentUser={currentUser}
      />

      {/* Create Modal */}
      {showCreate&&(
        <Modal title="Create Invoice" onClose={()=>setShowCreate(false)} wide>
          <Field label="Select Project" type="select" value={selectedProject} onChange={onSelectProject}
            options={[{value:"",label:"— Select Project —"},...myProjects.map(p=>({value:p.id,label:`${p.customerName} — ${p.projectSize}kW`}))]}/>
          {selProject&&(
            <div className={`rounded-xl p-3 mb-4 text-xs ${tc(dark,"bg-slate-800/40","bg-slate-50")}`}>
              <div className="grid grid-cols-2 gap-1">
                {[["Customer",selProject.customerName],["Address",selProject.customerAddress],["Phone",selProject.customerPhone],["Email",selProject.customerEmail],["Size",`${selProject.projectSize} kW`],["Type",selProject.projectType]].map(([k,v])=>(
                  <div key={k}><span className={tc(dark,"text-slate-400","text-slate-500")}>{k}: </span><span className={`font-medium ${tc(dark,"text-white","text-slate-700")}`}>{v||"—"}</span></div>
                ))}
              </div>
            </div>
          )}
          <InvoiceItemEditor items={items} setItems={setItems}/>
          <Field label="Notes" type="textarea" rows={2} value={notes} onChange={setNotes} placeholder="Additional notes…"/>
          <Field label="Status" type="select" value={status} onChange={setStatus} options={["Pending","Sent","Paid","Draft"]}/>
          <div className="flex gap-3 mt-2">
            <Btn onClick={generate} className="flex-1" disabled={!selectedProject||!items.length||!items[0].name}><Icon name="zap" size={15}/>Generate Invoice</Btn>
            <Btn variant="secondary" onClick={()=>setShowCreate(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Preview Modal */}
      {viewInv&&(
        <Modal title={`Invoice — ${viewInv.id.toUpperCase()}`} onClose={()=>setViewInv(null)} wide>
          <InvoicePreviewContent inv={viewInv} developer={developer} customer={{name:viewInv.customerName,address:viewInv.customerAddress,phone:viewInv.customerPhone,email:viewInv.customerEmail}}/>
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
            <Btn className="flex-1" onClick={()=>printInvoiceTemplid(viewInv,developer)}><Icon name="print" size={15}/>Download / Print PDF</Btn>
            <Btn variant="secondary" onClick={()=>setViewInv(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Templid-exact print function (matches the uploaded HTML template exactly)
const printInvoiceTemplid = (inv, developer) => {
  const { net, gst, total } = calcInvoiceTotal(inv.items||[]);
  const rows = (inv.items||[]).map((item,i)=>{
    const sub=item.price*item.qty, vatAmt=sub*(item.gst||0)/100, tot=sub+vatAmt;
    return `<tr>
      <td class="border-b py-3 pl-3">${i+1}.</td>
      <td class="border-b py-3 pl-2">${item.name}</td>
      <td class="border-b py-3 pl-2 text-right">₹${Number(item.price).toLocaleString("en-IN")}</td>
      <td class="border-b py-3 pl-2 text-center">${item.qty}</td>
      <td class="border-b py-3 pl-2 text-center">${item.gst||0}%</td>
      <td class="border-b py-3 pl-2 text-right">₹${Number(sub).toLocaleString("en-IN")}</td>
      <td class="border-b py-3 pl-2 pr-3 text-right">₹${Number(tot).toLocaleString("en-IN")}</td>
    </tr>`;
  }).join("");
  const logoHTML = developer?.logo ? `<img src="${developer.logo}" class="h-12"/>` : `<div style="font-size:1.25rem;font-weight:900;color:#5c6ac4">${developer?.companyName||""}</div>`;
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Invoice ${inv.id}</title><style>
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
html{line-height:1.5;font-family:ui-sans-serif,system-ui,Arial,sans-serif}
body{margin:0}table{text-indent:0;border-color:inherit;border-collapse:collapse}
img,svg{display:block;max-width:100%;height:auto}[hidden]{display:none}
.fixed{position:fixed}.bottom-0{bottom:0}.left-0{left:0}.table{display:table}
.h-12{height:3rem}.w-1\\/2{width:50%}.w-full{width:100%}
.border-collapse{border-collapse:collapse}.border-spacing-0{border-spacing:0}
.whitespace-nowrap{white-space:nowrap}.border-b{border-bottom-width:1px}
.border-b-2{border-bottom-width:2px}.border-r{border-right-width:1px}
.border-main{border-color:#5c6ac4}.bg-main{background-color:#5c6ac4}.bg-slate-100{background-color:#f1f5f9}
.p-3{padding:.75rem}.px-14{padding-left:3.5rem;padding-right:3.5rem}
.px-2{padding-left:.5rem;padding-right:.5rem}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}
.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-4{padding-top:1rem;padding-bottom:1rem}
.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.pb-3{padding-bottom:.75rem}
.pl-2{padding-left:.5rem}.pl-3{padding-left:.75rem}.pl-4{padding-left:1rem}
.pr-3{padding-right:.75rem}.pr-4{padding-right:1rem}
.text-center{text-align:center}.text-right{text-align:right}.align-top{vertical-align:top}
.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}
.font-bold{font-weight:700}.italic{font-style:italic}
.text-main{color:#5c6ac4}.text-neutral-600{color:#525252}.text-neutral-700{color:#404040}
.text-slate-300{color:#cbd5e1}.text-slate-400{color:#94a3b8}.text-white{color:#fff}
@page{margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <div class="py-4">
    <div class="px-14 py-6">
      <table class="w-full border-collapse border-spacing-0"><tbody><tr>
        <td class="w-full align-top">${logoHTML}</td>
        <td class="align-top">
          <div class="text-sm"><table class="border-collapse border-spacing-0"><tbody><tr>
            <td class="border-r pr-4"><p class="whitespace-nowrap text-slate-400 text-right">Date</p><p class="whitespace-nowrap font-bold text-main text-right">${inv.date}</p></td>
            <td class="pl-4"><p class="whitespace-nowrap text-slate-400 text-right">Invoice #</p><p class="whitespace-nowrap font-bold text-main text-right">${inv.id.toUpperCase()}</p></td>
          </tr></tbody></table></div>
        </td>
      </tr></tbody></table>
    </div>
    <div class="bg-slate-100 px-14 py-6 text-sm">
      <table class="w-full border-collapse border-spacing-0"><tbody><tr>
        <td class="w-1/2 align-top"><div class="text-sm text-neutral-600">
          <p class="font-bold">${developer?.companyName||""}</p>
          <p>${developer?.address||""}</p>
          ${developer?.gstIn?`<p>GSTIN: ${developer.gstIn}</p>`:""}
          <p>${developer?.phone||""}</p>
        </div></td>
        <td class="w-1/2 align-top text-right"><div class="text-sm text-neutral-600">
          <p class="font-bold">${inv.customerName||""}</p>
          <p>${inv.customerAddress||""}</p>
          <p>${inv.customerPhone||""}</p>
          <p>${inv.customerEmail||""}</p>
        </div></td>
      </tr></tbody></table>
    </div>
    <div class="px-14 py-10 text-sm text-neutral-700">
      <table class="w-full border-collapse border-spacing-0">
        <thead><tr>
          <td class="border-b-2 border-main pb-3 pl-3 font-bold text-main">#</td>
          <td class="border-b-2 border-main pb-3 pl-2 font-bold text-main">Product details</td>
          <td class="border-b-2 border-main pb-3 pl-2 text-right font-bold text-main">Price</td>
          <td class="border-b-2 border-main pb-3 pl-2 text-center font-bold text-main">Qty.</td>
          <td class="border-b-2 border-main pb-3 pl-2 text-center font-bold text-main">GST</td>
          <td class="border-b-2 border-main pb-3 pl-2 text-right font-bold text-main">Subtotal</td>
          <td class="border-b-2 border-main pb-3 pl-2 pr-3 text-right font-bold text-main">Subtotal+GST</td>
        </tr></thead>
        <tbody>
          ${rows}
          <tr><td colspan="7">
            <table class="w-full border-collapse border-spacing-0"><tbody><tr>
              <td class="w-full"></td>
              <td><table class="w-full border-collapse border-spacing-0"><tbody>
                <tr><td class="border-b p-3"><div class="whitespace-nowrap text-slate-400">Net total:</div></td><td class="border-b p-3 text-right"><div class="whitespace-nowrap font-bold text-main">₹${Number(net).toLocaleString("en-IN")}</div></td></tr>
                <tr><td class="p-3"><div class="whitespace-nowrap text-slate-400">GST total:</div></td><td class="p-3 text-right"><div class="whitespace-nowrap font-bold text-main">₹${Number(gst).toLocaleString("en-IN")}</div></td></tr>
                <tr><td class="bg-main p-3"><div class="whitespace-nowrap font-bold text-white">Total:</div></td><td class="bg-main p-3 text-right"><div class="whitespace-nowrap font-bold text-white">₹${Number(total).toLocaleString("en-IN")}</div></td></tr>
              </tbody></table></td>
            </tr></tbody></table>
          </td></tr>
        </tbody>
      </table>
    </div>
    ${developer?.bankDetails?`<div class="px-14 text-sm text-neutral-700"><p class="text-main font-bold">PAYMENT DETAILS</p><pre style="font-family:inherit;white-space:pre-wrap">${developer.bankDetails}</pre></div>`:""}
    ${inv.notes?`<div class="px-14 py-6 text-sm text-neutral-700"><p class="text-main font-bold">Notes</p><p class="italic">${inv.notes}</p></div>`:""}
    <footer class="fixed bottom-0 left-0 bg-slate-100 w-full text-neutral-600 text-center text-xs py-3">
      ${developer?.companyName||""} <span class="text-slate-300 px-2">|</span> ${developer?.email||""} <span class="text-slate-300 px-2">|</span> ${developer?.phone||""}
    </footer>
  </div></body></html>`;
  const w = window.open("","_blank");
  w.document.write(html); w.document.close(); w.focus();
  setTimeout(()=>{w.print();w.close();},700);
};
// ============================================================
// SOLARPRO v3 - PART 7: PROJECT DETAIL (Notes, Docs, Proposals)
// ============================================================

const ProjectDetailPage = ({ project, notes, setNotes, documents, setDocuments, proposals, setProposals, templates, developer, currentUser, onBack, setCurrentPage }) => {
  const { dark } = useTheme();
  const [tab, setTab] = useState("info");
  const [newNote, setNewNote] = useState("");
  const [showGen, setShowGen] = useState(false);
  const [selectedTmpl, setSelectedTmpl] = useState("");
  const [pForm, setPForm] = useState({});
  const [viewProposal, setViewProposal] = useState(null);
  const fileRef = useRef();

  const projNotes     = notes.filter(n=>n.projectId===project.id);
  const projDocs      = documents.filter(d=>d.projectId===project.id);
  const projProposals = proposals.filter(p=>p.projectId===project.id);
  const avlTemplates  = templates.filter(t=>t.assignedTo.includes(project.developerId));

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(ns=>[...ns,{id:`n${Date.now()}`,projectId:project.id,userId:currentUser.id,content:newNote,createdAt:new Date().toISOString()}]);
    setNewNote("");
  };

  const handleUpload = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const types={pdf:"PDF",doc:"Word",docx:"Word",xls:"Excel",xlsx:"Excel",jpg:"Image",jpeg:"Image",png:"Image",mp4:"Video",mov:"Video"};
    const ext=file.name.split(".").pop().toLowerCase();
    setDocuments(ds=>[...ds,{id:`doc${Date.now()}`,projectId:project.id,name:file.name,type:types[ext]||"File",size:`${(file.size/1024).toFixed(0)} KB`,uploadDate:TODAY,uploadedBy:currentUser.name}]);
  };

  const vars = calcSolar(project.projectSize, developer);

  const generateProposal = () => {
    const tmpl = templates.find(t=>t.id===selectedTmpl); if(!tmpl) return;
    const v = calcSolar(project.projectSize, developer, pForm);
    const data = {
      ...pForm, ...v,
      company_name:developer.companyName, company_address:developer.address,
      company_phone:developer.phone, company_email:developer.email,
      company_website:developer.website, payment_terms:developer.paymentTerms,
      customer_name:project.customerName, customer_address:project.customerAddress,
      customer_phone:project.customerPhone, customer_email:project.customerEmail,
      project_size:project.projectSize, project_type:project.projectType,
    };
    const np={id:`pr${Date.now()}`,projectId:project.id,templateId:selectedTmpl,status:"Generated",createdAt:TODAY,data};
    setProposals(ps=>[...ps,np]);
    setShowGen(false); setViewProposal(np);
  };

  const tabs = ["info","notes","documents","proposal"];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className={`p-1.5 rounded-lg transition-colors ${tc(dark,"text-slate-400 hover:text-white hover:bg-slate-700","text-slate-400 hover:text-slate-600 hover:bg-slate-100")}`}><Icon name="back" size={18}/></button>
        <div className="flex-1">
          <h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>{project.customerName}</h1>
          <p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{project.customerAddress}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(project.status,dark)}`}>{project.status}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${tc(dark,"bg-slate-700 text-slate-300","bg-slate-100 text-slate-600")}`}>{project.projectType}</span>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[["System Size",`${project.projectSize} kW`],["Total Cost",fmtINR(vars.totalCost)],["Annual Savings",fmtINR(vars.annualSavings)],["Payback",`${vars.paybackPeriod} yrs`]].map(([l,v])=>(
          <div key={l} className={`border rounded-xl p-3 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
            <div className={`text-xs mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>{l}</div>
            <div className={`font-bold ${tc(dark,"text-white","text-slate-800")}`}>{v}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className={`flex gap-1 rounded-xl p-1 mb-5 w-fit border ${tc(dark,"bg-[#070e1c] border-slate-800","bg-slate-100 border-slate-200")}`}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${tab===t ? "bg-amber-500 text-slate-900" : tc(dark,"text-slate-400 hover:text-white","text-slate-500 hover:text-slate-700")}`}>{t}</button>
        ))}
      </div>

      {/* INFO TAB */}
      {tab==="info"&&(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
            <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Customer Details</h3>
            {[["Name",project.customerName],["Email",project.customerEmail],["Phone",project.customerPhone],["Address",project.customerAddress]].map(([k,v])=>(
              <div key={k} className={`flex gap-3 text-sm py-1.5 border-b last:border-0 ${tc(dark,"border-slate-700/20","border-slate-100")}`}>
                <span className={`w-16 flex-shrink-0 ${tc(dark,"text-slate-400","text-slate-500")}`}>{k}</span>
                <span className={tc(dark,"text-white","text-slate-800")}>{v||"—"}</span>
              </div>
            ))}
          </div>
          <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
            <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Solar Calculations</h3>
            {[["Total Cost",fmtINR(vars.totalCost)],["Annual Generation",`${vars.annualGeneration.toLocaleString()} kWh`],["Annual Savings",fmtINR(vars.annualSavings)],["Payback Period",`${vars.paybackPeriod} years`],["25-Year ROI",`${vars.roi25}%`]].map(([k,v])=>(
              <div key={k} className={`flex justify-between text-sm py-1.5 border-b last:border-0 ${tc(dark,"border-slate-700/20","border-slate-100")}`}>
                <span className={tc(dark,"text-slate-400","text-slate-500")}>{k}</span>
                <span className="text-amber-400 font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTES TAB */}
      {tab==="notes"&&(
        <div>
          <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
            <textarea value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Add a note…" rows={3} className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none resize-none text-sm mb-3 ${tc(dark,"bg-slate-800/50 border-slate-600 text-white placeholder-slate-500 focus:border-amber-400","bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-amber-500")}`}/>
            <Btn onClick={addNote} disabled={!newNote.trim()}><Icon name="plus" size={15}/>Add Note</Btn>
          </div>
          <div className="space-y-2">
            {!projNotes.length ? <p className={`text-sm text-center py-8 ${tc(dark,"text-slate-400","text-slate-500")}`}>No notes yet.</p> : projNotes.map(n=>(
              <div key={n.id} className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
                <p className={`text-sm mb-2 ${tc(dark,"text-white","text-slate-800")}`}>{n.content}</p>
                <p className={`text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>{new Date(n.createdAt).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCUMENTS TAB */}
      {tab==="documents"&&(
        <div>
          <div className="mb-4">
            <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.mov"/>
            <Btn onClick={()=>fileRef.current?.click()}><Icon name="upload" size={15}/>Upload Document</Btn>
          </div>
          {!projDocs.length ? (
            <div className={`text-center py-14 border-2 border-dashed rounded-xl ${tc(dark,"border-slate-700","border-slate-200")}`}>
              <Icon name="upload" size={28}/><p className={`mt-2 text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>No documents yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {projDocs.map(doc=>(
                <div key={doc.id} className={`border rounded-xl p-3 flex items-center gap-3 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${tc(dark,"bg-slate-700/50 text-slate-400","bg-slate-100 text-slate-500")}`}><Icon name="file" size={18}/></div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${tc(dark,"text-white","text-slate-800")}`}>{doc.name}</div>
                    <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{doc.type} · {doc.size} · {fmtDate(doc.uploadDate)}</div>
                  </div>
                  <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>setDocuments(ds=>ds.filter(d=>d.id!==doc.id))}><Icon name="trash" size={13}/></Btn>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROPOSAL TAB */}
      {tab==="proposal"&&(
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold text-sm ${tc(dark,"text-white","text-slate-800")}`}>Proposals ({projProposals.length})</h3>
            <Btn onClick={()=>setShowGen(true)}><Icon name="plus" size={15}/>Create Proposal</Btn>
          </div>
          {!projProposals.length ? (
            <div className={`text-center py-14 border rounded-xl ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}>
              <Icon name="file" size={28}/><p className={`mt-2 text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>No proposals yet.</p>
              <Btn onClick={()=>setShowGen(true)} className="mt-3"><Icon name="plus" size={15}/>Create First Proposal</Btn>
            </div>
          ) : projProposals.map(pr=>{
            const tmpl=templates.find(t=>t.id===pr.templateId);
            return (
              <div key={pr.id} className={`border rounded-xl p-4 flex items-center gap-3 mb-2 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0"><Icon name="file" size={18}/></div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${tc(dark,"text-white","text-slate-800")}`}>{tmpl?.name||"Proposal"}</div>
                  <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{fmtDate(pr.createdAt)}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(pr.status,dark)}`}>{pr.status}</span>
                <Btn size="sm" variant="outline" onClick={()=>setViewProposal(pr)}><Icon name="eye" size={13}/>View</Btn>
                <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>printProposal(pr,project,developer)}><Icon name="print" size={13}/>PDF</Btn>
              </div>
            );
          })}
        </div>
      )}

      {/* Proposal Generator Modal */}
      {showGen&&(
        <Modal title="Generate Proposal" onClose={()=>setShowGen(false)} wide>
          <Field label="Select Template" type="select" value={selectedTmpl} onChange={setSelectedTmpl}
            options={[{value:"",label:"— Select Template —"},...avlTemplates.map(t=>({value:t.id,label:t.name}))]}/>
          {selectedTmpl&&(()=>{
            const v=calcSolar(project.projectSize,developer,pForm);
            return (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Field label="Electricity Price (₹/kWh)" type="number" value={pForm.electricityPrice??developer.electricityPrice} onChange={val=>setPForm(f=>({...f,electricityPrice:val}))}/>
                  <Field label="Cost per kW (₹)" type="number" value={pForm.costPerKW??developer.costPerKW} onChange={val=>setPForm(f=>({...f,costPerKW:val}))}/>
                  <Field label="Solar Gen Factor" type="number" value={pForm.solarGenerationFactor??developer.solarGenerationFactor} onChange={val=>setPForm(f=>({...f,solarGenerationFactor:val}))}/>
                  <Field label="Annual Bill Before Solar (₹)" type="number" value={pForm.annualBillBefore||""} placeholder={fmtINR(v.annualBillBefore)} onChange={val=>setPForm(f=>({...f,annualBillBefore:val}))}/>
                </div>
                <div className={`rounded-xl p-4 mb-4 grid grid-cols-2 gap-2 text-sm ${tc(dark,"bg-slate-800/50","bg-slate-50")}`}>
                  {[["Total Cost",fmtINR(v.totalCost)],["Annual Gen",`${v.annualGeneration.toLocaleString()} kWh`],["Annual Savings",fmtINR(v.annualSavings)],["Payback",`${v.paybackPeriod} yrs`],["25yr ROI",`${v.roi25}%`]].map(([k,val])=>(
                    <div key={k} className="flex justify-between">
                      <span className={tc(dark,"text-slate-400","text-slate-500")}>{k}</span>
                      <span className="text-amber-400 font-bold">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Btn onClick={generateProposal} className="flex-1"><Icon name="zap" size={15}/>Generate Proposal</Btn>
                  <Btn variant="secondary" onClick={()=>setShowGen(false)}>Cancel</Btn>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Proposal Preview Modal */}
      {viewProposal&&(
        <Modal title="Proposal Preview" onClose={()=>setViewProposal(null)} wide>
          <ProposalPreview proposal={viewProposal} project={project} developer={developer} templates={templates}/>
        </Modal>
      )}
    </div>
  );
};

// ── PROPOSAL PREVIEW COMPONENT ────────────────────────────────
const ProposalPreview = ({ proposal, project, developer, templates }) => {
  const { dark } = useTheme();
  const d = proposal.data;
  const tmpl = templates.find(t=>t.id===proposal.templateId);

  return (
    <div>
      {/* Header */}
      <div className={`rounded-xl p-5 mb-4 ${tc(dark,"bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20","bg-amber-50 border border-amber-200")}`}>
        <div className="flex items-start justify-between">
          <div>
            {developer?.logo&&<img src={developer.logo} alt="logo" className="h-10 mb-2 rounded object-contain"/>}
            <div className={`text-lg font-black ${tc(dark,"text-white","text-slate-800")}`}>{d.company_name}</div>
            <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{d.company_address}</div>
            <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{d.company_phone} · {d.company_email}</div>
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-black text-lg">SOLAR PROPOSAL</div>
            <div className={`text-xs mt-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>{fmtDate(proposal.createdAt)}</div>
            <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{tmpl?.name}</div>
          </div>
        </div>
      </div>

      {/* Customer info */}
      <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}>
        <h4 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Prepared For</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[["Name",d.customer_name],["Email",d.customer_email],["Phone",d.customer_phone],["Address",d.customer_address],["Project Size",`${d.project_size} kW`],["Type",d.project_type]].map(([k,v])=>(
            <div key={k}><span className={`${tc(dark,"text-slate-400","text-slate-500")} `}>{k}: </span><span className={`font-medium ${tc(dark,"text-white","text-slate-800")}`}>{v||"—"}</span></div>
          ))}
        </div>
      </div>

      {/* Financial summary */}
      <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}>
        <h4 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Financial Summary</h4>
        <div className="grid grid-cols-2 gap-2">
          {[["System Size",`${d.project_size} kW`],["Total Cost",fmtINR(d.totalCost)],["Annual Generation",`${(d.annualGeneration||0).toLocaleString()} kWh`],["Annual Savings",fmtINR(d.annualSavings)],["Payback Period",`${d.paybackPeriod} years`],["25-Year ROI",`${d.roi25}%`]].map(([k,v])=>(
            <div key={k} className={`rounded-lg p-3 flex justify-between items-center ${tc(dark,"bg-slate-800/40","bg-slate-50")}`}>
              <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{k}</span>
              <span className="text-amber-400 font-bold text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 10 Year Table */}
      <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}>
        <h4 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>10-Year Savings Projection</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className={`border-b ${tc(dark,"border-slate-700","border-slate-200")}`}>
              {["Year","Bill Before","Bill After","Annual Savings","Cumulative"].map(h=><th key={h} className={`text-left py-2 px-2 font-medium ${tc(dark,"text-slate-400","text-slate-500")}`}>{h}</th>)}
            </tr></thead>
            <tbody>
              {Array.from({length:10},(_,i)=>{
                const yr=i+1;
                const before=(d.annualBillBefore||d.annualSavings*1.3)*Math.pow(1.03,yr);
                const savings=(d.annualSavings||0)*Math.pow(1.01,yr);
                const after=Math.max(0,before-savings);
                const cumulative=Array.from({length:yr},(_,j)=>(d.annualSavings||0)*Math.pow(1.01,j+1)).reduce((s,x)=>s+x,0);
                return <tr key={yr} className={`border-b ${tc(dark,"border-slate-700/20 hover:bg-slate-800/20","border-slate-100 hover:bg-slate-50")}`}>
                  <td className={`py-2 px-2 font-bold ${tc(dark,"text-white","text-slate-800")}`}>{yr}</td>
                  <td className="py-2 px-2 text-red-400">{fmtINR(before)}</td>
                  <td className="py-2 px-2 text-emerald-400">{fmtINR(after)}</td>
                  <td className="py-2 px-2 text-amber-400">{fmtINR(savings)}</td>
                  <td className="py-2 px-2 text-sky-400">{fmtINR(cumulative)}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}>
        <h4 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>ROI Payback Chart</h4>
        <PaybackChart totalCost={d.totalCost} annualSavings={d.annualSavings}/>
        <p className={`text-xs text-center mt-2 ${tc(dark,"text-slate-500","text-slate-400")}`}>Break-even at year {d.paybackPeriod}</p>
      </div>

      {developer?.paymentTerms&&<div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}><h4 className={`font-bold mb-2 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Payment Terms</h4><pre className={`text-xs whitespace-pre-wrap ${tc(dark,"text-slate-400","text-slate-600")}`}>{developer.paymentTerms}</pre></div>}
      {developer?.bankDetails&&<div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}><h4 className={`font-bold mb-2 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Bank Details</h4><pre className={`text-xs whitespace-pre-wrap ${tc(dark,"text-slate-400","text-slate-600")}`}>{developer.bankDetails}</pre></div>}
      {developer?.terms&&<div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}><h4 className={`font-bold mb-2 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Terms & Conditions</h4><p className={`text-xs ${tc(dark,"text-slate-400","text-slate-600")}`}>{developer.terms}</p></div>}

      <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
        <Btn className="flex-1" onClick={()=>printProposal(proposal,project,developer)}><Icon name="print" size={15}/>Download / Print PDF</Btn>
      </div>
    </div>
  );
};

// Proposal PDF print
const printProposal = (proposal, project, developer) => {
  const d = proposal.data;
  const rows10 = Array.from({length:10},(_,i)=>{
    const yr=i+1;
    const before=(d.annualBillBefore||d.annualSavings*1.3)*Math.pow(1.03,yr);
    const savings=(d.annualSavings||0)*Math.pow(1.01,yr);
    const after=Math.max(0,before-savings);
    const cum=Array.from({length:yr},(_,j)=>(d.annualSavings||0)*Math.pow(1.01,j+1)).reduce((s,x)=>s+x,0);
    return `<tr style="border-bottom:1px solid #e2e8f0"><td>${yr}</td><td style="color:#dc2626">₹${Math.round(before).toLocaleString("en-IN")}</td><td style="color:#059669">₹${Math.round(after).toLocaleString("en-IN")}</td><td style="color:#d97706">₹${Math.round(savings).toLocaleString("en-IN")}</td><td style="color:#0284c7">₹${Math.round(cum).toLocaleString("en-IN")}</td></tr>`;
  }).join("");
  const html = `<!DOCTYPE html><html><head><title>Solar Proposal — ${d.customer_name}</title>
  <style>body{font-family:Arial,sans-serif;color:#111;background:#fff;padding:32px;max-width:900px;margin:0 auto}h1,h2,h3{margin:0 0 8px}table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:left;font-size:13px}th{background:#fef3c7;font-weight:700}tr:hover{background:#fafafa}img{max-height:60px;display:block;margin-bottom:8px}pre{white-space:pre-wrap;font-family:inherit;font-size:12px}.amber{color:#d97706}.section{margin-bottom:24px;padding:16px;border:1px solid #e2e8f0;border-radius:12px}@media print{body{padding:0}@page{margin:1cm}}</style>
  </head><body>
  <div class="section" style="background:#fffbeb;border-color:#fde68a">
    ${developer?.logo?`<img src="${developer.logo}" alt="logo"/>`:""}
    <h1 style="font-size:20px">${d.company_name}</h1>
    <p style="font-size:12px;color:#666">${d.company_address||""}<br/>${d.company_phone||""} | ${d.company_email||""}</p>
    <h2 style="text-align:right;font-size:18px;color:#d97706;margin-top:-40px">SOLAR PROPOSAL</h2>
    <p style="text-align:right;font-size:12px;color:#888">${fmtDate(proposal.createdAt)}</p>
  </div>
  <div class="section">
    <h3>Customer Details</h3>
    <table><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Size</th><th>Type</th></tr>
    <tr><td>${d.customer_name}</td><td>${d.customer_email||"—"}</td><td>${d.customer_phone||"—"}</td><td>${d.customer_address||"—"}</td><td>${d.project_size} kW</td><td>${d.project_type}</td></tr></table>
  </div>
  <div class="section">
    <h3>Financial Summary</h3>
    <table><tr><td><strong>Total System Cost</strong></td><td class="amber">${fmtINR(d.totalCost)}</td><td><strong>Annual Generation</strong></td><td class="amber">${(d.annualGeneration||0).toLocaleString()} kWh</td></tr>
    <tr><td><strong>Annual Savings</strong></td><td class="amber">${fmtINR(d.annualSavings)}</td><td><strong>Payback Period</strong></td><td class="amber">${d.paybackPeriod} years</td></tr>
    <tr><td><strong>25-Year ROI</strong></td><td class="amber">${d.roi25}%</td><td></td><td></td></tr></table>
  </div>
  <div class="section">
    <h3>10-Year Savings Projection</h3>
    <table><thead><tr style="background:#fef3c7"><th>Year</th><th>Bill Before Solar</th><th>Bill After Solar</th><th>Annual Savings</th><th>Cumulative Savings</th></tr></thead><tbody>${rows10}</tbody></table>
  </div>
  ${developer?.paymentTerms?`<div class="section"><h3>Payment Terms</h3><pre>${developer.paymentTerms}</pre></div>`:""}
  ${developer?.bankDetails?`<div class="section"><h3>Bank Details</h3><pre>${developer.bankDetails}</pre></div>`:""}
  ${developer?.terms?`<div class="section"><h3>Terms & Conditions</h3><p style="font-size:12px">${developer.terms}</p></div>`:""}
  </body></html>`;
  const w=window.open("","_blank");
  w.document.write(html); w.document.close(); w.focus();
  setTimeout(()=>{w.print();w.close();},600);
};
// ============================================================
// SOLARPRO v3 - MAIN APP ENTRY (assembles all parts)
// ============================================================

// ─── IMPORTS FROM PARTS ──────────────────────────────────────
// Part 1: Constants, data, utilities
// Part 2: UI primitives
// Part 3: Invoice generator
// Part 4: Auth, Sidebar, Dashboards
// Part 5: Super Admin pages
// Part 6: Dev Admin & User pages
// Part 7: Project Detail

// ── MAIN APP ──────────────────────────────────────────────────
export default function SolarProApp() {
  // ── THEME STATE ──
  const [dark, setDark] = useLS("sp_dark", true);
  const themeCtx = { dark, toggle: () => setDark(d => !d) };

  // ── GLOBAL STATE ──
  const [currentUser, setCurrentUser] = useLS("sp_currentUser", null);
  const [developers,  setDevelopers]  = useLS("sp_developers",  SEED_DEVELOPERS);
  const [users,       setUsers]       = useLS("sp_users",       SEED_USERS);
  const [projects,    setProjects]    = useLS("sp_projects",    SEED_PROJECTS);
  const [notes,       setNotes]       = useLS("sp_notes",       SEED_NOTES);
  const [documents,   setDocuments]   = useLS("sp_documents",   SEED_DOCUMENTS);
  const [templates,   setTemplates]   = useLS("sp_templates",   SEED_TEMPLATES);
  const [proposals,   setProposals]   = useLS("sp_proposals",   SEED_PROPOSALS);
  const [invoices,    setInvoices]    = useLS("sp_invoices",     SEED_INVOICES);

  // ── NAV STATE ──
  const [currentPage,      setCurrentPage]      = useState("dashboard");
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const setPage = (p) => { setCurrentPage(p); setCurrentProjectId(null); };

  // ── DERIVED ──
  const developer     = developers.find(d => d.id === currentUser?.developerId);
  const currentProject = currentProjectId ? projects.find(p => p.id === currentProjectId) : null;

  // ── SUBSCRIPTION STATUS CHECK ──
  const subscriptionLocked = developer && (
    developer.paused ||
    (developer.subscriptionEnd && new Date(developer.subscriptionEnd) < new Date())
  );

  // ── RENDER LOCKED PAGE if user tries to navigate to protected page ──
  const isProtectedPage = (page) => !["dashboard"].includes(page);

  // ── AUTH GATE ──
  if (!currentUser) {
    return (
      <ThemeCtx.Provider value={themeCtx}>
        <LoginPage onLogin={u => { setCurrentUser(u); setCurrentPage("dashboard"); }} allUsers={users}/>
      </ThemeCtx.Provider>
    );
  }

  // ── PAGE RENDERER ──
  const renderPage = () => {
    // If viewing a project detail
    if (currentProject && developer) {
      if (subscriptionLocked) return <LockedPage developer={developer}/>;
      return (
        <ProjectDetailPage
          project={currentProject} notes={notes} setNotes={setNotes}
          documents={documents} setDocuments={setDocuments}
          proposals={proposals} setProposals={setProposals}
          templates={templates} developer={developer}
          currentUser={currentUser} onBack={() => setCurrentProjectId(null)}
        />
      );
    }

    // Subscription lock: show LockedPage for non-dashboard pages
    if (subscriptionLocked && currentUser.role !== ROLES.SUPER_ADMIN && isProtectedPage(currentPage)) {
      return <LockedPage developer={developer}/>;
    }

    switch (currentPage) {
      // ── SHARED: DASHBOARD ──
      case "dashboard":
        if (currentUser.role === ROLES.SUPER_ADMIN)
          return <SuperAdminDashboard developers={developers} users={users} projects={projects} invoices={invoices} proposals={proposals}/>;
        if (currentUser.role === ROLES.DEV_ADMIN)
          return <DevDashboard developer={developer} projects={projects} users={users} proposals={proposals} invoices={invoices}/>;
        // Regular user dashboard
        return <UserDashboard developer={developer} currentUser={currentUser} projects={projects} proposals={proposals} invoices={invoices}/>;

      // ── SUPER ADMIN ONLY ──
      case "developers":
        return <DevelopersPage developers={developers} setDevelopers={setDevelopers} users={users} setUsers={setUsers} invoices={invoices} setInvoices={setInvoices}/>;
      case "create-invoice":
        return <CreateInvoicePage developers={developers} users={users} projects={projects} invoices={invoices} setInvoices={setInvoices}/>;
      case "invoices":
        if (currentUser.role === ROLES.SUPER_ADMIN)
          return <SuperAdminInvoicesPage invoices={invoices} setInvoices={setInvoices} developers={developers} projects={projects} users={users}/>;
        return <ProjectInvoicesPage invoices={invoices} setInvoices={setInvoices} projects={projects} developer={developer} currentUser={currentUser}/>;

      // ── SHARED: TEMPLATES ──
      case "templates":
        return <TemplatesPage templates={templates} setTemplates={setTemplates} developers={developers} currentUser={currentUser}/>;

      // ── SHARED: USERS ──
      case "users":
      case "team":
        return <UsersPage users={users} setUsers={setUsers} currentUser={currentUser} developers={developers}/>;

      // ── DEV + USER: PROJECTS ──
      case "projects":
        return <ProjectsPage projects={projects} setProjects={setProjects} currentUser={currentUser} setCurrentProjectId={setCurrentProjectId} developer={developer}/>;

      // ── DEV ADMIN: SETTINGS ──
      case "settings":
        return developer ? <SettingsPage developer={developer} setDevelopers={setDevelopers}/> : null;

      default:
        return null;
    }
  };

  const bg = dark ? "bg-[#060c18] text-white" : "bg-slate-50 text-slate-800";

  return (
    <ThemeCtx.Provider value={themeCtx}>
      <div className={`flex h-screen overflow-hidden ${bg}`} style={{fontFamily:"'Inter','system-ui',sans-serif"}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
          *{box-sizing:border-box}
          ::-webkit-scrollbar{width:5px;height:5px}
          ::-webkit-scrollbar-track{background:${dark?"#0f172a":"#f1f5f9"}}
          ::-webkit-scrollbar-thumb{background:${dark?"#334155":"#cbd5e1"};border-radius:3px}
        `}</style>

        <Sidebar user={currentUser} currentPage={currentPage} setPage={setPage}
          onLogout={() => { setCurrentUser(null); setCurrentPage("dashboard"); setCurrentProjectId(null); }}
          developer={developer}/>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Subscription warning banner */}
          {currentUser.role !== ROLES.SUPER_ADMIN && developer && (
            <SubscriptionBanner developer={developer}/>
          )}

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-5 lg:p-7">
              {renderPage()}
            </div>
          </main>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}

// ── USER DASHBOARD ─────────────────────────────────────────────
function UserDashboard({ developer, currentUser, projects, proposals, invoices }) {
  const { dark } = useTheme();
  const myProjects  = projects.filter(p => p.userId === currentUser.id);
  const myProposals = proposals.filter(pr => myProjects.some(p => p.id === pr.projectId));
  const myInvoices  = invoices.filter(i => i.userId === currentUser.id && i.type === "project");
  const revenue     = myInvoices.reduce((s,i) => s + (calcInvoiceTotal(i.items||[]).total||i.amount||0), 0);

  const isLocked = developer && (developer.paused || (developer.subscriptionEnd && new Date(developer.subscriptionEnd) < new Date()));

  return (
    <div>
      <h1 className={`text-xl font-bold mb-1 ${tc(dark,"text-white","text-slate-800")}`}>Welcome, {currentUser.name}</h1>
      <p className={`text-sm mb-5 ${tc(dark,"text-slate-400","text-slate-500")}`}>{developer?.companyName}</p>

      {isLocked && (
        <div className={`rounded-2xl p-6 mb-5 text-center border ${tc(dark,"bg-red-500/10 border-red-500/30","bg-red-50 border-red-200")}`}>
          <div className="text-3xl mb-2">🔒</div>
          <h2 className="text-red-400 font-black text-lg mb-1">{developer?.paused ? "Subscription Paused" : "Subscription Expired"}</h2>
          <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>Please contact your account manager to renew your subscription and restore access.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="My Projects" value={myProjects.length} icon="folder" color="amber"/>
        <StatCard label="Proposals Made" value={myProposals.length} icon="file" color="sky"/>
        <StatCard label="Invoices Created" value={myInvoices.length} icon="invoice" color="emerald"/>
        <StatCard label="Revenue Generated" value={fmtINR(revenue)} icon="trending" color="purple"/>
      </div>

      <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
        <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Recent Projects</h3>
        {!myProjects.length ? <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>No projects yet. Go to Projects to create one.</p> : myProjects.slice(0,5).map(p=>(
          <div key={p.id} className={`flex items-center justify-between py-2 border-b last:border-0 ${tc(dark,"border-slate-700/30","border-slate-100")}`}>
            <div><div className={`text-sm font-medium ${tc(dark,"text-white","text-slate-800")}`}>{p.customerName}</div><div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{p.projectSize} kW · {p.projectType}</div></div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.status,dark)}`}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
