"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { MarcaStatus } from "@/types";

interface MarcaActionsProps {
  marcaId: string;
  currentStatus: string;
}

export function MarcaActions({ marcaId, currentStatus }: MarcaActionsProps) {
  const router = useRouter();

  async function updateStatus(status: MarcaStatus) {
    const supabase = createClient();
    await supabase.from("marcas").update({ status }).eq("id", marcaId);
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => updateStatus(e.target.value as MarcaStatus)}
      className="border border-border px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-foreground shrink-0"
    >
      <option value="pendente">Pendente</option>
      <option value="aprovada">Aprovada</option>
      <option value="rejeitada">Rejeitada</option>
      <option value="suspensa">Suspensa</option>
    </select>
  );
}
