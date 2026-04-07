"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const TABS = [
  {
    key: "missao",
    label: "Missao",
    text: "Revelar talentos, valorizar identidades e conectar pessoas e marcas por meio de experiencias visuais autenticas, campanhas marcantes e relacoes de confianca.",
  },
  {
    key: "visao",
    label: "Visao",
    text: "Ser referencia no mercado de agenciamento de modelos e talentos, reconhecida pela excelencia, diversidade e pela capacidade de transformar sonhos em realidade.",
  },
  {
    key: "valores",
    label: "Valores",
    text: "Autenticidade, diversidade, profissionalismo, etica, criatividade e resultado. Somos movidos por paixao e acreditamos no poder da imagem e da presenca para contar historias inesqueciveis.",
  },
];

export function AboutSection() {
  const [activeTab, setActiveTab] = useState("missao");
  const currentTab = TABS.find((t) => t.key === activeTab) ?? TABS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: image + text */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-kids-coral mb-3 font-medium">
          Quem somos
        </p>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
          Sobre Nos
        </h2>
        <p className="text-foreground/70 leading-relaxed mb-4">
          Somos uma agencia de talentos e campanhas que acredita no poder da imagem e da presenca para contar historias inesqueciveis.
        </p>
        <p className="text-foreground/70 leading-relaxed mb-4">
          Nascemos da paixao por conectar marcas, pessoas e oportunidades com autenticidade, diversidade e profissionalismo.
        </p>
        <p className="text-foreground/60 leading-relaxed text-sm">
          Nossos talentos ja brilharam em campanhas para grandes marcas, editoriais, comerciais, novelas, videoclipes, catalogos e desfiles. Nossa missao e simples: descobrir, valorizar e lancar talentos reais, com verdade, planejamento e proposito.
        </p>
      </div>

      {/* Right: Tabs Missao/Visao/Valores */}
      <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
        <h3 className="text-sm font-medium uppercase tracking-widest text-muted mb-6">
          Nossos ideais
        </h3>

        {/* Tab buttons */}
        <div className="flex border-b border-border mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 pb-3 text-sm font-medium transition-all border-b-2 -mb-px",
                activeTab === tab.key
                  ? "border-kids-coral text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <p className="text-foreground/70 leading-relaxed">
          {currentTab.text}
        </p>
      </div>
    </div>
  );
}
