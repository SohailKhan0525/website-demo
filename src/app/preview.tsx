"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, Check, ChevronRight, Command, Plus, Sparkles, Zap } from "lucide-react";
import type { Animation } from "./animations";

const ease = [0.22, 1, 0.36, 1] as const;

const surfaceMotion: Record<string, { animate: Record<string, unknown>; transition: Record<string, unknown> }> = {
  liquid: { animate: { borderRadius: ["30% 70% 64% 36%", "64% 36% 40% 60%", "30% 70% 64% 36%"], rotate: [-7, 5, -7], scale: [1, 1.04, 1] }, transition: { duration: 7, repeat: Infinity, ease: "easeInOut" } },
  morph: { animate: { borderRadius: ["58% 42% 47% 53%", "36% 64% 58% 42%", "58% 42% 47% 53%"], rotate: [0, 12, 0], scale: [1, 1.06, 1] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
  gooey: { animate: { borderRadius: ["50% 48% 42% 58%", "30% 70% 62% 38%", "50% 48% 42% 58%"], x: [-14, 12, -14], scale: [1, 1.06, 1] }, transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } },
  light: { animate: { x: [-115, 115], opacity: [0.08, 0.95, 0.08], scaleX: [.7, 1.2, .7] }, transition: { duration: 4.6, repeat: Infinity, ease: "easeInOut" } },
  glow: { animate: { boxShadow: ["0 0 15px rgba(132,112,235,.12)", "0 0 65px rgba(132,112,235,.5)", "0 0 15px rgba(132,112,235,.12)"], scale: [1, 1.035, 1] }, transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" } },
  gradient: { animate: { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }, transition: { duration: 8, repeat: Infinity, ease: "linear" } },
  reflection: { animate: { rotateY: [-18, 18, -18], rotateX: [7, -7, 7], filter: ["brightness(.78)", "brightness(1.25)", "brightness(.78)"] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
  glass: { animate: { y: [0, -5, 0], borderColor: ["rgba(255,255,255,.18)", "rgba(255,255,255,.56)", "rgba(255,255,255,.18)"] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
  chromatic: { animate: { x: [-2, 2, -2], filter: ["drop-shadow(-5px 0 rgba(82,203,255,.45)) drop-shadow(5px 0 rgba(255,87,156,.4))", "drop-shadow(0 0 transparent)", "drop-shadow(-5px 0 rgba(82,203,255,.45)) drop-shadow(5px 0 rgba(255,87,156,.4))"] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
};

const networkNodes = [
  { x: 13, y: 50 }, { x: 31, y: 22 }, { x: 32, y: 76 }, { x: 51, y: 50 },
  { x: 70, y: 22 }, { x: 70, y: 76 }, { x: 88, y: 50 }
];
const networkEdges = [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6]];

function SceneLabel({ children }: { children: React.ReactNode }) {
  return <span className="stage-label">{children}</span>;
}

function InterfaceScene({ kind, replay }: { kind: string; replay: number }) {
  const reduce = Boolean(useReducedMotion());
  const stack = kind === "assembly" || kind === "depth" || kind === "dolly";
  const isDiff = kind === "diff" || kind === "state";
  const isPresence = kind === "presence";
  const [checked, setChecked] = useState(false);
  return <div className={"motion-scene interface-scene interface-scene--" + kind} key={replay}>
    <div className="interface-window">
      <div className="interface-window-bar"><span className="window-dots"><i /><i /><i /></span><span>STUDIO / WORKSPACE</span><span className="window-live"><i /> ACTIVE</span></div>
      <div className="interface-body">
        <div className="interface-sidebar"><div className="sidebar-mark">m.</div><i /><i /><i /><i /><div className="sidebar-avatar">SK</div></div>
        <div className="interface-main">
          <div className="interface-heading"><div><small>OVERVIEW / 2026</small><strong>{stack ? "Your workspace" : isPresence ? "Shared canvas" : isDiff ? "Changes in sync" : "Project overview"}</strong></div><span className="interface-action"><Plus size={12} /> New</span></div>
          <div className="interface-metrics">
            {[["Design system","84%"],["Interactions","26"],["Components","12"]].map(([label,value],i)=><motion.div className="interface-metric" key={label} initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.6,delay:reduce?0:i*.12,ease}}><small>{label}</small><strong>{isDiff&&i===1?(checked?"27":"26"):value}</strong><span className={"metric-bar metric-bar--"+i}><i /></span></motion.div>)}
          </div>
          <div className="interface-chart-card"><div className="chart-head"><span>{isDiff?"Recent changes":"Activity over time"}</span><span>7 DAYS <ChevronRight size={10}/></span></div>
            <svg className="interface-chart" viewBox="0 0 360 98" preserveAspectRatio="none" aria-label="Animated activity chart">
              <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a8be8" stopOpacity=".3"/><stop offset="100%" stopColor="#9a8be8" stopOpacity="0"/></linearGradient></defs>
              {[20,45,70].map(y=><line key={y} x1="0" y1={y} x2="360" y2={y} stroke="currentColor" opacity=".12" strokeDasharray="3 5"/>)}
              <motion.path d="M0 78 C22 72 24 50 48 57 S78 80 102 48 S132 59 156 37 S190 54 210 31 S242 45 265 22 S302 40 324 18 S346 24 360 8 L360 98 L0 98 Z" fill="url(#chartFill)" initial={reduce?false:{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:1}} transition={{duration:reduce?0:1.8,ease}}/>
              <motion.path d="M0 78 C22 72 24 50 48 57 S78 80 102 48 S132 59 156 37 S190 54 210 31 S242 45 265 22 S302 40 324 18 S346 24 360 8" fill="none" stroke="#9584e7" strokeWidth="2.4" strokeLinecap="round" initial={reduce?false:{pathLength:0}} animate={{pathLength:1}} transition={{duration:reduce?0:2,ease,delay:.08}}/>
            </svg>
            <div className="chart-x-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
          </div>
          <div className="interface-row"><span className="row-avatar">✳</span><div><b>{isPresence?"Sohail is editing":"Latest component update"}</b><small>{isPresence?"Cursor is live on the canvas":"Button / Primary · just now"}</small></div><button type="button" aria-label="Toggle changed state" onClick={()=>setChecked(v=>!v)} className={"row-status"+(checked?" row-status--done":"")}>{checked?<Check size={11}/>:isDiff?"+12%":"View"}</button></div>
        </div>
      </div>
    </div>
    {stack && <><motion.div className="floating-layer floating-layer--one" initial={reduce?false:{x:28,y:22,rotate:8,opacity:0}} animate={{x:0,y:0,rotate:-7,opacity:1}} transition={{duration:reduce?0:.9,delay:.3,ease}}><span>LAYERS / 03</span><i/><i/><i/></motion.div><motion.div className="floating-layer floating-layer--two" initial={reduce?false:{x:-24,y:-18,rotate:-9,opacity:0}} animate={{x:0,y:0,rotate:5,opacity:1}} transition={{duration:reduce?0:.8,delay:.12,ease}}><span>COMPONENT / 08</span><b>Motion</b></motion.div></>}
    {isPresence && <motion.div className="remote-cursor" animate={reduce?undefined:{x:[0,55,28,0],y:[0,-16,25,0]}} transition={{duration:7,repeat:Infinity,ease:"easeInOut"}}><span>sohail</span><svg viewBox="0 0 14 18"><path d="M1 1 L1 14 L5 10 L8 17 L11 15 L8 8 L13 8 Z" fill="#806ad6" stroke="white"/></svg></motion.div>}
  </div>;
}

function NetworkScene({ kind, replay, slug }: { kind: string; replay: number; slug: string }) {
  const reduce = Boolean(useReducedMotion());
  const particles = Array.from({length:24},(_,i)=>({id:i,angle:(i/24)*Math.PI*2,radius:54+(i%4)*15}));
  const isParticles = kind === "particles";
  const isParticleField = slug === "volumetric-particle-field";
  const isAgentOrchestration = slug === "autonomous-agent-orchestration";
  const isWire = kind === "wireframe";
  const isStream = kind === "stream";
  const isTrace = kind === "trace";
  return <div className={"motion-scene network-scene network-scene--"+kind} key={replay}>
    <div className="network-top-label"><SceneLabel>{isParticleField?"VOLUMETRIC FIELD":isParticles?"PARTICLE CONVERGENCE":isWire?"PROCEDURAL MESH":isStream?"LIVE DATA PIPELINE":isTrace?"EXECUTION TRACE":isAgentOrchestration?"AGENT ORCHESTRATION":"REACTIVE NODE GRAPH"}</SceneLabel><span className="network-live"><i/> {isStream?"STREAMING":"RUNNING"}</span></div>
    {isParticles ? <div className="particle-stage"><div className="particle-rings"><i/><i/><i/></div>{particles.map(p=><motion.i className="particle-dot" key={p.id} style={{left:`calc(50% + ${Math.cos(p.angle)*p.radius}px)`,top:`calc(49% + ${Math.sin(p.angle)*p.radius}px)`}} animate={reduce?undefined:isParticleField?{x:[0,Math.cos(p.angle)*18,0],y:[0,Math.sin(p.angle)*14,0],opacity:[.25,.8,.25],scale:[.7,1.1,.7]}:{x:[0,-Math.cos(p.angle)*p.radius*.55,0],y:[0,-Math.sin(p.angle)*p.radius*.55,0],opacity:[.24,1,.24],scale:[.7,1.3,.7]}} transition={{duration:isParticleField?4.2+(p.id%5)*.4:2.4+(p.id%6)*.31,repeat:Infinity,delay:p.id*.035,ease:"easeInOut"}}/>)}<motion.div className="particle-core" animate={reduce?undefined:{scale:[1,.91,1],rotate:[0,90,180]}} transition={{duration:8,repeat:Infinity,ease:"linear"}}><Sparkles size={25}/></motion.div></div> :
    <div className="network-map">
      <svg className="network-lines" viewBox="0 0 440 245" preserveAspectRatio="none">
        {networkEdges.map(([a,b],i)=><motion.path key={i} d={`M ${networkNodes[a].x*4.4} ${networkNodes[a].y*2.45} L ${networkNodes[b].x*4.4} ${networkNodes[b].y*2.45}`} fill="none" stroke={isTrace&&i<3?"#8e7cde":"currentColor"} strokeOpacity={isTrace&&i<3?.9:.28} strokeWidth={isTrace&&i<3?2:1.1} strokeDasharray={isStream?"5 8":"0"} initial={reduce?false:{pathLength:0}} animate={{pathLength:1,strokeDashoffset:isStream?[0,-42]:0}} transition={{duration:reduce?0:isStream?2.4:1.1,repeat:isStream?Infinity:0,ease:"linear",delay:i*.08}}/>)}
      </svg>
      {networkNodes.map((p,i)=><motion.div className={"network-node"+(i===3?" network-node--main":"")} key={i} style={{left:p.x+"%",top:p.y+"%"}} initial={reduce?false:{opacity:0,scale:.6}} animate={{opacity:1,scale:i===3?[1,1.06,1]:1}} transition={{duration:reduce?0:1,delay:reduce?0:i*.08,repeat:i===3?Infinity:0,ease:"easeInOut"}}><span>{isAgentOrchestration?["USR","PLAN","API","AGNT","QA","MEM","OUT"][i]:i===3?(isTrace?"RUN":isStream?"API":"AI"):String(i+1).padStart(2,"0")}</span>{i===3&&<i/>}</motion.div>)}
      {isWire&&<svg className="wireframe-lines" viewBox="0 0 440 245"><motion.path d="M75 170 L140 65 L220 30 L310 65 L370 170 L220 215 Z M140 65 L150 170 L310 65 L290 170 L75 170 M150 170 L220 30 L290 170 L220 215 M75 170 L220 30 L370 170" fill="none" stroke="#9d8be6" strokeWidth="1" initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:.8}} transition={{duration:2.2,repeat:Infinity,repeatType:"reverse",ease:"easeInOut"}}/></svg>}
    </div>}
    <div className="network-footer"><span>{isTrace?"01  RECEIVE → 02  THINK → 03  RESOLVE":isStream?"EVENTS / 1.2K PER SEC":isWire?"STRUCTURE / 3D VECTOR FIELD":"SIGNALS / SYNCHRONIZED"}</span><span className="network-footer-dot">●</span></div>
  </div>;
}

function TypeScene({ kind, replay }: { kind: string; replay: number }) {
  const reduce = Boolean(useReducedMotion());
  const words = kind === "tokens" ? ["The","next","idea","starts","here."] : ["Make","every","detail","matter."];
  const isTrace = kind === "trace";
  return <div className={"motion-scene type-scene type-scene--"+kind} key={replay}>
    <div className="type-top"><SceneLabel>{kind==="tokens"?"STREAMING OUTPUT":isTrace?"REASONING / TRACE":"TYPE IN MOTION"}</SceneLabel><span>01—04</span></div>
    {isTrace ? <div className="trace-list">{["Read the brief","Find the pattern","Build the transition","Return the result"].map((t,i)=><motion.div key={t} className="trace-item" initial={reduce?false:{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{duration:reduce?0:.55,delay:reduce?0:i*.28,ease}}><span className="trace-step">{i<3?<Check size={12}/>:<Zap size={12}/>}</span><span>{t}</span><motion.i initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:reduce?0:.7,delay:reduce?0:i*.28+.18,ease}}/></motion.div>)}</div>
      : <div className="kinetic-copy">{words.map((word,i)=><motion.span key={word} initial={reduce?false:{opacity:0,y:25,filter:"blur(7px)",letterSpacing:".09em"}} animate={{opacity:1,y:0,filter:"blur(0px)",letterSpacing:kind==="kinetic"?"-.065em":"-.04em"}} transition={{duration:reduce?0:.75,delay:reduce?0:i*.13,ease}}>{kind==="tokens"&&i>0?" "+word:word}</motion.span>)}</div>}
    <div className="type-bottom"><span className="type-cursor"/> <span>{kind==="tokens"?"GENERATING · TOKEN BY TOKEN":isTrace?"4 STEPS · ALL COMPLETE":"TRACKING / SPRING SETTLE"}</span></div>
  </div>;
}

function ScrollScene({ kind, replay, slug }: { kind: string; replay: number; slug: string }) {
  const reduce = Boolean(useReducedMotion());
  const [progress,setProgress] = useState(0);
  const verticalRef = useRef<HTMLDivElement>(null);
  const isHorizontal = kind === "horizontal";
  const isScrollChart = slug === "scroll-synchronized-data";
  const isScrollType = slug === "scroll-linked-type-deformation";
  const isMorphStory = slug === "continuous-section-morphing";
  const isCameraFlight = slug === "scroll-driven-camera-flight";
  const isNarrative = slug === "narrative-state-transformation";
  const isPinned = kind === "pin";
  const isMask = kind === "mask";
  const isParallax = kind === "parallax";
  const onScroll = () => {
    const el=verticalRef.current;
    if (el) setProgress(el.scrollTop/Math.max(1,el.scrollHeight-el.clientHeight));
  };
  return <div className={"motion-scene scroll-scene scroll-scene--"+kind} key={replay}>
    <div className="scroll-scene-head"><SceneLabel>{isHorizontal?"HORIZONTAL JOURNEY":isPinned?"PINNED SEQUENCE":isMask?"MASK REVEAL":isParallax?"PARALLAX DEPTH":isScrollChart?"SCROLL-LINKED DATA":isScrollType?"TYPE DEFORMATION":isMorphStory?"SECTION MORPH":isCameraFlight?"CAMERA FLIGHT":isNarrative?"NARRATIVE STATES":"SCROLL-SCRUBBED STORY"}</SceneLabel><span>{Math.round(progress*100)}%</span></div>
    <div className="scroll-progress"><motion.i animate={{scaleX:progress}} style={{transformOrigin:"left"}} transition={{duration:reduce?0:.12}}/></div>
    <div className="scroll-viewport" ref={verticalRef} onScroll={onScroll} tabIndex={0} aria-label="Scroll inside the preview to scrub the scene">
      <div className={"scroll-content"+(isHorizontal?" scroll-content--horizontal":"")}>
        {isHorizontal ? <motion.div className="horizontal-track" animate={{x:-progress*440}} transition={{duration:reduce?0:.15,ease:"linear"}}>{["Discover","Design","Deliver"].map((t,i)=><div className={"horizontal-panel horizontal-panel--"+i} key={t}><span>0{i+1} / FIELD NOTE</span><strong>{t}<br/><em>with intent.</em></strong><i>{["↗","✳","→"][i]}</i></div>)}</motion.div>
        : isScrollChart ? <div className="scroll-chart-story"><div className="scroll-chart-sticky">
          <div className="scroll-chart-title">Signals through the week <span>SCROLL / LIVE</span></div>
          <div className="scroll-bars">{[38,66,48,78,55,94,70,84,61,97,76,88].map((height,i)=><motion.i key={i} style={{height:height+"%"}} animate={{scaleY:Math.min(1,.25+progress*1.2+(i%3)*.09)}} transition={{duration:reduce?0:.12,ease:"linear"}} />)}</div>
          <div className="scroll-chart-numbers"><strong>{Math.round(12400+progress*8600).toLocaleString()}</strong><span>events processed</span></div>
          <div className="scroll-chart-track">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(t=><span key={t}>{t}</span>)}</div>
        </div><div className="scroll-chart-spacer">SCROLL TO SCRUB THE DATA ↓</div></div>
        : isScrollType ? <div className="scroll-type-story"><div className="scroll-type-sticky">
          <span>SCROLL-LINKED TYPE / CHAPTER 0{Math.min(3,Math.floor(progress*3)+1)}</span>
          <motion.strong animate={{letterSpacing:(.12-progress*.17)+"em",scaleX:.82+progress*.18,y:-progress*14}} transition={{duration:reduce?0:.12,ease:"linear"}}>MOVE<br/>WITH<br/>MEANING.</motion.strong>
          <small>Tracking and scale follow the scroll position.</small>
          <div className="scroll-type-baseline"><i style={{width:(progress*100)+"%"}} /></div>
        </div><div className="scroll-type-spacer">SCROLL TO DEFORM TYPE ↓</div></div>
        : <div className="scroll-story">
          <div className="scroll-sticky-content">
            <div className="scroll-story-index">CHAPTER 0{Math.min(3,Math.floor(progress*3)+1)}</div>
            <motion.div className="scroll-story-orb" animate={reduce?undefined:{rotate:[-12,12,-12],scale:[.96,1.05,.96],borderRadius:["45% 55% 61% 39%","62% 38% 43% 57%","45% 55% 61% 39%"]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut"}} style={{x:isParallax?progress*16:0,y:isParallax?-progress*22:progress*-8,rotateY:isCameraFlight?progress*45:0,scale:isCameraFlight?1+progress*.45:undefined,clipPath:isMask||isMorphStory ? "inset(0 0 " + ((1-progress)*70) + "% 0 round 40px)" : undefined}}><span/></motion.div>
            <strong>{isPinned?["One scene.","Then another.","A final reveal."][Math.min(2,Math.floor(progress*3))]:isNarrative?["Receive the signal.","Transform the state.","Ready to ship."][Math.min(2,Math.floor(progress*3))]:isMorphStory?["One surface.","A softer edge.","One continuous flow."][Math.min(2,Math.floor(progress*3))]:isCameraFlight?["Enter the scene.","Move through depth.","Arrive with intent."][Math.min(2,Math.floor(progress*3))]:["A little depth.","As you move.","The whole story."][Math.min(2,Math.floor(progress*3))]}</strong>
            <small>Scroll the panel to change the scene.</small>
          </div>
          <div className="scroll-spacer"><span>SCROLL TO CONTINUE</span><ArrowDown size={16}/></div>
        </div>}
      </div>
    </div>
    <div className="scroll-scene-foot"><span>SCROLL INSIDE THE STAGE</span><span>↕</span></div>
  </div>;
}

function InteractiveScene({ kind, replay }: { kind: string; replay: number }) {
  const reduce = Boolean(useReducedMotion());
  const bounds = useRef<HTMLDivElement>(null);
  const [active,setActive]=useState(0);
  const [expanded,setExpanded]=useState(false);
  const [flipped,setFlipped]=useState(false);
  const [offset,setOffset]=useState({x:0,y:0});
  const isDrag=kind==="drag";
  const isTilt=kind==="tilt";
  const isMagnetic=kind==="magnetic";
  const isNav=kind==="nav";
  const isFlip=kind==="flip";
  const isExpand=kind==="expand";
  const isShared=kind==="shared";
  const title=isDrag?"Drag the card":isTilt?"Move your pointer":isMagnetic?"A magnetic control":isNav?"Choose a section":isFlip?"Flip the card":isExpand?"Open the details":isShared?"Shared element":"Spring response";
  function pointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const r=event.currentTarget.getBoundingClientRect();
    setOffset({x:((event.clientX-r.left)/r.width-.5)*2,y:((event.clientY-r.top)/r.height-.5)*2});
  }
  return <div className={"motion-scene interactive-scene interactive-scene--"+kind} key={replay} ref={bounds}>
    <div className="interactive-head"><SceneLabel>{kind==="drag"?"INERTIAL DRAG":kind==="tilt"?"POINTER PERSPECTIVE":kind==="magnetic"?"MAGNETIC FIELD":kind==="nav"?"LAYOUT INDICATOR":kind==="flip"?"FLIP TRANSITION":kind==="expand"?"CONTEXTUAL EXPANSION":kind==="shared"?"SHARED ELEMENT":"SPRING PHYSICS"}</SceneLabel><span>TRY IT</span></div>
    {isNav ? <div className="nav-demo"><div className="nav-demo-items">{["Overview","Activity","Settings"].map((t,i)=><button type="button" key={t} className={active===i?"is-active":""} onClick={()=>setActive(i)}>{t}</button>)}</div><motion.div className="nav-demo-content" key={active} initial={reduce?false:{opacity:0,y:10,filter:"blur(4px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} transition={{duration:reduce?0:.35,ease}}><span>0{active+1}</span><strong>{["Everything at a glance.","A little more context.","Make it yours."][active]}</strong><p>Content changes without the interface snapping.</p></motion.div></div>
    : isDrag ? <div className="drag-area"><div className="drag-target">DRAG ME ↗</div><motion.div drag dragConstraints={bounds} dragElastic={.18} dragMomentum={!reduce} whileDrag={{scale:1.06,rotate:-4,cursor:"grabbing"}} className="drag-card"><span>INTERACTIVE OBJECT</span><strong>Move<br/>me around.</strong><i><ArrowRight size={16}/></i></motion.div></div>
    : isTilt ? <div className="tilt-stage" onPointerMove={pointerMove} onPointerLeave={()=>setOffset({x:0,y:0})}><motion.div className="tilt-card" animate={reduce?{rotateX:0,rotateY:0}:{rotateX:-offset.y*14,rotateY:offset.x*16}} transition={{duration:reduce?0:.14,ease:"linear"}}><div className="tilt-card-light"/><span>OBJECT / 3D</span><strong>Perspective<br/>changes everything.</strong><small>MOVE YOUR POINTER</small></motion.div></div>
    : isMagnetic ? <div className="magnetic-stage" onPointerMove={pointerMove} onPointerLeave={()=>setOffset({x:0,y:0})}><motion.button type="button" className="magnetic-button" animate={reduce?{x:0,y:0}:{x:offset.x*13,y:offset.y*13}} transition={{type:"spring",stiffness:180,damping:18}}><Sparkles size={15}/> Stay close <ArrowRight size={14}/></motion.button><motion.div className="magnetic-ring" animate={{x:offset.x*13,y:offset.y*13,scale:offset.x||offset.y?1.06:1}} transition={{type:"spring",stiffness:120,damping:20}}/></div>
    : isFlip ? <button type="button" className="flip-button" onClick={()=>setFlipped(v=>!v)} aria-label="Flip card"><motion.div className="flip-inner" animate={{rotateY:flipped?180:0}} transition={{duration:reduce?0:.72,ease}}><div className="flip-face"><span>THE FRONT</span><strong>Same element.<br/>New state.</strong><small>CLICK TO FLIP ↻</small></div><div className="flip-face flip-face--back"><span>THE BACK</span><strong>Continuity<br/>preserved.</strong><small>CLICK TO RETURN ↻</small></div></motion.div></button>
    : isExpand ? <div className="expand-stage"><motion.button type="button" className="expand-trigger" onClick={()=>setExpanded(v=>!v)} whileTap={{scale:.98}}><span><Plus size={14}/>{expanded?"Close details":"More about this"}</span><ChevronRight size={14} className={expanded?"expand-chevron--open":""}/></motion.button><AnimatePresence initial={false}>{expanded&&<motion.div className="expand-panel" initial={{height:0,opacity:0,y:-5}} animate={{height:"auto",opacity:1,y:0}} exit={{height:0,opacity:0,y:-5}} transition={{duration:reduce?0:.36,ease}}><strong>Context changes the interface.</strong><p>The panel grows from its trigger, keeps its place in the layout, and can be closed without losing context.</p><span>EXPANDED STATE / READY</span></motion.div>}</AnimatePresence></div>
    : isShared ? <div className="shared-stage"><div className="shared-grid">{["A","B","C","D","E","F"].map((item,i)=><button type="button" key={item} onClick={()=>setActive(i+1)} className="shared-item"><span>{item}</span><small>COLLECTION 0{i+1}</small></button>)}</div><AnimatePresence>{active>0&&<motion.div className="shared-detail" layoutId={"shared-card-"+active} initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.92}}><button type="button" aria-label="Close item" onClick={()=>setActive(0)}>×</button><span>COLLECTION {String(active).padStart(2,"0")}</span><strong>Element {String.fromCharCode(64+active)}</strong><p>The same element persists between grid and detail states.</p></motion.div>}</AnimatePresence></div>
    : <div className="spring-stage"><motion.button type="button" className="spring-object" whileHover={reduce?undefined:{scale:1.09,y:-3}} whileTap={reduce?undefined:{scale:.86,y:4}} transition={{type:"spring",stiffness:320,damping:11}}><span/><strong>Press &amp; hold</strong><small>SPRING / 320</small></motion.button><div className="spring-track"><motion.i animate={reduce?undefined:{x:[0,75,0]}} transition={{duration:2.2,repeat:Infinity,ease:"easeInOut"}}/></div></div>}
    <div className="interactive-foot"><span>{isDrag?"CLICK + DRAG":isTilt||isMagnetic?"MOVE POINTER":isNav||isExpand||isFlip||isShared?"CLICK TO CHANGE STATE":"HOVER OR PRESS"}</span><span>INPUT → RESPONSE</span></div>
  </div>;
}

function PortalScene({ replay }: { replay: number }) {
  const reduce = Boolean(useReducedMotion());
  const [open,setOpen]=useState(false);
  return <div className="motion-scene portal-scene" key={replay}>
    <div className="visual-head"><SceneLabel>PORTAL REVEAL</SceneLabel><span>CLIP PATH / RADIAL</span></div>
    <div className="portal-stage">
      <div className="portal-underlay"><span>THE NEXT CHAPTER</span><strong>Make room<br/>for what’s next.</strong><small>A transition with a clear focal point.</small><div className="portal-underlay-mark">↗</div></div>
      <motion.div className="portal-mask" initial={reduce?false:{clipPath:"circle(0% at 50% 50%)"}} animate={reduce?{clipPath:"circle(100% at 50% 50%)"}:{clipPath:open?"circle(0% at 50% 50%)":"circle(100% at 50% 50%)"}} transition={{duration:reduce?0:.85,ease:[.76,0,.24,1]}}>
        <div className="portal-mask-content"><span>NEW SPACE / 02</span><motion.div className="portal-ring" animate={reduce?undefined:{rotate:[0,90,180],scale:[1,.93,1]}} transition={{duration:8,repeat:Infinity,ease:"linear"}}><i/><i/><i/></motion.div><strong>Start<br/><em>somewhere.</em></strong><small>The shape becomes the doorway.</small></div>
      </motion.div>
      <button className="portal-toggle" type="button" onClick={()=>setOpen(v=>!v)}>{open?"Close portal":"Replay reveal"} <ArrowRight size={12}/></button>
    </div>
    <div className="visual-foot"><span>RADIAL MASK · FOCAL REVEAL</span><span><i/> INTERACTIVE</span></div>
  </div>;
}

function VisualScene({ kind, replay }: { kind: string; replay: number }) {
  const reduce = Boolean(useReducedMotion());
  const effect = surfaceMotion[kind] || surfaceMotion.morph;
  const isGlass=kind==="glass";
  const isGlow=kind==="glow";
  const isGradient=kind==="gradient";
  const isLight=kind==="light";
  const isChromatic=kind==="chromatic";
  const isReflection=kind==="reflection";
  return <div className={"motion-scene visual-scene visual-scene--"+kind} key={replay}>
    <div className="visual-head"><SceneLabel>{isGlass?"REFRACTIVE SURFACE":isGlow?"EDGE LIGHT":isGradient?"COLOR FIELD":isLight?"LIGHT SWEEP":isReflection?"ENVIRONMENT REFLECTION":isChromatic?"CHROMATIC SHIFT":"ORGANIC GEOMETRY"}</SceneLabel><span>OPTICAL STUDY / 0{kind.length%9+1}</span></div>
    <div className={"visual-stage"+(isGradient?" visual-stage--gradient":"")}>
      <div className="visual-backdrop visual-backdrop--one"/><div className="visual-backdrop visual-backdrop--two"/>
      <svg className="visual-contours" viewBox="0 0 500 300" preserveAspectRatio="none">{[0,1,2,3,4,5].map(i=><motion.ellipse key={i} cx="250" cy="150" rx={65+i*24} ry={28+i*16} fill="none" stroke="currentColor" strokeOpacity={.09-i*.008} strokeWidth="1" animate={reduce?undefined:{rotate:[0,i%2?12:-12,0],rx:[65+i*24,72+i*24,65+i*24]}} transition={{duration:9+i,repeat:Infinity,ease:"easeInOut"}}/>)}</svg>
      {kind==="gooey" ? <div className="gooey-pair"><motion.div animate={reduce?undefined:{x:[-28,0,-28],scale:[1,1.18,1]}} transition={{duration:3.6,repeat:Infinity,ease:"easeInOut"}}/><motion.div animate={reduce?undefined:{x:[28,0,28],scale:[1,1.18,1]}} transition={{duration:3.6,repeat:Infinity,ease:"easeInOut",delay:.2}}/></div> :
        <motion.div className={"visual-object"+(isGlass?" visual-object--glass":"")+(isGlow?" visual-object--glow":"")+(isChromatic?" visual-object--chromatic":"")+(isReflection?" visual-object--reflection":"")} initial={reduce?false:{opacity:0,scale:.72,rotate:-16,y:16}} animate={reduce?{opacity:1,scale:1}: {opacity:1,scale:1,rotate:0,y:0,...effect.animate as object}} transition={reduce?{duration:0}:{...effect.transition as object,delay:.05}}><div className="visual-object-inner"/><i/><i/><i/></motion.div>}
      {isLight&&<motion.div className="light-beam" animate={reduce?undefined:{x:["-45%","45%","-45%"],opacity:[.15,.85,.15]}} transition={{duration:4.6,repeat:Infinity,ease:"easeInOut"}}/>}
      {isGlass&&<div className="glass-reflection"><i/><i/></div>}
      {Array.from({length:8},(_,i)=><motion.i key={i} className={"visual-particle visual-particle--"+i} animate={reduce?undefined:{y:[0,(i%2?1:-1)*(8+i*2),0],x:[0,(i%3-1)*9,0],opacity:[.18,.65,.18]}} transition={{duration:3.2+i*.34,repeat:Infinity,delay:i*.13,ease:"easeInOut"}}/>)}
    </div>
    <div className="visual-foot"><span>{isGlass?"LAYERED BLUR + EDGE HIGHLIGHT":isGradient?"SLOW COLOR INTERPOLATION":isReflection?"REFLECTIVE SURFACE":isChromatic?"RGB CHANNEL OFFSET":"CONTINUOUS, LOW-AMPLITUDE MOTION"}</span><span><i/> LOOPING STUDY</span></div>
  </div>;
}

function ProductScene({ kind, replay, slug }: { kind: string; replay: number; slug: string }) {
  const reduce = Boolean(useReducedMotion());
  const [done,setDone]=useState(false);
  const [command,setCommand]=useState(false);
  const isCommand=kind==="command";
  const isTokens=kind==="tokens";
  const isTrace=kind==="trace";
  const isPresence=kind==="presence";
  const isOptimistic=slug==="optimistic-ui-reconciliation";
  const isInterruptible=slug==="interruptible-state-transition";
  const isGraph=kind==="graph"||kind==="workflow";
  const isDiff=kind==="diff";
  const items=isTokens?["We can","make this","feel much","more alive."]:isTrace?["Collect context","Plan animation","Render frames","Done"]:["Collect events","Transform data","Ship update"];
  return <div className={"motion-scene product-scene product-scene--"+kind} key={replay}>
    <div className="product-scene-head"><SceneLabel>{isCommand?"COMMAND SURFACE":isTokens?"STREAMING TEXT":isTrace?"TASK TIMELINE":isPresence?"COLLABORATION":isGraph?"WORKFLOW GRAPH":isDiff?"STATE RECONCILIATION":isOptimistic?"OPTIMISTIC RECONCILIATION":isInterruptible?"INTERRUPTIBLE TRANSITION":"PRODUCT FEEDBACK"}</SceneLabel><span className="product-scene-state"><i/> {done?"COMPLETE":"IN PROGRESS"}</span></div>
    {isCommand ? <div className="command-demo"><button type="button" className="command-trigger" onClick={()=>setCommand(v=>!v)}><Command size={15}/><span>Open command palette</span><kbd>⌘ K</kbd></button><AnimatePresence>{command&&<motion.div className="command-panel" initial={{opacity:0,y:12,scale:.97,filter:"blur(5px)"}} animate={{opacity:1,y:0,scale:1,filter:"blur(0px)"}} exit={{opacity:0,y:8,scale:.98}} transition={{duration:reduce?0:.3,ease}}><div className="command-search"><span>⌕</span> Search actions…<kbd>ESC</kbd></div>{["Create new motion study","Open animation library","Copy current component"].map((t,i)=><button type="button" key={t} className="command-result" onClick={()=>setCommand(false)}><span>{["✳","▦","⌘"][i]}</span>{t}<ArrowRight size={12}/></button>)}</motion.div>}</AnimatePresence></div>
    : isGraph ? <div className="product-graph"><svg viewBox="0 0 450 220"><path d="M55 110 H140 M180 110 H265 M305 110 H390 M160 88 V48 H285 V88 M285 132 V174 H160 V132" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="1.5"/>{[0,1,2,3,4].map(i=><motion.circle key={i} cx={[55,160,285,390,222][i]} cy={[110,110,110,110,48][i]} r="4" fill="#9a88eb" initial={{opacity:.2}} animate={{opacity:[.25,1,.25]}} transition={{duration:1.7,repeat:Infinity,delay:i*.22,ease:"easeInOut"}}/>)}</svg>{["Trigger","Agent","Review","Publish"].map((t,i)=><motion.div className={"product-node product-node--"+i} key={t} initial={reduce?false:{opacity:0,scale:.86,y:8}} animate={{opacity:1,scale:1,y:0}} transition={{duration:reduce?0:.5,delay:reduce?0:i*.14,ease}}><span>{String(i+1).padStart(2,"0")}</span><strong>{t}</strong><small>{i===3?"Waiting":i===1?"Running":"Ready"}</small></motion.div>)}</div>
    : isPresence ? <div className="presence-canvas"><div className="presence-doc"><div className="presence-doc-bar"><span>OUR SHARED CANVAS</span><span>2 PEOPLE HERE</span></div><div className="presence-doc-title">A thoughtful<br/><em>work in progress.</em></div><div className="presence-doc-lines"><i/><i/><i/></div><motion.div className="presence-selection" animate={reduce?undefined:{x:[0,44,18,0],y:[0,15,32,0]}} transition={{duration:7,repeat:Infinity,ease:"easeInOut"}}><span>sohail · editing</span></motion.div><motion.div className="presence-selection presence-selection--two" animate={reduce?undefined:{x:[0,-22,28,0],y:[0,23,8,0]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut",delay:.4}}><span>guest · selected</span></motion.div></div></div>
    : isDiff ? <div className="diff-comparison"><div className="diff-row diff-row--removed"><span>−</span><code>duration: 240ms</code><small>PREVIOUS</small></div><motion.div className="diff-row diff-row--added" animate={{x:[8,0],opacity:[0,1]}} transition={{duration:reduce?0:.5,delay:.18,ease}}><span>+</span><code>duration: {done?"240ms":"560ms"}</code><small>{done?"RESTORED":"UPDATED"}</small></motion.div><div className="diff-note"><span><Check size={12}/> Transition {done?"restored":"reconciled"}</span><button onClick={()=>setDone(v=>!v)} type="button">{done?"Redo change":"Undo change"}</button></div></div>
    : isOptimistic ? <div className="optimistic-demo"><div className="optimistic-card"><span className="optimistic-check"><Check size={14}/></span><div><strong>Save motion preset</strong><small>{done?"Server confirmed":"Saved locally · syncing…"}</small></div><button type="button" onClick={()=>setDone(v=>!v)}>{done?"Undo":"Save"}</button></div><motion.div className="sync-track" animate={{scaleX:done?1:[.28,.82,.28]}} transition={{duration:done ? .3 : 1.8,repeat:done?0:Infinity,ease:"easeInOut"}}/><span className="sync-caption">{done?"SYNC COMPLETE":"OPTIMISTIC UI → SERVER CONFIRMATION"}</span></div>
    : isInterruptible ? <div className="interruptible-demo"><span>INTERRUPT THE SEQUENCE</span><motion.div className="interruptible-orb" animate={done?{x:84,rotate:90,borderRadius:"50% 50% 18% 18%"}:{x:-84,rotate:-90,borderRadius:"18% 18% 50% 50%"}} transition={{type:"spring",stiffness:95,damping:15}}/><div className="interruptible-actions"><button type="button" onClick={()=>setDone(false)}>State A</button><button type="button" onClick={()=>setDone(true)}>State B</button></div></div>
    : <div className="product-steps">{items.map((item,i)=><motion.div className={"product-step"+(done||i<items.length-1?" product-step--done":"")} key={item} initial={reduce?false:{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.45,delay:reduce?0:i*.16,ease}}><span className="product-step-icon">{done||i<items.length-1?<Check size={12}/>:<i/>}</span><div><strong>{item}</strong><small>{done||i<items.length-1?"Complete":"Processing…"}</small></div>{isTokens&&<motion.div className="token-caret" animate={reduce?undefined:{opacity:[1,0,1]}} transition={{duration:.85,repeat:Infinity}}/>}</motion.div>)}</div>}
    <div className="product-scene-bottom"><span>{isDiff?"UPDATE / RECONCILED":isPresence?"2 EDITORS · SHARED STATE":isTokens?"TOKENS ARRIVE IN ORDER":"TRANSITIONS BETWEEN STATES"}</span><button type="button" onClick={()=>setDone(v=>!v)}>{done?"Reset sequence":"Complete sequence"} <ArrowRight size={12}/></button></div>
  </div>;
}

function AnimationStage({ animation, replay }: { animation: Animation; replay: number }) {
  const { kind, slug } = animation;
  if (kind === "portal") return <PortalScene replay={replay}/>;
  if (["drag","tilt","magnetic","nav","flip","expand","shared","spring"].includes(kind)) return <InteractiveScene kind={kind} replay={replay}/>;
  if (["timeline","pin","horizontal","mask","parallax"].includes(kind) || ["scroll-driven-camera-flight","scroll-linked-type-deformation","scroll-synchronized-data","narrative-state-transformation","continuous-section-morphing"].includes(slug)) return <ScrollScene kind={kind==="dolly"?"timeline":kind} replay={replay} slug={slug}/>;
  if (["kinetic","tokens","trace"].includes(kind)) return <TypeScene kind={kind} replay={replay}/>;
  if (["graph","wireframe","stream","particles"].includes(kind) || slug === "autonomous-agent-orchestration") return <NetworkScene kind={kind} replay={replay} slug={slug}/>;
  if (["command","diff","presence","workflow"].includes(kind) || ["optimistic-ui-reconciliation","interruptible-state-transition"].includes(slug)) return <ProductScene kind={kind} replay={replay} slug={slug}/>;
  if (["assembly","depth","dolly","chart","state"].includes(kind)) return <InterfaceScene kind={kind} replay={replay}/>;
  return <VisualScene kind={kind} replay={replay}/>;
}

export function MiniArtwork({ animation }: { animation: Animation }) {
  const reduce = Boolean(useReducedMotion());
  const looping = ["liquid","morph","gooey","particles","glow","gradient","light","reflection","workflow","graph","stream","wireframe"].includes(animation.kind);
  const particleDots = Array.from({ length: 22 }, (_, i) => {
    const angle = (i / 22) * Math.PI * 2;
    const radius = 17 + (i % 5) * 6;
    return { left: 50 + Math.cos(angle) * radius, top: 50 + Math.sin(angle) * radius, delay: i * .035 };
  });
  const bars = [34, 58, 43, 76, 51, 88, 64, 96, 73, 82, 49, 91];
  const scene = (() => {
    if (animation.kind === "kinetic") return <div className="mini-scene mini-scene--type"><span>TYPE / 001</span><strong>Make<br/><em>it move.</em></strong><i/><small>VARIABLE FONT · 0.8S</small></div>;
    if (animation.kind === "particles" || animation.kind === "light") return <div className={"mini-scene mini-scene--particles mini-scene--"+animation.kind}>{particleDots.map((dot,i)=><motion.i key={i} style={{left:dot.left+"%",top:dot.top+"%"}} animate={reduce?undefined:{x:[0,Math.cos(i)*((i%3)*5+3),0],y:[0,Math.sin(i)*((i%4)*5+3),0],opacity:[.2,.95,.2],scale:[.65,1.3,.65]}} transition={{duration:2.6+(i%5)*.45,repeat:Infinity,delay:dot.delay,ease:"easeInOut"}}/>)}<motion.div className="mini-particle-core" animate={reduce?undefined:{scale:[.86,1.08,.86],rotate:[0,45,0]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}/><span className="mini-scene-tag">{animation.kind==="light"?"LIGHT FIELD / 03":"PARTICLE SYSTEM / 22"}</span></div>;
    if (["graph","wireframe","stream","workflow","trace"].includes(animation.kind)) return <div className={"mini-scene mini-scene--network mini-scene--"+animation.kind}><svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet"><motion.path d="M30 94 L91 42 L157 92 L225 37 L291 88 M91 42 L103 143 L157 92 L223 141 L291 88 M30 94 L103 143 M225 37 L223 141" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray={animation.kind==="stream"?"5 7":"0"} animate={reduce?undefined:{strokeDashoffset:animation.kind==="stream"?[0,-48]:[0,0],opacity:[.45,1,.45]}} transition={{duration:animation.kind==="stream"?3.2:4,repeat:Infinity,ease:"linear"}}/>{[[30,94],[91,42],[157,92],[225,37],[291,88],[103,143],[223,141]].map(([cx,cy],i)=><motion.circle key={i} cx={cx} cy={cy} r={i===2?8:4.5} fill={i===2?"#b9abff":i%2?"#a4e4ce":"#f1eaff"} animate={reduce?undefined:{r:i===2?[7,10,7]:[3.5,5,3.5],opacity:[.55,1,.55]}} transition={{duration:2.3+i*.2,repeat:Infinity,ease:"easeInOut",delay:i*.08}}/>)}</svg><span className="mini-scene-tag">{animation.kind.toUpperCase()} / LIVE GRAPH</span></div>;
    if (animation.kind === "chart") return <div className="mini-scene mini-scene--chart"><div className="mini-chart-head"><span>ACTIVITY</span><strong>+28.4%</strong></div><div className="mini-chart-bars">{bars.map((height,i)=><motion.i key={i} style={{height:height+"%"}} animate={reduce?undefined:{scaleY:[.72,1,.86]}} transition={{duration:2.4,repeat:Infinity,ease:"easeInOut",delay:i*.045}}/>)}</div><svg viewBox="0 0 320 100" preserveAspectRatio="none"><motion.path d="M0 76 C24 72 30 36 58 50 S90 80 118 42 S154 55 181 28 S224 53 249 22 S288 26 320 8" fill="none" stroke="#d8ccff" strokeWidth="2.5" strokeLinecap="round" initial={reduce?false:{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.7,ease:[.22,1,.36,1]}}/></svg><span className="mini-scene-tag">SCROLL-SYNC / SVG</span></div>;
    if (animation.kind === "portal" || animation.kind === "mask") return <div className={"mini-scene mini-scene--portal mini-scene--"+animation.kind}><div className="mini-portal-copy"><span>CHAPTER / 02</span><strong>Beyond<br/>the surface.</strong></div><motion.div className="mini-portal-disc" animate={reduce?undefined:{clipPath:["circle(18% at 50% 50%)","circle(70% at 50% 50%)","circle(18% at 50% 50%)"],rotate:[0,8,0]}} transition={{duration:5.5,repeat:Infinity,ease:"easeInOut"}}><i/><i/><i/></motion.div><span className="mini-scene-tag">MASK REVEAL / 0.8S</span></div>;
    if (["timeline","pin","horizontal","parallax","dolly","assembly","depth","state","shared","flip","spring","magnetic","drag","tilt","nav","expand","command","diff","presence","tokens"].includes(animation.kind)) return <div className={"mini-scene mini-scene--product mini-scene--"+animation.kind}><div className="mini-product-top"><span>STUDIO / INTERFACE</span><span>↗</span></div><div className="mini-product-window"><div className="mini-product-sidebar"><i/><i/><i/><i/></div><div className="mini-product-content"><div className="mini-product-heading"><i/><i/></div><div className="mini-product-metrics"><i/><i/><i/></div><div className="mini-product-chart">{[38,65,45,82,55,94,69].map((height,i)=><motion.i key={i} style={{height:height+"%"}} animate={reduce?undefined:{height:[height+"%",Math.max(15,height-16)+"%",height+"%"]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut",delay:i*.06}}/>)}</div></div></div><motion.div className="mini-product-float" animate={reduce?undefined:{y:[0,-8,0],rotate:[2,-2,2]}} transition={{duration:4.2,repeat:Infinity,ease:"easeInOut"}}><span/><strong>{animation.kind==="drag"?"DRAG ME":animation.kind==="spring"?"SPRING / 08":animation.kind==="flip"?"FLIP STATE":"IN MOTION"}</strong><i/></motion.div><span className="mini-scene-tag">{animation.kind.toUpperCase()} / UI STUDY</span></div>;
    if (["gradient","glass","glow","reflection","chromatic","liquid","morph","gooey","visual"].includes(animation.kind)) return <div className={"mini-scene mini-scene--material mini-scene--"+animation.kind}><div className="mini-material-grid"/><motion.div className="mini-material-surface" animate={reduce?undefined:{rotate:[-8,4,-8],scale:[.94,1.04,.94],borderRadius:["42% 58% 55% 45%","60% 40% 37% 63%","42% 58% 55% 45%"]}} transition={{duration:5.6,repeat:Infinity,ease:"easeInOut"}}/><motion.div className="mini-material-orbit" animate={reduce?undefined:{rotate:[0,180,360]}} transition={{duration:18,repeat:Infinity,ease:"linear"}}/><span className="mini-scene-tag">{animation.kind.toUpperCase()} / MATERIAL STUDY</span></div>;
    return <div className={"mini-scene mini-scene--product mini-scene--"+animation.kind}><div className="mini-product-top"><span>MOTION SYSTEM</span><span>↗</span></div><div className="mini-product-window"><div className="mini-product-sidebar"><i/><i/><i/></div><div className="mini-product-content"><div className="mini-product-heading"><i/><i/></div><div className="mini-product-metrics"><i/><i/><i/></div><div className="mini-product-chart">{bars.slice(0,7).map((height,i)=><i key={i} style={{height:height+"%"}/>)}</div></div></div><span className="mini-scene-tag">{animation.kind.toUpperCase()} / STUDY</span></div>;
  })();
  return <div className={"mini-art mini-art--"+animation.kind} aria-hidden="true">
    <div className="mini-art-grid"/><div className="mini-art-glow"/>
    {scene}
    <div className="mini-art-caption"><span>{animation.category.toUpperCase()}</span><span>↗</span></div>
  </div>;
}
export function PreviewFrame({ animation }: { animation: Animation }) {
  const [previewTheme,setPreviewTheme]=useState<"dark"|"light">("dark");
  const [replayKey,setReplayKey]=useState(0);
  return <section className={"preview-frame preview-frame--"+animation.size} data-preview-theme={previewTheme}>
    <div className="preview-toolbar">
      <div className="preview-toolbar-label"><span className="preview-live-dot"/> LIVE PREVIEW <span>/</span> {animation.size.toUpperCase()} CANVAS</div>
      <div className="preview-toolbar-actions">
        
        <button className="preview-tool" type="button" aria-label="Replay animation" onClick={()=>setReplayKey(n=>n+1)} title="Replay">↻</button>
        <button className="preview-tool" type="button" aria-label={"Switch preview to "+(previewTheme==="dark"?"light":"dark")} onClick={()=>setPreviewTheme(t=>t==="dark"?"light":"dark")} title="Toggle preview theme">{previewTheme==="dark"?"☼":"◐"}</button>
      </div>
    </div>
    <div className="preview-canvas">
      <div className="preview-grid"/>
      <div className="preview-stage-wrap" key={replayKey}><AnimationStage animation={animation} replay={replayKey}/></div>
      <div className="preview-caption"><span>{animation.name}</span><span>INTERACTIVE STUDY / {animation.category.toUpperCase()}</span></div>
    </div>
  </section>;
}
