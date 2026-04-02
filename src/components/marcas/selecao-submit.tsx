"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";

export function SelecaoSubmit({ selecaoId }: { selecaoId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("selecoes").update({ status: "enviada" }).eq("id", selecaoId);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-foreground text-white text-xs rounded-lg hover:bg-foreground/90 disabled:opacity-50"
    >
      <Send size={14} />
      {loading ? "Enviando..." : "Enviar orcamento"}
    </button>
  );
}
