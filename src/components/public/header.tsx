"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/mulher", label: "Mulher", kids: false },
  { href: "/homem", label: "Homem", kids: false },
  { href: "/nao-binario", label: "Não Binário", kids: false },
  { href: "/baby", label: "Baby", kids: true },
  { href: "/kids", label: "Kids", kids: true },
  { href: "/teens", label: "Teens", kids: true },
];

const SECONDARY_LINKS = [
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
];

const KIDS_PATHS = ["/baby", "/kids", "/teens"];

const CATEGORY_MAP: Record<string, string> = {
  "/mulher": "mulher",
  "/homem": "homem",
  "/nao-binario": "nao_binario",
  "/baby": "baby",
  "/kids": "kids",
  "/teens": "teens",
};

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({});
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isMarcas = pathname.startsWith("/marcas");
  const isHome = pathname === "/";
  const isKidsPage = KIDS_PATHS.includes(pathname);

  // Scroll detection
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load preview images on menu open
  useEffect(() => {
    if (!menuOpen || Object.keys(previewImages).length > 0) return;
    async function loadPreviews() {
      const supabase = createClient();
      const categories = Object.values(CATEGORY_MAP);
      const images: Record<string, string> = {};
      for (const cat of categories) {
        const { data } = await supabase
          .from("modelos")
          .select("foto_principal")
          .eq("categoria", cat)
          .eq("ativo", true)
          .not("foto_principal", "is", null)
          .order("destaque", { ascending: false })
          .limit(1)
          .single();
        if (data?.foto_principal) {
          images[cat] = data.foto_principal;
        }
      }
      setPreviewImages(images);
    }
    loadPreviews();
  }, [menuOpen, previewImages]);

  // Kids model detection for /modelo/[slug]
  const [isKidsModel, setIsKidsModel] = useState(false);
  useEffect(() => {
    const modelMatch = pathname.match(/^\/modelo\/(.+)$/);
    if (modelMatch) {
      const slug = modelMatch[1];
      const supabase = createClient();
      supabase
        .from("modelos")
        .select("categoria")
        .eq("slug", slug)
        .single()
        .then(({ data }) => {
          setIsKidsModel(
            !!data && ["baby", "kids", "teens"].includes(data.categoria)
          );
        });
    } else {
      setIsKidsModel(false);
    }
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  if (isAdmin || isMarcas) return null;

  const isKidsContext = isKidsPage || isKidsModel;

  // Determine if header should be transparent (over hero video/dark sections)
  const isTransparent = isHome && !scrolled;

  const hoveredCategory = hoveredLink ? CATEGORY_MAP[hoveredLink] : null;
  const previewSrc = hoveredCategory ? previewImages[hoveredCategory] : null;

  return (
    <>
      {/* ===== MAIN HEADER BAR ===== */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isTransparent
            ? "bg-transparent"
            : isKidsContext
            ? "bg-[#FFF9F5]/95 backdrop-blur-xl border-b border-kids-coral/10"
            : "bg-white/95 backdrop-blur-xl border-b border-border"
        )}
      >
        <div className="max-w-[1800px] mx-auto px-5 lg:px-10 h-16 lg:h-[72px] flex items-center justify-between">
          {/* Left: Nav links (desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-200",
                  pathname === link.href
                    ? isTransparent
                      ? "text-white"
                      : isKidsContext
                      ? "text-kids-coral"
                      : "text-foreground"
                    : isTransparent
                    ? "text-white/60 hover:text-white"
                    : isKidsContext
                    ? "text-kids-text/40 hover:text-kids-text"
                    : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Center: Logo */}
          <Link href="/" className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <div className="relative h-10 w-28 lg:h-12 lg:w-32">
              <Image
                src={isTransparent ? "/logo-white.png" : "/logo-dark.png"}
                alt="HL Models"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Right: Secondary links + Menu */}
          <div className="flex items-center gap-5">
            {SECONDARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "hidden lg:block nav-link text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-200",
                  pathname === link.href
                    ? isTransparent ? "text-white" : "text-foreground"
                    : isTransparent
                    ? "text-white/60 hover:text-white"
                    : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/faca-parte"
              className={cn(
                "hidden lg:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] font-medium px-4 py-2 border rounded-full transition-all duration-300",
                isTransparent
                  ? "border-white/30 text-white/80 hover:bg-white hover:text-foreground"
                  : isKidsContext
                  ? "border-kids-coral/40 text-kids-coral hover:bg-kids-coral hover:text-white"
                  : "border-foreground/20 text-foreground hover:bg-foreground hover:text-white"
              )}
            >
              Faça Parte
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className={cn(
                "flex items-center gap-2 transition-colors duration-200",
                isTransparent
                  ? "text-white/80 hover:text-white"
                  : isKidsContext
                  ? "text-kids-text/60 hover:text-kids-text"
                  : "text-muted hover:text-foreground"
              )}
              aria-label="Abrir menu"
            >
              <span className="hidden sm:block text-[11px] uppercase tracking-[0.15em] font-medium">Menu</span>
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* ===== FULLSCREEN MENU OVERLAY ===== */}
      <div
        className={cn(
          "fixed inset-0 z-[100] transition-all duration-600",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="h-full flex flex-col lg:flex-row bg-foreground">
          {/* LEFT SIDE: Navigation */}
          <div className="flex-1 flex flex-col">
            {/* Menu top bar */}
            <div className="px-5 lg:px-10 h-16 lg:h-[72px] flex items-center justify-between shrink-0 border-b border-white/5">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <div className="relative h-10 w-28">
                  <Image src="/logo-white.png" alt="HL Models" fill className="object-contain object-left" priority />
                </div>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                aria-label="Fechar menu"
              >
                <span className="text-[11px] uppercase tracking-[0.15em]">Fechar</span>
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 flex flex-col justify-center px-5 lg:px-10 xl:px-14">
              {/* Categories label */}
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-4 lg:mb-6">
                Categorias
              </p>

              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="group flex items-center gap-4 py-2 lg:py-2.5"
                  >
                    <span className={cn(
                      "text-[10px] tabular-nums w-5 transition-colors",
                      isActive ? "text-white/60" : "text-white/15 group-hover:text-white/40"
                    )}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn(
                      "font-display text-3xl md:text-4xl lg:text-[2.8rem] font-light tracking-tight transition-all duration-300",
                      "group-hover:translate-x-3",
                      isActive
                        ? "text-white"
                        : "text-white/20 group-hover:text-white/80"
                    )}>
                      {link.label}
                    </span>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 text-white/40"
                    />
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="w-12 h-px bg-white/10 my-4 lg:my-6" />

              {/* Secondary links */}
              {[...SECONDARY_LINKS, { href: "/faca-parte", label: "Faça Parte" }, { href: "/contato", label: "Contato" }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 py-1.5",
                    pathname === link.href ? "text-white/70" : "text-white/25 hover:text-white/60"
                  )}
                >
                  <span className="text-sm tracking-wide transition-all duration-200 group-hover:translate-x-1">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Menu footer */}
            <div className="px-5 lg:px-10 py-4 flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/15 shrink-0 border-t border-white/5">
              <span>São Paulo, SP</span>
              <a
                href="https://instagram.com/hlmodels"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/40 transition-colors"
              >
                @hlmodels
              </a>
              <a href="tel:+5511953506752" className="hover:text-white/40 transition-colors">
                (11) 95350-6752
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Image preview (desktop only) */}
          <div className="hidden lg:block w-[42%] relative overflow-hidden">
            {/* Default state — no hover */}
            <div className={cn(
              "absolute inset-0 transition-opacity duration-600",
              previewSrc ? "opacity-0" : "opacity-100",
              "bg-neutral-900"
            )}>
              <div className="flex items-center justify-center h-full">
                <div className="relative h-16 w-36 opacity-10">
                  <Image src="/logo-white.png" alt="" fill className="object-contain" />
                </div>
              </div>
            </div>

            {/* Preview image on category hover */}
            {previewSrc && (
              <Image
                src={previewSrc}
                alt="Preview"
                fill
                className="object-cover transition-all duration-700 scale-105"
                sizes="42vw"
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/20 to-transparent" />

            {/* Category label overlay */}
            {hoveredLink && CATEGORY_MAP[hoveredLink] && (
              <div className="absolute bottom-10 left-10 z-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
                  Explore
                </p>
                <p className="font-display text-4xl font-light text-white tracking-tight">
                  {NAV_LINKS.find(l => l.href === hoveredLink)?.label}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
