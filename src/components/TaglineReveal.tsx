'use client';

import React, { useEffect, useRef, useState } from 'react';

const WORDS_LINE_1 = ['A', 'fingerprint', 'cannot', 'be', 'forged', 'the', 'way', 'a', 'signature', 'can.'];
const WORDS_LINE_2 = ['That', 'is', 'the', 'whole', 'idea.'];

export function TaglineReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState<number>(0);

  const totalWords = WORDS_LINE_1.length + WORDS_LINE_2.length;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Calculate how far into view the element is (from 0 to 1)
          const startTrigger = windowHeight * 0.85;
          const endTrigger = windowHeight * 0.35;
          const progress = Math.min(
            Math.max((startTrigger - rect.top) / (startTrigger - endTrigger), 0),
            1
          );

          const count = Math.floor(progress * totalWords);
          setRevealedCount(count);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [totalWords]);

  let currentWordIndex = 0;

  return (
    <section
      ref={containerRef}
      className="w-full py-24 px-6 bg-[#181818] border-y border-[#272727] flex flex-col items-center justify-center text-center"
      aria-label="Core Philosophy"
    >
      <div className="max-w-[680px] mx-auto">
        <span className="inline-block text-xs uppercase tracking-widest text-[#2DD4BF] font-semibold mb-6">
          Core Principle
        </span>

        <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
            {WORDS_LINE_1.map((word) => {
              const active = currentWordIndex < revealedCount;
              currentWordIndex++;
              return (
                <span
                  key={`l1-${word}-${currentWordIndex}`}
                  className="transition-fluid inline-block"
                  style={{
                    color: active ? '#FFFFFF' : '#3A3A3A',
                    transform: active ? 'translateY(0)' : 'translateY(2px)',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mt-3 text-[#2DD4BF]">
            {WORDS_LINE_2.map((word) => {
              const active = currentWordIndex < revealedCount;
              currentWordIndex++;
              return (
                <span
                  key={`l2-${word}-${currentWordIndex}`}
                  className="transition-fluid inline-block"
                  style={{
                    color: active ? '#2DD4BF' : '#1B4A44',
                    transform: active ? 'translateY(0)' : 'translateY(2px)',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </h2>
      </div>
    </section>
  );
}
