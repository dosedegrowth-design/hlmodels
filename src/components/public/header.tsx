"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Star } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mulher", label: "Mulher" },
  { href: "/homem", label: "Homem" },
  { href: "/nao-binario", label: "Nao Binario" },
  { href: "/baby", label: "Baby", kids: true },
  { href: "/kids", label: "Kids", kids: true },
  { href: "/teens", label: "Teens", kids: true },
  { href: "/projetos", label: "Projetos" },
  { href: "/faca-parte", label: "Faca Parte" },
  { href: "/contato", label: "Contato" },
];

const KIDS_PATHS = ["/baby", "/kids", "/teens"];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isMarcas = pathname.startsWith("/marcas");
  const isHome = pathname === "/";
  const isKidsPage = KIDS_PATHS.includes(pathname);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdmin || isMarcas) return null;

  // Determine header style based on context
  const getHeaderBg = () => {
    if (!scrolled && isHome) return "bg-transparent";
    if (isKidsPage) return "bg-white/95 backdrop-blur-sm border-b border-kids-pink/20";
    return "bg-white/95 backdrop-blur-sm";
  };

  const getTextColor = () => {
    if (!scrolled && isHome) return "text-white";
    if (isKidsPage) return "text-kids-purple";
    return "text-foreground";
  };

  const getLogoSrc = () => {
    if (!scrolled && isHome) return "/logo-white.png";
    return "/logo-dark.png";
  };

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", getHeaderBg())}>
        {/* Kids accent bar */}
        {isKidsPage && (
          <div className="h-1 bg-gradient-to-r from-kids-pink via-kids-purple to-kids-sky" />
        )}

        <div className="px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
          <div className="w-28" />

          {/* Center logo */}
          <Link href="/" className="relative h-14 w-36 lg:h-16 lg:w-44">
            <Image src={getLogoSrc()} alt="HL Models Agency" fill className="object-contain" priority />
          </Link>

          {/* Right - Menu button */}
          <div className="w-28 flex items-center justify-end">
            <button
              onClick={() => setMenuOpen(true)}
              className={cn("flex items-center gap-2 text-sm uppercase tracking-widest transition-colors", getTextColor())}
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
          "fixed inset-0 z-[100] flex flex-col transition-all duration-500",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          isKidsPage ? "bg-white text-foreground" : "bg-foreground text-white"
        )}
      >
        {/* Kids gradient bar in menu */}
        {isKidsPage && (
          <div className="h-1 bg-gradient-to-r from-kids-pink via-kids-purple to-kids-sky shrink-0" />
        )}

        {/* Menu header */}
        <div className="px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between shrink-0">
          <div className="w-28" />
          <Link href="/" onClick={() => setMenuOpen(false)} className="relative h-14 w-36 lg:h-16 lg:w-44">
            <Image src={isKidsPage ? "/logo-dark.png" : "/logo-white.png"} alt="HL Models Agency" fill className="object-contain" priority />
          </Link>
          <div className="w-28 flex items-center justify-end">
            <button
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 text-xs uppercase tracking-widest transition-colors",
                isKidsPage ? "text-foreground/60 hover:text-foreground" : "text-white/60 hover:text-white"
              )}
              aria-label="Fechar menu"
            >
              <span className="hidden sm:inline">Fechar</span>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Menu links */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const linkIsKids = (link as any).kids;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "text-3xl md:text-5xl lg:text-6xl font-light tracking-tight py-2 transition-all duration-200 hover:tracking-[0.15em]",
                  isKidsPage
                    ? isActive
                      ? "text-kids-purple"
                      : linkIsKids
                      ? "text-kids-pink/60 hover:text-kids-purple"
                      : "text-foreground/20 hover:text-foreground"
                    : isActive
                    ? "text-white"
                    : "text-white/30 hover:text-white"
                )}
              >
                {linkIsKids && isKidsPage && (
                  <Star size={12} className="inline-block mr-2 mb-1 text-kids-yellow" />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Menu footer */}
        <div className={cn(
          "px-6 lg:px-10 py-6 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] shrink-0 border-t",
          isKidsPage ? "text-foreground/25 border-foreground/5" : "text-white/25 border-white/5"
        )}>
          <span>Sao Paulo, SP</span>
          <a href="https://instagram.com/hlmodels" target="_blank" rel="noopener noreferrer"
            className={isKidsPage ? "hover:text-foreground/50 transition-colors" : "hover:text-white/50 transition-colors"}>
            @hlmodels
          </a>
        </div>
      </div>
    </>
  );
}
