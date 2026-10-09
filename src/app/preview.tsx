"use client";

import { useState } from "react";
import { Moon, RotateCcw, Sun } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Animation } from "./animations";

const motionForKind = {
  assembly: { animate: { y: [20, 0], rotateX: [14, 0], opacity: [0, 1] }, transition: { duration: .9, ease: [0.22, 1, 0.36, 1] } },
  dolly: { animate: { scale: [1.12, 1], opacity: [0, 1] }, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
  portal: { animate: { clipPath: ["circle(0% at 50% 50%)", "circle(75% at 50% 50%)"], scale: [.8, 1] }, transition: { duration: .85, ease: [0.76, 0, 0.24, 1] } },
  liquid: { animate: { borderRadius: ["32% 68% 58% 42%", "61% 39% 34% 66%", "32% 68% 58% 42%"], rotate: [-4, 5, -4] }, transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } },
  particles: { animate: { scale: [.4, 1], rotate: [-22, 0], opacity: [.3, 1] }, transition: { duration: 1.4, type: "spring", stiffness: 65, damping: 15 } },
  light: { animate: { x: [-55, 55], opacity: [.25, .85, .25] }, transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" } },
  kinetic: { animate: { y: [18, 0], letterSpacing: [".12em", "-.04em"], opacity: [0, 1] }, transition: { duration: .8, ease: [0.22, 1, 0.36, 1] } },
  depth: { animate: { z: [-90, 0], rotateY: [-18, 0], opacity: [.2, 1] }, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
  morph: { animate: { borderRadius: ["58% 42% 47% 53%", "38% 62% 58% 42%", "58% 42% 47% 53%"], rotate: [0, 10, 0] }, transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } },
  timeline: { animate: { y: [18, 0], scale: [.98, 1], opacity: [0, 1] }, transition: { duration: .8, ease: [0.22, 1, 0.36, 1] } },
  pin: { animate: { y: [16, 0], scale: [.92, 1] }, transition: { duration: .8, type: "spring", stiffness: 110, damping: 15 } },
  horizontal: { animate: { x: [-24, 0], opacity: [.2, 1] }, transition: { duration: .85, ease: [0.22, 1, 0.36, 1] } },
  mask: { animate: { clipPath: ["inset(0 100% 0 0 round 18px)", "inset(0 0 0 0 round 18px)"] }, transition: { duration: .9, ease: [0.76, 0, 0.24, 1] } },
  parallax: { animate: { y: [5, -8, 5] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
  state: { animate: { scale: [.96, 1], opacity: [.6, 1] }, transition: { duration: .7, ease: "easeOut" } },
  chart: { animate: { scaleX: [.12, 1], opacity: [.3, 1] }, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
  shared: { animate: { x: [18, 0], y: [12, 0], scale: [.84, 1], rotate: [5, 0] }, transition: { duration: .8, type: "spring", stiffness: 95, damping: 16 } },
  flip: { animate: { rotateY: [-80, 0], opacity: [.25, 1] }, transition: { duration: .8, ease: [0.22, 1, 0.36, 1] } },
  spring: { animate: { scale: [.65, 1.06, 1], y: [18, -3, 0] }, transition: { duration: 1.1, type: "spring", stiffness: 140, damping: 12 } },
  magnetic: { animate: { x: [-9, 4, 0], y: [4, -2, 0] }, transition: { duration: 1.1, type: "spring", stiffness: 120, damping: 12 } },
  drag: { animate: { x: [50, -6, 0], rotate: [7, -1, 0] }, transition: { duration: 1.3, type: "spring", stiffness: 72, damping: 15 } },
  tilt: { animate: { rotateX: [13, 0], rotateY: [-18, 0] }, transition: { duration: 1, type: "spring", stiffness: 80, damping: 16 } },
  gooey: { animate: { borderRadius: ["50% 48% 42% 58%", "34% 66% 61% 39%", "50% 48% 42% 58%"], scale: [.95, 1.04, .95] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
  nav: { animate: { x: [-14, 0], scale: [.9, 1], opacity: [0, 1] }, transition: { duration: .6, type: "spring", stiffness: 130, damping: 14 } },
  expand: { animate: { scale: [.88, 1], y: [12, 0], opacity: [0, 1] }, transition: { duration: .65, type: "spring", stiffness: 100, damping: 16 } },
  chromatic: { animate: { x: [-3, 0], opacity: [.4, 1] }, transition: { duration: .8, ease: "easeOut" } },
  glass: { animate: { y: [12, 0], opacity: [0, 1] }, transition: { duration: .9, ease: [0.22, 1, 0.36, 1] } },
  glow: { animate: { boxShadow: ["0 0 12px rgba(120,100,220,.12)", "0 0 42px rgba(120,100,220,.45)", "0 0 12px rgba(120,100,220,.12)"] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
  gradient: { animate: { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }, transition: { duration: 7, repeat: Infinity, ease: "linear" } },
  reflection: { animate: { rotateY: [-12, 12, -12], filter: ["brightness(.8)", "brightness(1.2)", "brightness(.8)"] }, transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } },
  wireframe: { animate: { scale: [.8, 1], rotate: [7, 0], opacity: [.25, 1] }, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
  stream: { animate: { x: [-12, 0], opacity: [.2, 1] }, transition: { duration: .8, ease: "easeOut" } },
  trace: { animate: { y: [12, 0], opacity: [0, 1] }, transition: { duration: .65, ease: "easeOut" } },
  graph: { animate: { y: [0, -5, 0], scale: [.98, 1, .98] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
  tokens: { animate: { y: [8, 0], opacity: [.15, 1], filter: ["blur(4px)", "blur(0px)"] }, transition: { duration: .7, ease: "easeOut" } },
  command: { animate: { y: [12, 0], scale: [.95, 1], opacity: [0, 1] }, transition: { duration: .7, type: "spring", stiffness: 100, damping: 16 } },
  diff: { animate: { x: [12, 0], opacity: [.2, 1] }, transition: { duration: .6, ease: "easeOut" } },
  presence: { animate: { x: [-12, 0], scale: [.8, 1], opacity: [0, 1] }, transition: { duration: .7, type: "spring", stiffness: 120, damping: 14 } },
  workflow: { animate: { scale: [.96, 1, .98, 1] }, transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } },
};

function Shape({ kind, replay }: { kind: string; replay: number }) {
  const reduced = useReducedMotion();
  const effect = Object.prototype.hasOwnProperty.call(motionForKind, kind) ? motionForKind[kind as keyof typeof motionForKind] : motionForKind.assembly;
  return <div className={"preview-art preview-art--" + kind} key={replay}>
    <div className="preview-halo" />
    <motion.div className="preview-shape" initial={{ opacity: 0, scale: .82 }} animate={reduced ? { opacity: 1, scale: 1 } : effect.animate as never} transition={reduced ? { duration: 0 } : effect.transition as never}><span /></motion.div>
    <motion.div className="preview-copy" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : .12 }}><span className="preview-copy-label">MOTION STUDY</span><strong>A little movement<br />goes a long way.</strong><span className="preview-copy-line"><i /> Intentional by design</span></motion.div>
    <div className="preview-art-index">01 <span>—</span> 03</div>
  </div>;
}

export function MiniArtwork({ animation }: { animation: Animation }) {
  return <div className={"mini-art mini-art--" + animation.kind} aria-hidden="true"><div className="mini-art-grid" /><div className="mini-art-glow" /><div className="mini-art-shape" /><div className="mini-art-caption"><span>{animation.category.toUpperCase()}</span><span>↗</span></div></div>;
}

export function PreviewFrame({ animation }: { animation: Animation }) {
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [replayKey, setReplayKey] = useState(0);

  return (
    <section className={"preview-frame preview-frame--" + animation.size} data-preview-theme={previewTheme}>
      <div className="preview-toolbar">
        <div className="preview-toolbar-label">
          <span className="preview-live-dot" /> LIVE PREVIEW <span>/</span> {animation.size.toUpperCase()} CANVAS
        </div>
        <div className="preview-toolbar-actions">
          <button className="preview-tool" type="button" aria-label="Replay animation" onClick={() => setReplayKey((n) => n + 1)} title="Replay">
            <RotateCcw size={14} />
          </button>
          <button
            className="preview-tool"
            type="button"
            aria-label={"Switch preview to " + (previewTheme === "dark" ? "light" : "dark")}
            onClick={() => setPreviewTheme((t) => (t === "dark" ? "light" : "dark"))}
            title="Toggle preview theme"
          >
            {previewTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
      <div className="preview-canvas">
        <div className="preview-grid" />
        <Shape kind={animation.kind} replay={replayKey} />
        <div className="preview-caption">
          <span>{animation.name}</span>
          <span>CONTAINED CANVAS</span>
        </div>
      </div>
    </section>
  );
}
