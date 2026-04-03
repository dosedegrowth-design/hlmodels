"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { MarcaStatus } from "@/types";

interface MarcaStatusActionsProps {
  marcaId: string;
  currentStatus: string;
}

export function MarcaStatusActions({ marcaId, currentStatus }: MarcaStatusActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notas, setNotas] = useState("");
  const [saving, setSaving] = useState(false);
  const [showNotas, setShowNotas] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const update: Record<string, any> = { status };
    if (notas.trim()) update.notas_admin = notas;
    await supabase.from("marcas").update(update).eq("id", marcaId);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-3 shrink-0">
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-border px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
        >
          <option value="pendente">Pendente</option>
          <option value="aprovada">Aprovada</option>
          <option value="rejeitada">Rejeitada</option>
          <option value="suspensa">Suspensa</option>
        </select>
        <button
          onClick={() => setShowNotas(!showNotas)}
          className="text-xs text-muted hover:text-foreground underline"
        >
          + Nota
        </button>
      </div>
      {showNotas && (
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Nota interna sobre esta marca..."
          rows={2}
          className="w-full border border-border px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground resize-none"
        />
      )}
      {(status !== currentStatus || notas.trim()) && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-foreground text-white text-xs rounded-lg hover:bg-foreground/90 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      )}
    </div>
  );
}
