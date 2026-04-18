import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const SITE_URL = "https://www.hlmodels.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/homem`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/mulher`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/nao-binario`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/baby`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/kids`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/teens`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projetos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/faca-parte`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic model pages
  const { data: modelos } = await supabase
    .from("modelos")
    .select("slug, updated_at")
    .eq("ativo", true);

  const modelPages: MetadataRoute.Sitemap = (modelos ?? []).map((m) => ({
    url: `${SITE_URL}/modelo/${m.slug}`,
    lastModified: new Date(m.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic project pages
  const { data: projetos } = await supabase
    .from("projetos")
    .select("slug, updated_at")
    .eq("ativo", true);

  const projectPages: MetadataRoute.Sitemap = (projetos ?? []).map((p) => ({
    url: `${SITE_URL}/projetos/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...modelPages, ...projectPages];
}
