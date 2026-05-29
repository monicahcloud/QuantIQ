import Image from "next/image";

type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-24 w-auto object-contain" }: LogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="QuantIQ Learning Institute"
      width={720}
      height={240}
      priority
      className={className}
    />
  );
}
