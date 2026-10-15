"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { ExperienceSlide } from "@/lib/experience-slides";

export function ExperienceMedia({ slide, index, active, playing, onSoundInteraction }: {
  slide: ExperienceSlide;
  index: number;
  active: boolean;
  playing: boolean;
  onSoundInteraction: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackAllowedRef = useRef(false);
  playbackAllowedRef.current = active && playing;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const media = slide.media;

  useEffect(() => {
    if (active && media.kind === "video") setLoaded(true);
  }, [active, media.kind]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loaded || failed) return;
    let cancelled = false;
    if (active && playing) {
      void video.play().then(() => {
        if (!playbackAllowedRef.current) video.pause();
        else if (!cancelled) setBlocked(false);
      }).catch((error: DOMException) => {
        if (cancelled || error.name === "AbortError") return;
        if (error.name === "NotAllowedError") setBlocked(true);
        else setFailed(true);
      });
    } else video.pause();
    return () => { cancelled = true; video.pause(); };
  }, [active, playing, loaded, failed]);

  if (media.kind === "pending") {
    return (
      <div className="experience-media-pending" role="img" aria-label={media.label}>
        <span className="experience-pending-index" aria-hidden="true">{slide.name === "Worship" ? "02" : "03"}</span>
        <p>{media.label}</p>
        <span className="experience-pending-rule" aria-hidden="true" />
      </div>
    );
  }

  if (media.kind === "image") {
    return <Image src={media.src} alt={media.alt} fill sizes="(min-width: 1024px) 760px, calc(100vw - 40px)" style={{ objectPosition: media.position }} className="experience-still" loading="lazy" draggable={false} />;
  }

  return (
    <div className="experience-film-frame" style={{ aspectRatio: media.aspectRatio }}>
      <Image src={media.poster} alt={media.alt} fill sizes="(min-width: 1024px) 760px, calc(100vw - 40px)" className="experience-video-poster" loading="lazy" draggable={false} />
      {!failed && <video
        ref={videoRef}
        className="experience-video"
        src={loaded ? media.src : undefined}
        poster={media.poster}
        muted={muted}
        playsInline
        loop
        preload="none"
        aria-label={media.alt}
        onError={() => setFailed(true)}
      />}
      <span className="experience-media-label" aria-hidden="true">EBSR <span>/</span> {String(index + 1).padStart(2, "0")}</span>
      {(failed || blocked) && <span className="experience-media-status">{failed ? "Retreat film still" : "Film preview paused"}</span>}
      {!failed && <button
        type="button"
        className="experience-sound"
        aria-label={muted ? "Enable experience film sound" : "Mute experience film sound"}
        aria-pressed={!muted}
        title={muted ? "Enable sound" : "Mute sound"}
        onClick={(event) => {
          event.stopPropagation();
          onSoundInteraction();
          const video = videoRef.current;
          if (!video) return;
          video.muted = !video.muted;
          setMuted(video.muted);
          // The explicit gesture can unlock playback on restrictive mobile browsers.
          void video.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
        }}
      >{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>}
    </div>
  );
}
