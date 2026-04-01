"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Pencil, ToggleLeft, ToggleRight } from "lucide-react";

interface ModeloActionsProps {
  modeloId: string;
  ativo: boolean;
}

export function ModeloActions({ modeloId, ativo }: ModeloActionsProps) {
  const router = useRouter();

  async function toggleAtivo() {
    const supabase = createClient();
    await supabase
      .from("modelos")
      .update({ ativo: !ativo })
      .eq("id", modeloId);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={toggleAtivo}
        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-muted hover:text-foreground"
        title={ativo ? "Desativar" : "Ativar"}
      >
        {ativo ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
      </button>
      <Link
        href={`/admin/modelos/${modeloId}`}
        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-muted hover:text-foreground"
        title="Editar"
      >
        <Pencil size={18} />
      </Link>
    </div>
  );
}
