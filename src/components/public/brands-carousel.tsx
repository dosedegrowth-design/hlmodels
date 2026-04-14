"use client";

import { useRef, useEffect, useState } from "react";

const BRANDS = [
  { name: "PomPom", logo: "/logos/pompom.png" },
  { name: "Brandili", logo: "/logos/brandili.png" },
  { name: "Marisa", logo: "/logos/marisa.png" },
  { name: "Torra", logo: "/logos/torra.png" },
  { name: "Wilson", logo: "/logos/wilson.png" },
  { name: "Netflix", logo: "/logos/netflix.png" },
  { name: "SBT", logo: "/logos/sbt.png" },
  { name: "C&A", logo: "/logos/cea.png" },
  { name: "Pampers", logo: "/logos/pampers.png" },
];

export function BrandsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

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

  const allBrands = [...BRANDS, ...BRANDS];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex items-center overflow-hidden py-4"
        style={{ scrollbarWidth: "none" }}
      >
        {allBrands.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="shrink-0 flex items-center justify-center px-10 md:px-14 cursor-default group"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              loading="lazy"
              className="h-14 md:h-20 w-auto max-w-[160px] md:max-w-[200px] object-contain opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
