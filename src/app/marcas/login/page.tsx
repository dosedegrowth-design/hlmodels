"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Search, Star, FileText } from "lucide-react";

export default function MarcasLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError("Email ou senha incorretos.");
      return;
    }
    router.push("/marcas");
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-foreground" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.06)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.04)_0%,_transparent_50%)]" />

      {/* Decorative lines */}
      <div className="absolute top-0 left-1/3 w-px h-full bg-white/[0.03]" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-white/[0.03]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <img src="/logo-white.png" alt="HL Models" className="h-14 w-auto object-contain mx-auto" />
          </Link>
        </div>

        {/* Glass card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/[0.1] rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl md:text-3xl text-white font-normal tracking-tight">
              Portal de Marcas
            </h1>
            <p className="text-white/40 text-sm mt-2">
              Acesse para buscar modelos e gerenciar seleções.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/20 pl-11 pr-4 py-3.5 text-sm rounded-xl focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
                  placeholder="marca@empresa.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/20 pl-11 pr-4 py-3.5 text-sm rounded-xl focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-foreground text-sm font-medium tracking-widest uppercase rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[10px] text-white/20 uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Register CTA */}
          <div className="text-center">
            <p className="text-sm text-white/30 mb-3">
              Não tem uma conta?
            </p>
            <Link
              href="/marcas/registro"
              className="inline-block w-full py-3 border border-white/20 text-white/70 text-sm tracking-widest uppercase rounded-xl hover:bg-white/[0.06] hover:text-white transition-all"
            >
              Crie sua conta agora
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-white/20">
            <Search size={14} />
            <span className="text-[10px] uppercase tracking-widest">Buscar modelos</span>
          </div>
          <div className="flex items-center gap-2 text-white/20">
            <Star size={14} />
            <span className="text-[10px] uppercase tracking-widest">Criar seleções</span>
          </div>
          <div className="flex items-center gap-2 text-white/20 hidden sm:flex">
            <FileText size={14} />
            <span className="text-[10px] uppercase tracking-widest">Orçamentos</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-white/25 hover:text-white/50 transition-colors uppercase tracking-widest">
            Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}
