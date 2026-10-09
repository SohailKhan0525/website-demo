"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Code2,
  Copy, Github, Layers3, Moon, Search, SlidersHorizontal, Sparkles, Sun, Terminal, X, Zap
} from "lucide-react";
import { animations, categories, type Animation, type AnimationCategory } from "./animations";
import { MiniArtwork, PreviewFrame } from "./preview";

type Theme = "dark" | "light";
type CodeTab = "Component" | "CSS" | "Install";

function useSiteTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("motion-foundry-theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("motion-foundry-theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

function SiteHeader({ theme, setTheme, detail = false }: { theme: Theme; setTheme: (theme: Theme) => void; detail?: boolean }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-lockup" aria-label="Motion Foundry home">
          <span className="brand-mark"><Sparkles size={17} strokeWidth={1.8} /></span>
          <span className="brand-wordmark">motion<span>foundry</span></span>
          <span className="brand-version">BETA</span>
        </Link>
        <nav className="header-nav" aria-label="Main navigation">
          {detail ? <Link href="/#library" className="nav-link"><ArrowLeft size={14} /> All animations</Link> : <a href="#library" className="nav-link">Library <span className="nav-count">50</span></a>}
          <a href="https://github.com/SohailKhan0525/website-demo" className="nav-link nav-github" target="_blank" rel="noreferrer"><Github size={14} /> GitHub <ArrowUpRight size={12} /></a>
        </nav>
        <div className="header-actions">
          <span className="header-open-source"><span /> OPEN SOURCE</span>
          <button className="icon-button theme-button" aria-label={"Switch site to " + (theme === "dark" ? "light" : "dark") + " mode"} title="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroArtwork() {
  return (
    <div className="hero-artwork" aria-hidden="true">
      <div className="hero-art-grid" />
      <div className="hero-art-orbit hero-art-orbit--one" />
      <div className="hero-art-orbit hero-art-orbit--two" />
      <motion.div className="hero-art-card hero-art-card--back" animate={{ y: [0, -9, 0], rotate: [-9, -7, -9] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
        <div className="hero-card-top"><i /><i /><i /><span>TRACE / 004</span></div>
        <div className="hero-card-skeleton"><i /><i /><i /></div>
        <div className="hero-card-mini-chart"><span /><span /><span /><span /><span /><span /><span /><span /></div>
      </motion.div>
      <motion.div className="hero-art-card hero-art-card--main" animate={{ y: [0, 7, 0], rotate: [4, 2.5, 4] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}>
        <div className="hero-card-top"><span className="hero-product-icon"><Sparkles size={11} /></span><span>ORBIT / STUDIO</span><span className="hero-live">LIVE</span></div>
        <div className="hero-card-heading">Motion runtime <span>↗</span></div>
        <div className="hero-card-subtitle">Signals, synchronized.</div>
        <div className="hero-card-graph"><svg viewBox="0 0 330 105" preserveAspectRatio="none"><defs><linearGradient id="heroLine" x1="0" x2="1"><stop offset="0%" stopColor="#8075ff" /><stop offset="100%" stopColor="#b8f5df" /></linearGradient></defs><path d="M0 82 C22 78 25 57 45 64 S75 87 94 52 S125 62 144 43 S172 56 193 26 S226 52 244 36 S275 15 292 29 S314 11 330 6" stroke="url(#heroLine)" strokeWidth="2.3" fill="none" /></svg></div>
        <div className="hero-card-bottom"><span><i /> 42 transitions</span><span>+18.6%</span></div>
      </motion.div>
      <motion.div className="hero-art-toast" animate={{ x: [0, 4, 0], y: [0, -4, 0] }} transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}>
        <span className="toast-check"><Check size={13} /></span><span><b>Sequence complete</b><small>All 8 elements synchronized</small></span><span className="toast-time">now</span>
      </motion.div>
      <div className="hero-art-label hero-art-label--top"><span className="label-line" /> SPRING / 0.82</div>
      <div className="hero-art-label hero-art-label--bottom">01 — 50 <span>LIVE STUDIES</span></div>
    </div>
  );
}

function CategoryIcon({ category }: { category: string }) {
  const icon = category === "Hero" ? <Sparkles size={12} /> : category === "Scroll" ? <ArrowDown size={12} /> : category === "Interaction" ? <Zap size={12} /> : category === "Visual" ? <Layers3 size={12} /> : <Code2 size={12} />;
  return <span className="category-icon">{icon}</span>;
}

function AnimationCard({ animation, index }: { animation: Animation; index: number }) {
  return (
    <motion.article
      className="animation-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.48, delay: (index % 6) * 0.035, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
    >
      <Link href={"/" + animation.slug} className="animation-card-link" aria-label={"Preview " + animation.name}>
        <div className="animation-card-topline"><span className="card-number">{String(index + 1).padStart(2, "0")}</span><span className="card-category"><CategoryIcon category={animation.category} />{animation.category}</span><span className="card-arrow"><ArrowUpRight size={15} /></span></div>
        <MiniArtwork animation={animation} />
        <div className="animation-card-info">
          <div className="animation-card-title-row"><h3>{animation.name}</h3><span className="card-level">{animation.level === "Expert" ? "EXP" : "ADV"}</span></div>
          <p>{animation.description}</p>
          <div className="animation-card-bottom"><span className="card-library"><i />{animation.library}</span><span className="card-open">Explore <ChevronRight size={13} /></span></div>
        </div>
      </Link>
    </motion.article>
  );
}

export function HomePage() {
  const { theme, setTheme } = useSiteTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return animations.filter((animation) => {
      const matchesCategory = category === "All" || animation.category === category;
      const searchable = [animation.name, animation.description, animation.category, ...animation.tags].join(" ").toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [query, category]);

  return (
    <div className="app-shell" data-theme={theme}>
      <SiteHeader theme={theme} setTheme={setTheme} />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <motion.div className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}><span className="eyebrow-spark"><Sparkles size={12} /></span> THE MOTION COMPONENT LIBRARY <span className="eyebrow-divider" /> BUILT FOR REACT</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.78, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>Make your interface<br />feel <span className="hero-title-gradient">alive.</span></motion.h1>
            <motion.p className="hero-description" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.2 }}>A curated collection of premium motion patterns for ambitious products. Explore the effect, inspect the code, and copy it into your next build.</motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.3 }}>
              <a className="button button-primary" href="#library">Explore the library <ArrowDown size={15} /></a>
              <a className="button button-quiet" href="https://github.com/SohailKhan0525/website-demo" target="_blank" rel="noreferrer"><Github size={15} /> View source <ArrowUpRight size={14} /></a>
            </motion.div>
            <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="avatar-stack"><span>m</span><span>✳</span><span>∞</span><span>⌘</span></div>
              <p><b>50 motion studies</b><span>Open source · Copy-paste ready</span></p>
            </motion.div>
          </div>
          <HeroArtwork />
          <div className="hero-bottom-meta"><span><span className="live-indicator" /> MOTION / SYSTEM 001</span><span>AN OPEN LIBRARY FOR THE DETAILS THAT MATTER <ArrowDown size={13} /></span></div>
        </section>

        <section id="library" className="library-section">
          <div className="section-heading">
            <div><div className="section-eyebrow"><span>01</span> THE COLLECTION</div><h2>Find your next <span>signature move.</span></h2><p>Fifty thoughtfully crafted motion ideas. Each one has a live preview and copyable starter code.</p></div>
            <div className="section-total"><strong>050</strong><span>ANIMATIONS</span></div>
          </div>
          <div className="library-controls">
            <div className="category-tabs" role="group" aria-label="Filter animations by category">
              {categories.map((item) => <button key={item} className={"category-tab" + (category === item ? " is-active" : "")} onClick={() => setCategory(item)}>{item === "All" ? <Layers3 size={13} /> : <CategoryIcon category={item} />}{item}<span>{item === "All" ? animations.length : animations.filter((animation) => animation.category === item).length}</span></button>)}
            </div>
            <div className="search-wrap">
              <Search size={15} />
              <input aria-label="Search animations" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search animations..." />
              {query ? <button className="search-clear" onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button> : <kbd>/</kbd>}
              <button className={"search-filter-button" + (showFilters ? " is-active" : "")} onClick={() => setShowFilters(!showFilters)} aria-label="Toggle filter options"><SlidersHorizontal size={14} /></button>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {showFilters && <motion.div className="filter-details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><span>CURATED FOR PRODUCT TEAMS</span><span><i /> Responsive previews</span><span><i /> React + CSS snippets</span><span><i /> Light / dark canvas</span></motion.div>}
          </AnimatePresence>
          <div className="results-line"><span>SHOWING <b>{String(filtered.length).padStart(2, "0")}</b> OF {String(animations.length).padStart(2, "0")} ANIMATIONS</span><span>SORTED BY CURATION <span className="results-line-dot">✳</span></span></div>
          {filtered.length ? (
            <motion.div layout className="animation-grid">
              {filtered.map((animation) => <AnimationCard key={animation.slug} animation={animation} index={animations.findIndex((item) => item.slug === animation.slug)} />)}
            </motion.div>
          ) : (
            <div className="empty-state"><Search size={20} /><h3>No animations found</h3><p>Try a different term or category.</p><button className="button button-secondary" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters <X size={14} /></button></div>
          )}
        </section>

        <section className="closing-cta">
          <div className="closing-cta-orb" />
          <div className="closing-cta-content"><div className="section-eyebrow"><span>02</span> OPEN BY DESIGN</div><h2>Good motion is felt,<br /><span>not noticed.</span></h2><p>Take the patterns, adapt the timing, and make them part of your product. Built to be explored and remixed.</p><a className="button button-primary" href="https://github.com/SohailKhan0525/website-demo" target="_blank" rel="noreferrer">Contribute on GitHub <ArrowUpRight size={15} /></a></div>
          <div className="closing-cta-code"><span className="terminal-top"><i /><i /><i /><b>TERMINAL / 001</b></span><p><span>$</span> npm install motion</p><p><span>$</span> git clone motion-foundry</p><div className="terminal-status"><span /> READY TO SHIP</div></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return <footer className="site-footer"><Link href="/" className="footer-brand"><span className="brand-mark"><Sparkles size={14} /></span> motionfoundry</Link><span>BUILT FOR THE FEEL OF IT <i>✳</i></span><a href="https://github.com/SohailKhan0525/website-demo" target="_blank" rel="noreferrer">OPEN SOURCE <ArrowUpRight size={12} /></a></footer>;
}

type Recipe = { initial: Record<string, unknown>; animate: Record<string, unknown>; transition: Record<string, unknown> };

const recipes: Record<string, Recipe> = {
  assembly: { initial: { opacity: 0, y: 28, rotateX: 16, scale: 0.94 }, animate: { opacity: 1, y: 0, rotateX: 0, scale: 1 }, transition: { type: "spring", stiffness: 88, damping: 17 } },
  dolly: { initial: { opacity: 0, scale: 1.16, rotateX: -5 }, animate: { opacity: 1, scale: 1, rotateX: 0 }, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
  portal: { initial: { opacity: 0, clipPath: "circle(0% at 50% 50%)", scale: 0.8 }, animate: { opacity: 1, clipPath: "circle(74% at 50% 50%)", scale: 1 }, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
  liquid: { initial: { opacity: 0, rotate: -5, scale: 0.94, borderRadius: "34% 66% 59% 41%" }, animate: { opacity: 1, rotate: 3, scale: 1.02, borderRadius: "63% 37% 32% 68%" }, transition: { duration: 2.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } },
  particles: { initial: { opacity: 0, scale: 0.3, rotate: -24 }, animate: { opacity: 1, scale: 1, rotate: 0 }, transition: { type: "spring", stiffness: 54, damping: 14 } },
  light: { initial: { opacity: 0, backgroundPosition: "0% 50%" }, animate: { opacity: 1, backgroundPosition: "100% 50%" }, transition: { duration: 1.8, repeat: Infinity, repeatType: "mirror" } },
  kinetic: { initial: { opacity: 0, y: 30, letterSpacing: "0.16em" }, animate: { opacity: 1, y: 0, letterSpacing: "-0.035em" }, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  depth: { initial: { opacity: 0, z: -100, rotateY: -24, scale: 0.86 }, animate: { opacity: 1, z: 0, rotateY: 0, scale: 1 }, transition: { type: "spring", stiffness: 70, damping: 18 } },
  morph: { initial: { scale: 0.8, borderRadius: "58% 42% 47% 53%" }, animate: { scale: 1, borderRadius: "38% 62% 58% 42%" }, transition: { duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } },
  timeline: { initial: { opacity: 0, y: 25, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.12 } },
  pin: { initial: { opacity: 0, scale: 0.91, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { duration: 0.9, ease: "easeOut" } },
  horizontal: { initial: { opacity: 0, x: 70 }, animate: { opacity: 1, x: 0 }, transition: { type: "spring", stiffness: 76, damping: 20 } },
  mask: { initial: { opacity: 0, clipPath: "inset(0 100% 0 0 round 18px)" }, animate: { opacity: 1, clipPath: "inset(0 0% 0 0 round 18px)" }, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } },
  parallax: { initial: { opacity: 0, y: 34, scale: 0.94 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { type: "spring", stiffness: 80, damping: 16 } },
  state: { initial: { opacity: 0, scale: 0.92, rotate: -3 }, animate: { opacity: 1, scale: 1, rotate: 0 }, transition: { type: "spring", stiffness: 100, damping: 16 } },
  chart: { initial: { opacity: 0, scaleX: 0.1, transformOrigin: "left" }, animate: { opacity: 1, scaleX: 1 }, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
  shared: { initial: { opacity: 0, x: 22, y: 16, scale: 0.82, rotate: 5 }, animate: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }, transition: { type: "spring", stiffness: 92, damping: 17 } },
  flip: { initial: { opacity: 0, rotateY: -85, scale: 0.96 }, animate: { opacity: 1, rotateY: 0, scale: 1 }, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  spring: { initial: { opacity: 0, scale: 0.62, y: 22 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { type: "spring", stiffness: 180, damping: 11 } },
  magnetic: { initial: { opacity: 0, x: -12, y: 8 }, animate: { opacity: 1, x: 0, y: 0 }, transition: { type: "spring", stiffness: 130, damping: 12 } },
  drag: { initial: { opacity: 0, x: 76, rotate: 5 }, animate: { opacity: 1, x: 0, rotate: 0 }, transition: { type: "spring", stiffness: 72, damping: 16, mass: 0.8 } },
  tilt: { initial: { opacity: 0, rotateX: 15, rotateY: -20, scale: 0.94 }, animate: { opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }, transition: { type: "spring", stiffness: 86, damping: 16 } },
  gooey: { initial: { opacity: 0, scale: 0.65, borderRadius: "50% 50% 40% 60%" }, animate: { opacity: 1, scale: 1, borderRadius: "35% 65% 60% 40%" }, transition: { duration: 1.4, repeat: Infinity, repeatType: "mirror" } },
  nav: { initial: { opacity: 0, x: -14, scale: 0.88 }, animate: { opacity: 1, x: 0, scale: 1 }, transition: { type: "spring", stiffness: 140, damping: 14 } },
  expand: { initial: { opacity: 0, scale: 0.92, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { type: "spring", stiffness: 90, damping: 16 } },
  chromatic: { initial: { opacity: 0, x: -5, textShadow: "5px 0 rgba(255,80,155,.35), -5px 0 rgba(74,220,255,.35)" }, animate: { opacity: 1, x: 0, textShadow: "0px 0 transparent, 0px 0 transparent" }, transition: { duration: 0.9 } },
  glass: { initial: { opacity: 0, y: 12, backdropFilter: "blur(0px)" }, animate: { opacity: 1, y: 0, backdropFilter: "blur(14px)" }, transition: { duration: 1.1 } },
  glow: { initial: { opacity: 0, scale: 0.92, boxShadow: "0 0 0 rgba(144,128,255,0)" }, animate: { opacity: 1, scale: 1, boxShadow: "0 0 48px rgba(144,128,255,.28)" }, transition: { duration: 1.4, repeat: Infinity, repeatType: "mirror" } },
  gradient: { initial: { opacity: 0, backgroundPosition: "0% 50%" }, animate: { opacity: 1, backgroundPosition: "100% 50%" }, transition: { duration: 3.4, repeat: Infinity, repeatType: "mirror" } },
  wireframe: { initial: { opacity: 0, scale: 0.72, rotate: 11 }, animate: { opacity: 1, scale: 1, rotate: 0 }, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
  reflection: { initial: { opacity: 0, rotateY: -24, rotateX: 12 }, animate: { opacity: 1, rotateY: 0, rotateX: 0 }, transition: { type: "spring", stiffness: 66, damping: 18 } },
  stream: { initial: { opacity: 0, x: -18 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.8, ease: "easeOut" } },
  trace: { initial: { opacity: 0, y: 15, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.08 } },
  graph: { initial: { opacity: 0, scale: 0.84, rotate: -2 }, animate: { opacity: 1, scale: 1, rotate: 0 }, transition: { type: "spring", stiffness: 72, damping: 16 } },
  tokens: { initial: { opacity: 0, y: 9, filter: "blur(5px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: { duration: 0.65, ease: "easeOut" } },
  command: { initial: { opacity: 0, scale: 0.92, y: 12, filter: "blur(5px)" }, animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }, transition: { type: "spring", stiffness: 100, damping: 17 } },
  diff: { initial: { opacity: 0, x: 14, backgroundColor: "rgba(139,92,246,0)" }, animate: { opacity: 1, x: 0, backgroundColor: "rgba(139,92,246,.14)" }, transition: { duration: 0.65 } },
  presence: { initial: { opacity: 0, x: -20, scale: 0.84 }, animate: { opacity: 1, x: 0, scale: 1 }, transition: { type: "spring", stiffness: 120, damping: 14 } },
  workflow: { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 }, transition: { type: "spring", stiffness: 94, damping: 16 } }
};

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

function componentSnippet(animation: Animation) {
  const recipe = recipes[animation.kind] || recipes.assembly;
  const name = animation.slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
  return '"use client";\n\nimport { motion } from "motion/react";\n\nexport function ' + name + '() {\n  return (\n    <motion.div\n      className="mf-animation-demo"\n      initial={' + JSON.stringify(recipe.initial) + '}\n      animate={' + JSON.stringify(recipe.animate) + '}\n      transition={' + JSON.stringify(recipe.transition) + '}\n      style={{ transformPerspective: 1000 }}\n    >\n      <span className="mf-animation-demo__eyebrow">MOTION STUDY / ' + animation.category.toUpperCase() + '</span>\n      <strong>' + animation.name + '</strong>\n      <span className="mf-animation-demo__caption">' + animation.description + '</span>\n    </motion.div>\n  );\n}\n';
}

function cssSnippet(animation: Animation) {
  const keyframe = frameByKind[animation.kind] || frameByKind.timeline;
  return '.mf-animation-demo {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  max-width: 560px;\n  padding: 28px;\n  color: #f5f3ff;\n  background: radial-gradient(circle at 82% 12%, rgba(125, 105, 255, .24), transparent 38%), #101014;\n  border: 1px solid rgba(255, 255, 255, .12);\n  border-radius: 22px;\n  box-shadow: 0 24px 80px rgba(0, 0, 0, .22);\n  transform-origin: center;\n  animation: mf-effect-' + animation.kind + ' 3.4s ease-in-out infinite alternate;\n}\n\n.mf-animation-demo__eyebrow {\n  color: #aaa3ff;\n  font: 600 10px/1.2 ui-monospace, SFMono-Regular, monospace;\n  letter-spacing: .16em;\n}\n\n.mf-animation-demo strong {\n  font-size: clamp(24px, 4vw, 42px);\n  letter-spacing: -.055em;\n}\n\n.mf-animation-demo__caption {\n  max-width: 46ch;\n  color: #aaa9b5;\n  font-size: 13px;\n  line-height: 1.6;\n}\n\n@keyframes mf-effect-' + animation.kind + ' {\n  ' + keyframe + '\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .mf-animation-demo { animation: none; }\n}';
}

function installSnippet() {
  return "npm install motion";
}

export function AnimationDetail({ animation }: { animation: Animation }) {
  const { theme, setTheme } = useSiteTheme();
  const [tab, setTab] = useState<CodeTab>("Component");
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const code = useMemo(() => ({
    Component: componentSnippet(animation),
    CSS: cssSnippet(animation),
    Install: installSnippet(),
  }), [animation]);
  const currentCode = code[tab];

  async function copyCurrent() {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <SiteHeader theme={theme} setTheme={setTheme} detail />
      <main className="detail-page">
        <div className="detail-breadcrumb"><Link href="/">Library</Link><ChevronRight size={13} /><span>{animation.category}</span><ChevronRight size={13} /><span>{animation.name}</span></div>
        <section className="detail-heading">
          <div className="detail-heading-copy">
            <div className="detail-eyebrow"><CategoryIcon category={animation.category} /> {animation.category.toUpperCase()} STUDY <span className="detail-eyebrow-line" /> {animation.level.toUpperCase()}</div>
            <h1>{animation.name}</h1>
            <p>{animation.description}</p>
            <div className="detail-tags">{animation.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
          <div className="detail-id"><span>STUDY</span><strong>{String(animations.findIndex((item) => item.slug === animation.slug) + 1).padStart(2, "0")}<i>/</i>50</strong><span>CURATED MOTION</span></div>
        </section>

        <section className="detail-workspace">
          <div className="detail-preview-column">
            <PreviewFrame animation={animation} />
            <div className="preview-underbar"><span><i /> LIVE PREVIEW ENVIRONMENT</span><span>CONTAINED CANVAS <b>{animation.size === "large" ? "LARGE" : "MEDIUM"}</b></span></div>
            <div className="implementation-notes">
              <div className="section-eyebrow"><span>01</span> IMPLEMENTATION NOTES</div>
              <h2>Make the motion <span>your own.</span></h2>
              <p>This starter is intentionally compact. Copy the React component and its CSS, then tune timing, distance, and easing to fit your product’s visual language.</p>
              <div className="note-grid"><div><span>01 / TIMING</span><b>Intent over speed</b><p>Use duration and delay to establish a clear hierarchy.</p></div><div><span>02 / EASING</span><b>Give it a character</b><p>Spring motion adds tactility; smooth easing feels cinematic.</p></div></div>
            </div>
          </div>
          <aside className="code-column">
            <div className="code-panel">
              <div className="code-panel-heading"><div><span className="code-panel-kicker"><Terminal size={13} /> COPY / PASTE</span><h2>Take the code.</h2></div><span className="code-file-badge">TSX + CSS</span></div>
              <p className="code-panel-description">A starter implementation for this motion pattern. Drop it into your app and customize from there.</p>
              <div className="code-tabs" role="tablist" aria-label="Code type">
                {(["Component", "CSS", "Install"] as CodeTab[]).map((item) => <button key={item} className={"code-tab" + (tab === item ? " is-active" : "")} role="tab" aria-selected={tab === item} onClick={() => { setTab(item); setCopied(false); }}>{item === "Component" ? <Code2 size={13} /> : item === "CSS" ? <Layers3 size={13} /> : <Terminal size={13} />}{item}</button>)}
              </div>
              <div className="code-meta"><span><span className="code-status-dot" /> {tab === "Install" ? "PACKAGE MANAGER" : tab === "CSS" ? "STYLESHEET" : "REACT COMPONENT"}</span><span>{tab === "Install" ? "SHELL" : tab === "CSS" ? "CSS" : "TSX"}</span></div>
              <pre className={"code-block code-block--" + tab.toLowerCase()}><code>{currentCode}</code></pre>
              <div className="code-panel-footer"><span>{tab === "Install" ? "1 line" : tab === "CSS" ? "CSS keyframes included" : "Ready to customize"}</span><button className={"copy-button" + (copied ? " is-copied" : "")} onClick={copyCurrent}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy " + tab}</button></div>
              {tab !== "Install" && <p className="code-footnote"><Sparkles size={13} /> Uses Motion for React. Add the CSS tab to reproduce the accent treatment.</p>}
            </div>
            <div className="code-steps">
              <div className="code-steps-heading"><span className="section-eyebrow">QUICK START</span><button onClick={() => setShowMore(!showMore)} aria-expanded={showMore}>{showMore ? "Hide steps" : "Show steps"} <ChevronRight size={13} className={showMore ? "rotate-90" : ""} /></button></div>
              <div className="quick-step"><span>1</span><div><b>Install Motion</b><p>Add the animation runtime to your Next.js project.</p></div><button aria-label="Copy install command" onClick={async () => { await navigator.clipboard.writeText("npm install motion"); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }}><Copy size={13} /></button></div>
              <AnimatePresence>{showMore && <motion.div className="expanded-steps" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><div className="quick-step"><span>2</span><div><b>Create the component</b><p>Paste the Component snippet into a client component.</p></div></div><div className="quick-step"><span>3</span><div><b>Add the styles</b><p>Place the CSS snippet in your global stylesheet or a CSS module.</p></div></div></motion.div>}</AnimatePresence>
            </div>
            <div className="library-next"><span>KEEP EXPLORING</span><Link href={"/" + animations[(animations.findIndex((item) => item.slug === animation.slug) + 1) % animations.length].slug}>Next animation <ArrowRight size={14} /></Link></div>
          </aside>
        </section>
        <section className="related-section"><div className="section-eyebrow"><span>03</span> KEEP THE FLOW GOING</div><h2>Related <span>motion studies.</span></h2><div className="related-grid">{animations.filter((item) => item.category === animation.category && item.slug !== animation.slug).slice(0, 3).map((item) => <Link href={"/" + item.slug} className="related-card" key={item.slug}><MiniArtwork animation={item} /><div><span>{item.category.toUpperCase()}</span><b>{item.name}</b><ArrowUpRight size={14} /></div></Link>)}</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}

