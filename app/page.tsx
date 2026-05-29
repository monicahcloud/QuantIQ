import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { SupportAreas } from "@/components/sections/SupportAreas";
import { Impact } from "@/components/sections/Impact";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Navbar />
      <Hero />
      <Services />
      <SupportAreas />
      <Impact />
      <CTA />
      <Footer />
    </main>
  );
}
