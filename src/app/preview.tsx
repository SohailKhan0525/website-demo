"use client";

import { useState } from "react";
import { Moon, Sun, RotateCcw, Sparkles } from "lucide-react";
import type { Animation } from "./animations";

export function MiniArtwork({ animation }: { animation: Animation }) {
  return (
    <div className={"mini-art mini-art--" + animation.kind} aria-hidden="true">
      <div className="mini-art-glow" />
      <div className="mini-art-orb" />
      <div className="mini-art-window">
        <div className="mini-art-bar"><i /><i /><i /><span /></div>
        <div className="mini-art-body">
          <div className="mini-art-sidebar"><b /><b /><b /><b /></div>
          <div className="mini-art-content">
            <div className="mini-art-title" />
            <div className="mini-art-stats"><i /><i /><i /></div>
            <div className="mini-art-chart"><span /><span /><span /><span /><span /><span /><span /></div>
            <div className="mini-art-lines"><i /><i /><i /></div>
          </div>
        </div>
      </div>
      <div className="mini-art-chip"><Sparkles size={11} strokeWidth={1.7} /><span>LIVE</span></div>
    </div>
  );
}

function SceneGraphic({ kind }: { kind: string }) {
  if (kind === "graph" || kind === "wireframe" || kind === "workflow" || kind === "stream" || kind === "trace") {
    return (
      <div className={"scene-network scene-network--" + kind}>
        <svg className="scene-network-lines" viewBox="0 0 430 210" fill="none" aria-hidden="true">
          <path d="M52 107 L142 50 L230 104 L324 47 M142 50 L157 164 L230 104 L324 165 M230 104 L380 105" />
          <path d="M52 107 L157 164 L324 165 L380 105 L324 47" />
        </svg>
        <div className="network-node node-a"><span>01</span></div>
        <div className="network-node node-b"><span>02</span></div>
        <div className="network-node node-c"><span>03</span></div>
        <div className="network-node node-d"><span>04</span></div>
        <div className="network-node node-e"><span>05</span></div>
        <div className="network-node node-f"><span>AI</span></div>
      </div>
    );
  }

  if (kind === "light" || kind === "particles" || kind === "liquid" || kind === "gooey" || kind === "morph" || kind === "glass" || kind === "glow" || kind === "reflection" || kind === "gradient" || kind === "chromatic") {
    return (
      <div className={"scene-object scene-object--" + kind}>
        <div className="object-halo" />
        <div className="object-core" />
        <div className="object-ring ring-one" />
        <div className="object-ring ring-two" />
        <div className="object-spark spark-one" />
        <div className="object-spark spark-two" />
        <div className="object-spark spark-three" />
      </div>
    );
  }

  if (kind === "tokens" || kind === "command" || kind === "diff" || kind === "presence") {
    return (
      <div className={"scene-console scene-console--" + kind}>
        <div className="console-search"><span className="console-search-icon">⌕</span><span>{kind === "command" ? "Search commands…" : kind === "tokens" ? "Generating response" : kind === "diff" ? "Changes detected" : "3 teammates online"}</span><kbd>⌘ K</kbd></div>
        <div className="console-result"><span className="console-result-icon">✦</span><div><b>{kind === "tokens" ? "Reasoning in progress" : kind === "diff" ? "Updated deployment" : "Open workspace"}</b><small>{kind === "presence" ? "Mira is editing this view" : "Ready in 248 ms"}</small></div><span className="console-result-arrow">↗</span></div>
        <div className="console-result muted"><span className="console-result-icon">◌</span><div><b>{kind === "tokens" ? "Reading the context" : "Recent activity"}</b><small>Workspace · just now</small></div></div>
        <div className="console-token-row"><i /><i /><i /><i /><i /></div>
      </div>
    );
  }

  return (
    <div className={"scene-product scene-product--" + kind}>
      <div className="product-floating-card product-floating-card--left">
        <span className="mini-overline">ACTIVE FLOW</span>
        <div className="product-card-value"><i /> 24.8k</div>
        <div className="product-card-caption">Events processed</div>
        <div className="product-card-sparkline"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      </div>
      <div className="product-main-card">
        <div className="product-card-top"><span className="product-dot" /> <span>WORKFLOW / 08</span><span className="product-status">RUNNING</span></div>
        <div className="product-flow">
          <div className="flow-step flow-step--one"><span>01</span><b>Trigger</b><small>Received</small></div>
          <div className="flow-connector connector-one"><i /></div>
          <div className="flow-step flow-step--two"><span>02</span><b>Process</b><small>Analyzing</small></div>
          <div className="flow-connector connector-two"><i /></div>
          <div className="flow-step flow-step--three"><span>03</span><b>Resolve</b><small>Complete</small></div>
        </div>
        <div className="product-card-footer"><span>LAST RUN <b>00:02.41</b></span><span className="product-footer-pulse" /> <span>ALL SYSTEMS NORMAL</span></div>
      </div>
      <div className="product-floating-card product-floating-card--right">
        <span className="mini-overline">CONFIDENCE</span>
        <div className="product-confidence">98<span>.4%</span></div>
        <div className="confidence-track"><i /></div>
        <div className="product-card-caption">+12.6% this week</div>
      </div>
      <div className="scene-orbit orbit-a" />
      <div className="scene-orbit orbit-b" />
      <div className="scene-laser" />
    </div>
  );
}

export function PreviewFrame({ animation }: { animation: Animation }) {
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [replayKey, setReplayKey] = useState(0);

  return (
    <section className={"preview-frame preview-frame--" + animation.size} data-preview-theme={previewTheme}>
      <div className="preview-toolbar">
        <div className="preview-toolbar-label"><span className="live-indicator" /> LIVE PREVIEW <span className="preview-dot-separator">/</span> {animation.size.toUpperCase()} CANVAS</div>
        <div className="preview-toolbar-actions">
          <button className="icon-button preview-icon-button" aria-label="Replay animation" onClick={() => setReplayKey((value) => value + 1)} title="Replay">
            <RotateCcw size={14} />
          </button>
          <button className="icon-button preview-icon-button" aria-label={"Switch preview to " + (previewTheme === "dark" ? "light" : "dark") + " mode"} onClick={() => setPreviewTheme((value) => value === "dark" ? "light" : "dark")} title="Toggle preview theme">
            {previewTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
      <div className="preview-canvas">
        <div className="preview-grid" />
        <div className="preview-index">MF / {String(animation.slug.length).padStart(2, "0")}</div>
        <div className="preview-canvas-inner" key={replayKey}>
          <SceneGraphic kind={animation.kind} />
        </div>
        <div className="preview-caption"><span>{animation.name.toUpperCase()}</span><span>INTERACTIVE STUDY <i>↗</i></span></div>
      </div>
    </section>
  );
}
