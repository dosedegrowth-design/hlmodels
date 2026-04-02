"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIAS } from "@/types";

export function CategoriesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scrollBy("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-foreground/60 hover:text-foreground transition-colors hidden lg:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scrollBy("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-foreground/60 hover:text-foreground transition-colors hidden lg:flex"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>

      {/* Scrollable area */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 lg:px-10 -mx-6 lg:-mx-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CATEGORIAS.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="group snap-start shrink-0 w-[200px] md:w-[240px] lg:w-[280px]"
          >
            <div className="relative aspect-[3/4] bg-foreground overflow-hidden">
              {/* Dark bg with text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-foreground/80">
                <span className="text-2xl md:text-3xl font-light tracking-wider text-white mb-1">
                  {cat.label}
                </span>
                {cat.desc && (
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {cat.desc}
                  </span>
                )}
              </div>
              {/* Hover border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 transition-colors duration-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
