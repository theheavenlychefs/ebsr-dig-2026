"use client";

import { useEffect, useState } from "react";
import { createThemeTypewriter, reflectionTexts } from "@/lib/theme-typewriter";

export function ThemeReflection({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (!active) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const writer = createThemeTypewriter(setVisible);
    const syncMotion = () => { if (motion.matches) writer.finish(); };
    const syncVisibility = () => writer.pause(document.hidden);
    syncMotion();
    syncVisibility();
    motion.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      writer.destroy();
      motion.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [active]);

  let characterIndex = 0;
  return <div className="theme-statement">
    {reflectionTexts.map((text, paragraph) => <p key={text} className={paragraph === 0 ? "theme-lead" : "theme-reflection-copy"}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.split(/(\s+)/).map((word, wordIndex) => /^\s+$/.test(word) ? word :
        <span key={wordIndex} className="theme-typed-word">{[...word].map((character, index) => <span key={index} className="theme-typed-character" data-visible={characterIndex++ < visible}>{character}</span>)}</span>
      )}</span>
    </p>)}
  </div>;
}
