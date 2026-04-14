"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Modelo } from "@/types";

interface AprovadoItem {
  modelo: Modelo;
  marca_nome: string;
  marca_logo: string | null;
}

interface AprovadosSectionProps {
  aprovados: AprovadoItem[];
}

export function AprovadosSection({ aprovados }: AprovadosSectionProps) {
  if (aprovados.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 lg:px-10 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {aprovados.map((item, i) => (
          <motion.div
            key={`${item.modelo.id}-${item.marca_nome}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="snap-start shrink-0 w-64 md:w-72 lg:w-80"
          >
            <Link href={`/modelo/${item.modelo.slug}`} className="group block">
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-2xl">
                {/* Photo */}
                {item.modelo.foto_principal ? (
                  <Image
                    src={item.modelo.foto_principal}
                    alt={item.modelo.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="320px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-5xl text-neutral-300 font-light">
                    {item.modelo.nome.charAt(0)}
                  </div>
                )}

                {/* Brand badge at top — logo or text */}
                <div className="absolute top-4 right-4 z-10">
                  {item.marca_logo ? (
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                      <div className="relative h-6 w-16">
                        <Image
                          src={item.marca_logo}
                          alt={item.marca_nome}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground">
                        {item.marca_nome}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom gradient with name */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10">
                  <p className="text-white text-sm font-medium">
                    {item.modelo.nome}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-3 h-px bg-green-400" />
                    <span className="text-[10px] uppercase tracking-wider text-green-300/80">
                      Aprovado
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
