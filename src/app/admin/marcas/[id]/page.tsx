import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { MarcaStatusActions } from "@/components/admin/marca-status-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminMarcaDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: marca } = await supabase
    .from("marcas")
    .select("*")
    .eq("id", id)
    .single();

  if (!marca) notFound();

  // Get selections from this brand
  const { data: selecoes } = await supabase
    .from("selecoes")
    .select("*, selecao_modelos(id)")
    .eq("marca_id", marca.id)
    .order("created_at", { ascending: false });

  const STATUS_COLORS: Record<string, string> = {
    pendente: "bg-yellow-100 text-yellow-800",
    aprovada: "bg-green-100 text-green-800",
    rejeitada: "bg-red-100 text-red-800",
    suspensa: "bg-neutral-100 text-neutral-600",
  };

  const SELECAO_COLORS: Record<string, string> = {
    rascunho: "bg-neutral-100 text-neutral-600",
    enviada: "bg-blue-100 text-blue-800",
    em_analise: "bg-yellow-100 text-yellow-800",
    respondida: "bg-green-100 text-green-800",
    fechada: "bg-neutral-100 text-neutral-600",
  };

  return (
    <div className="pt-14 lg:pt-0 max-w-4xl">
      <Link
        href="/admin/marcas"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Voltar para Marcas
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{marca.nome_empresa}</h1>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
              STATUS_COLORS[marca.status] ?? STATUS_COLORS.pendente
            }`}
          >
            {marca.status.charAt(0).toUpperCase() + marca.status.slice(1)}
          </span>
        </div>
        <MarcaStatusActions marcaId={marca.id} currentStatus={marca.status} />
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-2">Dados da Empresa</h2>
          <div>
            <span className="text-[10px] text-muted uppercase tracking-widest">Empresa</span>
            <p className="text-sm">{marca.nome_empresa}</p>
          </div>
          {marca.cnpj && (
            <div>
              <span className="text-[10px] text-muted uppercase tracking-widest">CNPJ</span>
              <p className="text-sm">{marca.cnpj}</p>
            </div>
          )}
          {marca.segmento && (
            <div>
              <span className="text-[10px] text-muted uppercase tracking-widest">Segmento</span>
              <p className="text-sm">{marca.segmento}</p>
            </div>
          )}
          {marca.site && (
            <div>
              <span className="text-[10px] text-muted uppercase tracking-widest">Site</span>
              <a
                href={marca.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground hover:underline flex items-center gap-1"
              >
                {marca.site} <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-2">Contato</h2>
          <div>
            <span className="text-[10px] text-muted uppercase tracking-widest">Nome</span>
            <p className="text-sm">{marca.nome_contato}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted uppercase tracking-widest">Email</span>
            <p className="text-sm">{marca.email}</p>
          </div>
          {marca.telefone && (
            <div>
              <span className="text-[10px] text-muted uppercase tracking-widest">Telefone</span>
              <p className="text-sm">{marca.telefone}</p>
            </div>
          )}
          <div>
            <span className="text-[10px] text-muted uppercase tracking-widest">Cadastro</span>
            <p className="text-sm">
              {new Date(marca.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Admin notes */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-3">Notas internas</h2>
        <p className="text-sm text-muted">
          {marca.notas_admin || "Nenhuma nota adicionada."}
        </p>
      </div>

      {/* Selections history */}
      <div>
        <h2 className="text-lg font-medium mb-4">
          Historico de selecoes ({selecoes?.length ?? 0})
        </h2>
        {selecoes && selecoes.length > 0 ? (
          <div className="space-y-3">
            {selecoes.map((s: any) => (
              <Link
                key={s.id}
                href={`/admin/orcamentos/${s.id}`}
                className="block bg-white border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{s.nome}</p>
                    <p className="text-xs text-muted">
                      {s.selecao_modelos?.length ?? 0} modelos &middot;{" "}
                      {new Date(s.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      SELECAO_COLORS[s.status] ?? SELECAO_COLORS.rascunho
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Nenhuma selecao realizada.</p>
        )}
      </div>
    </div>
  );
}
