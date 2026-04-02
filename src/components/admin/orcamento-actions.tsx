"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SelecaoStatus } from "@/types";

interface OrcamentoActionsProps {
  selecaoId: string;
  currentStatus: string;
  respostaAtual: string | null;
}

export function OrcamentoActions({ selecaoId, currentStatus, respostaAtual }: OrcamentoActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [resposta, setResposta] = useState(respostaAtual ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("selecoes").update({ status, resposta_admin: resposta || null }).eq("id", selecaoId);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border border-border px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
      >
        <option value="enviada">Enviada</option>
        <option value="em_analise">Em Analise</option>
        <option value="respondida">Respondida</option>
        <option value="fechada">Fechada</option>
      </select>
      <textarea
        value={resposta}
        onChange={(e) => setResposta(e.target.value)}
        placeholder="Resposta ao orcamento..."
        rows={3}
        className="w-full border border-border px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground resize-none"
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-foreground text-white text-xs rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );
}
