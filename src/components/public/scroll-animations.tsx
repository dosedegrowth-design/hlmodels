"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

// Easing dramático inspirado em fluid.glass
const DRAMATIC_EASE = [0.77, 0, 0.175, 1] as const;
const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

// ===== CLIP REVEAL =====
// Text/content revealed with clip-path mask animation (fluid.glass style)
// Content is "unmasked" from bottom to top like a curtain lifting
interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function ClipReveal({
  children,
  className,
  delay = 0,
  duration = 1.2,
}: ClipRevealProps) {
  return (
    <motion.div
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, delay, ease: DRAMATIC_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== SCROLL REVEAL =====
// Fade + slide with dramatic easing
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 80,
  duration = 1,
  once = true,
}: ScrollRevealProps) {
  const initial = {
    opacity: 0,
    x: direction === "left" ? -distance : direction === "right" ? distance : 0,
    y: direction === "up" ? distance : direction === "down" ? -distance : 0,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: DRAMATIC_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== TEXT REVEAL (word by word with clip mask) =====
// Each word slides up from behind a mask — fluid.glass style "line-mask"
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function TextReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.04,
}: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            variants={{
              hidden: {
                y: "100%",
                opacity: 0,
              },
              visible: {
                y: "0%",
                opacity: 1,
                transition: {
                  duration: 0.8,
                  delay: delay + i * staggerDelay,
                  ease: DRAMATIC_EASE,
                },
              },
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// ===== SCALE REVEAL =====
// Element scales from small to full size while fading in — icomat style
interface ScaleRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function ScaleReveal({
  children,
  className,
  delay = 0,
  duration = 1.2,
}: ScaleRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: DRAMATIC_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== PARALLAX IMAGE =====
// Image with parallax + scale on scroll (fluid.glass style)
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  overlay?: string;
  children?: ReactNode;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.2,
  overlay,
  children,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-[120%] object-cover -top-[10%]"
      />
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

export function ParallaxSection({
  children,
  className = "",
  speed = 0.15,
  backgroundImage,
  overlay,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 -top-[15%] h-[130%]"
        >
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          {overlay && <div className={`absolute inset-0 ${overlay}`} />}
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ===== STAGGER CHILDREN =====
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  delay = 0,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.9,
            ease: DRAMATIC_EASE,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
