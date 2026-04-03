import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, AtSign } from "lucide-react";
import { categoriaLabel } from "@/types";
import type { ModeloComFotos } from "@/types";
import type { Metadata } from "next";
import { ModelGallery } from "@/components/public/model-gallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: modelo } = await supabase
    .from("modelos")
    .select("nome, bio, foto_principal, categoria")
    .eq("slug", slug)
    .eq("ativo", true)
    .single();

  if (!modelo) return { title: "Modelo não encontrado" };

  const description = modelo.bio || `Conheça ${modelo.nome}, modelo na HL Models - Agência de modelos em São Paulo.`;

  return {
    title: `${modelo.nome} - Modelo`,
    description,
    openGraph: {
      title: `${modelo.nome} | HL Models`,
      description,
      images: modelo.foto_principal ? [{ url: modelo.foto_principal, width: 600, height: 800, alt: modelo.nome }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${modelo.nome} | HL Models`,
      description,
      images: modelo.foto_principal ? [modelo.foto_principal] : [],
    },
    alternates: {
      canonical: `https://hlmodels.vercel.app/modelo/${slug}`,
    },
  };
}

const MEDIDAS = [
  { key: "altura", label: "Altura" },
  { key: "manequim", label: "Manequim" },
  { key: "busto", label: "Busto" },
  { key: "cintura", label: "Cintura" },
  { key: "quadril", label: "Quadril" },
  { key: "calcado", label: "Calçado" },
  { key: "olhos", label: "Olhos" },
  { key: "cabelo", label: "Cabelo" },
] as const;

export default async function ModeloPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: modelo } = await supabase
    .from("modelos")
    .select("*, modelo_fotos(*)")
    .eq("slug", slug)
    .eq("ativo", true)
    .single();

  if (!modelo) notFound();

  const m = modelo as ModeloComFotos;
  const fotos = (m.modelo_fotos ?? []).sort((a, b) => a.ordem - b.ordem);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.nome,
    image: m.foto_principal,
    url: `https://hlmodels.vercel.app/modelo/${m.slug}`,
    description: m.bio,
    worksFor: {
      "@type": "Organization",
      name: "HL Models",
    },
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back */}
      <Link
        href={`/${m.categoria === "nao_binario" ? "nao-binario" : m.categoria}`}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Voltar para {categoriaLabel(m.categoria)}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Main photo */}
        <div className="relative aspect-[3/4] bg-neutral-100 rounded-sm overflow-hidden">
          {m.foto_principal ? (
            <Image
              src={m.foto_principal}
              alt={m.nome}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted text-6xl font-light">
              {m.nome.charAt(0)}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
            {m.nome}
          </h1>
          <p className="text-sm uppercase tracking-widest text-muted mb-8">
            {categoriaLabel(m.categoria)}
          </p>

          {m.bio && (
            <p className="text-muted leading-relaxed mb-8">{m.bio}</p>
          )}

          {/* Measurements */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {MEDIDAS.map(({ key, label }) => {
              const value = m[key];
              if (!value) return null;
              return (
                <div key={key} className="border-b border-border pb-2">
                  <span className="text-xs uppercase tracking-widest text-muted">
                    {label}
                  </span>
                  <p className="text-sm mt-1">{value}</p>
                </div>
              );
            })}
          </div>

          {/* Instagram */}
          {m.instagram && (
            <a
              href={`https://instagram.com/${m.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              <AtSign size={16} />
              {m.instagram}
            </a>
          )}
        </div>
      </div>

      {/* Photo gallery */}
      {fotos.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-light tracking-tight mb-8">Book</h2>
          <ModelGallery fotos={fotos} nome={m.nome} />
        </div>
      )}
    </div>
  );
}
