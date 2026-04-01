import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ModelGrid } from "@/components/public/model-grid";
import { CATEGORIAS } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: destaques } = await supabase
    .from("modelos")
    .select("*")
    .eq("ativo", true)
    .eq("destaque", true)
    .order("ordem", { ascending: true })
    .limit(8);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center bg-foreground text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6">
            HL MODELS
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-10">
            Agência de modelos profissional. Conectando talentos a oportunidades.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="px-8 py-3 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      {destaques && destaques.length > 0 && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                Destaques
              </h2>
              <p className="text-muted text-sm mt-1">Nossos talentos em evidência</p>
            </div>
          </div>
          <ModelGrid modelos={destaques} />
        </section>
      )}

      {/* CTA Faça Parte */}
      <section className="bg-neutral-50 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
            Quer fazer parte?
          </h2>
          <p className="text-muted mb-8">
            Se você tem interesse em iniciar ou desenvolver sua carreira como
            modelo, entre em contato conosco.
          </p>
          <Link
            href="/faca-parte"
            className="inline-block px-10 py-4 bg-foreground text-white text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors"
          >
            Inscreva-se
          </Link>
        </div>
      </section>
    </>
  );
}
