"use client";

import { useId, useRef, useState } from "react";
import { currentEdition } from "@/lib/edition";
import { GlassCta } from "./GlassCta";

type RegisterButtonProps = {
  className?: string;
  label?: string;
  variant?: "primary" | "quiet" | "outline";
};

export function RegisterButton({
  className = "",
  label = "Be part of DIG",
  variant = "primary",
}: RegisterButtonProps) {
  const [message, setMessage] = useState("");
  const messageId = useId();
  const noticeRef = useRef<HTMLSpanElement>(null);

  return (
    <span className={`inline-flex flex-col items-start gap-2 ${className}`}>
      <GlassCta
        href={currentEdition.registrationHref}
        tone={variant === "outline" ? "secondary" : "primary"}
        aria-describedby={messageId}
        onClick={(event) => {
          event.preventDefault();
          setMessage("Registration page coming soon.");
          noticeRef.current?.showPopover();
        }}
      >
        <span>{label}</span>
        <span aria-hidden="true" className="glass-cta-arrow text-[#d6ad4e]">
          &rarr;
        </span>
      </GlassCta>
      <span
        id={messageId}
        ref={noticeRef}
        popover="auto"
        role="status"
        aria-live="polite"
        className="registration-status"
      >
        {message}
        <button
          type="button"
          popoverTarget={messageId}
          popoverTargetAction="hide"
          aria-label="Dismiss registration notice"
          className="registration-status-dismiss"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </span>
    </span>
  );
}
