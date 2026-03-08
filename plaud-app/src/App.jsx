import { useState, useEffect, useRef, useCallback } from "react";

// ─── PROMPTS ───────────────────────────────────────────────────────────────
const TRAINING_PROMPT = `You are an expert training notes organizer. Respond ONLY with a valid JSON object — no markdown, no backticks, no explanation.
JSON format:
{
  "header": { "title": "string", "date": "string", "instructor": "string", "platform": "string" },
  "concepts": [{ "topic": "string", "notes": "string" }],
  "questions": ["string"],
  "apply": ["string"]
}
If a field cannot be determined, use "—" or an empty array.`;

const MEETING_PROMPT = `You are an expert meeting notes organizer. Respond ONLY with a valid JSON object — no markdown, no backticks, no explanation.
JSON format:
{
  "header": { "title": "string", "date": "string", "time": "string", "location": "string", "facilitator": "string", "attendees": "string" },
  "agenda": [{ "topic": "string", "owner": "string", "duration": "string" }],
  "highlights": ["string"],
  "decisions": ["string"],
  "actions": [{ "task": "string", "owner": "string", "due": "string", "status": "Open" }],
  "parking": ["string"],
  "next": { "date": "string", "time": "string", "focus": "string", "prep": "string" }
}
If a field cannot be determined, use "—" or an empty array.`;

const CATEGORIZE_PROMPT = `You are a meeting categorizer. Given meeting notes JSON, extract:
1. "company": the company or organization name. If none found, return "General"
2. "lifeCategory": one of: Health, Finance, Home, Family, Social, Legal, Travel, Other
3. "detectedType": "work" or "life"
Respond ONLY with valid JSON: {"company":"string","lifeCategory":"string","detectedType":"string"}`;

// ─── CONSTANTS ─────────────────────────────────────────────────────────────
const LIFE_COLORS = { Health:"#0d9488",Finance:"#16a34a",Home:"#ea580c",Family:"#7c3aed",Social:"#db2777",Legal:"#1d4ed8",Travel:"#0284c7",Other:"#6b7280" };
const LIFE_ICONS  = { Health:"🏥",Finance:"💰",Home:"🏠",Family:"👨‍👩‍👧",Social:"🎉",Legal:"⚖️",Travel:"✈️",Other:"📌" };
const STATUS_STYLES = { "Open":{background:"#dbeafe",color:"#1d4ed8"},"In Progress":{background:"#fef9c3",color:"#a16207"},"Closed":{background:"#dcfce7",color:"#15803d"} };
const GRADIENTS = [
  { label:"Ocean",     value:"linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)" },
  { label:"Sunset",    value:"linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)" },
  { label:"Forest",    value:"linear-gradient(135deg,#14532d,#166534,#15803d)" },
  { label:"Slate",     value:"linear-gradient(135deg,#1e293b,#334155,#475569)" },
  { label:"Rose Gold", value:"linear-gradient(135deg,#881337,#be185d,#f43f5e)" },
  { label:"Arctic",    value:"linear-gradient(135deg,#0c4a6e,#0369a1,#0ea5e9)" },
  { label:"Midnight",  value:"linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)" },
  { label:"Autumn",    value:"linear-gradient(135deg,#78350f,#b45309,#d97706)" },
];

const GOOGLE_DRIVE_FILE = "plaud_notes_db.json";
const GOOGLE_SCOPES = "https://www.googleapis.com/auth/drive.appdata";
const safe = (v) => Array.isArray(v) ? v : [];

// ─── HELPERS ───────────────────────────────────────────────────────────────
function buildTxt(d) {
  if (!d) return "";
  if (d._mode === "training") {
    return ["═══════════════════════════════════════","           TRAINING NOTES","═══════════════════════════════════════","",
      "TRAINING HEADER",`  Title:      ${d.header?.title||"—"}`,`  Date:       ${d.header?.date||"—"}`,
      `  Instructor: ${d.header?.instructor||"—"}`,`  Platform:   ${d.header?.platform||"—"}`,"",
      "KEY CONCEPTS & TOPICS",...safe(d.concepts).map(c=>`  📌 ${c.topic}\n     ${c.notes}`),"",
      "QUESTIONS TO FOLLOW UP ON",...safe(d.questions).map(q=>`  • ${q}`),"",
      "HOW TO APPLY / NEXT STEPS",...safe(d.apply).map(a=>`  • ${a}`),
    ].join("\n");
  }
  return ["═══════════════════════════════════════","           MEETING NOTES","═══════════════════════════════════════","",
    "MEETING HEADER",`  Title:       ${d.header?.title||"—"}`,`  Date:        ${d.header?.date||"—"}`,`  Time:        ${d.header?.time||"—"}`,
    `  Location:    ${d.header?.location||"—"}`,`  Facilitator: ${d.header?.facilitator||"—"}`,`  Attendees:   ${d.header?.attendees||"—"}`,"",
    "PRE-MEETING AGENDA",...safe(d.agenda).map((a,i)=>`  ${i+1}. ${a.topic} | Owner: ${a.owner} | Duration: ${a.duration}`),"",
    "HIGHLIGHTED MOMENTS",...safe(d.highlights).map(h=>`  • ${h}`),"",
    "KEY DECISIONS",...safe(d.decisions).map(x=>`  • ${x}`),"",
    "ACTION ITEMS",...safe(d.actions).map(a=>`  • ${a.task} | Owner: ${a.owner} | Due: ${a.due} | Status: ${a.status}`),"",
    "PARKING LOT",...safe(d.parking).map(p=>`  • ${p}`),"",
    "NEXT MEETING",`  Date:  ${d.next?.date||"—"}`,`  Time:  ${d.next?.time||"—"}`,`  Focus: ${d.next?.focus||"—"}`,`  Prep:  ${d.next?.prep||"—"}`,
  ].join("\n");
}
const toDataUri = (c) => `data:text/plain;charset=utf-8,`+encodeURIComponent(c||"");

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [raw, setRaw] = useState("");
  const [mode, setMode] = useState("meeting");
  const [organized, setOrganized] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [copied, setCopied] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const [filingStatus, setFilingStatus] = useState(null);
  const [filingLoading, setFilingLoading] = useState(null);
  const [workStep, setWorkStep] = useState(null);
  const [, setWorkSubType] = useState(null);
  const [db, setDb] = useState({ work:{}, life:{} });
  const [dbLoaded, setDbLoaded] = useState(false);
  const [dbView, setDbView] = useState("work");
  const [workSection, setWorkSection] = useState("Meetings");
  const [dbSearch, setDbSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedMeeting, setExpandedMeeting] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [renamingGroup, setRenamingGroup] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingGroup, setDeletingGroup] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [movingMeeting, setMovingMeeting] = useState(null);
  const [trainingSections, setTrainingSections] = useState([]);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clientIdInput, setClientIdInput] = useState("");
  const [gUser, setGUser] = useState(null);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [syncMsg, setSyncMsg] = useState("");
  const [bgType, setBgType] = useState("gradient");
  const [bgValue, setBgValue] = useState(GRADIENTS[0].value);
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [bgImage, setBgImage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [driveFileId, setDriveFileId] = useState(null);
  const tokenRef = useRef(null);
  const gsiRef = useRef(null);
  const fileInputRef = useRef(null);

  // ── Load local storage on mount ──
  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get("plaud_db"); if(r) { const d=JSON.parse(r.value); setDb(d); } } catch(e){}
      try { const r = await window.storage.get("plaud_training_sections"); if(r) setTrainingSections(JSON.parse(r.value)); } catch(e){}
      try { const r = await window.storage.get("plaud_current"); if(r){ setOrganized(JSON.parse(r.value)); setActiveTab("output"); } } catch(e){}
      try { const r = await window.storage.get("plaud_settings"); if(r){ const s=JSON.parse(r.value); if(s.clientId) setClientId(s.clientId); if(s.bgType) setBgType(s.bgType); if(s.bgValue) setBgValue(s.bgValue); if(s.bgColor) setBgColor(s.bgColor); if(s.bgImage) setBgImage(s.bgImage); if(s.darkMode!==undefined) setDarkMode(s.darkMode); if(s.driveFileId) setDriveFileId(s.driveFileId); }} catch(e){}
      setDbLoaded(true);
    })();
  }, []);

  const saveSettings = async (patch) => {
    try {
      const r = await window.storage.get("plaud_settings").catch(()=>null);
      const cur = r ? JSON.parse(r.value) : {};
      const next = {...cur,...patch};
      await window.storage.set("plaud_settings", JSON.stringify(next));
    } catch(e){}
  };

  // ── Google Sign-In ──
  useEffect(() => {
    if (!clientId) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => { gsiRef.current = window.google; };
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch(e){} };
  }, [clientId]);

  const signInGoogle = () => {
    if (!gsiRef.current) return setSyncMsg("Google Sign-In not loaded yet. Please wait a moment.");
    gsiRef.current.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_SCOPES,
      callback: async (resp) => {
        if (resp.error) { setSyncMsg(`Sign-in error: ${resp.error}`); return; }
        tokenRef.current = resp.access_token;
        try {
          const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers:{ Authorization:`Bearer ${resp.access_token}` } });
          const u = await r.json();
          setGUser(u);
          setSyncMsg("");
          await syncFromDrive(resp.access_token);
        } catch(e) { setSyncMsg("Signed in but could not fetch user info."); }
      }
    }).requestAccessToken();
  };

  const signOutGoogle = () => {
    if (tokenRef.current && gsiRef.current) {
      gsiRef.current.accounts.oauth2.revoke(tokenRef.current);
    }
    tokenRef.current = null;
    setGUser(null);
    setSyncStatus("idle");
    setSyncMsg("Signed out.");
  };

  // ── Drive helpers ──
  const findOrCreateFile = async (token) => {
    const search = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${GOOGLE_DRIVE_FILE}'&fields=files(id,name)`,
      { headers:{ Authorization:`Bearer ${token}` } }
    );
    const data = await search.json();
    if (data.files?.length > 0) {
      setDriveFileId(data.files[0].id);
      await saveSettings({ driveFileId: data.files[0].id });
      return data.files[0].id;
    }
    const meta = { name: GOOGLE_DRIVE_FILE, parents:["appDataFolder"] };
    const empty = { db:{ work:{}, life:{} }, trainingSections:[] };
    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(meta)],{type:"application/json"}));
    form.append("file", new Blob([JSON.stringify(empty)],{type:"application/json"}));
    const create = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",{
      method:"POST", headers:{ Authorization:`Bearer ${token}` }, body: form
    });
    const created = await create.json();
    setDriveFileId(created.id);
    await saveSettings({ driveFileId: created.id });
    return created.id;
  };

  const syncFromDrive = async (token) => {
    setSyncStatus("syncing"); setSyncMsg("Syncing from Google Drive...");
    try {
      const fid = driveFileId || await findOrCreateFile(token);
      const r = await fetch(`https://www.googleapis.com/drive/v3/files/${fid}?alt=media`,{
        headers:{ Authorization:`Bearer ${token}` }
      });
      const data = await r.json();
      if (data.db) {
        setDb(data.db);
        await window.storage.set("plaud_db", JSON.stringify(data.db));
      }
      if (data.trainingSections) {
        setTrainingSections(data.trainingSections);
        await window.storage.set("plaud_training_sections", JSON.stringify(data.trainingSections));
      }
      setSyncStatus("synced"); setSyncMsg(`Last synced: ${new Date().toLocaleTimeString()}`);
    } catch(e) { setSyncStatus("error"); setSyncMsg(`Sync error: ${e.message}`); }
  };

  const syncToDrive = useCallback(async (newDb, newSections) => {
    if (!tokenRef.current) return;
    setSyncStatus("syncing");
    try {
      const fid = driveFileId || await findOrCreateFile(tokenRef.current);
      const payload = { db: newDb, trainingSections: newSections };
      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fid}?uploadType=media`,{
        method:"PATCH",
        headers:{ Authorization:`Bearer ${tokenRef.current}`, "Content-Type":"application/json" },
        body: JSON.stringify(payload)
      });
      setSyncStatus("synced"); setSyncMsg(`Last synced: ${new Date().toLocaleTimeString()}`);
    } catch(e) { setSyncStatus("error"); setSyncMsg(`Sync error: ${e.message}`); }
  }, [driveFileId]);

  // ── DB helpers ──
  const saveDb = async (newDb) => {
    setDb(newDb);
    try { await window.storage.set("plaud_db", JSON.stringify(newDb)); } catch(e){}
    await syncToDrive(newDb, trainingSections);
  };

  const saveTrainingSections = async (sections) => {
    setTrainingSections(sections);
    try { await window.storage.set("plaud_training_sections", JSON.stringify(sections)); } catch(e){}
    await syncToDrive(db, sections);
  };

  // ── Organize ──
  const organize = async () => {
    if (!raw.trim()) return;
    setLoading(true); setError(""); setOrganized(null); setFilingStatus(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:4000,
          system: mode==="training" ? TRAINING_PROMPT : MEETING_PROMPT,
          messages:[{role:"user",content:raw}] }),
      });
      const data = await res.json();
      if(data.error){setError(`API error: ${data.error.message}`);setLoading(false);return;}
      const text = data.content.map(b=>b.text||"").join("");
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
        parsed._mode = mode;
        setOrganized(parsed);
        window.storage.set("plaud_current", JSON.stringify(parsed)).catch(()=>{});
        setActiveTab("output");
      } catch(pe){setError(`Parse error: ${text.slice(0,200)}`);}
    } catch(e){setError(`Network error: ${e.message}`);}
    setLoading(false);
  };

  // ── Filing ──
  const fileMeetingToFolder = async (type, folder) => {
    if (!organized) return;
    setFilingLoading(folder); setFilingStatus(null);
    try {
      const id = `mtg_${Date.now()}`;
      const entry = { id, data:organized, filedAt:new Date().toISOString(), company:folder };
      const newDb = JSON.parse(JSON.stringify(db));
      if (!newDb[type]) newDb[type]={};
      if (!newDb[type][folder]) newDb[type][folder]=[];
      newDb[type][folder].push(entry);
      newDb[type][folder].sort((a,b)=>new Date(b.data?.header?.date||0)-new Date(a.data?.header?.date||0));
      await saveDb(newDb);
      if (folder==="Trainings"||trainingSections.includes(folder)) {
        if (!trainingSections.includes(folder)) await saveTrainingSections([...trainingSections,folder]);
      }
      setFilingStatus({type,label:`${type==="work"?"Work":"Life"} → ${folder} → ${organized.header?.date||""}`});
    } catch(e){setFilingStatus({error:true,label:"Filing failed."});}
    setFilingLoading(null);
  };

  const fileMeeting = async (type) => {
    if (!organized) return;
    setFilingLoading(type); setFilingStatus(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:200,system:CATEGORIZE_PROMPT,messages:[{role:"user",content:JSON.stringify(organized)}]}),
      });
      const data = await res.json();
      const text = data.content.map(b=>b.text||"").join("");
      const meta = JSON.parse(text.replace(/```json|```/g,"").trim());
      const id = `mtg_${Date.now()}`;
      const entry = {id,data:organized,filedAt:new Date().toISOString(),company:meta.company,lifeCategory:meta.lifeCategory};
      const newDb = JSON.parse(JSON.stringify(db));
      if (type==="work") {
        const co=meta.company||"General";
        if(!newDb.work[co]) newDb.work[co]=[];
        newDb.work[co].push(entry);
        newDb.work[co].sort((a,b)=>new Date(b.data?.header?.date||0)-new Date(a.data?.header?.date||0));
        setFilingStatus({type:"work",label:`Work → ${co} → ${organized.header?.date||""}`});
      } else {
        const cat=meta.lifeCategory||"Other";
        if(!newDb.life[cat]) newDb.life[cat]=[];
        newDb.life[cat].push(entry);
        newDb.life[cat].sort((a,b)=>new Date(b.data?.header?.date||0)-new Date(a.data?.header?.date||0));
        setFilingStatus({type:"life",label:`Life → ${LIFE_ICONS[cat]||""} ${cat} → ${organized.header?.date||""}`});
      }
      await saveDb(newDb);
    } catch(e){setFilingStatus({error:true,label:"Filing failed."});}
    setFilingLoading(null);
  };

  const deleteMeeting = (type,group,id) => {
    setDb(prev=>{
      const n=JSON.parse(JSON.stringify(prev));
      if(n[type]?.[group]){n[type][group]=n[type][group].filter(m=>m.id!==id);if(!n[type][group].length)delete n[type][group];}
      window.storage.set("plaud_db",JSON.stringify(n)).catch(()=>{});
      syncToDrive(n,trainingSections);
      return n;
    });
    setDeleteConfirm(null);setExpandedMeeting(null);
  };

  const saveEdit = async (type,group,id,newData) => {
    const n=JSON.parse(JSON.stringify(db));
    const idx=n[type]?.[group]?.findIndex(m=>m.id===id);
    if(idx>-1) n[type][group][idx].data=newData;
    await saveDb(n);setEditingMeeting(null);
  };

  const renameGroup = async (type,oldName,newName) => {
    if(!newName.trim()||newName.trim()===oldName){setRenamingGroup(null);return;}
    const n=JSON.parse(JSON.stringify(db));
    n[type][newName.trim()]=n[type][oldName];delete n[type][oldName];
    await saveDb(n);
    const isTraining=oldName==="Trainings"||trainingSections.includes(oldName);
    if(isTraining){
      const updated=trainingSections.includes(oldName)?trainingSections.map(s=>s===oldName?newName.trim():s):[...trainingSections,newName.trim()];
      await saveTrainingSections(updated);
    }
    setRenamingGroup(null);
    setExpandedGroups(p=>{const e={...p};e[newName.trim()]=e[oldName];delete e[oldName];return e;});
  };

  const moveMeeting = async (fromType,fromGroup,meetingId,toType,toGroup) => {
    if(fromType===toType&&fromGroup===toGroup) return;
    const n=JSON.parse(JSON.stringify(db));
    const meeting=n[fromType]?.[fromGroup]?.find(m=>m.id===meetingId);
    if(!meeting) return;
    n[fromType][fromGroup]=n[fromType][fromGroup].filter(m=>m.id!==meetingId);
    if(!n[fromType][fromGroup].length) delete n[fromType][fromGroup];
    if(!n[toType]) n[toType]={};
    if(!n[toType][toGroup]) n[toType][toGroup]=[];
    n[toType][toGroup].push(meeting);
    n[toType][toGroup].sort((a,b)=>new Date(b.data?.header?.date||0)-new Date(a.data?.header?.date||0));
    await saveDb(n);
    setExpandedGroups(p=>({...p,[toGroup]:true}));
  };

  const createFolder = async (type,name) => {
    if(!name.trim()) return;
    const n=JSON.parse(JSON.stringify(db));
    if(!n[type][name.trim()]) n[type][name.trim()]=[];
    await saveDb(n);
    setShowNewFolder(false);setNewFolderName("");
    setExpandedGroups(p=>({...p,[name.trim()]:true}));
  };

  const updateActionStatus = (idx,val,due) => {
    setOrganized(prev=>{
      const u=JSON.parse(JSON.stringify(prev));
      if(val!==null&&val!==undefined) u.actions[idx].status=val;
      if(due!==undefined) u.actions[idx].due=due;
      window.storage.set("plaud_current",JSON.stringify(u)).catch(()=>{});
      return u;
    });
  };

  const reset = () => {setRaw("");setOrganized(null);setActiveTab("input");setError("");setFilingStatus(null);setPrintMode(false);window.storage.delete("plaud_current").catch(()=>{});};
  const copyAll = () => {if(!organized) return;navigator.clipboard.writeText(buildTxt(organized)).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});};
  const toggleGroup = (key) => setExpandedGroups(p=>({...p,[key]:!p[key]}));
  const filterMeetings = (meetings) => {
    const arr=safe(meetings);
    if(!dbSearch.trim()) return arr;
    const q=dbSearch.toLowerCase();
    return arr.filter(m=>(m.data?.header?.title||"").toLowerCase().includes(q)||(m.data?.header?.date||"").toLowerCase().includes(q)||(m.company||"").toLowerCase().includes(q)||safe(m.data?.decisions).some(d=>(d||"").toLowerCase().includes(q))||safe(m.data?.actions).some(a=>(a.task||"").toLowerCase().includes(q)));
  };

  const totalMeetings = Object.values(db.work||{}).reduce((s,a)=>s+safe(a).length,0)+Object.values(db.life||{}).reduce((s,a)=>s+safe(a).length,0);
  const allWorkFolders = Object.keys(db.work||{});
  const workMeetingFolders = allWorkFolders.filter(g=>g!=="Trainings"&&!trainingSections.includes(g));
  const workTrainingFolders = [
    ...allWorkFolders.filter(g=>g==="Trainings"||trainingSections.includes(g)),
    ...(!allWorkFolders.includes("Trainings")&&!trainingSections.some(s=>s==="Trainings")?["Trainings"]:[]),
  ];

  // ── Background style ──
  const getBg = () => {
    if (bgType==="image"&&bgImage) return { backgroundImage:`url(${bgImage})`,backgroundSize:"cover",backgroundPosition:"center" };
    if (bgType==="color") return { background: bgColor };
    return { background: bgValue };
  };
  const cardBg = darkMode ? "#1e293b" : "#fff";
  const textPrimary = darkMode ? "#f1f5f9" : "#1a1a2e";
  const textSecondary = darkMode ? "#94a3b8" : "#555";
  const borderColor = darkMode ? "#334155" : "#e2e8f0";
  const inputBg = darkMode ? "#0f172a" : "#fff";

  const syncIcon = syncStatus==="syncing"?"🔄":syncStatus==="synced"?"✅":syncStatus==="error"?"❌":"☁️";

  if (printMode&&organized) {
    const d=organized; const isT=d._mode==="training";
    return(
      <div style={{fontFamily:"Arial,sans-serif",maxWidth:750,margin:"30px auto",color:"#1a1a2e",fontSize:13,lineHeight:1.7}}>
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          <button onClick={()=>window.print()} style={{padding:"8px 18px",background:"#dc2626",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer"}}>🖨️ Print / Save as PDF</button>
          <button onClick={()=>setPrintMode(false)} style={{padding:"8px 18px",background:"#eee",color:"#333",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer"}}>← Back</button>
        </div>
        <h1 style={{fontSize:22,color:"#0f3460",borderBottom:"3px solid #0f3460",paddingBottom:8,textAlign:"center"}}>{isT?"Training Notes":"Meeting Notes"}</h1>
        {isT?(
          <>
            <PS title="Training Header"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px"}}>{[["Title",d.header?.title],["Date",d.header?.date],["Instructor",d.header?.instructor],["Platform",d.header?.platform]].map(([l,v])=><div key={l}><span style={{fontWeight:700,color:"#888",fontSize:11,textTransform:"uppercase"}}>{l}: </span><span>{v||"—"}</span></div>)}</div></PS>
            <PS title="Key Concepts"><>{safe(d.concepts).map((c,i)=><div key={i} style={{marginBottom:10}}><strong>{c.topic}</strong><br/>{c.notes}</div>)}</></PS>
            <PS title="Questions"><ul style={{margin:"4px 0",paddingLeft:18}}>{safe(d.questions).map((q,i)=><li key={i}>{q}</li>)}</ul></PS>
            <PS title="How to Apply"><ul style={{margin:"4px 0",paddingLeft:18}}>{safe(d.apply).map((a,i)=><li key={i}>{a}</li>)}</ul></PS>
          </>
        ):(
          <>
            <PS title="Meeting Header"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px"}}>{[["Title",d.header?.title],["Date",d.header?.date],["Time",d.header?.time],["Location",d.header?.location],["Facilitator",d.header?.facilitator],["Attendees",d.header?.attendees]].map(([l,v])=><div key={l}><span style={{fontWeight:700,color:"#888",fontSize:11,textTransform:"uppercase"}}>{l}: </span><span>{v||"—"}</span></div>)}</div></PS>
            <PS title="Agenda"><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr>{["#","Topic","Owner","Duration"].map(h=><th key={h} style={{background:"#e8eef7",padding:"6px 8px",textAlign:"left",border:"1px solid #ccc"}}>{h}</th>)}</tr></thead><tbody>{safe(d.agenda).map((a,i)=><tr key={i}><td style={{padding:"6px 8px",border:"1px solid #ddd"}}>{i+1}</td><td style={{padding:"6px 8px",border:"1px solid #ddd"}}>{a.topic}</td><td style={{padding:"6px 8px",border:"1px solid #ddd"}}>{a.owner}</td><td style={{padding:"6px 8px",border:"1px solid #ddd"}}>{a.duration}</td></tr>)}</tbody></table></PS>
            <PS title="Highlights"><ul style={{margin:"4px 0",paddingLeft:18}}>{safe(d.highlights).map((h,i)=><li key={i}>{h}</li>)}</ul></PS>
            <PS title="Key Decisions"><ul style={{margin:"4px 0",paddingLeft:18}}>{safe(d.decisions).map((x,i)=><li key={i}>{x}</li>)}</ul></PS>
            <PS title="Action Items"><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr>{["Task","Owner","Due","Status"].map(h=><th key={h} style={{background:"#e8eef7",padding:"6px 8px",textAlign:"left",border:"1px solid #ccc"}}>{h}</th>)}</tr></thead><tbody>{safe(d.actions).map((a,i)=><tr key={i}><td style={{padding:"6px 8px",border:"1px solid #ddd"}}>{a.task}</td><td style={{padding:"6px 8px",border:"1px solid #ddd"}}>{a.owner}</td><td style={{padding:"6px 8px",border:"1px solid #ddd"}}>{a.due}</td><td style={{padding:"6px 8px",border:"1px solid #ddd"}}>{a.status}</td></tr>)}</tbody></table></PS>
            <PS title="Parking Lot"><ul style={{margin:"4px 0",paddingLeft:18}}>{safe(d.parking).map((p,i)=><li key={i}>{p}</li>)}</ul></PS>
            <PS title="Next Meeting"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px"}}>{[["Date",d.next?.date],["Time",d.next?.time],["Focus",d.next?.focus],["Prep",d.next?.prep]].map(([l,v])=><div key={l}><span style={{fontWeight:700,color:"#888",fontSize:11,textTransform:"uppercase"}}>{l}: </span><span>{v||"—"}</span></div>)}</div></PS>
          </>
        )}
      </div>
    );
  }

  if (editingMeeting) return <EditView meeting={editingMeeting} onSave={saveEdit} onCancel={()=>setEditingMeeting(null)} darkMode={darkMode}/>;

  const TABS=[{key:"input",label:"📥 Paste Notes"},{key:"output",label:"📄 Organized Output"},{key:"file",label:"📁 File Meeting"},{key:"database",label:"🗄️ Database"}];

  return(
    <div style={{fontFamily:"'Segoe UI',sans-serif",minHeight:"100vh",padding:24,...getBg()}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>

        {/* HEADER */}
        <div style={{background:"rgba(15,52,96,0.92)",backdropFilter:"blur(8px)",borderRadius:16,padding:"20px 24px",marginBottom:24,color:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:32}}>🎙️</div>
            <div>
              <div style={{fontSize:20,fontWeight:700}}>Plaud Pro Meeting Organizer</div>
              <div style={{fontSize:12,opacity:0.7,marginTop:1}}>AI-powered notes, organized and synced</div>
            </div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
              {gUser&&<div style={{fontSize:12,opacity:0.8,display:"flex",alignItems:"center",gap:6}}>{syncIcon} {syncMsg||gUser.email}</div>}
              {totalMeetings>0&&<div style={{background:"rgba(255,255,255,.15)",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:600}}>{totalMeetings} filed</div>}
              <button onClick={()=>setShowSettings(s=>!s)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:16,color:"#fff"}}>⚙️</button>
            </div>
          </div>
        </div>

        {/* SETTINGS PANEL */}
        {showSettings&&(
          <div style={{background:cardBg,borderRadius:14,padding:24,marginBottom:20,boxShadow:"0 4px 24px rgba(0,0,0,.15)",border:`1px solid ${borderColor}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:16,color:textPrimary}}>⚙️ Settings</div>
              <button onClick={()=>setShowSettings(false)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:textSecondary}}>✕</button>
            </div>

            {/* Google Drive */}
            <div style={{marginBottom:24,paddingBottom:24,borderBottom:`1px solid ${borderColor}`}}>
              <div style={{fontWeight:700,fontSize:13,color:textPrimary,marginBottom:12}}>☁️ Google Drive Sync</div>
              {!clientId?(
                <div>
                  <div style={{fontSize:12,color:textSecondary,marginBottom:8}}>Enter your Google OAuth Client ID to enable sync across all your devices.</div>
                  <div style={{display:"flex",gap:8}}>
                    <input value={clientIdInput} onChange={e=>setClientIdInput(e.target.value)} placeholder="Paste your Google Client ID here..."
                      style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1px solid ${borderColor}`,fontSize:13,outline:"none",background:inputBg,color:textPrimary}}/>
                    <button onClick={()=>{ setClientId(clientIdInput); saveSettings({clientId:clientIdInput}); }}
                      style={{padding:"8px 16px",borderRadius:8,border:"none",background:"#0f3460",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>Save</button>
                  </div>
                  <div style={{fontSize:11,color:textSecondary,marginTop:8}}>
                    ℹ️ Also add <strong>https://claude.ai</strong> to your Google OAuth authorized origins in Google Cloud Console.
                  </div>
                </div>
              ):!gUser?(
                <div>
                  <div style={{fontSize:12,color:textSecondary,marginBottom:10}}>Client ID saved. Sign in to start syncing.</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <button onClick={signInGoogle} style={{padding:"9px 20px",borderRadius:8,border:"none",background:"#4285F4",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>🔵 Sign in with Google</button>
                    <button onClick={()=>{ setClientId(""); setClientIdInput(""); saveSettings({clientId:""}); }} style={{padding:"9px 14px",borderRadius:8,border:`1px solid ${borderColor}`,background:cardBg,cursor:"pointer",fontSize:12,fontWeight:600,color:textSecondary}}>Change Client ID</button>
                  </div>
                  {syncMsg&&<div style={{fontSize:12,color:"#dc2626",marginTop:8}}>{syncMsg}</div>}
                </div>
              ):(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:"#4285F4",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14}}>
                      {gUser.name?.[0]||"G"}
                    </div>
                    <div>
                      <div style={{fontWeight:600,fontSize:13,color:textPrimary}}>{gUser.name}</div>
                      <div style={{fontSize:11,color:textSecondary}}>{gUser.email}</div>
                    </div>
                    <div style={{marginLeft:"auto",fontSize:12,fontWeight:600,color:syncStatus==="synced"?"#16a34a":syncStatus==="error"?"#dc2626":"#0284c7"}}>
                      {syncIcon} {syncStatus==="synced"?"Synced":syncStatus==="syncing"?"Syncing...":syncStatus==="error"?"Sync Error":""}
                    </div>
                  </div>
                  {syncMsg&&<div style={{fontSize:11,color:textSecondary,marginBottom:8}}>{syncMsg}</div>}
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>syncFromDrive(tokenRef.current)} style={{padding:"7px 16px",borderRadius:8,border:"none",background:"#0f3460",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>🔄 Sync Now</button>
                    <button onClick={signOutGoogle} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${borderColor}`,background:cardBg,cursor:"pointer",fontSize:12,fontWeight:600,color:"#dc2626"}}>Sign Out</button>
                  </div>
                </div>
              )}
            </div>

            {/* Background */}
            <div style={{marginBottom:24,paddingBottom:24,borderBottom:`1px solid ${borderColor}`}}>
              <div style={{fontWeight:700,fontSize:13,color:textPrimary,marginBottom:12}}>🎨 Background</div>
              <div style={{display:"flex",gap:8,marginBottom:14}}>
                {[["gradient","Gradient"],["color","Solid Color"],["image","Photo"]].map(([t,l])=>(
                  <button key={t} onClick={()=>{ setBgType(t); saveSettings({bgType:t}); }}
                    style={{padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                      background:bgType===t?"#0f3460":"#f0f4f8",color:bgType===t?"#fff":"#555"}}>
                    {l}
                  </button>
                ))}
              </div>
              {bgType==="gradient"&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {GRADIENTS.map(g=>(
                    <div key={g.label} onClick={()=>{ setBgValue(g.value); saveSettings({bgValue:g.value}); }}
                      style={{height:48,borderRadius:8,background:g.value,cursor:"pointer",border:bgValue===g.value?"3px solid #fff":"3px solid transparent",
                        boxShadow:bgValue===g.value?"0 0 0 2px #0f3460":"none",display:"flex",alignItems:"flex-end",padding:"4px 6px"}}>
                      <span style={{fontSize:10,fontWeight:600,color:"#fff",textShadow:"0 1px 3px rgba(0,0,0,.5)"}}>{g.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {bgType==="color"&&(
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <input type="color" value={bgColor} onChange={e=>{ setBgColor(e.target.value); saveSettings({bgColor:e.target.value}); }}
                    style={{width:48,height:48,borderRadius:8,border:"none",cursor:"pointer",padding:0}}/>
                  <span style={{fontSize:13,color:textSecondary}}>Click to pick a color</span>
                </div>
              )}
              {bgType==="image"&&(
                <div>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                    const file=e.target.files?.[0]; if(!file) return;
                    const reader=new FileReader();
                    reader.onload=ev=>{ setBgImage(ev.target.result); saveSettings({bgImage:ev.target.result}); };
                    reader.readAsDataURL(file);
                  }}/>
                  <button onClick={()=>fileInputRef.current?.click()}
                    style={{padding:"10px 20px",borderRadius:8,border:`2px dashed ${borderColor}`,background:cardBg,cursor:"pointer",fontWeight:600,fontSize:13,color:textSecondary}}>
                    📸 Upload Photo
                  </button>
                  {bgImage&&<button onClick={()=>{ setBgImage(null); saveSettings({bgImage:null}); }} style={{marginLeft:10,padding:"10px 14px",borderRadius:8,border:`1px solid ${borderColor}`,background:cardBg,cursor:"pointer",fontSize:12,color:"#dc2626",fontWeight:600}}>Remove</button>}
                </div>
              )}
            </div>

            {/* Dark Mode */}
            <div>
              <div style={{fontWeight:700,fontSize:13,color:textPrimary,marginBottom:10}}>🌙 Dark Mode</div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div onClick={()=>{ setDarkMode(d=>!d); saveSettings({darkMode:!darkMode}); }}
                  style={{width:52,height:28,borderRadius:14,background:darkMode?"#0f3460":"#cbd5e0",cursor:"pointer",position:"relative",transition:"background .2s"}}>
                  <div style={{position:"absolute",top:3,left:darkMode?26:3,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
                </div>
                <span style={{fontSize:13,color:textSecondary}}>{darkMode?"Dark mode on":"Dark mode off"}</span>
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setActiveTab(t.key)}
              style={{padding:"10px 20px",borderRadius:8,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,
                background:activeTab===t.key?"#0f3460":darkMode?"rgba(255,255,255,.12)":"#fff",
                color:activeTab===t.key?"#fff":darkMode?"#e2e8f0":"#555",
                boxShadow:activeTab===t.key?"0 2px 8px rgba(15,52,96,.3)":"0 1px 3px rgba(0,0,0,.1)"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* PASTE */}
        {activeTab==="input"&&(
          <div style={{background:cardBg,borderRadius:14,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
              <div style={{background:darkMode?"#0f172a":"#f0f4f8",borderRadius:50,padding:4,display:"inline-flex",gap:0}}>
                {[["meeting","📅 Meeting"],["training","🎓 Training"]].map(([m,l])=>(
                  <button key={m} onClick={()=>setMode(m)}
                    style={{padding:"9px 28px",borderRadius:50,border:"none",cursor:"pointer",fontWeight:700,fontSize:14,
                      background:mode===m?(m==="training"?"#7c3aed":"#0f3460"):"transparent",
                      color:mode===m?"#fff":textSecondary,
                      boxShadow:mode===m?"0 2px 8px rgba(0,0,0,.2)":"none",transition:"all .2s"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{fontSize:12,color:textSecondary,textAlign:"center",marginBottom:16}}>
              {mode==="meeting"?"Organizes into agenda, decisions, action items, and more.":"Organizes into concepts, follow-up questions, and how to apply."}
            </div>
            <textarea value={raw} onChange={e=>setRaw(e.target.value)} placeholder="Paste your raw Plaud transcript, AI summary, or notes here..."
              style={{width:"100%",minHeight:280,padding:16,fontSize:14,lineHeight:1.6,border:`2px solid ${borderColor}`,borderRadius:10,resize:"vertical",outline:"none",fontFamily:"inherit",color:textPrimary,boxSizing:"border-box",background:inputBg}}/>
            {error&&<div style={{color:"#e53e3e",fontSize:13,marginTop:8}}>{error}</div>}
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button onClick={organize} disabled={!raw.trim()||loading}
                style={{flex:1,padding:13,borderRadius:10,border:"none",cursor:raw.trim()&&!loading?"pointer":"not-allowed",
                  background:raw.trim()&&!loading?"linear-gradient(135deg,#0f3460,#533483)":"#cbd5e0",color:"#fff",fontWeight:700,fontSize:15}}>
                {loading?"⏳ Organizing...":"✨ Organize My Notes"}
              </button>
              {raw&&<button onClick={reset} style={{padding:"13px 20px",borderRadius:10,border:`2px solid ${borderColor}`,background:cardBg,cursor:"pointer",fontWeight:600,color:textSecondary,fontSize:14}}>Clear</button>}
            </div>
          </div>
        )}

        {/* OUTPUT */}
        {activeTab==="output"&&(
          <div>
            {!organized?<EmptyState icon="📄" text="Paste your notes and click Organize to see results here." darkMode={darkMode}/>:(
              <>
                <div style={{background:cardBg,borderRadius:12,padding:"12px 16px",marginBottom:8,boxShadow:"0 2px 8px rgba(0,0,0,.07)",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,fontWeight:700,color:textSecondary,marginRight:4}}>Export:</span>
                  <button onClick={()=>setPrintMode(true)} style={{padding:"9px 16px",borderRadius:8,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,color:"#fff",background:"#dc2626"}}>📄 PDF</button>
                  <a href={toDataUri(buildTxt(organized))} download="notes.txt" style={{padding:"9px 16px",borderRadius:8,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,color:"#fff",background:"#16a34a",textDecoration:"none"}}>📃 Plain Text</a>
                  <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                    <button onClick={copyAll} style={{padding:"9px 16px",borderRadius:8,border:`2px solid #0f3460`,background:cardBg,cursor:"pointer",fontWeight:600,fontSize:13,color:"#0f3460"}}>{copied?"✅ Copied!":"📋 Copy All"}</button>
                    <button onClick={()=>setActiveTab("file")} style={{padding:"9px 16px",borderRadius:8,border:"none",background:"#0f3460",cursor:"pointer",fontWeight:600,fontSize:13,color:"#fff"}}>📁 File This →</button>
                  </div>
                </div>
                {organized._mode==="training"?<TrainingCards data={organized} darkMode={darkMode}/>:<MeetingCards data={organized} onStatusChange={updateActionStatus} darkMode={darkMode}/>}
              </>
            )}
          </div>
        )}

        {/* FILE */}
        {activeTab==="file"&&(
          <div>
            {!organized?<EmptyState icon="📁" text="Organize a meeting first before filing it." darkMode={darkMode}/>:(
              <div style={{background:cardBg,borderRadius:14,padding:28,boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}>
                <div style={{fontSize:17,fontWeight:700,color:textPrimary,marginBottom:6}}>Ready to File</div>
                <div style={{background:darkMode?"#0f172a":"#f7fafc",borderRadius:10,padding:16,marginBottom:24,border:`1px solid ${borderColor}`}}>
                  <div style={{fontWeight:700,fontSize:15,color:textPrimary}}>{organized.header?.title||"Untitled"}</div>
                  <div style={{fontSize:13,color:textSecondary,marginTop:4}}>{organized.header?.date||""}</div>
                  <div style={{fontSize:12,color:textSecondary,marginTop:4}}>Mode: {organized._mode==="training"?"🎓 Training":"📅 Meeting"}</div>
                </div>

                {!workStep&&(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
                    <button onClick={()=>organized._mode==="training"?fileMeetingToFolder("work","Trainings"):setWorkStep("subtype")} disabled={!!filingLoading}
                      style={{padding:"20px 16px",borderRadius:12,border:"2px solid #2563eb",background:cardBg,cursor:"pointer",textAlign:"center"}}>
                      <div style={{fontSize:28,marginBottom:8}}>💼</div>
                      <div style={{fontWeight:700,fontSize:16,color:"#1d4ed8"}}>{filingLoading==="Trainings"?"⏳ Filing...":"File to Work"}</div>
                      <div style={{fontSize:12,color:textSecondary,marginTop:4}}>{organized._mode==="training"?"Files directly to Trainings":"Choose Meetings or Trainings"}</div>
                    </button>
                    <button onClick={()=>fileMeeting("life")} disabled={!!filingLoading}
                      style={{padding:"20px 16px",borderRadius:12,border:"2px solid #16a34a",background:cardBg,cursor:"pointer",textAlign:"center"}}>
                      <div style={{fontSize:28,marginBottom:8}}>🏠</div>
                      <div style={{fontWeight:700,fontSize:16,color:"#15803d"}}>{filingLoading==="life"?"⏳ Filing...":"File to Life"}</div>
                      <div style={{fontSize:12,color:textSecondary,marginTop:4}}>Auto-categorizes by subject</div>
                    </button>
                  </div>
                )}

                {workStep==="subtype"&&(
                  <div style={{marginBottom:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                      <button onClick={()=>setWorkStep(null)} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${borderColor}`,background:cardBg,cursor:"pointer",fontSize:12,fontWeight:600,color:textSecondary}}>← Back</button>
                      <div style={{fontSize:14,fontWeight:700,color:"#1d4ed8"}}>💼 Work — What type?</div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                      {[["Meetings","📅","#0284c7","Pick a company"],["Trainings","🎓","#7c3aed","Files directly"]].map(([type,icon,color,sub])=>(
                        <button key={type} onClick={()=>{ setWorkSubType(type); type==="Trainings"?(setWorkStep(null),fileMeetingToFolder("work","Trainings")):setWorkStep("company"); }}
                          disabled={!!filingLoading}
                          style={{padding:"22px 16px",borderRadius:12,border:`2px solid ${color}`,background:cardBg,cursor:"pointer",textAlign:"center"}}>
                          <div style={{fontSize:30,marginBottom:8}}>{icon}</div>
                          <div style={{fontWeight:700,fontSize:15,color}}>{type}</div>
                          <div style={{fontSize:11,color:textSecondary,marginTop:4}}>{sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {workStep==="company"&&(
                  <div style={{marginBottom:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                      <button onClick={()=>setWorkStep("subtype")} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${borderColor}`,background:cardBg,cursor:"pointer",fontSize:12,fontWeight:600,color:textSecondary}}>← Back</button>
                      <div style={{fontSize:14,fontWeight:700,color:"#0284c7"}}>📅 Meetings — Choose company:</div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                      {[["Versatrim","🏭","#0f3460"],["Morris and Associates","🤝","#0284c7"]].map(([company,icon,color])=>(
                        <button key={company} onClick={()=>{ setWorkStep(null);setWorkSubType(null);fileMeetingToFolder("work",company); }}
                          disabled={!!filingLoading}
                          style={{padding:"22px 16px",borderRadius:12,border:`2px solid ${color}`,background:cardBg,cursor:"pointer",textAlign:"center"}}>
                          <div style={{fontSize:30,marginBottom:8}}>{icon}</div>
                          <div style={{fontWeight:700,fontSize:15,color}}>{filingLoading===company?"⏳ Filing...":company}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {filingStatus&&(
                  <div style={{borderRadius:10,padding:"12px 16px",background:filingStatus.error?"#fef2f2":filingStatus.type==="work"?"#eff6ff":"#f0fdf4",border:`1px solid ${filingStatus.error?"#fca5a5":filingStatus.type==="work"?"#bfdbfe":"#bbf7d0"}`,display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:18}}>{filingStatus.error?"❌":"✅"}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:filingStatus.error?"#dc2626":filingStatus.type==="work"?"#1d4ed8":"#15803d"}}>{filingStatus.error?"Filing Failed":"Successfully Filed"}</div>
                      <div style={{fontSize:12,color:"#555",marginTop:1}}>{filingStatus.label}</div>
                    </div>
                    {!filingStatus.error&&<button onClick={()=>setActiveTab("database")} style={{marginLeft:"auto",padding:"6px 14px",borderRadius:8,border:"none",background:"#0f3460",color:"#fff",fontWeight:600,fontSize:12,cursor:"pointer"}}>View in Database →</button>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* DATABASE */}
        {activeTab==="database"&&(
          <div>
            {!dbLoaded?<EmptyState icon="⏳" text="Loading database..." darkMode={darkMode}/>:(
              <>
                <div style={{background:cardBg,borderRadius:12,padding:"12px 16px",marginBottom:16,boxShadow:"0 2px 8px rgba(0,0,0,.07)",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <div style={{display:"flex",background:darkMode?"#0f172a":"#f0f4f8",borderRadius:8,padding:3,gap:2}}>
                    {[["work","💼 Work","#1d4ed8"],["life","🏠 Life","#15803d"]].map(([v,l,c])=>(
                      <button key={v} onClick={()=>setDbView(v)}
                        style={{padding:"7px 18px",borderRadius:6,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,
                          background:dbView===v?"#fff":"transparent",color:dbView===v?c:textSecondary,
                          boxShadow:dbView===v?"0 1px 4px rgba(0,0,0,.12)":"none"}}>{l}</button>
                    ))}
                  </div>
                  {dbView==="work"&&(
                    <div style={{display:"flex",background:darkMode?"#0f172a":"#f0f4f8",borderRadius:50,padding:3,gap:0}}>
                      {["Meetings","Trainings"].map(s=>(
                        <button key={s} onClick={()=>setWorkSection(s)}
                          style={{padding:"6px 20px",borderRadius:50,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,
                            background:workSection===s?"#1d4ed8":"transparent",color:workSection===s?"#fff":textSecondary,
                            boxShadow:workSection===s?"0 2px 8px rgba(29,78,216,.25)":"none",transition:"all .2s"}}>
                          {s==="Meetings"?"📅 Meetings":"🎓 Trainings"}
                        </button>
                      ))}
                    </div>
                  )}
                  <input value={dbSearch} onChange={e=>setDbSearch(e.target.value)} placeholder="🔍 Search..."
                    style={{flex:1,minWidth:140,padding:"8px 12px",borderRadius:8,border:`1px solid ${borderColor}`,fontSize:13,outline:"none",background:inputBg,color:textPrimary}}/>
                  <button onClick={()=>setShowNewFolder(f=>!f)}
                    style={{padding:"8px 14px",borderRadius:8,border:`2px dashed ${borderColor}`,background:cardBg,cursor:"pointer",fontWeight:600,fontSize:12,color:textSecondary}}>
                    ＋ New Folder
                  </button>
                </div>

                {showNewFolder&&(
                  <div style={{background:cardBg,borderRadius:10,padding:"12px 16px",marginBottom:12,boxShadow:"0 1px 6px rgba(0,0,0,.07)",display:"flex",gap:8,alignItems:"center"}}>
                    <input autoFocus value={newFolderName} onChange={e=>setNewFolderName(e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Enter") createFolder(dbView,newFolderName); if(e.key==="Escape") setShowNewFolder(false); }}
                      placeholder={`New ${dbView} folder name...`}
                      style={{flex:1,padding:"7px 12px",borderRadius:7,border:"2px solid #0f3460",fontSize:13,outline:"none",background:inputBg,color:textPrimary}}/>
                    <button onClick={()=>createFolder(dbView,newFolderName)} style={{padding:"7px 16px",borderRadius:7,border:"none",background:"#0f3460",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>Create</button>
                    <button onClick={()=>setShowNewFolder(false)} style={{padding:"7px 12px",borderRadius:7,border:`1px solid ${borderColor}`,background:cardBg,fontWeight:600,fontSize:13,cursor:"pointer",color:textSecondary}}>Cancel</button>
                  </div>
                )}

                <div style={{fontSize:11,color:textSecondary,marginBottom:10}}>💡 Drag any note or use ↗️ to move between folders</div>

                {Object.keys(db[dbView]||{}).length===0?(
                  <EmptyState icon={dbView==="work"?"💼":"🏠"} text={`No ${dbView} notes filed yet.`} darkMode={darkMode}/>
                ):(
                  Object.entries(db[dbView]||{})
                    .filter(([group])=>{
                      if(dbView!=="work") return true;
                      const isTrainingGroup=group==="Trainings"||trainingSections.includes(group);
                      return workSection==="Trainings"?isTrainingGroup:!isTrainingGroup;
                    })
                    .map(([group,meetings])=>{
                      const safeMeetings=safe(meetings);
                      const filtered=filterMeetings(safeMeetings);
                      if(!filtered.length&&dbSearch) return null;
                      const isOpen=expandedGroups[group];
                      const color=dbView==="work"?"#1d4ed8":(LIFE_COLORS[group]||"#6b7280");
                      const icon=dbView==="work"?"🏢":(LIFE_ICONS[group]||"📌");
                      const isDragTarget=dragOver?.group===group&&dragOver?.type===dbView;
                      return(
                        <div key={group}
                          onDragOver={e=>{ e.preventDefault();setDragOver({type:dbView,group}); }}
                          onDragLeave={()=>setDragOver(null)}
                          onDrop={e=>{ e.preventDefault();if(dragging) moveMeeting(dragging.type,dragging.group,dragging.id,dbView,group);setDragging(null);setDragOver(null); }}
                          style={{background:cardBg,borderRadius:14,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,.07)",overflow:"hidden",
                            border:isDragTarget?`2px dashed ${color}`:`2px solid ${borderColor}`,transition:"border .15s"}}>

                          <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:10,borderLeft:`4px solid ${color}`}}>
                            {renamingGroup===group?(
                              <div style={{flex:1,display:"flex",alignItems:"center",gap:8}} onClick={e=>e.stopPropagation()}>
                                <span style={{fontSize:20}}>{icon}</span>
                                <input autoFocus value={renameValue} onChange={e=>setRenameValue(e.target.value)}
                                  onKeyDown={e=>{ if(e.key==="Enter") renameGroup(dbView,group,renameValue); if(e.key==="Escape") setRenamingGroup(null); }}
                                  style={{flex:1,padding:"5px 10px",borderRadius:7,border:"2px solid #0f3460",fontSize:14,fontWeight:600,outline:"none",background:inputBg,color:textPrimary}}/>
                                <button onClick={()=>renameGroup(dbView,group,renameValue)} style={{padding:"5px 12px",borderRadius:7,border:"none",background:"#0f3460",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>Save</button>
                                <button onClick={()=>setRenamingGroup(null)} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${borderColor}`,background:cardBg,fontWeight:600,fontSize:12,cursor:"pointer",color:textSecondary}}>Cancel</button>
                              </div>
                            ):(
                              <>
                                <div onClick={()=>toggleGroup(group)} style={{display:"flex",alignItems:"center",gap:10,flex:1,cursor:"pointer"}}>
                                  <span style={{fontSize:20}}>{icon}</span>
                                  <div style={{flex:1}}>
                                    <div style={{fontWeight:700,fontSize:15,color:textPrimary}}>{group}</div>
                                    <div style={{fontSize:12,color:textSecondary}}>{safeMeetings.length} note{safeMeetings.length!==1?"s":""}{isDragTarget&&<span style={{color,marginLeft:8,fontWeight:600}}>Drop here</span>}</div>
                                  </div>
                                </div>
                                <button onClick={e=>{ e.stopPropagation();setRenamingGroup(group);setRenameValue(group); }}
                                  style={{padding:"5px 10px",borderRadius:7,border:`1px solid ${borderColor}`,background:cardBg,cursor:"pointer",fontSize:12,fontWeight:600,color:textSecondary}}>✏️ Rename</button>
                                <button onClick={e=>{ e.stopPropagation();setDeletingGroup(group); }}
                                  style={{padding:"5px 10px",borderRadius:7,border:"1px solid #fecaca",background:cardBg,cursor:"pointer",fontSize:12,fontWeight:600,color:"#dc2626"}}>🗑️</button>
                                <span onClick={()=>toggleGroup(group)} style={{fontSize:18,color:textSecondary,cursor:"pointer",transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s"}}>›</span>
                              </>
                            )}
                          </div>

                          {deletingGroup===group&&(
                            <div style={{padding:"12px 18px",background:"#fef2f2",borderTop:"1px solid #fecaca",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                              <span style={{fontSize:13,fontWeight:600,color:"#dc2626",flex:1}}>Delete <strong>{group}</strong>?{safeMeetings.length>0&&` This will also delete ${safeMeetings.length} note${safeMeetings.length!==1?"s":""}.`}</span>
                              <button onClick={e=>{ e.stopPropagation();const g=group,t=dbView;setDeletingGroup(null);setDb(prev=>{ const n=JSON.parse(JSON.stringify(prev));delete n[t][g];window.storage.set("plaud_db",JSON.stringify(n)).catch(()=>{});syncToDrive(n,trainingSections);return n; }); }}
                                style={{padding:"6px 16px",borderRadius:7,border:"none",background:"#dc2626",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>Delete</button>
                              <button onClick={e=>{ e.stopPropagation();setDeletingGroup(null); }}
                                style={{padding:"6px 14px",borderRadius:7,border:`1px solid ${borderColor}`,background:cardBg,fontWeight:600,fontSize:12,cursor:"pointer",color:textSecondary}}>Cancel</button>
                            </div>
                          )}

                          {isOpen&&(
                            <div style={{borderTop:`1px solid ${borderColor}`}}>
                              {filtered.length===0?(
                                <div style={{padding:"14px 18px",color:textSecondary,fontSize:13,fontStyle:"italic"}}>No notes match your search.</div>
                              ):filtered.map(m=>(
                                <div key={m.id} draggable
                                  onDragStart={e=>{ setDragging({type:dbView,group,id:m.id});e.dataTransfer.effectAllowed="move"; }}
                                  onDragEnd={()=>{ setDragging(null);setDragOver(null); }}
                                  style={{borderBottom:`1px solid ${borderColor}`,background:dragging?.id===m.id?darkMode?"#1e293b":"#f0f4f8":expandedMeeting===m.id?darkMode?"#1e293b":"#f8faff":cardBg,
                                    opacity:dragging?.id===m.id?0.5:1,cursor:"grab"}}>
                                  <div style={{padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
                                    <span style={{fontSize:16,color:textSecondary,userSelect:"none"}} title="Drag to move">⠿</span>
                                    <div style={{flex:1}}>
                                      <div style={{fontWeight:600,fontSize:14,color:textPrimary}}>{m.data?.header?.title||"Untitled"}</div>
                                      <div style={{fontSize:12,color:textSecondary,marginTop:2}}>{m.data?._mode==="training"?"🎓 Training":"📅 Meeting"} · {m.data?.header?.date||""}</div>
                                    </div>
                                    <div style={{display:"flex",gap:6}}>
                                      <IcoBtn icon="👁️" title="View" color="#0f3460" onClick={()=>setExpandedMeeting(expandedMeeting===m.id?null:m.id)}/>
                                      <IcoBtn icon="↗️" title="Move to..." color="#7c3aed" onClick={()=>setMovingMeeting({id:m.id,fromType:dbView,fromGroup:group})}/>
                                      <IcoBtn icon="✏️" title="Edit" color="#d97706" onClick={()=>setEditingMeeting({...m,type:dbView,group})}/>
                                      <IcoBtn icon="🗑️" title="Delete" color="#dc2626" onClick={()=>setDeleteConfirm({id:m.id,type:dbView,group})}/>
                                    </div>
                                  </div>
                                  {deleteConfirm?.id===m.id&&(
                                    <div style={{padding:"10px 18px",background:"#fef2f2",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #fecaca"}}>
                                      <span style={{fontSize:13,color:"#dc2626",fontWeight:600}}>Delete this note?</span>
                                      <button onClick={()=>deleteMeeting(dbView,group,m.id)} style={{padding:"5px 14px",borderRadius:6,border:"none",background:"#dc2626",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>Delete</button>
                                      <button onClick={()=>setDeleteConfirm(null)} style={{padding:"5px 14px",borderRadius:6,border:`1px solid ${borderColor}`,background:cardBg,fontWeight:600,fontSize:12,cursor:"pointer",color:textSecondary}}>Cancel</button>
                                    </div>
                                  )}
                                  {expandedMeeting===m.id&&(
                                    <div style={{padding:"0 18px 18px",background:darkMode?"#0f172a":"#f8faff"}}>
                                      {m.data?._mode==="training"?<TrainingCards data={m.data} compact darkMode={darkMode}/>:<MeetingCards data={m.data} compact darkMode={darkMode}/>}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* MOVE MODAL */}
      {movingMeeting&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={()=>setMovingMeeting(null)}>
          <div style={{background:cardBg,borderRadius:16,padding:28,minWidth:340,maxWidth:480,boxShadow:"0 8px 40px rgba(0,0,0,.2)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:700,fontSize:17,color:textPrimary,marginBottom:6}}>↗️ Move Note To...</div>
            <div style={{fontSize:13,color:textSecondary,marginBottom:20}}>Select a section and folder to move this note into.</div>
            {workMeetingFolders.length>0&&(
              <>
                <div style={{fontSize:11,fontWeight:700,color:"#0284c7",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>📅 Meetings</div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                  {workMeetingFolders.map(folder=>(
                    <button key={folder} disabled={folder===movingMeeting.fromGroup}
                      onClick={async()=>{ if(!db.work[folder]){const n=JSON.parse(JSON.stringify(db));n.work[folder]=[];await saveDb(n);} await moveMeeting(movingMeeting.fromType,movingMeeting.fromGroup,movingMeeting.id,"work",folder);setMovingMeeting(null); }}
                      style={{padding:"10px 16px",borderRadius:9,border:`1px solid ${borderColor}`,background:folder===movingMeeting.fromGroup?darkMode?"#1e293b":"#f7fafc":cardBg,
                        cursor:folder===movingMeeting.fromGroup?"not-allowed":"pointer",textAlign:"left",fontSize:13,fontWeight:600,
                        color:folder===movingMeeting.fromGroup?textSecondary:textPrimary,display:"flex",alignItems:"center",gap:8}}>
                      🏢 {folder}{folder===movingMeeting.fromGroup&&<span style={{fontSize:11,color:textSecondary,fontWeight:400}}>(current)</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
            {workTrainingFolders.length>0&&(
              <>
                <div style={{fontSize:11,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>🎓 Trainings</div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                  {workTrainingFolders.map(folder=>(
                    <button key={folder} disabled={folder===movingMeeting.fromGroup}
                      onClick={async()=>{
                        if(!db.work[folder]){const n=JSON.parse(JSON.stringify(db));n.work[folder]=[];await saveDb(n);}
                        if(!trainingSections.includes(folder)&&folder!=="Trainings") await saveTrainingSections([...trainingSections,folder]);
                        await moveMeeting(movingMeeting.fromType,movingMeeting.fromGroup,movingMeeting.id,"work",folder);
                        setMovingMeeting(null);
                      }}
                      style={{padding:"10px 16px",borderRadius:9,border:`1px solid ${borderColor}`,background:folder===movingMeeting.fromGroup?darkMode?"#1e293b":"#f7fafc":cardBg,
                        cursor:folder===movingMeeting.fromGroup?"not-allowed":"pointer",textAlign:"left",fontSize:13,fontWeight:600,
                        color:folder===movingMeeting.fromGroup?textSecondary:textPrimary,display:"flex",alignItems:"center",gap:8}}>
                      🎓 {folder}{folder===movingMeeting.fromGroup&&<span style={{fontSize:11,color:textSecondary,fontWeight:400}}>(current)</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
            <button onClick={()=>setMovingMeeting(null)} style={{width:"100%",padding:"10px",borderRadius:9,border:`1px solid ${borderColor}`,background:darkMode?"#0f172a":"#f7fafc",cursor:"pointer",fontWeight:600,fontSize:13,color:textSecondary}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PS({title,children}){return(<div style={{marginBottom:16}}><h2 style={{fontSize:13,fontWeight:700,color:"#0f3460",margin:"20px 0 8px",textTransform:"uppercase",borderLeft:"4px solid #0f3460",paddingLeft:8}}>{title}</h2>{children}</div>);}
function IcoBtn({icon,title,color,onClick}){return(<button onClick={onClick} title={title} style={{width:32,height:32,borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",color}}>{icon}</button>);}
function EmptyState({icon,text,darkMode}){return(<div style={{background:darkMode?"#1e293b":"#fff",borderRadius:14,padding:48,textAlign:"center",color:darkMode?"#94a3b8":"#999",boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}><div style={{fontSize:40,marginBottom:12}}>{icon}</div><div style={{fontSize:15}}>{text}</div></div>);}

function TrainingCards({data:d,compact,darkMode}){
  const textS=darkMode?"#94a3b8":"#555";
  const concepts=safe(d?.concepts),questions=safe(d?.questions),apply=safe(d?.apply);
  return(<div>
    <Card icon="🎓" title="Training Header" compact={compact} darkMode={darkMode}><Grid2><Field label="Title" value={d?.header?.title} darkMode={darkMode}/><Field label="Date" value={d?.header?.date} darkMode={darkMode}/><Field label="Instructor" value={d?.header?.instructor} darkMode={darkMode}/><Field label="Platform" value={d?.header?.platform} darkMode={darkMode}/></Grid2></Card>
    <Card icon="💡" title="Key Concepts & Topics" compact={compact} darkMode={darkMode}>
      {!concepts.length?<Empty/>:concepts.map((c,i)=><div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${darkMode?"#334155":"#f0f4f8"}`}}><div style={{fontWeight:700,fontSize:13,color:"#0f3460",marginBottom:4}}>📌 {c.topic}</div><div style={{fontSize:13,color:textS,lineHeight:1.6}}>{c.notes}</div></div>)}
    </Card>
    <Card icon="❓" title="Questions to Follow Up On" compact={compact} darkMode={darkMode}>{!questions.length?<Empty/>:questions.map((q,i)=><Bullet key={i} text={q} color="#f59e0b"/>)}</Card>
    <Card icon="🚀" title="How to Apply / Next Steps" compact={compact} darkMode={darkMode}>{!apply.length?<Empty/>:apply.map((a,i)=><Bullet key={i} text={a} color="#34d399"/>)}</Card>
  </div>);
}

function MeetingCards({data:d,compact,onStatusChange,darkMode}){
  const [,forceUpdate]=useState(0);
  const agenda=safe(d?.agenda),highlights=safe(d?.highlights),decisions=safe(d?.decisions),actions=safe(d?.actions),parking=safe(d?.parking);
  return(<div>
    <Card icon="📋" title="Meeting Header" compact={compact} darkMode={darkMode}><Grid2><Field label="Title" value={d?.header?.title} darkMode={darkMode}/><Field label="Date" value={d?.header?.date} darkMode={darkMode}/><Field label="Time" value={d?.header?.time} darkMode={darkMode}/><Field label="Location" value={d?.header?.location} darkMode={darkMode}/><Field label="Facilitator" value={d?.header?.facilitator} darkMode={darkMode}/><Field label="Attendees" value={d?.header?.attendees} darkMode={darkMode}/></Grid2></Card>
    <Card icon="📌" title="Pre-Meeting Agenda" compact={compact} darkMode={darkMode}>
      {!agenda.length||agenda[0]?.topic==="—"?<Empty/>:<TableWrap heads={["#","Topic","Owner","Duration"]} darkMode={darkMode}>{agenda.map((a,i)=><tr key={i} style={{borderBottom:`1px solid ${darkMode?"#334155":"#f0f0f0"}`}}><td style={{padding:"7px 10px",color:"#999"}}>{i+1}</td><td style={{padding:"7px 10px",fontWeight:500,color:darkMode?"#f1f5f9":"#1a1a2e"}}>{a.topic}</td><td style={{padding:"7px 10px",color:darkMode?"#94a3b8":"#555"}}>{a.owner}</td><td style={{padding:"7px 10px",color:darkMode?"#94a3b8":"#555"}}>{a.duration}</td></tr>)}</TableWrap>}
    </Card>
    <Card icon="⭐" title="Highlighted Moments" compact={compact} darkMode={darkMode}>{!highlights.length?<Empty/>:highlights.map((h,i)=><Bullet key={i} text={h} color="#fbbf24"/>)}</Card>
    <Card icon="✅" title="Key Decisions" compact={compact} darkMode={darkMode}>{!decisions.length?<Empty/>:decisions.map((x,i)=><Bullet key={i} text={x} color="#34d399"/>)}</Card>
    <Card icon="🎯" title="Action Items" compact={compact} darkMode={darkMode}>
      {!actions.length||actions[0]?.task==="—"?<Empty/>:
        <TableWrap heads={["Task","Owner","Due Date","Status"]} darkMode={darkMode}>
          {actions.map((a,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${darkMode?"#334155":"#f0f0f0"}`}}>
              <td style={{padding:"7px 10px",fontWeight:500,color:darkMode?"#f1f5f9":"#1a1a2e"}}>{a.task}</td>
              <td style={{padding:"7px 10px",color:darkMode?"#94a3b8":"#555"}}>{a.owner}</td>
              <td style={{padding:"7px 10px"}}>
                <input value={a.due||""} onChange={e=>{ if(onStatusChange){onStatusChange(i,null,e.target.value);}else{a.due=e.target.value;forceUpdate(n=>n+1);} }}
                  placeholder="Set date" style={{width:90,padding:"3px 7px",borderRadius:6,border:`1px solid ${darkMode?"#334155":"#e2e8f0"}`,fontSize:13,outline:"none",fontFamily:"inherit",color:darkMode?"#f1f5f9":"#374151",background:darkMode?"#0f172a":"#fafafa"}}/>
              </td>
              <td style={{padding:"7px 10px"}}><StatusBadge value={a.status} onChange={val=>{ if(onStatusChange){onStatusChange(i,val,undefined);}else{a.status=val;forceUpdate(n=>n+1);} }}/></td>
            </tr>
          ))}
        </TableWrap>}
    </Card>
    <Card icon="🅿️" title="Parking Lot" compact={compact} darkMode={darkMode}>{!parking.length?<Empty/>:parking.map((p,i)=><Bullet key={i} text={p} color="#a78bfa"/>)}</Card>
    <Card icon="📅" title="Next Meeting" compact={compact} darkMode={darkMode}><Grid2><Field label="Date" value={d?.next?.date} darkMode={darkMode}/><Field label="Time" value={d?.next?.time} darkMode={darkMode}/><Field label="Focus" value={d?.next?.focus} darkMode={darkMode}/><Field label="Prep Needed" value={d?.next?.prep} darkMode={darkMode}/></Grid2></Card>
  </div>);
}

function EditView({meeting,onSave,onCancel,darkMode}){
  const [data,setData]=useState(JSON.parse(JSON.stringify(meeting.data)));
  const cardBg=darkMode?"#1e293b":"#fff"; const textP=darkMode?"#f1f5f9":"#1a1a2e"; const textS=darkMode?"#94a3b8":"#999"; const border=darkMode?"#334155":"#e2e8f0"; const inputBg=darkMode?"#0f172a":"#fff";
  const set=(path,val)=>{const d=JSON.parse(JSON.stringify(data));const keys=path.split(".");let obj=d;keys.slice(0,-1).forEach(k=>{if(!obj[k])obj[k]={};obj=obj[k];});obj[keys[keys.length-1]]=val;setData(d);};
  const inp=(label,path)=>(<div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:700,color:textS,textTransform:"uppercase",marginBottom:3}}>{label}</div><input value={path.split(".").reduce((o,k)=>o?.[k]||"",data)} onChange={e=>set(path,e.target.value)} style={{width:"100%",padding:"7px 10px",borderRadius:7,border:`1px solid ${border}`,fontSize:13,boxSizing:"border-box",outline:"none",background:inputBg,color:textP}}/></div>);
  const isT=meeting.data?._mode==="training";
  return(<div style={{fontFamily:"'Segoe UI',sans-serif",minHeight:"100vh",background:darkMode?"#0f172a":"#f0f4f8",padding:24}}>
    <div style={{maxWidth:800,margin:"0 auto"}}>
      <div style={{background:cardBg,borderRadius:14,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button onClick={onCancel} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${border}`,background:cardBg,cursor:"pointer",fontSize:13,fontWeight:600,color:textS}}>← Back</button>
          <div style={{fontWeight:700,fontSize:16,color:textP}}>Edit {isT?"Training":"Meeting"}</div>
          <button onClick={()=>onSave(meeting.type,meeting.group,meeting.id,data)} style={{marginLeft:"auto",padding:"8px 20px",borderRadius:8,border:"none",background:"#0f3460",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>💾 Save Changes</button>
        </div>
        {isT?(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>{inp("Title","header.title")}{inp("Date","header.date")}{inp("Instructor","header.instructor")}{inp("Platform","header.platform")}</div>):(
          <><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>{inp("Title","header.title")}{inp("Date","header.date")}{inp("Time","header.time")}{inp("Location","header.location")}{inp("Facilitator","header.facilitator")}{inp("Attendees","header.attendees")}</div><div style={{marginTop:10}}>{inp("Next Meeting Date","next.date")}{inp("Next Meeting Focus","next.focus")}</div></>
        )}
        <div style={{marginTop:16,padding:12,background:darkMode?"#0f172a":"#f7fafc",borderRadius:8,fontSize:12,color:textS}}>ℹ️ For full editing of concepts, decisions, and action items, use Copy All and paste into your document editor.</div>
      </div>
    </div>
  </div>);
}

function StatusBadge({value,onChange}){
  const [open,setOpen]=useState(false);
  const [current,setCurrent]=useState(value||"Open");
  useEffect(()=>{setCurrent(value||"Open");},[value]);
  const st=STATUS_STYLES[current]||STATUS_STYLES["Open"];
  return(<div style={{position:"relative",display:"inline-block"}}>
    <button onClick={()=>setOpen(o=>!o)} style={{...st,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>
      {current} <span style={{fontSize:9}}>▼</span>
    </button>
    {open&&(<div style={{position:"absolute",top:"110%",left:0,zIndex:100,background:"#fff",borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,.15)",overflow:"hidden",minWidth:120}}>
      {Object.entries(STATUS_STYLES).map(([s,ss])=>(
        <div key={s} onClick={()=>{setCurrent(s);onChange(s);setOpen(false);}} style={{padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:600,...ss,borderBottom:"1px solid #f0f0f0"}}>{s}</div>
      ))}
    </div>)}
  </div>);
}

function Card({icon,title,children,compact,darkMode}){const bg=darkMode?"#1e293b":"#fff";const tp=darkMode?"#f1f5f9":"#1a1a2e";const border=darkMode?"#334155":"#eef2f7";return(<div style={{background:bg,borderRadius:12,padding:compact?14:18,marginBottom:10,boxShadow:compact?"none":"0 2px 10px rgba(0,0,0,.06)",border:compact?`1px solid ${border}`:"none"}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}><span style={{fontSize:16}}>{icon}</span><span style={{fontWeight:700,fontSize:13,color:tp}}>{title}</span></div>{children}</div>);}
function Grid2({children}){return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 20px"}}>{children}</div>);}
function Field({label,value,darkMode}){const tp=darkMode?"#f1f5f9":"#2d3748";return(<div><div style={{fontSize:10,fontWeight:700,color:darkMode?"#64748b":"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:1}}>{label}</div><div style={{fontSize:13,color:tp,fontWeight:500}}>{value||"—"}</div></div>);}
function Bullet({text,color}){return(<div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",borderBottom:"1px solid #f7fafc"}}><span style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0,marginTop:4}}/><span style={{fontSize:13,color:"#2d3748",lineHeight:1.5}}>{text}</span></div>);}
function Empty(){return(<div style={{color:"#bbb",fontSize:12,fontStyle:"italic"}}>Nothing captured for this section.</div>);}
function TableWrap({heads,children,darkMode}){const bg=darkMode?"#0f172a":"#f7fafc";const border=darkMode?"#334155":"#e2e8f0";return(<table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:bg}}>{heads.map(h=>(<th key={h} style={{padding:"7px 10px",textAlign:"left",fontWeight:600,color:darkMode?"#94a3b8":"#555",borderBottom:`2px solid ${border}`}}>{h}</th>))}</tr></thead><tbody>{children}</tbody></table>);}
