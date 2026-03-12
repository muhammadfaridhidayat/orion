import { HeroSection } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/About";
import { WhatWeBuildSection } from "@/components/sections/WhatWeBuild";
import { DivisionsSection } from "@/components/sections/Divisions";
import { ActivitySection } from "@/components/sections/Activity";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <WhatWeBuildSection />
      <div id="divisions">
        <DivisionsSection />
      </div>
      <div id="gallery">
        <ActivitySection />
      </div>
      <Footer />
    </main>
  );
}
