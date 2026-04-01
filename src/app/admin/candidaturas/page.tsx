import { createClient } from "@/lib/supabase/server";
import { CandidaturaActions } from "@/components/admin/candidatura-actions";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  analisando: { label: "Analisando", className: "bg-blue-100 text-blue-800" },
  aprovado: { label: "Aprovado", className: "bg-green-100 text-green-800" },
  rejeitado: { label: "Rejeitado", className: "bg-red-100 text-red-800" },
};

export default async function AdminCandidaturasPage() {
  const supabase = await createClient();
  const { data: candidaturas } = await supabase
    .from("candidaturas")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Candidaturas</h1>

      <div className="space-y-4">
        {(candidaturas ?? []).map((c) => {
          const status = STATUS_LABELS[c.status] ?? STATUS_LABELS.pendente;
          return (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-border p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-medium">{c.nome}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>{c.email}</span>
                    {c.telefone && <span>{c.telefone}</span>}
                    {c.cidade && <span>{c.cidade}</span>}
                    {c.idade && <span>{c.idade} anos</span>}
                    {c.altura && <span>{c.altura}</span>}
                    {c.instagram && <span>{c.instagram}</span>}
                  </div>
                  {c.mensagem && (
                    <p className="text-sm text-muted mt-3 line-clamp-2">
                      {c.mensagem}
                    </p>
                  )}
                  <p className="text-xs text-muted/50 mt-2">
                    {new Date(c.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <CandidaturaActions
                  candidaturaId={c.id}
                  currentStatus={c.status}
                />
              </div>
            </div>
          );
        })}

        {(!candidaturas || candidaturas.length === 0) && (
          <div className="text-center py-12 text-muted text-sm">
            Nenhuma candidatura recebida.
          </div>
        )}
      </div>
    </div>
  );
}
