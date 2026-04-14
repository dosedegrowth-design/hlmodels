import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modelos Baby - Ate 5 anos",
  description: "Casting de modelos baby ate 5 anos. Agencia HL Models em Sao Paulo para campanhas infantis e publicidade.",
  alternates: { canonical: "https://hlmodels.vercel.app/baby" },
};

export default async function BabyPage() {
  const supabase = await createClient();
  const { data: modelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("categoria", "baby")
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
          <div className="absolute inset-0 bg-[#FFF0E8]" />
        )}
        <div className="absolute inset-0 bg-[#F1755C]/20 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative h-full flex flex-col items-center justify-center text-center">
          <h1 className="font-kids text-5xl md:text-6xl lg:text-7xl uppercase tracking-[0.1em] text-white font-bold">
            Baby
          </h1>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/50">
            {modelos?.length ?? 0} modelo{(modelos?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Model Grid */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <ModelGrid modelos={modelos ?? []} />
      </div>
    </div>
  );
}
