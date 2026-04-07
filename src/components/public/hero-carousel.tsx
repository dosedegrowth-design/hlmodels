"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Modelo } from "@/types";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  modelos: Modelo[];
  modelosKids?: Modelo[];
}

const KIDS_CATS = ["baby", "kids", "teens"];

function categoriaLabel(cat: string) {
  const labels: Record<string, string> = {
    homem: "Homem",
    mulher: "Mulher",
    nao_binario: "Nao Binario",
    baby: "Baby",
    kids: "Kids",
    teens: "Teens",
  };
  return labels[cat] ?? cat;
}

interface Slide {
  modelos: Modelo[];
  type: "fashion" | "kids";
}

export function HeroCarousel({ modelos, modelosKids = [] }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Build slides: fashion groups + kids groups interleaved
  const slides: Slide[] = [];

  // Fashion groups (4 per slide)
  for (let i = 0; i < modelos.length; i += 4) {
    slides.push({ modelos: modelos.slice(i, i + 4), type: "fashion" });
  }

  // Kids groups (4 per slide) — insert after first fashion slide
  const kidsSlides: Slide[] = [];
  for (let i = 0; i < modelosKids.length; i += 4) {
    kidsSlides.push({ modelos: modelosKids.slice(i, i + 4), type: "kids" });
  }

  // Interleave: fashion, kids, fashion, kids...
  const interleaved: Slide[] = [];
  const maxLen = Math.max(slides.length, kidsSlides.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < slides.length) interleaved.push(slides[i]);
    if (i < kidsSlides.length) interleaved.push(kidsSlides[i]);
  }

  const allSlides = interleaved.length > 0 ? interleaved : slides;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 800);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % allSlides.length);
  }, [current, allSlides.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + allSlides.length) % allSlides.length);
  }, [current, allSlides.length, goTo]);

  useEffect(() => {
    if (allSlides.length <= 1) return;
    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, [goNext, allSlides.length]);

  if (allSlides.length === 0) {
    return (
      <section className="h-screen bg-foreground flex items-center justify-center">
        <img src="/logo-white.png" alt="HL Models" className="h-16 w-auto" />
      </section>
    );
  }

  const currentSlide = allSlides[current];
  const isKids = currentSlide.type === "kids";

  return (
    <section
      className={cn(
        "relative h-screen w-full overflow-hidden transition-colors duration-700",
        isKids ? "hero-kids-gradient" : "bg-foreground"
      )}
    >
      {/* Kids badge */}
      {isKids && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-5 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
          <Star size={14} className="text-[#F1755C]" />
          <span className="text-xs font-medium tracking-widest uppercase text-foreground/80">
            Baby &bull; Kids &bull; Teens
          </span>
          <Star size={14} className="text-[#FFD600]" />
        </div>
      )}

      {/* Model grid */}
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3].map((colIndex) => {
          const modelo = currentSlide.modelos[colIndex];
          if (!modelo) {
            return (
              <div
                key={colIndex}
                className={cn(
                  "relative h-full flex-1",
                  isKids ? "bg-white/20" : "bg-neutral-900",
                  colIndex >= 2 && "hidden md:block"
                )}
              >
                <div className="h-full flex items-center justify-center">
                  <span className={cn("text-xs uppercase tracking-[0.3em]", isKids ? "text-foreground/5" : "text-white/5")}>
                    HL
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={modelo.id}
              className={cn(
                "relative h-full flex-1 group",
                colIndex >= 2 && "hidden md:block"
              )}
            >
              <Link href={`/modelo/${modelo.slug}`} className="block h-full relative">
                {modelo.foto_principal ? (
                  <Image
                    src={modelo.foto_principal}
                    alt={modelo.nome}
                    fill
                    className={cn(
                      "object-cover transition-all duration-700",
                      "group-hover:scale-[1.03] group-hover:brightness-110",
                      isKids && "rounded-2xl"
                    )}
                    priority={colIndex < 2}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    quality={90}
                  />
                ) : (
                  <div className={cn(
                    "h-full flex items-center justify-center",
                    isKids ? "bg-white/30" : "bg-neutral-800"
                  )}>
                    <span className={cn("text-5xl font-light", isKids ? "text-foreground/10" : "text-white/10")}>
                      {modelo.nome.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    isKids
                      ? "bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40"
                      : "bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-60 group-hover:opacity-40"
                  )}
                />

                {/* Model info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 z-10">
                  <p
                    className={cn(
                      "text-[9px] lg:text-[10px] uppercase tracking-[0.3em] mb-1",
                      isKids ? "text-[#FFD600] font-bold font-kids" : "text-white/50"
                    )}
                  >
                    {categoriaLabel(modelo.categoria)}
                  </p>
                  <h2
                    className={cn(
                      "text-sm lg:text-base tracking-wider",
                      isKids ? "text-white font-bold font-kids" : "text-white font-light"
                    )}
                  >
                    {modelo.nome}
                  </h2>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Dividers */}
      <div className="absolute inset-0 flex pointer-events-none z-[2]">
        <div
          className={cn("md:hidden absolute top-0 bottom-0 w-px", isKids ? "bg-foreground/10" : "bg-black/20")}
          style={{ left: "50%" }}
        />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn("hidden md:block absolute top-0 bottom-0 w-px", isKids ? "bg-foreground/10" : "bg-black/20")}
            style={{ left: `${i * 25}%` }}
          />
        ))}
      </div>

      {/* Navigation */}
      {allSlides.length > 1 && (
        <div className="absolute bottom-6 right-6 flex items-center gap-1 z-10">
          <button onClick={goPrev} className={cn("p-2 transition-colors", isKids ? "text-foreground/30 hover:text-foreground" : "text-white/30 hover:text-white")}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={goNext} className={cn("p-2 transition-colors", isKids ? "text-foreground/30 hover:text-foreground" : "text-white/30 hover:text-white")}>
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* WhatsApp */}
      <a
        href="https://wa.me/5511953506752"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "absolute bottom-6 left-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] transition-colors z-10",
          isKids ? "text-foreground/40 hover:text-foreground" : "text-white/40 hover:text-white"
        )}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Whatsapp
      </a>

      {/* Indicators */}
      {allSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {allSlides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "h-[3px] rounded-full transition-all duration-500",
                i === current
                  ? cn("w-8", slide.type === "kids" ? "bg-[#F1755C]" : "bg-white")
                  : cn("w-4", isKids ? "bg-foreground/15" : "bg-white/20")
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
