"use client";

import { useEffect, useRef, useState } from "react";
import { currentEdition } from "@/lib/edition";
import { RetreatWaves } from "./RetreatWaves";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { GlassCta } from "./GlassCta";
import { playRetreatPreview } from "@/lib/retreat-autoplay";

export function RetreatFilm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inlineVideoRef = useRef<HTMLVideoElement>(null);
  const pendingSeekRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wantsPlaybackRef = useRef(true);
  const inViewRef = useRef(false);
  const expandedRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [inlineError, setInlineError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  function startPreview(video: HTMLVideoElement) {
    if (pendingPlayRef.current) return;
    const mayPlay = () => inlineVideoRef.current === video && !document.hidden && inViewRef.current && !expandedRef.current && wantsPlaybackRef.current;
    pendingPlayRef.current = true;
    void playRetreatPreview(video, mayPlay).finally(() => { pendingPlayRef.current = false; });
  }

  useEffect(() => {
    const inlineVideo = inlineVideoRef.current;
    const expandedVideo = videoRef.current;
    if (!inlineVideo) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    wantsPlaybackRef.current = !motion.matches;
    const pause = () => {
      inlineVideo?.pause();
      expandedVideo?.pause();
    };
    const syncPlayback = () => {
      if (document.hidden || !inViewRef.current || expandedRef.current || !wantsPlaybackRef.current) {
        inlineVideo.pause();
      } else {
        startPreview(inlineVideo);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      syncPlayback();
    }, { threshold: 0.15 });
    observer.observe(inlineVideo);
    const onVisibilityChange = () => {
      if (document.hidden) pause();
      else syncPlayback();
    };
    const onMotionChange = () => {
      wantsPlaybackRef.current = !motion.matches;
      syncPlayback();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    motion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
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

  function togglePlayback() {
    const video = inlineVideoRef.current;
    if (!video) return;
    wantsPlaybackRef.current = video.paused;
    if (!video.paused) video.pause();
    else void video.play().catch(() => setInlineError(true));
  }

  function toggleSound() {
    const video = inlineVideoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  function openFilm() {
    const dialog = dialogRef.current;
    const video = videoRef.current;
    const inlineVideo = inlineVideoRef.current;
    if (!dialog || !video || !inlineVideo) return;
    pendingSeekRef.current = inlineVideo.ended ? 0 : inlineVideo.currentTime;
    video.muted = inlineVideo.muted;
    video.volume = inlineVideo.volume;
    video.playbackRate = inlineVideo.playbackRate;
    expandedRef.current = true;
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
      setIsMuted(video.muted);
    }
    pendingSeekRef.current = null;
    expandedRef.current = false;
    setIsOpen(false);
    if (inlineVideo && inViewRef.current && !document.hidden && wantsPlaybackRef.current) {
      startPreview(inlineVideo);
    }
  }

  return (
    <div className="retreat-fellowship-shot" data-playing={isPlaying}>
      <div className="retreat-film-visual">
        <RetreatWaves shape="film" />
        <div className="retreat-inline-film-mask">
          <video
            id="retreat-inline-film"
            ref={inlineVideoRef}
            className="retreat-film retreat-inline-film"
            width={464}
            height={832}
            playsInline
            loop
            preload="none"
            poster={currentEdition.assets.retreatFilmPoster}
            src={currentEdition.assets.retreatFilm}
            aria-label="EBSR retreat film, inline player"
            onError={() => setInlineError(true)}
            onPlaying={() => { setInlineError(false); setIsPlaying(true); }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
          >
            <a href={currentEdition.assets.retreatFilm}>Open the retreat film</a>
          </video>
        </div>
      </div>
      <div className="retreat-inline-controls">
        <GlassCta type="button" onClick={togglePlayback} aria-label={isPlaying ? "Pause retreat film" : "Play retreat film"} title={isPlaying ? "Pause film" : "Play film"}>
          {isPlaying ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
        </GlassCta>
        <GlassCta type="button" tone="secondary" onClick={toggleSound} aria-label={isMuted ? "Enable retreat film sound" : "Mute retreat film sound"} aria-pressed={!isMuted} title={isMuted ? "Enable sound" : "Mute sound"}>
          {isMuted ? <VolumeX size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
        </GlassCta>
        <GlassCta
          ref={triggerRef}
          type="button"
          tone="secondary"
          className="retreat-film-trigger"
          aria-label="Watch retreat film in expanded mode"
          aria-haspopup="dialog"
          aria-controls="retreat-film-dialog"
          onClick={openFilm}
          title="Watch in expanded mode"
        >
          <Maximize2 size={17} aria-hidden="true" />
        </GlassCta>
      </div>
      {inlineError && (
        <p className="retreat-film-error" role="status">
          Video unavailable. <a href={currentEdition.assets.retreatFilm}>Open the film</a>.
        </p>
      )}
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
