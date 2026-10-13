"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  image: string;
  animation: string;
  alphaProbe: string;
  active?: boolean;
};

// Test decoded pixels, not the container extension or canPlayType alone.
function supportsAlphaVideo(source: string, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = document.createElement("video");
    if (!probe.canPlayType('video/webm; codecs="vp9"') || signal.aborted) {
      resolve(false);
      return;
    }
    let finished = false;
    const finish = (supported: boolean) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      signal.removeEventListener("abort", abort);
      probe.onloadeddata = null;
      probe.onerror = null;
      probe.removeAttribute("src");
      probe.load();
      resolve(supported);
    };
    const abort = () => finish(false);
    const timeout = setTimeout(abort, 4000);
    signal.addEventListener("abort", abort, { once: true });
    probe.muted = true;
    probe.playsInline = true;
    probe.onloadeddata = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context?.drawImage(probe, 0, 0, 1, 1);
        finish(!!context && context.getImageData(0, 0, 1, 1).data[3] === 0);
      } catch {
        finish(false);
      }
    };
    probe.onerror = abort;
    probe.preload = "auto";
    probe.src = source;
    probe.load();
  });
}

export function CyclicAlphaLogo({ image, animation, alphaProbe, active = true }: Props) {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const reconcileRef = useRef<() => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    reconcileRef.current();
  }, [active]);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const abort = new AbortController();
    const hasFrameCallbacks = typeof video.requestVideoFrameCallback === "function";
    let disposed = false;
    let inView = true;
    let failed = false;
    let loaded = false;
    let phase: "static" | "starting" | "playing" = "static";
    let remaining = 10000;
    let startedAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let startupTimer: ReturnType<typeof setTimeout> | undefined;
    let frame: number | undefined;
    const eligible = () => !disposed && !failed && !motion.matches &&
      !document.hidden && activeRef.current && inView;
    const cancelFrame = () => {
      if (frame !== undefined) video.cancelVideoFrameCallback(frame);
      frame = undefined;
    };
    const stopTimer = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
        remaining = Math.max(0, remaining - (performance.now() - startedAt));
        timer = undefined;
      }
    };
    const fail = () => {
      failed = true;
      stopTimer();
      clearTimeout(startupTimer);
      cancelFrame();
      video.pause();
      setShowVideo(false);
    };
    const reveal = () => {
      cancelFrame();
      if (!eligible() || phase === "static" || video.paused) return;
      phase = "playing";
      clearTimeout(startupTimer);
      setShowVideo(true);
    };
    const onPlaying = () => {
      cancelFrame();
      if (hasFrameCallbacks) {
        frame = video.requestVideoFrameCallback(reveal);
      }
    };
    const onTimeUpdate = () => {
      // Some browsers suppress compositor callbacks while the video is invisible.
      if (video.currentTime > 0 && video.readyState >= 2) reveal();
    };
    const play = () => {
      if (!eligible()) return;
      if (phase === "starting") startupTimer = setTimeout(fail, 10000);
      void video.play().catch(() => { if (eligible()) fail(); });
    };
    const begin = () => {
      if (!eligible() || phase !== "static" || remaining > 0 || !loaded || video.readyState < 3) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0 || video.duration >= 20) {
        fail();
        return;
      }
      phase = "starting";
      video.currentTime = 0;
      play();
    };
    const reconcile = () => {
      if (!eligible()) {
        stopTimer();
        clearTimeout(startupTimer);
        cancelFrame();
        video.pause();
        return;
      }
      if (phase !== "static") {
        if (video.paused) play();
        return;
      }
      if (remaining === 0) begin();
      else if (timer === undefined) {
        startedAt = performance.now();
        timer = setTimeout(() => {
          timer = undefined;
          remaining = 0;
          begin();
        }, remaining);
      }
    };
    const onEnded = () => {
      cancelFrame();
      clearTimeout(startupTimer);
      setShowVideo(false);
      phase = "static";
      remaining = 10000;
      reconcile();
    };
    const onWaiting = () => setShowVideo(false);
    const onMotionChange = () => {
      if (motion.matches) {
        fail();
        video.removeAttribute("src");
        video.load();
      }
      reconcile();
    };
    reconcileRef.current = reconcile;
    video.addEventListener("canplay", begin);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("error", fail);
    document.addEventListener("visibilitychange", reconcile);
    motion.addEventListener("change", onMotionChange);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      reconcile();
    });
    observer.observe(container);
    reconcile();
    // No animation request at all for reduced motion; only a tiny probe otherwise.
    if (!motion.matches) {
      void supportsAlphaVideo(alphaProbe, abort.signal).then((supported) => {
        if (disposed || motion.matches) return;
        if (!supported) { fail(); return; }
        loaded = true;
        video.preload = "auto";
        video.src = animation;
        video.load();
      });
    }
    return () => {
      disposed = true;
      abort.abort();
      stopTimer();
      clearTimeout(startupTimer);
      cancelFrame();
      observer.disconnect();
      video.pause();
      video.removeEventListener("canplay", begin);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("error", fail);
      document.removeEventListener("visibilitychange", reconcile);
      motion.removeEventListener("change", onMotionChange);
      video.removeAttribute("src");
      video.load();
      reconcileRef.current = () => {};
    };
  }, [animation, alphaProbe]);

  return (
    <div ref={containerRef} data-animated={showVideo} className="dig-wordmark dig-logo-cycle relative mb-3 h-auto w-[min(760px,calc((100vh-330px)*1.486),92vw)] max-w-none -translate-x-[12.4%]">
      <Image
        src={image}
        alt="DIG"
        width={1254}
        height={705}
        priority
        sizes="(min-width: 768px) min(760px, calc((100vh - 330px) * 1.486)), 92vw"
        className="dig-logo-static block h-auto w-full"
      />
      <video ref={videoRef} className="dig-logo-video" muted playsInline preload="none" aria-hidden="true" disablePictureInPicture tabIndex={-1} />
    </div>
  );
}
