import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modelos Kids - 5 a 15 anos",
  description: "Casting de modelos kids de 5 a 15 anos. Agência HL Models em São Paulo para campanhas infantis e publicidade.",
  alternates: { canonical: "https://hlmodels.vercel.app/kids" },
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
    <div className="pt-24 lg:pt-28 pb-20">
      <div className="px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="mb-14 lg:mb-20">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-3">
            5 a 15 anos
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
            Kids
          </h1>
        </div>
        <ModelGrid modelos={modelos ?? []} />
      </div>
    </div>
  );
}
