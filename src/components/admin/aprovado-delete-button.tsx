"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  nome: string;
  marca: string;
}

export function AprovadoDeleteButton({ id, nome, marca }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Remover aprovação de ${nome} pela marca ${marca}?`)) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("modelo_aprovacoes").delete().eq("id", id);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-muted hover:text-red-500"
      title="Remover aprovação"
    >
      <Trash2 size={14} />
    </button>
  );
}
