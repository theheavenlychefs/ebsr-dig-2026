import Image from "next/image";
import { currentEdition } from "@/lib/edition";
import { RegisterButton } from "./RegisterButton";

export function Hero() {
  const poster = currentEdition.assets.poster;

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen overflow-hidden bg-[#080604] pt-28"
    >
      <Image
        src={currentEdition.assets.heroBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="z-[-3] object-cover object-[64%_center] md:object-[72%_center]"
      />
      <div className="absolute inset-0 z-[-2] bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.82)_32%,rgba(0,0,0,0.24)_70%,rgba(0,0,0,0.08)_100%)]" />
      <div className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(8,6,4,0.1)_0%,rgba(8,6,4,0.12)_70%,rgba(8,6,4,1)_100%)]" />

      <div className="mx-auto flex w-full max-w-7xl items-center px-5 pb-16 pt-10 md:px-8">
        <div className="max-w-xl">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.32em] text-[#d6ad4e] md:text-sm">
            Elohim&apos;s Bible Study Retreat
          </p>

          <div className="relative mb-8 h-28 w-full max-w-[430px] md:h-36 md:max-w-[540px]">
            <Image
              src={currentEdition.assets.digLogo}
              alt="DIG"
              fill
              priority
              sizes="(min-width: 768px) 540px, 90vw"
              className="object-contain object-left"
            />
          </div>

          <div className="mb-9 space-y-3 border-l border-[#c89a2c]/45 pl-5">
            <p className="font-serif text-3xl leading-tight text-[#fff4de] md:text-5xl">
              {currentEdition.dates}
            </p>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d9cbb2]">
              {currentEdition.location}
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
            <RegisterButton />
            {poster ? (
              <a
                href={poster}
                className="inline-flex min-h-12 items-center justify-center border border-[#f4e2bb]/35 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f7ead2] transition hover:border-[#d8b35a] hover:bg-[#d8b35a]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ad4e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080604]"
              >
                View the poster
              </a>
            ) : null}
          </div>

          <p className="mt-8 text-sm uppercase tracking-[0.22em] text-[#f2e2c6]/75">
            {currentEdition.registrationNote}
          </p>
        </div>
      </div>
    </section>
  );
}
