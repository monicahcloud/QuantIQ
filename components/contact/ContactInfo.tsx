import { Mail, MapPin, Phone, Clock3 } from "lucide-react";

export function ContactInfo() {
  return (
    <aside className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#20b8c7]">
          Contact Information
        </p>

        <div className="mt-8 space-y-6">
          <ContactItem
            icon={<Mail className="h-6 w-6" />}
            title="Email"
            value="info@quantiqlearning.com"
          />
          <ContactItem
            icon={<Phone className="h-6 w-6" />}
            title="Phone"
            value="242-815-9436"
          />
          <ContactItem
            icon={<MapPin className="h-6 w-6" />}
            title="Location"
            value="Nassau, Bahamas"
          />
          <ContactItem
            icon={<Clock3 className="h-6 w-6" />}
            title="Hours"
            value="Monday – Friday | 9:00 AM – 6:00 PM"
          />
        </div>
      </div>

      <div className="rounded-[2rem] bg-[#082b4f] p-8 text-white shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#20b8c7]">
          Stay Connected
        </p>

        {/* <div className="mt-6 flex gap-4">
          <SocialButton icon={<Facebook className="h-5 w-5" />} />
          <SocialButton icon={<Instagram className="h-5 w-5" />} />
          <SocialButton icon={<Linkedin className="h-5 w-5" />} />
        </div> */}

        <p className="mt-8 text-sm leading-7 text-white/70">
          Follow QuantIQ Learning Institute for updates, programs, workshops,
          learning resources, and student success stories.
        </p>
      </div>
    </aside>
  );
}

function ContactItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#eefafb] text-[#20b8c7]">
        {icon}
      </div>

      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#20b8c7]">
          {title}
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-white transition hover:bg-[#20b8c7]">
      {icon}
    </button>
  );
}
