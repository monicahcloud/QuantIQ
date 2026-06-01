import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-[#082b4f] px-6 py-16 text-white lg:py-24">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#20b8c7]/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#a6c83a]/20 blur-3xl" />

      <div className="absolute right-0 top-0 hidden h-full w-[45%] bg-[#20b8c7] lg:block [clip-path:ellipse(75%_90%_at_85%_50%)]" />
      <div className="absolute right-[34%] top-0 hidden h-full w-16 bg-[#a6c83a] lg:block [clip-path:ellipse(70%_90%_at_100%_50%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.9fr]">
        <div className="relative z-20">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-[#20b8c7]">
            Get In Touch
          </p>

          <h1 className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.9] md:text-7xl xl:text-8xl">
            Let’s Support
            <span className="block text-[#20b8c7]">Every Learner Together</span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/80">
            Whether you’re a parent, school, organization, or partner, we’d love
            to learn more about how QuantIQ can support your students and
            educational goals.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="#contact-form"
              className="inline-flex items-center gap-3 rounded-full bg-[#a6c83a] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#082b4f] shadow-xl transition hover:brightness-95">
              Send a Message
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="tel:12428159436"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/15">
              <PhoneCall className="h-4 w-4" />
              Call Us
            </a>
          </div>

          {/* <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            <HeroStat label="Response" value="Prompt Follow-Up" />
            <HeroStat label="Support" value="Parent Guidance" />
            <HeroStat label="Location" value="Nassau, Bahamas" />
          </div> */}
        </div>

        <div className="relative z-20 min-h-[520px]">
          <div className="absolute right-0 top-0 h-[430px] w-[340px] overflow-hidden rounded-bl-[6rem] rounded-tr-[4rem] shadow-2xl ring-[10px] ring-white/15">
            <Image
              src="/images/contact-student.png"
              alt="Student receiving learning support"
              fill
              priority
              sizes="(min-width: 1024px) 340px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-10 left-0 h-[260px] w-[230px] overflow-hidden rounded-br-[5rem] rounded-tl-[3rem] shadow-2xl ring-[8px] ring-[#082b4f]">
            <Image
              src="/images/contact-parent.png"
              alt="Parent and student consultation"
              fill
              sizes="(min-width: 1024px) 230px, 60vw"
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-0 right-16 h-32 w-32 overflow-hidden rounded-full border-[8px] border-white shadow-2xl">
            <Image
              src="/images/contact-learning.png"
              alt="Learning materials"
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>

          {/* <div className="absolute left-8 top-16 rounded-3xl bg-white p-5 text-[#082b4f] shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eefafb] text-[#20b8c7]">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#20b8c7]">
                  Start Here
                </p>
                <p className="text-lg font-black">Ask About Support</p>
              </div>
            </div>
          </div> */}

          {/* <div className="absolute bottom-36 right-0 rounded-3xl bg-[#a6c83a] p-5 text-[#082b4f] shadow-2xl">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              <p className="text-sm font-black uppercase tracking-[0.12em]">
                Learning Plans Available
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#20b8c7]">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}
