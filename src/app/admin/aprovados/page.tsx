import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink, Trash2 } from "lucide-react";
import { AprovadoDeleteButton } from "@/components/admin/aprovado-delete-button";

export default async function AprovadosPage() {
  const supabase = await createClient();

  const { data: aprovados } = await supabase
    .from("modelo_aprovacoes")
    .select("id, marca_nome, marca_logo, created_at, modelos(id, nome, slug, foto_principal, categoria)")
    .order("created_at", { ascending: false });

  const items = (aprovados ?? []).filter((a: any) => a.modelos);

  // Group by marca
  const marcasMap = new Map<string, typeof items>();
  items.forEach((item: any) => {
    const marca = item.marca_nome;
    if (!marcasMap.has(marca)) marcasMap.set(marca, []);
    marcasMap.get(marca)!.push(item);
  });

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aprovados</h1>
          <p className="text-sm text-muted mt-1">
            {items.length} aprovação{items.length !== 1 ? "es" : ""} em {marcasMap.size} marca{marcasMap.size !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <Award size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">Nenhuma aprovação cadastrada ainda.</p>
          <p className="text-xs text-muted mt-2">
            Para adicionar aprovações, edite um modelo e use a seção "Aprovações / Selos de Marca".
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Array.from(marcasMap.entries()).map(([marca, approvals]) => (
            <div key={marca}>
              {/* Marca header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                {(approvals[0] as any).marca_logo ? (
                  <div className="relative h-8 w-20">
                    <Image
                      src={(approvals[0] as any).marca_logo}
                      alt={marca}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                ) : (
                  <Award size={18} className="text-green-600" />
                )}
                <h2 className="text-sm font-semibold uppercase tracking-wider">{marca}</h2>
                <span className="text-xs text-muted bg-neutral-100 px-2 py-0.5 rounded-full">
                  {approvals.length} modelo{approvals.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Models grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {approvals.map((item: any) => (
                  <div key={item.id} className="group relative">
                    <Link href={`/admin/modelos/${item.modelos.id}`} className="block">
                      <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden">
                        {item.modelos.foto_principal ? (
                          <Image
                            src={item.modelos.foto_principal}
                            alt={item.modelos.nome}
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-2xl font-light text-neutral-300">
                            {item.modelos.nome.charAt(0)}
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <ExternalLink size={18} className="text-white" />
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-xs font-medium truncate">{item.modelos.nome}</p>
                        <p className="text-[10px] text-muted uppercase tracking-wider">
                          {item.modelos.categoria}
                        </p>
                      </div>
                    </Link>

                    {/* Delete button */}
                    <AprovadoDeleteButton id={item.id} nome={item.modelos.nome} marca={marca} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
