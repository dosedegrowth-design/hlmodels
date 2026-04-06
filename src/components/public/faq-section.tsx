"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "Como posso participar do Casting?",
    answer:
      "Para participar do casting da HL Models, basta acessar a pagina 'Faca Parte' no nosso site e preencher o formulario com seus dados e fotos. Nossa equipe de selecao ira analisar seu perfil e entrar em contato.",
  },
  {
    question: "E necessario ter um portfolio pronto para entrar na agencia?",
    answer:
      "Nao e necessario ter um portfolio profissional pronto. Envie fotos naturais, sem filtros, mostrando rosto (frente e perfil) e corpo inteiro. Se voce for aprovado, nossa equipe pode orientar sobre a producao de um book profissional.",
  },
  {
    question: "Como acontece a selecao dos modelos para as campanhas?",
    answer:
      "As marcas parceiras enviam briefings com o perfil desejado. Nossa equipe seleciona os modelos mais adequados do nosso casting e encaminha para aprovacao do cliente. Quando aprovado, o modelo e convocado para o trabalho.",
  },
  {
    question: "Tenho garantia de ser escolhido para trabalhos ao entrar na agencia?",
    answer:
      "Nao ha garantia de trabalhos. A selecao depende dos briefings das marcas e do perfil adequado para cada campanha. Quanto mais completo e profissional for o seu material, maiores as chances de ser selecionado.",
  },
  {
    question: "Preciso pagar algum valor para participar da seletiva?",
    answer:
      "Nao cobramos nenhum valor para participar da seletiva. A candidatura e totalmente gratuita. Disponibilizamos estudios parceiros caso o modelo queira realizar um book profissional, mas isso e opcional.",
  },
  {
    question: "A agencia trabalha com quais faixas etarias?",
    answer:
      "Trabalhamos com todas as faixas etarias: Baby (ate 5 anos), Kids (5 a 15 anos), Teens (15 a 18 anos), e adultos (Mulher, Homem e Nao Binario). Cada categoria tem seu proprio casting e oportunidades.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="border border-border rounded-xl overflow-hidden bg-white"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-neutral-50 transition-colors"
            >
              <span className="text-sm md:text-base font-medium pr-4">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={cn(
                  "shrink-0 text-muted transition-transform duration-300",
                  openIndex === i && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <p className="px-6 pb-5 text-sm text-muted leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
