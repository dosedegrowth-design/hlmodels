import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { OrcamentoActions } from "@/components/admin/orcamento-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrcamentoDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: selecao } = await supabase
    .from("selecoes")
    .select("*, marcas(*), selecao_modelos(*, modelos(*))")
    .eq("id", id)
    .single();

  if (!selecao) notFound();

  return (
    <div className="pt-14 lg:pt-0 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight mb-2">{selecao.nome}</h1>
      <p className="text-sm text-muted mb-8">por {(selecao as any).marcas?.nome_empresa}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-3">Detalhes</h2>
          {selecao.descricao && <p className="text-sm mb-2">{selecao.descricao}</p>}
          {selecao.data_evento && <p className="text-sm text-muted">Data: {selecao.data_evento}</p>}
          {selecao.orcamento_estimado && <p className="text-sm text-muted">Orcamento: {selecao.orcamento_estimado}</p>}
        </div>
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-3">Status</h2>
          <OrcamentoActions selecaoId={selecao.id} currentStatus={selecao.status} respostaAtual={selecao.resposta_admin} />
        </div>
      </div>

      <h2 className="text-lg font-medium mb-4">Modelos selecionados ({(selecao as any).selecao_modelos?.length ?? 0})</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {((selecao as any).selecao_modelos ?? []).map((sm: any) => (
          <div key={sm.id} className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="relative aspect-[3/4] bg-neutral-100">
              {sm.modelos?.foto_principal ? (
                <Image src={sm.modelos.foto_principal} alt={sm.modelos.nome} fill className="object-cover" sizes="200px" />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl text-neutral-300">
                  {sm.modelos?.nome?.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium">{sm.modelos?.nome}</p>
              {sm.nota && <p className="text-xs text-muted mt-1">{sm.nota}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
