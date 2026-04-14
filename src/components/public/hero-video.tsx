"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder video from Pexels (fashion/model theme, free to use)
const HERO_VIDEO_URL =
  "https://videos.pexels.com/video-files/5765206/5765206-uhd_2560_1440_24fps.mp4";

// Fallback image if video fails
const HERO_FALLBACK_IMAGE =
  "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920";

export function HeroVideo() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video background */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            videoLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
      )}

      {/* Fallback image (shown while video loads or on error) */}
      {(!videoLoaded || videoError) && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_FALLBACK_IMAGE})` }}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content — centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Main title */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white uppercase tracking-[0.12em] leading-[0.9]">
          HL Models
        </h1>

        {/* Tagline */}
        <p className="mt-4 md:mt-6 text-[11px] md:text-xs uppercase tracking-[0.35em] text-white/50 font-light max-w-md">
          Agência de talentos &mdash; São Paulo
        </p>

        {/* CTA */}
        <Link
          href="/faca-parte"
          className="mt-8 md:mt-10 inline-flex items-center gap-2 px-6 py-3 border border-white/25 text-[11px] uppercase tracking-[0.2em] text-white/80 hover:bg-white hover:text-foreground transition-all duration-500 rounded-sm"
        >
          Faça Parte
        </Link>
      </div>

      {/* Bottom: scroll indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
        aria-label="Rolar para conteúdo"
      >
        <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown size={18} strokeWidth={1} className="animate-scroll-hint" />
      </button>

      {/* Bottom-right: mute/unmute */}
      {!videoError && videoLoaded && (
        <button
          onClick={() => setMuted(!muted)}
          className="absolute bottom-8 right-8 z-10 p-2 text-white/30 hover:text-white/60 transition-colors"
          aria-label={muted ? "Ativar som" : "Silenciar"}
        >
          {muted ? <VolumeX size={16} strokeWidth={1.5} /> : <Volume2 size={16} strokeWidth={1.5} />}
        </button>
      )}

      {/* Bottom-left: WhatsApp link */}
      <a
        href="https://wa.me/5511953506752?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20HL%20Models."
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 left-8 z-10 text-[10px] uppercase tracking-[0.2em] text-white/25 hover:text-white/50 transition-colors hidden md:block"
      >
        WhatsApp
      </a>
    </section>
  );
}
