"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, Plus, Check, X } from "lucide-react";
import { CATEGORIAS, CORES_OLHOS, CORES_CABELO, ETNIAS, categoriaLabel } from "@/types";
import type { Modelo, Categoria } from "@/types";

interface Filters {
  search: string;
  categorias: string[];
  olhos: string[];
  cabelo: string[];
  etnia: string[];
  alturaMin: string;
  alturaMax: string;
}

const emptyFilters: Filters = {
  search: "",
  categorias: [],
  olhos: [],
  cabelo: [],
  etnia: [],
  alturaMin: "",
  alturaMax: "",
};

export default function MarcasModelosPage() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [selecaoId, setSelecaoId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const supabase = createClient();

  const fetchModelos = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("modelos").select("*").eq("ativo", true).order("ordem");

    if (filters.search) {
      query = query.ilike("nome", `%${filters.search}%`);
    }
    if (filters.categorias.length > 0) {
      query = query.in("categoria", filters.categorias);
    }
    if (filters.olhos.length > 0) {
      query = query.in("olhos", filters.olhos);
    }
    if (filters.cabelo.length > 0) {
      query = query.in("cabelo", filters.cabelo);
    }
    if (filters.etnia.length > 0) {
      query = query.in("etnia", filters.etnia);
    }
    if (filters.alturaMin) {
      query = query.gte("altura_cm", parseInt(filters.alturaMin));
    }
    if (filters.alturaMax) {
      query = query.lte("altura_cm", parseInt(filters.alturaMax));
    }

    const { data } = await query.limit(50);
    setModelos(data ?? []);
    setLoading(false);
  }, [filters]);

  // Load active draft selection
  useEffect(() => {
    async function loadDraft() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: marca } = await supabase.from("marcas").select("id").eq("user_id", user.id).single();
      if (!marca) return;

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
        const ids = new Set((draft.selecao_modelos as any[]).map((sm: any) => sm.modelo_id));
        setSelectedIds(ids);
      }
    }
    loadDraft();
  }, []);

  useEffect(() => {
    fetchModelos();
  }, [fetchModelos]);

  async function toggleModel(modeloId: string) {
    let sid = selecaoId;

    // Create draft selection if none exists
    if (!sid) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: marca } = await supabase.from("marcas").select("id").eq("user_id", user.id).single();
      if (!marca) return;

      const { data: newSel } = await supabase
        .from("selecoes")
        .insert({ marca_id: marca.id, nome: "Nova Selecao", status: "rascunho" })
        .select("id")
        .single();
      if (!newSel) return;
      sid = newSel.id;
      setSelecaoId(sid);
    }

    if (selectedIds.has(modeloId)) {
      await supabase.from("selecao_modelos").delete().eq("selecao_id", sid).eq("modelo_id", modeloId);
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(modeloId); return n; });
    } else {
      await supabase.from("selecao_modelos").insert({ selecao_id: sid, modelo_id: modeloId });
      setSelectedIds((prev) => new Set(prev).add(modeloId));
    }
  }

  function toggleFilter(key: keyof Pick<Filters, "categorias" | "olhos" | "cabelo" | "etnia">, value: string) {
    setFilters((prev) => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  }

  const activeFilterCount = filters.categorias.length + filters.olhos.length + filters.cabelo.length + filters.etnia.length + (filters.alturaMin ? 1 : 0) + (filters.alturaMax ? 1 : 0);

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-1">Buscar</p>
          <h1 className="text-2xl font-light tracking-tight">Modelos</h1>
        </div>
        {selectedIds.size > 0 && (
          <Link
            href={`/marcas/selecoes/${selecaoId}`}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-white text-xs rounded-lg"
          >
            <Check size={14} />
            {selectedIds.size} selecionado{selectedIds.size > 1 ? "s" : ""}
          </Link>
        )}
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Buscar por nome..."
            className="w-full border border-border pl-10 pr-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm transition-colors ${
            showFilters || activeFilterCount > 0 ? "border-foreground bg-foreground text-white" : "border-border text-muted hover:border-foreground"
          }`}
        >
          <Filter size={14} />
          Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-neutral-50 border border-border rounded-xl p-6 mb-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest text-muted">Filtros</h3>
            <button onClick={() => setFilters(emptyFilters)} className="text-xs text-muted hover:text-foreground underline">Limpar</button>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs text-muted mb-2">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((c) => (
                <button key={c.value} onClick={() => toggleFilter("categorias", c.value)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.categorias.includes(c.value) ? "bg-foreground text-white border-foreground" : "border-border text-muted hover:border-foreground"
                  }`}>{c.label}</button>
              ))}
            </div>
          </div>

          {/* Altura range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-2">Altura min (cm)</label>
              <input value={filters.alturaMin} onChange={(e) => setFilters({ ...filters, alturaMin: e.target.value })}
                type="number" placeholder="150" className="w-full border border-border px-3 py-2 text-sm rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-2">Altura max (cm)</label>
              <input value={filters.alturaMax} onChange={(e) => setFilters({ ...filters, alturaMax: e.target.value })}
                type="number" placeholder="195" className="w-full border border-border px-3 py-2 text-sm rounded-lg" />
            </div>
          </div>

          {/* Olhos */}
          <div>
            <label className="block text-xs text-muted mb-2">Cor dos olhos</label>
            <div className="flex flex-wrap gap-2">
              {CORES_OLHOS.map((o) => (
                <button key={o} onClick={() => toggleFilter("olhos", o)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.olhos.includes(o) ? "bg-foreground text-white border-foreground" : "border-border text-muted hover:border-foreground"
                  }`}>{o}</button>
              ))}
            </div>
          </div>

          {/* Cabelo */}
          <div>
            <label className="block text-xs text-muted mb-2">Cor do cabelo</label>
            <div className="flex flex-wrap gap-2">
              {CORES_CABELO.map((c) => (
                <button key={c} onClick={() => toggleFilter("cabelo", c)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.cabelo.includes(c) ? "bg-foreground text-white border-foreground" : "border-border text-muted hover:border-foreground"
                  }`}>{c}</button>
              ))}
            </div>
          </div>

          {/* Etnia */}
          <div>
            <label className="block text-xs text-muted mb-2">Etnia</label>
            <div className="flex flex-wrap gap-2">
              {ETNIAS.map((e) => (
                <button key={e} onClick={() => toggleFilter("etnia", e)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.etnia.includes(e) ? "bg-foreground text-white border-foreground" : "border-border text-muted hover:border-foreground"
                  }`}>{e}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-20 text-muted text-sm">Carregando...</div>
      ) : modelos.length === 0 ? (
        <div className="text-center py-20 text-muted text-sm">Nenhum modelo encontrado.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {modelos.map((m) => {
            const isSelected = selectedIds.has(m.id);
            return (
              <div key={m.id} className="group relative">
                <Link href={`/marcas/modelos/${m.id}`}>
                  <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-lg">
                    {m.foto_principal ? (
                      <Image src={m.foto_principal} alt={m.nome} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-3xl text-neutral-300">{m.nome.charAt(0)}</div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-xs">{m.nome}</p>
                      <p className="text-white/50 text-[10px]">{m.altura} {m.cidade && `· ${m.cidade}`}</p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => toggleModel(m.id)}
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                    isSelected ? "bg-foreground text-white" : "bg-white/80 text-muted hover:bg-foreground hover:text-white"
                  }`}
                >
                  {isSelected ? <Check size={14} /> : <Plus size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
