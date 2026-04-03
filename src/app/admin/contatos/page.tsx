import { createClient } from "@/lib/supabase/server";
import { ContatoActions } from "@/components/admin/contato-actions";
import { ContactButtons } from "@/components/admin/contact-buttons";

export default async function AdminContatosPage() {
  const supabase = await createClient();
  const { data: contatos } = await supabase
    .from("contatos")
    .select("*")
    .order("created_at", { ascending: false });

  const naoLidos = contatos?.filter((c) => !c.lido).length ?? 0;

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contatos</h1>
          {naoLidos > 0 && (
            <p className="text-sm text-muted mt-1">
              {naoLidos} nao lido{naoLidos > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <p className="text-sm text-muted">{contatos?.length ?? 0} total</p>
      </div>

      <div className="space-y-4">
        {(contatos ?? []).map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-xl border p-6 ${
              c.lido ? "border-border" : "border-blue-200 bg-blue-50/30"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-sm font-medium">{c.nome}</h3>
                  {!c.lido && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Novo
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-1">
                  <span>{c.email}</span>
                  {c.telefone && <span>{c.telefone}</span>}
                  {c.assunto && (
                    <span className="font-medium text-foreground">{c.assunto}</span>
                  )}
                </div>

                <p className="text-sm text-muted mt-2">{c.mensagem}</p>

                <ContactButtons
                  telefone={c.telefone}
                  email={c.email}
                  nome={c.nome}
                />

                <p className="text-xs text-muted/50 mt-3">
                  {new Date(c.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
