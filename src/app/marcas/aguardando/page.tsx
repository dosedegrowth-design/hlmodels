import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default async function AguardandoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/marcas/login");

  const { data: marca } = await supabase
    .from("marcas")
    .select("status, nome_empresa")
    .eq("user_id", user.id)
    .single();

  if (marca?.status === "aprovada") redirect("/marcas");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        {(!marca || marca.status === "pendente") && (
          <>
            <Clock size={48} className="mx-auto text-yellow-500 mb-6" />
            <h1 className="text-2xl font-bold tracking-tight mb-3">Aguardando aprovação</h1>
            <p className="text-muted text-sm">
              Seu cadastro está sendo analisado pela equipe HL Models.
              Você receberá um email quando sua conta for aprovada.
            </p>
          </>
        )}
        {marca?.status === "rejeitada" && (
          <>
            <XCircle size={48} className="mx-auto text-red-500 mb-6" />
            <h1 className="text-2xl font-bold tracking-tight mb-3">Cadastro não aprovado</h1>
            <p className="text-muted text-sm">
              Infelizmente seu cadastro não foi aprovado. Entre em contato conosco para mais informações.
            </p>
          </>
        )}
        <Link href="/" className="inline-block mt-8 text-sm text-muted underline">Voltar ao site</Link>
      </div>
    </div>
  );
}
