"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen flex">
      {/* Left: branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="block">
            <img src="/logo-white.png" alt="HL Models" className="h-12 w-auto object-contain" />
          </Link>
          <div>
            <h2 className="text-white text-4xl font-light tracking-tight leading-tight mb-4">
              Painel<br />Administrativo
            </h2>
            <p className="text-white/40 text-sm max-w-xs">
              Gerencie modelos, projetos, candidaturas e marcas da sua agencia.
            </p>
          </div>
          <p className="text-white/20 text-xs tracking-widest uppercase">
            Acesso restrito
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="block"><img src="/logo-dark.png" alt="HL Models" className="h-10 w-auto object-contain mx-auto" /></Link>
            <p className="text-xs text-muted mt-1 uppercase tracking-widest">Painel Administrativo</p>
          </div>

          <div className="hidden lg:block mb-10">
            <h1 className="text-2xl font-light tracking-tight">Bem-vindo de volta</h1>
            <p className="text-sm text-muted mt-1">Entre com suas credenciais para acessar o painel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-border px-4 py-3.5 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all"
                placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-border px-4 py-3.5 text-sm rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/10 transition-all"
                placeholder="********" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-foreground text-white text-sm tracking-widest uppercase rounded-xl hover:bg-foreground/90 transition-colors disabled:opacity-50">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-xs text-muted hover:text-foreground transition-colors">
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
