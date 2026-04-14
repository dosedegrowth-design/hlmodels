import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import { CategoryHero } from "@/components/public/category-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modelos Não Binários",
  description: "Conheça nosso casting de modelos não binários. Agência HL Models em São Paulo com diversidade e inclusão.",
  alternates: { canonical: "https://hlmodels.vercel.app/nao-binario" },
};

export default async function NaoBinarioPage() {
  const supabase = await createClient();
  const { data: modelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("categoria", "nao_binario")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  return (
    <div>
      <CategoryHero title="Não Binário" count={modelos?.length ?? 0} />
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <ModelGrid modelos={modelos ?? []} />
      </div>
    </div>
  );
}
