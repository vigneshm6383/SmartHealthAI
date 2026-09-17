import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertCircle, BarChart3, Bell, Bot, BrainCircuit, CheckCircle2,
  ChevronRight, CircleHelp, Droplets, Footprints, Gauge, HeartPulse, History,
  Home, Moon, MoreHorizontal, Navigation, RefreshCw, Settings, ShieldCheck,
  Sparkles, Stethoscope, Thermometer, User, UserRoundSearch, Watch, Zap,
  Flame, Ruler, MessageCircle, Send, X, Menu, LogOut
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, LineChart, Line
} from "recharts";
import "./styles.css";

const navItems = [
  ["dashboard","Dashboard",Home],
  ["watch","Smartwatch",Watch],
  ["analysis","AI Analysis",BrainCircuit],
  ["person","Person Check",UserRoundSearch],
  ["bmi","BMI Calculator",Gauge],
  ["history","Health History",History],
  ["assistant","AI Assistant",Bot],
  ["profile","Profile",User],
];

const heartData = [
  {d:"Mon", bpm:72, spo2:98}, {d:"Tue", bpm:76, spo2:97}, {d:"Wed", bpm:70, spo2:99},
  {d:"Thu", bpm:78, spo2:98}, {d:"Fri", bpm:74, spo2:97}, {d:"Sat", bpm:69, spo2:99}, {d:"Sun", bpm:73, spo2:98}
];

function App(){
  const [page,setPage] = useState("dashboard");
  const [userName,setUserName] = useState(()=>localStorage.getItem("smarthealth_name") || "Vignesh");
  const [menu,setMenu] = useState(false);
  const [heart,setHeart] = useState(74);
  const [spo2,setSpo2] = useState(98);
  const [steps,setSteps] = useState(6842);
  const [sleep,setSleep] = useState(7.4);
  const [chatOpen,setChatOpen] = useState(false);
  const [messages,setMessages] = useState([
    {role:"ai",text:"Hi! I’m your SmartHealth AI assistant. I can explain your demo health metrics and wellness trends."}
  ]);
  const [input,setInput] = useState("");

  useEffect(()=>{
    const onNameChange=e=>setUserName(e.detail || "Vignesh");
    window.addEventListener("smarthealth-name-changed",onNameChange);
    return ()=>window.removeEventListener("smarthealth-name-changed",onNameChange);
  },[]);

  useEffect(()=>{
    const t=setInterval(()=>{
      setHeart(v=>Math.max(65,Math.min(92,v + Math.round((Math.random()-.5)*4))));
      setSpo2(v=>Math.max(96,Math.min(99,v + (Math.random()>.75?1:Math.random()<.2?-1:0))));
    },2200);
    return ()=>clearInterval(t);
  },[]);

  const calories = Math.round(steps * .045);
  const distance = (steps * .00072).toFixed(2);

  const navigate = p => {setPage(p); setMenu(false); window.scrollTo({top:0,behavior:"smooth"});};

  function sendChat(){
    const q=input.trim(); if(!q)return;
    setMessages(m=>[...m,{role:"user",text:q},{role:"ai",text:reply(q,heart,spo2,steps,sleep)}]);
    setInput("");
  }

  return <div className="app">
    <aside className={`sidebar ${menu?"open":""}`}>
      <div className="brand" onClick={()=>navigate("dashboard")}>
        <div className="brand-mark"><HeartPulse size={22}/></div>
        <div><b>SmartHealth</b><span>AI</span></div>
      </div>
      <div className="nav-label">MAIN MENU</div>
      <nav>{navItems.map(([id,label,Icon])=>
        <button key={id} className={page===id?"active":""} onClick={()=>navigate(id)}>
          <Icon size={19}/><span>{label}</span>{page===id&&<ChevronRight className="nav-arrow" size={15}/>}
        </button>
      )}</nav>
      <div className="side-card">
        <Sparkles size={20}/>
        <b>Edge AI Ready</b>
        <p>Designed for future on-device health analysis.</p>
        <small>LOCAL DEMO MODE</small>
      </div>
      <button className="side-bottom" onClick={()=>navigate("profile")}><Settings size={18}/> Settings</button>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={()=>setMenu(v=>!v)}><Menu/></button>
        <div>
          <div className="eyebrow">SMART HEALTH PLATFORM</div>
          <h1>{page==="dashboard" ? `Good evening, ${userName} 👋` : title(page)}</h1>
        </div>
        <div className="top-actions">
          <button className="icon-btn"><Bell size={19}/><i/></button>
          <div className="user-chip" onClick={()=>navigate("profile")}>
            <div className="avatar">{(userName.trim()[0] || "U").toUpperCase()}</div><div><b>{userName}</b><span>Healthy user</span></div>
          </div>
        </div>
      </header>

      <div className="content">
        {page==="dashboard" && <Dashboard {...{heart,spo2,steps,setSteps,sleep,calories,distance,navigate}}/>}
        {page==="watch" && <WatchPage {...{heart,spo2,steps,calories,distance,sleep,setHeart,setSpo2}}/>}
        {page==="analysis" && <Analysis heart={heart} spo2={spo2} steps={steps} sleep={sleep}/>}
        {page==="person" && <PersonCheck/>}
        {page==="bmi" && <BMI/>}
        {page==="history" && <HistoryPage/>}
        {page==="assistant" && <Assistant messages={messages} input={input} setInput={setInput} sendChat={sendChat}/>}
        {page==="profile" && <Profile/>}
      </div>
    </main>

    <button className="floating-ai" onClick={()=>setChatOpen(true)}><Bot size={22}/><span>Ask AI</span></button>
    {chatOpen && <QuickChat {...{heart,spo2,steps,sleep,messages,input,setInput,sendChat,setChatOpen}}/>}
  </div>
}

function title(p){ return ({dashboard:"Dashboard",watch:"Virtual Smartwatch",analysis:"AI Health Analysis",person:"Another Person Check",bmi:"BMI Calculator",history:"Health History",assistant:"AI Health Assistant",profile:"Profile & Settings"})[p]; }

function Dashboard({heart,spo2,steps,setSteps,sleep,calories,distance,navigate}){
  return <>
    <section className="hero">
      <div>
        <div className="status-pill"><span className="pulse-dot"/> Demo sensors active</div>
        <h2>Your health, <em>understood.</em></h2>
        <p>Monitor simulated wellness signals, discover trends and explore how an AI-powered health companion could work.</p>
        <button className="primary" onClick={()=>navigate("analysis")}>Run AI Health Check <ChevronRight size={17}/></button>
      </div>
      <div className="hero-orb"><div className="orb-ring"><HeartPulse size={58}/><span>74</span><small>BPM</small></div></div>
    </section>

    <div className="section-head"><div><h3>Today’s overview</h3><p>Live simulated wearable metrics</p></div><button className="soft-btn" onClick={()=>setSteps(s=>s+120)}><RefreshCw size={15}/> Refresh data</button></div>
    <div className="metric-grid">
      <Metric icon={HeartPulse} label="Heart Rate" value={heart} unit="BPM" note="Normal range" tone="red" live/>
      <Metric icon={Droplets} label="Blood Oxygen" value={spo2} unit="%" note="Excellent" tone="blue"/>
      <Metric icon={Footprints} label="Steps" value={steps.toLocaleString()} unit="steps" note="68% of daily goal" tone="violet"/>
      <Metric icon={Flame} label="Calories" value={calories} unit="kcal" note="Active calories" tone="orange"/>
      <Metric icon={Navigation} label="Distance" value={distance} unit="km" note="Walking distance" tone="green"/>
      <Metric icon={Moon} label="Sleep" value={sleep} unit="hrs" note="Good recovery" tone="indigo"/>
    </div>

    <div className="two-col">
      <Card title="Heart rate & SpO₂" subtitle="7-day wellness trend" action="View history" onAction={()=>navigate("history")}>
        <div className="chart-legend"><span><i className="legend-red"/> Heart rate</span><span><i className="legend-blue"/> SpO₂</span></div>
        <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={heartData}>
          <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopOpacity=".25"/><stop offset="100%" stopOpacity="0"/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f5"/><XAxis dataKey="d" axisLine={false} tickLine={false}/><YAxis domain={[60,105]} axisLine={false} tickLine={false}/>
          <Tooltip/><Area type="monotone" dataKey="bpm" stroke="#e85b69" fill="url(#g1)" strokeWidth={3}/><Area type="monotone" dataKey="spo2" stroke="#4c8df6" fill="none" strokeWidth={2}/>
        </AreaChart></ResponsiveContainer></div>
      </Card>
      <Card title="AI wellness summary" subtitle="Local demo inference" action="Full analysis" onAction={()=>navigate("analysis")}>
        <div className="ai-summary">
          <div className="summary-icon"><ShieldCheck size={27}/></div>
          <div><b>Overall status: Stable</b><p>Your demo metrics are within the configured wellness reference ranges. Keep moving and maintain consistent sleep.</p></div>
        </div>
        <div className="insight-list"><Insight icon={CheckCircle2} text="Heart rate is in a normal resting range."/><Insight icon={CheckCircle2} text="SpO₂ reading looks healthy in this simulation."/><Insight icon={Zap} text="You’re 3,158 steps away from the daily goal."/></div>
      </Card>
    </div>

    <section className="feature-strip">
      <div><div className="mini-icon"><Watch/></div><div><b>Virtual Smartwatch</b><p>Try a realistic wearable dashboard without hardware.</p></div><button onClick={()=>navigate("watch")}><ChevronRight/></button></div>
      <div><div className="mini-icon ai"><BrainCircuit/></div><div><b>Edge AI concept</b><p>Analysis architecture designed to support local inference later.</p></div><button onClick={()=>navigate("analysis")}><ChevronRight/></button></div>
      <div><div className="mini-icon person"><UserRoundSearch/></div><div><b>Check another person</b><p>Run a separate demo wellness assessment.</p></div><button onClick={()=>navigate("person")}><ChevronRight/></button></div>
    </section>
  </>
}

function Metric({icon:Icon,label,value,unit,note,tone,live}){return <div className="metric card">
  <div className={`metric-icon ${tone}`}><Icon size={20}/>{live&&<i className="tiny-live"/>}</div><div className="metric-body"><span>{label}</span><strong>{value} <small>{unit}</small></strong><em>{note}</em></div>
</div>}

function Card({title,subtitle,action,onAction,children}){return <section className="card panel"><div className="panel-head"><div><h3>{title}</h3><p>{subtitle}</p></div>{action&&<button onClick={onAction}>{action} <ChevronRight size={15}/></button>}</div>{children}</section>}
function Insight({icon:Icon,text}){return <div className="insight"><Icon size={16}/><span>{text}</span></div>}

function WatchPage({heart,spo2,steps,calories,distance,sleep,setHeart,setSpo2}){
 return <>
  <div className="page-intro"><div><h2>Virtual Smartwatch</h2><p>A hardware-free simulation for your college project demo. Values update automatically.</p></div><div className="status-pill"><span className="pulse-dot"/> Simulation running</div></div>
  <div className="watch-layout">
    <div className="watch-stage card">
      <div className="watch-device"><div className="watch-screen">
        <div className="watch-time">{new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</div>
        <div className="watch-heart"><HeartPulse size={30}/><strong>{heart}</strong><span>BPM</span></div>
        <div className="watch-mini"><span>SpO₂ <b>{spo2}%</b></span><span>Steps <b>{steps.toLocaleString()}</b></span></div>
        <div className="watch-date">SMARTHEALTH AI • DEMO</div>
      </div></div>
      <div className="watch-controls"><button onClick={()=>setHeart(60+Math.floor(Math.random()*35))}><RefreshCw size={16}/> Simulate heart rate</button><button onClick={()=>setSpo2(96+Math.floor(Math.random()*4))}><Droplets size={16}/> Simulate SpO₂</button></div>
    </div>
    <div className="watch-info">
      <Card title="Wearable data stream" subtitle="Simulated sensor layer"><div className="stream">
        <Stream label="PPG / Heart sensor" value={`${heart} BPM`} ok/><Stream label="Pulse oximeter" value={`${spo2}%`} ok/><Stream label="Accelerometer" value={`${steps.toLocaleString()} steps`} ok/><Stream label="Sleep sensor" value={`${sleep} hrs`} ok/>
      </div></Card>
      <Card title="Future Bluetooth architecture" subtitle="Ready for a real device integration"><div className="architecture">
        <Arch icon={Watch} text="BLE Smartwatch"/><span>→</span><Arch icon={Activity} text="Sensor Service"/><span>→</span><Arch icon={BrainCircuit} text="Edge AI"/><span>→</span><Arch icon={ShieldCheck} text="Dashboard"/>
      </div></Card>
    </div>
  </div>
 </>
}
function Stream({label,value,ok}){return <div className="stream-row"><div><span className="green-dot"/><b>{label}</b></div><strong>{value}</strong>{ok&&<CheckCircle2 size={16}/>}</div>}
function Arch({icon:Icon,text}){return <div className="arch"><Icon size={18}/><span>{text}</span></div>}

function Analysis({heart,spo2,steps,sleep}){
 const score=Math.round(Math.min(98,72+(spo2-96)*3+(steps>6000?7:2)+(sleep>=7?8:2)));
 return <>
  <div className="page-intro"><div><h2>AI Health Analysis</h2><p>Explainable demo analysis using local rules. Not a medical diagnosis.</p></div><div className="ai-badge"><BrainCircuit size={17}/> Edge AI concept</div></div>
  <div className="analysis-top">
    <div className="score-card card"><div className="score-ring"><strong>{score}</strong><span>/100</span></div><div><h3>Wellness score</h3><p>Based on your simulated daily signals.</p><div className="score-bar"><i style={{width:`${score}%`}}/></div></div></div>
    <div className="card recommendation"><div className="summary-icon"><Sparkles/></div><div><b>AI recommendation</b><p>Keep your activity consistent, target 7–9 hours of sleep, and continue monitoring trends rather than single readings.</p></div></div>
  </div>
  <div className="analysis-grid">
    <Card title="Signal interpretation" subtitle="Transparent rule-based demo">
      <AnalysisRow icon={HeartPulse} label="Heart rate" value={`${heart} BPM`} status={heart<60||heart>100?"Review":"Normal"} text={heart<60||heart>100?"Outside the configured demo range.":"Within the configured resting wellness range."}/>
      <AnalysisRow icon={Droplets} label="SpO₂" value={`${spo2}%`} status={spo2<95?"Review":"Good"} text={spo2<95?"Below the demo threshold.":"Within the configured healthy demo range."}/>
      <AnalysisRow icon={Footprints} label="Activity" value={`${steps.toLocaleString()} steps`} status={steps>=6000?"Good":"Low"} text={steps>=6000?"Solid activity level for this simulation.":"Consider more light movement throughout the day."}/>
      <AnalysisRow icon={Moon} label="Sleep" value={`${sleep} hrs`} status={sleep>=7?"Good":"Low"} text={sleep>=7?"Sleep duration meets the demo target.":"Try to move toward a consistent 7–9 hour routine."}/>
    </Card>
    <Card title="How Edge AI could work" subtitle="Future architecture"><div className="edge-steps">
      <div><span>01</span><b>Sensor preprocessing</b><p>Clean and normalize wearable signals on-device.</p></div>
      <div><span>02</span><b>Local inference</b><p>Run a lightweight wellness model without sending raw signals away.</p></div>
      <div><span>03</span><b>Explainable output</b><p>Convert model signals into understandable trends and alerts.</p></div>
      <div><span>04</span><b>Cloud optional</b><p>Sync summaries only when the future app needs backup or remote access.</p></div>
    </div></Card>
  </div>
 </>
}
function AnalysisRow({icon:Icon,label,value,status,text}){return <div className="analysis-row"><div className="analysis-icon"><Icon/></div><div className="analysis-copy"><b>{label}</b><span>{text}</span></div><strong>{value}</strong><em className={status==="Normal"||status==="Good"?"good":"warn"}>{status}</em></div>}

function PersonCheck(){
 const [name,setName]=useState(""); const [age,setAge]=useState(""); const [hr,setHr]=useState(""); const [ox,setOx]=useState(""); const [result,setResult]=useState(null);
 function check(){if(!name||!age||!hr||!ox)return; const h=+hr,o=+ox; setResult({status:(h>=60&&h<=100&&o>=95)?"Stable":"Needs review",text:(h>=60&&h<=100&&o>=95)?"The entered demo readings fall within the configured wellness ranges.":"One or more readings are outside the configured demo ranges. Consider professional evaluation for real symptoms."})}
 return <div className="form-page">
  <div className="page-intro"><div><h2>Another Person Health Check</h2><p>Enter demo readings for a family member, friend, or test user.</p></div></div>
  <div className="form-grid">
   <section className="card form-card"><div className="form-title"><div className="mini-icon person"><UserRoundSearch/></div><div><h3>Person details</h3><p>For demonstration purposes only</p></div></div>
    <Field label="Name" value={name} onChange={setName} placeholder="Enter name"/><div className="two-fields"><Field label="Age" value={age} onChange={setAge} placeholder="e.g. 24" type="number"/><Field label="Heart rate (BPM)" value={hr} onChange={setHr} placeholder="e.g. 72" type="number"/></div><Field label="SpO₂ (%)" value={ox} onChange={setOx} placeholder="e.g. 98" type="number"/>
    <button className="primary wide" onClick={check}>Analyze person <BrainCircuit size={17}/></button>
   </section>
   <section className="card result-card">{result?<><div className={`result-icon ${result.status==="Stable"?"good-bg":"warn-bg"}`}>{result.status==="Stable"?<CheckCircle2/>:<AlertCircle/>}</div><h3>{result.status}</h3><p>{result.text}</p><div className="disclaimer"><CircleHelp size={16}/> Demo wellness screening only — not a medical diagnosis.</div></>:<div className="empty-result"><Stethoscope size={40}/><h3>Waiting for readings</h3><p>Fill in the form to generate an explainable demo health check.</p></div>}</section>
  </div>
 </div>
}
function Field({label,value,onChange,placeholder,type="text"}){return <label className="field"><span>{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>}

function BMI(){
 const [h,setH]=useState("170"),[w,setW]=useState("68"),[result,setResult]=useState(null);
 function calc(){const bmi=+(+w/((+h/100)**2)).toFixed(1); let cat=bmi<18.5?"Underweight":bmi<25?"Healthy range":bmi<30?"Overweight":"Obesity";setResult({bmi,cat})}
 return <div className="form-page"><div className="page-intro"><div><h2>BMI Calculator</h2><p>A simple educational calculator using height and weight.</p></div></div>
  <div className="bmi-layout"><section className="card form-card"><div className="form-title"><div className="mini-icon violet"><Ruler/></div><div><h3>Your measurements</h3><p>Metric units</p></div></div><Field label="Height (cm)" value={h} onChange={setH} type="number"/><Field label="Weight (kg)" value={w} onChange={setW} type="number"/><button className="primary wide" onClick={calc}>Calculate BMI <Gauge size={17}/></button></section>
  <section className="card bmi-result">{result?<><div className="bmi-number">{result.bmi}</div><b>{result.cat}</b><p>BMI is a screening measure and should be interpreted in context.</p><div className="bmi-scale"><span>Underweight</span><span>Healthy</span><span>Overweight</span><span>Obesity</span></div></>:<div className="empty-result"><Gauge size={42}/><h3>Your BMI will appear here</h3><p>Enter your measurements and calculate.</p></div>}</section></div>
 </div>
}

function HistoryPage(){
 return <><div className="history-summary"><Metric icon={HeartPulse} label="Avg Heart Rate" value="73" unit="BPM" note="7-day average" tone="red"/><Metric icon={Droplets} label="Avg SpO₂" value="98" unit="%" note="7-day average" tone="blue"/><Metric icon={Footprints} label="Avg Steps" value="6.4k" unit="steps" note="7-day average" tone="violet"/></div>
 <div className="two-col"><Card title="Activity trend" subtitle="Daily steps"><div className="chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={heartData.map((x,i)=>({...x,steps:[5200,7100,6400,8200,5900,7600,6842][i]}))}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f5"/><XAxis dataKey="d" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="steps" radius={[7,7,0,0]} fill="#8069ee"/></BarChart></ResponsiveContainer></div></Card>
 <Card title="Heart rate trend" subtitle="Resting simulation"><div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={heartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f5"/><XAxis dataKey="d" axisLine={false} tickLine={false}/><YAxis domain={[60,90]} axisLine={false} tickLine={false}/><Tooltip/><Line type="monotone" dataKey="bpm" stroke="#e85b69" strokeWidth={3} dot={{r:4}}/></LineChart></ResponsiveContainer></div></Card></div>
 <Card title="Recent health history" subtitle="Demo records"><div className="history-table"><div className="table-head"><span>Date</span><span>Heart rate</span><span>SpO₂</span><span>Steps</span><span>Status</span></div>{["Today","Yesterday","Sep 15","Sep 14","Sep 13"].map((d,i)=><div className="table-row" key={d}><span>{d}</span><span>{[74,71,76,73,70][i]} BPM</span><span>{[98,99,97,98,99][i]}%</span><span>{[6842,7210,6320,8010,5900][i].toLocaleString()}</span><em className="good">Stable</em></div>)}</div></Card>
 </>
}

function Assistant({messages,input,setInput,sendChat}){
 return <div className="assistant-page"><section className="card assistant-shell"><div className="assistant-head"><div className="ai-avatar"><Bot/></div><div><h3>SmartHealth AI Assistant</h3><p>Local demo assistant • wellness education</p></div><span className="online"><i/> Online</span></div>
 <div className="messages">{messages.map((m,i)=><div className={`msg ${m.role}`} key={i}><div className="msg-icon">{m.role==="ai"?<Bot size={16}/>:<User size={16}/>}</div><div>{m.text}</div></div>)}</div>
 <div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ask about your demo health metrics..."/><button onClick={sendChat}><Send size={18}/></button></div>
 </section><div className="assistant-tips"><b>Try asking</b><button onClick={()=>setInput("What does my heart rate mean?")}>What does my heart rate mean?</button><button onClick={()=>setInput("How can I improve sleep?")}>How can I improve sleep?</button><button onClick={()=>setInput("Explain Edge AI")}>Explain Edge AI</button></div></div>
}
function reply(q,heart,spo2,steps,sleep){
 q=q.toLowerCase();
 if(q.includes("heart"))return `Your simulated heart rate is ${heart} BPM. In this demo it is inside the configured resting wellness range. A real health app should interpret heart rate with age, activity, symptoms and clinical context.`;
 if(q.includes("sleep"))return `Your demo sleep value is ${sleep} hours. A consistent 7–9 hour routine is a useful general wellness target for many adults.`;
 if(q.includes("edge"))return "Edge AI means performing selected AI inference locally on the device. A future SmartHealth build could preprocess wearable signals, run a lightweight model, and send only useful summaries.";
 if(q.includes("step"))return `You have ${steps.toLocaleString()} simulated steps today. Your demo dashboard uses 10,000 as a reference goal.`;
 if(q.includes("spo")||q.includes("oxygen"))return `Your simulated SpO₂ is ${spo2}%. It is in the healthy demo range. Real oxygen readings can be affected by device quality and many other factors.`;
 return "I can explain heart rate, SpO₂, steps, sleep, BMI, health history and the Edge AI architecture. Ask me about one of these.";
}

function Profile(){
 const [name,setName]=useState(()=>localStorage.getItem("smarthealth_name") || "Vignesh");
 const [saved,setSaved]=useState(false);
 function saveName(){
   const clean=name.trim();
   if(!clean)return;
   localStorage.setItem("smarthealth_name",clean);
   window.dispatchEvent(new CustomEvent("smarthealth-name-changed",{detail:clean}));
   setSaved(true);
   setTimeout(()=>setSaved(false),1800);
 }
 return <div className="profile-grid"><section className="card profile-card">
   <div className="profile-large">{(name.trim()[0] || "U").toUpperCase()}</div>
   <h2>{name || "Your Name"}</h2><p>SmartHealth AI demo user</p>
   <span className="status-pill"><span className="pulse-dot"/> Profile active</span>
   <div className="profile-info"><div><span>Age</span><b>24</b></div><div><span>Height</span><b>170 cm</b></div><div><span>Weight</span><b>68 kg</b></div></div>
 </section>
 <section className="card settings-card"><div className="panel-head"><div><h3>Profile & Settings</h3><p>Change the name shown across the dashboard</p></div></div>
   <label className="field"><span>DISPLAY NAME</span><input value={name} onChange={e=>{setName(e.target.value);setSaved(false)}} onKeyDown={e=>e.key==="Enter"&&saveName()} placeholder="Enter your name"/></label>
   <button className="primary wide" onClick={saveName}>{saved?<><CheckCircle2 size={17}/> Name saved</>:<>Save profile name <User size={17}/></>}</button>
   <div className="settings-divider"></div>
   <Setting icon={Bell} title="Health notifications" text="Receive simulated trend alerts" on/>
   <Setting icon={ShieldCheck} title="Local analysis" text="Prefer demo analysis on this device" on/>
   <Setting icon={Watch} title="Bluetooth device" text="Future wearable connection" />
   <Setting icon={Activity} title="Demo data stream" text="Automatically update simulated readings" on/>
 </section></div>
}

function Setting({icon:Icon,title,text,on}){return <div className="setting"><div className="setting-icon"><Icon size={18}/></div><div><b>{title}</b><span>{text}</span></div><div className={`toggle ${on?"on":""}`}><i/></div></div>}

function QuickChat({heart,spo2,steps,sleep,messages,input,setInput,sendChat,setChatOpen}){
 return <div className="quick-chat"><div className="qc-head"><div><Bot size={18}/><b>SmartHealth AI</b></div><button onClick={()=>setChatOpen(false)}><X size={18}/></button></div><div className="qc-body">{messages.slice(-4).map((m,i)=><div className={`qc-msg ${m.role}`} key={i}>{m.text}</div>)}</div><div className="qc-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ask AI..."/><button onClick={sendChat}><Send size={16}/></button></div></div>
}

createRoot(document.getElementById("root")).render(<App/>);
