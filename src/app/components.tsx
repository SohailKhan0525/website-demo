"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Code2, Copy, Github, Moon, Search, Sun, X } from "lucide-react";
import { animations, categories, type Animation } from "./animations";
import { MiniArtwork, PreviewFrame } from "./preview";

type Theme = "light" | "dark";
type CodeTab = "Component" | "CSS" | "Setup";

function useSiteTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const stored = window.localStorage.getItem("motion-shelf-theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("motion-shelf-theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

function ThemeButton({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  return <button className="theme-toggle" type="button" aria-label={"Switch to " + (theme === "light" ? "dark" : "light") + " theme"} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={15} /> : <Sun size={15} />}<span>{theme === "light" ? "Dark" : "Light"}</span></button>;
}

function Header({ theme, setTheme, detail = false }: { theme: Theme; setTheme: (theme: Theme) => void; detail?: boolean }) {
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="wordmark" aria-label="Motion Shelf home"><span className="wordmark-symbol">m<span>.</span></span><span>motion shelf</span></Link>
    <nav className="header-nav" aria-label="Main navigation">
      {detail ? <Link href="/#library" className="header-link"><ArrowLeft size={14} /> Browse library</Link> : <a href="#library" className="header-link">Library <span className="header-count">{animations.length}</span></a>}
      <a href="https://github.com/SohailKhan0525/website-demo" target="_blank" rel="noreferrer" className="header-link">Source <ArrowUpRight size={13} /></a>
    </nav>
    <ThemeButton theme={theme} setTheme={setTheme} />
  </div></header>;
}

function AuthorNote({ compact = false }: { compact?: boolean }) {
  return <div className={"author-note" + (compact ? " author-note--compact" : "")}>
    <span className="author-avatar">SK</span>
    <span className="author-copy"><strong>Made by Sohail Khan</strong><small>One-person project · built with AI assistance from ChatGPT</small></span>
    <a href="https://github.com/SohailKhan0525" target="_blank" rel="noreferrer" aria-label="Sohail Khan on GitHub"><ArrowUpRight size={14} /></a>
  </div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow"><span className="eyebrow-dot" />{children}</div>;
}

function AnimationCard({ animation, index }: { animation: Animation; index: number }) {
  const reduced = useReducedMotion();
  return <motion.article className="animation-card" layout initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.42, delay: (index % 3) * 0.035, ease: [0.22, 1, 0.36, 1] }} whileHover={reduced ? undefined : { y: -3 }} >
    <Link href={"/" + animation.slug} className="animation-card-link" aria-label={"Open " + animation.name}>
      <div className="animation-card-meta"><span>{String(index + 1).padStart(2, "0")}</span><span>{animation.category}</span><ArrowUpRight size={14} /></div>
      <MiniArtwork animation={animation} />
      <div className="animation-card-copy"><h3>{animation.name}</h3><p>{animation.description}</p>
        <div className="animation-card-foot"><span>Code included</span><span>View study <ChevronRight size={13} /></span></div>
      </div>
    </Link>
  </motion.article>;
}

export function HomePage() {
  const { theme, setTheme } = useSiteTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const reduced = useReducedMotion();
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return animations.filter((animation) => (category === "All" || animation.category === category) && (!q || [animation.name, animation.description, animation.category, ...animation.tags].join(" ").toLowerCase().includes(q)));
  }, [query, category]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        document.getElementById("animation-search")?.focus();
      }
      if (event.key === "Escape") {
        setQuery("");
        (document.activeElement as HTMLElement | null)?.blur?.();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <div className="app-shell" data-theme={theme}>
    <Header theme={theme} setTheme={setTheme} />
    <main>
      <section className="hero">
        <div className="hero-content">
          <motion.div initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}><Eyebrow>AN INDEPENDENT MOTION LIBRARY</Eyebrow></motion.div>
          <motion.h1 initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .04, ease: [0.22, 1, 0.36, 1] }}>Good interfaces<br />have <em>good timing.</em></motion.h1>
          <motion.p className="hero-description" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .12 }}>A growing shelf of motion studies for the web. See the effect, read the implementation, and take the code into your own project.</motion.p>
          <motion.div className="hero-actions" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .18 }}>
            <a href="#library" className="button button-primary">Explore the library <ArrowDown size={15} /></a>
            <a href="https://github.com/SohailKhan0525/website-demo" target="_blank" rel="noreferrer" className="button button-secondary"><Github size={15} /> View source</a>
          </motion.div>
          <div className="hero-principles"><span><i /> Copyable code</span><span><i /> Contained previews</span><span><i /> Open source</span></div>
        </div>
        <motion.div className="hero-demo" initial={reduced ? false : { opacity: 0, scale: .985, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .7, delay: .08, ease: [0.22, 1, 0.36, 1] }}>
          <div className="hero-demo-bar"><span><i /><i /><i /></span><span>LIVE STUDY / 001</span><span>CSS + MOTION</span></div>
          <div className="hero-demo-stage">
            <div className="demo-orbit demo-orbit-one" /><div className="demo-orbit demo-orbit-two" />
            <motion.div className="demo-object" animate={reduced ? undefined : { y: [0, -8, 0], rotate: [-4, 1, -4], borderRadius: ["28% 72% 61% 39%", "55% 45% 38% 62%", "28% 72% 61% 39%"] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}><span /></motion.div>
            <motion.div className="demo-label demo-label--left" animate={reduced ? undefined : { y: [0, 4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><span>01</span> Shape morph</motion.div>
            <motion.div className="demo-label demo-label--right" animate={reduced ? undefined : { y: [0, -4, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}><span>02</span> Spring settle</motion.div>
            <div className="demo-stage-index">A SMALL MOTION STUDY <span>↗</span></div>
          </div>
          <div className="hero-demo-footer"><span>One effect at a time.</span><span>Nothing hidden behind a full-page preview.</span></div>
        </motion.div>
      </section>

      <section id="library" className="library-section">
        <div className="section-heading"><div><Eyebrow>THE COLLECTION</Eyebrow><h2>Browse the studies.</h2><p>Small, focused examples. Each page shows what moves and how to copy it.</p></div><div className="collection-count"><strong>{String(animations.length).padStart(2, "0")}</strong><span>STUDIES IN THIS VERSION</span></div></div>
        <div className="library-toolbar">
          <div className="category-tabs" role="group" aria-label="Filter by category">{categories.map((item) => <button key={item} type="button" className={"category-tab" + (category === item ? " is-active" : "")} onClick={() => setCategory(item)}>{item}<span>{item === "All" ? animations.length : animations.filter((a) => a.category === item).length}</span></button>)}</div>
          <label className="search-field"><Search size={15} /><input id="animation-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an animation..." /><kbd>/</kbd>{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button>}</label>
        </div>
        <div className="results-summary"><span>{filtered.length} {filtered.length === 1 ? "study" : "studies"}</span><span>{query || category !== "All" ? "Filtered collection" : "Browse at your own pace"}</span></div>
        {filtered.length ? <motion.div layout className="animation-grid">{filtered.map((animation) => <AnimationCard key={animation.slug} animation={animation} index={animations.findIndex((item) => item.slug === animation.slug)} />)}</motion.div> : <div className="empty-state"><Search size={20} /><h3>Nothing matched that search.</h3><p>Try another word or clear the category filter.</p><button className="button button-secondary" onClick={() => { setQuery(""); setCategory("All"); }}>Reset filters</button></div>}
      </section>

      <section className="about-section" id="about">
        <div className="about-copy"><Eyebrow>THE PERSON BEHIND IT</Eyebrow><h2>Built in public.<br /><em>One person at a time.</em></h2><p>Motion Shelf is a solo project by Sohail Khan. I’m building it to make motion easier to learn, inspect, and reuse—not to pretend every experiment is production-ready.</p><p>Some studies are polished CSS or Motion examples; others are clearly marked starting points for more advanced canvas or WebGL work. The code should tell you what it actually does.</p><a className="text-link" href="https://github.com/SohailKhan0525/website-demo" target="_blank" rel="noreferrer">Read the source on GitHub <ArrowUpRight size={14} /></a></div>
        <div className="about-card"><AuthorNote /><div className="about-card-divider" /><p>Project owner and maintainer: <strong>Sohail Khan</strong>. Built with <strong>ChatGPT</strong> as an AI coding collaborator.</p><div className="about-card-links"><a href="https://github.com/SohailKhan0525" target="_blank" rel="noreferrer"><Github size={14} /> GitHub profile <ArrowUpRight size={12} /></a><a href="https://github.com/SohailKhan0525/website-demo" target="_blank" rel="noreferrer">Project repository <ArrowUpRight size={12} /></a></div></div>
      </section>
    </main>
    <Footer />
  </div>;
}

function Footer() {
  return <footer className="site-footer"><Link href="/" className="footer-wordmark"><span className="wordmark-symbol">m<span>.</span></span> motion shelf</Link><span>A small, independent project by Sohail Khan.</span><a href="https://github.com/SohailKhan0525/website-demo" target="_blank" rel="noreferrer">Open source <ArrowUpRight size={13} /></a></footer>;
}

const frameByKind: Record<string, string> = {
  assembly: "0% { transform: translate3d(0,18px,0) rotateX(8deg); opacity: .5; } 100% { transform: translate3d(0,0,0) rotateX(0); opacity: 1; }",
  dolly: "0% { transform: scale(1.04); filter: blur(3px); } 100% { transform: scale(1); filter: blur(0); }",
  portal: "0% { clip-path: circle(8% at 50% 50%); opacity: .35; } 100% { clip-path: circle(74% at 50% 50%); opacity: 1; }",
  liquid: "0%,100% { border-radius: 34% 66% 59% 41%; transform: rotate(-3deg) scale(.98); } 50% { border-radius: 62% 38% 34% 66%; transform: rotate(3deg) scale(1.02); }",
  particles: "0% { transform: scale(.76) rotate(-5deg); opacity: .45; } 100% { transform: scale(1) rotate(0); opacity: 1; }",
  light: "0% { background-position: -150% 0; } 100% { background-position: 160% 0; }",
  kinetic: "0% { letter-spacing: .12em; transform: translateY(10px); opacity: .4; } 100% { letter-spacing: -.025em; transform: translateY(0); opacity: 1; }",
  depth: "0% { transform: perspective(900px) translateZ(-80px) rotateY(-15deg); opacity: .45; } 100% { transform: perspective(900px) translateZ(0) rotateY(0); opacity: 1; }",
  morph: "0%,100% { border-radius: 58% 42% 47% 53%; transform: rotate(0); } 50% { border-radius: 38% 62% 58% 42%; transform: rotate(8deg); }",
  timeline: "0% { opacity: 0; transform: translateY(18px) scale(.98); } 100% { opacity: 1; transform: translateY(0) scale(1); }",
  mask: "0% { clip-path: inset(0 100% 0 0 round 14px); } 100% { clip-path: inset(0 0 0 0 round 14px); }",
  parallax: "0%,100% { transform: translateY(5px); } 50% { transform: translateY(-8px); }",
  state: "0% { transform: scale(.96); opacity: .65; } 100% { transform: scale(1); opacity: 1; }",
  chart: "0% { transform: scaleX(.12); opacity: .3; } 100% { transform: scaleX(1); opacity: 1; }",
  shared: "0% { transform: translate(12px,10px) scale(.88); opacity: .3; } 100% { transform: translate(0,0) scale(1); opacity: 1; }",
  flip: "0% { transform: perspective(800px) rotateY(-70deg); opacity: .3; } 100% { transform: perspective(800px) rotateY(0); opacity: 1; }",
  spring: "0% { transform: scale(.7); } 68% { transform: scale(1.04); } 100% { transform: scale(1); }",
  magnetic: "0% { transform: translate(-8px,4px); } 60% { transform: translate(2px,-1px); } 100% { transform: translate(0,0); }",
  tilt: "0% { transform: perspective(700px) rotateX(10deg) rotateY(-14deg); } 100% { transform: perspective(700px) rotateX(0) rotateY(0); }",
  gooey: "0%,100% { border-radius: 50% 48% 42% 58%; transform: scale(.98); } 50% { border-radius: 34% 66% 61% 39%; transform: scale(1.03); }",
  nav: "0% { transform: translateX(-10px) scale(.9); opacity: .25; } 100% { transform: translateX(0) scale(1); opacity: 1; }",
  expand: "0% { clip-path: inset(0 0 80% 0 round 18px); opacity: .45; } 100% { clip-path: inset(0 0 0 0 round 18px); opacity: 1; }",
  chromatic: "0%,100% { filter: drop-shadow(4px 0 rgba(255,80,155,.3)) drop-shadow(-4px 0 rgba(74,220,255,.3)); } 50% { filter: drop-shadow(0 0 transparent); }",
  glass: "0%,100% { backdrop-filter: blur(6px); box-shadow: inset 0 1px rgba(255,255,255,.24); } 50% { backdrop-filter: blur(18px); box-shadow: inset 0 1px rgba(255,255,255,.55); }",
  glow: "0%,100% { box-shadow: 0 0 18px rgba(139,124,255,.12); } 50% { box-shadow: 0 0 44px rgba(139,124,255,.35); }",
  gradient: "0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; }",
  wireframe: "0% { opacity: .3; transform: scale(.9) rotate(-3deg); } 100% { opacity: 1; transform: scale(1) rotate(0); }",
  reflection: "0%,100% { transform: perspective(800px) rotateY(-8deg); filter: brightness(.9); } 50% { transform: perspective(800px) rotateY(8deg); filter: brightness(1.15); }",
  stream: "0% { background-position: -120% 0; opacity: .4; } 100% { background-position: 180% 0; opacity: 1; }",
  trace: "0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); }",
  graph: "0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); }",
  tokens: "0% { opacity: .15; filter: blur(5px); transform: translateY(6px); } 100% { opacity: 1; filter: blur(0); transform: translateY(0); }",
  command: "0% { opacity: 0; transform: translateY(12px) scale(.97); } 100% { opacity: 1; transform: translateY(0) scale(1); }",
  diff: "0% { background-color: rgba(139,92,246,0); } 100% { background-color: rgba(139,92,246,.16); }",
  presence: "0% { transform: translateX(-12px) scale(.8); opacity: .2; } 100% { transform: translateX(0) scale(1); opacity: 1; }",
  workflow: "0%,100% { box-shadow: 0 0 0 0 rgba(128,111,255,.08); } 50% { box-shadow: 0 0 0 8px rgba(128,111,255,.02); }"
};


const snippetRecipes: Record<string, { initial: string; animate: string; transition: string }> = {
  assembly: { initial: "{ opacity: 0, y: 28, rotateX: 16, scale: .94 }", animate: "{ opacity: 1, y: 0, rotateX: 0, scale: 1 }", transition: '{ type: "spring", stiffness: 88, damping: 17 }' },
  dolly: { initial: "{ opacity: 0, scale: 1.14, y: 14 }", animate: "{ opacity: 1, scale: 1, y: 0 }", transition: '{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }' },
  portal: { initial: '{ opacity: 0, clipPath: "circle(0% at 50% 50%)", scale: .82 }', animate: '{ opacity: 1, clipPath: "circle(75% at 50% 50%)", scale: 1 }', transition: '{ duration: .85, ease: [0.76, 0, 0.24, 1] }' },
  liquid: { initial: '{ borderRadius: "30% 70% 64% 36%" }', animate: '{ borderRadius: ["30% 70% 64% 36%", "64% 36% 40% 60%", "30% 70% 64% 36%"], rotate: [-7, 5, -7] }', transition: '{ duration: 6, repeat: Infinity, ease: "easeInOut" }' },
  particles: { initial: "{ opacity: 0, scale: .2 }", animate: "{ opacity: [0.2, 1, 0.2], scale: [.5, 1.15, .5], rotate: [0, 90, 180] }", transition: '{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }' },
  light: { initial: "{ opacity: 0, x: -90 }", animate: "{ opacity: [.1, .9, .1], x: [-90, 90, -90] }", transition: '{ duration: 4, repeat: Infinity, ease: "easeInOut" }' },
  kinetic: { initial: '{ opacity: 0, y: 24, letterSpacing: ".12em" }', animate: '{ opacity: 1, y: 0, letterSpacing: "-.06em" }', transition: '{ duration: .8, ease: [0.22, 1, 0.36, 1] }' },
  depth: { initial: "{ opacity: 0, z: -90, rotateY: -20 }", animate: "{ opacity: 1, z: 0, rotateY: 0 }", transition: '{ duration: 1, ease: [0.22, 1, 0.36, 1] }' },
  morph: { initial: '{ borderRadius: "58% 42% 47% 53%" }', animate: '{ borderRadius: ["58% 42% 47% 53%", "36% 64% 58% 42%", "58% 42% 47% 53%"], rotate: [0, 12, 0] }', transition: '{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }' },
  timeline: { initial: "{ opacity: 0, y: 24 }", animate: "{ opacity: 1, y: 0 }", transition: '{ duration: .7, ease: [0.22, 1, 0.36, 1] }' },
  pin: { initial: "{ opacity: 0, scale: .9 }", animate: "{ opacity: 1, scale: 1 }", transition: '{ type: "spring", stiffness: 85, damping: 16 }' },
  horizontal: { initial: "{ opacity: 0, x: -36 }", animate: "{ opacity: 1, x: 0 }", transition: '{ duration: .8, ease: [0.22, 1, 0.36, 1] }' },
  mask: { initial: '{ clipPath: "inset(0 100% 0 0 round 14px)" }', animate: '{ clipPath: "inset(0 0 0 0 round 14px)" }', transition: '{ duration: .9, ease: [0.76, 0, 0.24, 1] }' },
  parallax: { initial: "{ y: 12, opacity: .6 }", animate: "{ y: [5, -8, 5], opacity: 1 }", transition: '{ duration: 4, repeat: Infinity, ease: "easeInOut" }' },
  state: { initial: "{ opacity: 0, scale: .92 }", animate: "{ opacity: 1, scale: [1, 1.025, 1] }", transition: '{ duration: .8, ease: "easeOut" }' },
  chart: { initial: "{ opacity: 0, scaleX: .1 }", animate: "{ opacity: 1, scaleX: 1 }", transition: '{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }' },
  shared: { initial: "{ opacity: 0, x: 20, y: 12, scale: .84 }", animate: "{ opacity: 1, x: 0, y: 0, scale: 1 }", transition: '{ type: "spring", stiffness: 95, damping: 16 }' },
  flip: { initial: "{ opacity: 0, rotateY: -75 }", animate: "{ opacity: 1, rotateY: 0 }", transition: '{ duration: .75, ease: [0.22, 1, 0.36, 1] }' },
  spring: { initial: "{ scale: .62, y: 22 }", animate: "{ scale: [.62, 1.06, 1], y: [22, -3, 0] }", transition: '{ type: "spring", stiffness: 180, damping: 12 }' },
  magnetic: { initial: "{ opacity: 0, y: 10 }", animate: "{ opacity: 1, y: 0 }", transition: '{ type: "spring", stiffness: 160, damping: 16 }' },
  drag: { initial: "{ x: 0, rotate: 0 }", animate: "{ x: 0, rotate: 0 }", transition: '{ type: "spring", stiffness: 72, damping: 16 }' },
  tilt: { initial: "{ opacity: 0, rotateX: 14, rotateY: -18 }", animate: "{ opacity: 1, rotateX: 0, rotateY: 0 }", transition: '{ type: "spring", stiffness: 90, damping: 16 }' },
  gooey: { initial: '{ borderRadius: "50% 48% 42% 58%" }', animate: '{ borderRadius: ["50% 48% 42% 58%", "30% 70% 62% 38%", "50% 48% 42% 58%"], x: [-14, 12, -14] }', transition: '{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }' },
  nav: { initial: "{ opacity: 0, x: -12 }", animate: "{ opacity: 1, x: 0 }", transition: '{ type: "spring", stiffness: 140, damping: 15 }' },
  expand: { initial: "{ opacity: 0, height: 0 }", animate: "{ opacity: 1, height: " + '"auto"' + " }", transition: '{ duration: .35, ease: [0.22, 1, 0.36, 1] }' },
  chromatic: { initial: "{ opacity: 0, x: -4 }", animate: "{ opacity: 1, x: 0 }", transition: '{ duration: .75, ease: "easeOut" }' },
  glass: { initial: "{ opacity: 0, y: 12 }", animate: "{ opacity: 1, y: 0 }", transition: '{ duration: .9, ease: [0.22, 1, 0.36, 1] }' },
  glow: { initial: '{ boxShadow: "0 0 12px rgba(120,100,220,.1)" }', animate: '{ boxShadow: ["0 0 12px rgba(120,100,220,.1)", "0 0 48px rgba(120,100,220,.46)", "0 0 12px rgba(120,100,220,.1)"] }', transition: '{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }' },
  gradient: { initial: '{ backgroundPosition: "0% 50%" }', animate: '{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }', transition: '{ duration: 7, repeat: Infinity, ease: "linear" }' },
  wireframe: { initial: "{ opacity: 0, scale: .7 }", animate: "{ opacity: [0.3, 1, 0.3], scale: [0.9, 1, 0.9] }", transition: '{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }' },
  reflection: { initial: "{ rotateY: -18, opacity: .7 }", animate: "{ rotateY: [-18, 18, -18], opacity: 1 }", transition: '{ duration: 5, repeat: Infinity, ease: "easeInOut" }' },
  stream: { initial: "{ opacity: 0, x: -18 }", animate: "{ opacity: [0.25, 1, 0.25], x: [-18, 0, 18] }", transition: '{ duration: 2.2, repeat: Infinity, ease: "linear" }' },
  trace: { initial: "{ opacity: 0, y: 14 }", animate: "{ opacity: 1, y: 0 }", transition: '{ duration: .55, ease: "easeOut" }' },
  graph: { initial: "{ opacity: 0, scale: .85 }", animate: "{ opacity: [0.3, 1, 0.3], scale: [0.96, 1.02, 0.96] }", transition: '{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }' },
  tokens: { initial: '{ opacity: 0, y: 8, filter: "blur(5px)" }', animate: '{ opacity: 1, y: 0, filter: "blur(0px)" }', transition: '{ duration: .65, ease: "easeOut" }' },
  command: { initial: '{ opacity: 0, y: 12, scale: .96 }', animate: '{ opacity: 1, y: 0, scale: 1 }', transition: '{ type: "spring", stiffness: 100, damping: 16 }' },
  diff: { initial: "{ opacity: 0, x: 12 }", animate: "{ opacity: 1, x: 0 }", transition: '{ duration: .55, ease: "easeOut" }' },
  presence: { initial: "{ opacity: 0, x: -12 }", animate: "{ opacity: 1, x: 0 }", transition: '{ type: "spring", stiffness: 120, damping: 14 }' },
  workflow: { initial: "{ opacity: 0, scale: .94 }", animate: "{ opacity: [0.75, 1, 0.9, 1], scale: [0.97, 1, .98, 1] }", transition: '{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }' },
};

function componentSnippet(animation: Animation) {
  const componentName = animation.slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  const recipe = snippetRecipes[animation.kind] || snippetRecipes.morph;
  const interaction = animation.kind === "drag"
    ? ' drag={!reduced} dragElastic={.18} dragMomentum={!reduced}'
    : animation.kind === "tilt"
      ? ' whileHover={!reduced ? { rotateX: 12, rotateY: -16 } : undefined}'
      : animation.kind === "magnetic"
        ? ' whileHover={!reduced ? { x: 10, y: -5, scale: 1.04, transition: { type: "spring", stiffness: 180, damping: 18 } } : undefined}'
        : animation.kind === "spring"
          ? ' whileHover={!reduced ? { y: -4, scale: 1.04 } : undefined} whileTap={!reduced ? { scale: .9 } : undefined}'
          : animation.kind === "flip"
            ? ' whileHover={!reduced ? { rotateY: 180 } : undefined}'
            : animation.kind === "expand"
              ? ' whileHover={!reduced ? { scale: 1.02 } : undefined}'
              : '';
  let scene = '<motion.div className="motion-study__shape" aria-hidden="true" />';
  if (animation.kind === "kinetic") {
    scene = '<motion.div className="motion-study__kinetic"><motion.span initial={reduced ? false : { y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .12, duration: .7 }}>Move</motion.span><motion.span initial={reduced ? false : { y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .24, duration: .7 }}>with intent.</motion.span></motion.div>';
  } else if (animation.kind === "particles") {
    scene = '<div className="motion-study__particles">{Array.from({ length: 18 }, (_, i) => <motion.i key={i} animate={reduced ? undefined : { x: [0, (i % 2 ? 1 : -1) * 18, 0], y: [0, -18, 0], opacity: [.2, 1, .2] }} transition={{ duration: 2.8 + (i % 4) * .3, repeat: Infinity, delay: i * .04 }} />)}</div>';
  } else if (animation.kind === "chart") {
    scene = '<svg className="motion-study__chart" viewBox="0 0 320 100"><motion.path d="M0 80 C40 70 52 25 92 52 S145 70 173 37 S225 48 252 24 S287 20 320 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 1.5, ease: [0.22, 1, 0.36, 1] }} /></svg>';
  } else if (animation.kind === "graph" || animation.kind === "wireframe" || animation.kind === "stream") {
    scene = '<svg className="motion-study__network" viewBox="0 0 320 150"><motion.path d="M20 75 L82 25 L150 75 L218 25 L300 75 M82 25 L95 128 L150 75 L232 126 L300 75" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1, strokeDashoffset: animation.kind === "stream" ? [0, -30] : 0 }} transition={{ duration: reduced ? 0 : 2, repeat: animation.kind === "stream" && !reduced ? Infinity : 0, ease: "linear" }} /><circle cx="150" cy="75" r="8" fill="#9b8ae7" /></svg>';
  } else if (animation.kind === "tokens") {
    scene = '<div className="motion-study__tokens"><motion.span initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}>The next</motion.span><motion.span initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}>idea starts here.</motion.span></div>';
  } else if (animation.kind === "trace") {
    scene = '<div className="motion-study__trace">{["Read the brief", "Build the sequence", "Settle the motion"].map((step, i) => <motion.div key={step} initial={reduced ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduced ? 0 : i * .16, duration: reduced ? 0 : .45 }}>{step}</motion.div>)}</div>';
  } else if (animation.kind === "drag") {
    scene = '<motion.div className="motion-study__drag" drag={!reduced} dragElastic={.18} dragMomentum={!reduced} whileDrag={{ scale: 1.04 }}>Drag this object</motion.div>';
  } else if (animation.kind === "diff") {
    scene = '<div className="motion-study__diff"><del>duration: 240ms</del><motion.strong initial={reduced ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>duration: 560ms</motion.strong></div>';
  } else if (animation.kind === "presence") {
    scene = '<div className="motion-study__presence"><motion.i animate={reduced ? undefined : { x: [0, 18, 0], y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} /><motion.i animate={reduced ? undefined : { x: [0, -12, 0], y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity }} /></div>';
  }
  const content = animation.kind === "kinetic" || animation.kind === "particles" || animation.kind === "chart" || animation.kind === "graph" || animation.kind === "wireframe" || animation.kind === "stream" || animation.kind === "tokens" || animation.kind === "trace" || animation.kind === "drag" || animation.kind === "diff" || animation.kind === "presence" ? scene : '<motion.div className="motion-study__shape" aria-hidden="true" /><strong>' + animation.name + '</strong><p>' + animation.description + '</p>';
  return '"use client";\n\nimport { motion, useReducedMotion } from "motion/react";\n\nexport function ' + componentName + '() {\n  const reduced = useReducedMotion();\n  return (\n    <motion.section\n      className="motion-study motion-study--' + animation.kind + '"\n      initial={reduced ? false : ' + recipe.initial + '}\n      animate={reduced ? undefined : ' + recipe.animate + '}\n      transition={reduced ? { duration: 0 } : ' + recipe.transition + '}' + interaction + '\n      style={{ transformPerspective: 900 }}\n    >\n      <span className="motion-study__eyebrow">' + animation.category + ' / MOTION STUDY</span>\n      ' + content + '\n    </motion.section>\n  );\n}\n';
}

function cssSnippet(animation: Animation) {
  const keyframe = frameByKind[animation.kind] || frameByKind.timeline;
  return '.motion-study {\n  position: relative;\n  display: grid;\n  align-content: center;\n  justify-items: start;\n  gap: 12px;\n  width: min(100%, 520px);\n  min-height: 250px;\n  overflow: hidden;\n  padding: 28px;\n  color: #f4f1e9;\n  background: radial-gradient(circle at 82% 15%, rgba(137,116,220,.2), transparent 42%), #171714;\n  border: 1px solid rgba(255,255,255,.14);\n  border-radius: 16px;\n  isolation: isolate;\n  perspective: 900px;\n}\n\n.motion-study__eyebrow { color: #b4ad9d; font: 10px ui-monospace, monospace; letter-spacing: .12em; text-transform: uppercase; }\n.motion-study__shape { position: absolute; z-index: -1; top: 15%; right: 12%; width: 110px; aspect-ratio: 1; border: 1px solid rgba(255,255,255,.25); border-radius: 42% 58% 54% 46%; background: linear-gradient(135deg, #d7c9ff, #8774dc 52%, #b6ead8); box-shadow: 0 12px 36px rgba(137,116,220,.23); animation: motion-study-' + animation.kind + ' 3.4s ease-in-out infinite alternate; }\n.motion-study strong { position: relative; max-width: 15ch; margin-top: auto; font-size: clamp(24px,4vw,40px); line-height: 1.05; letter-spacing: -.06em; }\n.motion-study p { position: relative; max-width: 45ch; margin: 0; color: #b8b4aa; font-size: 13px; line-height: 1.65; }\n.motion-study__kinetic { display:flex; flex-direction:column; font:700 clamp(28px,5vw,48px)/.95 system-ui,sans-serif; letter-spacing:-.06em; }\n.motion-study__kinetic span { display:block; }\n.motion-study__particles { position:absolute; inset:0; }\n.motion-study__particles i { position:absolute; width:5px; height:5px; border-radius:50%; background:#9b8ae7; box-shadow:0 0 12px rgba(155,138,231,.6); }\n.motion-study__chart,.motion-study__network { display:block; width:min(100%,360px); overflow:visible; color:#a99aed; }\n.motion-study__tokens { display:flex; flex-direction:column; gap:5px; font:600 clamp(26px,4vw,42px)/1 var(--sans,system-ui); letter-spacing:-.06em; }\n.motion-study__trace { display:grid; width:100%; gap:7px; }\n.motion-study__trace div { padding:10px 12px; border:1px solid rgba(255,255,255,.14); border-radius:7px; background:#22221e; font-size:12px; }\n.motion-study__drag { display:grid; width:130px; height:110px; place-items:center; border:1px solid rgba(255,255,255,.4); border-radius:12px; color:#fff; background:linear-gradient(135deg,#a99aef,#6654b4); cursor:grab; touch-action:none; }\n.motion-study__diff { display:grid; gap:8px; font:12px ui-monospace,monospace; }\n.motion-study__diff del { padding:9px; color:#c07b84; background:rgba(192,123,132,.1); }\n.motion-study__diff strong { padding:9px; color:#77c3a7; background:rgba(119,195,167,.1); }\n.motion-study__presence { position:absolute; top:40%; left:40%; width:80px; height:50px; border:1px solid #9b8ae7; background:rgba(155,138,231,.08); }\n.motion-study__presence i { position:absolute; top:-10px; left:0; width:5px; height:5px; border-radius:50%; background:#9b8ae7; }\n.motion-study__presence i+ i { background:#70b89c; }\n\n@keyframes motion-study-' + animation.kind + ' {\n  ' + keyframe + '\n}\n\n@media (prefers-reduced-motion: reduce) { .motion-study__shape { animation: none; } }';
}

function installSnippet() {
  return "npm install motion";
}

export function AnimationDetail({ animation }: { animation: Animation }) {
  const { theme, setTheme } = useSiteTheme();
  const [tab, setTab] = useState<CodeTab>("Component");
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const code = useMemo(() => ({ Component: componentSnippet(animation), CSS: cssSnippet(animation), Setup: installSnippet() }), [animation]);
  const currentCode = code[tab];
  const index = animations.findIndex((item) => item.slug === animation.slug);
  const previous = animations[(index - 1 + animations.length) % animations.length];
  const next = animations[(index + 1) % animations.length];

  async function copyCurrent() {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { setCopied(false); }
  }

  return <div className="app-shell" data-theme={theme}>
    <Header theme={theme} setTheme={setTheme} detail />
    <main className="detail-page">
      <div className="detail-breadcrumb"><Link href="/">Library</Link><ChevronRight size={13} /><span>{animation.category}</span><ChevronRight size={13} /><span>{animation.name}</span></div>
      <section className="detail-heading"><div><Eyebrow>{animation.category.toUpperCase()} STUDY · {String(index + 1).padStart(2, "0")} / {String(animations.length).padStart(2, "0")}</Eyebrow><h1>{animation.name}</h1><p>{animation.description}</p><div className="detail-tags">{animation.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="detail-nav"><Link href={"/" + previous.slug}><ArrowLeft size={14} /> Previous</Link><Link href={"/" + next.slug}>Next <ArrowRight size={14} /></Link></div></section>
      <section className="detail-workspace">
        <div className="preview-column"><PreviewFrame animation={animation} /><div className="preview-note"><span><i /> Preview runs in your browser</span><span>Canvas: {animation.size}</span></div><div className="implementation-note"><Eyebrow>NOTES FROM THE WORKBENCH</Eyebrow><h2>Understand it.<br /><em>Then make it yours.</em></h2><p>The snippets below are a starting point, not a magic drop-in package. Copy both the component and CSS for the full treatment, then adapt the names, colors, and timing to your project.</p><div className="note-row"><span>01</span><div><strong>Keep the motion purposeful.</strong><p>Animate what changes, not everything on the screen.</p></div></div><div className="note-row"><span>02</span><div><strong>Respect reduced motion.</strong><p>The live previews honor reduced-motion preferences. Keep the fallback when adapting the snippets.</p></div></div></div></div>
        <aside className="code-column"><div className="code-panel"><div className="code-panel-heading"><div><Eyebrow>THE IMPLEMENTATION</Eyebrow><h2>Take the code.</h2></div><span className="code-file-type">{tab === "Component" ? ".tsx" : tab === "CSS" ? ".css" : "shell"}</span></div><p className="code-description">{tab === "Component" ? "A runnable Motion component starter for this effect." : tab === "CSS" ? "Styles for the stage, shape, and supporting visual details." : "Install Motion for React before using the component."}</p><div className="code-tabs" role="tablist" aria-label="Snippet type">{(["Component", "CSS", "Setup"] as CodeTab[]).map((item) => <button type="button" key={item} role="tab" aria-selected={tab === item} className={"code-tab" + (tab === item ? " is-active" : "")} onClick={() => { setTab(item); setCopied(false); }}>{item === "Component" ? <Code2 size={13} /> : item === "CSS" ? <span className="css-glyph">#</span> : <span className="terminal-glyph">$</span>}{item}</button>)}</div><div className="code-meta"><span>{tab === "Setup" ? "PACKAGE MANAGER" : tab === "CSS" ? "STYLESHEET" : "REACT COMPONENT"}</span><span>{currentCode.split("\n").length} lines</span></div><pre className="code-block"><code>{currentCode}</code></pre><div className="code-footer"><span>{tab === "Setup" ? "Required for the animated component" : "Copy, then customize"}</span><button className={"copy-button" + (copied ? " is-copied" : "")} onClick={copyCurrent}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy " + tab}</button></div><div className="code-disclaimer">This starter uses Motion for React. Copy both Component and CSS, then tune the timing and interaction for your app.</div></div>
          <div className="quick-start"><button type="button" className="quick-start-toggle" onClick={() => setShowMore(!showMore)} aria-expanded={showMore}><span><span className="quick-start-number">01</span> How to use this snippet</span><ChevronRight size={15} className={showMore ? "rotate" : ""} /></button><AnimatePresence initial={false}>{showMore && <motion.div className="quick-start-content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .24, ease: [0.22, 1, 0.36, 1] }}><p>1. Create a component file and paste the Component snippet.</p><p>2. Add the CSS snippet to a stylesheet imported by that component.</p><p>3. Tweak the duration, easing, shape, and colors. Keep the reduced-motion fallback.</p></motion.div>}</AnimatePresence></div>
          <div className="detail-pagination"><Link href={"/" + previous.slug}><span>PREVIOUS STUDY</span><strong><ArrowLeft size={14} /> {previous.name}</strong></Link><Link href={"/" + next.slug}><span>NEXT STUDY</span><strong>{next.name} <ArrowRight size={14} /></strong></Link></div>
        </aside>
      </section>
      <section className="related-section"><Eyebrow>KEEP EXPLORING</Eyebrow><h2>More from {animation.category.toLowerCase()}.</h2><div className="related-grid">{animations.filter((item) => item.category === animation.category && item.slug !== animation.slug).slice(0, 3).map((item, i) => <AnimationCard key={item.slug} animation={item} index={i} />)}</div></section>
      <div className="detail-author"><AuthorNote compact /></div>
    </main>
    <Footer />
  </div>;
}
