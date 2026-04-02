import { createClient } from "@/lib/supabase/server";
import { MarcaActions } from "@/components/admin/marca-actions";

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
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Marcas</h1>
      <div className="space-y-4">
        {(marcas ?? []).map((m) => {
          const status = STATUS_LABELS[m.status] ?? STATUS_LABELS.pendente;
          return (
            <div key={m.id} className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-medium">{m.nome_empresa}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>{m.nome_contato}</span>
                    <span>{m.email}</span>
                    {m.telefone && <span>{m.telefone}</span>}
                    {m.segmento && <span>{m.segmento}</span>}
                  </div>
                  <p className="text-xs text-muted/50 mt-2">
                    {new Date(m.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <MarcaActions marcaId={m.id} currentStatus={m.status} />
              </div>
            </div>
          );
        })}
        {(!marcas || marcas.length === 0) && (
          <div className="text-center py-12 text-muted text-sm">Nenhuma marca cadastrada.</div>
        )}
      </div>
    </div>
  );
}
