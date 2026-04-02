import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SelecaoSubmit } from "@/components/marcas/selecao-submit";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SelecaoDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: selecao } = await supabase
    .from("selecoes")
    .select("*, selecao_modelos(*, modelos(*))")
    .eq("id", id)
    .single();

  if (!selecao) notFound();

  const modelos = ((selecao as any).selecao_modelos ?? []).map((sm: any) => ({ ...sm.modelos, nota: sm.nota, smId: sm.id }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-1">Selecao</p>
          <h1 className="text-2xl font-light tracking-tight">{selecao.nome}</h1>
          {selecao.descricao && <p className="text-sm text-muted mt-2">{selecao.descricao}</p>}
        </div>
        {selecao.status === "rascunho" && (
          <div className="flex gap-3">
            <Link href="/marcas/modelos" className="px-4 py-2 border border-border text-xs rounded-lg hover:border-foreground transition-colors">
              + Adicionar modelos
            </Link>
            <SelecaoSubmit selecaoId={selecao.id} />
          </div>
        )}
      </div>

      {selecao.resposta_admin && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-xs uppercase tracking-widest text-green-800 mb-1">Resposta da agencia</p>
          <p className="text-sm text-green-900">{selecao.resposta_admin}</p>
        </div>
      )}

      <h2 className="text-sm font-medium mb-4">{modelos.length} modelo{modelos.length !== 1 ? "s" : ""} selecionado{modelos.length !== 1 ? "s" : ""}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modelos.map((m: any) => (
          <div key={m.id} className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="relative aspect-[3/4] bg-neutral-100">
              {m.foto_principal ? (
                <Image src={m.foto_principal} alt={m.nome} fill className="object-cover" sizes="200px" />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl text-neutral-300">{m.nome?.charAt(0)}</div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium">{m.nome}</p>
              <p className="text-[10px] text-muted">{m.altura} {m.cidade && `· ${m.cidade}`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
