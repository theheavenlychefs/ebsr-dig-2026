import Image from "next/image";
import { currentEdition } from "@/lib/edition";
import { RegisterButton } from "./RegisterButton";
import { GlassCta } from "./GlassCta";

export function Hero() {
  const poster = currentEdition.assets.poster;

  return (
    <section
      id="home"
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
        <div className="dig-hero-content max-w-[720px] pt-[24.5px]">
          <Image
            src={currentEdition.assets.digLogo}
            alt="DIG"
            width={1254}
            height={705}
            priority
            sizes="(min-width: 768px) min(760px, calc((100vh - 330px) * 1.486)), 92vw"
            className="dig-wordmark mb-3 h-auto w-[min(760px,calc((100vh-330px)*1.486),92vw)] max-w-none -translate-x-[12.4%]"
          />

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
                href={poster}
                tone="secondary"
                className="w-[210px]"
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
