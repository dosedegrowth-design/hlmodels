"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, AtSign } from "lucide-react";

interface Medida {
  label: string;
  value: string | null;
}

interface ModeloHeroProps {
  nome: string;
  fotoPrincipal: string | null;
  categoria: string;
  categoriaLabel: string;
  idade: number | null;
  bio: string | null;
  instagram: string | null;
  medidas: Medida[];
  habilidades: string[] | null;
  idiomas: string[] | null;
  isKids: boolean;
  backHref: string;
}

export function ModeloHero({
  nome,
  fotoPrincipal,
  categoriaLabel: catLabel,
  idade,
  bio,
  instagram,
  medidas,
  habilidades,
  idiomas,
  isKids,
  backHref,
}: ModeloHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax: image moves up slower than scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  // Info fades and moves slightly
  const infoOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.3]);

  return (
    <div ref={containerRef} className="relative">
      {/* Main layout — photo centered with info below on mobile, side on desktop */}
      <div className="pt-20 lg:pt-0 lg:min-h-screen lg:flex lg:items-stretch">

        {/* Photo section */}
        <div className="relative w-full lg:w-[55%] xl:w-[58%] bg-neutral-50 overflow-hidden">
          <motion.div
            style={{ y: imageY }}
            className="relative w-full"
          >
            {fotoPrincipal ? (
              <div className="relative w-full flex items-center justify-center lg:min-h-screen">
                {/* Image that shows FULL without cropping */}
                <img
                  src={fotoPrincipal}
                  alt={nome}
                  className="w-full h-auto max-h-[85vh] lg:max-h-screen object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh] lg:min-h-screen text-8xl font-light text-neutral-200">
                {nome.charAt(0)}
              </div>
            )}
          </motion.div>
        </div>

        {/* Info section */}
        <motion.div
          style={{ opacity: infoOpacity }}
          className="flex-1 lg:w-[45%] xl:w-[42%] flex flex-col justify-center px-6 md:px-10 lg:px-14 py-10 lg:py-20"
        >
          <div className="max-w-md">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft size={12} />
                Voltar para {catLabel}
              </Link>
            </motion.div>

            {/* Category */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2"
            >
              {catLabel}
              {idade ? ` — ${idade} anos` : ""}
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight mb-4"
            >
              {nome}
            </motion.h1>

            {/* Bio */}
            {bio && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-sm text-muted leading-relaxed mb-8"
              >
                {bio}
              </motion.p>
            )}

            {/* Measurements — staggered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {medidas.map(({ label, value }) => (
                  <div key={label}>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-0.5">
                      {label}
                    </span>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills & Languages (kids) */}
            {isKids && (habilidades?.length || idiomas?.length) ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8 space-y-4"
              >
                {habilidades && habilidades.length > 0 && (
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Habilidades
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {habilidades.map((h) => (
                        <span key={h} className="px-2.5 py-1 bg-neutral-100 text-foreground/70 rounded-full text-xs">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {idiomas && idiomas.length > 0 && (
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Idiomas
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {idiomas.map((i) => (
                        <span key={i} className="px-2.5 py-1 bg-neutral-100 text-foreground/70 rounded-full text-xs">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : null}

            {/* Instagram */}
            {instagram && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <a
                  href={`https://instagram.com/${instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  <AtSign size={14} />
                  {instagram}
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
