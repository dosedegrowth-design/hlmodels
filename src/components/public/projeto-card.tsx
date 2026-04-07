"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Projeto } from "@/types";

interface ProjetoCardProps {
  projeto: Projeto;
  index?: number;
}

export function ProjetoCard({ projeto, index = 0 }: ProjetoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/projetos/${projeto.slug}`} className="group block">
        <div className="relative aspect-video bg-neutral-100 overflow-hidden rounded-xl mb-3">
          {projeto.foto_capa ? (
            <Image src={projeto.foto_capa} alt={projeto.titulo} fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="flex items-center justify-center h-full bg-neutral-200 text-3xl text-neutral-400">
              {projeto.titulo.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        </div>
        <h3 className="text-base font-light tracking-tight">{projeto.titulo}</h3>
        {projeto.marca_parceira && (
          <p className="text-[10px] text-muted uppercase tracking-[0.2em] mt-0.5">{projeto.marca_parceira}</p>
        )}
      </Link>
    </motion.div>
  );
}
