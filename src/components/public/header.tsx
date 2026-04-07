"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, Star, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/", label: "Home", kids: false },
  { href: "/mulher", label: "Mulher", kids: false },
  { href: "/homem", label: "Homem", kids: false },
  { href: "/nao-binario", label: "Nao Binario", kids: false },
  { href: "/baby", label: "Baby", kids: true },
  { href: "/kids", label: "Kids", kids: true },
  { href: "/teens", label: "Teens", kids: true },
  { href: "/projetos", label: "Projetos", kids: false },
  { href: "/faca-parte", label: "Faca Parte", kids: false },
  { href: "/contato", label: "Contato", kids: false },
];

const KIDS_PATHS = ["/baby", "/kids", "/teens"];

// Map nav items to category for image preview
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

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load preview images when menu opens
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

  // Detect if current modelo page is a kids model
  const [isKidsModel, setIsKidsModel] = useState(false);

  useEffect(() => {
    // Check if we're on /modelo/[slug] and if that model is kids category
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
          if (data && ["baby", "kids", "teens"].includes(data.categoria)) {
            setIsKidsModel(true);
          } else {
            setIsKidsModel(false);
          }
        });
    } else {
      setIsKidsModel(false);
    }
  }, [pathname]);

  if (isAdmin || isMarcas) return null;

  const isKidsContext = isKidsPage || isKidsModel;

  const getHeaderBg = () => {
    if (!scrolled && isHome) return "bg-transparent";
    if (isKidsContext) return "bg-[#FFF0E8] backdrop-blur-sm border-b border-[#F1755C]/10";
    return "bg-white/95 backdrop-blur-sm";
  };

  const getTextColor = () => {
    if (!scrolled && isHome) return "text-white";
    if (isKidsContext) return "text-[#8E6FBF]";
    return "text-foreground";
  };

  const getLogoSrc = () => {
    if (!scrolled && isHome) return "/logo-white.png";
    return "/logo-dark.png";
  };

  // Get preview image for hovered link
  const hoveredCategory = hoveredLink ? CATEGORY_MAP[hoveredLink] : null;
  const previewSrc = hoveredCategory ? previewImages[hoveredCategory] : null;

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", getHeaderBg())}>
        {isKidsContext && (
          <div className="h-1 bg-gradient-to-r from-[#F1755C] via-[#A1BCA6] to-[#3A6084]" />
        )}
        <div className="px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
          {/* Left: CTA button */}
          <div className="w-32 hidden lg:block">
            <Link
              href="/faca-parte"
              className={cn(
                "px-4 py-2 text-[10px] uppercase tracking-widest rounded-full border transition-all hover:scale-105",
                isKidsContext
                  ? "border-[#F1755C] text-[#F1755C] hover:bg-[#F1755C] hover:text-white"
                  : scrolled || !isHome
                  ? "border-foreground text-foreground hover:bg-foreground hover:text-white"
                  : "border-white/60 text-white hover:bg-white hover:text-foreground"
              )}
            >
              Cadastre-se
            </Link>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="relative h-14 w-36 lg:h-16 lg:w-44">
            <Image src={getLogoSrc()} alt="HL Models Agency" fill className="object-contain" priority />
          </Link>

          {/* Right: Menu button */}
          <div className="w-32 flex items-center justify-end">
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

      {/* Fullscreen menu overlay — SPLIT LAYOUT */}
      <div
        className={cn(
          "fixed inset-0 z-[100] transition-all duration-500",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          isKidsPage ? "bg-white" : "bg-foreground"
        )}
      >
        {isKidsPage && (
          <div className="h-1 bg-gradient-to-r from-[#F2919B] via-[#8E6FBF] to-[#6DB8D4]" />
        )}

        <div className="h-full flex flex-col lg:flex-row">
          {/* LEFT: Navigation links */}
          <div className="flex-1 flex flex-col">
            {/* Menu header */}
            <div className="px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between shrink-0">
              <Link href="/" onClick={() => setMenuOpen(false)} className="relative h-12 w-32">
                <Image
                  src={isKidsPage ? "/logo-dark.png" : "/logo-white.png"}
                  alt="HL Models" fill className="object-contain object-left" priority
                />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 text-xs uppercase tracking-widest transition-colors lg:hidden",
                  isKidsPage ? "text-foreground/60" : "text-white/60"
                )}
              >
                <X size={22} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 flex flex-col justify-center px-6 lg:px-12 gap-0">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={cn(
                      "group flex items-center gap-3 py-1.5 lg:py-2 transition-all duration-200",
                    )}
                  >
                    {/* Number */}
                    <span className={cn(
                      "text-[10px] w-6 tabular-nums",
                      isKidsPage
                        ? isActive ? "text-[#8E6FBF]" : "text-foreground/20"
                        : isActive ? "text-white" : "text-white/20"
                    )}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Label */}
                    <span className={cn(
                      "text-2xl md:text-3xl lg:text-4xl font-light tracking-tight transition-all duration-200 group-hover:tracking-wider group-hover:translate-x-2",
                      isKidsPage
                        ? isActive
                          ? "text-[#8E6FBF]"
                          : link.kids
                          ? "text-[#F2919B]/50 group-hover:text-[#8E6FBF]"
                          : "text-foreground/20 group-hover:text-foreground/60"
                        : isActive
                        ? "text-white"
                        : "text-white/25 group-hover:text-white/80"
                    )}>
                      {link.kids && isKidsPage && <Star size={10} className="inline-block mr-1.5 mb-1 text-[#FFD600]" />}
                      {link.label}
                    </span>

                    {/* Arrow on hover */}
                    <ArrowRight size={16} className={cn(
                      "opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0",
                      isKidsPage ? "text-[#8E6FBF]" : "text-white/50"
                    )} />
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className={cn(
              "px-6 lg:px-12 py-4 flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] shrink-0",
              isKidsPage ? "text-foreground/20" : "text-white/20"
            )}>
              <span>Sao Paulo, SP</span>
              <a href="https://instagram.com/hlmodels" target="_blank" rel="noopener noreferrer"
                className={isKidsPage ? "hover:text-foreground/40" : "hover:text-white/40"}>
                @hlmodels
              </a>
            </div>
          </div>

          {/* RIGHT: Image preview (desktop only) */}
          <div className="hidden lg:block w-[45%] relative overflow-hidden">
            {/* Close button on image side */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 z-20 flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              Fechar <X size={18} />
            </button>

            {/* Default / fallback background */}
            <div className={cn(
              "absolute inset-0 transition-opacity duration-500",
              previewSrc ? "opacity-0" : "opacity-100",
              isKidsPage
                ? "bg-gradient-to-br from-[#F2919B]/30 via-[#8E6FBF]/20 to-[#6DB8D4]/30"
                : "bg-neutral-900"
            )}>
              <div className="flex items-center justify-center h-full">
                <div className="relative h-20 w-40 opacity-20">
                  <Image
                    src={isKidsPage ? "/logo-dark.png" : "/logo-white.png"}
                    alt="" fill className="object-contain" />
                </div>
              </div>
            </div>

            {/* Preview image */}
            {previewSrc && (
              <Image
                src={previewSrc}
                alt="Preview"
                fill
                className="object-cover transition-all duration-700"
                sizes="45vw"
              />
            )}

            {/* Overlay on image */}
            <div className={cn(
              "absolute inset-0 transition-opacity duration-500",
              isKidsPage
                ? "bg-gradient-to-l from-transparent to-white/30"
                : "bg-gradient-to-l from-transparent to-foreground/50"
            )} />

            {/* Hovered category label */}
            {hoveredLink && CATEGORY_MAP[hoveredLink] && (
              <div className="absolute bottom-8 left-8 z-10">
                <p className={cn(
                  "text-xs uppercase tracking-[0.3em] mb-1",
                  isKidsPage ? "text-foreground/50" : "text-white/50"
                )}>
                  Explore
                </p>
                <p className={cn(
                  "text-3xl font-light tracking-tight",
                  isKidsPage ? "text-foreground" : "text-white"
                )}>
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
