import { useState, useEffect, useRef } from "react";

const GENRES = ["Pop","Hip-Hop","Rock","R&B","Électro","Jazz","Classique","Reggaeton","K-Pop","Metal","Soul","Variété FR"];
const DECADES = ["60s","70s","80s","90s","2000s","2010s","2020s"];
const MOCK_PLAYERS = [
  { id:1, name:"Orel",    score:0, color:"#ff6b6b", host:true  },
  { id:2, name:"Camille", score:0, color:"#ffd93d", host:false },
  { id:3, name:"Thomas",  score:0, color:"#6bcb77", host:false },
  { id:4, name:"Léa",     score:0, color:"#4d96ff", host:false },
];
const MOCK_ROUNDS = [
  { title:"Lose Yourself",     artist:"Eminem",              year:2002, genre:"Hip-Hop", emoji:"🎤" },
  { title:"Blinding Lights",   artist:"The Weeknd",          year:2019, genre:"Pop",     emoji:"🎹" },
  { title:"HUMBLE.",           artist:"Kendrick Lamar",      year:2017, genre:"Hip-Hop", emoji:"🎤" },
  { title:"Shape of You",      artist:"Ed Sheeran",          year:2017, genre:"Pop",     emoji:"🎸" },
  { title:"Bad Guy",           artist:"Billie Eilish",       year:2019, genre:"Pop",     emoji:"🎵" },
  { title:"God's Plan",        artist:"Drake",               year:2018, genre:"Hip-Hop", emoji:"🎤" },
  { title:"Bohemian Rhapsody", artist:"Queen",               year:1975, genre:"Rock",    emoji:"🎸" },
  { title:"One Dance",         artist:"Drake",               year:2016, genre:"R&B",     emoji:"🎵" },
  { title:"Savage",            artist:"Megan Thee Stallion", year:2020, genre:"Hip-Hop", emoji:"🎤" },
  { title:"Levitating",        artist:"Dua Lipa",            year:2020, genre:"Pop",     emoji:"🎹" },
];

function scoreAnswer(answer, round) {
  const a  = answer.toLowerCase().replace(/[^a-z0-9 ]/g,"");
  const t  = round.title.toLowerCase().replace(/[^a-z0-9 ]/g,"");
  const ar = round.artist.toLowerCase().replace(/[^a-z0-9 ]/g,"");
  const hasTitle  = a.includes(t.split(" ")[0])  || t.includes(a.split(" ")[0]);
  const hasArtist = a.includes(ar.split(" ")[0]) || ar.split(" ").some(w=>a.includes(w));
  if (hasTitle && hasArtist) return 100;
  if (hasTitle || hasArtist) return 50;
  return 0;
}

/* ── GLOBAL CSS ── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    @keyframes waveBar { 0%,100%{transform:scaleY(1)}50%{transform:scaleY(2.8)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
    @keyframes pop { 0%{transform:scale(0.8)}65%{transform:scale(1.08)}100%{transform:scale(1)} }
    @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.3} }
    @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
    * { box-sizing:border-box; margin:0; padding:0; }
    body { background:#1a1a2e; font-family:'Nunito',sans-serif; }
    ::placeholder { color:#ffffff44; }
    input:focus { outline:none; }
    button:focus { outline:none; }
    .fu  { animation:fadeUp .4s ease both; }
    .fu1 { animation:fadeUp .4s .08s ease both; opacity:0; }
    .fu2 { animation:fadeUp .4s .16s ease both; opacity:0; }
    .fu3 { animation:fadeUp .4s .24s ease both; opacity:0; }
    .pop { animation:pop .35s ease both; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-thumb { background:#ffffff22; border-radius:2px; }
  `}</style>
);

/* ── TOKENS ── */
const BG    = "#1a1a2e";
const CARD  = "#16213e";
const CARD2 = "#0f3460";
const ACC   = "#e94560";
const YEL   = "#ffd93d";
const GRN   = "#6bcb77";
const BLU   = "#4d96ff";
const txt   = "#ffffff";
const txt2  = "#ffffffaa";
const txt3  = "#ffffff55";

/* ── SHARED ── */
const Av = ({name,color,size=38})=>(
  <div style={{width:size,height:size,borderRadius:"50%",background:color,border:`3px solid ${color}44`,
    display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:size*.4,fontWeight:800,color:"#1a1a2e",flexShrink:0,letterSpacing:"-0.5px"}}>
    {name[0].toUpperCase()}
  </div>
);

const Chip = ({label,color=ACC})=>(
  <span style={{display:"inline-block",padding:"4px 12px",borderRadius:100,
    background:color+"33",color,fontSize:12,fontWeight:700,border:`1.5px solid ${color}55`,
    letterSpacing:"0.3px"}}>
    {label}
  </span>
);

const Btn = ({children,onClick,disabled,color=ACC,style={}})=>(
  <button onClick={onClick} disabled={disabled} style={{
    background: disabled ? "#ffffff22" : color,
    color: disabled ? "#ffffff55" : "#1a1a2e",
    border:"none",borderRadius:14,padding:"13px 28px",
    fontSize:15,fontWeight:800,cursor:disabled?"not-allowed":"pointer",
    fontFamily:"'Nunito',sans-serif",letterSpacing:"0.3px",
    boxShadow: disabled ? "none" : `0 4px 0 ${color}88`,
    transform:"translateY(0)",transition:"all .1s",
    ...style
  }}
  onMouseDown={e=>{if(!disabled)e.currentTarget.style.transform="translateY(3px)";if(!disabled)e.currentTarget.style.boxShadow="none"}}
  onMouseUp={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=disabled?"none":`0 4px 0 ${color}88`}}
  >
    {children}
  </button>
);

const GBtn = ({children,onClick,style={}})=>(
  <button onClick={onClick} style={{
    background:"transparent",color:txt2,border:"2px solid #ffffff22",
    borderRadius:14,padding:"12px 24px",fontSize:15,fontWeight:700,
    cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all .15s",
    ...style
  }}>
    {children}
  </button>
);

const Panel = ({children,style={}})=>(
  <div style={{background:CARD,borderRadius:20,padding:"1.2rem 1.4rem",
    border:"2px solid #ffffff0f",...style}}>
    {children}
  </div>
);

const SLabel = ({children})=>(
  <div style={{fontSize:11,fontWeight:800,color:txt3,letterSpacing:"0.12em",
    textTransform:"uppercase",marginBottom:10}}>
    {children}
  </div>
);

/* waveform */
const Wave = ({active})=>(
  <div style={{display:"flex",alignItems:"center",gap:4,height:48}}>
    {Array.from({length:20}).map((_,i)=>(
      <div key={i} style={{
        width:5,borderRadius:3,
        background:active?`hsl(${340+i*4},90%,65%)`:"#ffffff22",
        height:active?`${16+Math.sin(i*.9+1)*14}px`:"5px",
        animation:active?`waveBar ${.45+(i%5)*.13}s ${i*.05}s ease-in-out infinite`:"none",
        transition:"height .3s ease"
      }}/>
    ))}
  </div>
);

/* timer */
const Ring = ({seconds,total})=>{
  const r=32,circ=2*Math.PI*r,frac=seconds/total,hue=Math.round(frac*120);
  return (
    <div style={{position:"relative",width:76,height:76}}>
      <svg width={76} height={76} style={{transform:"rotate(-90deg)"}}>
        <circle cx={38} cy={38} r={r} fill="none" stroke="#ffffff15" strokeWidth={7}/>
        <circle cx={38} cy={38} r={r} fill="none"
          stroke={`hsl(${hue},90%,60%)`} strokeWidth={7}
          strokeDasharray={circ} strokeDashoffset={circ-frac*circ}
          strokeLinecap="round"
          style={{transition:"stroke-dashoffset 1s linear,stroke 1s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
        justifyContent:"center",fontWeight:900,fontSize:22,
        color:seconds<=5?"#ff6b6b":txt,fontFamily:"'Nunito',sans-serif"}}>
        {seconds}
      </div>
    </div>
  );
};

/* steps */
const Steps = ({current,total})=>(
  <div style={{display:"flex",gap:5}}>
    {Array.from({length:total}).map((_,i)=>(
      <div key={i} style={{
        height:5,flex:1,borderRadius:3,
        background:i<current?ACC:i===current?ACC+"88":"#ffffff15",
        transition:"background .3s"
      }}/>
    ))}
  </div>
);

/* player row */
const PRow = ({player,rank,showScore=true,delta=0})=>(
  <div style={{display:"flex",alignItems:"center",gap:12,
    padding:"10px 0",borderBottom:"1.5px solid #ffffff08"}}>
    {rank!=null&&(
      <div style={{width:28,textAlign:"center",fontSize:14,flexShrink:0}}>
        {rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":`${rank}`}
      </div>
    )}
    <Av name={player.name} color={player.color}/>
    <div style={{flex:1}}>
      <div style={{fontSize:14,fontWeight:700,color:txt,display:"flex",alignItems:"center",gap:6}}>
        {player.name}
        {player.host&&<Chip label="host" color={YEL}/>}
      </div>
    </div>
    {showScore&&(
      <div style={{textAlign:"right"}}>
        <div style={{fontWeight:800,fontSize:15,color:txt}}>{player.score} pts</div>
        {delta>0&&<div style={{fontSize:12,color:GRN,fontWeight:700}}>+{delta}</div>}
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════════════
   HOME
══════════════════════════════════════════════ */
const Home = ({onCreate,onJoin})=>{
  const [code,setCode]=useState("");
  return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px",position:"relative",overflow:"hidden"}}>
      <G/>
      {/* background blobs */}
      {[["-10%","10%",ACC],["70%","60%",BLU],["30%","80%",YEL]].map(([x,y,c],i)=>(
        <div key={i} style={{position:"absolute",left:x,top:y,width:300,height:300,borderRadius:"50%",
          background:c,filter:"blur(80px)",opacity:.12,pointerEvents:"none"}}/>
      ))}

      <div style={{maxWidth:440,width:"100%",position:"relative",zIndex:1}}>
        {/* logo */}
        <div className="fu" style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{width:52,height:52,borderRadius:16,background:ACC,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,
              boxShadow:`0 6px 0 ${ACC}66`,animation:"float 3s ease-in-out infinite"}}>
              🎵
            </div>
            <span style={{fontSize:30,fontWeight:900,color:txt,letterSpacing:"-1px"}}>
              blind<span style={{color:ACC}}>drop</span>
            </span>
          </div>
          <h1 style={{fontSize:36,fontWeight:900,color:txt,lineHeight:1.1,marginBottom:10,letterSpacing:"-1px"}}>
            Le blindtest<br/>
            <span style={{color:YEL}}>entre potes.</span>
          </h1>
          <p style={{color:txt2,fontSize:15,lineHeight:1.6}}>
            Un host lance la musique — tout le monde joue.<br/>
            Aucun compte requis pour les joueurs !
          </p>
        </div>

        {/* CTA */}
        <div className="fu1" style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
          <Btn onClick={onCreate} color={ACC} style={{fontSize:17,padding:"16px",width:"100%"}}>
            🎮 Créer une partie
          </Btn>
          <div style={{display:"flex",gap:8}}>
            <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())}
              placeholder="Code room — ex: KIWI-42"
              onKeyDown={e=>e.key==="Enter"&&code&&onJoin(code)}
              style={{flex:1,background:CARD,border:"2px solid #ffffff22",borderRadius:12,
                padding:"12px 16px",color:txt,fontSize:14,fontWeight:600,fontFamily:"'Nunito',sans-serif"}}/>
            <Btn onClick={()=>code&&onJoin(code)} disabled={!code} color={BLU} style={{flexShrink:0,padding:"12px 20px"}}>
              →
            </Btn>
          </div>
        </div>

        {/* features */}
        <div className="fu2" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[{icon:"🎸",t:"12 genres"},{icon:"📅",t:"60s–2020s"},{icon:"👥",t:"20 joueurs"}].map(f=>(
            <Panel key={f.t} style={{textAlign:"center",padding:"16px 8px"}}>
              <div style={{fontSize:24,marginBottom:6,animation:"float 3s ease-in-out infinite"}}>{f.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:txt2}}>{f.t}</div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   CREATE
══════════════════════════════════════════════ */
const Create = ({onBack,onCreate})=>{
  const [genres,setGenres]=useState(["Pop","Hip-Hop"]);
  const [decades,setDecades]=useState(["2010s","2020s"]);
  const [rounds,setRounds]=useState(10);
  const [timerSec,setTimerSec]=useState(25);
  const [name,setName]=useState("");
  const toggle=(arr,set,v)=>set(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const ok=genres.length>0&&decades.length>0&&name.trim();

  return (
    <div style={{minHeight:"100vh",background:BG,padding:"32px 20px",fontFamily:"'Nunito',sans-serif"}}>
      <G/>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <div className="fu" style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
          <GBtn onClick={onBack} style={{padding:"8px 16px",fontSize:13}}>← Retour</GBtn>
          <div>
            <h2 style={{fontSize:22,fontWeight:900,color:txt}}>Créer une partie</h2>
            <div style={{fontSize:13,color:txt3,fontWeight:600}}>Configure et invite tes amis</div>
          </div>
        </div>

        {/* pseudo */}
        <Panel className="fu" style={{marginBottom:12}}>
          <SLabel>Ton pseudo</SLabel>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Pseudo du host"
            style={{width:"100%",background:CARD2,border:"2px solid #ffffff15",borderRadius:10,
              padding:"11px 14px",color:txt,fontSize:14,fontWeight:700,fontFamily:"'Nunito',sans-serif"}}/>
        </Panel>

        {/* genres */}
        <Panel className="fu1" style={{marginBottom:12}}>
          <SLabel>Genres musicaux {genres.length>0&&<span style={{color:ACC}}>· {genres.length} choisis</span>}</SLabel>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {GENRES.map(g=>{
              const s=genres.includes(g);
              return <button key={g} onClick={()=>toggle(genres,setGenres,g)} style={{
                padding:"7px 15px",borderRadius:50,fontFamily:"'Nunito',sans-serif",
                border:s?`2px solid ${ACC}`:"2px solid #ffffff18",
                background:s?ACC+"22":"transparent",
                color:s?ACC:txt2,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .15s"
              }}>{g}</button>;
            })}
          </div>
        </Panel>

        {/* decades */}
        <Panel className="fu1" style={{marginBottom:12}}>
          <SLabel>Époques</SLabel>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {DECADES.map(d=>{
              const s=decades.includes(d);
              return <button key={d} onClick={()=>toggle(decades,setDecades,d)} style={{
                padding:"7px 15px",borderRadius:50,fontFamily:"'Nunito',sans-serif",
                border:s?`2px solid ${YEL}`:"2px solid #ffffff18",
                background:s?YEL+"22":"transparent",
                color:s?YEL:txt2,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .15s"
              }}>{d}</button>;
            })}
          </div>
        </Panel>

        {/* settings */}
        <Panel className="fu2" style={{marginBottom:12}}>
          <SLabel>Paramètres</SLabel>
          {[{label:"Manches",val:rounds,set:setRounds,min:5,max:20,color:GRN},
            {label:"Temps / manche",val:`${timerSec}s`,set:setTimerSec,min:10,max:45,color:BLU,raw:timerSec}
          ].map(s=>(
            <div key={s.label} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:700,color:txt2}}>{s.label}</span>
                <span style={{fontSize:13,fontWeight:800,color:s.color}}>{s.val}</span>
              </div>
              <input type="range" min={s.min} max={s.max} value={s.raw||s.val}
                onChange={e=>s.set(+e.target.value)}
                style={{width:"100%",accentColor:s.color}}/>
            </div>
          ))}
        </Panel>

        {/* spotify */}
        <Panel className="fu3" style={{marginBottom:24,borderColor:"#1ed76033"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:"#1ed760",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>♫</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:txt,marginBottom:2}}>Connecter Spotify</div>
              <div style={{fontSize:12,color:txt3,fontWeight:600}}>Seul le host a besoin d'un compte Premium</div>
            </div>
            <button style={{padding:"9px 18px",borderRadius:10,background:"#1ed760",color:"#000",
              fontSize:13,fontWeight:800,border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
              Connecter
            </button>
          </div>
        </Panel>

        <Btn onClick={()=>ok&&onCreate({genres,decades,rounds,timerSec,hostName:name})}
          disabled={!ok} color={ACC} style={{width:"100%",padding:"15px",fontSize:16}}>
          Créer la room →
        </Btn>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   JOIN
══════════════════════════════════════════════ */
const Join = ({code:ic,onBack,onJoin})=>{
  const [name,setName]=useState("");
  const [code,setCode]=useState(ic||"");
  return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 20px"}}>
      <G/>
      <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>
        <div className="fu" style={{marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:12,animation:"float 3s ease-in-out infinite"}}>👋</div>
          <h2 style={{fontSize:26,fontWeight:900,color:txt,marginBottom:6}}>Rejoindre une room</h2>
          <p style={{fontSize:14,color:txt2,fontWeight:600}}>Entre le code et ton pseudo pour jouer</p>
        </div>
        <div className="fu1" style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {[{v:code,set:e=>setCode(e.target.value.toUpperCase()),ph:"Code room — KIWI-42",big:true},
            {v:name,set:e=>setName(e.target.value),ph:"Ton pseudo"}
          ].map((f,i)=>(
            <input key={i} value={f.v} onChange={f.set} placeholder={f.ph}
              style={{width:"100%",background:CARD,border:"2px solid #ffffff22",borderRadius:12,
                padding:"13px 16px",color:txt,fontSize:f.big?18:14,fontWeight:f.big?900:700,
                textAlign:"center",letterSpacing:f.big?"0.1em":"0",fontFamily:"'Nunito',sans-serif"}}/>
          ))}
        </div>
        <div className="fu2" style={{display:"flex",gap:8}}>
          <GBtn onClick={onBack} style={{flex:1}}>Retour</GBtn>
          <Btn onClick={()=>code&&name&&onJoin(code,name)} disabled={!code||!name}
            color={GRN} style={{flex:2}}>Rejoindre 🚀</Btn>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   LOBBY
══════════════════════════════════════════════ */
const Lobby = ({config,players,onStart,onLeave})=>{
  const [copied,setCopied]=useState(false);
  const rc="KIWI-42";
  return (
    <div style={{minHeight:"100vh",background:BG,padding:"32px 20px",fontFamily:"'Nunito',sans-serif"}}>
      <G/>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        {/* room code */}
        <Panel className="fu" style={{textAlign:"center",marginBottom:14,padding:"28px 20px",
          background:`linear-gradient(135deg,${CARD},${CARD2})`}}>
          <SLabel>Code de la room</SLabel>
          <div style={{fontSize:42,fontWeight:900,color:YEL,letterSpacing:"0.15em",marginBottom:12,
            textShadow:`0 4px 0 ${YEL}44`}}>
            {rc}
          </div>
          <button onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)}} style={{
            padding:"8px 20px",borderRadius:50,fontSize:13,fontWeight:700,cursor:"pointer",
            fontFamily:"'Nunito',sans-serif",transition:"all .2s",border:"none",
            background:copied?GRN:CARD2,color:copied?"#1a1a2e":txt2
          }}>{copied?"✓ Copié !":"📋 Copier le code"}</button>
        </Panel>

        {/* config */}
        <Panel className="fu1" style={{marginBottom:14}}>
          <SLabel>Configuration</SLabel>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {config.genres.slice(0,4).map(g=><Chip key={g} label={g} color={ACC}/>)}
            {config.genres.length>4&&<Chip label={`+${config.genres.length-4}`} color={ACC}/>}
            {config.decades.map(d=><Chip key={d} label={d} color={YEL}/>)}
            <Chip label={`${config.rounds} titres`} color={GRN}/>
            <Chip label={`${config.timerSec}s`} color={BLU}/>
          </div>
        </Panel>

        {/* players */}
        <Panel className="fu2" style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <SLabel>Joueurs</SLabel>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:GRN,animation:"pulse 1.5s ease infinite"}}/>
              <span style={{fontSize:12,color:txt3,fontWeight:700}}>{players.length} connectés</span>
            </div>
          </div>
          {players.map(p=><PRow key={p.id} player={p} showScore={false}/>)}
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",color:txt3,fontSize:13,fontWeight:600}}>
            <div style={{width:38,height:38,borderRadius:"50%",border:"2px dashed #ffffff22",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>+</div>
            En attente de joueurs…
          </div>
        </Panel>

        <div style={{display:"flex",gap:10}}>
          <GBtn onClick={onLeave} style={{flex:1}}>Quitter</GBtn>
          <Btn onClick={onStart} color={ACC} style={{flex:2,padding:"14px",fontSize:16}}>
            Lancer ! 🎶
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   GAME
══════════════════════════════════════════════ */
const Game = ({round,roundIndex,totalRounds,players,timerSec,onSubmit,onTimeout})=>{
  const [timer,setTimer]=useState(timerSec);
  const [answer,setAnswer]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const [playing,setPlaying]=useState(true);
  const ref=useRef(null);

  useEffect(()=>{
    setTimer(timerSec);setAnswer("");setSubmitted(false);setPlaying(true);
    ref.current=setInterval(()=>{
      setTimer(t=>{if(t<=1){clearInterval(ref.current);onTimeout();return 0;}return t-1;});
    },1000);
    return()=>clearInterval(ref.current);
  },[round]);

  const submit=()=>{
    if(submitted||!answer.trim())return;
    clearInterval(ref.current);setSubmitted(true);
    setTimeout(()=>onSubmit(answer,timer),500);
  };

  return (
    <div style={{minHeight:"100vh",background:BG,padding:"28px 20px",fontFamily:"'Nunito',sans-serif"}}>
      <G/>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        {/* top bar */}
        <div className="fu" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{background:CARD,borderRadius:14,padding:"10px 16px"}}>
            <div style={{fontSize:10,color:txt3,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase"}}>Manche</div>
            <div style={{fontSize:22,fontWeight:900,color:txt}}>
              {roundIndex+1}<span style={{color:txt3,fontSize:14,fontWeight:700}}> / {totalRounds}</span>
            </div>
          </div>
          <Ring seconds={timer} total={timerSec}/>
          <div style={{background:CARD,borderRadius:14,padding:"10px 16px",textAlign:"right"}}>
            <div style={{fontSize:10,color:txt3,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase"}}>Score</div>
            <div style={{fontSize:22,fontWeight:900,color:YEL}}>{players[0].score}</div>
          </div>
        </div>

        <div className="fu" style={{marginBottom:18}}><Steps current={roundIndex} total={totalRounds}/></div>

        {/* audio */}
        <Panel className="fu1" style={{textAlign:"center",marginBottom:12,padding:"28px",
          background:`linear-gradient(135deg,${CARD},${CARD2})`,borderColor:ACC+"33"}}>
          <div style={{fontSize:11,color:txt3,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>
            En cours de lecture
          </div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
            <Wave active={playing&&!submitted}/>
          </div>
          <button onClick={()=>setPlaying(p=>!p)} style={{
            padding:"8px 20px",borderRadius:50,fontSize:13,fontWeight:700,
            background:"#ffffff15",color:txt2,border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif"
          }}>{playing?"⏸ Pause":"▶ Lecture"}</button>
        </Panel>

        {/* hint */}
        <Panel className="fu1" style={{marginBottom:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:22}}>{round.emoji}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:txt3,fontWeight:800}}>Indice</div>
            <div style={{fontSize:14,fontWeight:700,color:txt}}>{round.genre}</div>
          </div>
          <Chip label={String(round.year)} color={YEL}/>
        </Panel>

        {/* answer */}
        <Panel className="fu2" style={{marginBottom:12}}>
          <div style={{fontSize:12,color:txt3,fontWeight:800,marginBottom:8}}>TA RÉPONSE</div>
          <div style={{display:"flex",gap:8}}>
            <input value={answer} onChange={e=>setAnswer(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}
              placeholder="Artiste ou titre du morceau…"
              disabled={submitted}
              style={{flex:1,background:CARD2,border:`2px solid ${submitted?"#6bcb77":"#ffffff22"}`,
                borderRadius:10,padding:"11px 14px",color:txt,fontSize:14,fontWeight:700,
                fontFamily:"'Nunito',sans-serif",transition:"border-color .2s"}}/>
            <Btn onClick={submit} disabled={submitted||!answer.trim()}
              color={GRN} style={{flexShrink:0,padding:"10px 20px",fontSize:16}}>
              {submitted?"✓":"↵"}
            </Btn>
          </div>
          {submitted&&<div style={{fontSize:12,color:GRN,fontWeight:700,marginTop:8}}>✓ Réponse envoyée !</div>}
        </Panel>

        {/* others */}
        <Panel className="fu3">
          <div style={{fontSize:11,color:txt3,fontWeight:800,marginBottom:10}}>STATUT DES JOUEURS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {players.slice(1).map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:7,
                background:CARD2,borderRadius:50,padding:"6px 12px"}}>
                <div style={{width:8,height:8,borderRadius:"50%",
                  background:i<2?GRN:"#ffffff33",
                  animation:i<2?"pulse 1.5s ease infinite":"none"}}/>
                <span style={{fontSize:12,fontWeight:700,color:txt2}}>{p.name}</span>
                {i<2&&<span style={{fontSize:11,color:GRN,fontWeight:700}}>✓</span>}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   REVEAL
══════════════════════════════════════════════ */
const Reveal = ({round,roundIndex,totalRounds,players,myAnswer,roundDeltas,onNext,onFinish})=>{
  const isLast=roundIndex>=totalRounds-1;
  const results=[
    {player:players[0],answer:myAnswer||"—",pts:roundDeltas[0]||0},
    {player:players[1],answer:"eminem rap",pts:60},
    {player:players[2],answer:"8 mile?",pts:20},
    {player:players[3],answer:"—",pts:0},
  ].sort((a,b)=>b.pts-a.pts);

  return (
    <div style={{minHeight:"100vh",background:BG,padding:"32px 20px",fontFamily:"'Nunito',sans-serif"}}>
      <G/>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        {/* reveal */}
        <div className="pop" style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:90,height:90,borderRadius:24,
            background:`linear-gradient(135deg,${ACC}44,${YEL}22)`,
            border:`3px solid ${ACC}55`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:44,margin:"0 auto 16px",animation:"float 3s ease-in-out infinite"}}>
            {round.emoji}
          </div>
          <div style={{fontSize:11,color:txt3,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>C'était</div>
          <h2 style={{fontSize:28,fontWeight:900,color:txt,letterSpacing:"-0.5px",marginBottom:4}}>{round.title}</h2>
          <div style={{fontSize:18,color:YEL,fontWeight:800,marginBottom:10}}>{round.artist}</div>
          <div style={{display:"flex",gap:6,justifyContent:"center"}}>
            <Chip label={String(round.year)} color={YEL}/>
            <Chip label={round.genre} color={ACC}/>
          </div>
        </div>

        {/* round results */}
        <Panel className="fu1" style={{marginBottom:12}}>
          <SLabel>Résultats de la manche</SLabel>
          {results.map((r,i)=>(
            <div key={r.player.id} style={{display:"flex",alignItems:"center",gap:10,
              padding:"10px 0",borderBottom:i<results.length-1?"1.5px solid #ffffff08":"none"}}>
              <div style={{width:22,fontSize:14,textAlign:"center",flexShrink:0}}>
                {i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}
              </div>
              <Av name={r.player.name} color={r.player.color} size={32}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:txt}}>{r.player.name}</div>
                <div style={{fontSize:11,color:txt3,fontStyle:"italic"}}>"{r.answer}"</div>
              </div>
              <div style={{fontSize:15,fontWeight:800,
                color:r.pts>=100?GRN:r.pts>0?YEL:txt3}}>
                {r.pts>0?`+${r.pts}`:"-"}
              </div>
            </div>
          ))}
        </Panel>

        {/* totals */}
        <Panel className="fu2" style={{marginBottom:20}}>
          <SLabel>Classement</SLabel>
          {[...players].sort((a,b)=>b.score-a.score).map((p,i)=>(
            <PRow key={p.id} player={p} rank={i+1} delta={roundDeltas[i]||0}/>
          ))}
        </Panel>

        <div style={{display:"flex",gap:10}}>
          {isLast
            ?<Btn onClick={onFinish} color={YEL} style={{flex:1,padding:"14px",fontSize:16}}>Classement final 🏆</Btn>
            :<>
              <div style={{flex:1,display:"flex",alignItems:"center",fontSize:13,color:txt3,fontWeight:700}}>
                {roundIndex+1} / {totalRounds}
              </div>
              <Btn onClick={onNext} color={ACC} style={{flex:2,padding:"14px",fontSize:15}}>Manche suivante →</Btn>
            </>
          }
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   SCORES
══════════════════════════════════════════════ */
const Scores = ({players,totalRounds,onPlayAgain,onHome})=>{
  const sorted=[...players].sort((a,b)=>b.score-a.score);
  const winner=sorted[0];
  return (
    <div style={{minHeight:"100vh",background:BG,padding:"40px 20px",fontFamily:"'Nunito',sans-serif"}}>
      <G/>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        <div className="pop" style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:56,marginBottom:10,animation:"float 3s ease-in-out infinite"}}>🏆</div>
          <h2 style={{fontSize:28,fontWeight:900,color:txt,letterSpacing:"-0.5px",marginBottom:4}}>
            Bravo <span style={{color:YEL}}>{winner.name}</span> !
          </h2>
          <p style={{fontSize:14,color:txt2,fontWeight:600}}>
            {winner.score} pts sur {totalRounds*100} possibles
          </p>
        </div>

        {/* podium */}
        <div className="fu" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16,alignItems:"flex-end"}}>
          {[sorted[1],sorted[0],sorted[2]].map((p,i)=>{
            if(!p)return<div key={i}/>;
            const rank=i===1?1:i===0?2:3;
            const medals=["🥇","🥈","🥉"];
            const heights=[90,120,70];
            const colors=[YEL,ACC,GRN];
            return (
              <div key={p.id} style={{textAlign:"center"}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
                  <Av name={p.name} color={p.color} size={40}/>
                </div>
                <div style={{fontSize:12,fontWeight:800,color:txt,marginBottom:6}}>{p.name}</div>
                <div style={{
                  borderRadius:"12px 12px 0 0",
                  background:colors[rank-1]+"22",
                  border:`2px solid ${colors[rank-1]}44`,
                  height:heights[i],display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"flex-start",paddingTop:12,
                }}>
                  <div style={{fontSize:24}}>{medals[rank-1]}</div>
                  <div style={{fontSize:13,fontWeight:800,color:colors[rank-1],marginTop:4}}>{p.score} pts</div>
                </div>
              </div>
            );
          })}
        </div>

        <Panel className="fu1" style={{marginBottom:16}}>
          <SLabel>Classement complet</SLabel>
          {sorted.map((p,i)=><PRow key={p.id} player={p} rank={i+1}/>)}
        </Panel>

        <div className="fu2" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
          {[{l:"Manches",v:totalRounds},{l:"Joueurs",v:players.length},{l:"Pts max",v:Math.max(...players.map(p=>p.score))}].map(s=>(
            <div key={s.l} style={{background:CARD,borderRadius:14,padding:"14px 10px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:900,color:txt}}>{s.v}</div>
              <div style={{fontSize:11,color:txt3,fontWeight:700,marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>

        <div className="fu3" style={{display:"flex",gap:10}}>
          <GBtn onClick={onHome} style={{flex:1}}>Accueil</GBtn>
          <Btn onClick={onPlayAgain} color={ACC} style={{flex:2,padding:"14px",fontSize:16}}>Rejouer 🎶</Btn>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   APP ROUTER
══════════════════════════════════════════════ */
export default function App() {
  const [screen,setScreen]=useState("home");
  const [config,setConfig]=useState(null);
  const [players,setPlayers]=useState(MOCK_PLAYERS);
  const [roundIdx,setRoundIdx]=useState(0);
  const [myAnswer,setMyAnswer]=useState("");
  const [roundDeltas,setRoundDeltas]=useState([0,0,0,0]);

  const currentRound=MOCK_ROUNDS[roundIdx%MOCK_ROUNDS.length];
  const totalRounds=config?.rounds??10;
  const timerSec=config?.timerSec??25;

  const resetGame=cfg=>{
    setConfig(cfg);
    setPlayers(MOCK_PLAYERS.map(p=>({...p,score:0})));
    setRoundIdx(0);setMyAnswer("");setRoundDeltas([0,0,0,0]);
  };

  const handleSubmit=(answer,timeLeft)=>{
    const pts=scoreAnswer(answer,currentRound);
    const bonus=pts>0?Math.round((timeLeft/timerSec)*20):0;
    const total=pts+bonus;
    const deltas=[total,Math.floor(Math.random()*60+20),Math.floor(Math.random()*30),0];
    setMyAnswer(answer);setRoundDeltas(deltas);
    setPlayers(prev=>prev.map((p,i)=>({...p,score:p.score+deltas[i]})));
    setScreen("reveal");
  };

  const handleTimeout=()=>{
    const deltas=[0,Math.floor(Math.random()*60),Math.floor(Math.random()*40),0];
    setMyAnswer("");setRoundDeltas(deltas);
    setPlayers(prev=>prev.map((p,i)=>({...p,score:p.score+deltas[i]})));
    setScreen("reveal");
  };

  const handleNext=()=>{
    const next=roundIdx+1;
    if(next>=totalRounds){setScreen("scores");return;}
    setRoundIdx(next);setMyAnswer("");setScreen("game");
  };

  const def={genres:["Pop","Hip-Hop"],decades:["2010s"],rounds:10,timerSec:25,hostName:"Orel"};

  if(screen==="home")   return <Home   onCreate={()=>setScreen("create")} onJoin={()=>setScreen("join")}/>;
  if(screen==="create") return <Create onBack={()=>setScreen("home")} onCreate={cfg=>{resetGame(cfg);setScreen("lobby");}}/>;
  if(screen==="join")   return <Join   code="" onBack={()=>setScreen("home")} onJoin={()=>{resetGame(def);setScreen("lobby");}}/>;
  if(screen==="lobby")  return <Lobby  config={config||def} players={players} onStart={()=>setScreen("game")} onLeave={()=>setScreen("home")}/>;
  if(screen==="game")   return <Game   round={currentRound} roundIndex={roundIdx} totalRounds={totalRounds} players={players} timerSec={timerSec} onSubmit={handleSubmit} onTimeout={handleTimeout}/>;
  if(screen==="reveal") return <Reveal round={currentRound} roundIndex={roundIdx} totalRounds={totalRounds} players={players} myAnswer={myAnswer} roundDeltas={roundDeltas} onNext={handleNext} onFinish={()=>setScreen("scores")}/>;
  if(screen==="scores") return <Scores players={players} totalRounds={totalRounds} onPlayAgain={()=>{resetGame(config);setScreen("lobby");}} onHome={()=>setScreen("home")}/>;
}