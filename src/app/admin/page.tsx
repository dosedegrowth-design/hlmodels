import { createClient } from "@/lib/supabase/server";
import { Users, FileText, MessageSquare, Star, Building2, ClipboardList } from "lucide-react";
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
  ];

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-border p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <stat.icon size={20} className="text-muted" />
              <span className="text-xs uppercase tracking-widest text-muted">
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-light">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
