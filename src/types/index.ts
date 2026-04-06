export type Categoria = "homem" | "mulher" | "nao_binario" | "baby" | "kids" | "teens";
export type TipoFoto = "book" | "polaroid" | "editorial";
export type StatusCandidatura = "pendente" | "analisando" | "aprovado" | "rejeitado";
export type UserRole = "admin" | "marca";
export type MarcaStatus = "pendente" | "aprovada" | "rejeitada" | "suspensa";
export type SelecaoStatus = "rascunho" | "enviada" | "em_analise" | "respondida" | "fechada";

export interface Modelo {
  id: string;
  nome: string;
  slug: string;
  categoria: Categoria;
  foto_principal: string | null;
  altura: string | null;
  altura_cm: number | null;
  manequim: string | null;
  busto: string | null;
  cintura: string | null;
  quadril: string | null;
  calcado: string | null;
  olhos: string | null;
  cabelo: string | null;
  instagram: string | null;
  bio: string | null;
  idade: number | null;
  data_nascimento: string | null;
  cidade: string | null;
  estado: string | null;
  etnia: string | null;
  habilidades: string[] | null;
  idiomas: string[] | null;
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

export interface UserProfile {
  id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Marca {
  id: string;
  user_id: string;
  nome_empresa: string;
  cnpj: string | null;
  nome_contato: string;
  email: string;
  telefone: string | null;
  segmento: string | null;
  site: string | null;
  status: MarcaStatus;
  notas_admin: string | null;
  created_at: string;
  updated_at: string;
}

export interface Selecao {
  id: string;
  marca_id: string;
  nome: string;
  descricao: string | null;
  data_evento: string | null;
  orcamento_estimado: string | null;
  status: SelecaoStatus;
  resposta_admin: string | null;
  created_at: string;
  updated_at: string;
}

export interface SelecaoModelo {
  id: string;
  selecao_id: string;
  modelo_id: string;
  nota: string | null;
  created_at: string;
}

export interface SelecaoComModelos extends Selecao {
  selecao_modelos: (SelecaoModelo & { modelos: Modelo })[];
}

export interface Projeto {
  id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  foto_capa: string | null;
  video_url: string | null;
  marca_parceira: string | null;
  ativo: boolean;
  destaque: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ProjetoFoto {
  id: string;
  projeto_id: string;
  url: string;
  ordem: number;
  created_at: string;
}

export interface ProjetoModelo {
  id: string;
  projeto_id: string;
  modelo_id: string;
}

export interface ModeloAprovacao {
  id: string;
  modelo_id: string;
  marca_nome: string;
  created_at: string;
}

export interface ModeloComAprovacoes extends Modelo {
  modelo_aprovacoes: ModeloAprovacao[];
}

export interface ProjetoCompleto extends Projeto {
  projeto_fotos: ProjetoFoto[];
  projeto_modelos: (ProjetoModelo & { modelos: Modelo })[];
}

export const CATEGORIAS: { value: Categoria; label: string; slug: string; desc?: string }[] = [
  { value: "mulher", label: "Mulher", slug: "mulher" },
  { value: "homem", label: "Homem", slug: "homem" },
  { value: "nao_binario", label: "Não Binário", slug: "nao-binario" },
  { value: "baby", label: "Baby", slug: "baby", desc: "Até 5 anos" },
  { value: "kids", label: "Kids", slug: "kids", desc: "5 a 15 anos" },
  { value: "teens", label: "Teens", slug: "teens", desc: "15 a 18 anos" },
];

export const ETNIAS = ["Branco", "Negro", "Pardo", "Asiático", "Indígena", "Outro"] as const;
export const CORES_OLHOS = ["Castanhos", "Azuis", "Verdes", "Mel", "Cinzas", "Pretos"] as const;
export const CORES_CABELO = ["Preto", "Castanho", "Loiro", "Ruivo", "Grisalho", "Platinado", "Rosa", "Outro"] as const;
export const HABILIDADES_COMUNS = ["Dança", "Canto", "Atuação", "Esportes", "Yoga", "Artes Marciais", "Patinação", "Surf", "Natação", "Equitação"] as const;
export const IDIOMAS_COMUNS = ["Português", "Inglês", "Espanhol", "Francês", "Italiano", "Alemão", "Japonês", "Mandarim"] as const;
export const SEGMENTOS_MARCA = ["Moda", "Beleza", "Publicidade", "E-commerce", "Editorial", "Eventos", "Outro"] as const;
export const ESTADOS_BR = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"] as const;

export function categoriaFromSlug(slug: string): Categoria | null {
  const found = CATEGORIAS.find((c) => c.slug === slug);
  return found ? found.value : null;
}

export function categoriaLabel(cat: Categoria): string {
  return CATEGORIAS.find((c) => c.value === cat)?.label ?? cat;
}
