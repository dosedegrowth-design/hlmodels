"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

// Marcas parceiras — logos em /public/marcas/
const BRANDS = [
  { name: "PomPom", logo: "pompom.png" },
  { name: "Brandili", logo: "Brandili-.png" },
  { name: "Marisa", logo: "Marisa.png" },
  { name: "Torra", logo: "torra.png" },
  { name: "Wilson", logo: "Wilson-logo.svg.png" },
  { name: "Netflix", logo: "Logonetflix.png" },
  { name: "SBT", logo: "Logotipo_do_SBT.svg.png" },
  { name: "C&A", logo: "c-e-a-logo-1.png" },
  { name: "Pampers", logo: "pampers-logo-1.png" },
];

export function BrandsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll infinite
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = 0;

    function animate() {
      if (!el || isHovered) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      scrollPos += 0.5;
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  // Duplicate brands for infinite scroll
  const allBrands = [...BRANDS, ...BRANDS];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex items-center overflow-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {allBrands.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="shrink-0 flex items-center justify-center px-8 md:px-12 cursor-default group"
          >
            <div className="relative h-10 md:h-12 w-24 md:w-32 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300">
              <Image
                src={`/marcas/${brand.logo}`}
                alt={brand.name}
                fill
                className="object-contain"
                sizes="128px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
