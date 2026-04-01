"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import type { Modelo, ModeloFoto, Categoria } from "@/types";

interface ModeloFormProps {
  modelo?: Modelo & { modelo_fotos?: ModeloFoto[] };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ModeloForm({ modelo }: ModeloFormProps) {
  const router = useRouter();
  const isEditing = !!modelo;

  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState(modelo?.nome ?? "");
  const [slug, setSlug] = useState(modelo?.slug ?? "");
  const [categoria, setCategoria] = useState<Categoria>(
    modelo?.categoria ?? "mulher"
  );
  const [altura, setAltura] = useState(modelo?.altura ?? "");
  const [manequim, setManequim] = useState(modelo?.manequim ?? "");
  const [busto, setBusto] = useState(modelo?.busto ?? "");
  const [cintura, setCintura] = useState(modelo?.cintura ?? "");
  const [quadril, setQuadril] = useState(modelo?.quadril ?? "");
  const [calcado, setCalcado] = useState(modelo?.calcado ?? "");
  const [olhos, setOlhos] = useState(modelo?.olhos ?? "");
  const [cabelo, setCabelo] = useState(modelo?.cabelo ?? "");
  const [instagram, setInstagram] = useState(modelo?.instagram ?? "");
  const [bio, setBio] = useState(modelo?.bio ?? "");
  const [ativo, setAtivo] = useState(modelo?.ativo ?? true);
  const [destaque, setDestaque] = useState(modelo?.destaque ?? false);
  const [fotoPrincipal, setFotoPrincipal] = useState(
    modelo?.foto_principal ?? ""
  );
  const [fotos, setFotos] = useState<ModeloFoto[]>(
    modelo?.modelo_fotos ?? []
  );
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingBook, setUploadingBook] = useState(false);

  function handleNomeChange(value: string) {
    setNome(value);
    if (!isEditing) {
      setSlug(slugify(value));
    }
  }

  async function uploadFile(file: File, path: string): Promise<string | null> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${path}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("modelos")
      .upload(fileName, file);

    if (error) return null;

    const {
      data: { publicUrl },
    } = supabase.storage.from("modelos").getPublicUrl(fileName);

    return publicUrl;
  }

  async function handleMainPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    const url = await uploadFile(file, `main/${slug || "temp"}`);
    if (url) setFotoPrincipal(url);
    setUploadingMain(false);
  }

  async function handleBookPhotosUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;
    if (!files) return;

    setUploadingBook(true);
    const newFotos: ModeloFoto[] = [];

    for (const file of Array.from(files)) {
      const url = await uploadFile(file, `book/${slug || "temp"}`);
      if (url) {
        newFotos.push({
          id: crypto.randomUUID(),
          modelo_id: modelo?.id ?? "",
          url,
          ordem: fotos.length + newFotos.length,
          tipo: "book",
          created_at: new Date().toISOString(),
        });
      }
    }

    setFotos([...fotos, ...newFotos]);
    setUploadingBook(false);
  }

  function removeBookPhoto(id: string) {
    setFotos(fotos.filter((f) => f.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const data = {
      nome,
      slug,
      categoria,
      foto_principal: fotoPrincipal || null,
      altura: altura || null,
      manequim: manequim || null,
      busto: busto || null,
      cintura: cintura || null,
      quadril: quadril || null,
      calcado: calcado || null,
      olhos: olhos || null,
      cabelo: cabelo || null,
      instagram: instagram || null,
      bio: bio || null,
      ativo,
      destaque,
    };

    if (isEditing) {
      await supabase.from("modelos").update(data).eq("id", modelo.id);

      // Sync book photos
      await supabase.from("modelo_fotos").delete().eq("modelo_id", modelo.id);
      if (fotos.length > 0) {
        await supabase.from("modelo_fotos").insert(
          fotos.map((f, i) => ({
            modelo_id: modelo.id,
            url: f.url,
            ordem: i,
            tipo: f.tipo,
          }))
        );
      }
    } else {
      const { data: newModelo } = await supabase
        .from("modelos")
        .insert(data)
        .select("id")
        .single();

      if (newModelo && fotos.length > 0) {
        await supabase.from("modelo_fotos").insert(
          fotos.map((f, i) => ({
            modelo_id: newModelo.id,
            url: f.url,
            ordem: i,
            tipo: f.tipo,
          }))
        );
      }
    }

    setLoading(false);
    router.push("/admin/modelos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4">
          Informações Básicas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Nome *</label>
            <input
              value={nome}
              onChange={(e) => handleNomeChange(e.target.value)}
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
            <label className="block text-xs text-muted mb-1">Categoria *</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              className="w-full border border-border px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground"
            >
              <option value="homem">Homem</option>
              <option value="mulher">Mulher</option>
              <option value="nao_binario">Não Binário</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Instagram</label>
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full border border-border px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-foreground"
              placeholder="@usuario"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
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

      {/* Measurements */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4">
          Medidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Altura", value: altura, set: setAltura, placeholder: "1.75m" },
            { label: "Manequim", value: manequim, set: setManequim, placeholder: "38" },
            { label: "Busto", value: busto, set: setBusto, placeholder: "88cm" },
            { label: "Cintura", value: cintura, set: setCintura, placeholder: "62cm" },
            { label: "Quadril", value: quadril, set: setQuadril, placeholder: "90cm" },
            { label: "Calçado", value: calcado, set: setCalcado, placeholder: "38" },
            { label: "Olhos", value: olhos, set: setOlhos, placeholder: "Castanhos" },
            { label: "Cabelo", value: cabelo, set: setCabelo, placeholder: "Preto" },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs text-muted mb-1">
                {field.label}
              </label>
              <input
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                placeholder={field.placeholder}
                className="w-full border border-border px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Photo */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4">
          Foto Principal
        </h2>
        <div className="flex items-start gap-6">
          {fotoPrincipal && (
            <div className="relative w-32 aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden shrink-0">
              <Image
                src={fotoPrincipal}
                alt="Foto principal"
                fill
                className="object-cover"
                sizes="128px"
              />
              <button
                type="button"
                onClick={() => setFotoPrincipal("")}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm cursor-pointer hover:bg-neutral-50 transition-colors">
            <Upload size={16} />
            {uploadingMain ? "Enviando..." : "Upload"}
            <input
              type="file"
              accept="image/*"
              onChange={handleMainPhotoUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Book Photos */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4">
          Book ({fotos.length} fotos)
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
          {fotos.map((foto) => (
            <div
              key={foto.id}
              className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden"
            >
              <Image
                src={foto.url}
                alt="Book"
                fill
                className="object-cover"
                sizes="150px"
              />
              <button
                type="button"
                onClick={() => removeBookPhoto(foto.id)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm cursor-pointer hover:bg-neutral-50 transition-colors">
          <Upload size={16} />
          {uploadingBook ? "Enviando..." : "Adicionar fotos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleBookPhotosUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-white text-sm rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
      >
        <Save size={16} />
        {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar modelo"}
      </button>
    </form>
  );
}
