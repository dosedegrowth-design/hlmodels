"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, CheckCircle, AtSign, Phone, Mail, MapPin } from "lucide-react";

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
      <div className="pt-28 pb-20 px-6 max-w-2xl mx-auto text-center">
        <CheckCircle size={48} className="mx-auto text-green-600 mb-6" />
        <h1 className="text-3xl font-light tracking-tight mb-4">
          Mensagem enviada!
        </h1>
        <p className="text-muted">
          Recebemos sua mensagem e responderemos em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12">
        Contato
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">
                Nome *
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
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Telefone
            </label>
            <input
              name="telefone"
              className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Assunto
            </label>
            <input
              name="assunto"
              className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              placeholder="Assunto da mensagem"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">
              Mensagem *
            </label>
            <textarea
              name="mensagem"
              required
              rows={5}
              className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
              placeholder="Sua mensagem..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-white text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted mb-4">
              Informações
            </h2>
            <div className="space-y-4">
              <a
                href="https://instagram.com/hlmodels"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-foreground transition-colors"
              >
                <AtSign size={18} className="text-muted" />
                @hlmodels
              </a>
              <a
                href="tel:+5511999999999"
                className="flex items-center gap-3 text-sm hover:text-foreground transition-colors"
              >
                <Phone size={18} className="text-muted" />
                (11) 99999-9999
              </a>
              <a
                href="mailto:contato@hlmodels.com.br"
                className="flex items-center gap-3 text-sm hover:text-foreground transition-colors"
              >
                <Mail size={18} className="text-muted" />
                contato@hlmodels.com.br
              </a>
              <p className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-muted mt-0.5 shrink-0" />
                São Paulo, SP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
