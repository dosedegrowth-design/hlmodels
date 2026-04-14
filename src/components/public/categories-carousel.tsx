"use client";

import Link from "next/link";
import Image from "next/image";
import { CATEGORIAS } from "@/types";

interface CategoriesCarouselProps {
  categoryPhotos: Record<string, string[]>;
}

const KIDS_CATS = ["baby", "kids", "teens"];

function CategoryCard({
  slug,
  label,
  desc,
  photos,
}: {
  slug: string;
  label: string;
  desc?: string;
  photos: string[];
}) {
  const isKids = KIDS_CATS.includes(slug);
  const coverImage = photos.length > 0 ? photos[0] : null;

  return (
    <Link href={`/${slug}`} className="group block">
      <div
        className={`category-card relative aspect-[3/4] overflow-hidden rounded-xl ${
          isKids ? "rounded-2xl" : ""
        }`}
      >
        {/* Background image */}
        {coverImage ? (
          <Image
            src={coverImage}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-900" />
        )}

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 z-[1] transition-opacity duration-500 ${
            isKids
              ? "bg-gradient-to-t from-black/40 via-black/10 to-transparent"
              : "bg-gradient-to-t from-black/50 via-black/15 to-transparent group-hover:from-black/60"
          }`}
        />

        {/* Category name */}
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-end pb-8">
          <h3
            className={`font-display text-2xl md:text-3xl text-white uppercase tracking-wide text-center ${
              isKids ? "font-kids font-bold" : "font-light"
            }`}
          >
            {label}
          </h3>
          {desc && (
            <span
              className={`mt-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 ${
                isKids ? "font-kids" : ""
              }`}
            >
              {desc}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function CategoriesCarousel({
  categoryPhotos,
}: CategoriesCarouselProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {CATEGORIAS.map((cat) => (
        <CategoryCard
          key={cat.slug}
          slug={cat.slug}
          label={cat.label}
          desc={cat.desc}
          photos={categoryPhotos[cat.value] ?? []}
        />
      ))}
    </div>
  );
}
