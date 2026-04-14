"use client";

import { useRef, useEffect, useState } from "react";

// Marcas parceiras da HL Models (do site antigo)
const BRANDS = [
  { name: "PomPom", color: "#FF6B00" },
  { name: "Brandili", color: "#E91E63" },
  { name: "Marisa", color: "#D81B60" },
  { name: "Torra", color: "#FF1744" },
  { name: "Wilson", color: "#1565C0" },
  { name: "Fit", color: "#FFB300" },
  { name: "Algodao Doce", color: "#FF4081" },
  { name: "Felps", color: "#8D6E63" },
  { name: "Verao de Maria", color: "#AB47BC" },
  { name: "Yawe", color: "#2E7D32" },
  { name: "Mona", color: "#F48FB1" },
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
      // Reset to create infinite loop
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
            className="shrink-0 flex items-center cursor-default group"
          >
            <span className="text-2xl md:text-3xl font-light text-muted/30 group-hover:text-foreground transition-colors duration-300 whitespace-nowrap px-4">
              {brand.name}
            </span>
            <span className="text-muted/20 text-lg select-none">&mdash;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
