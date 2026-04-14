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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#1a1a2e]">
      {/* Main card container */}
      <div className="w-full max-w-[1000px] bg-[#1e1e36] rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row">

        {/* Left — Image side */}
        <div className="relative lg:w-[50%] min-h-[240px] lg:min-h-[600px] overflow-hidden">
          <img
            src="https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Fashion"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e36]/90 via-[#1e1e36]/30 to-transparent" />

          {/* Logo + back link */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
            <img src="/logo-white.png" alt="HL Models" className="h-10 w-auto object-contain" />
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[11px] text-white/60 hover:text-white uppercase tracking-widest transition-colors bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10"
            >
              Voltar ao site &rarr;
            </Link>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-8 left-6 right-6 z-10">
            <h2 className="font-display text-3xl md:text-4xl text-white font-medium tracking-tight leading-tight">
              Gerencie sua<br />agência com excelência
            </h2>
          </div>
        </div>

        {/* Right — Form side */}
        <div className="lg:w-[50%] flex flex-col justify-center p-8 md:p-12 lg:p-14">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="font-display text-3xl md:text-4xl text-white font-medium tracking-tight mb-2">
              Painel Administrativo
            </h1>
            <p className="text-white/40 text-sm mb-10">
              Entre com suas credenciais para acessar.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-400/20 text-red-300 text-sm px-4 py-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-2 font-medium">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 pl-11 pr-4 py-4 text-sm rounded-xl focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 mb-2 font-medium">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 pl-11 pr-4 py-4 text-sm rounded-xl focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-[#1e1e36] text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="text-center text-[10px] text-white/15 mt-8 uppercase tracking-[0.2em]">
              Acesso restrito
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
