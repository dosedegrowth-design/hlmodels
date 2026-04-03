import { createClient } from "@/lib/supabase/server";
import { ExternalLink } from "lucide-react";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();

  // Get counts
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

      {/* Site info */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4">Informacoes do Site</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-muted uppercase tracking-widest">Nome</span>
            <p className="text-sm font-medium">HL Models</p>
          </div>
          <div>
            <span className="text-[10px] text-muted uppercase tracking-widest">URL</span>
            <a
              href="https://hlmodels.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 hover:underline"
            >
              hlmodels.vercel.app <ExternalLink size={12} />
            </a>
          </div>
          <div>
            <span className="text-[10px] text-muted uppercase tracking-widest">Supabase Project</span>
            <p className="text-sm text-muted">hsiwtgzixratjuigjxyj</p>
          </div>
          <div>
            <span className="text-[10px] text-muted uppercase tracking-widest">Regiao</span>
            <p className="text-sm text-muted">sa-east-1 (Sao Paulo)</p>
          </div>
        </div>
      </div>

      {/* Database stats */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4">Banco de Dados</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {[
            { label: "Modelos", value: totalModelos ?? 0 },
            { label: "Fotos", value: totalFotos ?? 0 },
            { label: "Projetos", value: totalProjetos ?? 0 },
            { label: "Marcas", value: totalMarcas ?? 0 },
            { label: "Candidaturas", value: totalCandidaturas ?? 0 },
            { label: "Contatos", value: totalContatos ?? 0 },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-light">{stat.value}</p>
              <p className="text-[10px] text-muted uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4">Links Rapidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Ver site publico", href: "/", external: false },
            { label: "Portal de Marcas", href: "/marcas/login", external: false },
            { label: "Supabase Dashboard", href: "https://supabase.com/dashboard/project/hsiwtgzixratjuigjxyj", external: true },
            { label: "Vercel Dashboard", href: "https://vercel.com/dose-de-growths-projects/hlmodels", external: true },
            { label: "GitHub Repo", href: "https://github.com/dosedegrowth-design/hlmodels", external: true },
            { label: "Sitemap", href: "/sitemap.xml", external: false },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="flex items-center justify-between px-4 py-3 border border-border rounded-lg text-sm hover:bg-neutral-50 transition-colors"
            >
              {link.label}
              {link.external && <ExternalLink size={14} className="text-muted" />}
            </a>
          ))}
        </div>
      </div>

      {/* Accounts */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4">Contas</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted">admin@hlmodels.com.br</p>
            </div>
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Ativo</span>
          </div>
          <p className="text-xs text-muted">
            Para alterar a senha, acesse o Supabase Dashboard &gt; Authentication &gt; Users.
          </p>
        </div>
      </div>
    </div>
  );
}
