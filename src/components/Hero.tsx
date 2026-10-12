import Image from "next/image";
import { currentEdition } from "@/lib/edition";
import { RegisterButton } from "./RegisterButton";

export function Hero() {
  const poster = currentEdition.assets.poster;

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen overflow-hidden bg-[#080604] pt-32"
    >
      <Image
        src={currentEdition.assets.heroBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="z-[-1] object-cover object-[64%_center] md:object-[72%_center]"
      />

      <div className="mx-auto flex w-full max-w-7xl items-center px-5 pb-12 pt-8 md:px-8">
        <div className="max-w-[720px]">
          <div className="mb-4 flex max-w-[620px] items-center gap-4 text-[#d6ad4e]">
            <span className="h-px flex-1 bg-[#c99a38]/65" aria-hidden="true" />
            <p className="shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.22em]">
              Elohim&apos;s Bible Study Retreat
            </p>
            <span className="h-px flex-1 bg-[#c99a38]/65" aria-hidden="true" />
          </div>

          <Image
            src={currentEdition.assets.digLogo}
            alt="DIG"
            width={1254}
            height={705}
            priority
            sizes="(min-width: 768px) 760px, 92vw"
            className="mb-4 h-auto w-full max-w-[760px]"
          />

          <div className="mb-6 flex flex-col gap-3 text-sm text-[#f5e7cf] sm:flex-row sm:items-center sm:gap-8">
            <p className="inline-flex items-center gap-3">
              <CalendarIcon />
              <span>{currentEdition.dates}</span>
            </p>
            <p className="inline-flex items-center gap-3">
              <LocationIcon />
              <span>{currentEdition.location}</span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start">
            <RegisterButton className="[&>a]:w-[210px]" />
            {poster ? (
              <a
                href={poster}
                className="inline-flex min-h-12 w-[210px] items-center justify-center gap-3 border border-[#c99a38]/55 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#fff2dc] transition hover:border-[#d8b35a] hover:bg-[#d8b35a]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ad4e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080604]"
              >
                <span>View the poster</span>
                <span aria-hidden="true" className="text-[#d6ad4e]">
                  →
                </span>
              </a>
            ) : (
              <button
                type="button"
                className="inline-flex min-h-12 w-[210px] cursor-not-allowed items-center justify-center gap-3 border border-[#c99a38]/55 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#fff2dc]/80"
                aria-label="View the poster, coming soon"
              >
                <span>View the poster</span>
                <span aria-hidden="true" className="text-[#d6ad4e]">
                  →
                </span>
              </button>
            )}
          </div>

          <p className="mt-4 inline-flex items-center gap-3 text-sm text-[#d6ad4e]">
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
