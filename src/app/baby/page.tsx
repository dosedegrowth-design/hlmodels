import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import { CategoryHero } from "@/components/public/category-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modelos Baby - Até 5 anos",
  description: "Conheça nosso casting de modelos baby. Agência HL Models em São Paulo com bebês e crianças para campanhas publicitárias.",
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

  return (
    <div>
      <CategoryHero title="Baby" count={modelos?.length ?? 0} fallbackColor="#2a2a2a" />
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <ModelGrid modelos={modelos ?? []} isKids />
      </div>
    </div>
  );
}
