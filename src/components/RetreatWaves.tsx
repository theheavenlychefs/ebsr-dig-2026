"use client";

import { useEffect, useRef, useState } from "react";
import { retreatStudyContour } from "@/lib/retreat-shape";

export function RetreatWaves({ shape }: { shape: "study" | "film" }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [radius, setRadius] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const svg = svgRef.current;
    const mask = svg?.parentElement?.querySelector<HTMLElement>(".retreat-inline-film-mask");
    if (shape !== "film" || !svg || !mask) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      const corner = parseFloat(getComputedStyle(mask).borderTopLeftRadius);
      setRadius({ x: Math.min(50, corner / width * 100), y: Math.min(50, corner / height * 100) });
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, [shape]);

  return (
    <svg ref={svgRef} className="retreat-waves" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {(shape === "study" || radius.x > 0) && [0, 1, 2].map((wave) => (
        <g className="retreat-wave-outline" key={wave}>
          {shape === "study"
            ? <path d={retreatStudyContour} transform="scale(100)" />
            : <rect width="100" height="100" rx={radius.x} ry={radius.y} />}
        </g>
      ))}
    </svg>
  );
}
