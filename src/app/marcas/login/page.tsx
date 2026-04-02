"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">HL Models</h1>
          <p className="text-sm text-muted mt-1">Portal de Marcas</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
              placeholder="marca@empresa.com" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground transition-colors"
              placeholder="********" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-white text-sm uppercase tracking-widest rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50">
            <LogIn size={16} />
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Não tem conta?{" "}
          <Link href="/marcas/registro" className="text-foreground underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
