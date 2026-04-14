"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Modelo } from "@/types";

interface ModelCardProps {
  modelo: Modelo;
  index?: number;
  isKids?: boolean;
}

const KIDS_CATS = ["baby", "kids", "teens"];

export function ModelCard({ modelo, index = 0, isKids }: ModelCardProps) {
  const kidsMode = isKids ?? KIDS_CATS.includes(modelo.categoria);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link href={`/modelo/${modelo.slug}`} className="group block">
        <div
          className={
            kidsMode
              ? "model-card-kids relative aspect-[3/4] bg-neutral-50 overflow-hidden"
              : "model-card relative aspect-[3/4] bg-neutral-100 overflow-hidden"
          }
        >
          {modelo.foto_principal ? (
            <Image
              src={modelo.foto_principal}
              alt={modelo.nome}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                kidsMode
                  ? "bg-gradient-to-br from-[#F2919B]/20 to-kids-lavender/20"
                  : "bg-neutral-200"
              }`}
            >
              <span className="text-5xl font-light text-neutral-400">
                {modelo.nome.charAt(0)}
              </span>
            </div>
          )}

          {/* Name overlay */}
          <div className="model-name absolute bottom-0 left-0 right-0 p-4 lg:p-5">
            <h3
              className={`text-xs uppercase tracking-[0.2em] ${
                kidsMode
                  ? "text-white font-bold font-kids"
                  : "text-white font-light"
              }`}
            >
              {modelo.nome}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
