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
    <div className="pt-24 lg:pt-28 pb-20">
      <div className="px-6 lg:px-10 max-w-[1200px] mx-auto">
        <Link href="/projetos" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} /> Voltar para Projetos
        </Link>

        {/* Hero image */}
        {p.foto_capa && (
          <div className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden mb-8">
            <Image src={p.foto_capa} alt={p.titulo} fill className="object-cover" priority sizes="1200px" />
          </div>
        )}

        {/* Title + info */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3">{p.titulo}</h1>
          {p.marca_parceira && (
            <p className="text-sm uppercase tracking-widest text-muted">{p.marca_parceira}</p>
          )}
        </div>

        {/* Description */}
        {p.descricao && (
          <div className="mb-12 max-w-3xl">
            <p className="text-muted leading-relaxed whitespace-pre-line">{p.descricao}</p>
          </div>
        )}

        {/* Video embed */}
        {embedUrl && (
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Video</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <iframe src={embedUrl} className="absolute inset-0 w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
            </div>
          </div>
        )}

        {/* Photo gallery */}
        {fotos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Galeria</h2>
            <ModelGallery fotos={galeriaFotos} nome={p.titulo} />
          </div>
        )}

        {/* Models */}
        {modelos.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Modelos</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {modelos.map((m: any) => (
                <Link key={m.id} href={`/modelo/${m.slug}`} className="group">
                  <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-2">
                    {m.foto_principal ? (
                      <Image src={m.foto_principal} alt={m.nome} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="150px" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xl text-neutral-300">{m.nome.charAt(0)}</div>
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
