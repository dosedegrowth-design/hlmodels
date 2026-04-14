"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ===== HOOK: detect when element enters viewport =====
function useOnScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Fallback: if IntersectionObserver not available, show immediately
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(node);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

// ===== SCROLL REVEAL =====
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  distance = 60,
  duration = 0.9,
  direction = "up",
}: ScrollRevealProps) {
  const { ref, visible } = useOnScreen();

  const translateMap: Record<string, string> = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(-${distance}px)`,
    right: `translateX(${distance}px)`,
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0, 0)" : translateMap[direction],
        transition: `opacity ${duration}s cubic-bezier(.77,0,.175,1) ${delay}s, transform ${duration}s cubic-bezier(.77,0,.175,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// ===== CLIP REVEAL =====
interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function ClipReveal({
  children,
  className = "",
  delay = 0,
  duration = 1,
}: ClipRevealProps) {
  const { ref, visible } = useOnScreen();

  return (
    <div ref={ref} className={className}>
      <div
        style={{
          clipPath: visible
            ? "inset(0% 0% 0% 0%)"
            : "inset(100% 0% 0% 0%)",
          transition: `clip-path ${duration}s cubic-bezier(.77,0,.175,1) ${delay}s`,
          willChange: "clip-path",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ===== TEXT REVEAL =====
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function TextReveal({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.05,
}: TextRevealProps) {
  const { ref, visible } = useOnScreen();
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            marginRight: "0.25em",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: visible ? "translateY(0%)" : "translateY(110%)",
              opacity: visible ? 1 : 0,
              transition: `transform 0.7s cubic-bezier(.77,0,.175,1) ${delay + i * staggerDelay}s, opacity 0.5s ease ${delay + i * staggerDelay}s`,
              willChange: "transform, opacity",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

// ===== SCALE REVEAL =====
interface ScaleRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function ScaleReveal({
  children,
  className = "",
  delay = 0,
  duration = 1,
}: ScaleRevealProps) {
  const { ref, visible } = useOnScreen();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.93)",
        transition: `opacity ${duration}s cubic-bezier(.77,0,.175,1) ${delay}s, transform ${duration}s cubic-bezier(.77,0,.175,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// ===== PARALLAX IMAGE =====
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  overlay?: string;
  children?: ReactNode;
}

export function ParallaxImage({ src, alt, className = "", speed = 0.2, overlay, children }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y }} className="absolute inset-0 w-full h-[120%] object-cover -top-[10%]" />
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

// ===== PARALLAX SECTION =====
interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  backgroundImage?: string;
  overlay?: string;
}

export function ParallaxSection({ children, className = "", speed = 0.15, backgroundImage, overlay }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[15%] h-[130%]">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          {overlay && <div className={`absolute inset-0 ${overlay}`} />}
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Compat stubs
export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
