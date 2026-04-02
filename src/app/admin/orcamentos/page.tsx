import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  rascunho: { label: "Rascunho", className: "bg-neutral-100 text-neutral-600" },
  enviada: { label: "Enviada", className: "bg-blue-100 text-blue-800" },
  em_analise: { label: "Em Analise", className: "bg-yellow-100 text-yellow-800" },
  respondida: { label: "Respondida", className: "bg-green-100 text-green-800" },
  fechada: { label: "Fechada", className: "bg-neutral-100 text-neutral-600" },
};

export default async function AdminOrcamentosPage() {
  const supabase = await createClient();
  const { data: selecoes } = await supabase
    .from("selecoes")
    .select("*, marcas(nome_empresa), selecao_modelos(id)")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Orcamentos</h1>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4">Marca</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4">Selecao</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4 hidden md:table-cell">Modelos</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4">Status</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4 hidden md:table-cell">Data</th>
              <th className="text-right text-xs uppercase tracking-widest text-muted px-6 py-4">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {(selecoes ?? []).map((s: any) => {
              const status = STATUS_LABELS[s.status] ?? STATUS_LABELS.rascunho;
              return (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-neutral-50">
                  <td className="px-6 py-4 text-sm">{s.marcas?.nome_empresa ?? "-"}</td>
                  <td className="px-6 py-4 text-sm">{s.nome}</td>
                  <td className="px-6 py-4 text-sm hidden md:table-cell">{s.selecao_modelos?.length ?? 0}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted hidden md:table-cell">
                    {new Date(s.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orcamentos/${s.id}`} className="text-xs text-muted hover:text-foreground underline">
                      Ver
                    </Link>
                  </td>
                </tr>
              );
            })}
            {(!selecoes || selecoes.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted text-sm">Nenhum orcamento recebido.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
