import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { CandidaturaActions } from "@/components/admin/candidatura-actions";
import { ContactButtons } from "@/components/admin/contact-buttons";
import { AtSign, MapPin, Ruler, Calendar } from "lucide-react";

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

  const pendentes = candidaturas?.filter((c) => c.status === "pendente").length ?? 0;

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidaturas</h1>
          {pendentes > 0 && (
            <p className="text-sm text-muted mt-1">
              {pendentes} pendente{pendentes > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <p className="text-sm text-muted">{candidaturas?.length ?? 0} total</p>
      </div>

      <div className="space-y-6">
        {(candidaturas ?? []).map((c) => {
          const status = STATUS_LABELS[c.status] ?? STATUS_LABELS.pendente;
          const fotos = (c.fotos as string[]) ?? [];
          const igHandle = c.instagram?.replace("@", "").trim();

          return (
            <div
              key={c.id}
              className={`bg-white rounded-xl border p-6 ${
                c.status === "pendente" ? "border-yellow-200" : "border-border"
              }`}
            >
              {/* Header: nome + status + actions */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar from first photo */}
                  <div className="relative w-12 h-12 rounded-full bg-neutral-100 overflow-hidden shrink-0">
                    {fotos.length > 0 ? (
                      <Image
                        src={fotos[0]}
                        alt={c.nome}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-lg text-neutral-400 font-light">
                        {c.nome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-medium">{c.nome}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <span className="text-[10px] text-muted">
                        {new Date(c.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <CandidaturaActions candidaturaId={c.id} currentStatus={c.status} />
              </div>

              {/* Photo grid */}
              {fotos.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {fotos.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-neutral-100 hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={url}
                        alt={`${c.nome} foto ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* Info grid */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-3">
                <span className="text-muted">{c.email}</span>
                {c.telefone && <span className="text-muted">{c.telefone}</span>}
                {c.cidade && (
                  <span className="flex items-center gap-1 text-muted">
                    <MapPin size={12} /> {c.cidade}
                  </span>
                )}
                {c.idade && (
                  <span className="flex items-center gap-1 text-muted">
                    <Calendar size={12} /> {c.idade} anos
                  </span>
                )}
                {c.altura && (
                  <span className="flex items-center gap-1 text-muted">
                    <Ruler size={12} /> {c.altura}
                  </span>
                )}
              </div>

              {/* Instagram button */}
              {igHandle && (
                <a
                  href={`https://instagram.com/${igHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[11px] font-medium rounded-lg hover:opacity-90 transition-opacity mb-3"
                >
                  <AtSign size={13} />
                  {igHandle}
                </a>
              )}

              {/* Message */}
              {c.mensagem && (
                <p className="text-sm text-muted bg-neutral-50 rounded-lg p-3 mb-3">
                  {c.mensagem}
                </p>
              )}

              {/* Contact action buttons */}
              <ContactButtons
                telefone={c.telefone}
                email={c.email}
                nome={c.nome}
              />
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
