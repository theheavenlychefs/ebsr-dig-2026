import { Hero } from "@/components/Hero";
import { SiteHeader } from "@/components/SiteHeader";
import { RetreatSection } from "@/components/RetreatSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080604] text-[#f6ead5]">
      <SiteHeader />
      <Hero />
      <RetreatSection />
    </main>
  );
}
