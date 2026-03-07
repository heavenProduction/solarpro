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

// ── INDIA CITIES (typehead) ───────────────────────────────────
const INDIAN_CITIES = ["Agra","Ahmedabad","Ajmer","Aligarh","Amritsar","Aurangabad","Bengaluru","Bhopal","Bhubaneswar","Chandigarh","Chennai","Coimbatore","Dehradun","Delhi","Dhanbad","Faridabad","Ghaziabad","Gurgaon","Guwahati","Gwalior","Howrah","Hyderabad","Indore","Jaipur","Jalandhar","Jammu","Jodhpur","Kanpur","Kochi","Kolkata","Kota","Kozhikode","Lucknow","Ludhiana","Madurai","Mangaluru","Meerut","Mumbai","Mysuru","Nagpur","Nashik","Navi Mumbai","Noida","Patna","Pune","Raipur","Rajkot","Ranchi","Srinagar","Surat","Thiruvananthapuram","Thane","Tiruchirappalli","Vadodara","Varanasi","Vijayawada","Visakhapatnam"];

// Sample pincode→{city,state} map (representative Indian pincodes)
const PINCODE_MAP = {
  "400001":{ city:"Mumbai",state:"Maharashtra" },"400002":{ city:"Mumbai",state:"Maharashtra" },"400003":{ city:"Mumbai",state:"Maharashtra" },
  "411001":{ city:"Pune",state:"Maharashtra" },"411002":{ city:"Pune",state:"Maharashtra" },"411028":{ city:"Pune",state:"Maharashtra" },
  "110001":{ city:"Delhi",state:"Delhi" },"110002":{ city:"Delhi",state:"Delhi" },"110011":{ city:"Delhi",state:"Delhi" },
  "560001":{ city:"Bengaluru",state:"Karnataka" },"560002":{ city:"Bengaluru",state:"Karnataka" },
  "500001":{ city:"Hyderabad",state:"Telangana" },"500002":{ city:"Hyderabad",state:"Telangana" },
  "600001":{ city:"Chennai",state:"Tamil Nadu" },"600002":{ city:"Chennai",state:"Tamil Nadu" },
  "700001":{ city:"Kolkata",state:"West Bengal" },"700002":{ city:"Kolkata",state:"West Bengal" },
  "380001":{ city:"Ahmedabad",state:"Gujarat" },"380002":{ city:"Ahmedabad",state:"Gujarat" },
  "302001":{ city:"Jaipur",state:"Rajasthan" },"302002":{ city:"Jaipur",state:"Rajasthan" },
  "226001":{ city:"Lucknow",state:"Uttar Pradesh" },"226002":{ city:"Lucknow",state:"Uttar Pradesh" },
  "440001":{ city:"Nagpur",state:"Maharashtra" },"422001":{ city:"Nashik",state:"Maharashtra" },
  "452001":{ city:"Indore",state:"Madhya Pradesh" },"462001":{ city:"Bhopal",state:"Madhya Pradesh" },
  "160001":{ city:"Chandigarh",state:"Chandigarh" },"248001":{ city:"Dehradun",state:"Uttarakhand" },
  "682001":{ city:"Kochi",state:"Kerala" },"695001":{ city:"Thiruvananthapuram",state:"Kerala" },
  "395001":{ city:"Surat",state:"Gujarat" },"390001":{ city:"Vadodara",state:"Gujarat" },"360001":{ city:"Rajkot",state:"Gujarat" },
  "641001":{ city:"Coimbatore",state:"Tamil Nadu" },"620001":{ city:"Tiruchirappalli",state:"Tamil Nadu" },"625001":{ city:"Madurai",state:"Tamil Nadu" },
  "530001":{ city:"Visakhapatnam",state:"Andhra Pradesh" },"520001":{ city:"Vijayawada",state:"Andhra Pradesh" },
  "474001":{ city:"Gwalior",state:"Madhya Pradesh" },"342001":{ city:"Jodhpur",state:"Rajasthan" },"324001":{ city:"Kota",state:"Rajasthan" },
  "834001":{ city:"Ranchi",state:"Jharkhand" },"826001":{ city:"Dhanbad",state:"Jharkhand" },
  "492001":{ city:"Raipur",state:"Chhattisgarh" },"751001":{ city:"Bhubaneswar",state:"Odisha" },
  "781001":{ city:"Guwahati",state:"Assam" },"180001":{ city:"Jammu",state:"Jammu & Kashmir" },"190001":{ city:"Srinagar",state:"Jammu & Kashmir" },
};

// ── INVOICE DOCUMENT TYPES ────────────────────────────────────
const INV_DOC_TYPES = ["Proforma Invoice","Tax Invoice","Sales Order","Purchase Order","Delivery Challan"];

// All possible conversions from each doc type
const INV_CONVERT_TARGETS = {
  "Proforma Invoice": ["Sales Order","Tax Invoice","Purchase Order","Delivery Challan"],
  "Sales Order":      ["Delivery Challan","Tax Invoice","Purchase Order"],
  "Delivery Challan": ["Tax Invoice","Sales Order"],
  "Purchase Order":   ["Delivery Challan","Tax Invoice"],
  "Tax Invoice":      [],
};

// ── PROJECT UNITS ─────────────────────────────────────────────
const PROJECT_UNITS = ["kW","kWp","MW","HP","Liter","Meter","Unit"];

// ── COUNTRY CODES ─────────────────────────────────────────────
const COUNTRY_CODES = [
  {code:"+91",label:"🇮🇳 +91 India"},{code:"+1",label:"🇺🇸 +1 USA"},{code:"+44",label:"🇬🇧 +44 UK"},
  {code:"+971",label:"🇦🇪 +971 UAE"},{code:"+966",label:"🇸🇦 +966 Saudi Arabia"},{code:"+65",label:"🇸🇬 +65 Singapore"},
  {code:"+61",label:"🇦🇺 +61 Australia"},{code:"+49",label:"🇩🇪 +49 Germany"},{code:"+33",label:"🇫🇷 +33 France"},
  {code:"+81",label:"🇯🇵 +81 Japan"},{code:"+86",label:"🇨🇳 +86 China"},{code:"+7",label:"🇷🇺 +7 Russia"},
  {code:"+55",label:"🇧🇷 +55 Brazil"},{code:"+27",label:"🇿🇦 +27 South Africa"},{code:"+234",label:"🇳🇬 +234 Nigeria"},
  {code:"+92",label:"🇵🇰 +92 Pakistan"},{code:"+880",label:"🇧🇩 +880 Bangladesh"},{code:"+94",label:"🇱🇰 +94 Sri Lanka"},
];

// ── INDIA STATES & UTs ────────────────────────────────────────
const INDIA_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"];

// ── DATE FORMATS ──────────────────────────────────────────────
const DATE_FORMATS = [
  { key:"DD/MM/YYYY", label:"DD/MM/YYYY (31/01/2025)", fn: d => { const x=new Date(d); return `${String(x.getDate()).padStart(2,"0")}/${String(x.getMonth()+1).padStart(2,"0")}/${x.getFullYear()}`; }},
  { key:"MM/DD/YYYY", label:"MM/DD/YYYY (01/31/2025)", fn: d => { const x=new Date(d); return `${String(x.getMonth()+1).padStart(2,"0")}/${String(x.getDate()).padStart(2,"0")}/${x.getFullYear()}`; }},
  { key:"YYYY-MM-DD", label:"YYYY-MM-DD (2025-01-31)", fn: d => String(d).slice(0,10) },
  { key:"DD-MM-YYYY", label:"DD-MM-YYYY (31-01-2025)", fn: d => { const x=new Date(d); return `${String(x.getDate()).padStart(2,"0")}-${String(x.getMonth()+1).padStart(2,"0")}-${x.getFullYear()}`; }},
  { key:"DD MMM YYYY", label:"DD MMM YYYY (31 Jan 2025)", fn: d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) },
  { key:"DD MMMM YYYY", label:"DD MMMM YYYY (31 January 2025)", fn: d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"}) },
  { key:"MMM DD, YYYY", label:"MMM DD, YYYY (Jan 31, 2025)", fn: d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}) },
  { key:"D/M/YY", label:"D/M/YY (31/1/25 Short)", fn: d => { const x=new Date(d); return `${x.getDate()}/${x.getMonth()+1}/${String(x.getFullYear()).slice(2)}`; }},
];

// ── LANE COLORS ───────────────────────────────────────────────
const LANE_COLORS = [
  {key:"slate",    label:"Slate Gray",   tw:"bg-slate-400",    border:"border-slate-400"},
  {key:"sky",      label:"Sky Blue",     tw:"bg-sky-400",      border:"border-sky-400"},
  {key:"blue",     label:"Royal Blue",   tw:"bg-blue-500",     border:"border-blue-500"},
  {key:"indigo",   label:"Indigo",       tw:"bg-indigo-500",   border:"border-indigo-500"},
  {key:"violet",   label:"Violet",       tw:"bg-violet-500",   border:"border-violet-500"},
  {key:"purple",   label:"Purple",       tw:"bg-purple-500",   border:"border-purple-500"},
  {key:"pink",     label:"Pink",         tw:"bg-pink-400",     border:"border-pink-400"},
  {key:"rose",     label:"Rose",         tw:"bg-rose-500",     border:"border-rose-500"},
  {key:"red",      label:"Red",          tw:"bg-red-500",      border:"border-red-500"},
  {key:"orange",   label:"Orange",       tw:"bg-orange-400",   border:"border-orange-400"},
  {key:"amber",    label:"Amber",        tw:"bg-amber-400",    border:"border-amber-400"},
  {key:"yellow",   label:"Yellow",       tw:"bg-yellow-400",   border:"border-yellow-400"},
  {key:"lime",     label:"Lime Green",   tw:"bg-lime-400",     border:"border-lime-400"},
  {key:"green",    label:"Green",        tw:"bg-green-500",    border:"border-green-500"},
  {key:"emerald",  label:"Emerald",      tw:"bg-emerald-400",  border:"border-emerald-400"},
  {key:"teal",     label:"Teal",         tw:"bg-teal-400",     border:"border-teal-400"},
  {key:"cyan",     label:"Cyan",         tw:"bg-cyan-400",     border:"border-cyan-400"},
];

// ── DATE FILTER HELPER ────────────────────────────────────────
function applyDateFilter(dateStr, filter, customFrom, customTo) {
  if (filter==="all") return true;
  const d = new Date(dateStr); const now = new Date();
  const sm = d2 => new Date(d2.getFullYear(),d2.getMonth(),1);
  const sw = d2 => { const x=new Date(d2); x.setDate(d2.getDate()-d2.getDay()); x.setHours(0,0,0,0); return x; };
  if (filter==="7d")  return d>=new Date(now-7*86400000);
  if (filter==="15d") return d>=new Date(now-15*86400000);
  if (filter==="30d") return d>=new Date(now-30*86400000);
  if (filter==="week")  return d>=sw(now);
  if (filter==="month") return d>=sm(now);
  if (filter==="lastmonth") return d>=new Date(now.getFullYear(),now.getMonth()-1,1)&&d<=new Date(now.getFullYear(),now.getMonth(),0,23,59,59);
  if (filter==="custom") return (!customFrom||d>=new Date(customFrom))&&(!customTo||d<=new Date(customTo+" 23:59:59"));
  return true;
}

// ── SUPER ADMIN SETTINGS (stored per-session in users array) ──
const SA_DEFAULTS = { bankDetails:"Bank: ICICI\nAccount: 111222333444\nIFSC: ICIC0001111", invoicePrefix:"SP", invoiceNextNum:1001, companyName:"SolarPro Platform", logo:null, stamp:null, signature:null };

// ── THEME CONTEXT ────────────────────────────────────────────
const ThemeCtx = createContext({ dark: true, toggle: () => {} });

// ── TOAST CONTEXT ─────────────────────────────────────────────
const ToastCtx = createContext({ toast:()=>{}, undoToast:()=>{} });
const useToast = () => useContext(ToastCtx);

// ── TOAST PROVIDER ────────────────────────────────────────────
const ToastProvider = ({ children }) => {
  const { dark } = useContext(ThemeCtx);
  const [toasts, setToasts] = useState([]);
  const add = (msg, onUndo=null, duration=5000) => {
    const id = Date.now();
    setToasts(t=>[...t, {id, msg, onUndo, expiry: Date.now()+duration}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), duration);
    return id;
  };
  const dismiss = (id) => setToasts(t=>t.filter(x=>x.id!==id));
  return (
    <ToastCtx.Provider value={{toast:add}}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" style={{maxWidth:340}}>
        {toasts.map(t=>(
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-slide-in border ${dark?"bg-slate-800 border-slate-700 text-white":"bg-white border-slate-200 text-slate-800"}`}>
            <span className="flex-1">{t.msg}</span>
            {t.onUndo&&<button onClick={()=>{t.onUndo();dismiss(t.id);}} className="text-amber-400 font-bold text-xs px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors">UNDO</button>}
            <button onClick={()=>dismiss(t.id)} className="text-slate-400 hover:text-slate-300 ml-1">✕</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

// ── SEED DATA ────────────────────────────────────────────────
const SEED_DEVELOPERS = [
  { id:"d1", companyName:"SunPower Solutions", email:"ceo@sunpower.com", phone:"+91-98001-11111", address:"1234 Solar Ave", city:"Mumbai", pincode:"400001", state:"Maharashtra", website:"https://sunpower.com", seats:10, usedSeats:2, active:true, paused:false, plan:"Professional", planDuration:"Annual", subscriptionStart:"2025-01-01", subscriptionEnd:"2026-01-01", logo:null, stamp:null, signature:null, electricityPrice:8.5, solarGenerationFactor:1400, costPerKW:55000, bankDetails:"Bank: HDFC\nAccount: 1234567890\nIFSC: HDFC0001234", terms:"Payment due within 30 days.", paymentTerms:"50% advance,\n25% on equipment delivery,\n25% on completion", customerScope:"Residential and small commercial customers across Maharashtra", companyScope:"Pan-India solar installation with focus on rooftop systems", invoicePrefix:"INV", invoiceNextNum:1001, projectPrefix:"SP", projectNextNum:1001, defaultProjectUnit:"kW", customCities:[], lanes:[{id:"l1",name:"New Enquiry",color:"slate",disabled:false,order:0},{id:"l2",name:"Site Survey",color:"sky",disabled:false,order:1},{id:"l3",name:"Proposal Sent",color:"amber",disabled:false,order:2},{id:"l4",name:"Negotiation",color:"orange",disabled:false,order:3},{id:"l5",name:"Won",color:"emerald",disabled:false,order:4},{id:"l6",name:"Lost",color:"red",disabled:false,order:5}], createdAt:"2024-01-15" },
  { id:"d2", companyName:"GreenWatt Energy", email:"admin@greenwatt.com", phone:"+91-98002-22222", address:"5678 Energy Blvd", city:"Pune", pincode:"411001", state:"Maharashtra", website:"https://greenwatt.com", seats:5, usedSeats:1, active:true, paused:false, plan:"Starter", planDuration:"Monthly", subscriptionStart:"2025-12-01", subscriptionEnd:"2026-01-01", logo:null, stamp:null, signature:null, electricityPrice:7.8, solarGenerationFactor:1350, costPerKW:50000, bankDetails:"Bank: SBI\nAccount: 9876543210\nIFSC: SBIN0001234", terms:"Full payment before installation.", paymentTerms:"100% advance before work begins", customerScope:"Commercial and industrial clients", companyScope:"Western Maharashtra operations", invoicePrefix:"GW", invoiceNextNum:1001, projectPrefix:"GW", projectNextNum:1001, defaultProjectUnit:"kW", customCities:[], lanes:[{id:"l1",name:"New Enquiry",color:"slate",disabled:false,order:0},{id:"l2",name:"Site Survey",color:"sky",disabled:false,order:1},{id:"l3",name:"Proposal Sent",color:"amber",disabled:false,order:2},{id:"l4",name:"Won",color:"emerald",disabled:false,order:3},{id:"l5",name:"Lost",color:"red",disabled:false,order:4}], createdAt:"2024-03-01" },
];

const SEED_USERS = [
  { id:"u1", email:"admin@solarpro.io", password:"Admin@123", name:"Platform Admin", role:ROLES.SUPER_ADMIN, developerId:null, active:true, paused:false, permissions:[], createdAt:"2024-01-01", phone:"", companyName:"SolarPro Platform", address:"", city:"", pincode:"", state:"", logo:null, stamp:null, signature:null, bankDetails:"Bank: ICICI\nAccount: 111222333444\nIFSC: ICIC0001111", invoicePrefix:"SP", invoiceNextNum:1001, customCities:[] },
  { id:"u2", email:"ceo@sunpower.com", password:"Sun@123", name:"James Rivera", role:ROLES.DEV_ADMIN, developerId:"d1", active:true, paused:false, permissions:[], createdAt:"2024-01-15", phone:"+91-98001-11111" },
  { id:"u3", email:"sales@sunpower.com", password:"Sales@123", name:"Mia Chen", role:ROLES.USER, developerId:"d1", active:true, paused:false, permissions:["projects","proposals","notes","documents","invoices"], createdAt:"2024-02-01", phone:"+91-98001-22222" },
  { id:"u4", email:"admin@greenwatt.com", password:"Green@123", name:"Tom Okafor", role:ROLES.DEV_ADMIN, developerId:"d2", active:true, paused:false, permissions:[], createdAt:"2024-03-01", phone:"+91-98002-22222" },
];

const SEED_PROJECTS = [
  { id:"p1", projectId:"SP-1001", developerId:"d1", userId:"u3", customerName:"Robert Kim", customerPhone:"+91-98111-00001", customerEmail:"r.kim@email.com", customerAddress:"789 Oak St", customerCity:"Pune", customerPincode:"411001", customerState:"Maharashtra", customerType:"Residential", pocName:"", projectSize:8.5, projectUnit:"kW", laneId:"l2", enquiryType:"Warm", status:"Active", assignedUserId:"u3", createdAt:"2024-06-01", lastActivity:"2024-06-10" },
  { id:"p2", projectId:"SP-1002", developerId:"d1", userId:"u2", customerName:"Apex Corp", customerPhone:"+91-98111-00002", customerEmail:"facilities@apex.com", customerAddress:"100 Business Park", customerCity:"Mumbai", customerPincode:"400001", customerState:"Maharashtra", customerType:"Commercial", pocName:"Rajesh Kumar", projectSize:45, projectUnit:"kW", laneId:"l3", enquiryType:"Hot", status:"Proposal Sent", assignedUserId:"u2", createdAt:"2024-05-20", lastActivity:"2024-06-05" },
  { id:"p3", projectId:"GW-1001", developerId:"d2", userId:"u4", customerName:"Warehouse Co.", customerPhone:"+91-98111-00003", customerEmail:"ops@warehouse.com", customerAddress:"200 Industrial Way", customerCity:"Pune", customerPincode:"411028", customerState:"Maharashtra", customerType:"Industrial", pocName:"Sunita Sharma", projectSize:120, projectUnit:"kW", laneId:"l1", enquiryType:"Cold", status:"Active", assignedUserId:"u4", createdAt:"2024-06-05", lastActivity:"2024-06-05" },
];

const SEED_NOTES = [
  { id:"n1", projectId:"p1", userId:"u3", userName:"Mia Chen", content:"Customer interested in battery backup.", attachments:[], createdAt:"2024-06-02T14:30:00Z" },
];

const SEED_DOCUMENTS = [
  { id:"doc1", projectId:"p1", title:"Site Survey Photos", name:"Site Survey Photos.pdf", type:"PDF", size:"2.3 MB", uploadDate:"2024-06-05", uploadedBy:"Mia Chen", uploadedById:"u3" },
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

let _dateFormatKey = "DD MMM YYYY"; // default, overridden by app
const fmtDate = (d) => { if (!d) return ""; try { const fmt = DATE_FORMATS.find(f=>f.key===_dateFormatKey)||DATE_FORMATS[4]; return fmt.fn(d); } catch { return String(d); }};
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
    mail:     <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    share:    <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    export:   <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    import:   <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    filter:   <svg {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    sort:     <svg {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    kanban:   <svg {...p}><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>,
    up:       <svg {...p}><polyline points="18 15 12 9 6 15"/></svg>,
    down:     <svg {...p}><polyline points="6 9 12 15 18 9"/></svg>,
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

// ── CITY FIELD (typeahead with custom cities) ─────────────────
const CityField = ({ value, onChange, label="City", required, customCities=[], onAddCity }) => {
  const { dark } = useTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value||"");
  const allCities = [...new Set([...INDIAN_CITIES, ...(customCities||[])])].sort();
  const filtered = q.length>0 ? allCities.filter(c=>c.toLowerCase().startsWith(q.toLowerCase())).slice(0,8) : [];
  const exactMatch = allCities.some(c=>c.toLowerCase()===q.toLowerCase());
  const pick = (c) => { setQ(c); onChange(c); setOpen(false); };
  const addCustom = () => {
    if (q.trim() && !exactMatch) {
      if (onAddCity) onAddCity(q.trim());
      pick(q.trim());
    }
  };
  return (
    <div className="mb-4 relative">
      {label&&<label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>{label}{required&&<span className="text-amber-400 ml-1">*</span>}</label>}
      <input value={q} onChange={e=>{setQ(e.target.value);onChange(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),200)} placeholder="Type city name…"
        className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none text-sm transition-colors ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-amber-400","bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-amber-500")}`}/>
      {open&&(filtered.length>0||(!exactMatch&&q.length>1))&&(
        <div className={`absolute z-30 w-full mt-1 border rounded-xl shadow-xl overflow-hidden ${tc(dark,"bg-slate-800 border-slate-600","bg-white border-slate-200")}`}>
          {filtered.map(c=>(
            <button key={c} type="button" onMouseDown={()=>pick(c)} className={`w-full text-left px-4 py-2 text-sm transition-colors ${tc(dark,"text-white hover:bg-slate-700","text-slate-800 hover:bg-slate-50")}`}>{c}</button>
          ))}
          {!exactMatch&&q.length>1&&(
            <button type="button" onMouseDown={addCustom} className={`w-full text-left px-4 py-2 text-sm font-medium border-t ${tc(dark,"text-amber-400 hover:bg-slate-700 border-slate-700","text-amber-600 hover:bg-amber-50 border-slate-200")}`}>
              + Add "{q}" as custom city
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ── PHONE FIELD (country code + number) ──────────────────────
const PhoneField = ({ value, onChange, label="Phone", required }) => {
  const { dark } = useTheme();
  const [cc, setCC] = useState("+91");
  const [num, setNum] = useState("");
  // parse existing value on mount
  useEffect(() => {
    if (value) {
      const m = value.match(/^(\+\d{1,4})\s*(.*)$/);
      if (m) { setCC(m[1]); setNum(m[2]); } else setNum(value);
    }
  }, []);
  const update = (newCC, newNum) => { setCC(newCC); setNum(newNum); onChange(`${newCC} ${newNum}`); };
  const inpCls = `border rounded-r-lg px-3 py-2.5 focus:outline-none text-sm flex-1 min-w-0 transition-colors ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-amber-400","bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-amber-500")}`;
  const selCls = `border border-r-0 rounded-l-lg px-2 py-2.5 focus:outline-none text-xs transition-colors ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`;
  return (
    <div className="mb-4">
      {label&&<label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>{label}{required&&<span className="text-amber-400 ml-1">*</span>}</label>}
      <div className="flex">
        <select value={cc} onChange={e=>update(e.target.value,num)} className={selCls}>
          {COUNTRY_CODES.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}
        </select>
        <input value={num} onChange={e=>{const v=e.target.value.replace(/\D/g,"");setNum(v);onChange(`${cc} ${v}`);}} placeholder="Phone number" className={inpCls}/>
      </div>
    </div>
  );
};

// ── DOWNLOAD PDF HELPER ───────────────────────────────────────
const downloadHTML = (html, filename) => {
  // Use print with auto-save workaround — opens in a new window with onload=print
  const blob = new Blob([html], {type:"text/html"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
};

// ── SHARE HELPERS (WhatsApp + Email) ─────────────────────────
const shareWhatsApp = (phone, message) => {
  const cleaned = phone?.replace(/\D/g,"") || "";
  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};
const shareMail = (email, subject, body) => {
  window.open(`mailto:${email||""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
};
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
    <div className={`border-b px-6 py-2.5 flex items-center gap-3 ${tc(dark,"bg-amber-500/10 border-amber-500/30","bg-amber-50 border-amber-300")}`}>
      <Icon name="bell" size={16}/><span className={`text-sm font-medium flex-1 ${tc(dark,"text-amber-400","text-slate-900")}`}>⏰ Your {developer.plan} plan expires in <strong>{days} day{days!==1?"s":""}</strong>. Contact your account manager to renew before losing access.</span>
    </div>
  );
  return null;
};

// ── LOCKED PAGE (subscription expired) ───────────────────────
const LockedPage = ({ developer, reason }) => {
  const { dark } = useTheme();
  const days = daysUntil(developer?.subscriptionEnd || "2000-01-01");
  const isInactive = reason === "inactive";
  const isPaused = reason === "paused" || developer?.paused;
  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] text-center p-8`}>
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20"><Icon name="lock" size={36}/></div>
      <h2 className={`text-2xl font-black mb-2 ${tc(dark,"text-white","text-slate-800")}`}>
        {isInactive ? "Account Inactive" : isPaused ? "Subscription Paused" : "Subscription Expired"}
      </h2>
      <p className={`text-base mb-4 max-w-md ${tc(dark,"text-slate-400","text-slate-500")}`}>
        {isInactive ? "Your account has been deactivated by the admin." : isPaused ? "Your account has been paused by the platform admin." : `Your ${developer?.plan} plan expired ${Math.abs(days)} day${Math.abs(days)!==1?"s":""} ago.`}
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
  const { net, gst, total } = calcInvoiceTotal(inv.items||[]);
  const docType = inv.docType || "Tax Invoice";
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
  const displayDate = fmtDate(inv.date||new Date().toISOString().slice(0,10));
  return `<!DOCTYPE html><html><head><title>${docType} - ${inv.id.toUpperCase()}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#404040;background:#fff}@page{margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
  </head><body>
  <div style="padding:40px 56px">
    <div style="text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #5c6ac4">
      <div style="font-size:22px;font-weight:900;color:#5c6ac4;letter-spacing:2px;text-transform:uppercase">${docType}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <tr>
        <td style="vertical-align:top;width:100%">${logoTag}<div style="font-size:13px;color:#525252">${developer?.address||""}<br/>${developer?.phone||""} | ${developer?.email||""}</div></td>
        <td style="vertical-align:top;white-space:nowrap;text-align:right">
          <div style="font-size:13px;color:#94a3b8">Date</div>
          <div style="font-size:14px;font-weight:700;color:#5c6ac4">${displayDate}</div>
          <div style="font-size:13px;color:#94a3b8;margin-top:8px">Doc #</div>
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
  setTimeout(()=>{ w.print(); },700);
};

const downloadInvoice = (inv, developer, customer) => {
  const html = buildInvoiceHTML({ inv, developer, customer });
  const cxName = (inv.customerName||"Customer").replace(/\s+/g,"_");
  const docType = (inv.docType||"Invoice").replace(/\s+/g,"_");
  const filename = `${docType}_${cxName}_${inv.id}.html`;
  downloadHTML(html, filename);
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
              <div className="col-span-2"><select value={item.gst} onChange={e=>updateItem(i,"gst",parseFloat(e.target.value))} className={`w-full text-sm px-2 py-1.5 rounded-lg border ${tc(dark,"bg-slate-700 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")} focus:outline-none`}>{[0,5,8.9,12,13.8,18,28].map(r=><option key={r} value={r}>{r}%</option>)}</select></div>
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
const InvoiceListView = ({ invoices, developers, projects, users, onView, onPrint, onDownload, onMarkPaid, onConvert, currentUser, developer }) => {
  const { dark } = useTheme();
  const [q, setQ] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [docTypeFilter, setDocTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const filtered = [...invoices]
    .sort((a,b)=>{
      if (sortBy==="date-desc") return new Date(b.date)-new Date(a.date);
      if (sortBy==="date-asc")  return new Date(a.date)-new Date(b.date);
      if (sortBy==="amount-desc") return (calcInvoiceTotal(b.items||[]).total||b.amount||0)-(calcInvoiceTotal(a.items||[]).total||a.amount||0);
      if (sortBy==="amount-asc")  return (calcInvoiceTotal(a.items||[]).total||a.amount||0)-(calcInvoiceTotal(b.items||[]).total||b.amount||0);
      return 0;
    })
    .filter(inv=>{
      if (!applyDateFilter(inv.date, dateFilter, fromDate, toDate)) return false;
      if (statusFilter!=="all" && inv.status!==statusFilter) return false;
      if (docTypeFilter!=="all" && (inv.docType||"Tax Invoice")!==docTypeFilter) return false;
      if (q) {
        const qs=q.toLowerCase();
        const proj=projects?.find(p=>p.id===inv.projectId);
        if (![inv.id,inv.customerName,proj?.customerName,inv.docType].some(x=>(x||"").toLowerCase().includes(qs))) return false;
      }
      return true;
    });

  const selCls = `border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none transition-colors ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`;

  const getShareData = inv => {
    const dev = developers?.find(d=>d.id===inv.developerId) || developer;
    const proj = projects?.find(p=>p.id===inv.projectId);
    const {total}=calcInvoiceTotal(inv.items||[]);
    const phone = inv.customerPhone || proj?.customerPhone || "";
    const email = inv.customerEmail || proj?.customerEmail || "";
    const cxName = inv.customerName || proj?.customerName || "Customer";
    const size = proj ? `${proj.projectSize} ${proj.projectUnit||"kW"}` : "";
    const type = proj?.customerType || "";
    const docT = inv.docType||"Tax Invoice";
    const invoiceMsg = `Hi ${cxName},\n\nHere is your ${docT} (${inv.id.toUpperCase()}) for your ${size} ${type} solar project worth ${fmtINR(total)}.\n\nPlease review and let us know if you have any questions.\n\nRegards,\n${dev?.companyName||""}`;
    const invSubject = `${docT} - ${inv.id.toUpperCase()} | ${dev?.companyName||""}`;
    return {phone, email, msg:invoiceMsg, subject:invSubject};
  };

  return (
    <div>
      {/* Filter + Search bar */}
      <div className={`border rounded-xl p-3 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="flex-1 min-w-40">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search invoice #, customer, type…" className={`w-full ${selCls}`}/>
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className={selCls}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={dateFilter} onChange={e=>setDateFilter(e.target.value)} className={selCls}>
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="15d">Last 15 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="lastmonth">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
          {dateFilter==="custom"&&<>
            <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className={selCls}/>
            <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>to</span>
            <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className={selCls}/>
          </>}
          <select value={docTypeFilter} onChange={e=>setDocTypeFilter(e.target.value)} className={selCls}>
            <option value="all">All Doc Types</option>
            {INV_DOC_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className={selCls}>
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Paid">Paid</option>
          </select>
          <span className={`text-xs ml-auto ${tc(dark,"text-slate-400","text-slate-500")}`}>{filtered.length} record{filtered.length!==1?"s":""}</span>
        </div>
      </div>

      {!filtered.length ? (
        <div className={`text-center py-16 border rounded-xl ${tc(dark,"bg-[#0c1929] border-slate-700","bg-white border-slate-200")}`}>
          <Icon name="invoice" size={28}/><p className={`mt-2 ${tc(dark,"text-slate-400","text-slate-500")}`}>No records match filters.</p>
        </div>
      ) : (
        <div className={`border rounded-xl overflow-hidden ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <table className="w-full text-sm">
            <thead><tr className={`border-b ${tc(dark,"border-slate-700 bg-slate-800/30","border-slate-200 bg-slate-50")}`}>
              {["Doc #","Type","Customer","Amount","Date","Status","Actions"].map(h=>(
                <th key={h} className={`text-left px-3 py-3 font-medium text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(inv=>{
                const dev = developers?.find(d=>d.id===inv.developerId);
                const proj= projects?.find(p=>p.id===inv.projectId);
                const { total } = calcInvoiceTotal(inv.items||[]);
                const displayAmt = total || inv.amount || 0;
                const share = getShareData(inv);
                const convertTargets = INV_CONVERT_TARGETS[inv.docType]||[];
                return (
                  <tr key={inv.id} className={`border-b transition-colors ${tc(dark,"border-slate-700/30 hover:bg-slate-800/20","border-slate-100 hover:bg-slate-50")}`}>
                    <td className={`px-3 py-3 font-mono text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{inv.id.toUpperCase()}</td>
                    <td className="px-3 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${tc(dark,"bg-amber-500/20 text-amber-300","bg-amber-100 text-amber-700")}`}>{inv.docType||"Tax Invoice"}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className={`font-medium text-xs ${tc(dark,"text-white","text-slate-800")}`}>{inv.customerName || dev?.companyName || "—"}</div>
                      {proj && <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{proj.customerName}</div>}
                    </td>
                    <td className={`px-3 py-3 font-bold text-xs ${tc(dark,"text-white","text-slate-800")}`}>{fmtINR(displayAmt)}</td>
                    <td className={`px-3 py-3 text-xs whitespace-nowrap ${tc(dark,"text-slate-400","text-slate-500")}`}>{fmtDate(inv.date)}</td>
                    <td className="px-3 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(inv.status,dark)}`}>{inv.status}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1 flex-wrap">
                        <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onView(inv)}><Icon name="eye" size={12}/></Btn>
                        <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onPrint(inv)}><Icon name="print" size={12}/>Print</Btn>
                        <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onDownload&&onDownload(inv)}><Icon name="download" size={12}/>PDF</Btn>
                        {share.phone&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>shareWhatsApp(share.phone, share.msg)}><span className="text-emerald-400 font-bold text-xs">WA</span></Btn>}
                        {share.email&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>shareMail(share.email, share.subject, share.msg)}><Icon name="mail" size={12}/></Btn>}
                        {inv.status==="Pending"&&onMarkPaid&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onMarkPaid(inv.id)}><Icon name="check" size={12}/>Paid</Btn>}
                        {convertTargets.length>0&&onConvert&&convertTargets.map(target=>(
                          <Btn key={target} size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onConvert(inv,target)} title={`Convert to ${target}`}>
                            <span className="text-sky-400 text-xs whitespace-nowrap">→ {target.replace("Invoice","Inv.").replace("Challan","Challan").replace("Order","Order")}</span>
                          </Btn>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

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
    {id:"my-settings",label:"My Settings",icon:"settings"},
  ];
  const devNav = [
    {id:"dashboard",label:"Dashboard",icon:"home"},
    {id:"projects",label:"Projects",icon:"folder"},
    {id:"team",label:"My Team",icon:"users"},
    {id:"invoices",label:"Invoices",icon:"invoice"},
    {id:"templates",label:"Templates",icon:"template"},
    {id:"settings",label:"Settings",icon:"settings"},
    {id:"my-settings",label:"My Profile",icon:"user"},
  ];
  const userNav = [
    {id:"dashboard",label:"Dashboard",icon:"home"},
    {id:"projects",label:"Projects",icon:"folder"},
    {id:"invoices",label:"Invoices",icon:"invoice"},
    {id:"my-settings",label:"My Profile",icon:"user"},
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
    const score = devUsers.length*5 + devProjects.length*5 + devProposals.length*5 + devInvoices.length*5;
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
    const score      = uProjects.length*5 + uProposals.length*5 + uInvoices.length*5;
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

  const blank = { companyName:"",email:"",phone:"",address:"",city:"",pincode:"",website:"",seats:5,plan:"Starter",planDuration:"Monthly",subscriptionStart:TODAY,subscriptionEnd:addMonths(TODAY,1),logo:null,stamp:null,signature:null,electricityPrice:8.5,solarGenerationFactor:1350,costPerKW:50000,bankDetails:"",terms:"",paymentTerms:"",customerScope:"",companyScope:"",gstIn:"",adminName:"",adminPassword:"",permissions:[],invoicePrefix:"INV",invoiceNextNum:1001 };
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
    // Platform invoices use SA's prefix/number from users state
    const saUser = users.find(u=>u.role===ROLES.SUPER_ADMIN);
    const prefix = saUser?.invoicePrefix||"SP";
    const num    = saUser?.invoiceNextNum||1001;
    if (saUser) setUsers(us=>us.map(u=>u.id===saUser.id?{...u,invoiceNextNum:(u.invoiceNextNum||1001)+1}:u));
    const inv = { id:`${prefix}-${num}`, type:"platform", developerId:dev.id, amount:PLAN_PRICES[dev.plan]||4999, status:"Pending", date:TODAY, plan:dev.plan, planDuration:dev.planDuration, customerName:dev.companyName, customerAddress:[dev.address,dev.city,dev.pincode].filter(Boolean).join(", "), customerPhone:dev.phone, customerEmail:dev.email, items:[{name:`${dev.plan} Plan — ${dev.planDuration}`,qty:1,price:PLAN_PRICES[dev.plan]||4999,gst:18}], notes:"" };
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
            <Field label="Invoice Prefix" value={form.invoicePrefix||"INV"} onChange={v=>F("invoicePrefix",v)} placeholder="INV" hint="e.g. INV, SP, GW"/>
            <Field label="Invoice Start Number" type="number" value={form.invoiceNextNum||1001} onChange={v=>F("invoiceNextNum",parseInt(v)||1001)} hint="Next invoice will use this number"/>
          </div>
          <Field label="Street Address" type="textarea" rows={2} value={form.address||""} onChange={v=>F("address",v)}/>
          <div className="grid grid-cols-2 gap-3">
            <CityField label="City" value={form.city||""} onChange={v=>F("city",v)}/>
            <Field label="Pincode" value={form.pincode||""} onChange={v=>F("pincode",v)} placeholder="400001"/>
          </div>
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

// ── MY SETTINGS PAGE (for ALL users — profile, logo, bank, stamp, signature, invoice) ──
const MySettingsPage = ({ currentUser, setUsers, developers, setDevelopers }) => {
  const { dark } = useTheme();
  const isSA = currentUser.role === ROLES.SUPER_ADMIN;
  const dev  = developers?.find(d=>d.id===currentUser.developerId);

  // For SA: edit own user record; for Dev/User: edit developer record + user record
  const [uForm, setUForm] = useState({ name:currentUser.name||"", phone:currentUser.phone||"", email:currentUser.email||"", password:"", companyName:currentUser.companyName||"SolarPro Platform", address:currentUser.address||"", city:currentUser.city||"", pincode:currentUser.pincode||"", logo:currentUser.logo||null, stamp:currentUser.stamp||null, signature:currentUser.signature||null, bankDetails:currentUser.bankDetails||"", invoicePrefix:currentUser.invoicePrefix||"SP", invoiceNextNum:currentUser.invoiceNextNum||1001 });
  const [dForm, setDForm] = useState(dev ? {...dev} : null);
  const UF = (k,v) => setUForm(f=>({...f,[k]:v}));
  const DF = (k,v) => setDForm(f=>({...f,[k]:v}));

  const saveUser = () => {
    setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,...uForm,password:uForm.password||u.password}:u));
    alert("Profile saved!");
  };
  const saveDev = () => {
    if (dForm) setDevelopers(ds=>ds.map(d=>d.id===dForm.id?{...d,...dForm}:d));
    alert("Company settings saved!");
  };

  const ImgUpload = ({value, onChange, label}) => {
    const ref = useRef();
    return (
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>{label}</label>
        <div className="flex items-center gap-3">
          {value
            ? <img src={value} alt={label} className="w-16 h-16 rounded-xl object-contain border border-slate-600 bg-white p-1"/>
            : <div className={`w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center ${tc(dark,"border-slate-600 text-slate-500","border-slate-300 text-slate-400")}`}><Icon name="image" size={22}/></div>
          }
          <div>
            <input ref={ref} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onChange(ev.target.result);r.readAsDataURL(f);}} className="hidden"/>
            <Btn size="sm" variant="outline" onClick={()=>ref.current?.click()}><Icon name="upload" size={14}/>Upload</Btn>
            {value&&<button onClick={()=>onChange(null)} className="ml-2 text-xs text-red-400 hover:text-red-300">Remove</button>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className={`text-xl font-bold mb-1 ${tc(dark,"text-white","text-slate-800")}`}>My Profile & Settings</h1>
      <p className={`text-sm mb-5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Update your personal and company information</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Personal Details */}
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Personal Details</h3>
          <Field label="Full Name" value={uForm.name} onChange={v=>UF("name",v)}/>
          <Field label="Email" type="email" value={uForm.email} onChange={v=>UF("email",v)}/>
          <Field label="Phone" value={uForm.phone} onChange={v=>UF("phone",v)}/>
          <Field label="New Password" type="password" value={uForm.password} onChange={v=>UF("password",v)} hint="Leave blank to keep current password"/>
          <Btn onClick={saveUser}><Icon name="check" size={15}/>Save Profile</Btn>
        </div>

        {/* Super Admin: own company settings */}
        {isSA&&(
          <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
            <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Platform Company Details</h3>
            <Field label="Company Name" value={uForm.companyName} onChange={v=>UF("companyName",v)}/>
            <Field label="Address" type="textarea" rows={2} value={uForm.address||""} onChange={v=>UF("address",v)}/>
            <div className="grid grid-cols-2 gap-3">
              <CityField label="City" value={uForm.city||""} onChange={v=>UF("city",v)}/>
              <Field label="Pincode" value={uForm.pincode||""} onChange={v=>UF("pincode",v)} placeholder="400001"/>
            </div>
            <Field label="Bank Details" type="textarea" rows={3} value={uForm.bankDetails||""} onChange={v=>UF("bankDetails",v)}/>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Invoice Prefix" value={uForm.invoicePrefix||"SP"} onChange={v=>UF("invoicePrefix",v)} hint="e.g. SP, INV"/>
              <Field label="Next Invoice #" type="number" value={uForm.invoiceNextNum||1001} onChange={v=>UF("invoiceNextNum",parseInt(v)||1001)}/>
            </div>
            <Btn onClick={saveUser}><Icon name="check" size={15}/>Save Platform Settings</Btn>
          </div>
        )}
      </div>

      {/* Branding: Logo, Stamp, Signature (SA edits own; Dev edits developer record) */}
      <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
        <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Branding & Signatures</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {isSA ? (
            <>
              <ImgUpload label="Company Logo" value={uForm.logo} onChange={v=>UF("logo",v)}/>
              <ImgUpload label="Company Stamp" value={uForm.stamp} onChange={v=>UF("stamp",v)}/>
              <ImgUpload label="Signature" value={uForm.signature} onChange={v=>UF("signature",v)}/>
            </>
          ) : dForm ? (
            <>
              <ImgUpload label="Company Logo" value={dForm.logo} onChange={v=>DF("logo",v)}/>
              <ImgUpload label="Company Stamp" value={dForm.stamp} onChange={v=>DF("stamp",v)}/>
              <ImgUpload label="Signature" value={dForm.signature} onChange={v=>DF("signature",v)}/>
            </>
          ) : null}
        </div>
        {!isSA&&dForm&&<Btn onClick={saveDev} className="mt-2"><Icon name="check" size={15}/>Save Branding</Btn>}
        {isSA&&<Btn onClick={saveUser} className="mt-2"><Icon name="check" size={15}/>Save Branding</Btn>}
      </div>

      {/* Dev Admin invoice & company settings */}
      {!isSA&&dForm&&(
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Company & Invoice Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company Name" value={dForm.companyName} onChange={v=>DF("companyName",v)}/>
            <Field label="Phone" value={dForm.phone||""} onChange={v=>DF("phone",v)}/>
            <Field label="Invoice Prefix" value={dForm.invoicePrefix||"INV"} onChange={v=>DF("invoicePrefix",v)} hint="e.g. INV, SP"/>
            <Field label="Next Invoice #" type="number" value={dForm.invoiceNextNum||1001} onChange={v=>DF("invoiceNextNum",parseInt(v)||1001)}/>
          </div>
          <Field label="Bank Details" type="textarea" rows={3} value={dForm.bankDetails||""} onChange={v=>DF("bankDetails",v)}/>
          <Btn onClick={saveDev}><Icon name="check" size={15}/>Save Company Settings</Btn>
        </div>
      )}
    </div>
  );
};

// ── SUPER ADMIN INVOICES PAGE ──────────────────────────────────
const SuperAdminInvoicesPage = ({ invoices, setInvoices, developers, projects, users, currentUser }) => {
  const { dark } = useTheme();
  const [viewInv, setViewInv] = useState(null);
  const platformInvoices = invoices;

  // For SA-created invoices (no dev), use SA's own profile as the "developer"
  const getSender = inv => {
    const dev = developers?.find(d=>d.id===inv.developerId);
    if (dev) return dev;
    // SA invoice — use SA user's settings
    const sa = users?.find(u=>u.role===ROLES.SUPER_ADMIN);
    return { companyName:sa?.companyName||"SolarPro Platform", address:[sa?.address,sa?.city,sa?.pincode].filter(Boolean).join(", "), phone:sa?.phone||"", email:sa?.email||"", logo:sa?.logo||null, bankDetails:sa?.bankDetails||"", stamp:sa?.stamp||null, signature:sa?.signature||null };
  };
  const getCustomer = inv => ({ name: inv.customerName, address: inv.customerAddress, phone: inv.customerPhone, email: inv.customerEmail });

  return (
    <div>
      <h1 className={`text-xl font-bold mb-1 ${tc(dark,"text-white","text-slate-800")}`}>All Invoices</h1>
      <p className={`text-sm mb-5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Platform subscription and project invoices</p>
      <InvoiceListView invoices={platformInvoices} developers={developers} projects={projects} users={users}
        onView={inv=>setViewInv(inv)}
        onPrint={inv=>printInvoice(inv, getSender(inv), getCustomer(inv))}
        onDownload={inv=>downloadInvoice(inv, getSender(inv), getCustomer(inv))}
        onMarkPaid={id=>setInvoices(is=>is.map(i=>i.id===id?{...i,status:"Paid"}:i))}
        onConvert={(inv,newType)=>setInvoices(is=>is.map(i=>i.id===inv.id?{...i,docType:newType,id:`${inv.id}-${newType.split(" ")[0].toLowerCase()}`}:i))}
        currentUser={null}/>
      {viewInv&&(
        <Modal title={`${viewInv.docType||"Invoice"} — ${viewInv.id.toUpperCase()}`} onClose={()=>setViewInv(null)} wide>
          <InvoicePreviewContent inv={viewInv} developer={getSender(viewInv)} customer={getCustomer(viewInv)}/>
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-slate-700">
            <Btn onClick={()=>printInvoice(viewInv,getSender(viewInv),getCustomer(viewInv))}><Icon name="print" size={15}/>Print</Btn>
            <Btn variant="outline" onClick={()=>downloadInvoice(viewInv,getSender(viewInv),getCustomer(viewInv))}><Icon name="download" size={15}/>Download PDF</Btn>
            {viewInv.customerPhone&&<Btn variant="outline" onClick={()=>shareWhatsApp(viewInv.customerPhone,`Hi ${viewInv.customerName}, here is your ${viewInv.docType||"Invoice"} ${viewInv.id}. Regards, ${getSender(viewInv)?.companyName||""}`)}>WA WhatsApp</Btn>}
            {viewInv.customerEmail&&<Btn variant="outline" onClick={()=>shareMail(viewInv.customerEmail,`${viewInv.docType||"Invoice"} - ${viewInv.id}`,`Hi ${viewInv.customerName},\n\nPlease find attached your ${viewInv.docType||"Invoice"} (${viewInv.id}).\n\nRegards,\n${getSender(viewInv)?.companyName||""}`)}><Icon name="mail" size={15}/>Email</Btn>}
            <Btn variant="secondary" onClick={()=>setViewInv(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── CREATE INVOICE PAGE (Super Admin) ─────────────────────────
const CreateInvoicePage = ({ developers, setDevelopers, users, setUsers, projects, invoices, setInvoices, currentUser }) => {
  const { dark } = useTheme();
  const [selectedDev, setSelectedDev] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [items, setItems] = useState([{name:"",qty:1,price:0,gst:18}]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Pending");
  const [docType, setDocType] = useState("Proforma Invoice");
  const [preview, setPreview] = useState(null);

  const devUsers = users.filter(u=>u.developerId===selectedDev && u.role!==ROLES.SUPER_ADMIN);
  const targetUser = users.find(u=>u.id===selectedUser);
  const dev = developers.find(d=>d.id===selectedDev);

  const generate = () => {
    const {total}=calcInvoiceTotal(items);
    const saUser = users.find(u=>u.id===currentUser?.id);
    const prefix = dev?.invoicePrefix || saUser?.invoicePrefix || "SP";
    const num    = dev?.invoiceNextNum || saUser?.invoiceNextNum || 1001;
    const invId  = `${prefix}-${num}`;
    if (dev) setDevelopers(ds=>ds.map(d=>d.id===dev.id?{...d,invoiceNextNum:(d.invoiceNextNum||1001)+1}:d));
    else setUsers(us=>us.map(u=>u.id===currentUser?.id?{...u,invoiceNextNum:(u.invoiceNextNum||1001)+1}:u));
    const inv = {
      id:invId, docType,
      type:"platform", developerId:selectedDev, userId:selectedUser,
      amount:total, status, date:TODAY,
      customerName: targetUser?.name || dev?.companyName || "",
      customerAddress: [dev?.address,dev?.city,dev?.pincode].filter(Boolean).join(", "),
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
        {/* Document Type selector with flow info */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${tc(dark,"text-slate-300","text-slate-700")}`}>Document Type</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {INV_DOC_TYPES.map(t=>(
              <button key={t} onClick={()=>setDocType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${docType===t?"bg-amber-500 text-slate-900 border-amber-400":tc(dark,"border-slate-600 text-slate-400 hover:border-amber-400 hover:text-white","border-slate-300 text-slate-500 hover:border-amber-400 hover:text-slate-800")}`}>{t}</button>
            ))}
          </div>
          {docType==="Proforma Invoice"&&<p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>📋 Preliminary estimate. Can be converted → Sales Order → Delivery Challan → Tax Invoice</p>}
          {docType==="Tax Invoice"&&<p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>🧾 Official tax invoice with GST. Final billing document sent for payment.</p>}
          {docType==="Sales Order"&&<p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>📦 Confirmed order after buyer accepts proforma. Next: Delivery Challan.</p>}
          {docType==="Purchase Order"&&<p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>🛒 Buyer-issued order document for procurement.</p>}
          {docType==="Delivery Challan"&&<p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>🚚 Accompanies goods during delivery. Next: Convert to Tax Invoice.</p>}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Select Developer" type="select" value={selectedDev} onChange={v=>{setSelectedDev(v);setSelectedUser("");}}
            options={[{value:"",label:"— Select Developer —"},...developers.map(d=>({value:d.id,label:d.companyName}))]}/>
          {selectedDev&&(
            <Field label="Select User (optional)" type="select" value={selectedUser} onChange={setSelectedUser}
              options={[{value:"",label:"— Developer Account —"},...devUsers.map(u=>({value:u.id,label:u.name}))]}/>
          )}
          <Field label="Status" type="select" value={status} onChange={setStatus} options={["Draft","Pending","Sent","Accepted","Paid"]}/>
        </div>
        <InvoiceItemEditor items={items} setItems={setItems}/>
        <Field label="Notes" type="textarea" rows={2} value={notes} onChange={setNotes} placeholder="Additional notes for this invoice…"/>
        <Btn onClick={generate} disabled={!selectedDev||!items.length||!items[0].name}><Icon name="zap" size={15}/>Generate {docType}</Btn>
      </div>

      {preview&&(
        <Modal title={`${preview.docType} Generated`} onClose={()=>setPreview(null)} wide>
          <InvoicePreviewContent inv={preview} developer={dev} customer={{name:preview.customerName,address:preview.customerAddress,phone:preview.customerPhone,email:preview.customerEmail}}/>
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-slate-700">
            <Btn onClick={()=>printInvoice(preview,dev,{})}><Icon name="print" size={15}/>Print</Btn>
            <Btn variant="outline" onClick={()=>downloadInvoice(preview,dev,{})}><Icon name="download" size={15}/>Download PDF</Btn>
            {preview.customerPhone&&<Btn variant="outline" onClick={()=>shareWhatsApp(preview.customerPhone,`Hi ${preview.customerName}, here is your ${preview.docType} (${preview.id}) for ${fmtINR(calcInvoiceTotal(preview.items||[]).total)}. Regards, ${dev?.companyName||""}`)}><span className="text-emerald-400 font-bold text-sm">WA</span> WhatsApp</Btn>}
            {preview.customerEmail&&<Btn variant="outline" onClick={()=>shareMail(preview.customerEmail,`${preview.docType} - ${preview.id}`,`Hi ${preview.customerName},\n\nPlease find your ${preview.docType} (${preview.id}) for ${fmtINR(calcInvoiceTotal(preview.items||[]).total)}.\n\nRegards,\n${dev?.companyName||""}`)}><Icon name="mail" size={15}/>Email</Btn>}
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
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCompany, setFilterCompany] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const blank = { name:"", email:"", password:"", phone:"", role:ROLES.USER, permissions:[], active:true, paused:false };
  const [form, setForm] = useState(blank);
  const F = (k,v) => setForm(f=>({...f,[k]:v}));

  const isSuperAdmin = currentUser.role === ROLES.SUPER_ADMIN;

  const visibleUsers = isSuperAdmin
    ? users.filter(u => u.role !== ROLES.SUPER_ADMIN)
    : users.filter(u => u.developerId === currentUser.developerId && u.id !== currentUser.id);

  const filtered = visibleUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone||"").includes(search);
    const matchRole    = filterRole==="all" || u.role===filterRole;
    const matchCompany = filterCompany==="all" || u.developerId===filterCompany;
    const uStatus = u.paused?"paused":u.active?"active":"inactive";
    const matchStatus  = filterStatus==="all" || uStatus===filterStatus;
    return matchSearch && matchRole && matchCompany && matchStatus;
  });

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
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex-1 min-w-48"><SearchBar value={search} onChange={setSearch} placeholder="Search name, email, phone…"/></div>
        {isSuperAdmin&&<select value={filterCompany} onChange={e=>setFilterCompany(e.target.value)} className={`border rounded-lg px-2.5 py-2 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
          <option value="all">All Companies</option>
          {developers.map(d=><option key={d.id} value={d.id}>{d.companyName}</option>)}
        </select>}
        <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} className={`border rounded-lg px-2.5 py-2 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
          <option value="all">All Roles</option>
          <option value={ROLES.DEV_ADMIN}>Dev Admin</option>
          <option value={ROLES.USER}>User</option>
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className={`border rounded-lg px-2.5 py-2 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

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
const SettingsPage = ({ developer, setDevelopers, dateFormat, setDateFormat, projects, setProjects }) => {
  const { dark } = useTheme();
  const [form, setForm] = useState({...developer});
  const [settingsTab, setSettingsTab] = useState("company");
  const [newLane, setNewLane] = useState({name:"",color:"slate"});
  const [newUnit, setNewUnit] = useState("");
  const [confirmDeleteLane, setConfirmDeleteLane] = useState(null);
  const [laneTransferTarget, setLaneTransferTarget] = useState("");
  const F = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = () => { setDevelopers(ds=>ds.map(d=>d.id===developer.id?{...d,...form}:d)); alert("Settings saved!"); };

  const addLane = () => {
    if (!newLane.name.trim()) return;
    const lane = {id:`l${Date.now()}`,name:newLane.name,color:newLane.color,disabled:false,order:(form.lanes||[]).length};
    F("lanes",[...(form.lanes||[]),lane]);
    setNewLane({name:"",color:"slate"});
  };
  const updateLane = (id,changes) => F("lanes",(form.lanes||[]).map(l=>l.id===id?{...l,...changes}:l));
  const addCustomUnit = () => { if(newUnit.trim()) { F("customUnits",[...(form.customUnits||[]),newUnit.trim()]); setNewUnit(""); }};

  return (
    <div>
      <h1 className={`text-xl font-bold mb-1 ${tc(dark,"text-white","text-slate-800")}`}>Account Settings</h1>
      <p className={`text-sm mb-4 ${tc(dark,"text-slate-400","text-slate-500")}`}>Manage your company profile and solar variables</p>

      {/* Settings sub-tabs */}
      <div className={`flex gap-1 rounded-xl p-1 mb-5 w-fit border ${tc(dark,"bg-[#070e1c] border-slate-800","bg-slate-100 border-slate-200")}`}>
        {["company","solar","finance","invoices","projects","lanes"].map(t=>(
          <button key={t} onClick={()=>setSettingsTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${settingsTab===t?"bg-amber-500 text-slate-900":tc(dark,"text-slate-400 hover:text-white","text-slate-500 hover:text-slate-700")}`}>{t}</button>
        ))}
      </div>

      {settingsTab==="company"&&(
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <LogoUploader value={form.logo} onChange={v=>F("logo",v)}/>
          <Field label="Company Name" value={form.companyName} onChange={v=>F("companyName",v)}/>
          <Field label="Email" type="email" value={form.email} onChange={v=>F("email",v)}/>
          <Field label="Phone" value={form.phone} onChange={v=>F("phone",v)}/>
          <Field label="Website" value={form.website||""} onChange={v=>F("website",v)}/>
          <Field label="GSTIN" value={form.gstIn||""} onChange={v=>F("gstIn",v)}/>
          <Field label="Street Address" type="textarea" rows={2} value={form.address||""} onChange={v=>F("address",v)}/>
          <div className="grid grid-cols-2 gap-3">
            <CityField label="City" value={form.city||""} onChange={v=>F("city",v)} customCities={form.customCities||[]} onAddCity={c=>F("customCities",[...(form.customCities||[]),c])}/>
            <Field label="Pincode" value={form.pincode||""} onChange={v=>F("pincode",v)} placeholder="400001"/>
          </div>
        </div>
      )}

      {settingsTab==="solar"&&(
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <Field label="Electricity Price (₹/kWh)" type="number" value={form.electricityPrice} onChange={v=>F("electricityPrice",parseFloat(v)||0)}/>
          <Field label="Solar Gen Factor (kWh/kWp/yr)" type="number" value={form.solarGenerationFactor} onChange={v=>F("solarGenerationFactor",parseInt(v)||0)}/>
          <Field label="Cost per kW (₹)" type="number" value={form.costPerKW} onChange={v=>F("costPerKW",parseInt(v)||0)}/>
          <Field label="Customer Scope" type="textarea" rows={2} value={form.customerScope||""} onChange={v=>F("customerScope",v)}/>
          <Field label="Company Scope" type="textarea" rows={2} value={form.companyScope||""} onChange={v=>F("companyScope",v)}/>
        </div>
      )}

      {settingsTab==="finance"&&(
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <Field label="Payment Terms" type="textarea" rows={4} value={form.paymentTerms||""} onChange={v=>F("paymentTerms",v)} placeholder={"50% advance\n25% on delivery\n25% on completion"}/>
          <Field label="Bank Details" type="textarea" rows={4} value={form.bankDetails||""} onChange={v=>F("bankDetails",v)}/>
          <Field label="Terms & Conditions" type="textarea" rows={3} value={form.terms||""} onChange={v=>F("terms",v)}/>
        </div>
      )}

      {settingsTab==="invoices"&&(
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Invoice Prefix" value={form.invoicePrefix||"INV"} onChange={v=>F("invoicePrefix",v)} hint="e.g. INV, SP, GW"/>
            <Field label="Invoice Start Number" type="number" value={form.invoiceNextNum||1001} onChange={v=>F("invoiceNextNum",parseInt(v)||1001)} hint="Next invoice number"/>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Date Format on Invoices & Documents</label>
            <select value={dateFormat} onChange={e=>setDateFormat(e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
              {DATE_FORMATS.map(f=><option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
            <p className={`text-xs mt-1 ${tc(dark,"text-slate-500","text-slate-400")}`}>Preview: {fmtDate(TODAY)}</p>
          </div>
        </div>
      )}

      {settingsTab==="projects"&&(
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Project ID Prefix" value={form.projectPrefix||"PRJ"} onChange={v=>F("projectPrefix",v)} hint="e.g. SP, PRJ, GW"/>
            <Field label="Project Start Number" type="number" value={form.projectNextNum||1001} onChange={v=>F("projectNextNum",parseInt(v)||1001)} hint="Next project number"/>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Default Project Unit</label>
            <select value={form.defaultProjectUnit||"kW"} onChange={e=>F("defaultProjectUnit",e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none mb-2 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
              {[...(form.customUnits||[]),...PROJECT_UNITS].filter((v,i,a)=>a.indexOf(v)===i).map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${tc(dark,"text-slate-300","text-slate-700")}`}>Custom Project Units</label>
            <div className="flex gap-2 mb-2">
              <input value={newUnit} onChange={e=>setNewUnit(e.target.value)} placeholder="Add unit (e.g. kVA, TR)" className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500","bg-white border-slate-300 text-slate-800")}`}/>
              <Btn size="sm" onClick={addCustomUnit}><Icon name="plus" size={13}/>Add</Btn>
            </div>
            <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${tc(dark,"text-slate-300","text-slate-700")}`}>Default Project Tags</label>
            <p className={`text-xs mb-2 ${tc(dark,"text-slate-400","text-slate-500")}`}>These tags are auto-suggested when creating new projects.</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.defaultTags||[]).map(t=><span key={t} className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${tc(dark,"bg-indigo-500/20 text-indigo-300","bg-indigo-100 text-indigo-700")}`}>#{t}<button onClick={()=>F("defaultTags",(form.defaultTags||[]).filter(x=>x!==t))} className="text-red-400 ml-1">×</button></span>)}
            </div>
            <div className="flex gap-2">
              <input id="defTagInput" placeholder="e.g. residential, rooftop…" onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){F("defaultTags",[...(form.defaultTags||[]),e.target.value.trim()]);e.target.value="";}}} className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500","bg-white border-slate-300 text-slate-800")}`}/>
              <Btn size="sm" onClick={()=>{const inp=document.getElementById("defTagInput");if(inp?.value.trim()){F("defaultTags",[...(form.defaultTags||[]),inp.value.trim()]);inp.value="";}}}>Add</Btn>
            </div>
          </div>
          </div>
        </div>
      )}

      {settingsTab==="lanes"&&(
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Project Lanes / Status</h3>
          <p className={`text-xs mb-3 ${tc(dark,"text-slate-400","text-slate-500")}`}>Drag to reorder. Disabled lanes won't appear in project assignment.</p>
          <div className="space-y-2 mb-4">
            {[...(form.lanes||[])].sort((a,b)=>a.order-b.order).map((lane,i,arr)=>{
              const lc = LANE_COLORS.find(c=>c.key===lane.color)||LANE_COLORS[0];
              return (
              <div key={lane.id} draggable
                onDragStart={e=>e.dataTransfer.setData("laneId",lane.id)}
                onDragOver={e=>{e.preventDefault();}}
                onDrop={e=>{
                  e.preventDefault();
                  const dragId=e.dataTransfer.getData("laneId");
                  if(dragId===lane.id) return;
                  const lanes2=[...(form.lanes||[])].sort((a,b)=>a.order-b.order);
                  const fromIdx=lanes2.findIndex(l=>l.id===dragId);
                  const toIdx=lanes2.findIndex(l=>l.id===lane.id);
                  const item=lanes2.splice(fromIdx,1)[0];
                  lanes2.splice(toIdx,0,item);
                  lanes2.forEach((l,idx)=>l.order=idx);
                  F("lanes",[...lanes2]);
                }}
                className={`flex items-center gap-2 border rounded-xl p-3 cursor-grab ${tc(dark,"bg-slate-800/40 border-slate-700 hover:border-slate-500","bg-slate-50 border-slate-200 hover:border-slate-300")}`}>
                <span className={`text-slate-400 text-xs`}>⠿</span>
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${lc.tw}`}/>
                <span className={`flex-1 text-sm font-medium ${lane.disabled?tc(dark,"text-slate-500 line-through","text-slate-400 line-through"):tc(dark,"text-white","text-slate-800")}`}>{lane.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${lane.disabled?tc(dark,"bg-red-500/20 text-red-400","bg-red-100 text-red-600"):tc(dark,"bg-emerald-500/20 text-emerald-400","bg-emerald-100 text-emerald-700")}`}>{lane.disabled?"Disabled":"Active"}</span>
                <button onClick={()=>updateLane(lane.id,{disabled:!lane.disabled})} className={`text-xs px-2 py-1 rounded-lg transition-colors ${tc(dark,"bg-slate-700 text-amber-400 hover:bg-slate-600","bg-amber-50 text-amber-600 hover:bg-amber-100")}`}>{lane.disabled?"Enable":"Disable"}</button>
                <button onClick={()=>setConfirmDeleteLane(lane)} className={`p-1.5 rounded-lg transition-colors ${tc(dark,"bg-slate-700 text-red-400 hover:bg-red-500/20","bg-red-50 text-red-500 hover:bg-red-100")}`}><Icon name="trash" size={12}/></button>
              </div>
            );})}
          </div>
          {/* Confirm delete lane modal */}
          {confirmDeleteLane&&(
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className={`border rounded-2xl p-6 max-w-sm w-full shadow-2xl ${tc(dark,"bg-[#0c1929] border-slate-700","bg-white border-slate-200")}`}>
                <h3 className={`font-bold mb-2 ${tc(dark,"text-white","text-slate-800")}`}>Delete Lane: "{confirmDeleteLane.name}"?</h3>
                <p className={`text-sm mb-4 ${tc(dark,"text-slate-400","text-slate-500")}`}>All projects in this lane must be moved first. Where should they go?</p>
                <Field label="Move projects to" type="select" value={laneTransferTarget} onChange={setLaneTransferTarget}
                  options={[{value:"",label:"— Select target lane —"},...(form.lanes||[]).filter(l=>l.id!==confirmDeleteLane.id&&!l.disabled).map(l=>({value:l.id,label:l.name}))]}/>
                <div className="flex gap-3">
                  <Btn onClick={()=>{
                    if (!laneTransferTarget) return alert("Please select a target lane");
                    setProjects && setProjects(ps=>ps.map(p=>p.laneId===confirmDeleteLane.id?{...p,laneId:laneTransferTarget}:p));
                    F("lanes",(form.lanes||[]).filter(l=>l.id!==confirmDeleteLane.id));
                    setConfirmDeleteLane(null); setLaneTransferTarget("");
                  }} disabled={!laneTransferTarget} className="flex-1">Confirm Delete</Btn>
                  <Btn variant="secondary" onClick={()=>{setConfirmDeleteLane(null);setLaneTransferTarget("");}}>Cancel</Btn>
                </div>
              </div>
            </div>
          )}
          <div className={`border rounded-xl p-3 ${tc(dark,"bg-slate-800/30 border-slate-700","bg-slate-50 border-slate-200")}`}>
            <h4 className={`text-xs font-bold mb-2 ${tc(dark,"text-slate-400","text-slate-500")}`}>Add New Lane</h4>
            <div className="flex gap-2">
              <input value={newLane.name} onChange={e=>setNewLane(n=>({...n,name:e.target.value}))} placeholder="Lane name" className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none ${tc(dark,"bg-slate-700 border-slate-600 text-white placeholder-slate-500","bg-white border-slate-300 text-slate-800")}`}/>
              <div className="relative">
                <select value={newLane.color} onChange={e=>setNewLane(n=>({...n,color:e.target.value}))} className={`border rounded-lg pl-7 pr-3 py-2 text-sm ${tc(dark,"bg-slate-700 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                  {LANE_COLORS.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
                {(()=>{const lcc=LANE_COLORS.find(c=>c.key===newLane.color)||LANE_COLORS[0];return <div className={"absolute left-2 w-3 h-3 rounded-full "+lcc.tw} style={{top:"50%",transform:"translateY(-50%)"}}/>;})()}
              </div>
              <Btn size="sm" onClick={addLane} disabled={!newLane.name.trim()}><Icon name="plus" size={13}/>Add</Btn>
            </div>
          </div>
        </div>
      </div>
      </div>
      )}

      <div className="mt-4"><Btn onClick={save} size="lg"><Icon name="check" size={16}/>Save All Settings</Btn></div>
    </div>
  );
};

// ── PROJECTS PAGE — Complete v6 ──────────────────────────────
const ProjectsPage = ({ projects, setProjects, currentUser, setCurrentProjectId, developer, users, setDevelopers }) => {
  const { dark } = useTheme();
  const { toast } = useToast();
  const [view, setView] = useState("kanban");
  const [showAdd, setShowAdd] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [bulkTarget, setBulkTarget] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileInputRef = useRef();

  const allLanes = developer?.lanes?.sort((a,b)=>a.order-b.order) || [];
  const lanes = allLanes.filter(l=>!l.disabled);
  const devTeam = users ? users.filter(u=>u.developerId===currentUser.developerId && u.role!==ROLES.SUPER_ADMIN && u.active) : [];
  const customCities = developer?.customCities||[];

  // Filters
  const [filters, setFilters] = useState({
    q:"", projectId:"", customerName:"", customerPhone:"",
    customerTypes:[], assignedTos:[], enquiryTypes:[], laneIds:[],
    minSize:"", maxSize:"",
    dateFilter:"all", dateFrom:"", dateTo:"",
    city:"", pincode:"", state:"", address:"", tags:[],
  });
  const FF = (k,v) => setFilters(f=>({...f,[k]:v}));
  const toggleArrFilter = (k,v) => setFilters(f=>({...f,[k]:f[k].includes(v)?f[k].filter(x=>x!==v):[...f[k],v]}));

  const myProjects = projects.filter(p => {
    if (currentUser.role===ROLES.USER) return p.assignedUserId===currentUser.id || p.userId===currentUser.id;
    return p.developerId===currentUser.developerId;
  });

  const applyFilters = (list) => list.filter(p => {
    const qs = filters.q.toLowerCase();
    if (qs && ![p.customerName,p.projectId,p.customerAddress,p.customerCity,p.customerPincode,p.customerState,p.customerPhone,p.customerEmail].some(x=>(x||"").toLowerCase().includes(qs))) return false;
    if (filters.projectId && !p.projectId?.toLowerCase().includes(filters.projectId.toLowerCase())) return false;
    if (filters.customerName && !p.customerName?.toLowerCase().includes(filters.customerName.toLowerCase())) return false;
    if (filters.customerPhone && !(p.customerPhone||"").includes(filters.customerPhone)) return false;
    if (filters.city && !(p.customerCity||"").toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.pincode && !(p.customerPincode||"").includes(filters.pincode)) return false;
    if (filters.state && !(p.customerState||"").toLowerCase().includes(filters.state.toLowerCase())) return false;
    if (filters.address && !(p.customerAddress||"").toLowerCase().includes(filters.address.toLowerCase())) return false;
    if (filters.customerTypes.length && !filters.customerTypes.includes(p.customerType)) return false;
    if (filters.assignedTos.length && !filters.assignedTos.includes(p.assignedUserId||p.userId)) return false;
    if (filters.enquiryTypes.length && !filters.enquiryTypes.includes(p.enquiryType)) return false;
    if (filters.laneIds.length && !filters.laneIds.includes(p.laneId)) return false;
    if (filters.minSize && parseFloat(p.projectSize)<parseFloat(filters.minSize)) return false;
    if (filters.maxSize && parseFloat(p.projectSize)>parseFloat(filters.maxSize)) return false;
    if (filters.tags.length && !filters.tags.some(t=>(p.tags||[]).includes(t))) return false;
    if (!applyDateFilter(p.createdAt, filters.dateFilter, filters.dateFrom, filters.dateTo)) return false;
    return true;
  });

  const filteredProjects = applyFilters(myProjects);

  const blankForm = { customerName:"", customerType:"Residential", pocName:"", countryCode:"+91", customerPhone:"", customerEmail:"", customerPincode:"", customerCity:"", customerState:"", customerAddress:"", projectSize:"", projectUnit:developer?.defaultProjectUnit||"kW", enquiryType:"Warm", laneId:lanes[0]?.id||"", assignedUserId:currentUser.id, tags:[] };
  const [form, setForm] = useState(blankForm);
  const SF = (k,v) => setForm(f=>({...f,[k]:v}));

  // Auto Project ID (always based on latest, not editable by user)
  const getNextProjectId = () => {
    const prefix = developer?.projectPrefix || "PRJ";
    const num = developer?.projectNextNum || 1001;
    return `${prefix}-${num}`;
  };

  const onPincodeChange = (pin) => {
    SF("customerPincode", pin);
    if (pin.length===6 && PINCODE_MAP[pin]) {
      SF("customerCity", PINCODE_MAP[pin].city);
      SF("customerState", PINCODE_MAP[pin].state);
    }
  };

  const saveProject = (isEdit) => {
    const phone = form.customerPhone ? `${form.countryCode} ${form.customerPhone}`.trim() : "";
    let pid = isEdit ? editProject.projectId : getNextProjectId();
    if (!isEdit) setDevelopers(ds=>ds.map(d=>d.id===developer.id?{...d,projectNextNum:(d.projectNextNum||1001)+1}:d));
    const proj = {
      ...form,
      customerPhone: phone,
      projectId: pid,
      id: isEdit ? editProject.id : `p${Date.now()}`,
      developerId: currentUser.developerId,
      userId: form.assignedUserId||currentUser.id,
      assignedUserId: form.assignedUserId||currentUser.id,
      createdAt: isEdit ? editProject.createdAt : TODAY,
      lastActivity: TODAY,
      activityLog: isEdit ? (editProject.activityLog||[]) : [],
    };
    // add activity entry
    const entry = { action: isEdit?"Project Updated":"Project Created", date:TODAY, time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}), by:currentUser.name };
    proj.activityLog = [...(proj.activityLog||[]), entry];
    if (isEdit) setProjects(ps=>ps.map(p=>p.id===editProject.id?proj:p));
    else setProjects(ps=>[...ps,proj]);
    setShowAdd(false); setEditProject(null); setForm(blankForm);
    toast(isEdit?"Project updated successfully ✓":"Project created: "+pid);
  };

  const openEdit = (p) => {
    const parts = (p.customerPhone||"").split(" ");
    const cc = COUNTRY_CODES.find(c=>c.code===parts[0]) ? parts[0] : "+91";
    const num = COUNTRY_CODES.find(c=>c.code===parts[0]) ? parts.slice(1).join(" ") : p.customerPhone||"";
    setForm({...blankForm, ...p, countryCode:cc, customerPhone:num, tags:p.tags||[]});
    setEditProject(p);
    setShowAdd(true);
  };

  // Drag-drop lane change
  const handleDrop = (e, targetLaneId) => {
    e.preventDefault();
    const pid = e.dataTransfer.getData("projectId");
    if (!pid) return;
    const p = projects.find(x=>x.id===pid);
    if (!p) return;
    const entry = { action:`Moved to ${lanes.find(l=>l.id===targetLaneId)?.name||targetLaneId}`, date:TODAY, time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}), by:currentUser.name };
    setProjects(ps=>ps.map(x=>x.id===pid?{...x,laneId:targetLaneId,lastActivity:TODAY,activityLog:[...(x.activityLog||[]),entry]}:x));
    toast(`Moved to ${lanes.find(l=>l.id===targetLaneId)?.name||"lane"}`);
  };

  // Bulk operations
  const execBulkAction = () => {
    const ids = [...selectedIds];
    if (bulkAction==="move" && bulkTarget) {
      setProjects(ps=>ps.map(p=>ids.includes(p.id)?{...p,laneId:bulkTarget,lastActivity:TODAY}:p));
      toast(`Moved ${ids.length} project(s) to ${lanes.find(l=>l.id===bulkTarget)?.name}`);
    } else if (bulkAction==="assign" && bulkTarget) {
      setProjects(ps=>ps.map(p=>ids.includes(p.id)?{...p,assignedUserId:bulkTarget,lastActivity:TODAY}:p));
      toast(`Assigned ${ids.length} project(s) to ${devTeam.find(u=>u.id===bulkTarget)?.name}`);
    } else if (bulkAction==="delete") {
      const backup = projects.filter(p=>ids.includes(p.id));
      setProjects(ps=>ps.filter(p=>!ids.includes(p.id)));
      toast(`Deleted ${ids.length} project(s)`, ()=>setProjects(ps=>[...ps,...backup]), 30000);
    }
    setSelectedIds(new Set()); setShowBulkModal(false); setBulkAction(""); setBulkTarget("");
  };

  // Delete single
  const deleteProject = (p) => {
    setProjects(ps=>ps.filter(x=>x.id!==p.id));
    setConfirmDelete(null);
    toast(`Deleted "${p.customerName}"`, ()=>setProjects(ps=>[...ps,p]), 30000);
  };

  // Quick lane/assign change from card
  const quickUpdate = (pid, changes) => {
    const entry = Object.entries(changes).map(([k,v])=>`${k}→${v}`).join(", ");
    const logEntry = { action:`Updated: ${entry}`, date:TODAY, time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}), by:currentUser.name };
    setProjects(ps=>ps.map(p=>p.id===pid?{...p,...changes,lastActivity:TODAY,activityLog:[...(p.activityLog||[]),logEntry]}:p));
  };

  // Excel export
  const exportExcel = () => {
    const allUnits = [...new Set([...PROJECT_UNITS,...(developer?.customUnits||[])])];
    const rows = [["Project ID","Customer Name","Customer Type","Phone","Email","Pincode","City","State","Address","Project Size","Project Unit","Lane","Enquiry Type","Assigned To","Tags","Created At"]];
    filteredProjects.forEach(p=>{
      const user = devTeam.find(u=>u.id===(p.assignedUserId||p.userId));
      const lane = lanes.find(l=>l.id===p.laneId);
      rows.push([p.projectId||"",p.customerName||"",p.customerType||"",p.customerPhone||"",p.customerEmail||"",p.customerPincode||"",p.customerCity||"",p.customerState||"",p.customerAddress||"",p.projectSize||"",p.projectUnit||"kW",lane?.name||"",p.enquiryType||"",user?.name||"",(p.tags||[]).join("|"),p.createdAt||""]);
    });
    const escCsv=v=>'"'+String(v).split('"').join('""')+'"';
    const csv = rows.map(r=>r.map(escCsv).join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="projects_export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Download template with dropdowns (XLSX approach using CSV with data validation note)
  const downloadTemplate = () => {
    const laneNames = lanes.map(l=>l.name).join("|");
    const unitNames = [...new Set([...PROJECT_UNITS,...(developer?.customUnits||[])])].join("|");
    const enquiryOpts = "Hot|Warm|Cold";
    const typeOpts = "Residential|Commercial|Industrial|Government|Other";
    const assignedOpts = devTeam.map(u=>u.name).join("|");
    const header = ["Project ID (auto)","Customer Name*","Customer Type ("+typeOpts+")","Phone","Email","Pincode","City","State","Address","Project Size*","Unit ("+unitNames+")","Lane ("+laneNames+")","Enquiry ("+enquiryOpts+")","Assigned To ("+assignedOpts+")","Tags (pipe separated)"];
    const example = [getNextProjectId(),"John Doe","Residential","+91 9800000000","john@email.com","400001","Mumbai","Maharashtra","123 Street",10,"kW",lanes[0]?.name||"New Enquiry","Warm",devTeam[0]?.name||"","solar|residential"];
    const escCsv2=v=>'"'+String(v).split('"').join('""')+'"';
    const csv = [header,example].map(r=>r.map(escCsv2).join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="projects_import_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Import CSV
  const importExcel = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split("\n").slice(1).filter(l=>l.trim());
      let nextNum = developer?.projectNextNum || 1001;
      const imported = lines.map((line,i)=>{
        const cols = line.split(",").map(c=>c.replace(/^"|"$/g,"").trim());
        const prefix = developer?.projectPrefix || "PRJ";
        // Use existing project ID from col[0] if it looks valid, else auto-generate
        const rawId = cols[0]?.trim();
        const pid = (rawId && rawId !== "Project ID (auto)" && rawId.includes("-")) ? rawId : `${prefix}-${nextNum++}`;
        const laneByName = lanes.find(l=>l.name.toLowerCase()===cols[11]?.toLowerCase());
        const userByName = devTeam.find(u=>u.name.toLowerCase()===cols[13]?.toLowerCase());
        return { id:`p${Date.now()}${i}`, projectId:pid, customerName:cols[1]||"", customerType:cols[2]||"Residential", customerPhone:cols[3]||"", customerEmail:cols[4]||"", customerPincode:cols[5]||"", customerCity:cols[6]||"", customerState:cols[7]||"", customerAddress:cols[8]||"", projectSize:parseFloat(cols[9])||0, projectUnit:cols[10]||"kW", laneId:laneByName?.id||lanes[0]?.id||"", enquiryType:cols[12]||"Warm", assignedUserId:userByName?.id||currentUser.id, userId:userByName?.id||currentUser.id, tags:cols[14]?cols[14].split("|").filter(Boolean):[], developerId:currentUser.developerId, createdAt:TODAY, lastActivity:TODAY, activityLog:[{action:"Imported from CSV",date:TODAY,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),by:currentUser.name}] };
      });
      // update developer nextNum
      setDevelopers(ds=>ds.map(d=>d.id===developer.id?{...d,projectNextNum:nextNum}:d));
      setProjects(ps=>[...ps,...imported]);
      toast(`Imported ${imported.length} project(s) successfully`);
      setShowImport(false);
    };
    reader.readAsText(file);
    e.target.value="";
  };

  const addCustomCity = (city) => setDevelopers(ds=>ds.map(d=>d.id===developer?.id?{...d,customCities:[...(d.customCities||[]),city]}:d));

  // All tags in this developer's projects
  const allTags = [...new Set(myProjects.flatMap(p=>p.tags||[]))];

  const laneColorBorder = (color) => { const lc=LANE_COLORS.find(c=>c.key===color); return lc?lc.border:"border-slate-400"; };

  const typeColors = { Residential:"bg-sky-500/20 text-sky-300 border-sky-500/30", Commercial:"bg-amber-500/20 text-amber-300 border-amber-500/30", Industrial:"bg-purple-500/20 text-purple-300 border-purple-500/30", Government:"bg-emerald-500/20 text-emerald-300 border-emerald-500/30", Other:"bg-slate-500/20 text-slate-300 border-slate-500/30" };
  const typeColorsL = { Residential:"bg-sky-100 text-sky-700", Commercial:"bg-amber-100 text-amber-700", Industrial:"bg-purple-100 text-purple-700", Government:"bg-emerald-100 text-emerald-700", Other:"bg-slate-100 text-slate-600" };
  const enquiryColors = { Hot:"bg-red-500/20 text-red-300", Warm:"bg-orange-500/20 text-orange-300", Cold:"bg-sky-500/20 text-sky-300" };
  const enquiryColorsL = { Hot:"bg-red-100 text-red-700", Warm:"bg-orange-100 text-orange-700", Cold:"bg-sky-100 text-sky-700" };

  const isLocked = !currentUser?.active || (developer && (developer.paused || (developer.subscriptionEnd && new Date(developer.subscriptionEnd)<new Date())));
  if (isLocked) return <LockedPage developer={developer} reason={!currentUser?.active?"inactive":developer?.paused?"paused":"expired"}/>;

  // Multi-select helpers
  const toggleSelect = (id) => setSelectedIds(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleSelectAll = (ids) => setSelectedIds(s=>ids.every(id=>s.has(id))?new Set():new Set(ids));

  const MultiCheckbox = ({checked,onChange,partial})=>(
    <button onClick={onChange} className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${checked||partial?tc(dark,"bg-amber-500 border-amber-500","bg-amber-500 border-amber-500"):tc(dark,"border-slate-600 bg-slate-700/50","border-slate-300 bg-white")}`}>
      {checked&&<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {partial&&!checked&&<svg width="8" height="2" viewBox="0 0 8 2"><rect x="0" y="0.5" width="8" height="1" fill="white" rx="0.5"/></svg>}
    </button>
  );

  const ProjectCard = ({p}) => {
    const lane = allLanes.find(l=>l.id===p.laneId);
    const user = devTeam.find(u=>u.id===(p.assignedUserId||p.userId));
    const isSelected = selectedIds.has(p.id);
    return (
      <div draggable onDragStart={e=>e.dataTransfer.setData("projectId",p.id)}
        className={`border rounded-xl p-3 mb-2 transition-all cursor-pointer ${isSelected?tc(dark,"border-amber-500/70 bg-amber-500/5","border-amber-400 bg-amber-50"):tc(dark,"bg-[#0c1929] border-slate-700/50 hover:border-amber-500/30","bg-white border-slate-200 hover:border-amber-300 shadow-sm hover:shadow-md")}`}>
        <div className="flex items-start gap-2 mb-2">
          <MultiCheckbox checked={isSelected} onChange={()=>toggleSelect(p.id)}/>
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded flex-1 ${tc(dark,"bg-slate-700 text-slate-400","bg-slate-100 text-slate-500")}`}>{p.projectId||"—"}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${tc(dark,enquiryColors[p.enquiryType]||"bg-slate-500/20 text-slate-300 border-slate-500/30",enquiryColorsL[p.enquiryType]||"bg-slate-100 text-slate-600")}`}>{p.enquiryType||"—"}</span>
        </div>
        <div onClick={()=>setCurrentProjectId(p.id)}>
          <h4 className={`font-bold text-sm mb-0.5 ${tc(dark,"text-white","text-slate-800")}`}>{p.customerName}</h4>
          {p.pocName&&<p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>POC: {p.pocName}</p>}
          <p className={`text-xs mb-2 ${tc(dark,"text-slate-400","text-slate-500")}`}>{[p.customerCity,p.customerState].filter(Boolean).join(", ")||p.customerAddress||"—"}</p>
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${tc(dark,typeColors[p.customerType]||"bg-slate-500/20 text-slate-300",typeColorsL[p.customerType]||"bg-slate-100 text-slate-600")}`}>{p.customerType||"—"}</span>
            <span className={`text-xs font-bold ${tc(dark,"text-amber-400","text-amber-600")}`}>{p.projectSize} {p.projectUnit||"kW"}</span>
          </div>
          {p.tags?.length>0&&<div className="flex flex-wrap gap-1 mb-2">{p.tags.map(t=><span key={t} className={`text-xs px-1.5 py-0.5 rounded ${tc(dark,"bg-indigo-500/20 text-indigo-300","bg-indigo-100 text-indigo-700")}`}>#{t}</span>)}</div>}
        </div>
        {/* Quick actions row */}
        <div className="flex gap-1 mt-1" onClick={e=>e.stopPropagation()}>
          <select value={p.laneId||""} onChange={e=>quickUpdate(p.id,{laneId:e.target.value})} className={`text-xs border rounded-lg px-1.5 py-1 flex-1 focus:outline-none ${tc(dark,"bg-slate-700 border-slate-600 text-slate-300","bg-slate-50 border-slate-200 text-slate-600")}`}>
            {lanes.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select value={p.assignedUserId||p.userId||""} onChange={e=>quickUpdate(p.id,{assignedUserId:e.target.value,userId:e.target.value})} className={`text-xs border rounded-lg px-1.5 py-1 flex-1 focus:outline-none ${tc(dark,"bg-slate-700 border-slate-600 text-slate-300","bg-slate-50 border-slate-200 text-slate-600")}`}>
            {devTeam.map(u=><option key={u.id} value={u.id}>{u.name.split(" ")[0]}</option>)}
          </select>
          <button onClick={()=>openEdit(p)} className={`p-1 rounded-lg ${tc(dark,"bg-slate-700 text-slate-300 hover:bg-slate-600","bg-slate-100 text-slate-600 hover:bg-slate-200")}`}><Icon name="edit" size={11}/></button>
          <button onClick={()=>setConfirmDelete(p)} className={`p-1 rounded-lg ${tc(dark,"bg-slate-700 text-red-400 hover:bg-red-500/20","bg-slate-100 text-red-500 hover:bg-red-50")}`}><Icon name="trash" size={11}/></button>
        </div>
      </div>
    );
  };

  // Date filter dropdown for filters
  const DateFilterSelect = ({val,onChange}) => (
    <select value={val} onChange={e=>onChange(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
      <option value="all">All Time</option>
      <option value="7d">Last 7 Days</option>
      <option value="15d">Last 15 Days</option>
      <option value="30d">Last 30 Days</option>
      <option value="week">This Week</option>
      <option value="month">This Month</option>
      <option value="lastmonth">Last Month</option>
      <option value="custom">Custom Range</option>
    </select>
  );

  // Multi-select dropdown
  const MultiSelectDropdown = ({options, selected, onToggle, placeholder}) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative">
        <button onClick={()=>setOpen(o=>!o)} className={`border rounded-lg px-2.5 py-1.5 text-xs text-left min-w-24 flex items-center gap-1 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
          <span className="flex-1 truncate">{selected.length?`${selected.length} selected`:placeholder}</span>
          <span className="text-slate-400">▾</span>
        </button>
        {open&&(
          <div className={`absolute z-30 top-full left-0 mt-1 min-w-40 border rounded-xl shadow-xl py-1 ${tc(dark,"bg-slate-800 border-slate-600","bg-white border-slate-200")}`}
            onMouseLeave={()=>setOpen(false)}>
            {options.map(o=>(
              <label key={o.value} className={`flex items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-colors ${tc(dark,"hover:bg-slate-700 text-white","hover:bg-slate-50 text-slate-800")}`}>
                <input type="checkbox" checked={selected.includes(o.value)} onChange={()=>onToggle(o.value)} className="accent-amber-500"/>
                {o.label}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>Projects</h1>
          <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>{filteredProjects.length} of {myProjects.length} projects{selectedIds.size>0&&` · ${selectedIds.size} selected`}</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>setView(v=>v==="kanban"?"list":"kanban")}><Icon name={view==="kanban"?"sort":"kanban"} size={15}/>{view==="kanban"?"List":"Kanban"}</Btn>
          <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={exportExcel}><Icon name="export" size={14}/>Export</Btn>
          <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>setShowImport(true)}><Icon name="import" size={14}/>Import</Btn>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={importExcel} className="hidden"/>
          <Btn onClick={()=>{setEditProject(null);setForm({...blankForm,laneId:lanes[0]?.id||""});setShowAdd(true);}}><Icon name="plus" size={15}/>New Project</Btn>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="flex-1 min-w-48"><SearchBar value={filters.q} onChange={v=>FF("q",v)} placeholder="Search name, ID, city, pincode, phone, email…"/></div>
        <button onClick={()=>setShowFilters(f=>!f)} className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm transition-colors ${showFilters?tc(dark,"bg-amber-500/20 border-amber-500/40 text-amber-300","bg-amber-50 border-amber-300 text-amber-700"):tc(dark,"border-slate-600 text-slate-400 hover:border-slate-500","border-slate-300 text-slate-500")}`}>
          <Icon name="filter" size={15}/> Filters {Object.values(filters).some(v=>Array.isArray(v)?v.length>0:(v&&v!=="all"))&&<span className="w-1.5 h-1.5 rounded-full bg-amber-400"/>}
        </button>
        <DateFilterSelect val={filters.dateFilter} onChange={v=>FF("dateFilter",v)}/>
        {filters.dateFilter==="custom"&&<>
          <input type="date" value={filters.dateFrom} onChange={e=>FF("dateFrom",e.target.value)} className={`border rounded-lg px-2 py-1.5 text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
          <input type="date" value={filters.dateTo} onChange={e=>FF("dateTo",e.target.value)} className={`border rounded-lg px-2 py-1.5 text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
        </>}
      </div>

      {/* Advanced Filters */}
      {showFilters&&(
        <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <Field label="Project ID" value={filters.projectId} onChange={v=>FF("projectId",v)}/>
            <Field label="Customer Name" value={filters.customerName} onChange={v=>FF("customerName",v)}/>
            <Field label="Phone" value={filters.customerPhone} onChange={v=>FF("customerPhone",v)}/>
            <Field label="City" value={filters.city} onChange={v=>FF("city",v)}/>
            <Field label="Pincode" value={filters.pincode} onChange={v=>FF("pincode",v)}/>
            <Field label="State" value={filters.state} onChange={v=>FF("state",v)}/>
            <Field label="Min Size" type="number" value={filters.minSize} onChange={v=>FF("minSize",v)}/>
            <Field label="Max Size" type="number" value={filters.maxSize} onChange={v=>FF("maxSize",v)}/>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>Type:</span>
            <MultiSelectDropdown placeholder="All Types" selected={filters.customerTypes} onToggle={v=>toggleArrFilter("customerTypes",v)} options={["Residential","Commercial","Industrial","Government","Other"].map(t=>({value:t,label:t}))}/>
            <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>Lane:</span>
            <MultiSelectDropdown placeholder="All Lanes" selected={filters.laneIds} onToggle={v=>toggleArrFilter("laneIds",v)} options={lanes.map(l=>({value:l.id,label:l.name}))}/>
            <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>Enquiry:</span>
            <MultiSelectDropdown placeholder="All" selected={filters.enquiryTypes} onToggle={v=>toggleArrFilter("enquiryTypes",v)} options={["Hot","Warm","Cold"].map(t=>({value:t,label:t}))}/>
            <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>Assigned:</span>
            <MultiSelectDropdown placeholder="Anyone" selected={filters.assignedTos} onToggle={v=>toggleArrFilter("assignedTos",v)} options={devTeam.map(u=>({value:u.id,label:u.name}))}/>
            {allTags.length>0&&<><span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>Tags:</span>
            <MultiSelectDropdown placeholder="Any tag" selected={filters.tags} onToggle={v=>toggleArrFilter("tags",v)} options={allTags.map(t=>({value:t,label:"#"+t}))}/></>}
            <button onClick={()=>setFilters({q:"",projectId:"",customerName:"",customerPhone:"",customerTypes:[],assignedTos:[],enquiryTypes:[],laneIds:[],minSize:"",maxSize:"",dateFilter:"all",dateFrom:"",dateTo:"",city:"",pincode:"",state:"",address:"",tags:[]})} className="text-xs text-amber-400 underline ml-2">Clear All</button>
          </div>
        </div>
      )}

      {/* Bulk action bar */}
      {selectedIds.size>0&&(
        <div className={`border rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3 ${tc(dark,"bg-amber-500/10 border-amber-500/30","bg-amber-50 border-amber-200")}`}>
          <span className={`text-sm font-medium ${tc(dark,"text-amber-300","text-amber-700")}`}>{selectedIds.size} project(s) selected</span>
          <select value={bulkAction} onChange={e=>setBulkAction(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
            <option value="">Choose action…</option>
            <option value="move">Move to Lane</option>
            <option value="assign">Assign To</option>
            <option value="delete">Delete Selected</option>
          </select>
          {bulkAction==="move"&&<select value={bulkTarget} onChange={e=>setBulkTarget(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
            <option value="">Select Lane</option>
            {lanes.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
          </select>}
          {bulkAction==="assign"&&<select value={bulkTarget} onChange={e=>setBulkTarget(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
            <option value="">Select User</option>
            {devTeam.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
          </select>}
          <Btn size="sm" onClick={execBulkAction} disabled={!bulkAction||(bulkAction!=="delete"&&!bulkTarget)}>Apply</Btn>
          <button onClick={()=>{setSelectedIds(new Set());setBulkAction("");setBulkTarget("");}} className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>Deselect All</button>
        </div>
      )}

      {/* KANBAN VIEW */}
      {view==="kanban"&&(
        <div className="flex gap-4 overflow-x-auto pb-4" style={{minHeight:400}}>
          {lanes.map(lane=>{
            const laneProjects = filteredProjects.filter(p=>p.laneId===lane.id);
            const totalSize = laneProjects.reduce((s,p)=>s+(parseFloat(p.projectSize)||0),0);
            const totalVal = laneProjects.reduce((s,p)=>s+Math.round((developer?.costPerKW||50000)*(parseFloat(p.projectSize)||0)),0);
            const allInLane = filteredProjects.filter(p=>p.laneId===lane.id).map(p=>p.id);
            const allSelected = allInLane.length>0&&allInLane.every(id=>selectedIds.has(id));
            const someSelected = allInLane.some(id=>selectedIds.has(id));
            const lc = LANE_COLORS.find(c=>c.key===lane.color)||LANE_COLORS[0];
            return (
              <div key={lane.id} className="flex-shrink-0 w-72"
                onDragOver={e=>e.preventDefault()}
                onDrop={e=>handleDrop(e,lane.id)}>
                <div className={`border-t-4 rounded-xl p-3 mb-3 ${lc.border} ${tc(dark,"bg-slate-800/30","bg-slate-50")}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <MultiCheckbox checked={allSelected} partial={someSelected&&!allSelected} onChange={()=>toggleSelectAll(allInLane)}/>
                      <span className={`font-bold text-sm ${tc(dark,"text-white","text-slate-800")}`}>{lane.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tc(dark,"bg-slate-700 text-slate-300","bg-white text-slate-600 border border-slate-200")}`}>{laneProjects.length}</span>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className={tc(dark,"text-slate-400","text-slate-500")}>{totalSize.toFixed(1)} kW</span>
                    <span className={tc(dark,"text-amber-400","text-amber-600")}>~{fmtINR(totalVal)}</span>
                  </div>
                </div>
                <div style={{maxHeight:480,overflowY:"auto"}} className="pr-1">
                  {laneProjects.map(p=><ProjectCard key={p.id} p={p}/>)}
                  {!laneProjects.length&&<div className={`border-2 border-dashed rounded-xl p-4 text-center text-xs ${tc(dark,"border-slate-700 text-slate-600","border-slate-200 text-slate-400")}`}>Drop here</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {view==="list"&&(
        filteredProjects.length ? (
          <div className={`border rounded-xl overflow-hidden ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
            <table className="w-full text-sm">
              <thead><tr className={`border-b ${tc(dark,"border-slate-700 bg-slate-800/30","border-slate-200 bg-slate-50")}`}>
                <th className="px-3 py-2.5">
                  <MultiCheckbox checked={filteredProjects.every(p=>selectedIds.has(p.id))&&filteredProjects.length>0}
                    partial={filteredProjects.some(p=>selectedIds.has(p.id))&&!filteredProjects.every(p=>selectedIds.has(p.id))}
                    onChange={()=>toggleSelectAll(filteredProjects.map(p=>p.id))}/>
                </th>
                {["Project ID","Customer","Type","Size","Lane","Enquiry","Assigned",""].map(h=>(
                  <th key={h} className={`text-left px-2 py-2.5 text-xs font-medium ${tc(dark,"text-slate-400","text-slate-500")}`}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filteredProjects.map(p=>{
                  const lane = allLanes.find(l=>l.id===p.laneId);
                  const user = devTeam.find(u=>u.id===(p.assignedUserId||p.userId));
                  const lc = lane?LANE_COLORS.find(c=>c.key===lane.color)||LANE_COLORS[0]:null;
                  return (
                    <tr key={p.id} className={`border-b transition-colors ${selectedIds.has(p.id)?tc(dark,"bg-amber-500/5","bg-amber-50"):tc(dark,"border-slate-700/30 hover:bg-slate-800/20","border-slate-100 hover:bg-slate-50")}`}>
                      <td className="px-3 py-2.5"><MultiCheckbox checked={selectedIds.has(p.id)} onChange={()=>toggleSelect(p.id)}/></td>
                      <td className={`px-2 py-2.5 font-mono text-xs cursor-pointer ${tc(dark,"text-slate-400","text-slate-500")}`} onClick={()=>setCurrentProjectId(p.id)}>{p.projectId||"—"}</td>
                      <td className="px-2 py-2.5 cursor-pointer" onClick={()=>setCurrentProjectId(p.id)}>
                        <div className={`font-medium text-xs ${tc(dark,"text-white","text-slate-800")}`}>{p.customerName}</div>
                        {p.pocName&&<div className={`text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>{p.pocName}</div>}
                      </td>
                      <td className="px-2 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full ${tc(dark,typeColors[p.customerType]||"",typeColorsL[p.customerType]||"")}`}>{p.customerType||"—"}</span></td>
                      <td className={`px-2 py-2.5 text-xs font-bold text-amber-400`}>{p.projectSize} {p.projectUnit||"kW"}</td>
                      <td className="px-2 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium`} style={{backgroundColor:lc?`var(--${lc.key},#64748b)20`:"",color:lc?"":""}}>{lane?.name||"—"}</span></td>
                      <td className="px-2 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full ${tc(dark,enquiryColors[p.enquiryType]||"",enquiryColorsL[p.enquiryType]||"")}`}>{p.enquiryType||"—"}</span></td>
                      <td className={`px-2 py-2.5 text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{user?.name||"—"}</td>
                      <td className="px-2 py-2.5" onClick={e=>e.stopPropagation()}>
                        <div className="flex gap-1">
                          <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>openEdit(p)}><Icon name="edit" size={12}/></Btn>
                          <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>setConfirmDelete(p)}><Icon name="trash" size={12}/></Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`text-center py-20 border rounded-xl ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${tc(dark,"bg-slate-800","bg-slate-100")}`}><Icon name="folder" size={24}/></div>
            <h3 className={`text-base font-bold mb-1 ${tc(dark,"text-white","text-slate-800")}`}>No projects found</h3>
            <p className={`text-sm mb-4 ${tc(dark,"text-slate-400","text-slate-500")}`}>Adjust filters or create a new project</p>
          </div>
        )
      )}

      {/* ADD / EDIT Modal */}
      {showAdd&&(
        <Modal title={editProject?"Edit Project":"Add New Project"} onClose={()=>{setShowAdd(false);setEditProject(null);setForm(blankForm);}} wide>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Customer Type" type="select" value={form.customerType} onChange={v=>SF("customerType",v)} options={["Residential","Commercial","Industrial","Government","Other"]} required/>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Project ID <span className="text-xs text-slate-400">(auto)</span></label>
              <div className={`border rounded-lg px-3 py-2.5 text-sm mb-4 ${tc(dark,"bg-slate-700/50 border-slate-600 text-slate-400","bg-slate-50 border-slate-200 text-slate-500")}`}>{editProject?editProject.projectId:getNextProjectId()}</div>
            </div>
            <Field label="Customer Name" value={form.customerName} onChange={v=>SF("customerName",v)} required/>
            {["Commercial","Industrial","Government"].includes(form.customerType)&&<Field label="Point of Contact (POC)" value={form.pocName||""} onChange={v=>SF("pocName",v)}/>}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Customer Phone</label>
            <div className="flex">
              <select value={form.countryCode} onChange={e=>SF("countryCode",e.target.value)} className={`border border-r-0 rounded-l-lg px-2 py-2.5 focus:outline-none text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                {COUNTRY_CODES.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
              <input value={form.customerPhone} onChange={e=>SF("customerPhone",e.target.value.replace(/\D/g,""))} placeholder="Phone number" className={`flex-1 border rounded-r-lg px-3 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Customer Email</label>
            <input type="email" value={form.customerEmail} onChange={e=>SF("customerEmail",e.target.value)} placeholder="customer@email.com" className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500","bg-white border-slate-300 text-slate-800")} ${form.customerEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)?"border-red-500":""}`}/>
          </div>

          {/* Pincode → City/State */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Pincode</label>
              <input value={form.customerPincode} onChange={e=>onPincodeChange(e.target.value)} placeholder="400001" maxLength={6} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none mb-4 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
            </div>
            <CityField label="City" value={form.customerCity} onChange={v=>SF("customerCity",v)} customCities={customCities} onAddCity={addCustomCity}/>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>State</label>
              <select value={form.customerState||""} onChange={e=>SF("customerState",e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none mb-4 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                <option value="">Select State</option>
                {INDIA_STATES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <Field label="Address" type="textarea" rows={2} value={form.customerAddress} onChange={v=>SF("customerAddress",v)}/>

          {/* Size + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Project Size <span className="text-amber-400">*</span></label>
              <div className="flex mb-4">
                <input type="number" value={form.projectSize} onChange={e=>SF("projectSize",e.target.value)} placeholder="e.g. 10" className={`flex-1 border rounded-l-lg px-3 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
                <select value={form.projectUnit} onChange={e=>SF("projectUnit",e.target.value)} className={`border border-l-0 rounded-r-lg px-2 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                  {[...new Set([...(developer?.customUnits||[]),...PROJECT_UNITS])].map(u=><option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <Field label="Enquiry Type" type="select" value={form.enquiryType} onChange={v=>SF("enquiryType",v)} options={["Hot","Warm","Cold"]}/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Project Lane" type="select" value={form.laneId} onChange={v=>SF("laneId",v)} options={lanes.map(l=>({value:l.id,label:l.name}))}/>
            <Field label="Assign To" type="select" value={form.assignedUserId||currentUser.id} onChange={v=>SF("assignedUserId",v)} options={[{value:currentUser.id,label:"Myself"},...devTeam.filter(u=>u.id!==currentUser.id).map(u=>({value:u.id,label:u.name}))]}/>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(form.tags||[]).map(t=><span key={t} className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${tc(dark,"bg-indigo-500/20 text-indigo-300","bg-indigo-100 text-indigo-700")}`}>#{t}<button onClick={()=>SF("tags",(form.tags||[]).filter(x=>x!==t))} className="text-red-400 ml-1">×</button></span>)}
            </div>
            {/* Default tags from settings */}
            {(developer?.defaultTags||[]).filter(t=>!(form.tags||[]).includes(t)).length>0&&(
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(developer?.defaultTags||[]).filter(t=>!(form.tags||[]).includes(t)).map(t=>(
                  <button key={t} onClick={()=>SF("tags",[...(form.tags||[]),t])} className={`text-xs px-2 py-0.5 rounded-lg border border-dashed ${tc(dark,"border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10","border-indigo-300 text-indigo-600 hover:bg-indigo-50")}`}>+#{t}</button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input id="tagInput" placeholder="Add tag…" onKeyDown={e=>{ if(e.key==="Enter"&&e.target.value.trim()){SF("tags",[...(form.tags||[]),e.target.value.trim()]);e.target.value="";}}} className={`flex-1 border rounded-lg px-3 py-1.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500","bg-white border-slate-300 text-slate-800")}`}/>
              <Btn size="sm" variant="outline" onClick={()=>{const inp=document.getElementById("tagInput");if(inp?.value.trim()){SF("tags",[...(form.tags||[]),inp.value.trim()]);inp.value="";}}}>Add</Btn>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Btn onClick={()=>saveProject(!!editProject)} className="flex-1" disabled={!form.customerName||!form.projectSize}>{editProject?"Update Project":"Add Project"}</Btn>
            <Btn variant="secondary" onClick={()=>{setShowAdd(false);setEditProject(null);setForm(blankForm);}}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Import Modal */}
      {showImport&&(
        <Modal title="Import Projects from CSV" onClose={()=>setShowImport(false)}>
          <p className={`text-sm mb-4 ${tc(dark,"text-slate-400","text-slate-500")}`}>Download the template, fill it in, and upload. All dropdown fields show valid options in the header.</p>
          <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-slate-800/40 border-slate-700","bg-slate-50 border-slate-200")}`}>
            <h4 className={`font-bold text-sm mb-2 ${tc(dark,"text-white","text-slate-800")}`}>Step 1: Download Template</h4>
            <p className={`text-xs mb-3 ${tc(dark,"text-slate-400","text-slate-500")}`}>Template includes your lanes, units, team members in dropdown headers as reference.</p>
            <Btn onClick={downloadTemplate}><Icon name="download" size={14}/>Download Template CSV</Btn>
          </div>
          <div className={`border rounded-xl p-4 ${tc(dark,"bg-slate-800/40 border-slate-700","bg-slate-50 border-slate-200")}`}>
            <h4 className={`font-bold text-sm mb-2 ${tc(dark,"text-white","text-slate-800")}`}>Step 2: Upload Filled File</h4>
            <p className={`text-xs mb-3 ${tc(dark,"text-slate-400","text-slate-500")}`}>Project IDs will auto-increment from your current counter. Existing IDs in the file will be used if valid.</p>
            <Btn onClick={()=>fileInputRef.current?.click()}><Icon name="import" size={14}/>Upload CSV File</Btn>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete&&(
        <Modal title="Delete Project?" onClose={()=>setConfirmDelete(null)}>
          <p className={`text-sm mb-4 ${tc(dark,"text-slate-300","text-slate-700")}`}>Are you sure you want to delete <strong>"{confirmDelete.customerName}"</strong>? You'll have 30 seconds to undo.</p>
          <div className="flex gap-3">
            <Btn onClick={()=>deleteProject(confirmDelete)} className="flex-1">Delete</Btn>
            <Btn variant="secondary" onClick={()=>setConfirmDelete(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};
// ── PROJECT INVOICES PAGE (Dev + User) ────────────────────────
const ProjectInvoicesPage = ({ invoices, setInvoices, projects, developer, currentUser, setDevelopers }) => {
  const { dark } = useTheme();
  const [showCreate, setShowCreate] = useState(false);
  const [viewInv, setViewInv] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [items, setItems] = useState([{name:"",qty:1,price:0,gst:12}]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Pending");
  const [docType, setDocType] = useState("Proforma Invoice");

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

  const onSelectProject = (pid) => {
    setSelectedProject(pid);
    const p = myProjects.find(x=>x.id===pid);
    if (p && developer) {
      const vars = calcSolar(p.projectSize, developer);
      setItems([{name:`${p.projectSize} ${p.projectUnit||"kW"} ${p.customerType||"Residential"} Solar System`,qty:1,price:Math.round(vars.totalCost),gst:12}]);
    }
  };

  const generate = () => {
    if (!selectedProject) return;
    const p = myProjects.find(x=>x.id===selectedProject);
    const {total} = calcInvoiceTotal(items);
    const prefix = developer?.invoicePrefix || "INV";
    const num    = developer?.invoiceNextNum || 1001;
    const invId  = `${prefix}-${num}`;
    setDevelopers(ds=>ds.map(d=>d.id===developer.id?{...d,invoiceNextNum:(d.invoiceNextNum||1001)+1}:d));
    const inv = {
      id:invId, docType,
      type:"project", developerId:developer.id,
      projectId:selectedProject, userId:currentUser.id,
      amount:total, status, date:TODAY,
      customerName:p?.customerName||"",
      customerAddress:[p?.customerAddress,p?.customerCity,p?.customerPincode].filter(Boolean).join(", "),
      customerPhone:p?.customerPhone||"",
      customerEmail:p?.customerEmail||"",
      items:[...items], notes,
    };
    setInvoices(is=>[...is,inv]);
    setViewInv(inv); setShowCreate(false);
    setSelectedProject(""); setItems([{name:"",qty:1,price:0,gst:12}]); setNotes(""); setStatus("Pending");
  };

  const isLocked = !currentUser?.active || (developer && (developer.paused || (developer.subscriptionEnd && new Date(developer.subscriptionEnd)<new Date())));
  if (isLocked) return <LockedPage developer={developer}/>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>Invoices & Documents</h1>
          <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>{myInvoices.length} record{myInvoices.length!==1?"s":""}</p>
        </div>
        <Btn onClick={()=>setShowCreate(true)}><Icon name="plus" size={15}/>Create Document</Btn>
      </div>

      <InvoiceListView
        invoices={myInvoices}
        developers={[developer]}
        projects={myProjects}
        developer={developer}
        onView={inv=>setViewInv(inv)}
        onPrint={inv=>printInvoiceTemplid(inv,developer)}
        onDownload={inv=>{const cxName=(inv.customerName||"Customer").replace(/\s+/g,"_");downloadHTML(buildInvoiceHTML({inv,developer,customer:{}}),`Invoice_${cxName}_${inv.id}.html`);}}
        onMarkPaid={id=>setInvoices(is=>is.map(i=>i.id===id?{...i,status:"Paid"}:i))}
        onConvert={(inv,newType)=>setInvoices(is=>is.map(i=>i.id===inv.id?{...i,docType:newType}:i))}
        currentUser={currentUser}
      />

      {/* Create Modal */}
      {showCreate&&(
        <Modal title="Create Document" onClose={()=>setShowCreate(false)} wide>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${tc(dark,"text-slate-300","text-slate-700")}`}>Document Type</label>
            <div className="flex gap-2 flex-wrap">
              {INV_DOC_TYPES.map(t=>(
                <button key={t} onClick={()=>setDocType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${docType===t?"bg-amber-500 text-slate-900 border-amber-400":tc(dark,"border-slate-600 text-slate-400 hover:border-amber-400","border-slate-300 text-slate-500 hover:border-amber-400")}`}>{t}</button>
              ))}
            </div>
          </div>
          <Field label="Select Project" type="select" value={selectedProject} onChange={onSelectProject}
            options={[{value:"",label:"— Select Project —"},...myProjects.map(p=>({value:p.id,label:`${p.customerName} — ${p.projectSize}${p.projectUnit||"kW"}`}))]}/>
          {selProject&&(
            <div className={`rounded-xl p-3 mb-4 text-xs ${tc(dark,"bg-slate-800/40","bg-slate-50")}`}>
              <div className="grid grid-cols-2 gap-1">
                {[["Customer",selProject.customerName],["Type",selProject.customerType||selProject.projectType],["Phone",selProject.customerPhone],["Email",selProject.customerEmail],["Size",`${selProject.projectSize} ${selProject.projectUnit||"kW"}`],["Lane",selProject.laneId]].map(([k,v])=>(
                  <div key={k}><span className={tc(dark,"text-slate-400","text-slate-500")}>{k}: </span><span className={`font-medium ${tc(dark,"text-white","text-slate-700")}`}>{v||"—"}</span></div>
                ))}
              </div>
            </div>
          )}
          <InvoiceItemEditor items={items} setItems={setItems}/>
          <Field label="Notes" type="textarea" rows={2} value={notes} onChange={setNotes} placeholder="Additional notes…"/>
          <Field label="Status" type="select" value={status} onChange={setStatus} options={["Draft","Pending","Sent","Accepted","Paid"]}/>
          <div className="flex gap-3 mt-2">
            <Btn onClick={generate} className="flex-1" disabled={!selectedProject||!items.length||!items[0].name}><Icon name="zap" size={15}/>Generate {docType}</Btn>
            <Btn variant="secondary" onClick={()=>setShowCreate(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Preview Modal */}
      {viewInv&&(
        <Modal title={`${viewInv.docType||"Invoice"} — ${viewInv.id.toUpperCase()}`} onClose={()=>setViewInv(null)} wide>
          <InvoicePreviewContent inv={viewInv} developer={developer} customer={{name:viewInv.customerName,address:viewInv.customerAddress,phone:viewInv.customerPhone,email:viewInv.customerEmail}}/>
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-slate-700">
            <Btn onClick={()=>printInvoiceTemplid(viewInv,developer)}><Icon name="print" size={15}/>Print</Btn>
            <Btn variant="outline" onClick={()=>{const cxName=(viewInv.customerName||"Customer").replace(/\s+/g,"_");downloadHTML(buildInvoiceHTML({inv:viewInv,developer,customer:{}}),`Invoice_${cxName}_${viewInv.id}.html`);}}><Icon name="download" size={15}/>Download PDF</Btn>
            {viewInv.customerPhone&&<Btn variant="outline" onClick={()=>{const p=myProjects.find(x=>x.id===viewInv.projectId);const msg=`Hi ${viewInv.customerName},\n\nHere is your ${viewInv.docType||"Invoice"} (${viewInv.id}) for your ${p?.projectSize||""}${p?.projectUnit||"kW"} ${p?.customerType||""} solar project worth ${fmtINR(calcInvoiceTotal(viewInv.items||[]).total)}.\n\nRegards,\n${developer?.companyName||""}`;shareWhatsApp(viewInv.customerPhone,msg);}}>WA WhatsApp</Btn>}
            {viewInv.customerEmail&&<Btn variant="outline" onClick={()=>{const p=myProjects.find(x=>x.id===viewInv.projectId);const body=`Hi ${viewInv.customerName},\n\nHere is your ${viewInv.docType||"Invoice"} (${viewInv.id}) for your solar project worth ${fmtINR(calcInvoiceTotal(viewInv.items||[]).total)}.\n\nRegards,\n${developer?.companyName||""}`;shareMail(viewInv.customerEmail,`${viewInv.docType||"Invoice"} - ${viewInv.id}`,body);}}><Icon name="mail" size={15}/>Email</Btn>}
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
  const [noteFileRef] = [useRef()];
  const [noteAttachments, setNoteAttachments] = useState([]);
  const [noteFilterUser, setNoteFilterUser] = useState("all");
  const [noteDateFilter, setNoteDateFilter] = useState("all");
  const [noteDateFrom, setNoteDateFrom] = useState(""); const [noteDateTo, setNoteDateTo] = useState("");
  const [docDateFilter, setDocDateFilter] = useState("all");
  const [docDateFrom, setDocDateFrom] = useState(""); const [docDateTo, setDocDateTo] = useState("");
  const [showGen, setShowGen] = useState(false);
  const [selectedTmpl, setSelectedTmpl] = useState("");
  const [pForm, setPForm] = useState({});
  const [viewProposal, setViewProposal] = useState(null);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docFileRef] = [useRef()];
  const [pendingDocFile, setPendingDocFile] = useState(null);
  const [docSearch, setDocSearch] = useState("");
  const [docFilterType, setDocFilterType] = useState("all");
  const [docFilterUser, setDocFilterUser] = useState("all");
  const [editingProject, setEditingProject] = useState(false);

  const projNotes     = notes.filter(n=>n.projectId===project.id);
  const projDocs      = documents.filter(d=>d.projectId===project.id);
  const projProposals = proposals.filter(p=>p.projectId===project.id);
  const avlTemplates  = templates.filter(t=>t.assignedTo.includes(project.developerId));

  // Unique note authors
  const noteAuthors = [...new Set(projNotes.map(n=>n.userName||n.userId))];
  const filteredNotes = projNotes.filter(n=>{
    if (noteFilterUser!=="all" && (n.userName||n.userId)!==noteFilterUser) return false;
    if (!applyDateFilter(n.createdAt, noteDateFilter, noteDateFrom, noteDateTo)) return false;
    return true;
  });
  const filteredDocs = projDocs.filter(d=>{
    const matchSearch = !docSearch || d.title?.toLowerCase().includes(docSearch.toLowerCase()) || d.name?.toLowerCase().includes(docSearch.toLowerCase());
    const matchType = docFilterType==="all" || d.type===docFilterType;
    const matchUser = docFilterUser==="all" || d.uploadedBy===docFilterUser;
    const matchDate = applyDateFilter(d.uploadDate, docDateFilter, docDateFrom, docDateTo);
    return matchSearch && matchType && matchUser && matchDate;
  });
  const docAuthors = [...new Set(projDocs.map(d=>d.uploadedBy))];

  const addNote = () => {
    if (!newNote.trim() && !noteAttachments.length) return;
    setNotes(ns=>[...ns,{id:`n${Date.now()}`,projectId:project.id,userId:currentUser.id,userName:currentUser.name,content:newNote,attachments:[...noteAttachments],createdAt:new Date().toISOString()}]);
    setNewNote(""); setNoteAttachments([]);
  };

  const handleNoteFile = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setNoteAttachments(a=>[...a,{name:file.name,data:ev.target.result,type:file.type}]);
    reader.readAsDataURL(file);
    e.target.value="";
  };

  const handleDocFileSelect = (e) => {
    const file = e.target.files[0]; if(!file) return;
    setPendingDocFile(file);
    setDocTitle(file.name.replace(/\.[^.]+$/,""));
    setShowDocUpload(true);
  };

  const saveDoc = () => {
    if (!pendingDocFile) return;
    const types={pdf:"PDF",doc:"Word",docx:"Word",xls:"Excel",xlsx:"Excel",jpg:"Image",jpeg:"Image",png:"Image",gif:"Image",mp4:"Video",mov:"Video"};
    const ext=pendingDocFile.name.split(".").pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = ev => {
      setDocuments(ds=>[...ds,{id:`doc${Date.now()}`,projectId:project.id,title:docTitle||pendingDocFile.name,name:pendingDocFile.name,type:types[ext]||"Other",size:`${(pendingDocFile.size/1024).toFixed(0)} KB`,uploadDate:TODAY,uploadedBy:currentUser.name,uploadedById:currentUser.id,data:ev.target.result}]);
    };
    reader.readAsDataURL(pendingDocFile);
    setShowDocUpload(false); setDocTitle(""); setPendingDocFile(null);
  };

  const vars = calcSolar(project.projectSize, developer);

  const generateProposal = () => {
    const tmpl = templates.find(t=>t.id===selectedTmpl); if(!tmpl) return;
    const v = calcSolar(project.projectSize, developer, pForm);
    const fullAddress = [project.customerAddress,project.customerCity,project.customerState].filter(Boolean).join(", ");
    const data = {
      ...pForm, ...v,
      company_name:developer.companyName, company_address:[developer.address,developer.city,developer.pincode].filter(Boolean).join(", "),
      company_phone:developer.phone, company_email:developer.email,
      company_website:developer.website, payment_terms:developer.paymentTerms,
      customer_name:project.customerName, customer_address:fullAddress,
      customer_phone:project.customerPhone, customer_email:project.customerEmail,
      project_size:project.projectSize, project_type:project.customerType||project.projectType,
    };
    const np={id:`pr${Date.now()}`,projectId:project.id,templateId:selectedTmpl,status:"Generated",createdAt:TODAY,data};
    setProposals(ps=>[...ps,np]);
    setShowGen(false); setViewProposal(np);
  };

  const tabs = ["info","notes","documents","proposal","activity"];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className={`p-1.5 rounded-lg transition-colors ${tc(dark,"text-slate-400 hover:text-white hover:bg-slate-700","text-slate-400 hover:text-slate-600 hover:bg-slate-100")}`}><Icon name="back" size={18}/></button>
        <div className="flex-1">
          <h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>{project.customerName}</h1>
          <p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{project.projectId} · {[project.customerCity,project.customerState].filter(Boolean).join(", ")||project.customerAddress}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(project.laneId?"Active":"Active",dark)}`}>{project.enquiryType||"—"}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${tc(dark,"bg-slate-700 text-slate-300","bg-slate-100 text-slate-600")}`}>{project.customerType||project.projectType||"—"}</span>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[["System Size",`${project.projectSize} ${project.projectUnit||"kW"}`],["Total Cost",fmtINR(vars.totalCost)],["Annual Savings",fmtINR(vars.annualSavings)],["Payback",`${vars.paybackPeriod} yrs`]].map(([l,v])=>(
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
            {[["Name",project.customerName],["POC",project.pocName],["Email",project.customerEmail],["Phone",project.customerPhone],["Type",project.customerType||project.projectType],["Enquiry",project.enquiryType],["Pincode",project.customerPincode],["City",project.customerCity],["State",project.customerState],["Address",project.customerAddress]].filter(([,v])=>v).map(([k,v])=>(
              <div key={k} className={`flex gap-3 text-sm py-1.5 border-b last:border-0 ${tc(dark,"border-slate-700/20","border-slate-100")}`}>
                <span className={`w-20 flex-shrink-0 ${tc(dark,"text-slate-400","text-slate-500")}`}>{k}</span>
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
            {noteAttachments.length>0&&<div className="flex flex-wrap gap-2 mb-3">{noteAttachments.map((a,i)=><span key={i} className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1.5 ${tc(dark,"bg-slate-700 text-slate-300","bg-slate-100 text-slate-600")}`}><Icon name="file" size={12}/>{a.name}<button onClick={()=>setNoteAttachments(x=>x.filter((_,j)=>j!==i))} className="text-red-400">×</button></span>)}</div>}
            <div className="flex gap-2">
              <Btn onClick={addNote} disabled={!newNote.trim()&&!noteAttachments.length}><Icon name="plus" size={15}/>Add Note</Btn>
              <input ref={noteFileRef} type="file" onChange={handleNoteFile} className="hidden" accept="image/*,.pdf,.doc,.docx"/>
              <Btn variant="outline" onClick={()=>noteFileRef.current?.click()}><Icon name="upload" size={14}/>Attach</Btn>
            </div>
          </div>
          {/* Filter bar */}
          {projNotes.length>0&&<div className="flex flex-wrap gap-2 mb-3">
            <select value={noteFilterUser} onChange={e=>setNoteFilterUser(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
              <option value="all">All Authors</option>
              {noteAuthors.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
            <select value={noteDateFilter} onChange={e=>setNoteDateFilter(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="15d">Last 15 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="lastmonth">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
            {noteDateFilter==="custom"&&<>
              <input type="date" value={noteDateFrom} onChange={e=>setNoteDateFrom(e.target.value)} className={`border rounded-lg px-2 py-1.5 text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
              <input type="date" value={noteDateTo} onChange={e=>setNoteDateTo(e.target.value)} className={`border rounded-lg px-2 py-1.5 text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
            </>}
          </div>}
          <div className="space-y-2">
            {!filteredNotes.length ? <p className={`text-sm text-center py-8 ${tc(dark,"text-slate-400","text-slate-500")}`}>No notes yet.</p> : filteredNotes.map(n=>(
              <div key={n.id} className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
                <p className={`text-sm mb-2 ${tc(dark,"text-white","text-slate-800")}`}>{n.content}</p>
                {n.attachments?.length>0&&<div className="flex flex-wrap gap-1.5 mb-2">{n.attachments.map((a,i)=>(
                  <div key={i} className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1.5 ${tc(dark,"bg-slate-700 text-slate-300","bg-slate-100 text-slate-600")}`}>
                    <Icon name="file" size={11}/>{a.name}
                    {a.data&&<><button onClick={()=>window.open(a.data,"_blank")} className="text-sky-400 hover:text-sky-300 ml-1 text-xs">View</button>
                    <a href={a.data} download={a.name} className="text-amber-400 hover:text-amber-300 text-xs">↓</a></>}
                  </div>
                ))}</div>}
                <div className={`flex gap-3 text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>
                  <span>{n.userName||currentUser.name}</span>
                  <span>{new Date(n.createdAt).toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCUMENTS TAB */}
      {tab==="documents"&&(
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex-1 min-w-40"><SearchBar value={docSearch} onChange={setDocSearch} placeholder="Search documents…"/></div>
            <select value={docFilterType} onChange={e=>setDocFilterType(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
              <option value="all">All Types</option>
              {["PDF","Word","Excel","Image","Video","Other"].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <select value={docFilterUser} onChange={e=>setDocFilterUser(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
              <option value="all">All Uploaders</option>
              {docAuthors.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
            <select value={docDateFilter} onChange={e=>setDocDateFilter(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="15d">Last 15 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="lastmonth">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
            {docDateFilter==="custom"&&<>
              <input type="date" value={docDateFrom} onChange={e=>setDocDateFrom(e.target.value)} className={`border rounded-lg px-2 py-1.5 text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
              <input type="date" value={docDateTo} onChange={e=>setDocDateTo(e.target.value)} className={`border rounded-lg px-2 py-1.5 text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
            </>}
            <input ref={docFileRef} type="file" onChange={handleDocFileSelect} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.mov"/>
            <Btn onClick={()=>docFileRef.current?.click()}><Icon name="upload" size={15}/>Upload Doc</Btn>
          </div>
          {!filteredDocs.length ? (
            <div className={`text-center py-14 border-2 border-dashed rounded-xl ${tc(dark,"border-slate-700","border-slate-200")}`}>
              <Icon name="upload" size={28}/><p className={`mt-2 text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>No documents yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocs.map(doc=>{
                const docColor = doc.type==="PDF"?tc(dark,"bg-red-500/20 text-red-400","bg-red-100 text-red-600"):doc.type==="Image"?tc(dark,"bg-sky-500/20 text-sky-400","bg-sky-100 text-sky-600"):doc.type==="Excel"?tc(dark,"bg-emerald-500/20 text-emerald-400","bg-emerald-100 text-emerald-600"):doc.type==="Word"?tc(dark,"bg-blue-500/20 text-blue-400","bg-blue-100 text-blue-600"):tc(dark,"bg-slate-700/50 text-slate-400","bg-slate-100 text-slate-500");
                const shareMsg = `Document: ${doc.title||doc.name}\nProject: ${project.customerName} (${project.projectId})\n\nShared by ${currentUser.name} via SolarPro.`;
                return (
                  <div key={doc.id} className={`border rounded-xl p-3 flex items-center gap-3 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${docColor}`}>{doc.type?.slice(0,3)||"DOC"}</div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${tc(dark,"text-white","text-slate-800")}`}>{doc.title||doc.name}</div>
                      <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{doc.type} · {doc.size} · {fmtDate(doc.uploadDate)} · {doc.uploadedBy}</div>
                    </div>
                    <div className="flex gap-1.5">
                      {doc.data&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>window.open(doc.data,"_blank")} title="View in new tab"><Icon name="eye" size={12}/>View</Btn>}
                      {doc.data&&<a href={doc.data} download={doc.name||doc.title} className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${tc(dark,"bg-slate-700/50 text-slate-300 hover:bg-slate-700","bg-slate-100 text-slate-600 hover:bg-slate-200")}`}><Icon name="download" size={12}/>Save</a>}
                      {(project.customerPhone||project.customerEmail)&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>project.customerPhone?shareWhatsApp(project.customerPhone,shareMsg):shareMail(project.customerEmail,`Doc: ${doc.title||doc.name}`,shareMsg)} title="Share"><Icon name="share" size={12}/></Btn>}
                      <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>setDocuments(ds=>ds.filter(d=>d.id!==doc.id))}><Icon name="trash" size={12}/></Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Doc upload modal */}
          {showDocUpload&&(
            <Modal title="Upload Document" onClose={()=>{setShowDocUpload(false);setPendingDocFile(null);}}>
              <p className={`text-sm mb-4 ${tc(dark,"text-slate-400","text-slate-500")}`}>File: {pendingDocFile?.name}</p>
              <Field label="Document Title" value={docTitle} onChange={setDocTitle} required/>
              <div className="flex gap-3 mt-2">
                <Btn onClick={saveDoc} disabled={!docTitle.trim()}>Upload Document</Btn>
                <Btn variant="secondary" onClick={()=>{setShowDocUpload(false);setPendingDocFile(null);}}>Cancel</Btn>
              </div>
            </Modal>
          )}
        </div>
      )}

      {/* ACTIVITY LOG TAB */}
      {tab==="activity"&&(
        <div>
          <div className={`border rounded-xl overflow-hidden ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
            {(project.activityLog||[]).length===0 ? (
              <div className="text-center py-12">
                <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>No activity recorded yet.</p>
              </div>
            ) : (
              <div>
                {[...(project.activityLog||[])].reverse().map((entry,i)=>(
                  <div key={i} className={`flex gap-3 items-start px-4 py-3 border-b last:border-0 ${tc(dark,"border-slate-700/30","border-slate-100")}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${tc(dark,"bg-amber-400","bg-amber-500")}`}/>
                    <div className="flex-1">
                      <div className={`text-sm ${tc(dark,"text-white","text-slate-800")}`}>{entry.action}</div>
                      <div className={`text-xs flex gap-2 mt-0.5 ${tc(dark,"text-slate-400","text-slate-500")}`}>
                        <span>{entry.by||"—"}</span>
                        <span>·</span>
                        <span>{fmtDate(entry.date)}</span>
                        {entry.time&&<><span>·</span><span>{entry.time}</span></>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
            const propoMsg = `Hi ${project.customerName},\n\nHere is your Solar Proposal for your ${project.projectSize} ${project.projectUnit||"kW"} ${project.customerType||""} solar project.\n\nTotal System Cost: ${fmtINR(pr.data?.totalCost||0)}\nAnnual Savings: ${fmtINR(pr.data?.annualSavings||0)}\nPayback Period: ${pr.data?.paybackPeriod||"—"} years\n\nRegards,\n${developer?.companyName||""}`;
            return (
              <div key={pr.id} className={`border rounded-xl p-4 flex items-center gap-3 mb-2 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0"><Icon name="file" size={18}/></div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${tc(dark,"text-white","text-slate-800")}`}>{tmpl?.name||"Proposal"}</div>
                  <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{fmtDate(pr.createdAt)}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(pr.status,dark)}`}>{pr.status}</span>
                <div className="flex gap-1.5 flex-wrap">
                  <Btn size="sm" variant="outline" onClick={()=>setViewProposal(pr)}><Icon name="eye" size={13}/>View</Btn>
                  <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>printProposal(pr,project,developer)}><Icon name="print" size={13}/>Print</Btn>
                  <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>{const cxName=project.customerName.replace(/\s+/g,"_");downloadHTML(buildProposalHTML(pr,project,developer),`Proposal_${cxName}_${project.projectSize}${project.projectUnit||"kW"}.html`);}}><Icon name="download" size={13}/>PDF</Btn>
                  {project.customerPhone&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>shareWhatsApp(project.customerPhone,propoMsg)}><span className="text-emerald-400 font-bold text-xs">WA</span></Btn>}
                  {project.customerEmail&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>shareMail(project.customerEmail,"Solar Proposal | "+developer?.companyName,propoMsg)}><Icon name="mail" size={13}/></Btn>}
                </div>
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

// ── PROPOSAL HTML BUILDER (shared for print + download) ──────
const buildProposalHTML = (proposal, project, developer) => {
  const d = proposal.data;
  const rows10 = Array.from({length:10},(_,i)=>{
    const yr=i+1;
    const before=(d.annualBillBefore||d.annualSavings*1.3)*Math.pow(1.03,yr);
    const savings=(d.annualSavings||0)*Math.pow(1.01,yr);
    const after=Math.max(0,before-savings);
    const cum=Array.from({length:yr},(_,j)=>(d.annualSavings||0)*Math.pow(1.01,j+1)).reduce((s,x)=>s+x,0);
    return `<tr style="border-bottom:1px solid #e2e8f0"><td>${yr}</td><td style="color:#dc2626">₹${Math.round(before).toLocaleString("en-IN")}</td><td style="color:#059669">₹${Math.round(after).toLocaleString("en-IN")}</td><td style="color:#d97706">₹${Math.round(savings).toLocaleString("en-IN")}</td><td style="color:#0284c7">₹${Math.round(cum).toLocaleString("en-IN")}</td></tr>`;
  }).join("");
  return `<!DOCTYPE html><html><head><title>Solar Proposal — ${d.customer_name}</title>
  <style>body{font-family:Arial,sans-serif;color:#111;background:#fff;padding:32px;max-width:900px;margin:0 auto}h1,h2,h3{margin:0 0 8px}table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:left;font-size:13px}th{background:#fef3c7;font-weight:700}tr:hover{background:#fafafa}img{max-height:60px;display:block;margin-bottom:8px}pre{white-space:pre-wrap;font-family:inherit;font-size:12px}.amber{color:#d97706}.section{margin-bottom:24px;padding:16px;border:1px solid #e2e8f0;border-radius:12px}@media print{body{padding:0}@page{margin:1cm}}</style>
  </head><body>
  <div class="section" style="background:#fffbeb;border-color:#fde68a">
    ${developer?.logo?`<img src="${developer.logo}" alt="logo"/>`:""}
    <h1 style="font-size:20px">${d.company_name}</h1>
    <p style="font-size:12px;color:#666">${d.company_address||""}<br/>${d.company_phone||""} | ${d.company_email||""}</p>
    <h2 style="text-align:right;font-size:18px;color:#d97706;margin-top:-40px">SOLAR PROPOSAL</h2>
    <p style="text-align:right;font-size:12px;color:#888">${fmtDate(proposal.createdAt)}</p>
  </div>
  <div class="section"><h3>Customer Details</h3>
    <table><tr><th>Name</th><th>Email</th><th>Phone</th><th>Size</th><th>Type</th></tr>
    <tr><td>${d.customer_name}</td><td>${d.customer_email||"—"}</td><td>${d.customer_phone||"—"}</td><td>${d.project_size} ${project?.projectUnit||"kW"}</td><td>${d.project_type}</td></tr></table>
  </div>
  <div class="section"><h3>Financial Summary</h3>
    <table><tr><td><strong>Total System Cost</strong></td><td class="amber">${fmtINR(d.totalCost)}</td><td><strong>Annual Generation</strong></td><td class="amber">${(d.annualGeneration||0).toLocaleString()} kWh</td></tr>
    <tr><td><strong>Annual Savings</strong></td><td class="amber">${fmtINR(d.annualSavings)}</td><td><strong>Payback Period</strong></td><td class="amber">${d.paybackPeriod} years</td></tr>
    <tr><td><strong>25-Year ROI</strong></td><td class="amber">${d.roi25}%</td><td></td><td></td></tr></table>
  </div>
  <div class="section"><h3>10-Year Savings Projection</h3>
    <table><thead><tr style="background:#fef3c7"><th>Year</th><th>Bill Before Solar</th><th>Bill After Solar</th><th>Annual Savings</th><th>Cumulative Savings</th></tr></thead><tbody>${rows10}</tbody></table>
  </div>
  ${developer?.paymentTerms?`<div class="section"><h3>Payment Terms</h3><pre>${developer.paymentTerms}</pre></div>`:""}
  ${developer?.bankDetails?`<div class="section"><h3>Bank Details</h3><pre>${developer.bankDetails}</pre></div>`:""}
  ${developer?.stamp?`<div class="section"><h3>Authorized Signatory</h3><img src="${developer.stamp}" style="max-height:80px"/></div>`:""}
  ${developer?.signature?`<div class="section"><img src="${developer.signature}" style="max-height:60px"/></div>`:""}
  ${developer?.terms?`<div class="section"><h3>Terms & Conditions</h3><p style="font-size:12px">${developer.terms}</p></div>`:""}
  </body></html>`;
};

// Proposal print
const printProposal = (proposal, project, developer) => {
  const html = buildProposalHTML(proposal, project, developer);
  const w=window.open("","_blank");
  w.document.write(html); w.document.close(); w.focus();
  setTimeout(()=>{ w.print(); },600);
};

// ── PROPOSAL PREVIEW COMPONENT ────────────────────────────────
const ProposalPreview = ({ proposal, project, developer, templates }) => {
  const { dark } = useTheme();
  const d = proposal.data;
  const tmpl = templates.find(t=>t.id===proposal.templateId);
  const cxName = (project?.customerName||d?.customer_name||"Customer").replace(/\s+/g,"_");
  const projSize = `${project?.projectSize||d?.project_size||""}${project?.projectUnit||"kW"}`;
  const propoMsg = `Hi ${project?.customerName||d?.customer_name},\n\nHere is your Solar Proposal for your ${project?.projectSize} ${project?.projectUnit||"kW"} ${project?.customerType||""} solar project.\n\nTotal Cost: ${fmtINR(d?.totalCost||0)}\nAnnual Savings: ${fmtINR(d?.annualSavings||0)}\nPayback: ${d?.paybackPeriod||"—"} years\n\nRegards,\n${developer?.companyName||""}`;

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

      <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}>
        <h4 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Prepared For</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[["Name",d.customer_name],["Email",d.customer_email],["Phone",d.customer_phone],["Address",d.customer_address],["Project Size",`${d.project_size} ${project?.projectUnit||"kW"}`],["Type",d.project_type]].map(([k,v])=>(
            <div key={k}><span className={`${tc(dark,"text-slate-400","text-slate-500")} `}>{k}: </span><span className={`font-medium ${tc(dark,"text-white","text-slate-800")}`}>{v||"—"}</span></div>
          ))}
        </div>
      </div>

      <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}>
        <h4 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Financial Summary</h4>
        <div className="grid grid-cols-2 gap-2">
          {[["System Size",`${d.project_size} ${project?.projectUnit||"kW"}`],["Total Cost",fmtINR(d.totalCost)],["Annual Generation",`${(d.annualGeneration||0).toLocaleString()} kWh`],["Annual Savings",fmtINR(d.annualSavings)],["Payback Period",`${d.paybackPeriod} years`],["25-Year ROI",`${d.roi25}%`]].map(([k,v])=>(
            <div key={k} className={`rounded-lg p-3 flex justify-between items-center ${tc(dark,"bg-slate-800/40","bg-slate-50")}`}>
              <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{k}</span>
              <span className="text-amber-400 font-bold text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

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

      <div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}>
        <h4 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>ROI Payback Chart</h4>
        <PaybackChart totalCost={d.totalCost} annualSavings={d.annualSavings}/>
        <p className={`text-xs text-center mt-2 ${tc(dark,"text-slate-500","text-slate-400")}`}>Break-even at year {d.paybackPeriod}</p>
      </div>

      {developer?.paymentTerms&&<div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}><h4 className={`font-bold mb-2 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Payment Terms</h4><pre className={`text-xs whitespace-pre-wrap ${tc(dark,"text-slate-400","text-slate-600")}`}>{developer.paymentTerms}</pre></div>}
      {developer?.bankDetails&&<div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}><h4 className={`font-bold mb-2 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Bank Details</h4><pre className={`text-xs whitespace-pre-wrap ${tc(dark,"text-slate-400","text-slate-600")}`}>{developer.bankDetails}</pre></div>}
      {developer?.terms&&<div className={`border rounded-xl p-4 mb-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200")}`}><h4 className={`font-bold mb-2 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Terms & Conditions</h4><p className={`text-xs ${tc(dark,"text-slate-400","text-slate-600")}`}>{developer.terms}</p></div>}

      <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-slate-700">
        <Btn onClick={()=>printProposal(proposal,project,developer)}><Icon name="print" size={15}/>Print</Btn>
        <Btn variant="outline" onClick={()=>downloadHTML(buildProposalHTML(proposal,project,developer),`Proposal_${cxName}_${projSize}.html`)}><Icon name="download" size={15}/>Download PDF</Btn>
        {d.customer_phone&&<Btn variant="outline" onClick={()=>shareWhatsApp(d.customer_phone,propoMsg)}><span className="text-emerald-400 font-bold">WA</span> WhatsApp</Btn>}
        {d.customer_email&&<Btn variant="outline" onClick={()=>shareMail(d.customer_email,`Solar Proposal | ${developer?.companyName||""}`,propoMsg)}><Icon name="mail" size={15}/>Email</Btn>}
      </div>
    </div>
  );
};


// ============================================================
// SOLARPRO v5 - MAIN APP ENTRY (assembles all parts)
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
  const [dateFormat,  setDateFormat]  = useLS("sp_dateFormat",  "DD MMM YYYY");

  // Sync date format global
  _dateFormatKey = dateFormat;

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
      return <LockedPage developer={developer} reason={developer?.paused?"paused":"expired"}/>;
    }
    // Inactive user lock (non-SA, non-dashboard)
    if (!currentUser.active && currentUser.role !== ROLES.SUPER_ADMIN && isProtectedPage(currentPage)) {
      return <LockedPage developer={developer} reason="inactive"/>;
    }

    switch (currentPage) {
      // ── SHARED: DASHBOARD ──
      case "dashboard":
        if (currentUser.role === ROLES.SUPER_ADMIN)
          return <SuperAdminDashboard developers={developers} users={users} projects={projects} invoices={invoices} proposals={proposals}/>;
        if (currentUser.role === ROLES.DEV_ADMIN)
          return <DevDashboard developer={developer} projects={projects} users={users} proposals={proposals} invoices={invoices}/>;
        return <UserDashboard developer={developer} currentUser={currentUser} projects={projects} proposals={proposals} invoices={invoices}/>;

      // ── SUPER ADMIN ONLY ──
      case "developers":
        return <DevelopersPage developers={developers} setDevelopers={setDevelopers} users={users} setUsers={setUsers} invoices={invoices} setInvoices={setInvoices}/>;
      case "create-invoice":
        return <CreateInvoicePage developers={developers} setDevelopers={setDevelopers} users={users} setUsers={setUsers} projects={projects} invoices={invoices} setInvoices={setInvoices} currentUser={currentUser}/>;
      case "invoices":
        if (currentUser.role === ROLES.SUPER_ADMIN)
          return <SuperAdminInvoicesPage invoices={invoices} setInvoices={setInvoices} developers={developers} projects={projects} users={users} currentUser={currentUser}/>;
        return <ProjectInvoicesPage invoices={invoices} setInvoices={setInvoices} projects={projects} developer={developer} currentUser={currentUser} setDevelopers={setDevelopers}/>;

      // ── SHARED: TEMPLATES ──
      case "templates":
        return <TemplatesPage templates={templates} setTemplates={setTemplates} developers={developers} currentUser={currentUser}/>;

      // ── SHARED: USERS ──
      case "users":
      case "team":
        return <UsersPage users={users} setUsers={setUsers} currentUser={currentUser} developers={developers}/>;

      // ── DEV + USER: PROJECTS ──
      case "projects":
        return <ProjectsPage projects={projects} setProjects={setProjects} currentUser={currentUser} setCurrentProjectId={setCurrentProjectId} developer={developer} users={users} setDevelopers={setDevelopers}/>;

      // ── DEV ADMIN: SETTINGS ──
      case "settings":
        return developer ? <SettingsPage developer={developer} setDevelopers={setDevelopers} dateFormat={dateFormat} setDateFormat={setDateFormat} projects={projects} setProjects={setProjects}/> : null;

      // ── ALL USERS: MY PROFILE/SETTINGS ──
      case "my-settings":
        return <MySettingsPage currentUser={currentUser} setUsers={setUsers} developers={developers} setDevelopers={setDevelopers}/>;

      default:
        return null;
    }
  };

  const bg = dark ? "bg-[#060c18] text-white" : "bg-slate-50 text-slate-800";

  return (
    <ThemeCtx.Provider value={themeCtx}>
      <ToastProvider>
      <div className={`flex h-screen overflow-hidden ${bg}`} style={{fontFamily:"'Inter','system-ui',sans-serif"}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
          *{box-sizing:border-box}
          ::-webkit-scrollbar{width:5px;height:5px}
          ::-webkit-scrollbar-track{background:${dark?"#0f172a":"#f1f5f9"}}
          ::-webkit-scrollbar-thumb{background:${dark?"#334155":"#cbd5e1"};border-radius:3px}
          @keyframes slide-in{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
          .animate-slide-in{animation:slide-in 0.25s ease-out}
        `}</style>

        <Sidebar user={currentUser} currentPage={currentPage} setPage={setPage}
          onLogout={() => { setCurrentUser(null); setCurrentPage("dashboard"); setCurrentProjectId(null); }}
          developer={developer}/>

        <div className="flex-1 flex flex-col overflow-hidden">
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
      </ToastProvider>
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
