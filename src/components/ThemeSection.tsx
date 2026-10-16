"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CyclicAlphaLogo } from "./CyclicAlphaLogo";
import { currentEdition } from "@/lib/edition";
import { handwritingLines, themeScripture, writingDuration, writingStrokeCount } from "@/lib/theme-handwriting";
import { ThemeReflection } from "./ThemeReflection";

export function ThemeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setEntered(true);
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  let strokeIndex = 0;
  return (
    <section ref={sectionRef} id="theme" className="theme-section edition-scene" data-entered={entered} aria-labelledby="theme-heading">
      <div className="theme-inner">
        <p className="theme-eyebrow"><span>04</span> / THE THEME</p>
        <h2 id="theme-heading" className="sr-only">DIG: {currentEdition.themeName}</h2>
        <div className="theme-composition">
          <div className="theme-logo">
            {entered ? <CyclicAlphaLogo image={currentEdition.assets.digLogo} animation={currentEdition.assets.digAnimation} alphaProbe={currentEdition.assets.alphaProbe} /> :
              <Image className="theme-logo-fallback" src={currentEdition.assets.digLogo} alt="DIG" width={1241} height={835} sizes="440px" loading="lazy" />}
          </div>
          <figure className="theme-scripture">
            <blockquote>
              <span className="sr-only">{themeScripture}</span>
              <svg viewBox="0 0 410 166" aria-hidden="true" className="theme-handwriting">
                {handwritingLines.map((line, lineIndex) => <g key={lineIndex} transform={`translate(${(410 - line.width) / 2} ${lineIndex * 79 + 5})`}>
                  {line.strokes.map((stroke, index) => {
                    const order = strokeIndex++;
                    return <path key={index} d={stroke.path} transform={`translate(${stroke.x} 0)`} pathLength={1} className={`theme-writing-stroke theme-writing-${stroke.tone}`} style={{ "--stroke-delay": `${order * writingDuration / writingStrokeCount}ms`, "--stroke-duration": `${writingDuration / writingStrokeCount + 20}ms` } as CSSProperties} />;
                  })}
                </g>)}
              </svg>
            </blockquote>
            <figcaption>{currentEdition.scriptureAnchor}</figcaption>
          </figure>
          <ThemeReflection active={entered} />
        </div>
      </div>
    </section>
  );
}
