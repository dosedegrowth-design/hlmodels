"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  Building2,
  ClipboardList,
  FolderOpen,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/modelos", label: "Modelos", icon: Users },
  { href: "/admin/candidaturas", label: "Candidaturas", icon: FileText },
  { href: "/admin/contatos", label: "Contatos", icon: MessageSquare },
  { href: "/admin/marcas", label: "Marcas", icon: Building2 },
  { href: "/admin/aprovados", label: "Aprovados", icon: Award },
  { href: "/admin/orcamentos", label: "Orcamentos", icon: ClipboardList },
  { href: "/admin/projetos", label: "Projetos", icon: FolderOpen },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const navContent = (
    <>
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="block">
          <img src="/logo-dark.png" alt="HL Models" className="h-10 w-auto object-contain" />
        </Link>
        <p className="text-xs text-muted mt-1">Painel Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-foreground text-white"
                  : "text-muted hover:bg-neutral-100 hover:text-foreground"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted hover:bg-neutral-100 hover:text-foreground transition-colors w-full"
        >
          <LogOut size={18} />
          Sair
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted hover:bg-neutral-100 hover:text-foreground transition-colors"
        >
          Ver site
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <img src="/logo-dark.png" alt="HL Models" className="h-7 w-auto object-contain" />
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border flex-col z-40">
        {navContent}
      </div>
    </>
  );
}
