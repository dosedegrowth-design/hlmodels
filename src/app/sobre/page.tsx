import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheca a HL Models, agencia de talentos e campanhas em Sao Bernardo do Campo. Diversidade, autenticidade e profissionalismo no mercado da moda e publicidade.",
  alternates: { canonical: "https://hlmodels.vercel.app/sobre" },
};

export default function SobrePage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pb-24 text-center px-4 md:px-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
          Quem somos
        </p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
          Sobre Nos
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-muted leading-relaxed mt-6">
          Somos uma agencia de talentos e campanhas que acredita no poder da
          imagem e da presenca para contar historias inesqueciveis. Nascemos da
          paixao por conectar marcas, pessoas e oportunidades com autenticidade,
          diversidade e profissionalismo.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-surface py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="font-display text-4xl md:text-5xl font-light">+100</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted mt-2">Modelos</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl md:text-5xl font-light">+50</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted mt-2">Clientes</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl md:text-5xl font-light">+200</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted mt-2">Trabalhos</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl md:text-5xl font-light">6</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted mt-2">Categorias</p>
            </div>
          </div>
        </div>
      </section>

      {/* Missao / Visao / Valores */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="text-left">
            <h2 className="font-display text-2xl font-light mb-4">Missao</h2>
            <p className="text-sm text-muted leading-relaxed">
              Conectar talentos unicos a oportunidades no mundo da moda e
              publicidade. Revelar identidades, valorizar historias e construir
              carreiras com etica, planejamento e proposito.
            </p>
          </div>
          <div className="text-left">
            <h2 className="font-display text-2xl font-light mb-4">Visao</h2>
            <p className="text-sm text-muted leading-relaxed">
              Ser referencia em gestao de modelos e talentos, reconhecida pela
              excelencia, diversidade e pela capacidade de transformar sonhos em
              realidade no mercado da moda e publicidade.
            </p>
          </div>
          <div className="text-left">
            <h2 className="font-display text-2xl font-light mb-4">Valores</h2>
            <p className="text-sm text-muted leading-relaxed">
              Diversidade, profissionalismo, transparencia, etica e
              criatividade. Acreditamos no poder da autenticidade e da presenca
              para contar historias inesqueciveis.
            </p>
          </div>
        </div>
      </section>

      {/* Como Participar */}
      <section className="bg-foreground text-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-4xl font-light text-white mb-12 text-center">
            Como Participar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-5xl font-display text-white/10 mb-3">01</p>
              <p className="text-sm uppercase tracking-wide text-white mb-2">
                Inscreva-se
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Preencha o formulario de candidatura com seus dados e fotos.
                Fotos naturais, sem filtros, mostrando rosto e corpo inteiro.
              </p>
            </div>
            <div>
              <p className="text-5xl font-display text-white/10 mb-3">02</p>
              <p className="text-sm uppercase tracking-wide text-white mb-2">
                Avaliacao
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Nossa equipe analisa seu perfil com atencao. Se aprovado,
                entraremos em contato para os proximos passos.
              </p>
            </div>
            <div>
              <p className="text-5xl font-display text-white/10 mb-3">03</p>
              <p className="text-sm uppercase tracking-wide text-white mb-2">
                Aprovacao
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Se aprovado, voce entra para nosso casting e comeca a receber
                oportunidades de trabalho com marcas parceiras.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link
              href="/faca-parte"
              className="inline-block border border-white/25 text-white text-[11px] uppercase tracking-wide px-6 py-3 hover:bg-white/10 transition-colors"
            >
              Inscreva-se agora
            </Link>
          </div>
        </div>
      </section>

      {/* Quality note */}
      <section className="py-16 text-center px-4 md:px-6">
        <p className="text-xs text-muted max-w-lg mx-auto leading-relaxed">
          A HL Models Agency preza pela qualidade e profissionalismo de todos os
          materiais recebidos. Disponibilizamos estudios parceiros caso deseje
          realizar um book profissional.
        </p>
      </section>
    </div>
  );
}
