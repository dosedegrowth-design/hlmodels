"use client";

import { useEffect, useRef, useState } from "react";

interface CategoryHeroProps {
  title: string;
  count: number;
}

export function CategoryHero({ title, count }: CategoryHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Split title into individual letters for animation
  const letters = title.split("");

  return (
    <section className="relative h-[45vh] md:h-[50vh] overflow-hidden bg-black">
      {/* Video — same as hero, local file */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setVideoLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: videoLoaded ? 0.6 : 0, transition: "opacity 1s ease" }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-16">

        {/* Title — each letter animates individually */}
        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl uppercase tracking-[0.15em] text-white font-normal leading-none">
          {letters.map((letter, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                transform: animate ? "translateY(0%) rotateX(0deg)" : "translateY(80%) rotateX(-40deg)",
                opacity: animate ? 1 : 0,
                transition: `transform 0.9s cubic-bezier(.77,0,.175,1) ${0.05 * i}s, opacity 0.6s ease ${0.04 * i}s`,
                transformOrigin: "bottom center",
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </h1>

        {/* Count */}
        <p
          className="mt-5 text-[10px] uppercase tracking-[0.35em] text-white/40"
          style={{
            transform: animate ? "translateY(0)" : "translateY(20px)",
            opacity: animate ? 1 : 0,
            transition: "all 0.8s cubic-bezier(.77,0,.175,1) 0.6s",
          }}
        >
          {count} modelo{count !== 1 ? "s" : ""}
        </p>

        {/* Line */}
        <div
          className="mt-5 h-px bg-white/25"
          style={{
            width: animate ? 80 : 0,
            transition: "width 1.2s cubic-bezier(.77,0,.175,1) 0.8s",
          }}
        />
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
