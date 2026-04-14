"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, AtSign, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function ContatoPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const contato = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      telefone: formData.get("telefone") as string,
      assunto: formData.get("assunto") as string,
      mensagem: formData.get("mensagem") as string,
    };

    const supabase = createClient();
    const { error } = await supabase.from("contatos").insert(contato);

    setLoading(false);
    if (!error) {
      setSent(true);
      form.reset();
    }
  }

  if (sent) {
    return (
      <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle size={40} className="mx-auto text-foreground mb-6" strokeWidth={1} />
          <h1 className="font-display text-3xl md:text-4xl font-normal tracking-tight mb-4">
            Mensagem enviada
          </h1>
          <p className="text-sm text-muted leading-relaxed mb-8">
            Recebemos sua mensagem e responderemos em breve.
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
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
              Fale conosco
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-normal tracking-tight mb-6">
              Contato
            </h1>
            <p className="text-sm text-muted leading-relaxed mb-10">
              Entre em contato para saber mais sobre nossos servicos, agendar
              reunioes ou tirar duvidas sobre o casting. Estamos prontos para
              atende-lo.
            </p>

            <div className="space-y-4">
              <a
                href="https://instagram.com/hlmodels"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-foreground transition-colors group"
              >
                <AtSign size={16} className="text-muted group-hover:text-foreground transition-colors" />
                <span className="text-muted group-hover:text-foreground transition-colors">@hlmodels</span>
              </a>
              <a
                href="tel:+5511953506752"
                className="flex items-center gap-3 text-sm hover:text-foreground transition-colors group"
              >
                <Phone size={16} className="text-muted group-hover:text-foreground transition-colors" />
                <span className="text-muted group-hover:text-foreground transition-colors">(11) 95350-6752</span>
              </a>
              <a
                href="mailto:hlmodels@outlook.com"
                className="flex items-center gap-3 text-sm hover:text-foreground transition-colors group"
              >
                <Mail size={16} className="text-muted group-hover:text-foreground transition-colors" />
                <span className="text-muted group-hover:text-foreground transition-colors">hlmodels@outlook.com</span>
              </a>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-muted mt-0.5 shrink-0" />
                <span className="text-muted">
                  Rua dos Cajueiros, 12 - Parque Terra Nova - Sao Bernardo do Campo/SP
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                  Nome *
                </label>
                <input
                  name="nome"
                  required
                  className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/40"
                  placeholder="Seu nome"
                />
              </div>

              {/* Email */}
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

              {/* Telefone */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                  Telefone
                </label>
                <input
                  name="telefone"
                  className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/40"
                  placeholder="(11) 95350-6752"
                />
              </div>

              {/* Assunto */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                  Assunto
                </label>
                <input
                  name="assunto"
                  className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/40"
                  placeholder="Assunto da mensagem"
                />
              </div>

              {/* Mensagem */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                  Mensagem *
                </label>
                <textarea
                  name="mensagem"
                  required
                  className="w-full border-b border-border bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors min-h-[120px] resize-none placeholder:text-muted/40"
                  placeholder="Sua mensagem..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-foreground text-white text-[11px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Enviar mensagem"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
