"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, AtSign, X, ZoomIn } from "lucide-react";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const infoY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  // Keyboard close lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxOpen]);

  return (
    <>
      <div ref={containerRef} className="relative">
        <div className="lg:flex lg:items-start">

          {/* ===== PHOTO SECTION ===== */}
          <div className="relative w-full lg:w-[55%] xl:w-[58%] bg-neutral-50 overflow-hidden">
            <motion.div style={{ y: imageY, scale: imageScale }}>
              {fotoPrincipal ? (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="block w-full relative group cursor-zoom-in"
                >
                  <img
                    src={fotoPrincipal}
                    alt={nome}
                    className="w-full h-auto block pt-16 lg:pt-[72px] transition-all duration-700 group-hover:brightness-95"
                  />
                  {/* Zoom hint overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-sm rounded-full p-4">
                      <ZoomIn size={24} className="text-white" />
                    </div>
                  </div>
                </button>
              ) : (
                <div className="flex items-center justify-center min-h-[60vh] lg:min-h-screen text-8xl font-light text-neutral-200">
                  {nome.charAt(0)}
                </div>
              )}
            </motion.div>
          </div>

          {/* ===== INFO SECTION ===== */}
          <motion.div
            style={{ y: infoY }}
            className="flex-1 lg:w-[45%] xl:w-[42%] px-6 md:px-10 lg:px-14 py-10 lg:py-0 lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-center"
          >
            <div className="max-w-md">
              {/* Back link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
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
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2"
              >
                {catLabel}
                {idade ? ` — ${idade} anos` : ""}
              </motion.p>

              {/* Name — big reveal */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight mb-5"
              >
                {nome}
              </motion.h1>

              {/* Divider line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-12 h-px bg-border mb-6 origin-left"
              />

              {/* Bio */}
              {bio && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="text-sm text-muted leading-relaxed mb-8"
                >
                  {bio}
                </motion.p>
              )}

              {/* Measurements */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mb-8"
              >
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {medidas.map(({ label, value }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }}
                    >
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-0.5">
                        {label}
                      </span>
                      <p className="text-sm font-medium">{value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Skills & Languages (kids) */}
              {isKids && (habilidades?.length || idiomas?.length) ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
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
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.75 }}
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

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {lightboxOpen && fotoPrincipal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center cursor-zoom-out"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 z-10 text-white/50 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            {/* Image */}
            <motion.img
              src={fotoPrincipal}
              alt={nome}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Model name at bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-white/80 font-display text-xl tracking-tight">{nome}</p>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mt-1">{catLabel}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
