import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MarcaActions } from "@/components/admin/marca-actions";
import { Eye } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  aprovada: { label: "Aprovada", className: "bg-green-100 text-green-800" },
  rejeitada: { label: "Rejeitada", className: "bg-red-100 text-red-800" },
  suspensa: { label: "Suspensa", className: "bg-neutral-100 text-neutral-600" },
};

export default async function AdminMarcasPage() {
  const supabase = await createClient();
  const { data: marcas } = await supabase
    .from("marcas")
    .select("*, selecoes:selecoes(id)")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Marcas</h1>
        <p className="text-sm text-muted">{marcas?.length ?? 0} cadastradas</p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4">Empresa</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4 hidden sm:table-cell">Contato</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4 hidden md:table-cell">Segmento</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4">Status</th>
              <th className="text-right text-xs uppercase tracking-widest text-muted px-6 py-4">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {(marcas ?? []).map((m: any) => {
              const status = STATUS_LABELS[m.status] ?? STATUS_LABELS.pendente;
              return (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{m.nome_empresa}</p>
                    <p className="text-xs text-muted">{m.email}</p>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <p className="text-sm">{m.nome_contato}</p>
                    {m.telefone && <p className="text-xs text-muted">{m.telefone}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm hidden md:table-cell">{m.segmento || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                    {(m.selecoes?.length ?? 0) > 0 && (
                      <span className="ml-2 text-[10px] text-muted">
                        {m.selecoes.length} selecao{m.selecoes.length > 1 ? "es" : ""}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/marcas/${m.id}`}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-muted hover:text-foreground"
                        title="Ver detalhes"
                      >
                        <Eye size={18} />
                      </Link>
                      <MarcaActions marcaId={m.id} currentStatus={m.status} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {(!marcas || marcas.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted text-sm">
                  Nenhuma marca cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
