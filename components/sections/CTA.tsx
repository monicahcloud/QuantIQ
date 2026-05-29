import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-muted p-10 md:flex-row md:items-center">
        <div>
          <p className="font-bold uppercase text-quantiq-sky">
            Ready To Get Started?
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-primary">
            Let’s build a path to success — together.
          </h2>

          <p className="mt-3 text-muted-foreground">
            Schedule a consultation to learn how QuantIQ can support your
            student.
          </p>
        </div>

        <Button className="bg-quantiq-sky text-white hover:bg-quantiq-sky/90">
          Book a Consultation
        </Button>
      </div>
    </section>
  );
}
