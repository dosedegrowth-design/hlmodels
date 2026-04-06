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

  return (
    <div className="pt-24 lg:pt-28 pb-20 min-h-screen bg-gradient-to-b from-[#FFE0F0] via-[#FFF0F7] to-white">
      <div className="px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="mb-14 lg:mb-20 relative">
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-kids-pink/20 rounded-full blur-2xl kids-float" />
          <div className="absolute top-10 right-20 w-12 h-12 bg-kids-lavender/30 rounded-full blur-xl kids-float" style={{ animationDelay: "2s" }} />
          <p className="text-[10px] uppercase tracking-[0.4em] text-kids-coral mb-3 font-medium">
            Ate 5 anos
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
            Baby
          </h1>
        </div>
        <ModelGrid modelos={modelos ?? []} />
      </div>
    </div>
  );
}
