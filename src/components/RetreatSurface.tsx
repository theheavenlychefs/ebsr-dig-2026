"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";

export function RetreatSurface({ children }: { children: ReactNode }) {
  const [background, setBackground] = useState<"black" | "white">("black");
  return (
    <section id="retreat" className="retreat-section" aria-labelledby="retreat-heading" data-preview-theme={background}>
      <fieldset className="retreat-background-preview" role="radiogroup" aria-label="Retreat background preview">
        {(["black", "white"] as const).map((option) => (
          <button
            key={option}
            className="retreat-background-option"
            type="button"
            role="radio"
            aria-checked={background === option}
            tabIndex={background === option ? 0 : -1}
            data-background={option}
            onClick={() => setBackground(option)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
              event.preventDefault();
              const next = option === "black" ? "white" : "black";
              setBackground(next);
              event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-background="${next}"]`)?.focus();
            }}
          >
            <span className={`retreat-background-swatch retreat-background-swatch-${option}`} aria-hidden="true">
              {background === option && <Check size={12} strokeWidth={2.5} />}
            </span>
            <span>{option === "black" ? "Black" : "White"}</span>
          </button>
        ))}
      </fieldset>
      {children}
    </section>
  );
}
