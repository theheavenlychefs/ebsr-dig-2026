"use client";

import { useEffect, useRef, useState } from "react";
import { currentEdition } from "@/lib/edition";
import { GlassCta } from "./GlassCta";

export function RetreatFilm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inlineVideoRef = useRef<HTMLVideoElement>(null);
  const pendingSeekRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [inlineError, setInlineError] = useState(false);

  useEffect(() => {
    const inlineVideo = inlineVideoRef.current;
    const expandedVideo = videoRef.current;
    const pause = () => {
      inlineVideo?.pause();
      expandedVideo?.pause();
    };
    const onVisibilityChange = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      pause();
    };
  }, []);

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
    const inlineVideo = inlineVideoRef.current;
    if (!dialog || !video || !inlineVideo) return;
    pendingSeekRef.current = inlineVideo.ended ? 0 : inlineVideo.currentTime;
    video.muted = inlineVideo.muted;
    video.volume = inlineVideo.volume;
    video.playbackRate = inlineVideo.playbackRate;
    inlineVideo.pause();
    setPlaybackError(false);
    dialog.showModal();
    setIsOpen(true);
    if (video.readyState >= 1) seekToInlinePosition();
    // Keep play() inside the user gesture for mobile audio/autoplay policies.
    void video.play().catch(() => { if (dialog.open) setPlaybackError(true); });
  }

  function seekToInlinePosition() {
    const video = videoRef.current;
    if (!video || pendingSeekRef.current === null) return;
    video.currentTime = pendingSeekRef.current;
    pendingSeekRef.current = null;
  }

  function closeFilm() {
    const video = videoRef.current;
    const inlineVideo = inlineVideoRef.current;
    video?.pause();
    if (video && inlineVideo && video.readyState >= 1) {
      inlineVideo.currentTime = video.currentTime;
      inlineVideo.muted = video.muted;
      inlineVideo.volume = video.volume;
      inlineVideo.playbackRate = video.playbackRate;
    }
    pendingSeekRef.current = null;
    setIsOpen(false);
  }

  return (
    <div className="retreat-fellowship-shot">
      <video
        ref={inlineVideoRef}
        className="retreat-film retreat-inline-film"
        width={464}
        height={832}
        controls
        playsInline
        preload="none"
        poster={currentEdition.assets.retreatFilmPoster}
        src={currentEdition.assets.retreatFilm}
        aria-label="EBSR retreat film, inline player"
        onError={() => setInlineError(true)}
        onPlaying={() => setInlineError(false)}
      >
        <a href={currentEdition.assets.retreatFilm}>Open the retreat film</a>
      </video>
      {inlineError && (
        <p className="retreat-film-error" role="status">
          Video unavailable. <a href={currentEdition.assets.retreatFilm}>Open the film</a>.
        </p>
      )}
      <GlassCta
        ref={triggerRef}
        type="button"
        tone="secondary"
        className="retreat-film-trigger"
        aria-label="Watch retreat film in expanded mode"
        aria-haspopup="dialog"
        aria-controls="retreat-film-dialog"
        onClick={openFilm}
      >
        <span>Expand film</span>
        <span aria-hidden="true" className="glass-cta-arrow">&rarr;</span>
      </GlassCta>
      <dialog
        ref={dialogRef}
        id="retreat-film-dialog"
        className="retreat-film-dialog"
        aria-label="Elohim's Bible Study Retreat film"
        onClose={closeFilm}
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
          onLoadedMetadata={seekToInlinePosition}
        >
          <a href={currentEdition.assets.retreatFilm}>Open the retreat film</a>
        </video>
        {playbackError && (
          <p className="retreat-film-error" role="status">
            Playback could not start. Use Play to retry or <a href={currentEdition.assets.retreatFilm}>open the film</a>.
          </p>
        )}
      </dialog>
    </div>
  );
}
