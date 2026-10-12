"use client";

import { useId, useState } from "react";
import { currentEdition } from "@/lib/edition";

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

  const base =
    "inline-flex min-h-12 items-center justify-center gap-3 border px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ad4e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080604]";
  const styles = {
    primary:
      "border-[#c99a38] bg-[#5f1014] text-[#fff2dc] shadow-[0_14px_32px_rgba(20,0,0,0.24)] hover:bg-[#75181d]",
    quiet:
      "border-[#c99a38]/70 bg-[#5f1014] text-[#fff2dc] hover:bg-[#75181d]",
    outline:
      "border-[#c99a38]/55 bg-transparent text-[#fff2dc] hover:border-[#d6ad4e] hover:bg-[#d6ad4e]/10",
  }[variant];

  return (
    <span className={`inline-flex flex-col items-start gap-2 ${className}`}>
      <a
        href={currentEdition.registrationHref}
        className={`${base} ${styles}`}
        aria-describedby={messageId}
        onClick={(event) => {
          event.preventDefault();
          setMessage("Registration page coming soon.");
        }}
      >
        <span>{label}</span>
        <span aria-hidden="true" className="text-[#d6ad4e]">
          →
        </span>
      </a>
      <span
        id={messageId}
        aria-live="polite"
        className="min-h-5 text-xs text-[#d6ad4e]"
      >
        {message}
      </span>
    </span>
  );
}
