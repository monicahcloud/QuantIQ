import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";
import { Navbar } from "@/components/layout/Navbar";

export default function ContactPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-[#eefafb] text-[#082b4f]">
      <ContactHero />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        <ContactInfo />
        <ContactForm />
      </section>
    </main></>
  );
}
