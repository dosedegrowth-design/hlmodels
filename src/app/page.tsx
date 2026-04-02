import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { CATEGORIAS } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();

  // Get featured models for hero carousel
  const { data: heroModelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("ativo", true)
    .eq("destaque", true)
    .order("ordem", { ascending: true })
    .limit(6);

  // Get all active models for grid below
  const { data: todosModelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(12);

  return (
    <>
      {/* Hero - Split fullscreen carousel like reference */}
      <HeroCarousel modelos={heroModelos ?? []} />

      {/* Categories nav */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted mb-8">
              Categorias
            </h2>
            <div className="flex items-center gap-8 md:gap-16">
              {CATEGORIAS.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="group text-center"
                >
                  <span className="text-2xl md:text-4xl font-light tracking-tight text-foreground group-hover:tracking-wider transition-all duration-300">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Model grid */}
          {todosModelos && todosModelos.length > 0 && (
            <ModelGrid modelos={todosModelos} />
          )}
        </div>
      </section>

      {/* CTA Faça Parte */}
      <section className="bg-foreground text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
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
