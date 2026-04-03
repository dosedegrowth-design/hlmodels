"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import type { Projeto, ProjetoFoto, Modelo } from "@/types";

interface ProjetoFormProps {
  projeto?: Projeto & { projeto_fotos?: ProjetoFoto[]; projeto_modelos?: any[] };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjetoForm({ projeto }: ProjetoFormProps) {
  const router = useRouter();
  const isEditing = !!projeto;

  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState(projeto?.titulo ?? "");
  const [slug, setSlug] = useState(projeto?.slug ?? "");
  const [descricao, setDescricao] = useState(projeto?.descricao ?? "");
  const [videoUrl, setVideoUrl] = useState(projeto?.video_url ?? "");
  const [marcaParceira, setMarcaParceira] = useState(projeto?.marca_parceira ?? "");
  const [ativo, setAtivo] = useState(projeto?.ativo ?? true);
  const [destaque, setDestaque] = useState(projeto?.destaque ?? false);
  const [fotoCapa, setFotoCapa] = useState(projeto?.foto_capa ?? "");
  const [fotos, setFotos] = useState<ProjetoFoto[]>(projeto?.projeto_fotos ?? []);
  const [uploadingCapa, setUploadingCapa] = useState(false);
  const [uploadingGaleria, setUploadingGaleria] = useState(false);

  const [allModelos, setAllModelos] = useState<Modelo[]>([]);
  const [selectedModeloIds, setSelectedModeloIds] = useState<Set<string>>(
    new Set((projeto?.projeto_modelos ?? []).map((pm: any) => pm.modelo_id))
  );

  useEffect(() => {
    async function loadModelos() {
      const supabase = createClient();
      const { data } = await supabase
        .from("modelos")
        .select("id, nome, foto_principal")
        .eq("ativo", true)
        .order("nome");
      setAllModelos((data as Modelo[]) ?? []);
    }
    loadModelos();
  }, []);

  function handleTituloChange(value: string) {
    setTitulo(value);
    if (!isEditing) setSlug(slugify(value));
  }

  async function uploadFile(file: File, path: string): Promise<string | null> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${path}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("modelos").upload(fileName, file);
    if (error) return null;
    const {
      data: { publicUrl },
    } = supabase.storage.from("modelos").getPublicUrl(fileName);
    return publicUrl;
  }

  async function handleCapaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCapa(true);
    const url = await uploadFile(file, `projetos/${slug || "temp"}/capa`);
    if (url) setFotoCapa(url);
    setUploadingCapa(false);
  }

  async function handleGaleriaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploadingGaleria(true);
    const newFotos: ProjetoFoto[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, `projetos/${slug || "temp"}/galeria`);
      if (url) {
        newFotos.push({
          id: crypto.randomUUID(),
          projeto_id: projeto?.id ?? "",
          url,
          ordem: fotos.length + newFotos.length,
          created_at: new Date().toISOString(),
        });
      }
    }
    setFotos([...fotos, ...newFotos]);
    setUploadingGaleria(false);
  }

  function toggleModelo(id: string) {
    setSelectedModeloIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const data = {
      titulo,
      slug,
      descricao: descricao || null,
      foto_capa: fotoCapa || null,
      video_url: videoUrl || null,
      marca_parceira: marcaParceira || null,
      ativo,
      destaque,
    };

    if (isEditing) {
      await supabase.from("projetos").update(data).eq("id", projeto.id);
      await supabase.from("projeto_fotos").delete().eq("projeto_id", projeto.id);
      if (fotos.length > 0) {
        await supabase.from("projeto_fotos").insert(
          fotos.map((f, i) => ({ projeto_id: projeto.id, url: f.url, ordem: i }))
        );
      }
      await supabase.from("projeto_modelos").delete().eq("projeto_id", projeto.id);
      if (selectedModeloIds.size > 0) {
        await supabase.from("projeto_modelos").insert(
          Array.from(selectedModeloIds).map((mid) => ({
            projeto_id: projeto.id,
            modelo_id: mid,
          }))
        );
      }
    } else {
      const { data: newProjeto } = await supabase
        .from("projetos")
        .insert(data)
        .select("id")
        .single();
      if (newProjeto) {
        if (fotos.length > 0) {
          await supabase.from("projeto_fotos").insert(
            fotos.map((f, i) => ({ projeto_id: newProjeto.id, url: f.url, ordem: i }))
          );
        }
        if (selectedModeloIds.size > 0) {
          await supabase.from("projeto_modelos").insert(
            Array.from(selectedModeloIds).map((mid) => ({
              projeto_id: newProjeto.id,
              modelo_id: mid,
            }))
          );
        }
      }
    }

    setLoading(false);
    router.push("/admin/projetos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4">
          Informacoes Basicas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Titulo *</label>
            <input
              value={titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              required
              className="w-full border border-border px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Slug *</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full border border-border px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Marca parceira</label>
            <input
              value={marcaParceira}
              onChange={(e) => setMarcaParceira(e.target.value)}
              placeholder="Nome da marca"
              className="w-full border border-border px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">
              Video (YouTube/Vimeo URL)
            </label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full border border-border px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Descricao</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="w-full border border-border px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground resize-none"
          />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="w-4 h-4"
            />
            Ativo
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
              className="w-4 h-4"
            />
            Destaque
          </label>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4">
          Foto de Capa
        </h2>
        <div className="flex items-start gap-6">
          {fotoCapa && (
            <div className="relative w-40 aspect-video bg-neutral-100 rounded-lg overflow-hidden shrink-0">
              <Image src={fotoCapa} alt="Capa" fill className="object-cover" sizes="160px" />
              <button
                type="button"
                onClick={() => setFotoCapa("")}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm cursor-pointer hover:bg-neutral-50 transition-colors">
            <Upload size={16} />
            {uploadingCapa ? "Enviando..." : "Upload capa"}
            <input type="file" accept="image/*" onChange={handleCapaUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4">
          Galeria ({fotos.length} fotos)
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
          {fotos.map((foto) => (
            <div
              key={foto.id}
              className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden"
            >
              <Image src={foto.url} alt="Galeria" fill className="object-cover" sizes="150px" />
              <button
                type="button"
                onClick={() => setFotos(fotos.filter((f) => f.id !== foto.id))}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm cursor-pointer hover:bg-neutral-50 transition-colors">
          <Upload size={16} />
          {uploadingGaleria ? "Enviando..." : "Adicionar fotos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGaleriaUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Models */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4">
          Modelos participantes ({selectedModeloIds.size})
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {allModelos.map((m) => {
            const selected = selectedModeloIds.has(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleModelo(m.id)}
                className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-colors ${
                  selected
                    ? "border-foreground"
                    : "border-transparent hover:border-neutral-300"
                }`}
              >
                {m.foto_principal ? (
                  <Image
                    src={m.foto_principal}
                    alt={m.nome}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-neutral-100 text-lg text-neutral-400">
                    {m.nome.charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[10px] text-white truncate">{m.nome}</p>
                </div>
                {selected && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">&#10003;</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-white text-sm rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
      >
        <Save size={16} />
        {loading ? "Salvando..." : isEditing ? "Salvar alteracoes" : "Criar projeto"}
      </button>
    </form>
  );
}
