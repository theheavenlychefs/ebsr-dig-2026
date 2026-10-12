"use client";

import Image from "next/image";
import { useState } from "react";
import { currentEdition } from "@/lib/edition";
import { RegisterButton } from "./RegisterButton";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#home"
          aria-label="Elohim's Bible Study Retreat home"
          className="relative h-14 w-40 shrink-0 md:h-16 md:w-48"
        >
          <Image
            src={currentEdition.assets.elohimsLogo}
            alt="Elohim's"
            fill
            priority
            sizes="(min-width: 768px) 192px, 160px"
            className="object-contain object-left"
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {currentEdition.navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f1e4cd]/82 transition hover:text-[#d8b35a]"
            >
              {item.label}
            </a>
          ))}
          <RegisterButton variant="quiet" className="[&>span]:hidden" />
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center border border-[#c89a2c]/40 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f7ead2] lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      <div
        id="mobile-menu"
        className={
          isOpen
            ? "border-t border-white/10 bg-[#080604]/95 px-5 py-5 lg:hidden"
            : "hidden"
        }
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-4" aria-label="Mobile">
          {currentEdition.navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#f1e4cd]"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <RegisterButton variant="quiet" />
        </nav>
      </div>
    </header>
  );
}
