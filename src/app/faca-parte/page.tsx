"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, CheckCircle, Upload, X, Camera } from "lucide-react";
import Image from "next/image";

export default function FacaPartePage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [fotos, setFotos] = useState<{ file: File; preview: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function addFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const newFotos = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFotos((prev) => [...prev, ...newFotos].slice(0, 5));
    e.target.value = "";
  }

  function removeFoto(index: number) {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const supabase = createClient();

    // Upload photos
    const fotoUrls: string[] = [];
    for (const foto of fotos) {
      const ext = foto.file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("candidaturas")
        .upload(fileName, foto.file);
      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from("candidaturas")
          .getPublicUrl(fileName);
        fotoUrls.push(publicUrl);
      }
    }

    const candidatura = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      telefone: (formData.get("telefone") as string) || null,
      idade: formData.get("idade") ? Number(formData.get("idade")) : null,
      altura: (formData.get("altura") as string) || null,
      cidade: (formData.get("cidade") as string) || null,
      instagram: (formData.get("instagram") as string) || null,
      mensagem: (formData.get("mensagem") as string) || null,
      fotos: fotoUrls,
      status: "pendente" as const,
    };

    const { error } = await supabase.from("candidaturas").insert(candidatura);

    setLoading(false);
    if (!error) {
      setSent(true);
      form.reset();
      setFotos([]);
    }
  }

  if (sent) {
    return (
      <div className="pt-28 pb-20 px-6 max-w-2xl mx-auto text-center">
        <CheckCircle size={48} className="mx-auto text-green-600 mb-6" />
        <h1 className="text-3xl font-light tracking-tight mb-4">
          Candidatura enviada!
        </h1>
        <p className="text-muted">
          Recebemos sua candidatura e entraremos em contato em breve. Obrigado
          pelo interesse!
        </p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-6 max-w-2xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
        Faca Parte
      </h1>
      <p className="text-muted mb-12">
        Preencha o formulario abaixo para se candidatar ao nosso casting.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo upload section */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-3">
            Suas fotos (ate 5) *
          </label>
          <p className="text-xs text-muted mb-4">
            Envie fotos de rosto (frente e perfil) e corpo inteiro. Fotos naturais, sem filtros.
          </p>
          <div className="flex flex-wrap gap-3">
            {fotos.map((foto, i) => (
              <div
                key={i}
                className="relative w-24 h-32 rounded-lg overflow-hidden bg-neutral-100"
              >
                <Image
                  src={foto.preview}
                  alt={`Foto ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                <button
                  type="button"
                  onClick={() => removeFoto(i)}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {fotos.length < 5 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-24 h-32 rounded-lg border-2 border-dashed border-border hover:border-foreground flex flex-col items-center justify-center gap-1 transition-colors text-muted hover:text-foreground"
              >
                <Camera size={20} />
                <span className="text-[10px]">Adicionar</span>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={addFotos}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Nome completo *
            </label>
            <input
              name="nome"
              required
              className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Email *
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Telefone / WhatsApp
            </label>
            <input
              name="telefone"
              className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              placeholder="(11) 99999-9999"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Idade
            </label>
            <input
              name="idade"
              type="number"
              min={1}
              max={99}
              className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              placeholder="25"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Altura
            </label>
            <input
              name="altura"
              className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              placeholder="1.75m"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Cidade
            </label>
            <input
              name="cidade"
              className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              placeholder="Sao Paulo, SP"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">
            Instagram
          </label>
          <input
            name="instagram"
            className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            placeholder="@seuinstagram"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">
            Mensagem
          </label>
          <textarea
            name="mensagem"
            rows={4}
            className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
            placeholder="Conte um pouco sobre voce e sua experiencia..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || fotos.length === 0}
          className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-white text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          <Send size={16} />
          {loading ? "Enviando..." : "Enviar candidatura"}
        </button>
        {fotos.length === 0 && (
          <p className="text-xs text-red-500">Adicione pelo menos 1 foto para enviar.</p>
        )}
      </form>
    </div>
  );
}
