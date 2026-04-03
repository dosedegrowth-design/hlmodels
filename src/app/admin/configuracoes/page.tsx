import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ExternalLink, Users, FolderOpen, FileText, MessageSquare, Building2 } from "lucide-react";
import { AdminUsers } from "@/components/admin/admin-users";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();

  const [
    { count: totalModelos },
    { count: totalProjetos },
    { count: totalMarcas },
    { count: totalCandidaturas },
    { count: totalContatos },
    { count: totalFotos },
  ] = await Promise.all([
    supabase.from("modelos").select("*", { count: "exact", head: true }),
    supabase.from("projetos").select("*", { count: "exact", head: true }),
    supabase.from("marcas").select("*", { count: "exact", head: true }),
    supabase.from("candidaturas").select("*", { count: "exact", head: true }),
    supabase.from("contatos").select("*", { count: "exact", head: true }),
    supabase.from("modelo_fotos").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="pt-14 lg:pt-0 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Configuracoes</h1>

      {/* Administrators */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4">
          Administradores
        </h2>
        <AdminUsers />
      </div>

      {/* Overview stats */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4">
          Resumo da plataforma
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {[
            { label: "Modelos", value: totalModelos ?? 0, icon: Users },
            { label: "Fotos", value: totalFotos ?? 0, icon: FileText },
            { label: "Projetos", value: totalProjetos ?? 0, icon: FolderOpen },
            { label: "Marcas", value: totalMarcas ?? 0, icon: Building2 },
            { label: "Candidaturas", value: totalCandidaturas ?? 0, icon: FileText },
            { label: "Contatos", value: totalContatos ?? 0, icon: MessageSquare },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-light">{stat.value}</p>
              <p className="text-[10px] text-muted uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4">
          Links rapidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-3 border border-border rounded-lg text-sm hover:bg-neutral-50 transition-colors"
          >
            Ver site publico
            <ExternalLink size={14} className="text-muted" />
          </Link>
          <Link
            href="/marcas/login"
            className="flex items-center justify-between px-4 py-3 border border-border rounded-lg text-sm hover:bg-neutral-50 transition-colors"
          >
            Portal de Marcas
            <ExternalLink size={14} className="text-muted" />
          </Link>
        </div>
      </div>
    </div>
  );
}
