import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Star, Users, Briefcase, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheca a HL Models, agencia de talentos e campanhas em Sao Bernardo do Campo. Diversidade, autenticidade e profissionalismo no mercado da moda e publicidade.",
  alternates: { canonical: "https://hlmodels.vercel.app/sobre" },
};

export default function SobrePage() {
  return (
    <div className="pt-24 lg:pt-28 pb-20">
      {/* Hero */}
      <section className="px-6 lg:px-10 max-w-[1200px] mx-auto mb-20">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#F1755C] mb-3 font-medium">
          Quem somos
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
          Sobre Nos
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-5 text-foreground/70 leading-relaxed">
            <p>
              Somos uma agencia de talentos e campanhas que acredita no poder da imagem e da presenca para contar historias inesqueciveis.
            </p>
            <p>
              Nascemos da paixao por conectar marcas, pessoas e oportunidades com autenticidade, diversidade e profissionalismo.
            </p>
            <p>
              Nossos talentos ja brilharam em campanhas para grandes marcas, editoriais, comerciais, novelas, videoclipes, catalogos e desfiles.
            </p>
            <p>
              Somos movidos por paixao, etica, criatividade e resultado. Nossa missao e simples: descobrir, valorizar e lancar talentos reais, com verdade, planejamento e proposito.
            </p>
          </div>
          <div className="relative aspect-[4/3] bg-neutral-100 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F1755C]/20 via-[#A1BCA6]/20 to-[#3A6084]/20 flex items-center justify-center">
              <div className="relative h-24 w-48">
                <Image src="/logo-dark.png" alt="HL Models" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-foreground text-white py-16 mb-20">
        <div className="px-6 lg:px-10 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "+100", label: "Modelos agenciados" },
              { icon: Briefcase, value: "+50", label: "Clientes atendidos" },
              { icon: Award, value: "+200", label: "Jobs realizados" },
              { icon: Star, value: "6", label: "Categorias" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon size={24} className="mx-auto mb-3 text-white/40" />
                <p className="text-3xl md:text-4xl font-light mb-1">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missao / Visao / Valores */}
      <section className="px-6 lg:px-10 max-w-[1200px] mx-auto mb-20">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-3 text-center">
          Nossos ideais
        </p>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-12 text-center">
          Missao, Visao e Valores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Missao",
              color: "bg-[#F1755C]",
              text: "Revelar talentos, valorizar identidades e conectar pessoas e marcas por meio de experiencias visuais autenticas, campanhas marcantes e relacoes de confianca.",
            },
            {
              title: "Visao",
              color: "bg-[#A1BCA6]",
              text: "Ser referencia no mercado de agenciamento de modelos e talentos, reconhecida pela excelencia, diversidade e pela capacidade de transformar sonhos em realidade.",
            },
            {
              title: "Valores",
              color: "bg-[#3A6084]",
              text: "Autenticidade, diversidade, profissionalismo, etica, criatividade e resultado. Acreditamos no poder da imagem e da presenca para contar historias inesqueciveis.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-border p-8 shadow-sm">
              <div className={`w-10 h-1 ${item.color} rounded-full mb-4`} />
              <h3 className="text-lg font-medium mb-3">{item.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como fazer parte */}
      <section className="px-6 lg:px-10 max-w-[1200px] mx-auto mb-20">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-3 text-center">
          Junte-se a nos
        </p>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-12 text-center">
          Como fazer parte do casting
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              step: "01",
              title: "Cadastre-se",
              text: "Acesse a pagina 'Faca Parte' e envie suas fotos e dados. Fotos naturais, sem filtros, mostrando rosto e corpo inteiro.",
            },
            {
              step: "02",
              title: "Avaliacao",
              text: "Nossa equipe de selecao ira analisar seu perfil. Se aprovado, entraremos em contato para os proximos passos.",
            },
            {
              step: "03",
              title: "Aprovacao",
              text: "Apos aprovado, voce entra para nosso casting e comeca a receber oportunidades de trabalho com marcas parceiras.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-14 h-14 rounded-full bg-foreground text-white flex items-center justify-center mx-auto mb-4 text-lg font-light">
                {item.step}
              </div>
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/faca-parte"
            className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-white text-sm uppercase tracking-widest rounded-xl hover:bg-foreground/90 transition-colors"
          >
            Inscreva-se agora
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Nota */}
      <section className="px-6 lg:px-10 max-w-[800px] mx-auto">
        <div className="bg-neutral-50 rounded-2xl p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-muted mb-3">Nota</p>
          <p className="text-sm text-foreground/60 leading-relaxed">
            A HL Models Agency preza pela qualidade e profissionalismo de todos os materiais recebidos. Se as fotos enviadas nao atenderem aos padroes visuais da agencia, poderemos recusar a submissao. Disponibilizamos estudios parceiros caso deseje realizar um book profissional.
          </p>
        </div>
      </section>
    </div>
  );
}
