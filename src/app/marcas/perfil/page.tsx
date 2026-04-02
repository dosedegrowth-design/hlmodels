import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MarcasPerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/marcas/login");

  const { data: marca } = await supabase.from("marcas").select("*").eq("user_id", user.id).single();

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-2xl font-light tracking-tight mb-8">Perfil da Marca</h1>
      <div className="bg-white border border-border rounded-xl p-6 space-y-4">
        <div>
          <span className="text-xs text-muted uppercase tracking-widest">Empresa</span>
          <p className="text-sm">{marca?.nome_empresa}</p>
        </div>
        <div>
          <span className="text-xs text-muted uppercase tracking-widest">Contato</span>
          <p className="text-sm">{marca?.nome_contato}</p>
        </div>
        <div>
          <span className="text-xs text-muted uppercase tracking-widest">Email</span>
          <p className="text-sm">{marca?.email}</p>
        </div>
        {marca?.telefone && (
          <div>
            <span className="text-xs text-muted uppercase tracking-widest">Telefone</span>
            <p className="text-sm">{marca?.telefone}</p>
          </div>
        )}
        {marca?.segmento && (
          <div>
            <span className="text-xs text-muted uppercase tracking-widest">Segmento</span>
            <p className="text-sm">{marca?.segmento}</p>
          </div>
        )}
        {marca?.cnpj && (
          <div>
            <span className="text-xs text-muted uppercase tracking-widest">CNPJ</span>
            <p className="text-sm">{marca?.cnpj}</p>
          </div>
        )}
      </div>
    </div>
  );
}
