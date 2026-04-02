import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { CategoriesCarousel } from "@/components/public/categories-carousel";

export default async function HomePage() {
  const supabase = await createClient();

  // Get featured models for hero carousel (8 = 2 slides of 4)
  const { data: heroModelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("ativo", true)
    .eq("destaque", true)
    .order("ordem", { ascending: true })
    .limit(8);

  // Get all active models for grid below
  const { data: todosModelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(12);

  return (
    <>
      {/* Hero - 4 models fullscreen carousel */}
      <HeroCarousel modelos={heroModelos ?? []} />

      {/* Categories carousel */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto">
          <div className="px-6 lg:px-10 mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-3">
              Explore
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              Categorias
            </h2>
          </div>
          <CategoriesCarousel />
        </div>
      </section>

      {/* All models grid */}
      {todosModelos && todosModelos.length > 0 && (
        <section className="pb-20">
          <div className="px-6 lg:px-10 max-w-[1600px] mx-auto">
            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-3">
                Nosso casting
              </p>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                Todos os modelos
              </h2>
            </div>
            <ModelGrid modelos={todosModelos} />
          </div>
        </section>
      )}

      {/* CTA Faça Parte */}
      <section className="bg-foreground text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-6">
            Junte-se a nós
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
            Quer fazer parte?
          </h2>
          <p className="text-white/50 mb-10 max-w-lg mx-auto">
            Se você tem interesse em iniciar ou desenvolver sua carreira como
            modelo, entre em contato conosco.
          </p>
          <Link
            href="/faca-parte"
            className="inline-block px-12 py-4 border border-white/30 text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-foreground transition-all duration-300"
          >
            Inscreva-se
          </Link>
        </div>
      </section>
    </>
  );
}
