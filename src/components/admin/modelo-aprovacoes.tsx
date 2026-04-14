"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, X, Award, Upload, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ModeloAprovacao {
  id: string;
  marca_nome: string;
  marca_logo: string | null;
}

interface ModeloAprovacoesProps {
  modeloId: string;
  aprovacoes: ModeloAprovacao[];
}

export function ModeloAprovacoes({ modeloId, aprovacoes: initial }: ModeloAprovacoesProps) {
  const [aprovacoes, setAprovacoes] = useState(initial);
  const [novaMarca, setNovaMarca] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const updateFileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function clearLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function uploadLogo(file: File): Promise<string | null> {
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "png";
    const fileName = `marcas-logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("modelos").upload(fileName, file);
    if (error) return null;
    const { data } = supabase.storage.from("modelos").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function addAprovacao() {
    if (!novaMarca.trim()) return;
    setAdding(true);
    const supabase = createClient();

    let logoUrl: string | null = null;
    if (logoFile) {
      logoUrl = await uploadLogo(logoFile);
    }

    const { data } = await supabase
      .from("modelo_aprovacoes")
      .insert({ modelo_id: modeloId, marca_nome: novaMarca.trim(), marca_logo: logoUrl })
      .select("id, marca_nome, marca_logo")
      .single();

    if (data) {
      setAprovacoes([...aprovacoes, data]);
      setNovaMarca("");
      clearLogo();
    }
    setAdding(false);
    router.refresh();
  }

  async function updateLogo(id: string, file: File) {
    setUpdatingId(id);
    const logoUrl = await uploadLogo(file);
    if (logoUrl) {
      const supabase = createClient();
      await supabase.from("modelo_aprovacoes").update({ marca_logo: logoUrl }).eq("id", id);
      setAprovacoes(aprovacoes.map((a) => (a.id === id ? { ...a, marca_logo: logoUrl } : a)));
    }
    setUpdatingId(null);
    router.refresh();
  }

  async function removeAprovacao(id: string) {
    if (!confirm("Remover esta aprovação?")) return;
    const supabase = createClient();
    await supabase.from("modelo_aprovacoes").delete().eq("id", id);
    setAprovacoes(aprovacoes.filter((a) => a.id !== id));
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
        <Award size={16} />
        Aprovações / Selos de Marca ({aprovacoes.length})
      </h2>

      {/* Current aprovacoes */}
      <div className="space-y-2 mb-6">
        {aprovacoes.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl"
          >
            {/* Logo ou placeholder */}
            {a.marca_logo ? (
              <div className="relative h-8 w-16 shrink-0">
                <Image src={a.marca_logo} alt={a.marca_nome} fill className="object-contain" />
              </div>
            ) : (
              <Award size={16} className="text-green-600 shrink-0" />
            )}

            {/* Nome */}
            <span className="text-sm text-green-800 font-medium flex-1">{a.marca_nome}</span>

            {/* Upload/trocar logo */}
            <label className="cursor-pointer flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">
              <Upload size={12} />
              {a.marca_logo ? "Trocar" : "Logo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateLogo(a.id, file);
                }}
              />
            </label>

            {/* Loading indicator */}
            {updatingId === a.id && (
              <span className="text-[10px] text-green-500 animate-pulse">Salvando...</span>
            )}

            {/* Remove */}
            <button
              onClick={() => removeAprovacao(a.id)}
              className="text-green-400 hover:text-red-500 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {aprovacoes.length === 0 && (
          <p className="text-xs text-muted py-2">Nenhum selo de marca adicionado.</p>
        )}
      </div>

      {/* Add new */}
      <div className="space-y-3 pt-4 border-t border-border">
        <p className="text-[10px] uppercase tracking-wider text-muted">Adicionar nova aprovação</p>
        <div className="flex gap-2">
          <input
            value={novaMarca}
            onChange={(e) => setNovaMarca(e.target.value)}
            placeholder="Nome da marca (ex: PomPom, Brandili...)"
            className="flex-1 border border-border px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
            onKeyDown={(e) => e.key === "Enter" && addAprovacao()}
          />
          <button
            onClick={addAprovacao}
            disabled={adding || !novaMarca.trim()}
            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Plus size={14} />
            Adicionar
          </button>
        </div>

        {/* Logo for new */}
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted hover:text-foreground hover:border-foreground transition-colors"
          >
            <Upload size={12} />
            {logoFile ? "Trocar logo" : "Logo da marca (PNG)"}
          </button>
          {logoPreview && (
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-16 bg-neutral-50 rounded border border-border overflow-hidden">
                <Image src={logoPreview} alt="Preview" fill className="object-contain p-0.5" />
              </div>
              <button onClick={clearLogo} className="text-muted hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          )}
          {!logoFile && (
            <span className="text-[10px] text-muted">Opcional — aparece no site</span>
          )}
        </div>
      </div>
    </div>
  );
}
