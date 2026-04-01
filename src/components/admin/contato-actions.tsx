"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, Eye } from "lucide-react";

interface ContatoActionsProps {
  contatoId: string;
  lido: boolean;
}

export function ContatoActions({ contatoId, lido }: ContatoActionsProps) {
  const router = useRouter();

  async function toggleLido() {
    const supabase = createClient();
    await supabase
      .from("contatos")
      .update({ lido: !lido })
      .eq("id", contatoId);
    router.refresh();
  }

  return (
    <button
      onClick={toggleLido}
      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-muted hover:text-foreground shrink-0"
      title={lido ? "Marcar como não lido" : "Marcar como lido"}
    >
      {lido ? <Eye size={18} /> : <Check size={18} />}
    </button>
  );
}
