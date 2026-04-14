"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
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
    router.push("/admin");
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/logo-white.png" alt="HL Models" className="h-16 w-auto object-contain mx-auto" />
          </Link>
        </div>

        {/* Glass card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 md:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.4)]">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-white font-medium tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-white/50 text-sm mt-2">
              Acesse o painel administrativo
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/15 border border-red-400/20 text-red-200 text-sm px-4 py-3 rounded-2xl text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-white/50 mb-2 font-medium">
                E-mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/8 border border-white/12 text-white placeholder-white/25 pl-11 pr-4 py-4 text-sm rounded-2xl focus:outline-none focus:border-white/30 focus:bg-white/12 transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] uppercase tracking-[0.15em] text-white/50 font-medium">
                  Senha
                </label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/8 border border-white/12 text-white placeholder-white/25 pl-11 pr-4 py-4 text-sm rounded-2xl focus:outline-none focus:border-white/30 focus:bg-white/12 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-foreground text-sm font-semibold tracking-wider uppercase rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between px-2">
          <Link href="/" className="text-[11px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest">
            Voltar ao site
          </Link>
          <span className="text-[11px] text-white/15 uppercase tracking-widest">
            Acesso restrito
          </span>
        </div>
      </div>
    </div>
  );
}
