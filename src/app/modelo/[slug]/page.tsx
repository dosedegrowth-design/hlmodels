import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AtSign } from "lucide-react";
import { categoriaLabel } from "@/types";
import type { ModeloComFotos } from "@/types";
import type { Metadata } from "next";
import { ModelGallery } from "@/components/public/model-gallery";
import { ModeloHero } from "@/components/public/modelo-hero";

interface Props {
  params: Promise<{ slug: string }>;
}

const KIDS_CATS = ["baby", "kids", "teens"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: modelo } = await supabase
    .from("modelos")
    .select("nome, bio, foto_principal, categoria")
    .eq("slug", slug)
    .eq("ativo", true)
    .single();

  if (!modelo) return { title: "Modelo nao encontrado" };

  const description =
    modelo.bio ||
    `Conheca ${modelo.nome}, modelo na HL Models - Agencia de modelos em Sao Paulo.`;

  return {
    title: `${modelo.nome} - Modelo`,
    description,
    openGraph: {
      title: `${modelo.nome} | HL Models`,
      description,
      images: modelo.foto_principal
        ? [{ url: modelo.foto_principal, width: 600, height: 800, alt: modelo.nome }]
        : [],
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
  const isKids = KIDS_CATS.includes(m.categoria);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.nome,
    image: m.foto_principal,
    url: `https://hlmodels.vercel.app/modelo/${m.slug}`,
    description: m.bio,
    worksFor: { "@type": "Organization", name: "HL Models" },
  };

  const backHref =
    m.categoria === "nao_binario" ? "/nao-binario" : `/${m.categoria}`;

  const medidas = [
    { label: "Altura", value: m.altura },
    { label: "Manequim", value: m.manequim },
    { label: "Busto", value: m.busto },
    { label: "Cintura", value: m.cintura },
    { label: "Quadril", value: m.quadril },
    { label: "Calcado", value: m.calcado },
    { label: "Olhos", value: m.olhos },
    { label: "Cabelo", value: m.cabelo },
  ].filter((med) => med.value);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero with parallax — client component */}
      <ModeloHero
        nome={m.nome}
        fotoPrincipal={m.foto_principal}
        categoria={m.categoria}
        categoriaLabel={categoriaLabel(m.categoria)}
        idade={m.idade}
        bio={m.bio}
        instagram={m.instagram}
        medidas={medidas}
        habilidades={isKids ? m.habilidades : null}
        idiomas={isKids ? m.idiomas : null}
        isKids={isKids}
        backHref={backHref}
      />

      {/* Gallery below */}
      {fotos.length > 0 && (
        <div className="px-4 md:px-6 max-w-[1800px] mx-auto py-16 md:py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-8">
            Book — {fotos.length} fotos
          </p>
          <ModelGallery fotos={fotos} nome={m.nome} />
        </div>
      )}
    </div>
  );
}
