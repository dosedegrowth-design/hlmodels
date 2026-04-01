import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { categoriaLabel } from "@/types";
import Image from "next/image";
import { ModeloActions } from "@/components/admin/modelo-actions";

export default async function AdminModelosPage() {
  const supabase = await createClient();
  const { data: modelos } = await supabase
    .from("modelos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Modelos</h1>
        <Link
          href="/admin/modelos/novo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-white text-sm rounded-lg hover:bg-foreground/90 transition-colors"
        >
          <Plus size={16} />
          Novo Modelo
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4">
                Modelo
              </th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4 hidden sm:table-cell">
                Categoria
              </th>
              <th className="text-left text-xs uppercase tracking-widest text-muted px-6 py-4 hidden md:table-cell">
                Status
              </th>
              <th className="text-right text-xs uppercase tracking-widest text-muted px-6 py-4">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {(modelos ?? []).map((modelo) => (
              <tr
                key={modelo.id}
                className="border-b border-border last:border-0 hover:bg-neutral-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-neutral-100 overflow-hidden shrink-0">
                      {modelo.foto_principal ? (
                        <Image
                          src={modelo.foto_principal}
                          alt={modelo.nome}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-muted">
                          {modelo.nome.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{modelo.nome}</p>
                      <p className="text-xs text-muted">{modelo.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="text-sm">
                    {categoriaLabel(modelo.categoria)}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      modelo.ativo
                        ? "bg-green-100 text-green-800"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {modelo.ativo ? "Ativo" : "Inativo"}
                  </span>
                  {modelo.destaque && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Destaque
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <ModeloActions modeloId={modelo.id} ativo={modelo.ativo} />
                </td>
              </tr>
            ))}
            {(!modelos || modelos.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-muted text-sm"
                >
                  Nenhum modelo cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
