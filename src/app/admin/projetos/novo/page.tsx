import { ProjetoForm } from "@/components/admin/projeto-form";

export default function NovoProjetoPage() {
  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Novo Projeto</h1>
      <ProjetoForm />
    </div>
  );
}
