import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import { ScrollReveal } from "@/components/public/scroll-animations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modelos Masculinos",
  description: "Conheça nosso casting de modelos masculinos. Agência HL Models em São Paulo com modelos para moda, publicidade e editorial.",
  alternates: { canonical: "https://hlmodels.vercel.app/homem" },
};

export default async function HomemPage() {
  const supabase = await createClient();
  const { data: modelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("categoria", "homem")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  const heroImage = modelos?.[0]?.foto_principal ?? null;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        {heroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-100" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase tracking-[0.1em] text-white font-normal">
            Homem
          </h1>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
            {modelos?.length ?? 0} modelo{(modelos?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Model Grid */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <ScrollReveal>
          <ModelGrid modelos={modelos ?? []} />
        </ScrollReveal>
      </div>
    </div>
  );
}
