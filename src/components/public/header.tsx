"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mulher", label: "Mulher" },
  { href: "/homem", label: "Homem" },
  { href: "/nao-binario", label: "Não Binário" },
  { href: "/baby", label: "Baby" },
  { href: "/kids", label: "Kids" },
  { href: "/teens", label: "Teens" },
  { href: "/faca-parte", label: "Faça Parte" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isMarcas = pathname.startsWith("/marcas");
  const isHome = pathname === "/";

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdmin || isMarcas) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || !isHome
            ? "bg-white/95 backdrop-blur-sm"
            : "bg-transparent"
        )}
      >
        <div className="px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
          {/* Left spacer */}
          <div className="w-28" />

          {/* Center logo */}
          <Link
            href="/"
            className={cn(
              "text-xl lg:text-2xl font-bold tracking-[0.2em] uppercase transition-colors duration-300",
              scrolled || !isHome ? "text-foreground" : "text-white"
            )}
          >
            HL Models
          </Link>

          {/* Right - Menu button */}
          <div className="w-28 flex items-center justify-end">
            <button
              onClick={() => setMenuOpen(true)}
              className={cn(
                "flex items-center gap-2 text-sm uppercase tracking-widest transition-colors",
                scrolled || !isHome ? "text-foreground" : "text-white"
              )}
              aria-label="Menu"
            >
              <span className="hidden sm:inline text-xs">Menu</span>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-foreground text-white flex flex-col transition-all duration-500",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Menu header */}
        <div className="px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between shrink-0">
          <div className="w-28" />
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-xl lg:text-2xl font-bold tracking-[0.2em] uppercase text-white"
          >
            HL Models
          </Link>
          <div className="w-28 flex items-center justify-end">
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
              aria-label="Fechar menu"
            >
              <span className="hidden sm:inline">Fechar</span>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Menu links */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "text-3xl md:text-5xl lg:text-6xl font-light tracking-tight py-2 transition-all duration-200 hover:tracking-[0.15em]",
                pathname === link.href
                  ? "text-white"
                  : "text-white/30 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Menu footer */}
        <div className="px-6 lg:px-10 py-6 flex items-center justify-between text-[10px] text-white/25 uppercase tracking-[0.2em] shrink-0 border-t border-white/5">
          <span>São Paulo, SP</span>
          <a
            href="https://instagram.com/hlmodels"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/50 transition-colors"
          >
            @hlmodels
          </a>
        </div>
      </div>
    </>
  );
}
