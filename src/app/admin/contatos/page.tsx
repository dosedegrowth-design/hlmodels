import { createClient } from "@/lib/supabase/server";
import { ContatoActions } from "@/components/admin/contato-actions";

export default async function AdminContatosPage() {
  const supabase = await createClient();
  const { data: contatos } = await supabase
    .from("contatos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Contatos</h1>

      <div className="space-y-4">
        {(contatos ?? []).map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-xl border p-6 ${
              c.lido ? "border-border" : "border-foreground/20"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-medium">{c.nome}</h3>
                  {!c.lido && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Novo
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-2">
                  <span>{c.email}</span>
                  {c.telefone && <span>{c.telefone}</span>}
                  {c.assunto && <span>{c.assunto}</span>}
                </div>
                <p className="text-sm text-muted">{c.mensagem}</p>
                <p className="text-xs text-muted/50 mt-2">
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <ContatoActions contatoId={c.id} lido={c.lido} />
            </div>
          </div>
        ))}

        {(!contatos || contatos.length === 0) && (
          <div className="text-center py-12 text-muted text-sm">
            Nenhuma mensagem recebida.
          </div>
        )}
      </div>
    </div>
  );
}
