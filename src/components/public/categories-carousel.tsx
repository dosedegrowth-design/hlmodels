"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIAS } from "@/types";

interface CategoriesCarouselProps {
  categoryCovers: Record<string, string | null>;
}

export function CategoriesCarousel({ categoryCovers }: CategoriesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scrollByAmount("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-foreground/60 hover:text-foreground transition-colors hidden lg:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scrollByAmount("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-foreground/60 hover:text-foreground transition-colors hidden lg:flex"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>

      {/* Scrollable area */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 lg:px-10 -mx-6 lg:-mx-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CATEGORIAS.map((cat) => {
          const coverUrl = categoryCovers[cat.value];

          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group snap-start shrink-0 w-[200px] md:w-[240px] lg:w-[280px]"
            >
              <div className="relative aspect-[3/4] bg-neutral-200 overflow-hidden">
                {/* Background image */}
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="280px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-foreground" />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />

                {/* Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <span className="text-2xl md:text-3xl font-light tracking-wider text-white drop-shadow-lg">
                    {cat.label}
                  </span>
                  {cat.desc && (
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 mt-1">
                      {cat.desc}
                    </span>
                  )}
                </div>

                {/* Hover border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-colors duration-300 z-10" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
