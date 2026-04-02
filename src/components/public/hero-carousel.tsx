"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Modelo } from "@/types";

interface HeroCarouselProps {
  modelos: Modelo[];
}

export function HeroCarousel({ modelos }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  // Create pairs of models for split view
  const pairs: [Modelo, Modelo | null][] = [];
  for (let i = 0; i < modelos.length; i += 2) {
    pairs.push([modelos[i], modelos[i + 1] ?? null]);
  }

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % pairs.length);
  }, [pairs.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + pairs.length) % pairs.length);
  }, [pairs.length]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  if (pairs.length === 0) {
    return (
      <section className="h-screen bg-foreground flex items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-light tracking-[0.15em] text-white uppercase">
          HL Models
        </h1>
      </section>
    );
  }

  const [left, right] = pairs[current];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-foreground">
      {/* Split images */}
      <div className="absolute inset-0 flex">
        {/* Left model */}
        <div className="relative w-1/2 h-full">
          <Link href={`/modelo/${left.slug}`} className="block h-full">
            {left.foto_principal ? (
              <Image
                src={left.foto_principal}
                alt={left.nome}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                priority
                sizes="50vw"
              />
            ) : (
              <div className="h-full bg-neutral-800 flex items-center justify-center">
                <span className="text-6xl font-light text-white/20">
                  {left.nome.charAt(0)}
                </span>
              </div>
            )}
            {/* Model name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              <p className="text-white text-xs uppercase tracking-[0.3em] opacity-60 mb-1">
                {left.categoria === "homem"
                  ? "Homem"
                  : left.categoria === "mulher"
                  ? "Mulher"
                  : "Não Binário"}
              </p>
              <h2 className="text-white text-lg lg:text-2xl font-light tracking-wider">
                {left.nome}
              </h2>
            </div>
          </Link>
        </div>

        {/* Right model */}
        <div className="relative w-1/2 h-full">
          {right ? (
            <Link href={`/modelo/${right.slug}`} className="block h-full">
              {right.foto_principal ? (
                <Image
                  src={right.foto_principal}
                  alt={right.nome}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  priority
                  sizes="50vw"
                />
              ) : (
                <div className="h-full bg-neutral-900 flex items-center justify-center">
                  <span className="text-6xl font-light text-white/20">
                    {right.nome.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                <p className="text-white text-xs uppercase tracking-[0.3em] opacity-60 mb-1">
                  {right.categoria === "homem"
                    ? "Homem"
                    : right.categoria === "mulher"
                    ? "Mulher"
                    : "Não Binário"}
                </p>
                <h2 className="text-white text-lg lg:text-2xl font-light tracking-wider">
                  {right.nome}
                </h2>
              </div>
            </Link>
          ) : (
            <div className="h-full bg-neutral-900 flex items-center justify-center">
              <p className="text-white/10 text-sm uppercase tracking-[0.3em]">
                HL Models
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      {pairs.length > 1 && (
        <div className="absolute bottom-8 right-8 flex items-center gap-1 z-10">
          <button
            onClick={goPrev}
            className="p-2 text-white/40 hover:text-white transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goNext}
            className="p-2 text-white/40 hover:text-white transition-colors"
            aria-label="Próximo"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* WhatsApp-style CTA */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 left-8 flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-widest transition-colors z-10"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Entrar em contato via Whatsapp
      </a>

      {/* Slide indicators */}
      {pairs.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {pairs.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === current ? "bg-white w-6" : "bg-white/30"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
