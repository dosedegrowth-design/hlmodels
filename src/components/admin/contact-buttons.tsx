"use client";

import { Phone, MessageCircle, Mail } from "lucide-react";

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function formatWhatsAppUrl(phone: string, nome?: string): string {
  const clean = cleanPhone(phone);
  const number = clean.startsWith("55") ? clean : `55${clean}`;
  const text = nome
    ? encodeURIComponent(`Ola ${nome}, tudo bem? Aqui e da HL Models.`)
    : "";
  return `https://wa.me/${number}${text ? `?text=${text}` : ""}`;
}

interface ContactButtonsProps {
  telefone?: string | null;
  email?: string | null;
  nome?: string;
}

export function ContactButtons({ telefone, email, nome }: ContactButtonsProps) {
  if (!telefone && !email) return null;

  return (
    <div className="flex items-center gap-1.5 mt-2">
      {telefone && (
        <>
          <a
            href={formatWhatsAppUrl(telefone, nome)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-[11px] font-medium rounded-lg hover:bg-green-700 transition-colors"
            title={`WhatsApp: ${telefone}`}
          >
            <MessageCircle size={13} />
            WhatsApp
          </a>
          <a
            href={`tel:${cleanPhone(telefone)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[11px] font-medium rounded-lg hover:bg-blue-700 transition-colors"
            title={`Ligar: ${telefone}`}
          >
            <Phone size={13} />
            Ligar
          </a>
        </>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-600 text-white text-[11px] font-medium rounded-lg hover:bg-neutral-700 transition-colors"
          title={`Email: ${email}`}
        >
          <Mail size={13} />
          Email
        </a>
      )}
    </div>
  );
}
