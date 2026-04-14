"use client";

import { useEffect, useRef, useState } from "react";

interface CategoryHeroProps {
  title: string;
  count: number;
  videoUrl?: string;
  fallbackColor?: string;
}

// Placeholder videos por categoria (curtos, leves, fashion/lifestyle)
const CATEGORY_VIDEOS: Record<string, string> = {
  Mulher: "https://videos.pexels.com/video-files/3771879/3771879-uhd_2560_1440_24fps.mp4",
  Homem: "https://videos.pexels.com/video-files/3771879/3771879-uhd_2560_1440_24fps.mp4",
  "Não Binário": "https://videos.pexels.com/video-files/3771879/3771879-uhd_2560_1440_24fps.mp4",
  Baby: "https://videos.pexels.com/video-files/3771879/3771879-uhd_2560_1440_24fps.mp4",
  Kids: "https://videos.pexels.com/video-files/3771879/3771879-uhd_2560_1440_24fps.mp4",
  Teens: "https://videos.pexels.com/video-files/3771879/3771879-uhd_2560_1440_24fps.mp4",
};

export function CategoryHero({ title, count, videoUrl, fallbackColor = "#1a1a1a" }: CategoryHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [countVisible, setCountVisible] = useState(false);

  const src = videoUrl || CATEGORY_VIDEOS[title] || "";

  // Stagger the text animations
  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 300);
    const t2 = setTimeout(() => setCountVisible(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative h-[45vh] md:h-[50vh] overflow-hidden" style={{ background: fallbackColor }}>
      {/* Video background */}
      {src && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: videoLoaded ? 1 : 0,
            transition: "opacity 1.5s ease",
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        {/* Title — clip-path reveal from bottom */}
        <div className="overflow-hidden">
          <h1
            className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase tracking-[0.12em] text-white font-normal"
            style={{
              transform: titleVisible ? "translateY(0%)" : "translateY(100%)",
              opacity: titleVisible ? 1 : 0,
              transition: "transform 1s cubic-bezier(.77,0,.175,1), opacity 0.8s ease",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Count — fade up */}
        <p
          className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/40"
          style={{
            transform: countVisible ? "translateY(0)" : "translateY(20px)",
            opacity: countVisible ? 1 : 0,
            transition: "transform 0.8s cubic-bezier(.77,0,.175,1), opacity 0.6s ease",
          }}
        >
          {count} modelo{count !== 1 ? "s" : ""}
        </p>

        {/* Decorative line below title */}
        <div
          className="mt-6 h-px bg-white/20"
          style={{
            width: countVisible ? 60 : 0,
            transition: "width 1s cubic-bezier(.77,0,.175,1) 0.5s",
          }}
        />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
