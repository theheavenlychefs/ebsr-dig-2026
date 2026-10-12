"use client";

import { useState } from "react";
import { currentEdition } from "@/lib/edition";

type RegisterButtonProps = {
  className?: string;
  variant?: "primary" | "quiet";
};

export function RegisterButton({
  className = "",
  variant = "primary",
}: RegisterButtonProps) {
  const [message, setMessage] = useState("");

  const base =
    "inline-flex min-h-12 items-center justify-center border px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ad4e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080604]";
  const styles =
    variant === "primary"
      ? "border-[#d8b35a] bg-[#c89a2c] text-[#120b05] hover:bg-[#e4bd61]"
      : "border-[#c89a2c]/45 bg-transparent text-[#f7ead2] hover:border-[#d8b35a] hover:bg-[#d8b35a]/10";

  return (
    <span className={`inline-flex flex-col items-start gap-2 ${className}`}>
      <a
        href={currentEdition.registrationHref}
        className={`${base} ${styles}`}
        aria-describedby="registration-coming-soon"
        onClick={(event) => {
          event.preventDefault();
          setMessage("Registration page coming soon.");
        }}
      >
        Be part of DIG
      </a>
      <span
        id="registration-coming-soon"
        aria-live="polite"
        className="min-h-5 text-xs uppercase tracking-[0.18em] text-[#d6ad4e]"
      >
        {message}
      </span>
    </span>
  );
}
