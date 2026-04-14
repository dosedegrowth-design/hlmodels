"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ModeloFoto } from "@/types";

interface ModelGalleryProps {
  fotos: ModeloFoto[];
  nome: string;
}

export function ModelGallery({ fotos, nome }: ModelGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % fotos.length);
  }, [lightboxIndex, fotos.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + fotos.length) % fotos.length);
  }, [lightboxIndex, fotos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, goNext, goPrev]);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {fotos.map((foto, i) => (
          <button
            key={foto.id}
            onClick={() => openLightbox(i)}
            className="relative aspect-[3/4] bg-neutral-100 overflow-hidden group cursor-pointer"
          >
            <Image
              src={foto.url}
              alt={`${nome} - Foto ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 lightbox-backdrop flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-20"
            aria-label="Fechar"
          >
            <X size={28} />
          </button>

          {/* Previous arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-6 text-white/60 hover:text-white transition-colors z-20"
            aria-label="Anterior"
          >
            <ChevronLeft size={36} />
          </button>

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fotos[lightboxIndex].url}
              alt={`${nome} - Foto ${lightboxIndex + 1}`}
              width={1200}
              height={1600}
              className="object-contain w-full h-full max-h-[85vh]"
            />
          </div>

          {/* Next arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-6 text-white/60 hover:text-white transition-colors z-20"
            aria-label="Proxima"
          >
            <ChevronRight size={36} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 text-white/40 text-sm">
            {lightboxIndex + 1} / {fotos.length}
          </div>
        </div>
      )}
    </>
  );
}
