import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, AtSign, MapPin, Calendar, Star, Sparkles } from "lucide-react";
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

// Kids-specific color maps
const KIDS_COLORS: Record<string, { accent: string; badge: string }> = {
  baby: { accent: "text-[#F1755C]", badge: "bg-[#F1755C]/15 text-[#F1755C]" },
  kids: { accent: "text-[#A1BCA6]", badge: "bg-[#A1BCA6]/15 text-[#A1BCA6]" },
  teens: { accent: "text-[#3A6084]", badge: "bg-[#3A6084]/15 text-[#3A6084]" },
};

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
  const kidsColor = KIDS_COLORS[m.categoria];

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
    <div
      className={`pt-28 pb-20 min-h-screen ${
        isKids ? "bg-[#FFFAF7]" : ""
      }`}
    >
      <div className="px-6 max-w-7xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Back */}
        <Link
          href={backHref}
          className={`inline-flex items-center gap-2 text-sm transition-colors mb-8 ${
            isKids
              ? `${kidsColor.accent} hover:opacity-70`
              : "text-muted hover:text-foreground"
          }`}
        >
          <ArrowLeft size={16} />
          Voltar para {categoriaLabel(m.categoria)}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Main photo */}
          <div
            className={`relative aspect-[3/4] overflow-hidden ${
              isKids
                ? "rounded-2xl shadow-xl"
                : "rounded-xl bg-neutral-100"
            }`}
          >
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
              <div
                className={`absolute inset-0 flex items-center justify-center text-6xl font-light ${
                  isKids
                    ? "bg-gradient-to-br from-[#F2919B]/20 to-kids-lavender/20 text-[#8E6FBF]/30"
                    : "text-muted"
                }`}
              >
                {m.nome.charAt(0)}
              </div>
            )}

            {/* Kids badge on photo */}
            {isKids && (
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${kidsColor.badge} bg-white/80`}
                >
                  <Star size={10} />
                  {categoriaLabel(m.categoria)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
              {m.nome}
            </h1>
            <p
              className={`text-sm uppercase tracking-widest mb-6 ${
                isKids ? kidsColor.accent + " font-medium" : "text-muted"
              }`}
            >
              {isKids && <Sparkles size={12} className="inline mr-1 mb-0.5" />}
              {categoriaLabel(m.categoria)}
              {m.idade ? ` — ${m.idade} anos` : ""}
            </p>

            {/* Quick info tags (kids) */}
            {isKids && (m.cidade || m.idade) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {m.cidade && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs shadow-sm border border-border/50">
                    <MapPin size={12} className={kidsColor.accent} />{" "}
                    {m.cidade}
                  </span>
                )}
                {m.idade && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs shadow-sm border border-border/50">
                    <Calendar size={12} className={kidsColor.accent} />{" "}
                    {m.idade} anos
                  </span>
                )}
              </div>
            )}

            {m.bio && (
              <p
                className={`leading-relaxed mb-8 ${
                  isKids ? "text-foreground/70" : "text-muted"
                }`}
              >
                {m.bio}
              </p>
            )}

            {/* Measurements */}
            <div className="mb-8">
              <h2
                className={`text-xs uppercase tracking-widest mb-4 ${
                  isKids ? kidsColor.accent : "text-muted"
                }`}
              >
                Medidas
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {MEDIDAS.map(({ key, label }) => {
                  const value = m[key];
                  if (!value) return null;
                  return (
                    <div
                      key={key}
                      className={`py-2 px-3 rounded-lg ${
                        isKids
                          ? "bg-white shadow-sm border border-border/30"
                          : "border-b border-border"
                      }`}
                    >
                      <span
                        className={`text-[10px] uppercase tracking-widest ${
                          isKids ? kidsColor.accent : "text-muted"
                        }`}
                      >
                        {label}
                      </span>
                      <p className="text-sm mt-0.5 font-medium">{value}</p>
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
                      <h2
                        className={`text-[10px] uppercase tracking-widest mb-2 ${kidsColor.accent}`}
                      >
                        Habilidades
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {m.habilidades.map((h) => (
                          <span
                            key={h}
                            className="px-2.5 py-1 bg-[#FFD600]/15 text-foreground/70 rounded-full text-xs"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {m.idiomas && m.idiomas.length > 0 && (
                    <div>
                      <h2
                        className={`text-[10px] uppercase tracking-widest mb-2 ${kidsColor.accent}`}
                      >
                        Idiomas
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {m.idiomas.map((i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-[#6DB8D4]/15 text-foreground/70 rounded-full text-xs"
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
                className={`inline-flex items-center gap-2 text-sm transition-colors ${
                  isKids
                    ? "text-[#8E6FBF] hover:opacity-70"
                    : "text-muted hover:text-foreground"
                }`}
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
            <h2
              className={`text-2xl font-light tracking-tight mb-8 ${
                isKids ? "" : ""
              }`}
            >
              {isKids && (
                <Sparkles
                  size={16}
                  className={`inline mr-2 mb-1 ${kidsColor.accent}`}
                />
              )}
              Book
            </h2>
            <ModelGallery fotos={fotos} nome={m.nome} />
          </div>
        )}
      </div>
    </div>
  );
}
