"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, Search, ListChecks, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/marcas", label: "Inicio", icon: Home, exact: true },
  { href: "/marcas/modelos", label: "Modelos", icon: Search, exact: false },
  { href: "/marcas/selecoes", label: "Selecoes", icon: ListChecks, exact: false },
  { href: "/marcas/perfil", label: "Perfil", icon: User, exact: false },
];

export function BrandHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draftCount, setDraftCount] = useState(0);

  const isAuthPage = [
    "/marcas/login",
    "/marcas/registro",
    "/marcas/aguardando",
  ].includes(pathname);

  // Load draft selection count
  useEffect(() => {
    if (isAuthPage) return;
    async function loadDraft() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: marca } = await supabase
        .from("marcas")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!marca) return;
      const { data: draft } = await supabase
        .from("selecoes")
        .select("selecao_modelos(id)")
        .eq("marca_id", marca.id)
        .eq("status", "rascunho")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (draft) {
        setDraftCount((draft.selecao_modelos as any[])?.length ?? 0);
      }
    }
    loadDraft();
  }, [pathname, isAuthPage]);

  if (isAuthPage) return null;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/marcas/login");
  }

  function isActive(item: (typeof NAV_ITEMS)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/marcas" className="block">
          <img src="/logo-dark.png" alt="HL Models" className="h-8 w-auto object-contain" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs uppercase tracking-widest transition-colors",
                isActive(item)
                  ? "bg-neutral-100 text-foreground"
                  : "text-muted hover:text-foreground hover:bg-neutral-50"
              )}
            >
              <item.icon size={14} />
              {item.label}
              {item.href === "/marcas/selecoes" && draftCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-foreground text-white text-[9px] rounded-full leading-none">
                  {draftCount}
                </span>
              )}
            </Link>
          ))}
          <div className="w-px h-5 bg-border mx-2" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs uppercase tracking-widest text-muted hover:text-foreground hover:bg-neutral-50 transition-colors"
          >
            <LogOut size={14} />
            Sair
          </button>
        </nav>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          {draftCount > 0 && (
            <Link
              href="/marcas/selecoes"
              className="flex items-center gap-1 px-2 py-1 bg-foreground text-white text-[10px] rounded-full"
            >
              <ListChecks size={12} />
              {draftCount}
            </Link>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-border px-6 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm",
                isActive(item) ? "bg-neutral-100 text-foreground" : "text-muted"
              )}
            >
              <item.icon size={16} />
              {item.label}
              {item.href === "/marcas/selecoes" && draftCount > 0 && (
                <span className="ml-auto px-1.5 py-0.5 bg-foreground text-white text-[9px] rounded-full">
                  {draftCount}
                </span>
              )}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm text-muted w-full"
          >
            <LogOut size={16} />
            Sair
          </button>
        </nav>
      )}
    </header>
  );
}
