import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ModeloForm } from "@/components/admin/modelo-form";
import { ModeloAprovacoes } from "@/components/admin/modelo-aprovacoes";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarModeloPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: modelo } = await supabase
    .from("modelos")
    .select("*, modelo_fotos(*)")
    .eq("id", id)
    .single();

  if (!modelo) notFound();

  // Get aprovacoes
  const { data: aprovacoes } = await supabase
    .from("modelo_aprovacoes")
    .select("id, marca_nome")
    .eq("modelo_id", id);

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="text-2xl font-bold tracking-tight mb-8">
        Editar: {modelo.nome}
      </h1>
      <div className="max-w-3xl space-y-8">
        <ModeloAprovacoes modeloId={id} aprovacoes={aprovacoes ?? []} />
        <ModeloForm modelo={modelo} />
      </div>
    </div>
  );
}
