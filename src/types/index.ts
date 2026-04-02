export type Categoria = "homem" | "mulher" | "nao_binario" | "baby" | "kids" | "teens";

export type TipoFoto = "book" | "polaroid" | "editorial";

export type StatusCandidatura = "pendente" | "analisando" | "aprovado" | "rejeitado";

export interface Modelo {
  id: string;
  nome: string;
  slug: string;
  categoria: Categoria;
  foto_principal: string | null;
  altura: string | null;
  manequim: string | null;
  busto: string | null;
  cintura: string | null;
  quadril: string | null;
  calcado: string | null;
  olhos: string | null;
  cabelo: string | null;
  instagram: string | null;
  bio: string | null;
  ativo: boolean;
  destaque: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ModeloFoto {
  id: string;
  modelo_id: string;
  url: string;
  ordem: number;
  tipo: TipoFoto;
  created_at: string;
}

export interface Candidatura {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  idade: number | null;
  altura: string | null;
  cidade: string | null;
  instagram: string | null;
  fotos: string[];
  mensagem: string | null;
  status: StatusCandidatura;
  created_at: string;
}

export interface Contato {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  assunto: string | null;
  mensagem: string;
  lido: boolean;
  created_at: string;
}

export interface ModeloComFotos extends Modelo {
  modelo_fotos: ModeloFoto[];
}

export const CATEGORIAS: { value: Categoria; label: string; slug: string; desc?: string }[] = [
  { value: "mulher", label: "Mulher", slug: "mulher" },
  { value: "homem", label: "Homem", slug: "homem" },
  { value: "nao_binario", label: "Não Binário", slug: "nao-binario" },
  { value: "baby", label: "Baby", slug: "baby", desc: "Até 5 anos" },
  { value: "kids", label: "Kids", slug: "kids", desc: "5 a 15 anos" },
  { value: "teens", label: "Teens", slug: "teens", desc: "15 a 18 anos" },
];

export function categoriaFromSlug(slug: string): Categoria | null {
  const found = CATEGORIAS.find((c) => c.slug === slug);
  return found ? found.value : null;
}

export function categoriaLabel(cat: Categoria): string {
  return CATEGORIAS.find((c) => c.value === cat)?.label ?? cat;
}
