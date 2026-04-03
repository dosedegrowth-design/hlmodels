import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a HL Models, agência de modelos profissional em São Paulo. Trabalhamos com diversidade, autenticidade e excelência no mercado da moda.",
  alternates: { canonical: "https://hlmodels.vercel.app/sobre" },
};

export default function SobrePage() {
  return (
    <div className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12">
        Sobre
      </h1>

      <div className="space-y-6 text-muted leading-relaxed">
        <p>
          A <strong className="text-foreground">HL Models</strong> é uma agência
          de modelos dedicada a conectar talentos excepcionais a oportunidades no
          mercado da moda e publicidade.
        </p>
        <p>
          Trabalhamos com modelos masculinos, femininos e não-binários,
          valorizando a diversidade e a autenticidade de cada talento que
          representa nossa agência.
        </p>
        <p>
          Nossa missão é desenvolver carreiras, oferecer acompanhamento
          profissional e criar conexões duradouras entre modelos e clientes.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="text-center">
          <p className="text-4xl font-light mb-2">+100</p>
          <p className="text-xs uppercase tracking-widest text-muted">
            Modelos
          </p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-light mb-2">+50</p>
          <p className="text-xs uppercase tracking-widest text-muted">
            Clientes atendidos
          </p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-light mb-2">+200</p>
          <p className="text-xs uppercase tracking-widest text-muted">
            Jobs realizados
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/contato"
          className="inline-block px-10 py-4 bg-foreground text-white text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors"
        >
          Entre em contato
        </Link>
      </div>
    </div>
  );
}
