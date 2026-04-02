"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

export default function NovaSelecaoPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: marca } = await supabase.from("marcas").select("id").eq("user_id", user.id).single();
    if (!marca) return;

    const { data: selecao } = await supabase.from("selecoes").insert({
      marca_id: marca.id,
      nome: fd.get("nome") as string,
      descricao: (fd.get("descricao") as string) || null,
      data_evento: (fd.get("data_evento") as string) || null,
      orcamento_estimado: (fd.get("orcamento_estimado") as string) || null,
      status: "rascunho",
    }).select("id").single();

    setLoading(false);
    if (selecao) {
      router.push("/marcas/modelos");
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-2xl font-light tracking-tight mb-8">Nova Selecao</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nome da selecao *</label>
          <input name="nome" required className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" placeholder="Ex: Campanha Verao 2026" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Descricao</label>
          <textarea name="descricao" rows={3} className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground resize-none" placeholder="Descreva o que voce precisa..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Data do evento</label>
            <input name="data_evento" type="date" className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Orcamento estimado</label>
            <input name="orcamento_estimado" className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" placeholder="R$ 5.000 - 10.000" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-white text-sm rounded-lg hover:bg-foreground/90 disabled:opacity-50">
          <Save size={16} /> {loading ? "Criando..." : "Criar e buscar modelos"}
        </button>
      </form>
    </div>
  );
}
