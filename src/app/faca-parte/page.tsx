"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, CheckCircle } from "lucide-react";

export default function FacaPartePage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const candidatura = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      telefone: formData.get("telefone") as string,
      idade: formData.get("idade") ? Number(formData.get("idade")) : null,
      altura: formData.get("altura") as string,
      cidade: formData.get("cidade") as string,
      instagram: formData.get("instagram") as string,
      mensagem: formData.get("mensagem") as string,
      fotos: [],
      status: "pendente" as const,
    };

    const supabase = createClient();
    const { error } = await supabase.from("candidaturas").insert(candidatura);

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
        Faça Parte
      </h1>
      <p className="text-muted mb-12">
        Preencha o formulário abaixo para se candidatar ao nosso casting.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              Idade
            </label>
            <input
              name="idade"
              type="number"
              min={14}
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
              placeholder="São Paulo, SP"
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
            placeholder="Conte um pouco sobre você e sua experiência..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-white text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          <Send size={16} />
          {loading ? "Enviando..." : "Enviar candidatura"}
        </button>
      </form>
    </div>
  );
}
