"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Search, Star, FileText } from "lucide-react";

export default function MarcasLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadPhoto() {
      const supabase = createClient();
      const { data } = await supabase
        .from("modelos")
        .select("foto_principal")
        .eq("ativo", true)
        .eq("destaque", true)
        .not("foto_principal", "is", null);
      if (data && data.length > 0) {
        setBgImage(data[Math.floor(Math.random() * data.length)].foto_principal);
      }
    }
    loadPhoto();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError("Email ou senha incorretos."); return; }
    router.push("/marcas");
  }

  return (
    <div
      className="fixed inset-0 flex"
      style={{ background: "#12121f", zIndex: 60 }}
    >
      {/* LEFT — Photo (desktop only) */}
      <div className="hidden lg:block relative" style={{ width: "55%" }}>
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", objectPosition: "top center" }}
          />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 50%, #12121f 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #12121f 0%, transparent 35%)" }} />

        <div className="absolute top-8 left-8 z-10">
          <img src="/logo-white.png" alt="HL Models" className="h-12" />
        </div>

        <div className="absolute bottom-10 left-8 right-20 z-10">
          <h2 className="font-display text-white" style={{ fontSize: 42, fontWeight: 500, lineHeight: 1.1 }}>
            Encontre os talentos<br />ideais para sua marca
          </h2>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, marginTop: 12 }}>
            Busque modelos, crie seleções e solicite orçamentos.
          </p>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-20">
        <div className="w-full" style={{ maxWidth: 380, margin: "0 auto" }}>
          <div className="lg:hidden text-center mb-10">
            <Link href="/"><img src="/logo-white.png" alt="HL Models" className="h-14 mx-auto" /></Link>
          </div>

          <h1 className="font-display text-white" style={{ fontSize: 34, fontWeight: 500, marginBottom: 6 }}>
            Portal de Marcas
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 32 }}>
            Já tem uma conta? Faça login abaixo.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="text-sm text-center rounded-xl px-4 py-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase mb-2" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.25)" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="marca@empresa.com"
                  className="w-full rounded-xl text-sm text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "16px 16px 16px 44px" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase mb-2" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.25)" }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full rounded-xl text-sm text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "16px 16px 16px 44px" }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-xl text-sm uppercase cursor-pointer"
              style={{ background: "white", color: "#12121f", padding: "16px 0", fontWeight: 600, letterSpacing: "0.1em", border: "none", opacity: loading ? 0.5 : 1 }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1" style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs uppercase" style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em" }}>ou</span>
            <div className="flex-1" style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <Link href="/marcas/registro"
            className="block w-full text-center rounded-xl text-sm uppercase no-underline"
            style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "14px 0", letterSpacing: "0.1em" }}
          >
            Crie sua conta agora
          </Link>

          {/* Features */}
          <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
              <Search size={12} />
              <span className="text-xs uppercase" style={{ letterSpacing: "0.15em" }}>Buscar</span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
              <Star size={12} />
              <span className="text-xs uppercase" style={{ letterSpacing: "0.15em" }}>Selecionar</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
              <FileText size={12} />
              <span className="text-xs uppercase" style={{ letterSpacing: "0.15em" }}>Orçar</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs uppercase no-underline" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
