"use client";

import { useId, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { GlassCta } from "./GlassCta";

export function RetreatReadMore() {
  const noticeRef = useRef<HTMLSpanElement>(null);
  const noticeId = useId();
  return (
    <div className="retreat-read-more">
      <GlassCta href="/about-ebsr" aria-describedby={noticeId} onClick={(event) => {
        event.preventDefault();
        noticeRef.current?.showPopover();
      }}>
        <span>Read more about EBSR</span>
        <ArrowUpRight size={16} aria-hidden="true" className="glass-cta-arrow" />
      </GlassCta>
      <span ref={noticeRef} id={noticeId} popover="auto" role="status" aria-live="polite" className="registration-status">
        The full EBSR story is coming soon.
        <button type="button" popoverTarget={noticeId} popoverTargetAction="hide" aria-label="Dismiss EBSR notice" className="registration-status-dismiss">
          <X size={18} aria-hidden="true" />
        </button>
      </span>
    </div>
  );
}
