"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/marcas", label: "Início" },
  { href: "/marcas/modelos", label: "Modelos" },
  { href: "/marcas/selecoes", label: "Minhas Seleções" },
  { href: "/marcas/perfil", label: "Perfil" },
];

export function BrandHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthPage = ["/marcas/login", "/marcas/registro", "/marcas/aguardando"].includes(pathname);
  if (isAuthPage) return null;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/marcas/login");
  }

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/marcas" className="text-lg font-bold tracking-[0.15em] uppercase">
          HL Models
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xs uppercase tracking-widest transition-colors",
                (item.href === "/marcas" ? pathname === "/marcas" : pathname.startsWith(item.href))
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors flex items-center gap-1"
          >
            <LogOut size={14} />
            Sair
          </button>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-border px-6 py-4 space-y-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block text-sm",
                pathname.startsWith(item.href) ? "text-foreground" : "text-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="block text-sm text-muted">
            Sair
          </button>
        </nav>
      )}
    </header>
  );
}
