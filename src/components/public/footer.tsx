"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AtSign, Phone, Mail, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const KIDS_PATHS = ["/baby", "/kids", "/teens"];

export function Footer() {
  const pathname = usePathname();
  const isKidsPage = KIDS_PATHS.includes(pathname);

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

  // Hide on admin and marcas routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/marcas")) {
    return null;
  }

  const isKidsContext = isKidsPage || isKidsModel;

  if (isKidsContext) {
    return (
      <footer className="bg-[#3D3D3D] text-white">
        <div className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
              {/* Col 1 — Logo */}
              <div>
                <div className="relative h-16 w-44 mb-3">
                  <Image
                    src="/logo-white.png"
                    alt="HL Models Agency"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-3">
                  Agencia de talentos
                </p>
              </div>

              {/* Col 2 — Navegacao */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-4">
                  Navegacao
                </p>
                <div className="space-y-2">
                  <Link href="/" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Home</Link>
                  <Link href="/projetos" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Projetos</Link>
                  <Link href="/sobre" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Sobre</Link>
                  <Link href="/faca-parte" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Faca Parte</Link>
                  <Link href="/contato" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Contato</Link>
                </div>
              </div>

              {/* Col 3 — Categorias */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-4">
                  Categorias
                </p>
                <div className="space-y-2">
                  <Link href="/mulher" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Mulher</Link>
                  <Link href="/homem" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Homem</Link>
                  <Link href="/nao-binario" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Nao Binario</Link>
                  <Link href="/baby" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Baby</Link>
                  <Link href="/kids" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Kids</Link>
                  <Link href="/teens" className="block text-sm text-white/40 hover:text-kids-cream transition-colors">Teens</Link>
                </div>
              </div>

              {/* Col 4 — Contato */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-4">
                  Contato
                </p>
                <div className="space-y-3">
                  <a
                    href="https://instagram.com/hlmodels"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-kids-cream transition-colors"
                  >
                    <AtSign size={14} />
                    @hlmodels
                  </a>
                  <a
                    href="tel:+5511953506752"
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-kids-cream transition-colors"
                  >
                    <Phone size={14} />
                    (11) 95350-6752
                  </a>
                  <a
                    href="mailto:hlmodels@outlook.com"
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-kids-cream transition-colors"
                  >
                    <Mail size={14} />
                    hlmodels@outlook.com
                  </a>
                  <p className="flex items-start gap-2 text-sm text-white/40">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    Sao Bernardo do Campo, SP
                  </p>
                  <div className="pt-3">
                    <Link
                      href="/marcas/login"
                      className="text-[10px] uppercase tracking-[0.2em] text-white/25 hover:text-kids-cream transition-colors"
                    >
                      Portal de Marcas
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-[10px] text-white/20">
                &copy; {new Date().getFullYear()} HL Models. Todos os direitos reservados.
              </p>
              <p className="text-[10px] text-white/15">
                Dose de Growth
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Default fashion footer
  return (
    <footer className="bg-foreground text-white">
      <div className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            {/* Col 1 — Logo */}
            <div>
              <div className="relative h-16 w-44 mb-3">
                <Image
                  src="/logo-white.png"
                  alt="HL Models Agency"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-3">
                Agencia de talentos
              </p>
            </div>

            {/* Col 2 — Navegacao */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-4">
                Navegacao
              </p>
              <div className="space-y-2">
                <Link href="/" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Home</Link>
                <Link href="/projetos" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Projetos</Link>
                <Link href="/sobre" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Sobre</Link>
                <Link href="/faca-parte" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Faca Parte</Link>
                <Link href="/contato" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Contato</Link>
              </div>
            </div>

            {/* Col 3 — Categorias */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-4">
                Categorias
              </p>
              <div className="space-y-2">
                <Link href="/mulher" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Mulher</Link>
                <Link href="/homem" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Homem</Link>
                <Link href="/nao-binario" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Nao Binario</Link>
                <Link href="/baby" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Baby</Link>
                <Link href="/kids" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Kids</Link>
                <Link href="/teens" className="block text-sm text-white/40 hover:text-white/80 transition-colors">Teens</Link>
              </div>
            </div>

            {/* Col 4 — Contato */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-4">
                Contato
              </p>
              <div className="space-y-3">
                <a
                  href="https://instagram.com/hlmodels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors"
                >
                  <AtSign size={14} />
                  @hlmodels
                </a>
                <a
                  href="tel:+5511953506752"
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors"
                >
                  <Phone size={14} />
                  (11) 95350-6752
                </a>
                <a
                  href="mailto:hlmodels@outlook.com"
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors"
                >
                  <Mail size={14} />
                  hlmodels@outlook.com
                </a>
                <p className="flex items-start gap-2 text-sm text-white/40">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  Sao Bernardo do Campo, SP
                </p>
                <div className="pt-3">
                  <Link
                    href="/marcas/login"
                    className="text-[10px] uppercase tracking-[0.2em] text-white/25 hover:text-white/60 transition-colors"
                  >
                    Portal de Marcas
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-[10px] text-white/20">
              &copy; {new Date().getFullYear()} HL Models. Todos os direitos reservados.
            </p>
            <p className="text-[10px] text-white/15">
              Dose de Growth
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
