import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search, ListChecks, Send } from "lucide-react";

export default async function MarcasDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-2">Portal de marcas</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">
          Olá, {marca?.nome_empresa}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/marcas/modelos" className="bg-foreground text-white rounded-xl p-8 hover:bg-foreground/90 transition-colors group">
          <Search size={24} className="mb-4 text-white/60 group-hover:text-white transition-colors" />
          <h2 className="text-lg font-light mb-1">Buscar Modelos</h2>
          <p className="text-xs text-white/50">Encontre os talentos ideais para sua campanha</p>
        </Link>
        <Link href="/marcas/selecoes" className="bg-white border border-border rounded-xl p-8 hover:shadow-sm transition-shadow">
          <ListChecks size={24} className="mb-4 text-muted" />
          <h2 className="text-lg font-light mb-1">Minhas Seleções</h2>
          <p className="text-xs text-muted">{totalSelecoes ?? 0} seleções criadas</p>
        </Link>
        <div className="bg-white border border-border rounded-xl p-8">
          <Send size={24} className="mb-4 text-muted" />
          <h2 className="text-lg font-light mb-1">Orçamentos</h2>
          <p className="text-xs text-muted">{selecoesEnviadas ?? 0} aguardando resposta</p>
        </div>
      </div>
    </div>
  );
}
