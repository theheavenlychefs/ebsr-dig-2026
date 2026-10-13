"use client";

import { useEffect, useState } from "react";
import { retreatAudioEnvelope, retreatAudioWindowSeconds } from "@/lib/retreat-audio-envelope";

function trace(frame: number, offset = 0) {
  const points = Array.from({ length: 64 }, (_, i) => {
    const sample = retreatAudioEnvelope[Math.max(0, Math.min(retreatAudioEnvelope.length - 1, frame + i - 32 + offset))] / 100;
    const edge = Math.min(i, 63 - i);
    const envelope = edge < 9 ? Math.sin((edge / 9) * Math.PI) : Math.sin((i / 63) * Math.PI);
    const amplitude = Math.pow(sample, 0.35) * 52 * envelope * (i % 2 ? 1 : -1);
    return [(i / 63) * 100, 50 + amplitude];
  });
  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const point = points[i];
    path += ` Q ${previous[0]} ${previous[1]} ${(previous[0] + point[0]) / 2} ${(previous[1] + point[1]) / 2}`;
  }
  return path;
}

export function RetreatWaves() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const video = document.getElementById("retreat-inline-film") as HTMLVideoElement | null;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (!motion.matches) setFrame(Math.floor(video.currentTime / retreatAudioWindowSeconds));
    };
    video.addEventListener("timeupdate", update);
    video.addEventListener("playing", update);
    return () => {
      video.removeEventListener("timeupdate", update);
      video.removeEventListener("playing", update);
    };
  }, []);

  return (
    <svg className="retreat-waves" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="retreat-wave-echo" d={trace(frame, 6)} />
      <path d={trace(frame)} />
    </svg>
  );
}
