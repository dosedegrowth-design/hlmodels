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
        ? [
            {
              url: modelo.foto_principal,
              width: 600,
              height: 800,
              alt: modelo.nome,
            },
          ]
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

const MEDIDAS = [
  { key: "altura", label: "Altura" },
  { key: "manequim", label: "Manequim" },
  { key: "busto", label: "Busto" },
  { key: "cintura", label: "Cintura" },
  { key: "quadril", label: "Quadril" },
  { key: "calcado", label: "Calcado" },
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

  return (
    <div className="pt-24 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* LEFT - Main Photo */}
          <div
            className={`relative aspect-[3/4] overflow-hidden ${
              isKids ? "rounded-2xl" : "rounded-sm"
            }`}
          >
            {m.foto_principal ? (
              <Image
                src={m.foto_principal}
                alt={m.nome}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-6xl font-light text-muted">
                {m.nome.charAt(0)}
              </div>
            )}
          </div>

          {/* RIGHT - Sidebar */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {/* Back link */}
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft size={12} />
              Voltar para {categoriaLabel(m.categoria)}
            </Link>

            {/* Category badge */}
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
              {categoriaLabel(m.categoria)}
              {m.idade ? ` — ${m.idade} anos` : ""}
            </p>

            {/* Name */}
            <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight mb-4">
              {m.nome}
            </h1>

            {/* Bio */}
            {m.bio && (
              <p className="text-sm text-muted leading-relaxed mb-8">
                {m.bio}
              </p>
            )}

            {/* Measurements */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {MEDIDAS.map(({ key, label }) => {
                  const value = m[key];
                  if (!value) return null;
                  return (
                    <div key={key}>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {label}
                      </span>
                      <p className="text-sm">{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Habilidades & Idiomas (kids) */}
            {isKids &&
              ((m.habilidades && m.habilidades.length > 0) ||
                (m.idiomas && m.idiomas.length > 0)) && (
                <div className="mb-8 space-y-4">
                  {m.habilidades && m.habilidades.length > 0 && (
                    <div>
                      <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Habilidades
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {m.habilidades.map((h) => (
                          <span
                            key={h}
                            className="px-2.5 py-1 bg-neutral-100 text-foreground/70 rounded-full text-xs"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {m.idiomas && m.idiomas.length > 0 && (
                    <div>
                      <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Idiomas
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {m.idiomas.map((i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-neutral-100 text-foreground/70 rounded-full text-xs"
                          >
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Instagram */}
            {m.instagram && (
              <a
                href={`https://instagram.com/${m.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                <AtSign size={14} />
                {m.instagram}
              </a>
            )}
          </div>
        </div>

        {/* Photo Gallery - full width below split */}
        {fotos.length > 0 && (
          <div className="mt-16 md:mt-24 mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
              Book
            </p>
            <ModelGallery fotos={fotos} nome={m.nome} />
          </div>
        )}
      </div>
    </div>
  );
}
