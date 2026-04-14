import { createClient } from "@/lib/supabase/server";
import { ProjetoCard } from "@/components/public/projeto-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projetos e Portfolio",
  description: "Conheça os projetos e campanhas realizados pela HL Models com marcas e modelos. Portfolio de moda, publicidade e editorial.",
  alternates: { canonical: "https://hlmodels.vercel.app/projetos" },
};

export default async function ProjetosPage() {
  const supabase = await createClient();
  const { data: projetos } = await supabase
    .from("projetos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  return (
    <div>
      {/* Hero */}
      <div className="pt-32 pb-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
          Portfolio
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-normal tracking-tight">
          Projetos
        </h1>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
        {!projetos || projetos.length === 0 ? (
          <div className="text-center py-20 text-muted text-sm uppercase tracking-widest">
            Nenhum projeto publicado ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {projetos.map((p, i) => (
              <ProjetoCard key={p.id} projeto={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
