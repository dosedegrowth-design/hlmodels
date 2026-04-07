"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIAS } from "@/types";

interface CategoriesCarouselProps {
  categoryPhotos: Record<string, string[]>;
}

function CategoryCard({
  slug,
  label,
  desc,
  photos,
  offset,
}: {
  slug: string;
  label: string;
  desc?: string;
  photos: string[];
  offset: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isKids = ["baby", "kids", "teens"].includes(slug);

  // Solid color backgrounds for kids categories
  const KIDS_BG: Record<string, string> = {
    baby: "bg-[#F1755C]",
    kids: "bg-[#A1BCA6]",
    teens: "bg-[#3A6084]",
  };

  useEffect(() => {
    if (photos.length <= 1) return;
    // Offset the start so each card transitions at a different time
    const delay = setTimeout(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 3000);
      return () => clearInterval(timer);
    }, offset * 500);
    return () => clearTimeout(delay);
  }, [photos.length, offset]);

  // Start a separate interval after mount (the timeout above returns cleanup for the timeout only)
  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 3000 + offset * 200);
    return () => clearInterval(timer);
  }, [photos.length, offset]);

  return (
    <Link
      href={`/${slug}`}
      className="group snap-start shrink-0 w-[200px] md:w-[240px] lg:w-[280px]"
    >
      <div className={`relative aspect-[3/4] overflow-hidden ${
        isKids
          ? `${KIDS_BG[slug] || "bg-[#F1755C]"} rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`
          : "bg-neutral-900"
      }`}>
        {/* Photos only for adult categories */}
        {!isKids && photos.length > 0 ? (
          photos.map((url, i) => (
            <Image
              key={url}
              src={url}
              alt={`${label} ${i + 1}`}
              fill
              className={`object-cover transition-opacity duration-1000 ${
                i === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              sizes="280px"
            />
          ))
        ) : !isKids ? (
          <div className="absolute inset-0 bg-foreground" />
        ) : null}

        {/* Overlay only for adult */}
        {!isKids && (
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500 z-[1]" />
        )}

        {/* Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[2]">
          <span className={`drop-shadow-lg ${
            isKids
              ? "text-3xl md:text-4xl font-bold tracking-wide text-white font-kids"
              : "text-2xl md:text-3xl font-light tracking-wider text-white"
          }`}>
            {label}
          </span>
          {desc && (
            <span className={`mt-2 ${
              isKids
                ? "text-xs uppercase tracking-[0.2em] text-white/90 font-kids font-medium"
                : "text-[10px] uppercase tracking-[0.3em] text-white/60"
            }`}>
              {desc}
            </span>
          )}
        </div>

        {/* Photo indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-[2]">
            {photos.map((_, i) => (
              <div
                key={i}
                className={`h-[2px] rounded-full transition-all duration-500 ${
                  i === currentIndex
                    ? "w-4 bg-white/80"
                    : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* Hover border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-colors duration-300 z-[2]" />
      </div>
    </Link>
  );
}

export function CategoriesCarousel({ categoryPhotos }: CategoriesCarouselProps) {
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
        {CATEGORIAS.map((cat, index) => (
          <CategoryCard
            key={cat.slug}
            slug={cat.slug}
            label={cat.label}
            desc={cat.desc}
            photos={categoryPhotos[cat.value] ?? []}
            offset={index}
          />
        ))}
      </div>
    </div>
  );
}
