import { Hero } from "@/components/Hero";
import { SiteHeader } from "@/components/SiteHeader";
import { RetreatSection } from "@/components/RetreatSection";
import { ExperienceSection } from "@/components/ExperienceSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080604] text-[#f6ead5]">
      <SiteHeader />
      <Hero />
      <RetreatSection />
      <ExperienceSection />
    </main>
  );
}
