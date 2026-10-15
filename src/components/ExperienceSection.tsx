"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { experienceSlides } from "@/lib/experience-slides";
import { createExperienceClock, slideDuration, type ClockSnapshot } from "@/lib/experience-clock";
import { ExperienceMedia } from "./ExperienceMedia";
import { currentEdition } from "@/lib/edition";

const durations = experienceSlides.map((slide) => slideDuration(slide.name, slide.title, slide.body));

function ExperienceHeading({ id, className }: { id?: string; className: string }) {
  return <header className={`experience-header ${className}`}>
    <p className="experience-eyebrow"><span>03</span> / THE EXPERIENCE</p>
    <h2 id={id}>Five days. One gathering.<br /><em>Countless moments.</em></h2>
  </header>;
}

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<ReturnType<typeof createExperienceClock> | null>(null);
  const [selected, setSelected] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [clock, setClock] = useState<ClockSnapshot>({ duration: durations[0], remaining: durations[0], running: false });
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    duration: 30,
    watchFocus: false,
    breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } },
  });

  useEffect(() => {
    if (!embla || !sectionRef.current) return;
    const timer = createExperienceClock(() => embla.scrollNext(), setClock);
    clockRef.current = timer;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setReducedMotion(motion.matches);
      timer.pause("motion", motion.matches);
    };
    const visibility = () => {
      setPageVisible(!document.hidden);
      timer.pause("hidden", document.hidden);
    };
    let currentIndex = embla.selectedScrollSnap();
    const select = () => {
      const index = embla.selectedScrollSnap();
      if (index === currentIndex) return;
      currentIndex = index;
      setSelected(index);
      timer.reset(durations[index]);
    };
    const moving = () => timer.pause("transition", true);
    const settled = () => timer.pause("transition", false);
    const pointerDown = () => timer.pause("pointer", true);
    const pointerUp = () => timer.pause("pointer", false);
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.3;
      setInView(visible);
      timer.pause("offscreen", !visible);
    }, { threshold: [0, 0.3] });

    observer.observe(sectionRef.current);
    syncMotion();
    visibility();
    timer.reset(durations[embla.selectedScrollSnap()]);
    embla.on("select", select).on("reInit", select).on("scroll", moving).on("settle", settled).on("pointerDown", pointerDown).on("pointerUp", pointerUp);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", syncMotion);
    return () => {
      observer.disconnect();
      timer.destroy();
      clockRef.current = null;
      embla.off("select", select).off("reInit", select).off("scroll", moving).off("settle", settled).off("pointerDown", pointerDown).off("pointerUp", pointerUp);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", syncMotion);
    };
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    const mobile = window.matchMedia("(max-width: 767px)");
    const track = embla.containerNode();
    const slides = embla.slideNodes();
    const originalHeight = track.style.height;
    const resize = () => {
      // Keep native portrait/square proportions without reserving the tallest mobile slide's empty space.
      const height = mobile.matches ? slides[embla.selectedScrollSnap()]?.getBoundingClientRect().height : 0;
      const nextHeight = height ? `${height}px` : originalHeight;
      if (track.style.height !== nextHeight) track.style.height = nextHeight;
    };
    const observer = new ResizeObserver(resize);
    slides.forEach((slide) => observer.observe(slide));
    embla.on("select", resize).on("reInit", resize);
    mobile.addEventListener("change", resize);
    resize();
    return () => {
      observer.disconnect();
      embla.off("select", resize).off("reInit", resize);
      mobile.removeEventListener("change", resize);
      track.style.height = originalHeight;
    };
  }, [embla]);

  useEffect(() => { clockRef.current?.pause("user", userPaused); }, [userPaused]);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;
    const fraction = 1 - clock.remaining / clock.duration;
    progress.style.transform = `scaleX(${fraction})`;
    if (!clock.running || reducedMotion) return;
    const animation = progress.animate([
      { transform: `scaleX(${fraction})` },
      { transform: "scaleX(1)" },
    ], { duration: clock.remaining, easing: "linear", fill: "forwards" });
    return () => animation.cancel();
  }, [clock, selected, reducedMotion]);

  function navigate(index: number) {
    if (!embla || index === selected) return;
    clockRef.current?.pause("transition", !reducedMotion);
    embla.scrollTo(index, reducedMotion);
    if (reducedMotion) clockRef.current?.pause("transition", false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    clockRef.current?.pause("focus", true);
    let index: number;
    if (event.key === "ArrowRight") index = (selected + 1) % experienceSlides.length;
    else if (event.key === "ArrowLeft") index = (selected + experienceSlides.length - 1) % experienceSlides.length;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = experienceSlides.length - 1;
    else return;
    event.preventDefault();
    navigate(index);
  }

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="experience-section edition-scene"
      aria-labelledby="experience-heading"
      aria-roledescription="carousel"
      data-active-slide={selected}
      data-running={clock.running}
      onKeyDown={onKeyDown}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") clockRef.current?.pause("hover", true); }}
      onPointerLeave={() => clockRef.current?.pause("hover", false)}
      onPointerDownCapture={() => clockRef.current?.pause("focus", false)}
      onFocusCapture={(event) => clockRef.current?.pause("focus", event.target.matches(":focus-visible"))}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) clockRef.current?.pause("focus", false); }}
    >
      <div className="experience-watermark" aria-hidden="true" style={{ backgroundImage: `url(${currentEdition.assets.elohimsLogo})` }} />
      <div className="experience-inner">
        <ExperienceHeading id="experience-heading" className="experience-header-mobile" />

        <div className="experience-viewport" ref={emblaRef} tabIndex={0} aria-label="Retreat moments">
          <div className="experience-track">
            {experienceSlides.map((slide, index) => (
              <article
                key={slide.name}
                className="experience-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${experienceSlides.length}: ${slide.name}`}
                aria-hidden={selected !== index}
                inert={selected !== index}
              >
                <div
                  className="experience-media"
                  style={{ "--experience-film-ratio": slide.media.kind === "video" ? slide.media.aspectRatio : 1 } as CSSProperties}
                  onClick={() => setUserPaused((paused) => !paused)}
                >
                  <ExperienceMedia slide={slide} index={index} active={selected === index && inView} playing={inView && pageVisible && !reducedMotion} onSoundInteraction={() => setUserPaused(true)} />
                </div>
                <div className="experience-slide-copy" onClick={() => setUserPaused((paused) => !paused)}>
                  <ExperienceHeading className="experience-header-desktop" />
                  <p className="experience-chapter"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{slide.name}</p>
                  <h3>{slide.title}</h3>
                  <p className="experience-description">{slide.body}</p>
                  <span className="experience-copy-rule" aria-hidden="true" />
                </div>
              </article>
            ))}
          </div>
        </div>

        <footer className="experience-controls">
          <div className="experience-pagination" aria-label="Choose an experience">
            {experienceSlides.map((slide, index) => (
              <button
                key={slide.name}
                type="button"
                className="experience-progress-button"
                aria-label={`Go to slide ${index + 1}: ${slide.name}`}
                aria-current={index === selected ? "true" : undefined}
                onClick={() => navigate(index)}
                style={{ "--segment-color": index < selected ? "#c9a14a" : "rgba(201,161,74,.2)" } as CSSProperties}
              >
                <span className="experience-progress-track">
                  {index === selected && <span key={index} ref={progressRef} className="experience-progress-fill" />}
                </span>
                <span className="experience-progress-name">{slide.name}</span>
              </button>
            ))}
          </div>
          <div className="experience-transport">
            <span className="experience-count" aria-hidden="true">{String(selected + 1).padStart(2, "0")} <span>/ {String(experienceSlides.length).padStart(2, "0")}</span></span>
            <button type="button" className="experience-control" aria-label="Previous experience" title="Previous experience" onClick={() => navigate((selected + experienceSlides.length - 1) % experienceSlides.length)}><ArrowLeft size={19} /></button>
            <button
              type="button"
              className="experience-control experience-play"
              disabled={reducedMotion}
              aria-label={reducedMotion ? "Automatic slides disabled for reduced motion" : userPaused ? "Resume automatic slides" : "Pause automatic slides"}
              title={reducedMotion ? "Automatic slides disabled for reduced motion" : userPaused ? "Resume automatic slides" : "Pause automatic slides"}
              onClick={() => setUserPaused((paused) => !paused)}
            >{userPaused || reducedMotion ? <Play size={16} /> : <Pause size={16} />}</button>
            <button type="button" className="experience-control" aria-label="Next experience" title="Next experience" onClick={() => navigate((selected + 1) % experienceSlides.length)}><ArrowRight size={19} /></button>
          </div>
        </footer>
        <p className="experience-announcement sr-only" aria-live={clock.running ? "off" : "polite"} aria-atomic="true">{experienceSlides[selected].name}. {experienceSlides[selected].title} Slide {selected + 1} of {experienceSlides.length}.</p>
      </div>
    </section>
  );
}
