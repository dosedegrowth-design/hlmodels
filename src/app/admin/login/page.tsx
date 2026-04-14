"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const router = useRouter();

  // Load random featured model photo
  useEffect(() => {
    async function loadRandomPhoto() {
      const supabase = createClient();
      const { data } = await supabase
        .from("modelos")
        .select("foto_principal")
        .eq("ativo", true)
        .eq("destaque", true)
        .not("foto_principal", "is", null);
      if (data && data.length > 0) {
        const random = data[Math.floor(Math.random() * data.length)];
        setBgImage(random.foto_principal);
      }
    }
    loadRandomPhoto();
  }, []);

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
    <div className="h-screen flex bg-[#12121f]">
      {/* Left — Image side (hidden on mobile) */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        {/* Featured model photo */}
        {bgImage && (
          <img
            src={bgImage}
            alt="HL Models"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          />
        )}
        {!bgImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#12121f]" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#12121f]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121f]/80 via-transparent to-[#12121f]/30" />

        {/* Logo top-left */}
        <div className="absolute top-8 left-8 z-10">
          <img src="/logo-white.png" alt="HL Models" className="h-12 w-auto object-contain" />
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-10 left-8 right-8 z-10">
          <h2 className="font-display text-4xl xl:text-5xl text-white font-medium tracking-tight leading-tight">
            Gerencie sua agência<br />com excelência
          </h2>
          <p className="text-white/30 text-sm mt-3 max-w-md">
            Modelos, projetos, candidaturas e marcas — tudo em um só lugar.
          </p>
        </div>
      </div>

      {/* Right — Form side */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-20 bg-[#12121f]">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/">
              <img src="/logo-white.png" alt="HL Models" className="h-14 w-auto object-contain mx-auto" />
            </Link>
          </div>

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
              className="w-full py-4 bg-white text-[#12121f] text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-10 flex items-center justify-between">
            <Link href="/" className="text-[11px] text-white/25 hover:text-white/50 transition-colors uppercase tracking-widest">
              Voltar ao site
            </Link>
            <span className="text-[11px] text-white/15 uppercase tracking-widest">
              Acesso restrito
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
