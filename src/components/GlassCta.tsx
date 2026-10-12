"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

type GlassCtaProps = { tone?: "primary" | "secondary" } & (
  | (ComponentProps<"a"> & { href: string })
  | (ComponentProps<"button"> & { href?: never })
);

export function GlassCta({ tone = "primary", children, className = "", ...props }: GlassCtaProps) {
  const borderRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const border = borderRef.current;
    if (!border) return;
    // Measure on resize only; CSS moves the reflection along the outline.
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(border);
    const button = border.parentElement;
    const press = (event: PointerEvent) => {
      if (event.isPrimary && event.button === 0) setIsPressed(true);
    };
    const release = () => setIsPressed(false);
    button?.addEventListener("pointerdown", press);
    button?.addEventListener("pointerup", release);
    button?.addEventListener("pointercancel", release);
    button?.addEventListener("pointerleave", release);
    button?.addEventListener("blur", release);
    return () => {
      observer.disconnect();
      button?.removeEventListener("pointerdown", press);
      button?.removeEventListener("pointerup", release);
      button?.removeEventListener("pointercancel", release);
      button?.removeEventListener("pointerleave", release);
      button?.removeEventListener("blur", release);
    };
  }, []);

  const content = <>
    <svg ref={borderRef} className="glass-cta-border" aria-hidden="true" focusable="false">
      {size.width > 2 && size.height > 2 && <>
        <rect className="glass-cta-reflection" x="1" y="1" width={size.width - 2} height={size.height - 2} rx="5" pathLength="100" />
        <rect className="glass-cta-glint" x="1" y="1" width={size.width - 2} height={size.height - 2} rx="5" pathLength="100" />
      </>}
    </svg>
    {children}
  </>;
  const classes = `glass-cta glass-cta-${tone} ${className}`;
  if (props.href !== undefined) return <a {...props as ComponentProps<"a">} className={classes} data-pressed={isPressed}>{content}</a>;
  return <button {...props as ComponentProps<"button">} className={classes} data-pressed={isPressed}>{content}</button>;
}
