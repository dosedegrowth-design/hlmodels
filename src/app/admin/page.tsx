import { createClient } from "@/lib/supabase/server";
import { Users, FileText, MessageSquare, Star, Building2, ClipboardList, FolderOpen } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalModelos },
    { count: modelosAtivos },
    { count: candidaturasPendentes },
    { count: contatosNaoLidos },
    { count: marcasPendentes },
    { count: orcamentosPendentes },
    { count: totalProjetos },
  ] = await Promise.all([
    supabase.from("modelos").select("*", { count: "exact", head: true }),
    supabase
      .from("modelos")
      .select("*", { count: "exact", head: true })
      .eq("ativo", true),
    supabase
      .from("candidaturas")
      .select("*", { count: "exact", head: true })
      .eq("status", "pendente"),
    supabase
      .from("contatos")
      .select("*", { count: "exact", head: true })
      .eq("lido", false),
    supabase
      .from("marcas")
      .select("*", { count: "exact", head: true })
      .eq("status", "pendente"),
    supabase
      .from("selecoes")
      .select("*", { count: "exact", head: true })
      .eq("status", "enviada"),
    supabase.from("projetos").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Total de Modelos",
      value: totalModelos ?? 0,
      icon: Users,
      href: "/admin/modelos",
    },
    {
      label: "Modelos Ativos",
      value: modelosAtivos ?? 0,
      icon: Star,
      href: "/admin/modelos",
    },
    {
      label: "Candidaturas Pendentes",
      value: candidaturasPendentes ?? 0,
      icon: FileText,
      href: "/admin/candidaturas",
    },
    {
      label: "Contatos Não Lidos",
      value: contatosNaoLidos ?? 0,
      icon: MessageSquare,
      href: "/admin/contatos",
    },
    {
      label: "Marcas Pendentes",
      value: marcasPendentes ?? 0,
      icon: Building2,
      href: "/admin/marcas",
    },
    {
      label: "Orcamentos Pendentes",
      value: orcamentosPendentes ?? 0,
      icon: ClipboardList,
      href: "/admin/orcamentos",
    },
    {
      label: "Total Projetos",
      value: totalProjetos ?? 0,
      icon: FolderOpen,
      href: "/admin/projetos",
    },
  ];

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Visao geral da agencia</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/modelos/novo"
            className="px-4 py-2 bg-foreground text-white text-xs rounded-lg hover:bg-foreground/90 transition-colors"
          >
            + Modelo
          </Link>
          <Link
            href="/admin/projetos/novo"
            className="px-4 py-2 border border-border text-xs rounded-lg hover:bg-neutral-50 transition-colors"
          >
            + Projeto
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-shadow group"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className="text-muted group-hover:text-foreground transition-colors" />
              <span className="text-[10px] uppercase tracking-widest text-muted">
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-light">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
