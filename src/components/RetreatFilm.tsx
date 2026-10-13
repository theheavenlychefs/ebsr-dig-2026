"use client";

import { useEffect, useRef, useState } from "react";
import { currentEdition } from "@/lib/edition";
import { GlassCta } from "./GlassCta";

export function RetreatFilm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const body = document.body;
    const video = videoRef.current;
    const rootOverflow = root.style.overflow;
    const bodyOverflow = body.style.overflow;
    const bodyPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - root.clientWidth;
    if (scrollbar > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
    root.style.overflow = body.style.overflow = "hidden";
    return () => {
      root.style.overflow = rootOverflow;
      body.style.overflow = bodyOverflow;
      body.style.paddingRight = bodyPadding;
      video?.pause();
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  function openFilm() {
    const dialog = dialogRef.current;
    const video = videoRef.current;
    if (!dialog || !video) return;
    setPlaybackError(false);
    dialog.showModal();
    setIsOpen(true);
    if (video.ended) video.currentTime = 0;
    // Keep play() inside the user gesture for mobile audio/autoplay policies.
    void video.play().catch(() => { if (dialog.open) setPlaybackError(true); });
  }

  return (
    <>
      <GlassCta
        ref={triggerRef}
        type="button"
        tone="secondary"
        className="retreat-film-trigger"
        aria-haspopup="dialog"
        aria-controls="retreat-film-dialog"
        onClick={openFilm}
      >
        <span>Watch the retreat</span>
        <span aria-hidden="true" className="glass-cta-arrow">&rarr;</span>
      </GlassCta>
      <dialog
        ref={dialogRef}
        id="retreat-film-dialog"
        className="retreat-film-dialog"
        aria-label="Elohim's Bible Study Retreat film"
        onClose={() => {
          videoRef.current?.pause();
          setIsOpen(false);
        }}
      >
        <div className="retreat-film-toolbar">
          <span>The Retreat / 00:59</span>
          <button
            type="button"
            className="poster-close"
            aria-label="Close retreat film"
            autoFocus
            onClick={() => dialogRef.current?.close()}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <video
          ref={videoRef}
          className="retreat-film"
          width={464}
          height={832}
          controls
          playsInline
          preload="none"
          poster={currentEdition.assets.retreatFilmPoster}
          src={currentEdition.assets.retreatFilm}
          aria-label="Retreat fellowship and Bible study footage"
          onError={() => setPlaybackError(true)}
          onPlaying={() => setPlaybackError(false)}
        >
          <a href={currentEdition.assets.retreatFilm}>Open the retreat film</a>
        </video>
        {playbackError && (
          <p className="retreat-film-error" role="status">
            Playback could not start. Use Play to retry or <a href={currentEdition.assets.retreatFilm}>open the film</a>.
          </p>
        )}
      </dialog>
    </>
  );
}
