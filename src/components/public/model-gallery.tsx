"use client";

import Image from "next/image";
import { useState } from "react";
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

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % fotos.length);
  };

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + fotos.length) % fotos.length);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fotos.map((foto, i) => (
          <button
            key={foto.id}
            onClick={() => openLightbox(i)}
            className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden group cursor-pointer"
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
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-6 text-white/60 hover:text-white transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={36} />
          </button>

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

          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-6 text-white/60 hover:text-white transition-colors"
            aria-label="Próxima"
          >
            <ChevronRight size={36} />
          </button>

          <div className="absolute bottom-6 text-white/40 text-sm">
            {lightboxIndex + 1} / {fotos.length}
          </div>
        </div>
      )}
    </>
  );
}
