import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjetoForm } from "@/components/admin/projeto-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProjetoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: projeto } = await supabase
    .from("projetos")
    .select("*, projeto_fotos(*), projeto_modelos(*, modelos(id, nome, foto_principal))")
    .eq("id", id)
    .single();

  if (!projeto) notFound();

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Editar: {projeto.titulo}</h1>
      <ProjetoForm projeto={projeto} />
    </div>
  );
}
