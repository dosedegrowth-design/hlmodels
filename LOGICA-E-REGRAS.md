# HL Models - Documento de Lógica e Regras de Negócio

> Este documento mapeia TODA a lógica, regras de negócio e estrutura de dados do projeto.
> Referência para rebuild visual do zero.

---

## 1. TECH STACK

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 16.2.1 | Framework & routing |
| React | 19.2.4 | UI |
| TypeScript | 6.0.2 | Type safety |
| Tailwind CSS | 4.2.2 | Styling |
| Supabase | 2.101.1 | Database, Auth, Storage |
| Framer Motion | 12.38.0 | Animações |
| Vercel | - | Hosting |

---

## 2. ARQUITETURA DE ROTAS

### Site Público (sem auth)
| Rota | Descrição |
|---|---|
| `/` | Home page |
| `/mulher` | Modelos femininos |
| `/homem` | Modelos masculinos |
| `/nao-binario` | Modelos não binários |
| `/baby` | Modelos baby (até 5 anos) |
| `/kids` | Modelos kids (5-15 anos) |
| `/teens` | Modelos teens (15-18 anos) |
| `/modelo/[slug]` | Detalhe do modelo |
| `/projetos` | Lista de projetos |
| `/projetos/[slug]` | Detalhe do projeto |
| `/faca-parte` | Formulário de candidatura |
| `/contato` | Formulário de contato |
| `/sobre` | Sobre a agência |

### Admin (requer auth + role "admin")
| Rota | Descrição |
|---|---|
| `/admin/login` | Login admin |
| `/admin` | Dashboard com métricas |
| `/admin/modelos` | CRUD modelos |
| `/admin/modelos/novo` | Criar modelo |
| `/admin/modelos/[id]` | Editar modelo |
| `/admin/candidaturas` | Gerenciar candidaturas |
| `/admin/contatos` | Gerenciar contatos |
| `/admin/marcas` | Gerenciar marcas |
| `/admin/marcas/[id]` | Detalhe marca |
| `/admin/orcamentos` | Gerenciar orçamentos (usa tabela `selecoes`) |
| `/admin/orcamentos/[id]` | Detalhe orçamento |
| `/admin/projetos` | CRUD projetos |
| `/admin/projetos/novo` | Criar projeto |
| `/admin/projetos/[id]` | Editar projeto |
| `/admin/configuracoes` | Config e admin users |

### Portal de Marcas (requer auth + marca aprovada)
| Rota | Descrição |
|---|---|
| `/marcas/login` | Login marca |
| `/marcas/registro` | Registro nova marca |
| `/marcas/aguardando` | Tela de espera (pendente/rejeitada) |
| `/marcas` | Dashboard marca |
| `/marcas/modelos` | Busca modelos com filtros |
| `/marcas/modelos/[id]` | Detalhe modelo |
| `/marcas/selecoes` | Lista seleções |
| `/marcas/selecoes/nova` | Criar seleção |
| `/marcas/selecoes/[id]` | Detalhe seleção |
| `/marcas/perfil` | Perfil da marca (read-only) |

---

## 3. MIDDLEWARE - REGRAS DE AUTH

### Matcher: `/admin/:path*` e `/marcas/:path*`

### RPCs Supabase usados:
- `get_user_role(user_id)` → retorna `"admin"` ou null
- `get_marca_status(p_user_id)` → retorna `"pendente"` | `"aprovada"` | `"rejeitada"` | `"suspensa"` ou null

### Regras Admin:
1. Rotas `/admin/*` (exceto login): sem user → redirect `/admin/login`
2. Com user mas role ≠ admin → redirect `/`
3. Admin já logado em `/admin/login` → redirect `/admin`

### Regras Marcas:
1. Rotas protegidas de `/marcas/*` (exceto login, registro): sem user → redirect `/marcas/login`
2. Admins no portal marcas → redirect `/admin`
3. `/marcas/aguardando` → sempre acessível para user logado
4. Marca com status ≠ "aprovada" → redirect `/marcas/aguardando`
5. Marca aprovada em `/marcas/login` → redirect `/marcas`

---

## 4. BANCO DE DADOS - TABELAS

### `modelos` (core)
| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | UUID | PK | Auto |
| nome | text | Sim | Nome do modelo |
| slug | text | Sim, UNIQUE | URL-friendly |
| categoria | enum | Sim | homem, mulher, nao_binario, baby, kids, teens |
| foto_principal | text | Não | URL foto principal |
| altura | text | Não | Ex: "1.75m" |
| altura_cm | integer | Não | Numérico p/ filtro marcas |
| manequim | text | Não | |
| busto | text | Não | |
| cintura | text | Não | |
| quadril | text | Não | |
| calcado | text | Não | |
| olhos | text | Não | |
| cabelo | text | Não | |
| instagram | text | Não | @usuario |
| bio | text | Não | |
| idade | integer | Não | |
| data_nascimento | date | Não | |
| cidade | text | Não | |
| estado | text | Não | UF brasileiro |
| etnia | text | Não | |
| habilidades | text[] | Não | Array |
| idiomas | text[] | Não | Array |
| ativo | boolean | Sim | Default true |
| destaque | boolean | Sim | Default false |
| ordem | integer | Sim | Ordenação |
| created_at | timestamp | Auto | |
| updated_at | timestamp | Auto (trigger) | |

### `modelo_fotos`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| modelo_id | UUID FK | → modelos |
| url | text | URL da foto |
| ordem | integer | Ordenação |
| tipo | enum | book, polaroid, editorial |
| created_at | timestamp | |

### `modelo_aprovacoes`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| modelo_id | UUID FK | → modelos |
| marca_nome | text | Nome da marca (texto livre, não FK) |
| created_at | timestamp | |

### `candidaturas`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| nome | text | |
| email | text | |
| telefone | text | Nullable |
| idade | integer | Nullable |
| altura | text | Nullable |
| cidade | text | Nullable |
| instagram | text | Nullable |
| fotos | JSONB/text[] | URLs das fotos |
| mensagem | text | Nullable |
| status | enum | pendente, analisando, aprovado, rejeitado |
| created_at | timestamp | |

### `contatos`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| nome | text | |
| email | text | |
| telefone | text | Nullable |
| assunto | text | Nullable |
| mensagem | text | |
| lido | boolean | Default false |
| created_at | timestamp | |

### `marcas`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| user_id | UUID FK | → auth.users |
| nome_empresa | text | |
| cnpj | text | Nullable |
| nome_contato | text | |
| email | text | |
| telefone | text | Nullable |
| segmento | text | Nullable |
| site | text | Nullable |
| status | enum | pendente, aprovada, rejeitada, suspensa |
| notas_admin | text | Nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### `selecoes` (= orçamentos no admin)
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| marca_id | UUID FK | → marcas |
| nome | text | Nome da seleção |
| descricao | text | Nullable |
| data_evento | date | Nullable |
| orcamento_estimado | text | Nullable (texto livre) |
| status | enum | rascunho, enviada, em_analise, respondida, fechada |
| resposta_admin | text | Nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### `selecao_modelos` (junction)
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| selecao_id | UUID FK | → selecoes |
| modelo_id | UUID FK | → modelos |
| nota | text | Nullable (nota da marca sobre o modelo) |
| created_at | timestamp | |

### `projetos`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| titulo | text | |
| slug | text | UNIQUE |
| descricao | text | Nullable |
| foto_capa | text | Nullable |
| video_url | text | Nullable (YouTube/Vimeo) |
| marca_parceira | text | Nullable (texto livre) |
| ativo | boolean | Default true |
| destaque | boolean | Default false |
| ordem | integer | |
| created_at | timestamp | |
| updated_at | timestamp | |

### `projeto_fotos`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| projeto_id | UUID FK | → projetos |
| url | text | |
| ordem | integer | |
| created_at | timestamp | |

### `projeto_modelos` (junction)
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| projeto_id | UUID FK | → projetos |
| modelo_id | UUID FK | → modelos |

### `user_profiles`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID | PK (= auth.users.id) |
| role | enum | admin, marca |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## 5. RLS POLICIES

| Tabela | Público | Auth |
|---|---|---|
| modelos | SELECT onde ativo=true | Full CRUD |
| modelo_fotos | SELECT quando modelo pai ativo | Full CRUD |
| candidaturas | INSERT (anon) | Full CRUD |
| contatos | INSERT (anon) | Full CRUD |

### Storage Bucket: `modelos` (público)
- Público: SELECT
- Auth: INSERT, UPDATE, DELETE

### Storage Bucket: `candidaturas`
- Criado manualmente (não está na migration)

---

## 6. WORKFLOWS / MÁQUINAS DE ESTADO

### Candidatura
```
pendente → analisando → aprovado
                     → rejeitado
```
Transições livres (qualquer → qualquer via admin)

### Contato
```
não lido (lido=false) ↔ lido (lido=true)
```
Toggle binário

### Marca
```
[registro] → pendente → aprovada → acesso total portal
                      → rejeitada → mensagem rejeição
                      → suspensa → (não tratado no UI)
```
Transições livres via admin

### Seleção/Orçamento
```
[criação] → rascunho → enviada (marca clica "Enviar")
                     → em_analise (admin)
                     → respondida (admin + texto resposta)
                     → fechada (admin)
```
- Marca só pode: rascunho → enviada
- Admin pode: enviada/em_analise/respondida/fechada (não volta p/ rascunho)
- Após envio, seleção fica read-only para marca

---

## 7. REGRAS DE NEGÓCIO ESPECÍFICAS

### Upload de Fotos
- Storage path modelos: `main/{slug}/{timestamp}.{ext}` ou `book/{slug}/{timestamp}.{ext}`
- Storage path projetos: `projetos/{slug}/capa/{timestamp}.{ext}` ou `projetos/{slug}/galeria/{timestamp}.{ext}`
- Storage path candidaturas: `{timestamp}-{random}.{ext}` no bucket `candidaturas`
- Estratégia: delete-all + re-insert em cada save (modelo_fotos e projeto_fotos)

### Slug
- Auto-gerado do nome apenas na criação (não na edição)
- Normalização: lowercase, remove diacríticos, substitui não-alfanuméricos por hífens

### Admin Users
- Gerenciados via Edge Function `manage-admin` (CRUD via POST)
- Actions: list, create (email/password/name), delete

### Contato WhatsApp
- Formato: `https://wa.me/55{numero}?text=Ola {nome}, tudo bem? Aqui e da HL Models.`
- Número limpo de formatação, prefixo "55" adicionado se ausente

### Home Page - Queries
1. Modelos destaque adultos (hero): ativo + destaque + categorias adultas, limit 8
2. Modelos destaque kids (hero): ativo + categorias kids, limit 4
3. Grid modelos: ativo, limit 12
4. Fotos por categoria: 6 queries (1 por categoria), limit 6 fotos cada
5. Projetos destaque: ativo + destaque, limit 4
6. Modelos aprovados: modelo_aprovacoes com join modelos, limit 12

### Busca Modelos (Portal Marcas)
Filtros disponíveis:
- Nome (ILIKE)
- Categorias (multi-select, IN)
- Cor dos olhos (multi-select, IN)
- Cor do cabelo (multi-select, IN)
- Etnia (multi-select, IN)
- Altura mín/máx (cm, >=/<= em altura_cm)
- Limite: 50 resultados

### Seleção - Auto-criação
- Quando marca adiciona modelo sem seleção rascunho ativa, cria uma automaticamente com nome "Nova Selecao"

---

## 8. CONSTANTES

```typescript
CATEGORIAS: mulher, homem, nao_binario, baby, kids, teens
ETNIAS: Branco, Negro, Pardo, Asiático, Indígena, Outro
CORES_OLHOS: Castanhos, Azuis, Verdes, Mel, Cinzas, Pretos
CORES_CABELO: Preto, Castanho, Loiro, Ruivo, Grisalho, Platinado, Rosa, Outro
HABILIDADES: Dança, Canto, Atuação, Esportes, Yoga, Artes Marciais, Patinação, Surf, Natação, Equitação
IDIOMAS: Português, Inglês, Espanhol, Francês, Italiano, Alemão, Japonês, Mandarim
SEGMENTOS_MARCA: Moda, Beleza, Publicidade, E-commerce, Editorial, Eventos, Outro
ESTADOS_BR: AC..TO (27 UFs)
```

---

## 9. SEO

### Root Layout
- `metadataBase`: https://hlmodels.vercel.app
- Title template: `%s | HL Models`
- Default: "HL Models - Agencia de Modelos em Sao Paulo"
- OpenGraph: type website, locale pt_BR
- JSON-LD: Organization schema

### Dinâmico
- `/modelo/[slug]`: Person schema, OG image = foto_principal
- `/projetos/[slug]`: Article OG, image = foto_capa

### Sitemap
- 11 páginas estáticas
- Modelos ativos (dinâmico, weekly)
- Projetos ativos (dinâmico, monthly)

### Robots
- Allow: /
- Disallow: /admin/, /marcas/, /api/

---

## 10. INFORMAÇÕES DE CONTATO (hardcoded)

- Instagram: @hlmodels
- Telefone: (11) 95350-6752
- Email: hlmodels@outlook.com
- Endereço: Rua dos Cajueiros, 12 - Parque Terra Nova - São Bernardo do Campo/SP

### Marcas parceiras (hardcoded no carousel)
PomPom, Brandili, Marisa, Torra, Wilson, Fit, Algodão Doce, Felps, Verão de Maria, Yawe, Mona

---

## 11. SIDEBAR ADMIN (Navegação)

1. Dashboard (`/admin`)
2. Modelos (`/admin/modelos`)
3. Candidaturas (`/admin/candidaturas`)
4. Contatos (`/admin/contatos`)
5. Marcas (`/admin/marcas`)
6. Orçamentos (`/admin/orcamentos`)
7. Projetos (`/admin/projetos`)
8. Configurações (`/admin/configuracoes`)

### Navegação Portal Marcas
1. Início (`/marcas`)
2. Modelos (`/marcas/modelos`)
3. Seleções (`/marcas/selecoes`)
4. Perfil (`/marcas/perfil`)
