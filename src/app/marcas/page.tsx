import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Search, ListChecks, Send, Plus, ArrowRight } from "lucide-react";

export default async function MarcasDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: marca } = await supabase
    .from("marcas")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { count: totalSelecoes } = await supabase
    .from("selecoes")
    .select("*", { count: "exact", head: true })
    .eq("marca_id", marca!.id);

  const { count: selecoesEnviadas } = await supabase
    .from("selecoes")
    .select("*", { count: "exact", head: true })
    .eq("marca_id", marca!.id)
    .eq("status", "enviada");

  // Recent selections
  const { data: recentSelecoes } = await supabase
    .from("selecoes")
    .select("*, selecao_modelos(id)")
    .eq("marca_id", marca!.id)
    .order("created_at", { ascending: false })
    .limit(3);

  // Featured models for quick browse
  const { data: featuredModelos } = await supabase
    .from("modelos")
    .select("id, nome, foto_principal, categoria")
    .eq("ativo", true)
    .eq("destaque", true)
    .order("ordem")
    .limit(6);

  const STATUS_COLORS: Record<string, string> = {
    rascunho: "bg-neutral-100 text-neutral-600",
    enviada: "bg-blue-100 text-blue-800",
    em_analise: "bg-yellow-100 text-yellow-800",
    respondida: "bg-green-100 text-green-800",
    fechada: "bg-neutral-100 text-neutral-600",
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Welcome */}
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-2">
          Portal de marcas
        </p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">
          Ola, {marca?.nome_empresa}
        </h1>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Link
          href="/marcas/modelos"
          className="bg-foreground text-white rounded-xl p-6 hover:bg-foreground/90 transition-colors group flex items-center gap-4"
        >
          <Search
            size={28}
            className="text-white/50 group-hover:text-white transition-colors shrink-0"
          />
          <div>
            <h2 className="text-base font-medium mb-0.5">Buscar Modelos</h2>
            <p className="text-xs text-white/50">
              Encontre talentos para sua campanha
            </p>
          </div>
        </Link>
        <Link
          href="/marcas/selecoes"
          className="bg-white border border-border rounded-xl p-6 hover:shadow-sm transition-shadow flex items-center gap-4"
        >
          <ListChecks size={28} className="text-muted shrink-0" />
          <div>
            <h2 className="text-base font-medium mb-0.5">Minhas Selecoes</h2>
            <p className="text-xs text-muted">
              {totalSelecoes ?? 0} criada{(totalSelecoes ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </Link>
        <Link
          href="/marcas/selecoes/nova"
          className="bg-white border border-border rounded-xl p-6 hover:shadow-sm transition-shadow flex items-center gap-4"
        >
          <Plus size={28} className="text-muted shrink-0" />
          <div>
            <h2 className="text-base font-medium mb-0.5">Nova Selecao</h2>
            <p className="text-xs text-muted">Criar briefing de campanha</p>
          </div>
        </Link>
      </div>

      {/* Featured models quick browse */}
      {featuredModelos && featuredModelos.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Modelos em destaque</h2>
            <Link
              href="/marcas/modelos"
              className="text-xs text-muted hover:text-foreground flex items-center gap-1"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {featuredModelos.map((m) => (
              <Link
                key={m.id}
                href={`/marcas/modelos/${m.id}`}
                className="group"
              >
                <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-1.5">
                  {m.foto_principal ? (
                    <Image
                      src={m.foto_principal}
                      alt={m.nome}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="150px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xl text-neutral-300">
                      {m.nome.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="text-xs truncate">{m.nome}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent selections */}
      {recentSelecoes && recentSelecoes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Selecoes recentes</h2>
            <Link
              href="/marcas/selecoes"
              className="text-xs text-muted hover:text-foreground flex items-center gap-1"
            >
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentSelecoes.map((s: any) => (
              <Link
                key={s.id}
                href={`/marcas/selecoes/${s.id}`}
                className="flex items-center justify-between py-3 px-4 bg-white border border-border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div>
                  <p className="text-sm font-medium">{s.nome}</p>
                  <p className="text-xs text-muted">
                    {s.selecao_modelos?.length ?? 0} modelos
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    STATUS_COLORS[s.status] ?? STATUS_COLORS.rascunho
                  }`}
                >
                  {s.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
