import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "white";
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { width: 100, height: 40 },
  md: { width: 140, height: 56 },
  lg: { width: 180, height: 72 },
};

export function Logo({
  variant = "dark",
  href,
  className,
  size = "md",
}: LogoProps) {
  const src = variant === "white" ? "/logo-white.png" : "/logo-dark.png";
  const { width, height } = sizes[size];

  const img = (
    <Image
      src={src}
      alt="HL Models Agency"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  );

  if (href) {
    return <Link href={href}>{img}</Link>;
  }

  return img;
}
