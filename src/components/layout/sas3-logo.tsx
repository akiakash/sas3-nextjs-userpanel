import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/logo-hp-final.png";

type Sas3LogoProps = {
  /** Render height in pixels — width scales from official aspect ratio (211×135) */
  height?: number;
  className?: string;
  linkTo?: string;
  priority?: boolean;
};

export function Sas3Logo({
  height = 80,
  className,
  linkTo = "/",
  priority = false,
}: Sas3LogoProps) {
  const width = Math.round((height * 211) / 135);

  const img = (
    <img
      src={LOGO_SRC}
      alt="SAS3 Trading — Creating Value, Building Relationships"
      width={width}
      height={height}
      className={cn("max-w-none object-contain object-left", className)}
      style={{ height, width, maxHeight: height }}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="inline-flex shrink-0 items-center transition opacity-100 hover:opacity-90">
        {img}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{img}</span>;
}

export default Sas3Logo;
