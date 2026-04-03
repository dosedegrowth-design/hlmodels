"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SEGMENTOS_MARCA } from "@/types";

export default function MarcasRegistroPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const confirmPassword = fd.get("confirm_password") as string;

    if (password !== confirmPassword) {
      setError("As senhas nao coincidem.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: fd.get("nome_contato") as string } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { error: marcaError } = await supabase.from("marcas").insert({
        user_id: authData.user.id,
        nome_empresa: fd.get("nome_empresa") as string,
        cnpj: (fd.get("cnpj") as string) || null,
        nome_contato: fd.get("nome_contato") as string,
        email,
        telefone: (fd.get("telefone") as string) || null,
        segmento: (fd.get("segmento") as string) || null,
        site: (fd.get("site") as string) || null,
      });

      if (marcaError) {
        setError("Erro ao criar cadastro. Tente novamente.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/marcas/aguardando");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.06)_0%,_transparent_70%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="text-white text-xl font-bold tracking-[0.2em] uppercase">
            HL Models
          </Link>
          <div>
            <h2 className="text-white text-4xl font-light tracking-tight leading-tight mb-4">
              Cadastre sua<br />marca
            </h2>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Crie sua conta para acessar nosso banco de modelos, montar selecoes personalizadas e solicitar orcamentos para suas campanhas.
            </p>
          </div>
          <div className="space-y-3">
            {["Acesso ao banco completo de modelos", "Filtros avancados por caracteristicas", "Selecoes e orcamentos online"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-white/30 text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="text-xl font-bold tracking-[0.2em] uppercase">HL Models</Link>
            <p className="text-xs text-muted mt-1 uppercase tracking-widest">Cadastro de Marca</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-light tracking-tight">Criar conta</h1>
            <p className="text-sm text-muted mt-1">Preencha os dados da sua empresa para solicitar acesso.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            {/* Company info */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">Dados da empresa</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input name="nome_empresa" required placeholder="Nome da empresa *"
                    className="w-full border border-border px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all" />
                </div>
                <div>
                  <input name="cnpj" placeholder="CNPJ (opcional)"
                    className="w-full border border-border px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all" />
                </div>
                <div>
                  <select name="segmento"
                    className="w-full border border-border px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all text-muted">
                    <option value="">Segmento</option>
                    {SEGMENTOS_MARCA.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input name="site" placeholder="Site (opcional)"
                    className="w-full border border-border px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all" />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">Contato</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input name="nome_contato" required placeholder="Seu nome *"
                    className="w-full border border-border px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all" />
                </div>
                <div>
                  <input name="telefone" placeholder="Telefone"
                    className="w-full border border-border px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all" />
                </div>
              </div>
            </div>

            {/* Account */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">Dados de acesso</p>
              <div className="space-y-3">
                <input name="email" type="email" required placeholder="Email *"
                  className="w-full border border-border px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all" />
                <div className="grid grid-cols-2 gap-3">
                  <input name="password" type="password" required minLength={6} placeholder="Senha *"
                    className="w-full border border-border px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all" />
                  <input name="confirm_password" type="password" required placeholder="Confirmar senha *"
                    className="w-full border border-border px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-foreground text-white text-sm tracking-widest uppercase rounded-xl hover:bg-foreground/90 transition-colors disabled:opacity-50">
              {loading ? "Cadastrando..." : "Solicitar acesso"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-muted">
              Ja tem conta?{" "}
              <Link href="/marcas/login" className="text-foreground underline hover:no-underline">Entrar</Link>
            </p>
            <Link href="/" className="text-xs text-muted hover:text-foreground transition-colors block">
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
