import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import type { ProjetoCompleto } from "@/types";
import { ModelGallery } from "@/components/public/model-gallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: projeto } = await supabase.from("projetos").select("titulo, descricao, foto_capa, marca_parceira").eq("slug", slug).eq("ativo", true).single();
  if (!projeto) return { title: "Projeto nao encontrado" };
  const description = projeto.descricao || `Projeto ${projeto.titulo} da HL Models.`;
  return {
    title: `${projeto.titulo} - Projetos`,
    description,
    openGraph: {
      title: `${projeto.titulo} | HL Models`,
      description,
      images: projeto.foto_capa ? [{ url: projeto.foto_capa, width: 1200, height: 800, alt: projeto.titulo }] : [],
      type: "article",
    },
    alternates: { canonical: `https://hlmodels.vercel.app/projetos/${slug}` },
  };
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

export default async function ProjetoPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: projeto } = await supabase
    .from("projetos")
    .select("*, projeto_fotos(*), projeto_modelos(*, modelos(id, nome, slug, foto_principal, categoria))")
    .eq("slug", slug)
    .eq("ativo", true)
    .single();

  if (!projeto) notFound();

  const p = projeto as unknown as ProjetoCompleto;
  const fotos = (p.projeto_fotos ?? []).sort((a, b) => a.ordem - b.ordem);
  const modelos = (p.projeto_modelos ?? []).map((pm: any) => pm.modelos).filter(Boolean);
  const embedUrl = p.video_url ? getEmbedUrl(p.video_url) : null;

  // Adapt fotos for ModelGallery (needs id, url, ordem, tipo, modelo_id, created_at)
  const galeriaFotos = fotos.map(f => ({ ...f, tipo: "book" as const, modelo_id: "" }));

  return (
    <div>
      {/* Back link - fixed at top */}
      <div className="fixed top-4 left-4 z-30">
        <Link
          href="/projetos"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/70 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full"
        >
          <ArrowLeft size={12} />
          Projetos
        </Link>
      </div>

      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        {p.foto_capa ? (
          <Image
            src={p.foto_capa}
            alt={p.titulo}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {p.marca_parceira && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">
                {p.marca_parceira}
              </p>
            )}
            <h1 className="font-display text-4xl md:text-5xl font-light text-white tracking-tight">
              {p.titulo}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Description */}
        {p.descricao && (
          <p className="text-lg text-muted leading-relaxed mb-12 whitespace-pre-line">
            {p.descricao}
          </p>
        )}

        {/* Video embed */}
        {embedUrl && (
          <div className="aspect-video rounded-sm overflow-hidden mb-16">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        )}

        {/* Photo gallery */}
        {galeriaFotos.length > 0 && (
          <div className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
              Galeria
            </p>
            <ModelGallery fotos={galeriaFotos} nome={p.titulo} />
          </div>
        )}

        {/* Participating models */}
        {modelos.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
              Modelos
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {modelos.map((m: any) => (
                <Link key={m.id} href={`/modelo/${m.slug}`} className="group">
                  <div className="relative aspect-[3/4] bg-neutral-100 rounded-sm overflow-hidden mb-2">
                    {m.foto_principal ? (
                      <Image
                        src={m.foto_principal}
                        alt={m.nome}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="150px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xl text-neutral-300">
                        {m.nome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-center">{m.nome}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
