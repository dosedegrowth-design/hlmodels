"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, X, Award } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModeloAprovacao {
  id: string;
  marca_nome: string;
}

interface ModeloAprovacoesProps {
  modeloId: string;
  aprovacoes: ModeloAprovacao[];
}

export function ModeloAprovacoes({ modeloId, aprovacoes: initial }: ModeloAprovacoesProps) {
  const [aprovacoes, setAprovacoes] = useState(initial);
  const [novaMarca, setNovaMarca] = useState("");
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  async function addAprovacao() {
    if (!novaMarca.trim()) return;
    setAdding(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("modelo_aprovacoes")
      .insert({ modelo_id: modeloId, marca_nome: novaMarca.trim() })
      .select("id, marca_nome")
      .single();
    if (data) {
      setAprovacoes([...aprovacoes, data]);
      setNovaMarca("");
    }
    setAdding(false);
    router.refresh();
  }

  async function removeAprovacao(id: string) {
    const supabase = createClient();
    await supabase.from("modelo_aprovacoes").delete().eq("id", id);
    setAprovacoes(aprovacoes.filter((a) => a.id !== id));
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
        <Award size={16} />
        Aprovacoes / Selos de Marca ({aprovacoes.length})
      </h2>

      {/* Current aprovacoes */}
      <div className="flex flex-wrap gap-2 mb-4">
        {aprovacoes.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm"
          >
            <Award size={12} className="text-green-600" />
            <span className="text-green-800 font-medium">{a.marca_nome}</span>
            <button
              onClick={() => removeAprovacao(a.id)}
              className="text-green-400 hover:text-red-500 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {aprovacoes.length === 0 && (
          <p className="text-xs text-muted">Nenhum selo de marca adicionado.</p>
        )}
      </div>

      {/* Add new */}
      <div className="flex gap-2">
        <input
          value={novaMarca}
          onChange={(e) => setNovaMarca(e.target.value)}
          placeholder="Nome da marca (ex: PomPom, Brandili...)"
          className="flex-1 border border-border px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
          onKeyDown={(e) => e.key === "Enter" && addAprovacao()}
        />
        <button
          onClick={addAprovacao}
          disabled={adding || !novaMarca.trim()}
          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <Plus size={14} />
          Adicionar selo
        </button>
      </div>
    </div>
  );
}
