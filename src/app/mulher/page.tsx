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
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
        Mulher
      </h1>
      <p className="text-muted text-sm uppercase tracking-widest mb-12">
        Mainboard
      </p>
      <ModelGrid modelos={modelos ?? []} />
    </div>
  );
}
