"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Modelo } from "@/types";

interface ModelCardProps {
  modelo: Modelo;
  index?: number;
}

export function ModelCard({ modelo, index = 0 }: ModelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/modelo/${modelo.slug}`} className="group block">
        <div className="model-card relative aspect-[3/4] bg-neutral-100 rounded-sm overflow-hidden">
          {modelo.foto_principal ? (
            <Image
              src={modelo.foto_principal}
              alt={modelo.nome}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted">
              <span className="text-4xl font-light">
                {modelo.nome.charAt(0)}
              </span>
            </div>
          )}
          <div className="model-name absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-white text-sm font-medium uppercase tracking-widest">
              {modelo.nome}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
