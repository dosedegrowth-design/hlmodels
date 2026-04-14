import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import { HeroVideo } from "@/components/public/hero-video";
import { CategoriesCarousel } from "@/components/public/categories-carousel";
import { CATEGORIAS } from "@/types";
import { ProjetoCard } from "@/components/public/projeto-card";
import { BrandsCarousel } from "@/components/public/brands-carousel";
import { FaqSection } from "@/components/public/faq-section";
import { AprovadosSection } from "@/components/public/aprovados-section";
import { ScrollReveal, ClipReveal } from "@/components/public/scroll-animations";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: todosModelos } = await supabase
    .from("modelos").select("*").eq("ativo", true).order("ordem", { ascending: true }).limit(12);

  const categoryPhotos: Record<string, string[]> = {};
  for (const cat of CATEGORIAS) {
    const { data } = await supabase
      .from("modelos").select("foto_principal").eq("categoria", cat.value)
      .eq("ativo", true).not("foto_principal", "is", null)
      .order("destaque", { ascending: false }).order("ordem", { ascending: true }).limit(6);
    categoryPhotos[cat.value] = (data ?? []).map((m) => m.foto_principal).filter(Boolean) as string[];
  }

  const { data: projetosDestaque } = await supabase
    .from("projetos").select("*").eq("ativo", true).eq("destaque", true)
    .order("ordem", { ascending: true }).limit(4);

  const { data: aprovadosRaw } = await supabase
    .from("modelo_aprovacoes")
    .select("marca_nome, marca_logo, modelos(id, nome, slug, foto_principal, categoria)")
    .order("created_at", { ascending: false }).limit(12);

  const aprovados = (aprovadosRaw ?? [])
    .filter((a: any) => a.modelos)
    .map((a: any) => ({ modelo: a.modelos, marca_nome: a.marca_nome, marca_logo: a.marca_logo }));

  return (
    <>
      <HeroVideo />

      {/* ===== CATEGORIAS ===== */}
      <section className="py-14 md:py-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="px-6 lg:px-10 mb-10">
            <ScrollReveal distance={40} duration={0.8}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">Explore</p>
            </ScrollReveal>
            <ClipReveal delay={0.15}>
              <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight">Categorias</h2>
            </ClipReveal>
          </div>
          <div className="px-6 lg:px-10">
            <CategoriesCarousel categoryPhotos={categoryPhotos} />
          </div>
        </div>
      </section>

      {/* ===== NOSSOS TALENTOS ===== */}
      {todosModelos && todosModelos.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="px-6 lg:px-10 max-w-[1600px] mx-auto">
            <div className="mb-10">
              <ScrollReveal distance={40} duration={0.8}>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">Nosso casting</p>
              </ScrollReveal>
              <ClipReveal delay={0.15}>
                <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight">Nossos Talentos</h2>
              </ClipReveal>
            </div>
            <ModelGrid modelos={todosModelos} />
            <div className="mt-10 text-center">
              <ScrollReveal delay={0.2} distance={20}>
                <Link href="/mulher" className="inline-block text-xs uppercase tracking-[0.3em] text-muted hover:text-foreground transition-colors">
                  Ver todos os modelos &rarr;
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ===== APROVADOS ===== */}
      {aprovados.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="max-w-[1600px] mx-auto">
            <div className="px-6 lg:px-10 mb-10">
              <ScrollReveal distance={40} duration={0.8}>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">Prontos para brilhar</p>
              </ScrollReveal>
              <ClipReveal delay={0.15}>
                <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight">Aprovados</h2>
              </ClipReveal>
            </div>
            <AprovadosSection aprovados={aprovados} />
          </div>
        </section>
      )}

      {/* ===== PROJETOS ===== */}
      {projetosDestaque && projetosDestaque.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="px-6 lg:px-10 max-w-[1600px] mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <ScrollReveal distance={40} duration={0.8}>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">Portfolio</p>
                </ScrollReveal>
                <ClipReveal delay={0.15}>
                  <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight">Projetos</h2>
                </ClipReveal>
              </div>
              <Link href="/projetos" className="text-xs uppercase tracking-[0.3em] text-muted hover:text-foreground transition-colors">
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projetosDestaque.map((p, i) => (
                <ProjetoCard key={p.id} projeto={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== MARCAS PARCEIRAS ===== */}
      <section className="py-14 md:py-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="px-6 lg:px-10 mb-10 text-center">
            <ScrollReveal distance={40} duration={0.8}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">Quem confia na gente</p>
            </ScrollReveal>
            <ClipReveal delay={0.15}>
              <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight">Marcas Parceiras</h2>
            </ClipReveal>
          </div>
          <BrandsCarousel />
        </div>
      </section>

      {/* ===== CTA FAÇA PARTE ===== */}
      <section className="bg-foreground text-white py-14 md:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal distance={40} duration={0.8}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6">Junte-se a nos</p>
          </ScrollReveal>
          <ClipReveal delay={0.15}>
            <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight mb-6">Faça Parte</h2>
          </ClipReveal>
          <ScrollReveal delay={0.3} distance={30}>
            <p className="text-white/50 mb-10 max-w-lg mx-auto text-sm leading-relaxed">
              Se voce tem interesse em iniciar ou desenvolver sua carreira como modelo, entre em contato conosco.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} distance={20}>
            <Link href="/faca-parte" className="inline-block px-12 py-4 border border-white/30 text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-foreground transition-all duration-300">
              Inscreva-se
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-14 md:py-20">
        <div className="px-6 lg:px-10 max-w-[1600px] mx-auto">
          <div className="text-center mb-12">
            <ScrollReveal distance={40} duration={0.8}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">Duvidas</p>
            </ScrollReveal>
            <ClipReveal delay={0.15}>
              <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight">Perguntas Frequentes</h2>
            </ClipReveal>
          </div>
          <FaqSection />
        </div>
      </section>
    </>
  );
}
