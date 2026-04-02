import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  rascunho: { label: "Rascunho", className: "bg-neutral-100 text-neutral-600" },
  enviada: { label: "Enviada", className: "bg-blue-100 text-blue-800" },
  em_analise: { label: "Em Analise", className: "bg-yellow-100 text-yellow-800" },
  respondida: { label: "Respondida", className: "bg-green-100 text-green-800" },
  fechada: { label: "Fechada", className: "bg-neutral-100 text-neutral-600" },
};

export default async function MarcasSelecoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: marca } = await supabase.from("marcas").select("id").eq("user_id", user!.id).single();

  const { data: selecoes } = await supabase
    .from("selecoes")
    .select("*, selecao_modelos(id)")
    .eq("marca_id", marca!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-1">Gerenciar</p>
          <h1 className="text-2xl font-light tracking-tight">Minhas Selecoes</h1>
        </div>
        <Link href="/marcas/selecoes/nova" className="flex items-center gap-2 px-4 py-2 bg-foreground text-white text-xs rounded-lg">
          <Plus size={14} /> Nova Selecao
        </Link>
      </div>

      <div className="space-y-4">
        {(selecoes ?? []).map((s: any) => {
          const status = STATUS_LABELS[s.status] ?? STATUS_LABELS.rascunho;
          return (
            <Link key={s.id} href={`/marcas/selecoes/${s.id}`} className="block bg-white border border-border rounded-xl p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-medium">{s.nome}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>{status.label}</span>
                  </div>
                  <p className="text-xs text-muted">{s.selecao_modelos?.length ?? 0} modelos · {new Date(s.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              {s.resposta_admin && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg text-xs text-green-800">
                  Resposta: {s.resposta_admin}
                </div>
              )}
            </Link>
          );
        })}
        {(!selecoes || selecoes.length === 0) && (
          <div className="text-center py-12 text-muted text-sm">Nenhuma selecao criada.</div>
        )}
      </div>
    </div>
  );
}
