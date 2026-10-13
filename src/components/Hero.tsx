"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { currentEdition } from "@/lib/edition";
import { RegisterButton } from "./RegisterButton";
import { GlassCta } from "./GlassCta";
import { CyclicAlphaLogo } from "./CyclicAlphaLogo";

export function Hero() {
  const poster = currentEdition.assets.poster;
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [isPosterEnlarged, setIsPosterEnlarged] = useState(false);
  const [posterPortalReady, setPosterPortalReady] = useState(false);
  const posterDialogRef = useRef<HTMLDialogElement>(null);
  const posterTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setPosterPortalReady(true), []);

  useEffect(() => {
    if (!isPosterOpen || !posterPortalReady) return;
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarWidth}px`;
    }
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    posterDialogRef.current?.showModal();
    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousPadding;
      posterTriggerRef.current?.focus({ preventScroll: true });
    };
  }, [isPosterOpen, posterPortalReady]);

  return (
    <section
      id="home"
      data-poster-open={isPosterOpen}
      className="dig-hero relative isolate flex min-h-dvh overflow-hidden bg-[#080604] pb-6 pt-[clamp(5.75rem,13vh,8rem)]"
    >
      <Image
        src={currentEdition.assets.heroBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="dig-hero-background z-[-1] object-cover object-[64%_center] md:object-[72%_center]"
      />

      <div className="mx-auto flex w-full max-w-7xl items-start px-5 md:px-8">
        <div
          className="dig-hero-content max-w-[720px] pt-[24.5px]"
          inert={isPosterOpen}
          aria-hidden={isPosterOpen}
        >
          <div className="dig-wordmark-frame">
            <CyclicAlphaLogo
              image={currentEdition.assets.digLogo}
              animation={currentEdition.assets.digAnimation}
              alphaProbe={currentEdition.assets.alphaProbe}
              active={!isPosterOpen}
            />
          </div>

          {/* Compensate for the PNG's lower transparent padding without moving DIG. */}
          <div className="dig-event-details -mt-[min(92px,calc((100vh-330px)*0.18),11vw)] mb-6 flex flex-col gap-2 text-[15px] leading-6 text-[#f5e7cf] sm:flex-row sm:items-center sm:gap-7 md:text-base">
            <p className="inline-flex items-center gap-2.5 whitespace-nowrap">
              <CalendarIcon />
              <span>{currentEdition.dates}</span>
            </p>
            <p className="inline-flex items-center gap-2.5 whitespace-nowrap">
              <LocationIcon />
              <span>{currentEdition.location}</span>
            </p>
          </div>

          <div className="dig-hero-actions flex flex-col items-start gap-3 sm:flex-row sm:items-start">
            <RegisterButton className="[&>a]:w-[210px] [&>span]:hidden" />
            {poster ? (
              <GlassCta
                ref={posterTriggerRef}
                type="button"
                aria-haspopup="dialog"
                aria-controls="dig-poster-dialog"
                onClick={() => {
                  setIsPosterOpen(true);
                }}
                tone="secondary"
                className="w-[210px] cursor-pointer"
              >
                <span>View the poster</span>
                <span aria-hidden="true" className="glass-cta-arrow text-[#d6ad4e]">
                  &rarr;
                </span>
              </GlassCta>
            ) : (
              <GlassCta
                type="button"
                tone="secondary"
                className="w-[210px] cursor-not-allowed"
                aria-disabled="true"
                aria-label="View the poster, coming soon"
                title="Poster not available yet."
              >
                <span>View the poster</span>
                <span aria-hidden="true" className="glass-cta-arrow text-[#d6ad4e]">
                  &rarr;
                </span>
              </GlassCta>
            )}
          </div>

          <p className="dig-registration-note mt-[14px] inline-flex items-center gap-3 text-sm text-[#d6ad4e]">
            <span className="size-1.5 rounded-full bg-[#d6ad4e]" aria-hidden="true" />
            <span>{currentEdition.registrationNote}</span>
          </p>
        </div>
      </div>

      {poster && posterPortalReady && createPortal(
        <dialog
          ref={posterDialogRef}
          id="dig-poster-dialog"
          className="poster-dialog"
          aria-label="Official DIG 2026 promotional poster"
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }}
          onClose={() => {
            setIsPosterOpen(false);
            setIsPosterEnlarged(false);
          }}
        >
          <div className="poster-toolbar">
            <button
              type="button"
              className="poster-close"
              aria-label="Close poster"
              autoFocus
              onClick={() => posterDialogRef.current?.close()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="poster-stage">
            <button
              type="button"
              className="poster-artwork"
              data-enlarged={isPosterEnlarged}
              aria-label={isPosterEnlarged ? "Restore poster size" : "Enlarge poster"}
              aria-pressed={isPosterEnlarged}
              onClick={() => setIsPosterEnlarged((value) => !value)}
            >
              <Image
                src={poster}
                loading="eager"
                alt="Official DIG 2026 Bible Study Retreat poster, 16 to 20 December 2026"
                fill
                sizes="(max-width: 767px) calc(100vw - 40px), 544px"
                className="poster-image"
              />
            </button>
          </div>
        </dialog>,
        document.body
      )}
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 text-[#d6ad4e]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M4 9h16" />
      <path d="M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 text-[#d6ad4e]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
      <path d="M12 10.5h.01" />
    </svg>
  );
}
