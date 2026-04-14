import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import { CategoryHero } from "@/components/public/category-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modelos Femininas",
  description: "Conheça nosso casting de modelos femininas. Agência HL Models em São Paulo com modelos para moda, publicidade e editorial.",
  alternates: { canonical: "https://hlmodels.vercel.app/mulher" },
};

export default async function MulherPage() {
  const supabase = await createClient();
  const { data: modelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("categoria", "mulher")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  return (
    <div>
      <CategoryHero title="Mulher" count={modelos?.length ?? 0} />
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <ModelGrid modelos={modelos ?? []} />
      </div>
    </div>
  );
}
