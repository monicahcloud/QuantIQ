type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
}: SectionHeadingProps) {
  return (
    <div>
      <p className="text-sm font-extrabold uppercase tracking-wide text-quantiq-sky">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-4xl font-extrabold leading-tight text-primary">
        {title} <br />
        {highlight ? (
          <span className="text-quantiq-sky">{highlight}</span>
        ) : null}
      </h2>

      {description ? (
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-700">
          {description}
        </p>
      ) : null}
    </div>
  );
}
