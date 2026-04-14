"use client";

import Image from "next/image";
import Link from "next/link";
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
  if (aprovados.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 lg:px-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {aprovados.map((item, i) => (
          <motion.div
            key={`${item.modelo.id}-${item.marca_nome}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="snap-start shrink-0 w-48 md:w-56"
          >
            <Link href={`/modelo/${item.modelo.slug}`} className="group block">
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-xl">
                {/* Photo */}
                {item.modelo.foto_principal ? (
                  <Image
                    src={item.modelo.foto_principal}
                    alt={item.modelo.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="224px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl text-neutral-300 font-light">
                    {item.modelo.nome.charAt(0)}
                  </div>
                )}

                {/* Aprovado badge at top */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-foreground">
                    <span className="text-[9px] font-medium uppercase tracking-wider">
                      Aprovado
                    </span>
                  </div>
                </div>

                {/* Bottom gradient with name and brand */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent z-10">
                  <p className="text-white text-xs font-medium">
                    {item.modelo.nome}
                  </p>
                  <span className="text-[10px] uppercase tracking-wide text-white/60">
                    {item.marca_nome}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
