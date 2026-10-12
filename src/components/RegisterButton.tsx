"use client";

import { useId, useState } from "react";
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

  return (
    <span className={`inline-flex flex-col items-start gap-2 ${className}`}>
      <GlassCta
        href={currentEdition.registrationHref}
        tone={variant === "outline" ? "secondary" : "primary"}
        aria-describedby={messageId}
        onClick={(event) => {
          event.preventDefault();
          setMessage("Registration page coming soon.");
        }}
      >
        <span>{label}</span>
        <span aria-hidden="true" className="text-[#d6ad4e]">
          &rarr;
        </span>
      </GlassCta>
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
