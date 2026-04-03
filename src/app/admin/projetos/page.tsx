import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { ProjetoActions } from "@/components/admin/projeto-actions";

export default async function AdminProjetosPage() {
  const supabase = await createClient();
  const { data: projetos } = await supabase
    .from("projetos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
        <Link href="/admin/projetos/novo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-white text-sm rounded-lg hover:bg-foreground/90 transition-colors">
          <Plus size={16} /> Novo Projeto
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4">Projeto</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4 hidden sm:table-cell">Marca</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4 hidden md:table-cell">Status</th>
              <th className="text-right text-xs uppercase tracking-widest text-muted px-6 py-4">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {(projetos ?? []).map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                      {p.foto_capa ? (
                        <Image src={p.foto_capa} alt={p.titulo} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-muted">{p.titulo.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.titulo}</p>
                      <p className="text-xs text-muted">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm hidden sm:table-cell">{p.marca_parceira || "-"}</td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.ativo ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-600"}`}>
                    {p.ativo ? "Ativo" : "Inativo"}
                  </span>
                  {p.destaque && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Destaque</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <ProjetoActions projetoId={p.id} ativo={p.ativo} />
                </td>
              </tr>
            ))}
            {(!projetos || projetos.length === 0) && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-muted text-sm">Nenhum projeto cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
