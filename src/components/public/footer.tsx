"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AtSign, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on admin and marcas portal
  if (pathname.startsWith("/admin") || pathname.startsWith("/marcas")) {
    return null;
  }

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-4">
              HL MODELS
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Agência de modelos profissional. Conectamos talentos a
              oportunidades no mundo da moda e publicidade.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest mb-4 text-white/40">
              Navegação
            </h4>
            <div className="space-y-2">
              <Link href="/sobre" className="block text-sm text-white/60 hover:text-white transition-colors">Sobre</Link>
              <Link href="/homem" className="block text-sm text-white/60 hover:text-white transition-colors">Homem</Link>
              <Link href="/mulher" className="block text-sm text-white/60 hover:text-white transition-colors">Mulher</Link>
              <Link href="/nao-binario" className="block text-sm text-white/60 hover:text-white transition-colors">Não Binário</Link>
              <Link href="/faca-parte" className="block text-sm text-white/60 hover:text-white transition-colors">Faça Parte</Link>
              <Link href="/marcas/login" className="block text-sm text-white/60 hover:text-white transition-colors">Portal de Marcas</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-widest mb-4 text-white/40">
              Contato
            </h4>
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
                <MapPin size={16} className="mt-0.5 shrink-0" />São Paulo, SP
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
