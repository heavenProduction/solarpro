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

// Invoice flow: ProformaInvoice → (accepted) → SalesOrder → (delivery) → DeliveryChallan → TaxInvoice
const INV_FLOW_NEXT = { "Proforma Invoice":"Sales Order", "Sales Order":"Delivery Challan", "Delivery Challan":"Tax Invoice" };
const INV_FLOW_LABEL = { "Proforma Invoice":"Convert to Sales Order", "Sales Order":"Create Delivery Challan", "Delivery Challan":"Convert to Tax Invoice" };

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

// ── SUPER ADMIN SETTINGS (stored per-session in users array) ──
const SA_DEFAULTS = { bankDetails:"Bank: ICICI\nAccount: 111222333444\nIFSC: ICIC0001111", invoicePrefix:"SP", invoiceNextNum:1001, companyName:"SolarPro Platform", logo:null, stamp:null, signature:null };

// ── INDIA STATES ─────────────────────────────────────────────
const INDIA_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli","Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"];

// ── DATE FORMATS ─────────────────────────────────────────────
const DATE_FORMATS = [
  { key:"DD/MM/YYYY", label:"DD/MM/YYYY", example:"31/12/2025" },
  { key:"MM/DD/YYYY", label:"MM/DD/YYYY", example:"12/31/2025" },
  { key:"YYYY-MM-DD", label:"YYYY-MM-DD", example:"2025-12-31" },
  { key:"DD-MM-YYYY", label:"DD-MM-YYYY", example:"31-12-2025" },
  { key:"DD MMM YYYY", label:"DD MMM YYYY", example:"31 Dec 2025" },
  { key:"MMM DD, YYYY", label:"MMM DD, YYYY", example:"Dec 31, 2025" },
];
let _dateFormatKey = "DD/MM/YYYY";
function fmtDate(iso) {
  if (!iso) return "";
  const [y,m,d] = iso.split("-");
  if (!y||!m||!d) return iso;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mn = months[parseInt(m,10)-1]||"";
  switch(_dateFormatKey) {
    case "MM/DD/YYYY": return `${m}/${d}/${y}`;
    case "YYYY-MM-DD": return iso;
    case "DD-MM-YYYY": return `${d}-${m}-${y}`;
    case "DD MMM YYYY": return `${d} ${mn} ${y}`;
    case "MMM DD, YYYY": return `${mn} ${d}, ${y}`;
    default: return `${d}/${m}/${y}`;
  }
}

// ── LANE COLORS ───────────────────────────────────────────────
const LANE_COLORS = [
  { key:"slate",      hex:"#64748b", label:"Slate Gray"    },
  { key:"gray",       hex:"#6b7280", label:"Cool Gray"     },
  { key:"zinc",       hex:"#71717a", label:"Zinc"          },
  { key:"stone",      hex:"#78716c", label:"Warm Stone"    },
  { key:"red",        hex:"#ef4444", label:"Bright Red"    },
  { key:"rose",       hex:"#f43f5e", label:"Rose Red"      },
  { key:"crimson",    hex:"#dc2626", label:"Crimson"       },
  { key:"orange",     hex:"#f97316", label:"Orange"        },
  { key:"deeporange", hex:"#ea580c", label:"Deep Orange"   },
  { key:"amber",      hex:"#f59e0b", label:"Amber Gold"    },
  { key:"yellow",     hex:"#eab308", label:"Bright Yellow" },
  { key:"lime",       hex:"#84cc16", label:"Lime Green"    },
  { key:"green",      hex:"#22c55e", label:"Bright Green"  },
  { key:"emerald",    hex:"#10b981", label:"Emerald Green" },
  { key:"forest",     hex:"#16a34a", label:"Forest Green"  },
  { key:"teal",       hex:"#14b8a6", label:"Teal"          },
  { key:"cyan",       hex:"#06b6d4", label:"Cyan"          },
  { key:"sky",        hex:"#0ea5e9", label:"Sky Blue"      },
  { key:"blue",       hex:"#3b82f6", label:"Royal Blue"    },
  { key:"navy",       hex:"#1d4ed8", label:"Navy Blue"     },
  { key:"indigo",     hex:"#6366f1", label:"Indigo"        },
  { key:"violet",     hex:"#8b5cf6", label:"Violet"        },
  { key:"purple",     hex:"#a855f7", label:"Purple"        },
  { key:"fuchsia",    hex:"#d946ef", label:"Fuchsia"       },
  { key:"pink",       hex:"#ec4899", label:"Hot Pink"      },
  { key:"coral",      hex:"#fb7185", label:"Coral"         },
  { key:"gold",       hex:"#d97706", label:"Dark Gold"     },
  { key:"brown",      hex:"#92400e", label:"Brown"         },
  { key:"maroon",     hex:"#991b1b", label:"Maroon"        },
  { key:"olive",      hex:"#4d7c0f", label:"Olive Green"   },
  { key:"steel",      hex:"#334155", label:"Steel Blue"    },
  { key:"lavender",   hex:"#c4b5fd", label:"Lavender"      },
  { key:"mint",       hex:"#6ee7b7", label:"Mint Green"    },
];
function laneHex(colorKey) {
  return (LANE_COLORS.find(c=>c.key===colorKey)||LANE_COLORS[0]).hex;
}

// ── INVOICE CONVERT TARGETS ───────────────────────────────────
const INV_CONVERT_TARGETS = ["Proforma Invoice","Tax Invoice","Sales Order","Purchase Order","Delivery Challan"];

// ── DATE FILTER HELPER ────────────────────────────────────────
function applyDateFilter(items, field, range) {
  if (!range || range === "all") return items;
  const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return items.filter(item => {
    const d = item[field] ? new Date(item[field]) : null;
    if (!d) return false;
    if (range === "today") return d >= today && d < new Date(today.getTime()+86400000);
    if (range === "week") { const s = new Date(today); s.setDate(s.getDate()-7); return d >= s; }
    if (range === "month") { const s = new Date(today); s.setDate(s.getDate()-30); return d >= s; }
    if (range === "quarter") { const s = new Date(today); s.setDate(s.getDate()-90); return d >= s; }
    return true;
  });
}

// ── TOAST CONTEXT ─────────────────────────────────────────────
const ToastCtx = createContext({ show:()=>{} });
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = ({ message, undoFn = null, duration = 3000 }) => {
    const id = Date.now() + Math.random();
    let timer = setTimeout(() => remove(id), undoFn ? 30000 : duration);
    setToasts(t => [...t, { id, message, undoFn, timer }]);
  };
  const remove = (id) => setToasts(t => { const item = t.find(x=>x.id===id); if(item) clearTimeout(item.timer); return t.filter(x=>x.id!==id); });
  const doUndo = (id) => {
    setToasts(t => {
      const item = t.find(x=>x.id===id);
      if (item && item.undoFn) { clearTimeout(item.timer); item.undoFn(); }
      return t.filter(x=>x.id!==id);
    });
  };
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div style={{position:"fixed",bottom:"1.5rem",left:"50%",transform:"translateX(-50%)",zIndex:9999,display:"flex",flexDirection:"column",gap:"0.5rem",alignItems:"center"}}>
        {toasts.map(t => (
          <div key={t.id} style={{background:"#1f2937",color:"#f9fafb",padding:"0.75rem 1.25rem",borderRadius:"0.5rem",boxShadow:"0 4px 12px rgba(0,0,0,0.4)",display:"flex",alignItems:"center",gap:"1rem",minWidth:"260px",animation:"slideUp 0.2s ease"}}>
            <span style={{flex:1,fontSize:"0.9rem"}}>{t.message}</span>
            {t.undoFn && <button onClick={()=>doUndo(t.id)} style={{background:"#f59e0b",color:"#000",border:"none",borderRadius:"0.25rem",padding:"0.25rem 0.75rem",cursor:"pointer",fontWeight:600,fontSize:"0.8rem"}}>Undo</button>}
            <button onClick={()=>remove(t.id)} style={{background:"transparent",color:"#9ca3af",border:"none",cursor:"pointer",fontSize:"1.1rem",lineHeight:1}}>&times;</button>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ToastCtx.Provider>
  );
}
function useToast() { return useContext(ToastCtx); }

// ── THEME CONTEXT ────────────────────────────────────────────
const ThemeCtx = createContext({ dark: true, toggle: () => {} });

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
    convert:  <svg {...p}><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>,
    note:     <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
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
  return `<!DOCTYPE html><html><head><title>${docType} — ${inv.id.toUpperCase()}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#404040;background:#fff}@page{size:A4 portrait;margin:15mm}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;width:210mm}}</style>
  </head><body>
  <div style="padding:40px 56px">
    <div style="text-align:center;margin-bottom:20px;font-size:22px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:#1e293b;border-bottom:3px solid #f59e0b;padding-bottom:12px">${docType}</div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <tr>
        <td style="vertical-align:top;width:100%">${logoTag}<div style="font-size:13px;color:#525252">${developer?.address||""}<br/>${developer?.phone||""} | ${developer?.email||""}</div></td>
        <td style="vertical-align:top;white-space:nowrap;text-align:right">
          <div style="font-size:13px;color:#94a3b8">Date</div>
          <div style="font-size:14px;font-weight:700;color:#5c6ac4">${fmtDate(inv.date)}</div>
          <div style="font-size:13px;color:#94a3b8;margin-top:8px">Document #</div>
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

// Opens a print-to-PDF window (proper A4 PDF via browser print dialog)
const downloadInvoice = (inv, developer, customer) => {
  const docType = inv.docType || "Invoice";
  const cxName = (inv.customerName||"Customer").replace(/\s+/g,"_");
  const baseHTML = buildInvoiceHTML({ inv, developer, customer });
  // Inject A4 print CSS so Save as PDF gives a proper A4 page
  const a4CSS = `<style>@page{size:A4 portrait;margin:15mm}body{margin:0}@media print{html,body{width:210mm}}</style>`;
  const html = baseHTML.replace("</head>", a4CSS + "</head>");
  const w = window.open("","_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.document.title = `${docType}_${cxName}_${inv.id}`;
  w.focus();
  setTimeout(()=>{ w.print(); }, 700);
};

// Generate a shareable preview URL (data URI blob URL for this session)
const getInvoicePreviewUrl = (inv, developer, customer) => {
  const html = buildInvoiceHTML({ inv, developer, customer });
  const blob = new Blob([html], {type:"text/html"});
  return URL.createObjectURL(blob);
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
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [docTypeFilter, setDocTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [minAmt, setMinAmt] = useState("");
  const [maxAmt, setMaxAmt] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [convertAllModal, setConvertAllModal] = useState(false);
  const [convertAllTarget, setConvertAllTarget] = useState("Tax Invoice");

  const now = new Date();
  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const startOfWeek  = (d) => { const x=new Date(d); x.setDate(d.getDate()-d.getDay()); x.setHours(0,0,0,0); return x; };
  const startOfLastMonth = (d) => new Date(d.getFullYear(), d.getMonth()-1, 1);
  const endOfLastMonth   = (d) => new Date(d.getFullYear(), d.getMonth(), 0, 23, 59, 59);

  const sortFn = (a, b) => {
    const ta = calcInvoiceTotal(a.items||[]).total || a.amount || 0;
    const tb = calcInvoiceTotal(b.items||[]).total || b.amount || 0;
    if (sortBy==="date_desc")  return new Date(b.date)-new Date(a.date);
    if (sortBy==="date_asc")   return new Date(a.date)-new Date(b.date);
    if (sortBy==="amt_desc")   return tb-ta;
    if (sortBy==="amt_asc")    return ta-tb;
    if (sortBy==="cust_asc")   return (a.customerName||"").localeCompare(b.customerName||"");
    if (sortBy==="cust_desc")  return (b.customerName||"").localeCompare(a.customerName||"");
    return 0;
  };

  const filtered = [...invoices].sort(sortFn).filter(inv=>{
    const invDate = new Date(inv.date);
    const {total} = calcInvoiceTotal(inv.items||[]);
    const displayAmt = total || inv.amount || 0;
    if (search) {
      const q = search.toLowerCase();
      if (!(inv.id||"").toLowerCase().includes(q) && !(inv.customerName||"").toLowerCase().includes(q) && !(inv.docType||"").toLowerCase().includes(q)) return false;
    }
    let pass = true;
    if (dateFilter==="7d")   pass = invDate >= new Date(now - 7*86400000);
    else if (dateFilter==="15d")  pass = invDate >= new Date(now - 15*86400000);
    else if (dateFilter==="30d")  pass = invDate >= new Date(now - 30*86400000);
    else if (dateFilter==="week") pass = invDate >= startOfWeek(now);
    else if (dateFilter==="month")pass = invDate >= startOfMonth(now);
    else if (dateFilter==="lastmonth") pass = invDate >= startOfLastMonth(now) && invDate <= endOfLastMonth(now);
    else if (dateFilter==="custom") pass = (!fromDate||invDate>=new Date(fromDate)) && (!toDate||invDate<=new Date(toDate+" 23:59:59"));
    if (!pass) return false;
    if (statusFilter!=="all" && inv.status!==statusFilter) return false;
    if (docTypeFilter!=="all" && (inv.docType||"Tax Invoice")!==docTypeFilter) return false;
    if (minAmt && displayAmt < parseFloat(minAmt)) return false;
    if (maxAmt && displayAmt > parseFloat(maxAmt)) return false;
    return true;
  });

  const activeFilters = [search, dateFilter!=="all", statusFilter!=="all", docTypeFilter!=="all", minAmt, maxAmt].filter(Boolean).length;
  const clearAll = () => { setSearch(""); setDateFilter("all"); setStatusFilter("all"); setDocTypeFilter("all"); setSortBy("date_desc"); setMinAmt(""); setMaxAmt(""); setFromDate(""); setToDate(""); };

  const selCls = `border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none transition-colors ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`;

  const getShareData = inv => {
    const dev = developers?.find(d=>d.id===inv.developerId) || developer;
    const proj = projects?.find(p=>p.id===inv.projectId);
    const {total}=calcInvoiceTotal(inv.items||[]);
    const phone = inv.customerPhone || proj?.customerPhone || "";
    const email = inv.customerEmail || proj?.customerEmail || "";
    const cxName = inv.customerName || proj?.customerName || "Customer";
    const size = proj ? `${proj.projectSize} ${proj.projectUnit||"kW"}` : "";
    const type = proj?.customerType || proj?.projectType || "";
    // Generate a session preview URL for sharing
    const previewUrl = getInvoicePreviewUrl(inv, dev, proj||{});
    const invoiceMsg = `Hi ${cxName},\n\nHere is your ${inv.docType||"Tax Invoice"} (${inv.id.toUpperCase()}) for your ${size} ${type} solar project worth ${fmtINR(total)}.\n\nView your invoice here: ${previewUrl}\n\nPlease review and let us know if you have any questions.\n\nRegards,\n${dev?.companyName||""}`;
    const invSubject = `${inv.docType||"Invoice"} - ${inv.id.toUpperCase()} | ${dev?.companyName||""}`;
    return {phone, email, msg:invoiceMsg, subject:invSubject, previewUrl};
  };

  return (
    <div>
      {/* Convert All Modal */}
      {convertAllModal&&(
        <Modal title="Convert All Filtered Invoices" onClose={()=>setConvertAllModal(false)}>
          <p className={`text-sm mb-3 ${tc(dark,"text-slate-300","text-slate-600")}`}>Convert all {filtered.length} filtered invoice(s) to:</p>
          <select value={convertAllTarget} onChange={e=>setConvertAllTarget(e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm mb-4 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
            {INV_CONVERT_TARGETS.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex gap-2 justify-end">
            <Btn variant="ghost" size="sm" onClick={()=>setConvertAllModal(false)}>Cancel</Btn>
            <Btn size="sm" onClick={()=>{ filtered.forEach(inv=>onConvert&&onConvert(inv,convertAllTarget)); setConvertAllModal(false); toast.show({message:`Converted ${filtered.length} invoice(s) to ${convertAllTarget}`}); }}>Convert All</Btn>
          </div>
        </Modal>
      )}

      {/* Search + Sort + Filter bar */}
      <div className={`border rounded-xl mb-3 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
        <div className="flex flex-wrap gap-2 p-3 items-center">
          <div className={`flex items-center gap-2 flex-1 min-w-48 border rounded-lg px-3 py-1.5 ${tc(dark,"bg-slate-800 border-slate-600","bg-slate-50 border-slate-300")}`}>
            <Icon name="search" size={14}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by ID, customer, type…" className={`flex-1 bg-transparent text-sm focus:outline-none ${tc(dark,"text-white placeholder-slate-500","text-slate-800 placeholder-slate-400")}`}/>
            {search&&<button onClick={()=>setSearch("")} className={tc(dark,"text-slate-500 hover:text-white","text-slate-400 hover:text-slate-700")}>×</button>}
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className={selCls}>
            <option value="date_desc">↓ Newest First</option>
            <option value="date_asc">↑ Oldest First</option>
            <option value="amt_desc">↓ Highest Amount</option>
            <option value="amt_asc">↑ Lowest Amount</option>
            <option value="cust_asc">A–Z Customer</option>
            <option value="cust_desc">Z–A Customer</option>
          </select>
          <button onClick={()=>setShowFilters(f=>!f)} className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-xs transition-colors ${showFilters?tc(dark,"bg-amber-500/20 border-amber-400/50 text-amber-300","bg-amber-50 border-amber-300 text-amber-700"):tc(dark,"border-slate-600 text-slate-400 hover:border-slate-500","border-slate-300 text-slate-500 hover:border-slate-400")}`}>
            <Icon name="filter" size={13}/>Filters{activeFilters>0&&<span className="ml-0.5 bg-amber-500 text-slate-900 rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{fontSize:10}}>{activeFilters}</span>}
          </button>
          <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{filtered.length} result{filtered.length!==1?"s":""}</span>
          {activeFilters>0&&<button onClick={clearAll} className="text-xs text-amber-400 underline">Clear all</button>}
          {filtered.length>0&&onConvert&&<Btn size="sm" variant="ghost" onClick={()=>setConvertAllModal(true)}><Icon name="convert" size={13}/>Convert All</Btn>}
        </div>
        {showFilters&&(
          <div className={`border-t px-3 pb-3 pt-3 flex flex-wrap gap-2 items-end ${tc(dark,"border-slate-700/50","border-slate-200")}`}>
            <div>
              <p className={`text-xs mb-1 font-medium ${tc(dark,"text-slate-400","text-slate-500")}`}>Date Range</p>
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
            </div>
            {dateFilter==="custom"&&<>
              <div><p className={`text-xs mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>From</p><input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className={selCls}/></div>
              <div><p className={`text-xs mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>To</p><input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className={selCls}/></div>
            </>}
            <div>
              <p className={`text-xs mb-1 font-medium ${tc(dark,"text-slate-400","text-slate-500")}`}>Doc Type</p>
              <select value={docTypeFilter} onChange={e=>setDocTypeFilter(e.target.value)} className={selCls}>
                <option value="all">All Types</option>
                {INV_DOC_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <p className={`text-xs mb-1 font-medium ${tc(dark,"text-slate-400","text-slate-500")}`}>Status</p>
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className={selCls}>
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <p className={`text-xs mb-1 font-medium ${tc(dark,"text-slate-400","text-slate-500")}`}>Min Amount (₹)</p>
              <input type="number" value={minAmt} onChange={e=>setMinAmt(e.target.value)} placeholder="0" className={selCls} style={{width:100}}/>
            </div>
            <div>
              <p className={`text-xs mb-1 font-medium ${tc(dark,"text-slate-400","text-slate-500")}`}>Max Amount (₹)</p>
              <input type="number" value={maxAmt} onChange={e=>setMaxAmt(e.target.value)} placeholder="Any" className={selCls} style={{width:100}}/>
            </div>
          </div>
        )}
      </div>

      {!filtered.length ? (
        <div className={`text-center py-16 border rounded-xl ${tc(dark,"bg-[#0c1929] border-slate-700","bg-white border-slate-200")}`}>
          <Icon name="invoice" size={28}/><p className={`mt-2 ${tc(dark,"text-slate-400","text-slate-500")}`}>No records match filters.</p>
        </div>
      ) : (
        <div className={`border rounded-xl overflow-hidden ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <table className="w-full text-sm">
            <thead><tr className={`border-b ${tc(dark,"border-slate-700 bg-slate-800/30","border-slate-200 bg-slate-50")}`}>
              {[["Doc #",""],["Type",""],["Customer","cust"],["Amount","amt"],["Date","date"],["Status",""],["Actions",""]].map(([h,sk])=>(
                <th key={h} onClick={sk?()=>setSortBy(s=>s===sk+'_desc'?sk+'_asc':sk+'_desc'):undefined}
                  className={`text-left px-3 py-3 font-medium text-xs ${sk?'cursor-pointer select-none':''} ${tc(dark,'text-slate-400 hover:text-white','text-slate-500 hover:text-slate-800')}`}>
                  {h}{sk&&(sortBy.startsWith(sk)?(sortBy.endsWith('desc')?' ↓':' ↑'):' ⇅')}
                </th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(inv=>{
                const dev = developers?.find(d=>d.id===inv.developerId);
                const proj= projects?.find(p=>p.id===inv.projectId);
                const { total } = calcInvoiceTotal(inv.items||[]);
                const displayAmt = total || inv.amount || 0;
                const share = getShareData(inv);
                const nextFlow = INV_FLOW_NEXT[inv.docType];
                return (
                  <tr key={inv.id} className={`border-b transition-colors ${tc(dark,"border-slate-700/30 hover:bg-slate-800/20","border-slate-100 hover:bg-slate-50")}`}>
                    <td className={`px-3 py-3 font-mono text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{inv.id.toUpperCase()}</td>
                    <td className="px-3 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${tc(dark,"bg-amber-500/20 text-amber-300","bg-amber-100 text-amber-700")}`}>{inv.docType||"Tax Invoice"}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className={`font-medium text-xs ${tc(dark,"text-white","text-slate-800")}`}>{inv.customerName || dev?.companyName || "—"}</div>
                      {proj && <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{proj.customerName}</div>}
                    </td>
                    <td className={`px-3 py-3 font-bold text-xs ${tc(dark,"text-white","text-slate-800")}`}>{fmtINR(displayAmt)}</td>
                    <td className={`px-3 py-3 text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{fmtDate(inv.date)}</td>
                    <td className="px-3 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(inv.status,dark)}`}>{inv.status}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1 flex-wrap items-center">
                        <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onView(inv)}><Icon name="eye" size={12}/></Btn>
                        <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onPrint(inv)}><Icon name="print" size={12}/>Print</Btn>
                        <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onDownload&&onDownload(inv)}><Icon name="download" size={12}/>PDF</Btn>
                        {share.phone&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>shareWhatsApp(share.phone, share.msg)} title="WhatsApp"><span className="text-emerald-400 font-bold text-xs">WA</span></Btn>}
                        {share.email&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>shareMail(share.email, share.subject, share.msg)} title="Email"><Icon name="mail" size={12}/></Btn>}
                        {inv.status==="Pending"&&onMarkPaid&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>onMarkPaid(inv.id)}><Icon name="check" size={12}/>Paid</Btn>}
                        {onConvert&&(
                          <div style={{position:"relative",display:"inline-block"}} className="convert-drop-wrap">
                            <select
                              value=""
                              onChange={e=>{ if(e.target.value) onConvert(inv, e.target.value); }}
                              className={`border rounded-lg px-2 py-1 text-xs cursor-pointer focus:outline-none ${tc(dark,"bg-slate-700 border-slate-600 text-sky-400","bg-sky-50 border-sky-200 text-sky-700")}`}
                              title="Convert to…"
                            >
                              <option value="">Convert to…</option>
                              {INV_CONVERT_TARGETS.filter(t=>t!==(inv.docType||"Tax Invoice")).map(t=>(
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                        )}
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
            <Btn onClick={()=>printInvoice(viewInv,getSender(viewInv),getCustomer(viewInv))}><Icon name="print" size={15}/>Print / Save PDF</Btn>
            <Btn variant="outline" onClick={()=>downloadInvoice(viewInv,getSender(viewInv),getCustomer(viewInv))}><Icon name="download" size={15}/>Download PDF</Btn>
            {viewInv.customerPhone&&<Btn variant="outline" onClick={()=>{
              const previewUrl=getInvoicePreviewUrl(viewInv,getSender(viewInv),getCustomer(viewInv));
              shareWhatsApp(viewInv.customerPhone,`Hi ${viewInv.customerName}, here is your ${viewInv.docType||"Invoice"} ${viewInv.id}.\n\nView: ${previewUrl}\n\nRegards, ${getSender(viewInv)?.companyName||""}`);
            }}>WA WhatsApp</Btn>}
            {viewInv.customerEmail&&<Btn variant="outline" onClick={()=>{
              const previewUrl=getInvoicePreviewUrl(viewInv,getSender(viewInv),getCustomer(viewInv));
              shareMail(viewInv.customerEmail,`${viewInv.docType||"Invoice"} - ${viewInv.id}`,`Hi ${viewInv.customerName},\n\nPlease find your ${viewInv.docType||"Invoice"} (${viewInv.id}) at the link below.\n\nView: ${previewUrl}\n\nRegards,\n${getSender(viewInv)?.companyName||""}`);
            }}><Icon name="mail" size={15}/>Email</Btn>}
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
const UsersPage = ({ users, setUsers, currentUser, developers, projects, setProjects }) => {
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

  const [deleteUserModal, setDeleteUserModal] = useState(null); // {user, transferTo, hasProjects}
  const openDeleteUser = (u) => {
    const devUsers = visibleUsers.filter(x=>x.id!==u.id && x.developerId===u.developerId && x.active);
    const assignedCount = (projects||[]).filter(p=>p.assignedUserId===u.id||p.userId===u.id).length;
    setDeleteUserModal({ user:u, transferTo: devUsers[0]?.id||"", hasProjects: assignedCount>0, count: assignedCount, devUsers });
  };
  const confirmDeleteUser = () => {
    if (!deleteUserModal) return;
    if (deleteUserModal.hasProjects && setProjects && deleteUserModal.transferTo) {
      setProjects(ps=>ps.map(p=>{
        const upd = {...p};
        if (p.assignedUserId===deleteUserModal.user.id) upd.assignedUserId = deleteUserModal.transferTo;
        if (p.userId===deleteUserModal.user.id) upd.userId = deleteUserModal.transferTo;
        return upd;
      }));
    }
    setUsers(us=>us.filter(u=>u.id!==deleteUserModal.user.id));
    setDeleteUserModal(null);
  };

  const devName = (devId) => developers?.find(d=>d.id===devId)?.companyName || "—";

  return (
    <div>
      {/* Delete user modal */}
      {deleteUserModal && (
        <Modal title="Delete User" onClose={()=>setDeleteUserModal(null)}>
          {deleteUserModal.hasProjects ? (
            <>
              <div className={`flex items-start gap-2 p-3 rounded-xl mb-4 border ${tc(dark,"bg-amber-500/10 border-amber-400/30","bg-amber-50 border-amber-200")}`}>
                <span className="text-amber-400 text-lg leading-none">⚠</span>
                <div>
                  <p className={`text-sm font-bold mb-1 ${tc(dark,"text-amber-300","text-amber-700")}`}>{deleteUserModal.count} project{deleteUserModal.count!==1?"s":""} assigned to this user</p>
                  <p className={`text-xs ${tc(dark,"text-amber-300/80","text-amber-600")}`}>Choose a team member to transfer all assigned projects to before deletion:</p>
                </div>
              </div>
              {deleteUserModal.devUsers.length>0 ? (
                <select value={deleteUserModal.transferTo} onChange={e=>setDeleteUserModal(d=>({...d,transferTo:e.target.value}))}
                  className={`w-full border rounded-lg px-3 py-2 text-sm mb-4 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                  {deleteUserModal.devUsers.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              ) : (
                <p className={`text-xs mb-4 p-3 rounded-xl ${tc(dark,"bg-red-500/10 text-red-400","bg-red-50 text-red-600")}`}>No other active users available. Projects will remain unassigned.</p>
              )}
            </>
          ) : (
            <p className={`text-sm mb-4 ${tc(dark,"text-slate-300","text-slate-600")}`}>Are you sure you want to permanently delete <strong>{deleteUserModal.user.name}</strong>? This cannot be undone.</p>
          )}
          <div className="flex gap-2 justify-end">
            <Btn variant="ghost" size="sm" onClick={()=>setDeleteUserModal(null)}>Cancel</Btn>
            <Btn variant="danger" size="sm" onClick={confirmDeleteUser}>{deleteUserModal.hasProjects?"Transfer & Delete":"Delete User"}</Btn>
          </div>
        </Modal>
      )}
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
                    <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>openDeleteUser(u)} className="text-red-400 hover:text-red-300"><Icon name="trash" size={12}/>Delete</Btn>
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
  const toast = useToast();
  const [form, setForm] = useState({...developer});
  const [settingsTab, setSettingsTab] = useState("company");
  const [newLane, setNewLane] = useState({name:"",color:"slate"});
  const [newUnit, setNewUnit] = useState("");
  const [newTag, setNewTag] = useState("");
  const [deleteModal, setDeleteModal] = useState(null); // {laneId, transferTo}
  const F = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = () => { setDevelopers(ds=>ds.map(d=>d.id===developer.id?{...d,...form}:d)); toast.show({message:"Settings saved!"}); };

  const addLane = () => {
    if (!newLane.name.trim()) return;
    const lane = {id:`l${Date.now()}`,name:newLane.name,color:newLane.color,disabled:false,order:(form.lanes||[]).length};
    F("lanes",[...(form.lanes||[]),lane]);
    setNewLane({name:"",color:"slate"});
  };
  const updateLane = (id,changes) => F("lanes",(form.lanes||[]).map(l=>l.id===id?{...l,...changes}:l));
  const removeLane = (id) => {
    const lanes = form.lanes||[];
    if (lanes.length <= 1) { toast.show({message:"Cannot delete the only lane."}); return; }
    const hasProjects = (projects||[]).filter(p=>p.developerId===developer.id && p.laneId===id).length > 0;
    setDeleteModal({ laneId: id, transferTo: lanes.find(l=>l.id!==id)?.id||"", hasProjects });
  };
  const confirmDeleteLane = () => {
    if (!deleteModal) return;
    if (deleteModal.hasProjects && setProjects) {
      setProjects(ps=>ps.map(p=>p.laneId===deleteModal.laneId?{...p,laneId:deleteModal.transferTo}:p));
    }
    F("lanes",(form.lanes||[]).filter(l=>l.id!==deleteModal.laneId));
    setDeleteModal(null);
    toast.show({message:"Lane deleted. Projects transferred."});
  };
  const moveLane = (id,dir) => {
    const lanes=[...(form.lanes||[])].sort((a,b)=>a.order-b.order);
    const idx=lanes.findIndex(l=>l.id===id);
    if (dir===-1&&idx===0||dir===1&&idx===lanes.length-1) return;
    [lanes[idx].order,lanes[idx+dir].order]=[lanes[idx+dir].order,lanes[idx].order];
    F("lanes",lanes);
  };
  // Lane drag-drop reorder
  const [laneDragId, setLaneDragId] = useState(null);
  const [laneDragOver, setLaneDragOver] = useState(null);
  const onLaneRowDragStart = (e, id) => { setLaneDragId(id); e.dataTransfer.effectAllowed="move"; };
  const onLaneRowDragOver  = (e, id) => { e.preventDefault(); setLaneDragOver(id); };
  const onLaneRowDrop      = (e, targetId) => {
    e.preventDefault();
    if (!laneDragId || laneDragId===targetId) { setLaneDragId(null); setLaneDragOver(null); return; }
    const sorted=[...(form.lanes||[])].sort((a,b)=>a.order-b.order);
    const fromIdx=sorted.findIndex(l=>l.id===laneDragId);
    const toIdx  =sorted.findIndex(l=>l.id===targetId);
    const moved=sorted.splice(fromIdx,1)[0];
    sorted.splice(toIdx,0,moved);
    F("lanes",sorted.map((l,i)=>({...l,order:i})));
    setLaneDragId(null); setLaneDragOver(null);
  };
  const onLaneRowDragEnd = () => { setLaneDragId(null); setLaneDragOver(null); };
  const addCustomUnit = () => { if(newUnit.trim()) { F("customUnits",[...(form.customUnits||[]),newUnit.trim()]); setNewUnit(""); }};

  return (
    <div>
      {/* Delete lane modal */}
      {deleteModal && (
        <Modal title="Delete Lane" onClose={()=>setDeleteModal(null)}>
          {deleteModal.hasProjects ? (
            <>
              <div className={`flex items-start gap-2 p-3 rounded-xl mb-4 border ${tc(dark,"bg-amber-500/10 border-amber-400/30","bg-amber-50 border-amber-200")}`}>
                <span className="text-amber-400 text-lg leading-none">⚠</span>
                <div>
                  <p className={`text-sm font-bold mb-1 ${tc(dark,"text-amber-300","text-amber-700")}`}>This lane has projects</p>
                  <p className={`text-xs ${tc(dark,"text-amber-300/80","text-amber-600")}`}>All projects in this lane will be transferred before deletion. Choose the destination lane:</p>
                </div>
              </div>
              <select value={deleteModal.transferTo} onChange={e=>setDeleteModal(d=>({...d,transferTo:e.target.value}))}
                className={`w-full border rounded-lg px-3 py-2 text-sm mb-4 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                {(form.lanes||[]).filter(l=>l.id!==deleteModal.laneId).map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </>
          ) : (
            <p className={`text-sm mb-4 ${tc(dark,"text-slate-300","text-slate-600")}`}>This lane is empty. Are you sure you want to delete it?</p>
          )}
          <div className="flex gap-2 justify-end">
            <Btn variant="ghost" size="sm" onClick={()=>setDeleteModal(null)}>Cancel</Btn>
            <Btn variant="danger" size="sm" onClick={confirmDeleteLane}>{deleteModal.hasProjects?"Transfer & Delete":"Delete Lane"}</Btn>
          </div>
        </Modal>
      )}

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
          <div className="mt-2">
            <label className={`block text-sm font-medium mb-1 ${tc(dark,"text-slate-300","text-slate-700")}`}>State</label>
            <select value={form.state||""} onChange={e=>F("state",e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
              <option value="">Select state</option>
              {INDIA_STATES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
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
          <div className="mt-3">
            <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Date Format</label>
            <select value={dateFormat} onChange={e=>setDateFormat(e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none mb-2 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
              {DATE_FORMATS.map(f=><option key={f.key} value={f.key}>{f.label} — e.g. {f.example}</option>)}
            </select>
            <p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>Preview: {fmtDate(TODAY)}</p>
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
            <div className="flex flex-wrap gap-2">
              {(form.customUnits||[]).map(u=><span key={u} className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${tc(dark,"bg-slate-700 text-slate-300","bg-slate-100 text-slate-600")}`}>{u}<button onClick={()=>F("customUnits",(form.customUnits||[]).filter(x=>x!==u))} className="text-red-400 ml-1">×</button></span>)}
            </div>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${tc(dark,"text-slate-300","text-slate-700")}`}>Default Project Tags</label>
            <div className="flex gap-2 mb-2">
              <input value={newTag} onChange={e=>setNewTag(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newTag.trim()){F("defaultTags",[...(form.defaultTags||[]),newTag.trim()]);setNewTag("");}}} placeholder="Add tag (press Enter)" className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500","bg-white border-slate-300 text-slate-800")}`}/>
              <Btn size="sm" onClick={()=>{if(newTag.trim()){F("defaultTags",[...(form.defaultTags||[]),newTag.trim()]);setNewTag("");}}}><Icon name="plus" size={13}/>Add</Btn>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.defaultTags||[]).map(t=><span key={t} className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1">{t}<button onClick={()=>F("defaultTags",(form.defaultTags||[]).filter(x=>x!==t))} className="text-red-400 ml-1">×</button></span>)}
            </div>
          </div>
        </div>
      )}

      {settingsTab==="lanes"&&(
        <div className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
          <h3 className={`font-bold mb-3 text-sm ${tc(dark,"text-white","text-slate-800")}`}>Project Lanes / Status</h3>
          <p className={`text-xs mb-2 ${tc(dark,"text-slate-500","text-slate-400")}`}>Drag ↕ to reorder lanes</p>
          <div className="space-y-2 mb-4">
            {[...(form.lanes||[])].sort((a,b)=>a.order-b.order).map((lane,i,arr)=>{
              const laneProjectCount = (projects||[]).filter(p=>p.developerId===developer.id&&p.laneId===lane.id).length;
              return (
              <div key={lane.id}
                draggable
                onDragStart={e=>onLaneRowDragStart(e,lane.id)}
                onDragOver={e=>onLaneRowDragOver(e,lane.id)}
                onDrop={e=>onLaneRowDrop(e,lane.id)}
                onDragEnd={onLaneRowDragEnd}
                className={`flex items-center gap-2 border rounded-xl p-3 transition-all cursor-grab active:cursor-grabbing ${laneDragOver===lane.id?tc(dark,"border-amber-400/60 bg-amber-500/10","border-amber-400 bg-amber-50"):tc(dark,"bg-slate-800/40 border-slate-700","bg-slate-50 border-slate-200")} ${laneDragId===lane.id?"opacity-40":""}`}>
                <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" className={`flex-shrink-0 ${tc(dark,"text-slate-600","text-slate-300")}`}>
                  <circle cx="3" cy="3" r="1.3"/><circle cx="7" cy="3" r="1.3"/>
                  <circle cx="3" cy="8" r="1.3"/><circle cx="7" cy="8" r="1.3"/>
                  <circle cx="3" cy="13" r="1.3"/><circle cx="7" cy="13" r="1.3"/>
                </svg>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor:laneHex(lane.color)}}/>
                <span className={`flex-1 text-sm font-medium ${lane.disabled?tc(dark,"text-slate-500 line-through","text-slate-400 line-through"):tc(dark,"text-white","text-slate-800")}`}>{lane.name}</span>
                {laneProjectCount>0&&<span className={`text-xs px-2 py-0.5 rounded-full ${tc(dark,"bg-slate-700 text-slate-400","bg-slate-200 text-slate-500")}`}>{laneProjectCount} project{laneProjectCount!==1?"s":""}</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${lane.disabled?tc(dark,"bg-red-500/20 text-red-400","bg-red-100 text-red-600"):tc(dark,"bg-emerald-500/20 text-emerald-400","bg-emerald-100 text-emerald-700")}`}>{lane.disabled?"Disabled":"Active"}</span>
                <div className="flex gap-1">
                  <button onClick={()=>updateLane(lane.id,{disabled:!lane.disabled})} className={`p-1 rounded text-xs ${tc(dark,"hover:bg-slate-700 text-amber-400","hover:bg-amber-50 text-amber-600")}`}>{lane.disabled?"Enable":"Disable"}</button>
                  <button onClick={()=>removeLane(lane.id)} title={laneProjectCount>0?"Transfer & delete":"Delete lane"} className={`p-1 rounded ${tc(dark,"hover:bg-slate-700 text-red-400","hover:bg-red-50 text-red-500")}`}><Icon name="trash" size={12}/></button>
                </div>
              </div>
            );
            })}
          </div>
          <div className={`border rounded-xl p-3 ${tc(dark,"bg-slate-800/30 border-slate-700","bg-slate-50 border-slate-200")}`}>
            <h4 className={`text-xs font-bold mb-2 ${tc(dark,"text-slate-400","text-slate-500")}`}>Add New Lane</h4>
            <div className="flex gap-2 mb-2">
              <input value={newLane.name} onChange={e=>setNewLane(n=>({...n,name:e.target.value}))} placeholder="Lane name" className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none ${tc(dark,"bg-slate-700 border-slate-600 text-white placeholder-slate-500","bg-white border-slate-300 text-slate-800")}`}/>
              <Btn size="sm" onClick={addLane} disabled={!newLane.name.trim()}><Icon name="plus" size={13}/>Add</Btn>
            </div>
            <div className="mb-1">
              <p className={`text-xs mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>Color:</p>
              <div className="flex flex-wrap gap-1.5">
                {LANE_COLORS.map(c=>(
                  <button key={c.key} onClick={()=>setNewLane(n=>({...n,color:c.key}))} title={c.label}
                    style={{backgroundColor:c.hex, width:20, height:20, borderRadius:"50%", border: newLane.color===c.key?"3px solid white":"2px solid transparent", outline: newLane.color===c.key?"2px solid #f59e0b":"none"}}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4"><Btn onClick={save} size="lg"><Icon name="check" size={16}/>Save All Settings</Btn></div>
    </div>
  );
};

// ── PROJECTS PAGE — Kanban + Advanced Filters + Bulk Upload ──
const ProjectsPage = ({ projects, setProjects, currentUser, setCurrentProjectId, developer, users, setDevelopers }) => {
  const { dark } = useTheme();
  const [view, setView] = useState("kanban"); // kanban | list
  const [showAdd, setShowAdd] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [bulkModal, setBulkModal] = useState(null); // "delete" | "lane" | "assign"
  const [bulkTarget, setBulkTarget] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const importFileRef = useRef();
  const toast = useToast();

  const lanes = developer?.lanes?.filter(l=>!l.disabled).sort((a,b)=>a.order-b.order) || [{id:"default",name:"All Projects",color:"slate"}];
  const devTeam = users ? users.filter(u=>u.developerId===currentUser.developerId && u.role!==ROLES.SUPER_ADMIN && u.active) : [];
  const customCities = developer?.customCities||[];

  // Filter state — extended with multi-select and date search
  const blankFilters = { q:"", projectId:"", customerName:"", customerPhone:"", customerEmail:"", customerCity:"", customerPincode:"", customerState:"", customerTypes:[], enquiryTypes:[], assignedTos:[], laneIds:[], minSize:"", maxSize:"", datePreset:"all", dateFrom:"", dateTo:"" };
  const [filters, setFilters] = useState({...blankFilters});
  const FF = (k,v) => setFilters(f=>({...f,[k]:v}));
  const toggleFilterArr = (k, val) => setFilters(f => {
    const arr = f[k]||[];
    return {...f, [k]: arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val]};
  });
  const clearFilters = () => setFilters({...blankFilters});
  const selCls = `border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none transition-colors ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`;
  const activeFilterCount = Object.entries(filters).filter(([k,v])=>{
    if (k==="q") return v.length>0;
    if (Array.isArray(v)) return v.length>0;
    if (k==="datePreset") return v!=="all";
    return v.length>0;
  }).length;

  const myProjects = projects.filter(p => {
    if (currentUser.role===ROLES.USER) return p.assignedUserId===currentUser.id || p.userId===currentUser.id;
    return p.developerId===currentUser.developerId;
  });

  // Date range helpers for project search
  const _now = new Date();
  const _d7  = new Date(_now - 7*86400000);
  const _d15 = new Date(_now - 15*86400000);
  const _d30 = new Date(_now - 30*86400000);
  const _som  = new Date(_now.getFullYear(),_now.getMonth(),1);
  const _sow  = (()=>{const d=new Date(_now);d.setDate(_now.getDate()-_now.getDay());d.setHours(0,0,0,0);return d;})();
  const _slm  = new Date(_now.getFullYear(),_now.getMonth()-1,1);
  const _elm  = new Date(_now.getFullYear(),_now.getMonth(),0,23,59,59);
  const _dateInRange = (dateStr) => {
    if (filters.datePreset==="all"&&!filters.dateFrom&&!filters.dateTo) return true;
    const d = new Date(dateStr);
    if (filters.datePreset==="7d")    return d >= _d7;
    if (filters.datePreset==="15d")   return d >= _d15;
    if (filters.datePreset==="30d")   return d >= _d30;
    if (filters.datePreset==="week")  return d >= _sow;
    if (filters.datePreset==="month") return d >= _som;
    if (filters.datePreset==="lastmonth") return d>=_slm && d<=_elm;
    if (filters.datePreset==="custom") return (!filters.dateFrom||d>=new Date(filters.dateFrom)) && (!filters.dateTo||d<=new Date(filters.dateTo+" 23:59:59"));
    return true;
  };

  const applyFilters = (list) => list.filter(p => {
    // Global search — hits all text fields
    if (filters.q) {
      const qs = filters.q.toLowerCase();
      const fields = [p.customerName,p.projectId,p.customerAddress,p.customerCity,p.customerState,p.customerPincode,p.customerPhone,p.customerEmail,p.pocName].map(x=>(x||"").toLowerCase());
      if (!fields.some(f=>f.includes(qs))) return false;
    }
    if (filters.projectId && !p.projectId?.toLowerCase().includes(filters.projectId.toLowerCase())) return false;
    if (filters.customerName && !p.customerName?.toLowerCase().includes(filters.customerName.toLowerCase())) return false;
    if (filters.customerPhone && !(p.customerPhone||"").includes(filters.customerPhone)) return false;
    if (filters.customerEmail && !(p.customerEmail||"").toLowerCase().includes(filters.customerEmail.toLowerCase())) return false;
    if (filters.customerCity && !(p.customerCity||"").toLowerCase().includes(filters.customerCity.toLowerCase())) return false;
    if (filters.customerPincode && !(p.customerPincode||"").includes(filters.customerPincode)) return false;
    if (filters.customerState && !(p.customerState||"").toLowerCase().includes(filters.customerState.toLowerCase())) return false;
    // Multi-select arrays — empty means "all"
    if (filters.customerTypes.length>0 && !filters.customerTypes.includes(p.customerType)) return false;
    if (filters.enquiryTypes.length>0 && !filters.enquiryTypes.includes(p.enquiryType)) return false;
    if (filters.laneIds.length>0 && !filters.laneIds.includes(p.laneId)) return false;
    if (filters.assignedTos.length>0 && !filters.assignedTos.includes(p.assignedUserId) && !filters.assignedTos.includes(p.userId)) return false;
    if (filters.minSize && parseFloat(p.projectSize)<parseFloat(filters.minSize)) return false;
    if (filters.maxSize && parseFloat(p.projectSize)>parseFloat(filters.maxSize)) return false;
    if (!_dateInRange(p.createdAt)) return false;
    return true;
  });

  const filteredProjects = applyFilters(myProjects);

  const blankForm = { customerName:"", customerType:"Residential", pocName:"", countryCode:"+91", customerPhone:"", customerEmail:"", customerPincode:"", customerCity:"", customerState:"", customerAddress:"", projectSize:"", projectUnit:developer?.defaultProjectUnit||"kW", enquiryType:"Warm", laneId:lanes[0]?.id||"", assignedUserId:currentUser.id, projectIdOverride:"" };
  const [form, setForm] = useState(blankForm);
  const SF = (k,v) => setForm(f=>({...f,[k]:v}));

  const autoProjectId = () => {
    const prefix = developer?.projectPrefix || "PRJ";
    const num = developer?.projectNextNum || 1001;
    return `${prefix}-${num}`;
  };

  // Pincode lookup
  const onPincodeChange = (pin) => {
    SF("customerPincode", pin);
    if (pin.length===6 && PINCODE_MAP[pin]) {
      SF("customerCity", PINCODE_MAP[pin].city);
      SF("customerState", PINCODE_MAP[pin].state);
    }
  };

  const saveProject = (isEdit) => {
    const phone = `${form.countryCode} ${form.customerPhone}`.trim();
    const pid = isEdit ? editProject.projectId : (form.projectIdOverride || autoProjectId());
    if (!isEdit) setDevelopers(ds=>ds.map(d=>d.id===developer.id?{...d,projectNextNum:(d.projectNextNum||1001)+1}:d));
    const entry = { id:`act${Date.now()}`, type: isEdit?"edited":"created", message: isEdit?`Project updated`:`Project created`, by: "You", at: new Date().toISOString() };
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
      activityLog: isEdit ? [...(editProject.activityLog||[]), entry] : [entry],
      tags: form.tags || [],
    };
    if (isEdit) setProjects(ps=>ps.map(p=>p.id===editProject.id?proj:p));
    else setProjects(ps=>[...ps,proj]);
    setShowAdd(false); setEditProject(null); setForm(blankForm);
    toast.show({ message: isEdit ? "Project updated." : "Project created." });
  };

  const openEdit = (p) => {
    const [cc, ...numParts] = (p.customerPhone||"").split(" ");
    setForm({...blankForm, ...p, countryCode:COUNTRY_CODES.find(c=>c.code===cc)?cc:"+91", customerPhone:numParts.join(" ")||p.customerPhone, projectIdOverride:p.projectId});
    setEditProject(p);
    setShowAdd(true);
  };

  // Excel export
  const exportExcel = () => {
    const rows = [["Project ID","Customer","Type","Phone","Email","Pincode","City","State","Address","Size","Unit","Lane","Enquiry","Assigned To","Created At"]];
    filteredProjects.forEach(p=>{
      const user = devTeam.find(u=>u.id===(p.assignedUserId||p.userId));
      const lane = lanes.find(l=>l.id===p.laneId);
      rows.push([p.projectId||"",p.customerName||"",p.customerType||"",p.customerPhone||"",p.customerEmail||"",p.customerPincode||"",p.customerCity||"",p.customerState||"",p.customerAddress||"",p.projectSize||"",p.projectUnit||"kW",lane?.name||"",p.enquiryType||"",user?.name||"",p.createdAt||""]);
    });
    const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="projects.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Excel import
  const importExcel = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split("\n").slice(1); // skip header
      const imported = lines.filter(l=>l.trim()).map((line,i)=>{
        const cols = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(c=>c.replace(/^"|"$/g,"").replace(/""/g,'"').trim());
        // Resolve lane name to id
        const laneByName = lanes.find(l=>l.name.toLowerCase()===(cols[13]||"").toLowerCase());
        // Resolve user name to id
        const userByName = devTeam.find(u=>u.name.toLowerCase()===(cols[15]||"").toLowerCase());
        return {
          id:`p${Date.now()}${i}`,
          projectId: cols[0]||autoProjectId(),
          customerName: cols[1]||"",
          customerType: cols[2]||"Residential",
          pocName: cols[3]||"",
          customerEmail: cols[4]||"",
          customerPhone: cols[5]||"",
          customerPincode: cols[7]||"",
          customerCity: cols[8]||"",
          customerState: cols[9]||"",
          customerAddress: cols[10]||"",
          projectSize: parseFloat(cols[11])||0,
          projectUnit: cols[12]||"kW",
          laneId: laneByName?.id || lanes[0]?.id||"",
          enquiryType: cols[14]||"Warm",
          assignedUserId: userByName?.id || currentUser.id,
          tags: (cols[16]||"").split(",").map(t=>t.trim()).filter(Boolean),
          developerId: currentUser.developerId,
          userId: userByName?.id || currentUser.id,
          createdAt: TODAY,
          lastActivity: TODAY,
          activityLog: [{id:`act${Date.now()}`,type:"created",message:"Imported from CSV",by:currentUser.name,at:new Date().toISOString()}],
        };
      });
      setProjects(ps=>[...ps,...imported]);
      toast.show({message:`Imported ${imported.length} project(s).`});
    };
    reader.readAsText(file);
    e.target.value="";
  };

  const addCustomCity = (city) => setDevelopers(ds=>ds.map(d=>d.id===developer?.id?{...d,customCities:[...(d.customCities||[]),city]}:d));

  // ── DRAG AND DROP ENGINE ────────────────────────────────────
  const [dragId, setDragId] = useState(null);
  const [dragOverLane, setDragOverLane] = useState(null);
  const [ghostPos, setGhostPos] = useState({x:0,y:0});
  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const [dropDirection, setDropDirection] = useState(null); // "forward"|"backward"|"same"
  const [dragSourceLane, setDragSourceLane] = useState(null);
  const [isDropping, setIsDropping] = useState(false); // brief flash on successful drop
  const dragRef = useRef({id:null, startX:0, startY:0, moved:false, sourceLane:null});
  const laneRefs = useRef({});
  const kanbanScrollRef = useRef(null);
  const edgeScrollRef = useRef(null);
  const droppedCardRef = useRef(null); // track last dropped for flash animation

  const getDraggedProject = () => projects.find(p=>p.id===dragRef.current.id);

  // Stub API call – replace URL with your real endpoint
  const apiUpdateProjectStage = async (projectId, laneId, laneName) => {
    try {
      await fetch(`/api/projects/${projectId}/stage`, {
        method: "PATCH",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ laneId, laneName, updatedAt: new Date().toISOString() })
      });
    } catch (_) { /* offline / dev mode — silently ignore */ }
  };

  const getLaneOrder = (laneId) => lanes.findIndex(l=>l.id===laneId);

  const calcDropDirection = (srcLaneId, dstLaneId) => {
    if (!srcLaneId || !dstLaneId || srcLaneId===dstLaneId) return "same";
    return getLaneOrder(dstLaneId) > getLaneOrder(srcLaneId) ? "forward" : "backward";
  };

  const startEdgeScroll = (dir) => {
    if (edgeScrollRef.current) return;
    edgeScrollRef.current = setInterval(() => {
      if (!kanbanScrollRef.current) return;
      kanbanScrollRef.current.scrollLeft += dir * 12;
    }, 16);
  };
  const stopEdgeScroll = () => {
    if (edgeScrollRef.current) { clearInterval(edgeScrollRef.current); edgeScrollRef.current = null; }
  };

  const onCardPointerDown = (e, projectId) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const srcLane = projects.find(p=>p.id===projectId)?.laneId || null;
    dragRef.current = { id: projectId, startX: e.clientX, startY: e.clientY, moved: false, sourceLane: srcLane };
    setGhostPos({ x: e.clientX, y: e.clientY });
    setDragSourceLane(srcLane);

    const onMove = (ev) => {
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      if (!dragRef.current.moved && Math.sqrt(dx*dx+dy*dy) > 5) {
        dragRef.current.moved = true;
        setDragId(dragRef.current.id);
        setIsDraggingActive(true);
      }
      if (!dragRef.current.moved) return;

      setGhostPos({ x: ev.clientX, y: ev.clientY });

      // Find hovered lane using bounding rect hit test
      let found = null;
      Object.entries(laneRefs.current).forEach(([laneId, el]) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (ev.clientX >= rect.left && ev.clientX <= rect.right &&
            ev.clientY >= rect.top  && ev.clientY <= rect.bottom) {
          found = laneId;
        }
      });
      setDragOverLane(found);
      setDropDirection(found ? calcDropDirection(dragRef.current.sourceLane, found) : null);

      // Edge-scroll the kanban container
      if (kanbanScrollRef.current) {
        const kr = kanbanScrollRef.current.getBoundingClientRect();
        const edgeW = 80;
        if (ev.clientX < kr.left + edgeW) startEdgeScroll(-1);
        else if (ev.clientX > kr.right - edgeW) startEdgeScroll(1);
        else stopEdgeScroll();
      }
    };

    const onUp = (ev) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      stopEdgeScroll();

      const movedCard = dragRef.current.moved && dragRef.current.id;

      if (movedCard) {
        // Final lane hit-test
        let dropLane = null;
        Object.entries(laneRefs.current).forEach(([laneId, el]) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          if (ev.clientX >= rect.left && ev.clientX <= rect.right &&
              ev.clientY >= rect.top  && ev.clientY <= rect.bottom) {
            dropLane = laneId;
          }
        });

        if (dropLane) {
          const proj = projects.find(p=>p.id===dragRef.current.id);
          const laneName = lanes.find(l=>l.id===dropLane)?.name || "";
          const dir = calcDropDirection(dragRef.current.sourceLane, dropLane);
          const dirLabel = dir==="forward" ? " → advanced" : dir==="backward" ? " ← moved back" : "";

          // Update UI state immediately
          const actEntry = {
            id: `act${Date.now()}`,
            type: "stage_change",
            message: `Stage changed to “${laneName}”${dirLabel}`,
            by: "You",
            at: new Date().toISOString()
          };
          setProjects(ps=>ps.map(p=>p.id===dragRef.current.id
            ? {...p, laneId:dropLane, lastActivity:new Date().toISOString().slice(0,10),
               activityLog:[...(p.activityLog||[]),actEntry]}
            : p
          ));

          // Flash on successful drop
          droppedCardRef.current = dragRef.current.id;
          setIsDropping(true);
          setTimeout(()=>setIsDropping(false), 600);

          // Fire API
          if (proj) apiUpdateProjectStage(proj.projectId || proj.id, dropLane, laneName);

          const dirIcon = dir==="forward"?"⟶":dir==="backward"?"⟵":"•";
          toast.show({message:`${dirIcon} Moved to ${laneName}`});
        }
      }

      dragRef.current.id = null;
      dragRef.current.moved = false;
      setDragId(null);
      setDragOverLane(null);
      setDropDirection(null);
      setDragSourceLane(null);
      setIsDraggingActive(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };
  const selectAll = () => setSelected(new Set(filteredProjects.map(p=>p.id)));
  const clearSelect = () => setSelected(new Set());

  const bulkDelete = () => {
    const ids = [...selected];
    const backup = projects.filter(p=>ids.includes(p.id));
    setProjects(ps=>ps.filter(p=>!ids.includes(p.id)));
    clearSelect(); setBulkModal(null);
    toast.show({ message: `${ids.length} project(s) deleted.`, undoFn: ()=>setProjects(ps=>[...ps,...backup]) });
  };
  const bulkMoveLane = () => {
    if (!bulkTarget) return;
    setProjects(ps=>ps.map(p=>selected.has(p.id)?{...p,laneId:bulkTarget}:p));
    toast.show({ message: `Moved ${selected.size} project(s) to new lane.` });
    clearSelect(); setBulkModal(null);
  };
  const bulkAssign = () => {
    if (!bulkTarget) return;
    setProjects(ps=>ps.map(p=>selected.has(p.id)?{...p,assignedUserId:bulkTarget}:p));
    toast.show({ message: `Assigned ${selected.size} project(s).` });
    clearSelect(); setBulkModal(null);
  };

  const typeColors = { Residential:"bg-sky-500/20 text-sky-300 border-sky-500/30", Commercial:"bg-amber-500/20 text-amber-300 border-amber-500/30", Industrial:"bg-purple-500/20 text-purple-300 border-purple-500/30", Government:"bg-emerald-500/20 text-emerald-300 border-emerald-500/30", Other:"bg-slate-500/20 text-slate-300 border-slate-500/30" };
  const typeColorsL = { Residential:"bg-sky-100 text-sky-700", Commercial:"bg-amber-100 text-amber-700", Industrial:"bg-purple-100 text-purple-700", Government:"bg-emerald-100 text-emerald-700", Other:"bg-slate-100 text-slate-600" };
  const enquiryColors = { Hot:"bg-red-500/20 text-red-300", Warm:"bg-orange-500/20 text-orange-300", Cold:"bg-sky-500/20 text-sky-300" };
  const enquiryColorsL = { Hot:"bg-red-100 text-red-700", Warm:"bg-orange-100 text-orange-700", Cold:"bg-sky-100 text-sky-700" };
  const laneAccents = { slate:"border-slate-500", sky:"border-sky-400", amber:"border-amber-400", orange:"border-orange-400", emerald:"border-emerald-400", red:"border-red-400", purple:"border-purple-400" };

  const isLocked = !currentUser?.active || (developer && (developer.paused || (developer.subscriptionEnd && new Date(developer.subscriptionEnd)<new Date())));
  if (isLocked) return <LockedPage developer={developer} reason={!currentUser?.active?"inactive":developer?.paused?"paused":"expired"}/>;

  // ── PROJECT CARD ─────────────────────────────────────────────
  const [openCardMenuId, setOpenCardMenuId] = useState(null);
  React.useEffect(()=>{
    if (!openCardMenuId) return;
    const handler = ()=>setOpenCardMenuId(null);
    window.addEventListener("pointerdown", handler, true);
    return ()=>window.removeEventListener("pointerdown", handler, true);
  },[openCardMenuId]);

  const ProjectCard = ({p}) => {
    const user = devTeam.find(u=>u.id===(p.assignedUserId||p.userId));
    const isDragging = dragId===p.id;
    const justDropped = isDropping && droppedCardRef.current===p.id;
    const isSelected = selected.has(p.id);
    const menuOpen = openCardMenuId===p.id;

    const quickUpdateLane = (laneId) => {
      const laneName = lanes.find(l=>l.id===laneId)?.name||"";
      const entry = {id:`act${Date.now()}`,type:"stage_change",message:`Lane changed to "${laneName}"`,by:"You",at:new Date().toISOString()};
      setProjects(ps=>ps.map(x=>x.id===p.id?{...x,laneId,activityLog:[...(x.activityLog||[]),entry]}:x));
      setOpenCardMenuId(null);
      toast.show({message:`Moved to ${laneName}`});
    };
    const quickUpdateAssignee = (uid) => {
      const uname = devTeam.find(u=>u.id===uid)?.name||"Unassigned";
      const entry = {id:`act${Date.now()}`,type:"assigned",message:`Assigned to ${uname}`,by:"You",at:new Date().toISOString()};
      setProjects(ps=>ps.map(x=>x.id===p.id?{...x,assignedUserId:uid,activityLog:[...(x.activityLog||[]),entry]}:x));
      setOpenCardMenuId(null);
      toast.show({message:`Assigned to ${uname}`});
    };

    return (
      <div
        className={`border rounded-xl p-3 mb-2 select-none ${isDragging?"opacity-15 scale-95 pointer-events-none":""} ${justDropped?tc(dark,"border-amber-400 shadow-lg","border-amber-400 shadow-lg"):isSelected?tc(dark,"border-amber-500/60 bg-amber-500/5","border-amber-400 bg-amber-50"):tc(dark,"border-slate-700/50","border-slate-200 shadow-sm")} ${tc(dark,"bg-[#0c1929]","bg-white")}`}
        style={{touchAction:"none", transition:"opacity 120ms, transform 120ms, border-color 300ms"}}>

        {/* Top row: checkbox + drag handle + quick-action menu */}
        <div className="flex items-center gap-1.5 mb-2">
          {/* Checkbox for multi-select */}
          <input type="checkbox" checked={isSelected} onChange={()=>toggleSelect(p.id)}
            onClick={e=>e.stopPropagation()}
            className="w-3.5 h-3.5 accent-amber-500 flex-shrink-0 cursor-pointer"/>

          {/* Drag handle area (also shows project ID + enquiry badge) */}
          <div
            onPointerDown={e=>onCardPointerDown(e, p.id)}
            className={`flex items-center justify-between flex-1 cursor-grab active:cursor-grabbing rounded-lg px-1 py-0.5 -mx-1 transition-colors group ${tc(dark,"hover:bg-slate-700/60","hover:bg-slate-100")}`}>
            <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${tc(dark,"bg-slate-700 text-slate-400","bg-slate-100 text-slate-500")}`}>{p.projectId||"—"}</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${tc(dark,enquiryColors[p.enquiryType]||"bg-slate-500/20 text-slate-300 border-slate-500/30",enquiryColorsL[p.enquiryType]||"bg-slate-100 text-slate-600")}`}>{p.enquiryType||"—"}</span>
              <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" className={`opacity-30 group-hover:opacity-70 transition-opacity ${tc(dark,"text-slate-300","text-slate-500")}`}>
                <circle cx="3" cy="2.5" r="1.3"/><circle cx="7" cy="2.5" r="1.3"/>
                <circle cx="3" cy="7" r="1.3"/><circle cx="7" cy="7" r="1.3"/>
                <circle cx="3" cy="11.5" r="1.3"/><circle cx="7" cy="11.5" r="1.3"/>
              </svg>
            </div>
          </div>

          {/* Quick-action menu button */}
          <div className="relative">
            <button
              onClick={e=>{e.stopPropagation();setOpenCardMenuId(menuOpen?null:p.id);}}
              className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors flex-shrink-0 ${menuOpen?tc(dark,"bg-slate-600 text-white","bg-slate-200 text-slate-700"):tc(dark,"text-slate-500 hover:bg-slate-700 hover:text-white","text-slate-400 hover:bg-slate-100 hover:text-slate-700")}`}
              title="Quick actions">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <circle cx="7" cy="2.5" r="1.4"/><circle cx="7" cy="7" r="1.4"/><circle cx="7" cy="11.5" r="1.4"/>
              </svg>
            </button>
            {menuOpen&&(
              <div className={`absolute right-0 top-8 z-50 rounded-xl shadow-2xl border w-52 overflow-hidden ${tc(dark,"bg-slate-800 border-slate-700","bg-white border-slate-200")}`}
                onClick={e=>e.stopPropagation()}>
                {/* Move to Lane */}
                <div className={`px-3 py-2 border-b ${tc(dark,"border-slate-700 text-slate-400","border-slate-100 text-slate-500")}`} style={{fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>Move to Lane</div>
                {lanes.map(l=>(
                  <button key={l.id} onClick={()=>quickUpdateLane(l.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${p.laneId===l.id?tc(dark,"bg-amber-500/10 text-amber-300","bg-amber-50 text-amber-700"):tc(dark,"hover:bg-slate-700 text-white","hover:bg-slate-50 text-slate-700")}`}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:laneHex(l.color),flexShrink:0,display:"inline-block"}}/>
                    {l.name}
                    {p.laneId===l.id&&<span className="ml-auto text-amber-400" style={{fontSize:10}}>current</span>}
                  </button>
                ))}
                {/* Assign To */}
                <div className={`px-3 py-2 border-t border-b ${tc(dark,"border-slate-700 text-slate-400","border-slate-100 text-slate-500")}`} style={{fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>Assign To</div>
                {devTeam.map(u=>(
                  <button key={u.id} onClick={()=>quickUpdateAssignee(u.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${(p.assignedUserId||p.userId)===u.id?tc(dark,"bg-amber-500/10 text-amber-300","bg-amber-50 text-amber-700"):tc(dark,"hover:bg-slate-700 text-white","hover:bg-slate-50 text-slate-700")}`}>
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-white font-bold flex-shrink-0 ${tc(dark,"bg-slate-600","bg-amber-400")}`} style={{fontSize:9}}>{u.name.charAt(0)}</span>
                    {u.name}
                    {(p.assignedUserId||p.userId)===u.id&&<span className="ml-auto text-amber-400" style={{fontSize:10}}>assigned</span>}
                  </button>
                ))}
                {devTeam.length===0&&<p className={`px-3 py-2 text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>No team members</p>}
              </div>
            )}
          </div>
        </div>

        {/* Card body */}
        <div onClick={()=>{ if(!dragRef.current.moved) { setOpenCardMenuId(null); setCurrentProjectId(p.id); }}} className="cursor-pointer">
          <h4 className={`font-bold text-sm mb-0.5 ${tc(dark,"text-white","text-slate-800")}`}>{p.customerName}</h4>
          {p.pocName&&<p className={`text-xs mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>POC: {p.pocName}</p>}
          <p className={`text-xs mb-2 ${tc(dark,"text-slate-400","text-slate-500")}`}>{[p.customerCity,p.customerState].filter(Boolean).join(", ")||p.customerAddress||"—"}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full ${tc(dark,typeColors[p.customerType]||"bg-slate-500/20 text-slate-300 border border-slate-500/30",typeColorsL[p.customerType]||"bg-slate-100 text-slate-600")}`}>{p.customerType||"—"}</span>
            <span className={`text-xs font-medium ${tc(dark,"text-amber-400","text-amber-600")}`}>{p.projectSize} {p.projectUnit||"kW"}</span>
            {user&&<span className={`text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>→{user.name}</span>}
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          <button onClick={e=>{e.stopPropagation();openEdit(p);}} className={`text-xs px-2 py-1 rounded-lg transition-colors ${tc(dark,"bg-slate-700 text-slate-300 hover:bg-slate-600","bg-slate-100 text-slate-600 hover:bg-slate-200")}`}><Icon name="edit" size={11}/></button>
          <button onClick={e=>{e.stopPropagation();if(!dragRef.current.moved){setOpenCardMenuId(null);setCurrentProjectId(p.id);}}} className={`text-xs px-2 py-1 rounded-lg transition-colors ${tc(dark,"bg-slate-700 text-slate-300 hover:bg-slate-600","bg-slate-100 text-slate-600 hover:bg-slate-200")}`}><Icon name="eye" size={11}/></button>
        </div>
      </div>
    );
  };

  // Ghost card rendered during drag
  const GhostCard = () => {
    const dp = getDraggedProject();
    if (!dp) return null;
    const dirColor = dropDirection==="forward"?"#10b981":dropDirection==="backward"?"#f59e0b":"#64748b";
    const dirIcon  = dropDirection==="forward"?"⇢":dropDirection==="backward"?"⇠":"•";
    const targetLane = dragOverLane ? lanes.find(l=>l.id===dragOverLane) : null;
    return (
      <div style={{
        position:"fixed", left:ghostPos.x+16, top:ghostPos.y+16,
        width:228, zIndex:9999, pointerEvents:"none",
        transform:"rotate(2.5deg) scale(1.03)",
        filter:"drop-shadow(0 24px 48px rgba(0,0,0,0.6))",
      }}>
        <div style={{borderRadius:14, padding:12, border:"2px solid "+dirColor, background: dark?"#0c1929":"#fff", boxShadow:"0 0 0 4px "+dirColor+"22"}}>
          <div className="flex items-center justify-between mb-2">
            <span style={{fontSize:10,fontFamily:"monospace",padding:"2px 6px",borderRadius:4,background:dark?"#1e293b":"#f1f5f9",color:dark?"#94a3b8":"#64748b"}}>{dp.projectId||"—"}</span>
            {targetLane && (
              <span style={{fontSize:10,fontWeight:700,color:dirColor}}>{dirIcon} {targetLane.name}</span>
            )}
          </div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:2,color:dark?"#fff":"#1e293b"}}>{dp.customerName}</div>
          <div style={{fontSize:11,color:dark?"#94a3b8":"#64748b"}}>{dp.projectSize} {dp.projectUnit||"kW"} · {dp.customerType||"—"}</div>
          {targetLane && (
            <div style={{marginTop:8,paddingTop:6,borderTop:"1px solid "+(dark?"#1e293b":"#e2e8f0"),display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:10,color:dark?"#64748b":"#94a3b8"}}>Moving to</span>
              <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:laneHex(targetLane.color)}}/>
              <span style={{fontSize:11,fontWeight:600,color:dirColor}}>{targetLane.name}</span>
              <span style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:dirColor,letterSpacing:"0.05em"}}>{dropDirection==="forward"?"ADVANCE":dropDirection==="backward"?"REVERT":"SAME"}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={isDraggingActive?{userSelect:"none",cursor:"grabbing"}:{}}>
      {/* Floating ghost card during drag */}
      {isDraggingActive && dragId && <GhostCard/>}
      {isDraggingActive && dragId && (()=>{
        const dp = getDraggedProject();
        if (!dp) return null;
        return (
          <div style={{
            position:"fixed", left:ghostPos.x+12, top:ghostPos.y+12,
            width:240, zIndex:9999, pointerEvents:"none",
            transform:"rotate(2deg)",
            filter:"drop-shadow(0 20px 40px rgba(0,0,0,0.5))",
            transition:"none",
          }}>
            <div className={`border-2 rounded-xl p-3 border-amber-400/80 ${tc(dark,"bg-[#0c1929]","bg-white")}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${tc(dark,"bg-slate-700 text-slate-400","bg-slate-100 text-slate-500")}`}>{dp.projectId||"—"}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${tc(dark,enquiryColors[dp.enquiryType]||"bg-slate-500/20 text-slate-300 border-slate-500/30",enquiryColorsL[dp.enquiryType]||"bg-slate-100 text-slate-600")}`}>{dp.enquiryType||"—"}</span>
              </div>
              <div className={`font-bold text-sm mb-0.5 ${tc(dark,"text-white","text-slate-800")}`}>{dp.customerName}</div>
              <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{dp.projectSize} {dp.projectUnit||"kW"} · {dp.customerType||"—"}</div>
              {dragOverLane && (
                <div className="mt-2 text-xs text-amber-400 font-medium">
                  → {lanes.find(l=>l.id===dragOverLane)?.name||""}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Import Modal */}
      {showImportModal&&(
        <Modal title="Import Projects from CSV" onClose={()=>setShowImportModal(false)} wide>
          <div className={`p-4 rounded-xl mb-4 border ${tc(dark,"bg-slate-800/50 border-slate-700","bg-slate-50 border-slate-200")}`}>
            <h4 className={`font-bold text-sm mb-2 ${tc(dark,"text-white","text-slate-800")}`}>Step 1 — Download the template</h4>
            <p className={`text-xs mb-3 ${tc(dark,"text-slate-400","text-slate-500")}`}>Download a CSV template with correct headers and one example row. Fill it in, then upload below.</p>
            <Btn size="sm" onClick={()=>{
              const customerTypes = ["Residential","Commercial","Industrial","Government","Other"];
              const units = [...(developer?.customUnits||[]),...PROJECT_UNITS].filter((v,i,a)=>a.indexOf(v)===i);
              const laneNames = lanes.map(l=>l.name);
              const teamNames = devTeam.map(u=>u.name);
              const exampleRow = [
                "SP-1001","John Doe","Residential","John Doe","","9876543210","john@email.com","400001","Mumbai","Maharashtra","123 Solar St","8.5","kW","New Enquiry","Warm","Unassigned",""
              ];
              const headers = ["Project ID","Customer Name","Customer Type ("+customerTypes.join("/")+")", "POC Name","Customer Email (optional)","Phone","Email","Pincode","City","State","Address","Project Size","Project Unit ("+units.join("/")+")", "Lane ("+laneNames.join("/")+")", "Enquiry (Hot/Warm/Cold)", "Assigned To ("+teamNames.join("/")+")", "Tags (comma separated)"];
              const rows = [headers, exampleRow];
              const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
              const blob = new Blob([csv],{type:"text/csv"});
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href=url; a.download="project_import_template.csv"; a.click();
              URL.revokeObjectURL(url);
            }}><Icon name="download" size={14}/>Download Template CSV</Btn>
          </div>
          <div className={`p-4 rounded-xl border ${tc(dark,"bg-slate-800/50 border-slate-700","bg-slate-50 border-slate-200")}`}>
            <h4 className={`font-bold text-sm mb-2 ${tc(dark,"text-white","text-slate-800")}`}>Step 2 — Upload your filled CSV</h4>
            <p className={`text-xs mb-3 ${tc(dark,"text-slate-400","text-slate-500")}`}>Make sure you keep the header row. Each row becomes a new project.</p>
            <div className="flex gap-2">
              <input ref={importFileRef} type="file" accept=".csv" onChange={e=>{ importExcel(e); setShowImportModal(false); }} className="hidden"/>
              <Btn onClick={()=>importFileRef.current?.click()}><Icon name="import" size={14}/>Select CSV File</Btn>
            </div>
          </div>
        </Modal>
      )}
      {bulkModal==="delete"&&(
        <Modal title="Delete Selected Projects" onClose={()=>setBulkModal(null)}>
          <p className={`text-sm mb-4 ${tc(dark,"text-slate-300","text-slate-600")}`}>Delete {selected.size} selected project(s)? This can be undone within 30 seconds.</p>
          <div className="flex gap-2 justify-end">
            <Btn variant="ghost" size="sm" onClick={()=>setBulkModal(null)}>Cancel</Btn>
            <Btn variant="danger" size="sm" onClick={bulkDelete}>Delete</Btn>
          </div>
        </Modal>
      )}
      {bulkModal==="lane"&&(
        <Modal title="Move to Lane" onClose={()=>setBulkModal(null)}>
          <p className={`text-sm mb-3 ${tc(dark,"text-slate-300","text-slate-600")}`}>Move {selected.size} project(s) to:</p>
          <select value={bulkTarget} onChange={e=>setBulkTarget(e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm mb-4 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
            <option value="">Select lane</option>
            {lanes.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <div className="flex gap-2 justify-end">
            <Btn variant="ghost" size="sm" onClick={()=>setBulkModal(null)}>Cancel</Btn>
            <Btn size="sm" onClick={bulkMoveLane} disabled={!bulkTarget}>Move</Btn>
          </div>
        </Modal>
      )}
      {bulkModal==="assign"&&(
        <Modal title="Assign to Team Member" onClose={()=>setBulkModal(null)}>
          <p className={`text-sm mb-3 ${tc(dark,"text-slate-300","text-slate-600")}`}>Assign {selected.size} project(s) to:</p>
          <select value={bulkTarget} onChange={e=>setBulkTarget(e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm mb-4 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
            <option value="">Select member</option>
            {devTeam.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <div className="flex gap-2 justify-end">
            <Btn variant="ghost" size="sm" onClick={()=>setBulkModal(null)}>Cancel</Btn>
            <Btn size="sm" onClick={bulkAssign} disabled={!bulkTarget}>Assign</Btn>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>Projects</h1>
          <p className={`text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>{filteredProjects.length} of {myProjects.length} projects</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>setView(v=>v==="kanban"?"list":"kanban")}><Icon name={view==="kanban"?"sort":"kanban"} size={15}/>{view==="kanban"?"List":"Kanban"}</Btn>
          <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={exportExcel}><Icon name="export" size={14}/>Export</Btn>
          <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>setShowImportModal(true)}><Icon name="import" size={14}/>Import</Btn>
          <Btn onClick={()=>{setEditProject(null);setForm({...blankForm,laneId:lanes[0]?.id||""});setShowAdd(true);}}><Icon name="plus" size={15}/>New Project</Btn>
        </div>
      </div>



      {/* Select all row — shown in both views */}
      <div className="flex items-center gap-2 mb-2">
        <input type="checkbox"
          checked={selected.size===filteredProjects.length&&filteredProjects.length>0}
          onChange={e=>e.target.checked?selectAll():clearSelect()}
          className="w-3.5 h-3.5 accent-amber-500"/>
        <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>
          {selected.size>0?`${selected.size} of ${filteredProjects.length} selected`:"Select all"}
        </span>
        {selected.size>0&&(
          <div className="flex gap-1.5 ml-1">
            <button onClick={()=>{setBulkTarget(lanes[0]?.id||"");setBulkModal("lane");}} className={`text-xs px-2 py-0.5 rounded border ${tc(dark,"border-slate-700 text-slate-400 hover:bg-slate-700","border-slate-300 text-slate-500 hover:bg-slate-100")}`}>Move Lane</button>
            <button onClick={()=>{setBulkTarget(devTeam[0]?.id||"");setBulkModal("assign");}} className={`text-xs px-2 py-0.5 rounded border ${tc(dark,"border-slate-700 text-slate-400 hover:bg-slate-700","border-slate-300 text-slate-500 hover:bg-slate-100")}`}>Assign</button>
            <button onClick={()=>setBulkModal("delete")} className="text-xs px-2 py-0.5 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10">Delete</button>
            <button onClick={clearSelect} className={`text-xs ${tc(dark,"text-slate-500 hover:text-white","text-slate-400 hover:text-slate-700")}`}>✕ Clear</button>
          </div>
        )}
      </div>

      {/* Search + Filter Bar */}
      <div className={`border rounded-xl mb-3 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
        <div className="flex flex-wrap gap-2 p-3 items-center">
          <div className={`flex items-center gap-2 flex-1 min-w-48 border rounded-lg px-3 py-1.5 ${tc(dark,"bg-slate-800 border-slate-600","bg-slate-50 border-slate-300")}`}>
            <Icon name="search" size={14}/>
            <input value={filters.q} onChange={e=>FF("q",e.target.value)}
              placeholder="Search name, ID, city, state, pincode, phone, email…"
              className={`flex-1 bg-transparent text-sm focus:outline-none ${tc(dark,"text-white placeholder-slate-500","text-slate-800 placeholder-slate-400")}`}/>
            {filters.q&&<button onClick={()=>FF("q","")} className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>×</button>}
          </div>
          <button onClick={()=>setShowFilters(f=>!f)} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters?tc(dark,"bg-amber-500/20 border-amber-500/40 text-amber-300","bg-amber-50 border-amber-300 text-amber-700"):tc(dark,"border-slate-600 text-slate-400 hover:border-slate-500","border-slate-300 text-slate-500 hover:border-slate-400")}`}>
            <Icon name="filter" size={13}/>Filters
            {activeFilterCount>0&&<span className="ml-0.5 bg-amber-500 text-slate-900 rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{fontSize:10}}>{activeFilterCount}</span>}
          </button>
          <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{filteredProjects.length}/{myProjects.length}</span>
          {activeFilterCount>0&&<button onClick={clearFilters} className="text-xs text-amber-400 underline">Clear all</button>}
        </div>

        {showFilters&&(
          <div className={`border-t px-4 pb-4 pt-3 ${tc(dark,"border-slate-700/50","border-slate-200")}`}>
            {/* Row 1: Text searches */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <div>
                <p className={`text-xs font-medium mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>Project ID</p>
                <input value={filters.projectId} onChange={e=>FF("projectId",e.target.value)} placeholder="SP-1001…" className={`w-full ${selCls}`}/>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>Customer Name</p>
                <input value={filters.customerName} onChange={e=>FF("customerName",e.target.value)} placeholder="John Doe…" className={`w-full ${selCls}`}/>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>Phone</p>
                <input value={filters.customerPhone} onChange={e=>FF("customerPhone",e.target.value)} placeholder="+91…" className={`w-full ${selCls}`}/>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>Email</p>
                <input value={filters.customerEmail} onChange={e=>FF("customerEmail",e.target.value)} placeholder="user@email.com" className={`w-full ${selCls}`}/>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>City</p>
                <input value={filters.customerCity} onChange={e=>FF("customerCity",e.target.value)} placeholder="Mumbai…" className={`w-full ${selCls}`}/>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>Pincode</p>
                <input value={filters.customerPincode} onChange={e=>FF("customerPincode",e.target.value)} placeholder="400001…" className={`w-full ${selCls}`}/>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>State</p>
                <input value={filters.customerState} onChange={e=>FF("customerState",e.target.value)} placeholder="Maharashtra…" className={`w-full ${selCls}`}/>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${tc(dark,"text-slate-400","text-slate-500")}`}>Size Range (kW)</p>
                <div className="flex gap-1 items-center">
                  <input type="number" value={filters.minSize} onChange={e=>FF("minSize",e.target.value)} placeholder="Min" className={`flex-1 ${selCls}`}/>
                  <span className={`text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>–</span>
                  <input type="number" value={filters.maxSize} onChange={e=>FF("maxSize",e.target.value)} placeholder="Max" className={`flex-1 ${selCls}`}/>
                </div>
              </div>
            </div>

            {/* Row 2: Multi-select chips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
              {/* Customer Type multi-select */}
              <div>
                <p className={`text-xs font-medium mb-1.5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Customer Type <span className={`font-normal ${tc(dark,"text-slate-600","text-slate-400")}`}>(select multiple)</span></p>
                <div className="flex flex-wrap gap-1.5">
                  {["Residential","Commercial","Industrial","Government","Other"].map(t=>(
                    <button key={t} onClick={()=>toggleFilterArr("customerTypes",t)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${filters.customerTypes.includes(t)?tc(dark,"bg-amber-500/20 border-amber-400/60 text-amber-300","bg-amber-100 border-amber-400 text-amber-700"):tc(dark,"border-slate-700 text-slate-400 hover:border-slate-500","border-slate-200 text-slate-500 hover:border-slate-300")}`}>{t}</button>
                  ))}
                </div>
              </div>
              {/* Enquiry Type multi-select */}
              <div>
                <p className={`text-xs font-medium mb-1.5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Enquiry Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Hot","Warm","Cold"].map(t=>{
                    const colors = {Hot:tc(dark,"bg-red-500/20 border-red-400/60 text-red-300","bg-red-100 border-red-400 text-red-700"),Warm:tc(dark,"bg-orange-500/20 border-orange-400/60 text-orange-300","bg-orange-100 border-orange-400 text-orange-700"),Cold:tc(dark,"bg-sky-500/20 border-sky-400/60 text-sky-300","bg-sky-100 border-sky-400 text-sky-700")};
                    return (
                      <button key={t} onClick={()=>toggleFilterArr("enquiryTypes",t)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${filters.enquiryTypes.includes(t)?colors[t]:tc(dark,"border-slate-700 text-slate-400 hover:border-slate-500","border-slate-200 text-slate-500 hover:border-slate-300")}`}>{t}</button>
                    );
                  })}
                </div>
              </div>
              {/* Lane multi-select */}
              <div>
                <p className={`text-xs font-medium mb-1.5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Lane / Stage</p>
                <div className="flex flex-wrap gap-1.5">
                  {lanes.map(l=>(
                    <button key={l.id} onClick={()=>toggleFilterArr("laneIds",l.id)}
                      style={filters.laneIds.includes(l.id)?{background:laneHex(l.color)+"22",borderColor:laneHex(l.color)+"99",color:laneHex(l.color)}:{}}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${filters.laneIds.includes(l.id)?"":""+tc(dark,"border-slate-700 text-slate-400 hover:border-slate-500","border-slate-200 text-slate-500 hover:border-slate-300")}`}>
                      <span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:laneHex(l.color),marginRight:4,verticalAlign:"middle"}}/>
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Assigned To multi-select */}
              <div>
                <p className={`text-xs font-medium mb-1.5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Assigned To</p>
                <div className="flex flex-wrap gap-1.5">
                  {devTeam.map(u=>(
                    <button key={u.id} onClick={()=>toggleFilterArr("assignedTos",u.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${filters.assignedTos.includes(u.id)?tc(dark,"bg-amber-500/20 border-amber-400/60 text-amber-300","bg-amber-100 border-amber-400 text-amber-700"):tc(dark,"border-slate-700 text-slate-400 hover:border-slate-500","border-slate-200 text-slate-500 hover:border-slate-300")}`}>{u.name}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Date created */}
            <div>
              <p className={`text-xs font-medium mb-1.5 ${tc(dark,"text-slate-400","text-slate-500")}`}>Created Date</p>
              <div className="flex flex-wrap gap-1.5 items-center">
                {[["all","All Time"],["7d","Last 7d"],["15d","Last 15d"],["30d","Last 30d"],["week","This Week"],["month","This Month"],["lastmonth","Last Month"],["custom","Custom…"]].map(([v,label])=>(
                  <button key={v} onClick={()=>FF("datePreset",v)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${filters.datePreset===v?tc(dark,"bg-amber-500/20 border-amber-400/60 text-amber-300","bg-amber-100 border-amber-400 text-amber-700"):tc(dark,"border-slate-700 text-slate-400 hover:border-slate-500","border-slate-200 text-slate-500 hover:border-slate-300")}`}>{label}</button>
                ))}
                {filters.datePreset==="custom"&&(
                  <>
                    <input type="date" value={filters.dateFrom} onChange={e=>FF("dateFrom",e.target.value)} className={`${selCls}`}/>
                    <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>to</span>
                    <input type="date" value={filters.dateTo} onChange={e=>FF("dateTo",e.target.value)} className={`${selCls}`}/>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KANBAN VIEW */}
      {view==="kanban"&&(
        <>
          {/* Pipeline progress bar shown while dragging */}
          {isDraggingActive && dragSourceLane && (
            <div className={`flex items-center gap-1 mb-3 p-2 px-3 rounded-xl border ${tc(dark,"bg-slate-900/60 border-slate-700","bg-slate-50 border-slate-200")}`}>
              {lanes.map((lane,i)=>{
                const isSource = lane.id===dragSourceLane;
                const isTarget = lane.id===dragOverLane;
                const srcIdx = lanes.findIndex(l=>l.id===dragSourceLane);
                const tgtIdx = lanes.findIndex(l=>l.id===dragOverLane);
                const inRange = dragOverLane && i>=Math.min(srcIdx,tgtIdx) && i<=Math.max(srcIdx,tgtIdx);
                const lineColor = inRange ? (dropDirection==="forward"?"#10b981":"#f59e0b") : (dark?"#1e293b":"#e2e8f0");
                return (
                  <React.Fragment key={lane.id}>
                    {i>0&&<div style={{flex:1,height:2,background:lineColor,transition:"background 180ms"}}/>}
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid "+(isSource?"#f59e0b":isTarget?(dropDirection==="forward"?"#10b981":"#f59e0b"):inRange?"#475569":"#1e293b"),background:isSource?"#f59e0b22":isTarget?(dropDirection==="forward"?"#10b98122":"#f59e0b22"):inRange?"#47556920":"transparent",transition:"all 160ms",transform:isSource||isTarget?"scale(1.25)":"scale(1)"}}>
                        <div style={{width:7,height:7,borderRadius:"50%",margin:"auto",background:isSource?"#f59e0b":isTarget?(dropDirection==="forward"?"#10b981":"#f59e0b"):inRange?"#475569":"#334155"}}/>
                      </div>
                      <span style={{fontSize:8,color:isSource||isTarget?dark?"#fbbf24":"#d97706":dark?"#475569":"#94a3b8",textAlign:"center",lineHeight:1.1,maxWidth:40,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lane.name}</span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <div ref={kanbanScrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{scrollBehavior:"smooth"}}>
            {lanes.map((lane)=>{
              const laneProjects = filteredProjects.filter(p=>p.laneId===lane.id);
              const totalSize = laneProjects.reduce((s,p)=>s+(parseFloat(p.projectSize)||0),0);
              const totalVal  = laneProjects.reduce((s,p)=>s+Math.round((developer?.costPerKW||50000)*(parseFloat(p.projectSize)||0)),0);
              const isOver    = dragOverLane===lane.id;
              const isSource  = dragSourceLane===lane.id && isDraggingActive;
              const dir       = isOver ? dropDirection : null;
              const dirColor  = dir==="forward"?"#10b981":dir==="backward"?"#f59e0b":"#6366f1";
              const laneColor = laneHex(lane.color);
              return (
                <div key={lane.id} className="flex-shrink-0 w-72"
                  ref={el => laneRefs.current[lane.id] = el}>

                  {/* Lane header */}
                  <div style={{
                    borderRadius:12, padding:12, marginBottom:8,
                    borderTop:`3px solid ${isOver?dirColor:laneColor}`,
                    background: isOver?(dark?`${dirColor}14`:`${dirColor}0f`):isSource?(dark?"rgba(30,41,59,0.3)":"rgba(241,245,249,0.6)"):(dark?"rgba(12,25,41,0.7)":"rgba(248,250,252,1)"),
                    boxShadow: isOver?`0 0 0 2px ${dirColor}44`:"none",
                    transition:"all 180ms ease",
                  }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span style={{width:10,height:10,borderRadius:"50%",background:isOver?dirColor:laneColor,flexShrink:0,display:"inline-block"}}/>
                        <span className={`font-bold text-sm ${isSource?tc(dark,"text-slate-500","text-slate-400"):tc(dark,"text-white","text-slate-800")}`}>{lane.name}</span>
                        {isOver&&dir&&dir!=="same"&&(
                          <span style={{fontSize:9,fontWeight:800,letterSpacing:"0.06em",color:dirColor,padding:"1px 5px",borderRadius:5,background:dirColor+"22"}}>
                            {dir==="forward"?"⇢ ADVANCE":"⇠ REVERT"}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tc(dark,"bg-slate-700/60 text-slate-300","bg-white text-slate-600 border border-slate-200")}`}>{laneProjects.length}</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className={tc(dark,"text-slate-400","text-slate-500")}>{totalSize.toFixed(1)} kW</span>
                      <span style={{color:isOver?dirColor:dark?"#f59e0b":"#d97706",fontWeight:600}}>~{fmtINR(totalVal)}</span>
                    </div>
                  </div>

                  {/* Cards + drop zone — max 5 visible, scrollable */}
                  <div style={{
                    minHeight:64,
                    maxHeight:"640px",
                    overflowY: laneProjects.length>5 ? "auto" : "visible",
                    outline: isOver?`2px dashed ${dirColor}70`:"2px dashed transparent",
                    outlineOffset:3, borderRadius:12,
                    background: isOver?(dark?`${dirColor}08`:`${dirColor}05`):"transparent",
                    transition:"all 160ms ease",
                    scrollbarWidth:"thin",
                    scrollbarColor: dark?"#334155 transparent":"#cbd5e1 transparent",
                  }}>
                    {laneProjects.map(p=><ProjectCard key={p.id} p={p}/>)}
                    {isOver&&isDraggingActive&&(
                      <div style={{
                        borderRadius:10, padding:"14px 8px", textAlign:"center",
                        border:`2px dashed ${dirColor}90`,
                        background:dirColor+"10", margin:"4px 0",
                        color:dirColor, fontSize:12, fontWeight:700,
                        animation:"dnd-pulse 700ms ease infinite",
                      }}>
                        {dir==="forward"?"⇢ Drop to advance":dir==="backward"?"⇠ Drop to revert":"◆ Drop here"}
                      </div>
                    )}
                    {!laneProjects.length&&!isOver&&(
                      <div className={`rounded-xl p-5 text-center text-xs border-2 border-dashed ${tc(dark,"border-slate-800 text-slate-700","border-slate-200 text-slate-400")}`}>
                        No projects
                      </div>
                    )}
                  </div>
                  {/* "N more" badge below capped lane */}
                  {laneProjects.length>5&&(
                    <div className={`flex items-center justify-center gap-1 mt-1.5 text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="2" cy="5" r="1.2"/><circle cx="5" cy="5" r="1.2"/><circle cx="8" cy="5" r="1.2"/></svg>
                      <span>Scroll to see all {laneProjects.length} ↕</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <style>{`@keyframes dnd-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.65;transform:scale(0.985)}}`}</style>
        </>
      )}

      {/* LIST VIEW */}
      {view==="list"&&(
        filteredProjects.length ? (
          <div className={`border rounded-xl overflow-hidden ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
            <table className="w-full text-sm">
              <thead><tr className={`border-b ${tc(dark,"border-slate-700 bg-slate-800/30","border-slate-200 bg-slate-50")}`}>
                <th className="px-3 py-2.5 w-8"><input type="checkbox" checked={selected.size===filteredProjects.length&&filteredProjects.length>0} onChange={e=>e.target.checked?selectAll():clearSelect()} className="w-4 h-4 accent-amber-500"/></th>
                {["Project ID","Customer","Type","Size","Lane","Enquiry","Assigned","Actions"].map(h=>(
                  <th key={h} className={`text-left px-3 py-2.5 text-xs font-medium ${tc(dark,"text-slate-400","text-slate-500")}`}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filteredProjects.map(p=>{
                  const lane = lanes.find(l=>l.id===p.laneId);
                  const user = devTeam.find(u=>u.id===(p.assignedUserId||p.userId));
                  return (
                    <tr key={p.id} className={`border-b transition-colors ${selected.has(p.id)?tc(dark,"bg-amber-500/5","bg-amber-50"):tc(dark,"hover:bg-slate-800/20","hover:bg-slate-50")} ${tc(dark,"border-slate-700/30","border-slate-100")}`}>
                      <td className="px-3 py-2.5" onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selected.has(p.id)} onChange={()=>toggleSelect(p.id)} className="w-4 h-4 accent-amber-500"/></td>
                      <td className={`px-3 py-2.5 font-mono text-xs cursor-pointer ${tc(dark,"text-slate-400","text-slate-500")}`} onClick={()=>setCurrentProjectId(p.id)}>{p.projectId||"—"}</td>
                      <td className="px-3 py-2.5 cursor-pointer" onClick={()=>setCurrentProjectId(p.id)}>
                        <div className={`font-medium text-xs ${tc(dark,"text-white","text-slate-800")}`}>{p.customerName}</div>
                        {p.pocName&&<div className={`text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>{p.pocName}</div>}
                      </td>
                      <td className="px-3 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full ${tc(dark,typeColors[p.customerType]||"",typeColorsL[p.customerType]||"")}`}>{p.customerType||"—"}</span></td>
                      <td className={`px-3 py-2.5 font-medium text-xs text-amber-400`}>{p.projectSize} {p.projectUnit||"kW"}</td>
                      <td className={`px-3 py-2.5 text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{lane?.name||"—"}</td>
                      <td className="px-3 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full ${tc(dark,enquiryColors[p.enquiryType]||"",enquiryColorsL[p.enquiryType]||"")}`}>{p.enquiryType||"—"}</span></td>
                      <td className={`px-3 py-2.5 text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{user?.name||"—"}</td>
                      <td className="px-3 py-2.5" onClick={e=>e.stopPropagation()}>
                        <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>openEdit(p)}><Icon name="edit" size={12}/>Edit</Btn>
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
            <p className={`text-sm mb-4 ${tc(dark,"text-slate-400","text-slate-500")}`}>Try adjusting your filters or create a new project</p>
          </div>
        )
      )}

      {/* ADD / EDIT Modal */}
      {showAdd&&(
        <Modal title={editProject?"Edit Project":"Add New Project"} onClose={()=>{setShowAdd(false);setEditProject(null);setForm(blankForm);}} wide>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Customer Type" type="select" value={form.customerType} onChange={v=>SF("customerType",v)} options={["Residential","Commercial","Industrial","Government","Other"]} required/>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Project ID <span className="text-xs font-normal opacity-60">(auto)</span></label>
              <div className="flex gap-2 mb-4">
                {editProject
                  ? <input value={form.projectIdOverride||editProject.projectId||autoProjectId()} onChange={e=>SF("projectIdOverride",e.target.value)} className={`flex-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
                  : <div className={`flex-1 border rounded-lg px-3 py-2.5 text-sm ${tc(dark,"bg-slate-700/50 border-slate-600 text-slate-400","bg-slate-100 border-slate-200 text-slate-500")}`}>{autoProjectId()} <span className="text-xs opacity-50">- assigned automatically</span></div>
                }
              </div>
            </div>
            <Field label="Customer Name" value={form.customerName} onChange={v=>SF("customerName",v)} required/>
            {["Commercial","Industrial","Government"].includes(form.customerType)&&<Field label="Point of Contact Name" value={form.pocName||""} onChange={v=>SF("pocName",v)}/>}
          </div>

          {/* Phone with country code */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Customer Phone <span className="text-amber-400">*</span></label>
            <div className="flex">
              <select value={form.countryCode} onChange={e=>SF("countryCode",e.target.value)} className={`border border-r-0 rounded-l-lg px-2 py-2.5 focus:outline-none text-xs ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                {COUNTRY_CODES.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
              <input value={form.customerPhone} onChange={e=>SF("customerPhone",e.target.value.replace(/\D/g,""))} placeholder="Phone number" className={`flex-1 border rounded-r-lg px-3 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500","bg-white border-slate-300 text-slate-800")}`}/>
            </div>
          </div>

          {/* Email with validation */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Customer Email</label>
            <input type="email" value={form.customerEmail} onChange={e=>SF("customerEmail",e.target.value)} placeholder="customer@email.com" className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-amber-400","bg-white border-slate-300 text-slate-800 focus:border-amber-500")} ${form.customerEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)?tc(dark,"border-red-500","border-red-400"):""}`}/>
            {form.customerEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)&&<p className="text-red-400 text-xs mt-1">Invalid email format</p>}
          </div>

          {/* Pincode first → auto-fetch city/state */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Pincode</label>
              <input value={form.customerPincode} onChange={e=>onPincodeChange(e.target.value)} placeholder="400001" maxLength={6} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none mb-4 ${tc(dark,"bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-amber-400","bg-white border-slate-300 text-slate-800 focus:border-amber-500")}`}/>
            </div>
            <CityField label="City" value={form.customerCity} onChange={v=>SF("customerCity",v)} customCities={customCities} onAddCity={addCustomCity}/>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>State</label>
              <select value={form.customerState||""} onChange={e=>SF("customerState",e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none mb-4 ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                <option value="">Select State / UT</option>
                {INDIA_STATES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <Field label="Address" type="textarea" rows={2} value={form.customerAddress} onChange={v=>SF("customerAddress",v)}/>

          {/* Project size with unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${tc(dark,"text-slate-300","text-slate-700")}`}>Project Size <span className="text-amber-400">*</span></label>
              <div className="flex mb-4">
                <input type="number" value={form.projectSize} onChange={e=>SF("projectSize",e.target.value)} placeholder="e.g. 10" className={`flex-1 border rounded-l-lg px-3 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
                <select value={form.projectUnit} onChange={e=>SF("projectUnit",e.target.value)} className={`border border-l-0 rounded-r-lg px-2 py-2.5 text-sm focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                  {[...(developer?.customUnits||[]),...PROJECT_UNITS].filter((v,i,a)=>a.indexOf(v)===i).map(u=><option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <Field label="Enquiry Type" type="select" value={form.enquiryType} onChange={v=>SF("enquiryType",v)} options={["Hot","Warm","Cold"]}/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Project Lane / Status" type="select" value={form.laneId} onChange={v=>SF("laneId",v)} options={lanes.map(l=>({value:l.id,label:l.name}))}/>
            <Field label="Assign To" type="select" value={form.assignedUserId||currentUser.id} onChange={v=>SF("assignedUserId",v)} options={[{value:currentUser.id,label:"Myself"},...devTeam.filter(u=>u.id!==currentUser.id).map(u=>({value:u.id,label:u.name}))]}/>
          </div>

          <div className="flex gap-3 mt-2">
            <Btn onClick={()=>saveProject(!!editProject)} className="flex-1" disabled={!form.customerName||!form.projectSize}>{editProject?"Update Project":"Add Project"}</Btn>
            <Btn variant="secondary" onClick={()=>{setShowAdd(false);setEditProject(null);setForm(blankForm);}}>Cancel</Btn>
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
            <Btn onClick={()=>printInvoiceTemplid(viewInv,developer)}><Icon name="print" size={15}/>Print / Save PDF</Btn>
            <Btn variant="outline" onClick={()=>downloadInvoice(viewInv,developer,{})}><Icon name="download" size={15}/>Download PDF</Btn>
            {viewInv.customerPhone&&<Btn variant="outline" onClick={()=>{
              const p=myProjects.find(x=>x.id===viewInv.projectId);
              const previewUrl=getInvoicePreviewUrl(viewInv,developer,{});
              const msg=`Hi ${viewInv.customerName},\n\nHere is your ${viewInv.docType||"Invoice"} (${viewInv.id}) for your ${p?.projectSize||""}${p?.projectUnit||"kW"} ${p?.customerType||""} solar project worth ${fmtINR(calcInvoiceTotal(viewInv.items||[]).total)}.\n\nView invoice: ${previewUrl}\n\nRegards,\n${developer?.companyName||""}`;
              shareWhatsApp(viewInv.customerPhone,msg);
            }}>WA WhatsApp</Btn>}
            {viewInv.customerEmail&&<Btn variant="outline" onClick={()=>{
              const p=myProjects.find(x=>x.id===viewInv.projectId);
              const previewUrl=getInvoicePreviewUrl(viewInv,developer,{});
              const body=`Hi ${viewInv.customerName},\n\nHere is your ${viewInv.docType||"Invoice"} (${viewInv.id}) for your solar project worth ${fmtINR(calcInvoiceTotal(viewInv.items||[]).total)}.\n\nView invoice: ${previewUrl}\n\nRegards,\n${developer?.companyName||""}`;
              shareMail(viewInv.customerEmail,`${viewInv.docType||"Invoice"} - ${viewInv.id}`,body);
            }}><Icon name="mail" size={15}/>Email</Btn>}
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
  const docTypeTitle = inv.docType || "Tax Invoice";
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${docTypeTitle} — ${inv.id.toUpperCase()}</title><style>
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
@page{size:A4 portrait;margin:15mm}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;width:210mm}}
  </style></head><body>
  <div class="py-4">
    <div style="text-align:center;font-size:20px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:#1e293b;border-bottom:3px solid #f59e0b;padding:12px 56px;margin-bottom:0">${docTypeTitle}</div>
    <div class="px-14 py-6">
      <table class="w-full border-collapse border-spacing-0"><tbody><tr>
        <td class="w-full align-top">${logoHTML}</td>
        <td class="align-top">
          <div class="text-sm"><table class="border-collapse border-spacing-0"><tbody><tr>
            <td class="border-r pr-4"><p class="whitespace-nowrap text-slate-400 text-right">Date</p><p class="whitespace-nowrap font-bold text-main text-right">${fmtDate(inv.date)}</p></td>
            <td class="pl-4"><p class="whitespace-nowrap text-slate-400 text-right">Document #</p><p class="whitespace-nowrap font-bold text-main text-right">${inv.id.toUpperCase()}</p></td>
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

const ProjectDetailPage = ({ project, notes, setNotes, documents, setDocuments, proposals, setProposals, templates, developer, currentUser, onBack, setCurrentPage, setProjects, users }) => {
  const { dark } = useTheme();
  const [tab, setTab] = useState("info");
  const [newNote, setNewNote] = useState("");
  const [noteFileRef] = [useRef()];
  const [noteAttachments, setNoteAttachments] = useState([]);
  const [noteFilterUser, setNoteFilterUser] = useState("all");
  const [noteDate, setNoteDate] = useState("all");
  const [noteDateFrom, setNoteDateFrom] = useState("");
  const [noteDateTo, setNoteDateTo] = useState("");
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
    if (noteDate!=="all"||noteDateFrom||noteDateTo) {
      const d = new Date(n.createdAt);
      const now2 = new Date();
      if (noteDate==="7d"  && d < new Date(now2-7*86400000)) return false;
      if (noteDate==="15d" && d < new Date(now2-15*86400000)) return false;
      if (noteDate==="30d" && d < new Date(now2-30*86400000)) return false;
      if (noteDate==="week"){const sw=new Date(now2);sw.setDate(now2.getDate()-now2.getDay());sw.setHours(0,0,0,0);if(d<sw)return false;}
      if (noteDate==="month" && d < new Date(now2.getFullYear(),now2.getMonth(),1)) return false;
      if (noteDate==="lastmonth"){const slm=new Date(now2.getFullYear(),now2.getMonth()-1,1);const elm=new Date(now2.getFullYear(),now2.getMonth(),0,23,59,59);if(d<slm||d>elm)return false;}
      if (noteDate==="custom"){if(noteDateFrom&&d<new Date(noteDateFrom))return false;if(noteDateTo&&d>new Date(noteDateTo+" 23:59:59"))return false;}
    }
    return true;
  });
  const filteredDocs = projDocs.filter(d=>{
    const matchSearch = !docSearch || d.title?.toLowerCase().includes(docSearch.toLowerCase()) || d.name?.toLowerCase().includes(docSearch.toLowerCase());
    const matchType = docFilterType==="all" || d.type===docFilterType;
    const matchUser = docFilterUser==="all" || d.uploadedBy===docFilterUser;
    return matchSearch && matchType && matchUser;
  });
  const docAuthors = [...new Set(projDocs.map(d=>d.uploadedBy))];

  const addNote = () => {
    if (!newNote.trim() && !noteAttachments.length) return;
    setNotes(ns=>[...ns,{id:`n${Date.now()}`,projectId:project.id,userId:currentUser.id,userName:currentUser.name,content:newNote,attachments:[...noteAttachments],createdAt:new Date().toISOString()}]);
    if (setProjects) setProjects(ps=>ps.map(p=>p.id===project.id?{...p,activityLog:[...(p.activityLog||[]),{id:`act${Date.now()}`,type:"note",message:`Note added: "${newNote.slice(0,40)}${newNote.length>40?"…":""}"`,by:currentUser.name,at:new Date().toISOString()}]}:p));
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
    const types={pdf:"PDF",doc:"Word",docx:"Word",xls:"Excel",xlsx:"Excel",jpg:"Image",jpeg:"Image",png:"Image",mp4:"Video",mov:"Video"};
    const ext=pendingDocFile.name.split(".").pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = ev => {
      setDocuments(ds=>[...ds,{id:`doc${Date.now()}`,projectId:project.id,title:docTitle||pendingDocFile.name,name:pendingDocFile.name,type:types[ext]||"Other",size:`${(pendingDocFile.size/1024).toFixed(0)} KB`,uploadDate:TODAY,uploadedBy:currentUser.name,uploadedById:currentUser.id,dataUrl:ev.target.result}]);
      if (setProjects) setProjects(ps=>ps.map(p=>p.id===project.id?{...p,activityLog:[...(p.activityLog||[]),{id:`act${Date.now()}`,type:"document",message:`Document uploaded: "${docTitle||pendingDocFile.name}"`,by:currentUser.name,at:new Date().toISOString()}]}:p));
      setShowDocUpload(false); setDocTitle(""); setPendingDocFile(null);
    };
    reader.readAsDataURL(pendingDocFile);
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
  const devTeam = users ? users.filter(u=>u.developerId===project.developerId && u.active) : [];
  const devLanes = developer?.lanes?.filter(l=>!l.disabled).sort((a,b)=>a.order-b.order) || [];
  const currentLane = devLanes.find(l=>l.id===project.laneId);
  const assignedUser = devTeam.find(u=>u.id===(project.assignedUserId||project.userId));

  const quickUpdate = (changes) => {
    if (!setProjects) return;
    setProjects(ps=>ps.map(p=>p.id===project.id?{...p,...changes}:p));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className={`p-1.5 rounded-lg transition-colors ${tc(dark,"text-slate-400 hover:text-white hover:bg-slate-700","text-slate-400 hover:text-slate-600 hover:bg-slate-100")}`}><Icon name="back" size={18}/></button>
        <div className="flex-1">
          <h1 className={`text-xl font-bold ${tc(dark,"text-white","text-slate-800")}`}>{project.customerName}</h1>
          <p className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{project.projectId} · {[project.customerCity,project.customerState].filter(Boolean).join(", ")||project.customerAddress}</p>
        </div>
        {/* Quick lane + assign dropdowns */}
        <div className="flex gap-2 items-center flex-wrap">
          {devLanes.length>0&&(
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:laneHex(currentLane?.color||"slate")}}/>
              <select value={project.laneId||""} onChange={e=>quickUpdate({laneId:e.target.value})}
                className={`border rounded-lg px-2 py-1.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                {devLanes.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          )}
          {devTeam.length>0&&(
            <select value={project.assignedUserId||project.userId||""} onChange={e=>quickUpdate({assignedUserId:e.target.value})}
              className={`border rounded-lg px-2 py-1.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
              <option value="">Unassigned</option>
              {devTeam.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${tc(dark,"bg-slate-700 text-slate-300","bg-slate-100 text-slate-600")}`}>{project.customerType||"—"}</span>
        </div>
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
          {projNotes.length>0&&(
            <div className={`border rounded-xl p-3 mb-3 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <span className={`text-xs font-medium ${tc(dark,"text-slate-400","text-slate-500")}`}>Author:</span>
                <select value={noteFilterUser} onChange={e=>setNoteFilterUser(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                  <option value="all">All Authors</option>
                  {noteAuthors.map(u=><option key={u} value={u}>{u}</option>)}
                </select>
                <span className={`text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>{filteredNotes.length}/{projNotes.length} notes</span>
                {(noteFilterUser!=="all"||noteDate!=="all")&&<button onClick={()=>{setNoteFilterUser("all");setNoteDate("all");setNoteDateFrom("");setNoteDateTo("");}} className="text-xs text-amber-400 underline ml-auto">Clear</button>}
              </div>
              <div>
                <span className={`text-xs font-medium mr-2 ${tc(dark,"text-slate-400","text-slate-500")}`}>Date:</span>
                <span className="flex flex-wrap gap-1.5 mt-1.5">
                  {[["all","All"],["7d","7d"],["15d","15d"],["30d","30d"],["week","This Wk"],["month","This Mo"],["lastmonth","Last Mo"],["custom","Custom…"]].map(([v,label])=>(
                    <button key={v} onClick={()=>setNoteDate(v)}
                      className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${noteDate===v?tc(dark,"bg-amber-500/20 border-amber-400/60 text-amber-300","bg-amber-100 border-amber-400 text-amber-700"):tc(dark,"border-slate-700 text-slate-400 hover:border-slate-500","border-slate-200 text-slate-500")}`}>{label}</button>
                  ))}
                  {noteDate==="custom"&&(
                    <span className="flex items-center gap-1">
                      <input type="date" value={noteDateFrom} onChange={e=>setNoteDateFrom(e.target.value)} className={`border rounded px-2 py-0.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
                      <span className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>to</span>
                      <input type="date" value={noteDateTo} onChange={e=>setNoteDateTo(e.target.value)} className={`border rounded px-2 py-0.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}/>
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {!filteredNotes.length ? <p className={`text-sm text-center py-8 ${tc(dark,"text-slate-400","text-slate-500")}`}>No notes yet.</p> : filteredNotes.map(n=>(
              <div key={n.id} className={`border rounded-xl p-4 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
                <p className={`text-sm mb-2 ${tc(dark,"text-white","text-slate-800")}`}>{n.content}</p>
                {n.attachments?.length>0&&(
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {n.attachments.map((a,i)=>(
                      <div key={i} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg border ${tc(dark,"bg-slate-700 border-slate-600 text-slate-300","bg-slate-100 border-slate-200 text-slate-600")}`}>
                        <Icon name="file" size={11}/>
                        <span>{a.name}</span>
                        {a.data&&<button onClick={()=>{ const w=window.open("","_blank"); if(w){w.document.write(`<html><body style="margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${a.data}" style="max-width:100%;max-height:100vh;object-fit:contain"/></body></html>`);w.document.close();}}} title="Preview" className="text-sky-400 hover:text-sky-300 ml-1"><Icon name="eye" size={11}/></button>}
                        {a.data&&<button onClick={()=>{ const el=document.createElement("a");el.href=a.data;el.download=a.name;el.click(); }} title="Download" className={`ml-0.5 ${tc(dark,"text-slate-400 hover:text-white","text-slate-500 hover:text-slate-700")}`}><Icon name="download" size={11}/></button>}
                        {a.data&&<button onClick={()=>shareWhatsApp(project.customerPhone, `Hi ${project.customerName}, here is an attachment: ${a.name}. Regards, ${developer?.companyName||""}`)} title="Share WA" className="text-emerald-400 text-xs font-bold ml-0.5">WA</button>}
                      </div>
                    ))}
                  </div>
                )}
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
              <option value="all">All Users</option>
              {docAuthors.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
            <input ref={docFileRef} type="file" onChange={handleDocFileSelect} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.mov"/>
            <Btn onClick={()=>docFileRef.current?.click()}><Icon name="upload" size={15}/>Upload Doc</Btn>
          </div>
          {!filteredDocs.length ? (
            <div className={`text-center py-14 border-2 border-dashed rounded-xl ${tc(dark,"border-slate-700","border-slate-200")}`}>
              <Icon name="upload" size={28}/><p className={`mt-2 text-sm ${tc(dark,"text-slate-400","text-slate-500")}`}>No documents yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocs.map(doc=>(
                <div key={doc.id} className={`border rounded-xl p-3 flex items-center gap-3 ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${doc.type==="PDF"?tc(dark,"bg-red-500/20 text-red-400","bg-red-100 text-red-600"):doc.type==="Image"?tc(dark,"bg-sky-500/20 text-sky-400","bg-sky-100 text-sky-600"):tc(dark,"bg-slate-700/50 text-slate-400","bg-slate-100 text-slate-500")}`}>{doc.type?.slice(0,3)||"DOC"}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${tc(dark,"text-white","text-slate-800")}`}>{doc.title||doc.name}</div>
                    <div className={`text-xs ${tc(dark,"text-slate-400","text-slate-500")}`}>{doc.type} · {doc.size} · {fmtDate(doc.uploadDate)} · {doc.uploadedBy}</div>
                  </div>
                  <div className="flex gap-1">
                    {doc.dataUrl&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>{ const w=window.open("","_blank"); if(w){w.document.write(`<html><body style="margin:0;background:#000"><img src="${doc.dataUrl}" style="max-width:100%;display:block;margin:auto"/></body></html>`);w.document.close();} }} title="Preview"><Icon name="eye" size={12}/></Btn>}
                    {doc.dataUrl&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>{ const a=document.createElement("a");a.href=doc.dataUrl;a.download=doc.name||doc.title;a.click(); }} title="Download"><Icon name="download" size={12}/></Btn>}
                    {doc.dataUrl&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>shareWhatsApp(project.customerPhone, `Hi ${project.customerName}, here is your document: ${doc.title||doc.name}. Regards, ${developer?.companyName||""}`)} title="Share WA"><span className="text-emerald-400 text-xs font-bold">WA</span></Btn>}
                    <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>setDocuments(ds=>ds.filter(d=>d.id!==doc.id))}><Icon name="trash" size={13}/></Btn>
                  </div>
                </div>
              ))}
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
            const getPropoPreview = () => {
              const html = buildProposalHTML(pr, project, developer);
              const blob = new Blob([html],{type:"text/html"});
              return URL.createObjectURL(blob);
            };
            const buildPropoMsg = () => {
              const url = getPropoPreview();
              return `Hi ${project.customerName},\n\nHere is your Solar Proposal for your ${project.projectSize} ${project.projectUnit||"kW"} ${project.customerType||""} solar project.\n\nTotal System Cost: ${fmtINR(pr.data?.totalCost||0)}\nAnnual Savings: ${fmtINR(pr.data?.annualSavings||0)}\nPayback Period: ${pr.data?.paybackPeriod||"—"} years\n\nView Proposal: ${url}\n\nRegards,\n${developer?.companyName||""}`;
            };
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
                  <Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>printProposal(pr,project,developer)}><Icon name="print" size={13}/>Print PDF</Btn>
                  {project.customerPhone&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>shareWhatsApp(project.customerPhone,buildPropoMsg())}><span className="text-emerald-400 font-bold text-xs">WA</span></Btn>}
                  {project.customerEmail&&<Btn size="sm" variant={dark?"ghost":"ghostL"} onClick={()=>shareMail(project.customerEmail,"Solar Proposal | "+developer?.companyName,buildPropoMsg())}><Icon name="mail" size={13}/></Btn>}
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

      {/* ACTIVITY TAB */}
      {tab==="activity"&&(()=>{
        const [actQ, setActQ] = React.useState("");
        const [actType, setActType] = React.useState("all");
        const allLogs = [...(project.activityLog||[])].reverse();
        const actTypes = [...new Set(allLogs.map(e=>e.type).filter(Boolean))];
        const actFiltered = allLogs.filter(e=>{
          if (actType!=="all" && e.type!==actType) return false;
          if (actQ) {
            const q=actQ.toLowerCase();
            return (e.message||"").toLowerCase().includes(q)||(e.by||"").toLowerCase().includes(q);
          }
          return true;
        });
        const actIconColor = (t) => t==="created"?"bg-emerald-500/20 text-emerald-400":t==="note"?"bg-blue-500/20 text-blue-400":t==="document"?"bg-violet-500/20 text-violet-400":t==="invoice"?"bg-amber-500/20 text-amber-400":"bg-slate-600/30 text-slate-400";
        const actIconName = (t) => t==="created"?"plus":t==="note"?"note":t==="document"?"file":t==="invoice"?"invoice":"edit";
        return (
          <div className={`border rounded-xl ${tc(dark,"bg-[#0c1929] border-slate-700/50","bg-white border-slate-200 shadow-sm")}`}>
            <div className={`flex flex-wrap items-center gap-2 p-4 border-b ${tc(dark,"border-slate-700/50","border-slate-200")}`}>
              <h3 className={`font-bold text-sm flex-1 ${tc(dark,"text-white","text-slate-800")}`}>Activity Log <span className={`text-xs font-normal ${tc(dark,"text-slate-400","text-slate-500")}`}>({actFiltered.length})</span></h3>
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 ${tc(dark,"bg-slate-800 border-slate-600","bg-slate-50 border-slate-300")}`} style={{minWidth:180}}>
                <Icon name="search" size={13}/>
                <input value={actQ} onChange={e=>setActQ(e.target.value)} placeholder="Search activity…" className={`flex-1 bg-transparent text-xs focus:outline-none ${tc(dark,"text-white placeholder-slate-500","text-slate-800 placeholder-slate-400")}`}/>
                {actQ&&<button onClick={()=>setActQ("")} className={`text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>×</button>}
              </div>
              <select value={actType} onChange={e=>setActType(e.target.value)} className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${tc(dark,"bg-slate-800 border-slate-600 text-white","bg-white border-slate-300 text-slate-800")}`}>
                <option value="all">All Types</option>
                {actTypes.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div className="p-4">
              {!actFiltered.length ? (
                <p className={`text-sm text-center py-8 ${tc(dark,"text-slate-400","text-slate-500")}`}>{allLogs.length ? "No activity matches your filters." : "No activity recorded yet."}</p>
              ) : (
                <div className="relative">
                  <div className={`absolute left-3.5 top-0 bottom-0 w-px ${tc(dark,"bg-slate-700","bg-slate-200")}`}/>
                  <div className="space-y-3">
                    {actFiltered.map((entry,idx)=>{
                      const d = entry.at ? new Date(entry.at) : null;
                      return (
                        <div key={entry.id||idx} className="flex gap-3 relative">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${tc(dark,"border-[#0c1929]","border-white")} ${actIconColor(entry.type)}`}>
                            <Icon name={actIconName(entry.type)} size={12}/>
                          </div>
                          <div className={`flex-1 border rounded-xl p-3 ${tc(dark,"bg-slate-800/40 border-slate-700/40","bg-slate-50 border-slate-200")}`}>
                            <p className={`text-sm ${tc(dark,"text-white","text-slate-800")}`}>{entry.message}</p>
                            <div className={`flex flex-wrap gap-x-3 mt-1.5 text-xs ${tc(dark,"text-slate-500","text-slate-400")}`}>
                              <span className="font-medium">{entry.by||"—"}</span>
                              {d&&<span>{d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>}
                              {d&&<span>{d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
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
  <style>body{font-family:Arial,sans-serif;color:#111;background:#fff;padding:32px;max-width:900px;margin:0 auto}h1,h2,h3{margin:0 0 8px}table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:left;font-size:13px}th{background:#fef3c7;font-weight:700}tr:hover{background:#fafafa}img{max-height:60px;display:block;margin-bottom:8px}pre{white-space:pre-wrap;font-family:inherit;font-size:12px}.amber{color:#d97706}.section{margin-bottom:24px;padding:16px;border:1px solid #e2e8f0;border-radius:12px}@media print{body{padding:0}@page{size:A4 portrait;margin:15mm}}</style>
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
  const getPropoPreviewUrl = () => {
    const html = buildProposalHTML(proposal, project, developer);
    const blob = new Blob([html],{type:"text/html"});
    return URL.createObjectURL(blob);
  };
  const buildPropoMsg = () => {
    const url = getPropoPreviewUrl();
    return `Hi ${project?.customerName||d?.customer_name},\n\nHere is your Solar Proposal for your ${project?.projectSize} ${project?.projectUnit||"kW"} ${project?.customerType||""} solar project.\n\nTotal Cost: ${fmtINR(d?.totalCost||0)}\nAnnual Savings: ${fmtINR(d?.annualSavings||0)}\nPayback: ${d?.paybackPeriod||"—"} years\n\nView Proposal: ${url}\n\nRegards,\n${developer?.companyName||""}`;
  };

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
        <Btn onClick={()=>printProposal(proposal,project,developer)}><Icon name="print" size={15}/>Print / Save PDF</Btn>
        {d.customer_phone&&<Btn variant="outline" onClick={()=>shareWhatsApp(d.customer_phone,buildPropoMsg())}><span className="text-emerald-400 font-bold">WA</span> WhatsApp</Btn>}
        {d.customer_email&&<Btn variant="outline" onClick={()=>shareMail(d.customer_email,`Solar Proposal | ${developer?.companyName||""}`,buildPropoMsg())}><Icon name="mail" size={15}/>Email</Btn>}
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

  // ── DATE FORMAT ──
  const [dateFormat, setDateFormat] = useLS("sp_dateFormat", "DD/MM/YYYY");
  _dateFormatKey = dateFormat;

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
          setProjects={setProjects} users={users}
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
        return <UsersPage users={users} setUsers={setUsers} currentUser={currentUser} developers={developers} projects={projects} setProjects={setProjects}/>;

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
    <ToastProvider>
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
    </ToastProvider>
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
