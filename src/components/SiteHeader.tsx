"use client";

import Image from "next/image";
import { useState } from "react";
import { currentEdition } from "@/lib/edition";
import { RegisterButton } from "./RegisterButton";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="site-header-bar mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <div className="site-brand flex min-w-0 items-center gap-3 md:gap-4">
          <a
            href="#home"
            aria-label="Elohim's Bible Study Retreat home"
            className="site-brand-logo relative h-[88px] w-[112px] shrink-0 overflow-hidden md:h-[96px] md:w-[122px]"
          >
            <Image
              src={currentEdition.assets.elohimsLogo}
              alt="Elohim's"
              width={1080}
              height={1080}
              priority
              sizes="(min-width: 768px) 132px, 122px"
              className="site-brand-mark absolute left-[-7px] top-[-28px] size-[122px] max-w-none md:left-[-8px] md:top-[-30px] md:size-[132px]"
            />
          </a>
          <div className="site-brand-identity border-l border-[#c99a38]/50 pl-3 md:pl-4">
            <p className="text-[10px] font-semibold uppercase leading-relaxed tracking-[0.08em] text-[#f5e7cf] sm:text-xs">
              Bible Study Retreat
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#b89958] sm:text-[10px]">
              2026 Edition
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Primary">
          {currentEdition.navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f5e7cf]/86 transition hover:text-[#d8b35a]"
            >
              {item.label}
            </a>
          ))}
          <RegisterButton
            label="Register for DIG"
            variant="quiet"
            className="[&>a]:min-h-11 [&>a]:px-5 [&>span]:hidden"
          />
        </nav>

        <button
          type="button"
          className="site-menu-toggle inline-flex min-h-11 items-center justify-center border border-[#c89a2c]/40 bg-black/15 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#f7ead2] lg:hidden"
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
          <RegisterButton label="Register for DIG" variant="quiet" />
        </nav>
      </div>
    </header>
  );
}
