import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projetos e Portfolio",
  description: "Conheça os projetos e campanhas realizados pela HL Models com marcas e modelos. Portfolio de moda, publicidade e editorial.",
  alternates: { canonical: "https://hlmodels.vercel.app/projetos" },
};

export default async function ProjetosPage() {
  const supabase = await createClient();
  const { data: projetos } = await supabase
    .from("projetos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  return (
    <div className="pt-24 lg:pt-28 pb-20">
      <div className="px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="mb-14 lg:mb-20">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-3">Portfolio</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">Projetos</h1>
        </div>

        {(!projetos || projetos.length === 0) ? (
          <div className="text-center py-20 text-muted text-sm uppercase tracking-widest">
            Nenhum projeto publicado ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((p) => (
              <Link key={p.id} href={`/projetos/${p.slug}`} className="group block">
                <div className="relative aspect-video bg-neutral-100 overflow-hidden rounded-xl mb-4">
                  {p.foto_capa ? (
                    <Image src={p.foto_capa} alt={p.titulo} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-neutral-200 text-2xl text-neutral-400">{p.titulo.charAt(0)}</div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>
                <h2 className="text-lg font-light tracking-tight group-hover:tracking-wider transition-all duration-300">{p.titulo}</h2>
                {p.marca_parceira && (
                  <p className="text-xs text-muted uppercase tracking-widest mt-1">{p.marca_parceira}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
