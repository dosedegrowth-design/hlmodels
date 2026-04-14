"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

// Video local (provisório) — trocar por vídeo institucional do cliente depois
const HERO_VIDEO_URL = "/hero-video.mp4";

export function HeroVideo() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy load: only start loading video after page is interactive
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    // Small delay to prioritize page paint first
    const timer = setTimeout(() => setShouldLoad(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !muted;
      videoRef.current.muted = newMuted;
      setMuted(newMuted);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video background — preload metadata only, lazy src */}
      {shouldLoad && !videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
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

      {/* Loading state / fallback — elegant dark gradient */}
      {(!videoLoaded || videoError) && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-800" />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content — centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Main title */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white uppercase tracking-[0.1em] leading-[0.9]">
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
          onClick={toggleMute}
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
