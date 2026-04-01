"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { StatusCandidatura } from "@/types";

interface CandidaturaActionsProps {
  candidaturaId: string;
  currentStatus: string;
}

export function CandidaturaActions({
  candidaturaId,
  currentStatus,
}: CandidaturaActionsProps) {
  const router = useRouter();

  async function updateStatus(status: StatusCandidatura) {
    const supabase = createClient();
    await supabase
      .from("candidaturas")
      .update({ status })
      .eq("id", candidaturaId);
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => updateStatus(e.target.value as StatusCandidatura)}
      className="border border-border px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-foreground shrink-0"
    >
      <option value="pendente">Pendente</option>
      <option value="analisando">Analisando</option>
      <option value="aprovado">Aprovado</option>
      <option value="rejeitado">Rejeitado</option>
    </select>
  );
}
