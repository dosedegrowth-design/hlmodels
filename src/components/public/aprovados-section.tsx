"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { motion } from "framer-motion";
import type { Modelo } from "@/types";

interface AprovadoItem {
  modelo: Modelo;
  marca_nome: string;
}

interface AprovadosSectionProps {
  aprovados: AprovadoItem[];
}

export function AprovadosSection({ aprovados }: AprovadosSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (aprovados.length === 0) return null;

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scrollByAmount("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-foreground/60 hover:text-foreground transition-colors hidden lg:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scrollByAmount("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-foreground/60 hover:text-foreground transition-colors hidden lg:flex"
      >
        <ChevronRight size={20} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 lg:px-10 -mx-6 lg:-mx-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {aprovados.map((item, i) => (
          <motion.div
            key={`${item.modelo.id}-${item.marca_nome}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="snap-start shrink-0 w-[220px] md:w-[260px]"
          >
            <Link href={`/modelo/${item.modelo.slug}`} className="group block">
              <div className="relative aspect-[3/4] bg-neutral-100 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
                {/* Photo */}
                {item.modelo.foto_principal ? (
                  <Image
                    src={item.modelo.foto_principal}
                    alt={item.modelo.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="260px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl text-neutral-300 font-light">
                    {item.modelo.nome.charAt(0)}
                  </div>
                )}

                {/* Logo + Selo badge no topo */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                    <img src="/logo-dark.png" alt="HL" className="h-4 w-auto" />
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white rounded-full shadow-sm">
                    <Award size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Aprovado</span>
                  </div>
                </div>

                {/* Brand badge no rodape */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent z-10">
                  <p className="text-white text-sm font-medium">{item.modelo.nome}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-white/80 text-[10px] font-medium uppercase tracking-wider">
                      {item.marca_nome}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
