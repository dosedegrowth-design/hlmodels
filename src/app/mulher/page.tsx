import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modelos Femininas | HL Models",
  description: "Conheça nosso casting de modelos femininas.",
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
    <div className="pt-24 lg:pt-28 pb-20">
      <div className="px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="mb-14 lg:mb-20">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-3">
            Mainboard
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
            Mulher
          </h1>
        </div>
        <ModelGrid modelos={modelos ?? []} />
      </div>
    </div>
  );
}
