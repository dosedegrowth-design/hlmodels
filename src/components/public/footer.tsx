"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AtSign, Phone, Mail, MapPin, Star } from "lucide-react";

const KIDS_PATHS = ["/baby", "/kids", "/teens"];

export function Footer() {
  const pathname = usePathname();
  const isKidsPage = KIDS_PATHS.includes(pathname);

  if (pathname.startsWith("/admin") || pathname.startsWith("/marcas")) {
    return null;
  }

  if (isKidsPage) {
    return (
      <footer className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-kids-pink/10 via-kids-purple/10 to-kids-sky/10" />
        <div className="h-1 bg-gradient-to-r from-kids-pink via-kids-purple to-kids-sky" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <div className="relative h-14 w-36 mb-4">
                <Image src="/logo-dark.png" alt="HL Models Agency" fill className="object-contain object-left" />
              </div>
              <p className="text-foreground/50 text-sm leading-relaxed">
                Agencia de modelos para todas as idades. Conectamos talentos a oportunidades.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-2.5 py-1 bg-kids-pink/15 text-kids-coral text-[10px] font-medium rounded-full">Baby</span>
                <span className="px-2.5 py-1 bg-kids-purple/15 text-kids-purple text-[10px] font-medium rounded-full">Kids</span>
                <span className="px-2.5 py-1 bg-kids-sky/15 text-kids-sky text-[10px] font-medium rounded-full">Teens</span>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm uppercase tracking-widest mb-4 text-foreground/30">
                Categorias
              </h4>
              <div className="space-y-2">
                <Link href="/baby" className="flex items-center gap-2 text-sm text-foreground/50 hover:text-kids-coral transition-colors">
                  <Star size={10} className="text-kids-pink" /> Baby
                </Link>
                <Link href="/kids" className="flex items-center gap-2 text-sm text-foreground/50 hover:text-kids-purple transition-colors">
                  <Star size={10} className="text-kids-purple" /> Kids
                </Link>
                <Link href="/teens" className="flex items-center gap-2 text-sm text-foreground/50 hover:text-kids-sky transition-colors">
                  <Star size={10} className="text-kids-sky" /> Teens
                </Link>
                <div className="h-2" />
                <Link href="/mulher" className="block text-sm text-foreground/30 hover:text-foreground/60 transition-colors">Mulher</Link>
                <Link href="/homem" className="block text-sm text-foreground/30 hover:text-foreground/60 transition-colors">Homem</Link>
                <Link href="/faca-parte" className="block text-sm text-foreground/30 hover:text-foreground/60 transition-colors">Faca Parte</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm uppercase tracking-widest mb-4 text-foreground/30">
                Contato
              </h4>
              <div className="space-y-3">
                <a href="https://instagram.com/hlmodels" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground/50 hover:text-kids-purple transition-colors">
                  <AtSign size={16} />@hlmodels
                </a>
                <a href="tel:+5511999999999"
                  className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors">
                  <Phone size={16} />(11) 99999-9999
                </a>
                <a href="mailto:contato@hlmodels.com.br"
                  className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors">
                  <Mail size={16} />contato@hlmodels.com.br
                </a>
                <p className="flex items-start gap-2 text-sm text-foreground/50">
                  <MapPin size={16} className="mt-0.5 shrink-0" />Sao Paulo, SP
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-foreground/5 text-center text-sm text-foreground/30">
            &copy; {new Date().getFullYear()} HL Models. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    );
  }

  // Default fashion footer
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="relative h-14 w-36 mb-4">
              <Image src="/logo-white.png" alt="HL Models Agency" fill className="object-contain object-left" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Agencia de modelos profissional. Conectamos talentos a oportunidades no mundo da moda e publicidade.
            </p>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-widest mb-4 text-white/40">Navegacao</h4>
            <div className="space-y-2">
              <Link href="/sobre" className="block text-sm text-white/60 hover:text-white transition-colors">Sobre</Link>
              <Link href="/homem" className="block text-sm text-white/60 hover:text-white transition-colors">Homem</Link>
              <Link href="/mulher" className="block text-sm text-white/60 hover:text-white transition-colors">Mulher</Link>
              <Link href="/nao-binario" className="block text-sm text-white/60 hover:text-white transition-colors">Nao Binario</Link>
              <Link href="/baby" className="block text-sm text-white/60 hover:text-white transition-colors">Baby / Kids / Teens</Link>
              <Link href="/faca-parte" className="block text-sm text-white/60 hover:text-white transition-colors">Faca Parte</Link>
              <Link href="/marcas/login" className="block text-sm text-white/60 hover:text-white transition-colors">Portal de Marcas</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-widest mb-4 text-white/40">Contato</h4>
            <div className="space-y-3">
              <a href="https://instagram.com/hlmodels" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <AtSign size={16} />@hlmodels
              </a>
              <a href="tel:+5511999999999" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone size={16} />(11) 99999-9999
              </a>
              <a href="mailto:contato@hlmodels.com.br" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail size={16} />contato@hlmodels.com.br
              </a>
              <p className="flex items-start gap-2 text-sm text-white/60">
                <MapPin size={16} className="mt-0.5 shrink-0" />Sao Paulo, SP
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} HL Models. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
