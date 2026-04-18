import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import { CategoryHero } from "@/components/public/category-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modelos Kids - 5 a 15 anos",
  description: "Conheça nosso casting de modelos kids. Agência HL Models em São Paulo com crianças para campanhas de moda e publicidade.",
  alternates: { canonical: "https://www.hlmodels.com.br/kids" },
};

export default async function KidsPage() {
  const supabase = await createClient();
  const { data: modelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("categoria", "kids")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  return (
    <div>
      <CategoryHero title="Kids" count={modelos?.length ?? 0} />
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <ModelGrid modelos={modelos ?? []} isKids />
      </div>
    </div>
  );
}
