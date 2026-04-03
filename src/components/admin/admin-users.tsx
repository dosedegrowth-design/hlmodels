"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, Trash2, Shield } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_sign_in: string | null;
}

export function AdminUsers() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  async function loadAdmins() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/manage-admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "list" }),
      }
    );
    const data = await res.json();
    setAdmins(data.admins ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");

    const fd = new FormData(e.currentTarget);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/manage-admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: "create",
          email: fd.get("email"),
          password: fd.get("password"),
          name: fd.get("name"),
        }),
      }
    );

    const data = await res.json();
    setCreating(false);

    if (data.error) {
      setError(data.error);
    } else {
      setSuccess("Admin criado com sucesso!");
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
      loadAdmins();
    }
  }

  async function handleDelete(userId: string, email: string) {
    if (!confirm(`Tem certeza que deseja remover o admin ${email}?`)) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/manage-admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "delete", userId }),
      }
    );

    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      loadAdmins();
    }
  }

  return (
    <div className="space-y-4">
      {/* Admin list */}
      {loading ? (
        <p className="text-sm text-muted">Carregando...</p>
      ) : (
        <div className="space-y-2">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between py-3 px-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                  <Shield size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{admin.name || admin.email}</p>
                  <p className="text-xs text-muted">{admin.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {admin.last_sign_in && (
                  <span className="text-[10px] text-muted hidden sm:block">
                    Ultimo acesso:{" "}
                    {new Date(admin.last_sign_in).toLocaleDateString("pt-BR")}
                  </span>
                )}
                <button
                  onClick={() => handleDelete(admin.id, admin.email)}
                  className="p-1.5 text-muted hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  title="Remover admin"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error/Success messages */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg">{success}</div>
      )}

      {/* Add new admin */}
      {showForm ? (
        <form onSubmit={handleCreate} className="border border-border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium">Novo administrador</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              name="name"
              placeholder="Nome"
              required
              className="border border-border px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="border border-border px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
            />
            <input
              name="password"
              type="password"
              placeholder="Senha (min 6)"
              required
              minLength={6}
              className="border border-border px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-foreground text-white text-xs rounded-lg hover:bg-foreground/90 disabled:opacity-50"
            >
              {creating ? "Criando..." : "Criar admin"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-border text-xs rounded-lg hover:bg-neutral-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-lg text-sm text-muted hover:text-foreground hover:border-foreground transition-colors w-full justify-center"
        >
          <UserPlus size={16} />
          Adicionar administrador
        </button>
      )}
    </div>
  );
}
