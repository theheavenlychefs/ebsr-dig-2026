import { FaqAccordion } from "@/components/FaqAccordion";
import { Hero } from "@/components/Hero";
import { RegisterButton } from "@/components/RegisterButton";
import { SiteHeader } from "@/components/SiteHeader";
import { currentEdition } from "@/lib/edition";

const experiences = [
  "Biblical discussions",
  "Communal worship",
  "Prayer",
  "Fellowship",
  "Making memories",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080604] text-[#f6ead5]">
      <SiteHeader />
      <Hero />

      <section id="retreat" className="cinematic-section px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c89a2c]">
            The Retreat
          </p>
          <div>
            <h1 className="text-balance font-serif text-5xl leading-[0.95] text-[#fff3dd] md:text-7xl">
              Not just an audience.
              <br />
              A gathering around the Word.
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-9 text-[#d8ccb7]">
              EBSR was born from a burden to create a gathering where
              believers study Scripture together, ask questions, contribute,
              and learn through moderated discussions.
            </p>
          </div>
        </div>
      </section>

      <section
        id="theme"
        className="border-y border-[#c89a2c]/15 bg-[#0d0906] px-5 py-24 md:px-8 md:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c89a2c]">
              The Theme
            </p>
            <h2 className="mt-6 font-serif text-5xl leading-none text-[#fff3dd] md:text-7xl">
              Death Is Gain
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-9 text-[#d8ccb7]">
            <p>
              DIG introduces the 2026 edition through the words of Paul in{" "}
              {currentEdition.scriptureAnchor}: “For to me to live is Christ,
              and to die is gain.”
            </p>
            <p>
              The theme invites careful study of life in Christ, the believer&apos;s
              hope, and the meaning of gain as Scripture presents it. It is a
              foundation for shared reflection, not a manufactured slogan.
            </p>
          </div>
        </div>
      </section>

      <section id="experience" className="cinematic-section px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c89a2c]">
              The Experience
            </p>
            <h2 className="mt-6 font-serif text-5xl leading-none text-[#fff3dd] md:text-7xl">
              Five days.
              <br />
              A shared life.
            </h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden border border-[#c89a2c]/18 bg-[#c89a2c]/18 md:grid-cols-5">
            {experiences.map((experience) => (
              <div
                key={experience}
                className="min-h-36 bg-[#100b07] p-6 md:min-h-52"
              >
                <p className="font-serif text-3xl leading-tight text-[#fff3dd]">
                  {experience}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#c89a2c]/15 bg-[#0b0705] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c89a2c]">
            Previous Edition
          </p>
          <div>
            <h2 className="font-serif text-5xl leading-none text-[#fff3dd] md:text-7xl">
              {currentEdition.previousEdition.name}{" "}
              <span className="text-[#c89a2c]">
                ({currentEdition.previousEdition.year})
              </span>
            </h2>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-[#d8ccb7]">
              {currentEdition.previousEdition.theme}
            </p>
            <p className="mt-8 max-w-3xl text-base leading-8 text-[#bfae91]">
              Retreat photographs have not been supplied in this workspace yet.
              This section is reserved for actual images from the previous
              edition once they are available.
            </p>
          </div>
        </div>
      </section>

      <section id="faqs" className="cinematic-section px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c89a2c]">
              FAQs
            </p>
            <h2 className="mt-6 font-serif text-5xl leading-none text-[#fff3dd] md:text-7xl">
              Before you come.
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <section className="bg-[#080604] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl border-t border-[#c89a2c]/25 pt-16">
          <div className="max-w-3xl">
            <h2 className="text-balance font-serif text-5xl leading-none text-[#fff3dd] md:text-7xl">
              Set apart the days.
              <br />
              Prepare your heart.
            </h2>
            <p className="mt-8 text-lg leading-8 text-[#d8ccb7]">
              We look forward to gathering with you.
            </p>
            <div className="mt-10">
              <RegisterButton />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
