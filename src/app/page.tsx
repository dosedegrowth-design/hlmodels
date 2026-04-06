import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { CategoriesCarousel } from "@/components/public/categories-carousel";
import { CATEGORIAS } from "@/types";
import { ProjetoCard } from "@/components/public/projeto-card";
import { BrandsCarousel } from "@/components/public/brands-carousel";
import { FaqSection } from "@/components/public/faq-section";

export default async function HomePage() {
  const supabase = await createClient();

  // Get featured ADULT models for hero (fashion slides)
  const { data: heroModelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("ativo", true)
    .eq("destaque", true)
    .in("categoria", ["homem", "mulher", "nao_binario"])
    .order("ordem", { ascending: true })
    .limit(8);

  // Get featured KIDS models for hero (kids slides)
  const { data: heroKids } = await supabase
    .from("modelos")
    .select("*")
    .eq("ativo", true)
    .in("categoria", ["baby", "kids", "teens"])
    .order("destaque", { ascending: false })
    .order("ordem", { ascending: true })
    .limit(4);

  // Get all active models for grid below
  const { data: todosModelos } = await supabase
    .from("modelos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(12);

  // Get multiple photos per category for slideshow
  const categoryPhotos: Record<string, string[]> = {};
  for (const cat of CATEGORIAS) {
    const { data } = await supabase
      .from("modelos")
      .select("foto_principal")
      .eq("categoria", cat.value)
      .eq("ativo", true)
      .not("foto_principal", "is", null)
      .order("destaque", { ascending: false })
      .order("ordem", { ascending: true })
      .limit(6);
    categoryPhotos[cat.value] = (data ?? [])
      .map((m) => m.foto_principal)
      .filter(Boolean) as string[];
  }

  // Get featured projetos for home
  const { data: projetosDestaque } = await supabase
    .from("projetos")
    .select("*")
    .eq("ativo", true)
    .eq("destaque", true)
    .order("ordem", { ascending: true })
    .limit(4);

  return (
    <>
      {/* Hero - 4 models fullscreen carousel */}
      <HeroCarousel modelos={heroModelos ?? []} modelosKids={heroKids ?? []} />

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
          <CategoriesCarousel categoryPhotos={categoryPhotos} />
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

      {/* Projetos destaque */}
      {projetosDestaque && projetosDestaque.length > 0 && (
        <section className="py-16 lg:py-24 bg-neutral-50">
          <div className="px-6 lg:px-10 max-w-[1600px] mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-3">
                  Portfolio
                </p>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                  Projetos
                </h2>
              </div>
              <Link
                href="/projetos"
                className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
              >
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projetosDestaque.map((p, i) => (
                <ProjetoCard key={p.id} projeto={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Marcas Parceiras */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="px-6 lg:px-10 mb-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-3">
              Quem confia na gente
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              Marcas Parceiras
            </h2>
          </div>
          <BrandsCarousel />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="px-6 lg:px-10 max-w-[1600px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-3">
              Duvidas
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              Perguntas Frequentes
            </h2>
          </div>
          <FaqSection />
        </div>
      </section>

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
