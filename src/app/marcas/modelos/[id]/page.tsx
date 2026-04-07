"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Check, MapPin, Ruler, Calendar, User } from "lucide-react";
import type { Modelo, ModeloFoto } from "@/types";
import { categoriaLabel } from "@/types";

export default function MarcasModeloDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [modelo, setModelo] = useState<Modelo | null>(null);
  const [fotos, setFotos] = useState<ModeloFoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [selecaoId, setSelecaoId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      // Load model
      const { data: m } = await supabase
        .from("modelos")
        .select("*, modelo_fotos(*)")
        .eq("id", id)
        .eq("ativo", true)
        .single();

      if (!m) {
        setLoading(false);
        return;
      }

      setModelo(m as Modelo);
      setFotos(
        ((m as any).modelo_fotos ?? []).sort(
          (a: ModeloFoto, b: ModeloFoto) => a.ordem - b.ordem
        )
      );

      // Check if model is in active selection
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: marca } = await supabase
          .from("marcas")
          .select("id")
          .eq("user_id", user.id)
          .single();
        if (marca) {
          const { data: draft } = await supabase
            .from("selecoes")
            .select("id, selecao_modelos(modelo_id)")
            .eq("marca_id", marca.id)
            .eq("status", "rascunho")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          if (draft) {
            setSelecaoId(draft.id);
            const ids = (draft.selecao_modelos as any[]).map(
              (sm: any) => sm.modelo_id
            );
            setIsSelected(ids.includes(id));
          }
        }
      }

      setLoading(false);
    }
    load();
  }, [id]);

  async function toggleSelection() {
    let sid = selecaoId;

    if (!sid) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: marca } = await supabase
        .from("marcas")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!marca) return;

      const { data: newSel } = await supabase
        .from("selecoes")
        .insert({
          marca_id: marca.id,
          nome: "Nova Selecao",
          status: "rascunho",
        })
        .select("id")
        .single();
      if (!newSel) return;
      sid = newSel.id;
      setSelecaoId(sid);
    }

    if (isSelected) {
      await supabase
        .from("selecao_modelos")
        .delete()
        .eq("selecao_id", sid)
        .eq("modelo_id", id);
      setIsSelected(false);
    } else {
      await supabase
        .from("selecao_modelos")
        .insert({ selecao_id: sid, modelo_id: id });
      setIsSelected(true);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-muted text-sm">
        Carregando...
      </div>
    );
  }

  if (!modelo) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-muted text-sm mb-4">Modelo nao encontrado.</p>
        <Link
          href="/marcas/modelos"
          className="text-sm underline text-muted hover:text-foreground"
        >
          Voltar para busca
        </Link>
      </div>
    );
  }

  const MEDIDAS = [
    { key: "altura", label: "Altura", icon: Ruler },
    { key: "manequim", label: "Manequim", icon: User },
    { key: "busto", label: "Busto" },
    { key: "cintura", label: "Cintura" },
    { key: "quadril", label: "Quadril" },
    { key: "calcado", label: "Calcado" },
    { key: "olhos", label: "Olhos" },
    { key: "cabelo", label: "Cabelo" },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Back + selection action */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/marcas/modelos"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Voltar para busca
        </Link>
        <button
          onClick={toggleSelection}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg transition-all ${
            isSelected
              ? "bg-foreground text-white"
              : "border border-foreground text-foreground hover:bg-foreground hover:text-white"
          }`}
        >
          {isSelected ? (
            <>
              <Check size={16} /> Na sua selecao
            </>
          ) : (
            <>
              <Plus size={16} /> Adicionar a selecao
            </>
          )}
        </button>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Main photo */}
        <div>
          <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden">
            {modelo.foto_principal ? (
              <Image
                src={modelo.foto_principal}
                alt={modelo.nome}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-6xl text-neutral-300 font-light">
                {modelo.nome.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
            {categoriaLabel(modelo.categoria)}
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
            {modelo.nome}
          </h1>

          {modelo.bio && (
            <p className="text-muted leading-relaxed mb-8">{modelo.bio}</p>
          )}

          {/* Quick info */}
          <div className="flex flex-wrap gap-3 mb-8">
            {modelo.cidade && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-full text-xs">
                <MapPin size={12} /> {modelo.cidade}
                {modelo.estado ? `, ${modelo.estado}` : ""}
              </span>
            )}
            {modelo.idade && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-full text-xs">
                <Calendar size={12} /> {modelo.idade} anos
              </span>
            )}
            {modelo.etnia && (
              <span className="px-3 py-1.5 bg-neutral-100 rounded-full text-xs">
                {modelo.etnia}
              </span>
            )}
          </div>

          {/* Measurements */}
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-muted mb-4">
              Medidas
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {MEDIDAS.map(({ key, label }) => {
                const value = (modelo as any)[key];
                if (!value) return null;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg"
                  >
                    <span className="text-xs text-muted">{label}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills & Languages */}
          {(modelo.habilidades?.length || modelo.idiomas?.length) ? (
            <div className="mb-8 space-y-4">
              {modelo.habilidades && modelo.habilidades.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-muted mb-2">
                    Habilidades
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {modelo.habilidades.map((h) => (
                      <span
                        key={h}
                        className="px-2.5 py-1 bg-neutral-100 rounded-full text-xs"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {modelo.idiomas && modelo.idiomas.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-muted mb-2">
                    Idiomas
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {modelo.idiomas.map((i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-neutral-100 rounded-full text-xs"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* CTA */}
          <button
            onClick={toggleSelection}
            className={`w-full flex items-center justify-center gap-2 py-4 text-sm rounded-xl transition-all ${
              isSelected
                ? "bg-foreground text-white"
                : "border-2 border-foreground text-foreground hover:bg-foreground hover:text-white"
            }`}
          >
            {isSelected ? (
              <>
                <Check size={16} /> Modelo na sua selecao
              </>
            ) : (
              <>
                <Plus size={16} /> Adicionar a selecao
              </>
            )}
          </button>
        </div>
      </div>

      {/* Book / Gallery */}
      {fotos.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-6">
            Book ({fotos.length} fotos)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {fotos.map((foto, i) => (
              <button
                key={foto.id}
                onClick={() => setLightbox(i)}
                className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={foto.url}
                  alt={`${modelo.nome} - ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl"
            onClick={() => setLightbox(null)}
          >
            &times;
          </button>
          <button
            className="absolute left-6 text-white/60 hover:text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lightbox - 1 + fotos.length) % fotos.length);
            }}
          >
            &lsaquo;
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fotos[lightbox].url}
              alt={`${modelo.nome} - ${lightbox + 1}`}
              width={1200}
              height={1600}
              className="object-contain w-full h-full max-h-[85vh]"
            />
          </div>
          <button
            className="absolute right-6 text-white/60 hover:text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lightbox + 1) % fotos.length);
            }}
          >
            &rsaquo;
          </button>
          <p className="absolute bottom-6 text-white/40 text-sm">
            {lightbox + 1} / {fotos.length}
          </p>
        </div>
      )}
    </div>
  );
}
