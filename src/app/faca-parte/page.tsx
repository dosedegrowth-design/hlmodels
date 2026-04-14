"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, Camera, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/public/scroll-animations";

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
      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle size={40} className="mx-auto text-foreground mb-6" strokeWidth={1} />
          <h1 className="font-display text-3xl md:text-4xl font-normal tracking-tight mb-4">
            Candidatura enviada
          </h1>
          <p className="text-sm text-muted leading-relaxed mb-8">
            Recebemos sua candidatura e entraremos em contato em breve. Obrigado pelo interesse!
          </p>
          <Link
            href="/"
            className="inline-block text-[11px] uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:opacity-70 transition-opacity"
          >
            Voltar ao inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT — Info Section */}
          <div className="lg:pt-4">
            <ScrollReveal>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
                Casting aberto
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-normal tracking-tight mb-6">
                Faca Parte
              </h1>
              <p className="text-sm text-muted leading-relaxed mb-8">
                Estamos sempre em busca de novos talentos para integrar nosso casting.
                Se voce tem interesse em trabalhar como modelo, preencha o formulario
                ao lado com seus dados e fotos.
              </p>
            </ScrollReveal>

            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
                Requisitos para as fotos
              </p>
              <div className="space-y-3">
                <p className="text-sm text-muted">
                  <span className="inline-block w-4 text-muted/40">&mdash;</span>{" "}
                  Fotos naturais, sem filtros ou edicao
                </p>
                <p className="text-sm text-muted">
                  <span className="inline-block w-4 text-muted/40">&mdash;</span>{" "}
                  Rosto de frente e perfil
                </p>
                <p className="text-sm text-muted">
                  <span className="inline-block w-4 text-muted/40">&mdash;</span>{" "}
                  Corpo inteiro, roupas neutras
                </p>
                <p className="text-sm text-muted">
                  <span className="inline-block w-4 text-muted/40">&mdash;</span>{" "}
                  Boa iluminacao, fundo limpo
                </p>
                <p className="text-sm text-muted">
                  <span className="inline-block w-4 text-muted/40">&mdash;</span>{" "}
                  Ate 5 fotos por candidatura
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
                Duvidas?
              </p>
              <p className="text-sm text-muted">
                hlmodels@outlook.com
              </p>
              <p className="text-sm text-muted">
                (11) 95350-6752
              </p>
            </div>
          </div>

          {/* RIGHT — Form */}
          <ScrollReveal delay={0.1}>
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo upload */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                  Suas fotos *
                </label>
                <div
                  className="border border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-foreground/30 transition-colors"
                  onClick={() => fotos.length < 5 && fileRef.current?.click()}
                >
                  {fotos.length === 0 ? (
                    <div>
                      <Camera size={24} className="mx-auto text-muted mb-3" strokeWidth={1} />
                      <p className="text-sm text-muted mb-1">
                        Clique para adicionar fotos
                      </p>
                      <p className="text-[10px] text-muted/60">
                        Maximo 5 fotos
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap gap-3 justify-center mb-4">
                        {fotos.map((foto, i) => (
                          <div
                            key={i}
                            className="relative w-20 h-28 rounded overflow-hidden bg-neutral-100"
                          >
                            <Image
                              src={foto.preview}
                              alt={`Foto ${i + 1}`}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                            <button
                              type="button"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                removeFoto(i);
                              }}
                              className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white hover:bg-black/80"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                      {fotos.length < 5 && (
                        <p className="text-[10px] text-muted/60">
                          {fotos.length}/5 fotos &mdash; clique para adicionar mais
                        </p>
                      )}
                      {fotos.length >= 5 && (
                        <p className="text-[10px] text-muted/60">
                          5/5 fotos (maximo atingido)
                        </p>
                      )}
                    </div>
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

              {/* Nome */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                  Nome completo *
                </label>
                <input
                  name="nome"
                  required
                  className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/40"
                  placeholder="Seu nome completo"
                />
              </div>

              {/* Email & Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/40"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                    Telefone / WhatsApp
                  </label>
                  <input
                    name="telefone"
                    className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/40"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* Idade & Altura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                    Idade
                  </label>
                  <input
                    name="idade"
                    type="number"
                    min={1}
                    max={99}
                    className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/40"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                    Altura
                  </label>
                  <input
                    name="altura"
                    className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/40"
                    placeholder="1.75m"
                  />
                </div>
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                  Cidade
                </label>
                <input
                  name="cidade"
                  className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/40"
                  placeholder="Sao Paulo, SP"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                  Instagram
                </label>
                <input
                  name="instagram"
                  className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/40"
                  placeholder="@seuinstagram"
                />
              </div>

              {/* Mensagem */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                  Mensagem
                </label>
                <textarea
                  name="mensagem"
                  rows={4}
                  className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none placeholder:text-muted/40"
                  placeholder="Conte um pouco sobre voce e sua experiencia..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || fotos.length === 0}
                className="w-full py-4 bg-foreground text-white text-[11px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Enviar candidatura"}
              </button>

              {fotos.length === 0 && (
                <p className="text-sm text-red-600 text-center">
                  Adicione pelo menos 1 foto para enviar.
                </p>
              )}
            </form>
          </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
