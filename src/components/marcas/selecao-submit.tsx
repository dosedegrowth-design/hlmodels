"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Send, CheckCircle } from "lucide-react";

export function SelecaoSubmit({ selecaoId }: { selecaoId: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit() {
    if (!confirm("Tem certeza que deseja enviar este orcamento? Apos o envio, nao sera possivel editar a selecao.")) {
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("selecoes")
      .update({ status: "enviada" })
      .eq("id", selecaoId);

    setLoading(false);

    if (updateError) {
      setError("Erro ao enviar. Tente novamente.");
      return;
    }

    setSent(true);
    setTimeout(() => {
      router.refresh();
    }, 1500);
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs rounded-lg">
        <CheckCircle size={14} />
        Orcamento enviado!
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-white text-xs rounded-lg hover:bg-foreground/90 disabled:opacity-50 transition-colors"
      >
        <Send size={14} />
        {loading ? "Enviando..." : "Enviar orcamento"}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
