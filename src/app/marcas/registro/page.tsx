"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
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
      setError("As senhas não coincidem.");
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">HL Models</h1>
          <p className="text-sm text-muted mt-1">Cadastro de Marca</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nome da empresa *</label>
              <input name="nome_empresa" required className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" placeholder="Empresa Ltda" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">CNPJ</label>
              <input name="cnpj" className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" placeholder="00.000.000/0001-00" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nome do contato *</label>
              <input name="nome_contato" required className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" placeholder="João Silva" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Telefone</label>
              <input name="telefone" className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" placeholder="(11) 99999-9999" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Segmento</label>
              <select name="segmento" className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground">
                <option value="">Selecione</option>
                {SEGMENTOS_MARCA.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Site</label>
              <input name="site" className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" placeholder="https://..." />
            </div>
          </div>

          <hr className="border-border" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Email *</label>
              <input name="email" type="email" required className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" placeholder="marca@empresa.com" />
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Senha *</label>
                <input name="password" type="password" required minLength={6} className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" placeholder="Min. 6 caracteres" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Confirmar senha *</label>
                <input name="confirm_password" type="password" required className="w-full border border-border px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-foreground" placeholder="Repetir senha" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-white text-sm uppercase tracking-widest rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50">
            <UserPlus size={16} />
            {loading ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Já tem conta?{" "}
          <Link href="/marcas/login" className="text-foreground underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
