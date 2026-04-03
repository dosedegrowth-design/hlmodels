"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Pencil, ToggleLeft, ToggleRight } from "lucide-react";

interface ProjetoActionsProps {
  projetoId: string;
  ativo: boolean;
}

export function ProjetoActions({ projetoId, ativo }: ProjetoActionsProps) {
  const router = useRouter();

  async function toggleAtivo() {
    const supabase = createClient();
    await supabase.from("projetos").update({ ativo: !ativo }).eq("id", projetoId);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button onClick={toggleAtivo} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-muted hover:text-foreground"
        title={ativo ? "Desativar" : "Ativar"}>
        {ativo ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
      </button>
      <Link href={`/admin/projetos/${projetoId}`}
        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-muted hover:text-foreground" title="Editar">
        <Pencil size={18} />
      </Link>
    </div>
  );
}
