"use client";

import type { Modelo } from "@/types";
import { ModelCard } from "./model-card";

interface ModelGridProps {
  modelos: Modelo[];
}

export function ModelGrid({ modelos }: ModelGridProps) {
  if (modelos.length === 0) {
    return (
      <div className="text-center py-20 text-muted">
        <p className="text-lg">Nenhum modelo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {modelos.map((modelo, i) => (
        <ModelCard key={modelo.id} modelo={modelo} index={i} />
      ))}
    </div>
  );
}
