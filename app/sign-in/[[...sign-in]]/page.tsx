import Image from "next/image";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#071d4e] px-12 py-10 text-white lg:flex lg:flex-col">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

        <Link href="/" className="relative z-10">
          <div className="relative h-16 w-56">
            <Image
              src="/images/logo.png"
              alt="QuantIQ Learning Institute"
              fill
              priority
              sizes="224px"
              className="object-contain object-left "
            />
          </div>
        </Link>

        <div className="relative z-10 my-auto max-w-xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-200">
            QuantIQ Educator Studio
          </p>

          <h1 className="mt-5 text-5xl font-black leading-tight tracking-[-0.04em]">
            Welcome back to your intelligent teaching workspace.
          </h1>

          <p className="mt-6 text-lg leading-8 text-blue-100/80">
            Continue creating lessons, generating resources, analyzing student
            needs, and preparing for what comes next.
          </p>
        </div>

        <p className="relative z-10 text-sm text-blue-100/60">
          © {new Date().getFullYear()} QuantIQ Learning Institute
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/">
              <div className="relative mx-auto h-16 w-56">
                <Image
                  src="/images/quantiq-logo.png"
                  alt="QuantIQ Learning Institute"
                  fill
                  priority
                  sizes="224px"
                  className="object-contain"
                />
              </div>
            </Link>

            <p className="mt-3 text-sm font-bold text-slate-500">
              Educator Studio
            </p>
          </div>

          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/educator-studio/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none",
                card: "w-full rounded-3xl border border-slate-200 shadow-xl",
                headerTitle: "text-[#071d4e]",
                formButtonPrimary:
                  "bg-gradient-to-r from-blue-700 to-violet-600 hover:opacity-90",
                footerActionLink: "text-blue-700 hover:text-blue-800",
              },
            }}
          />
        </div>
      </section>
    </main>
  );
}
