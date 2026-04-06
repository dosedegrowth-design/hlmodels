# HL Models Agency — Apresentacao do Site

Ola! Segue abaixo a apresentacao completa do site desenvolvido para a **HL Models Agency**.

> **Importante:** Todas as imagens e modelos exibidos atualmente sao **temporarios/ilustrativos**. Os nomes, fotos e dados dos modelos sao fictícios, usados apenas para demonstracao do layout e funcionalidades. Ao longo da implantacao, todo o conteudo sera substituido pelos modelos, fotos e projetos reais da agencia.

---

## Links de Acesso

### Site Publico
🌐 **https://hlmodels.vercel.app**

### Painel Administrativo
🔐 **https://hlmodels.vercel.app/admin/login**
- Email: `admin@hlmodels.com.br`
- Senha: `HLmodels@2025`

### Portal de Marcas (acesso de teste)
🏢 **https://hlmodels.vercel.app/marcas/login**
- Email: `marca@teste.com`
- Senha: `Marca@2025`

### Cadastro de Novas Marcas
📋 **https://hlmodels.vercel.app/marcas/registro**

### Formulario "Faca Parte" (candidatura de modelos)
📸 **https://hlmodels.vercel.app/faca-parte**

---

## O que foi construido

### 1. Site Publico (vitrine da agencia)

O site publico e a vitrine online da HL Models, projetado com estetica editorial e minimalista, inspirado em agencias de referencia do mercado.

**Paginas:**
- **Home** — Hero fullscreen com 4 modelos em destaque (2 no mobile), carrossel de categorias com slideshow automatico, grid de todos os modelos, secao de projetos e CTA para candidatura
- **Categorias** — Paginas individuais para Mulher, Homem, Nao Binario, Baby, Kids e Teens, cada uma com grid de modelos filtrados
- **Perfil do Modelo** — Pagina de detalhe com foto principal, medidas completas, bio, galeria de fotos (book) com lightbox
- **Projetos** — Portfolio de trabalhos realizados com marcas, com galeria de fotos, embed de video (YouTube/Vimeo) e modelos participantes
- **Faca Parte** — Formulario de candidatura com upload de ate 5 fotos de avaliacao
- **Contato** — Formulario de contato com informacoes da agencia
- **Sobre** — Pagina institucional

**Por que assim?** O site foi pensado para ser a primeira impressao profissional da agencia. O hero com modelos em tela cheia, a navegacao limpa e o menu fullscreen transmitem sofisticacao e credibilidade, padroes visuais de agencias internacionais.

---

### 2. Painel Administrativo

O painel e onde a equipe da HL Models gerencia todo o conteudo do site e as operacoes da agencia, sem precisar de conhecimento tecnico.

**Funcionalidades:**
- **Dashboard** — Visao geral com contadores (modelos, projetos, marcas, candidaturas, contatos) e atalhos rapidos
- **Modelos** — CRUD completo: criar, editar, ativar/desativar, marcar destaque. Upload de foto principal e book (galeria). Campos de medidas, bio, Instagram, e filtros avancados (cidade, etnia, habilidades, idiomas)
- **Projetos** — CRUD completo: criar projetos/campanhas com foto de capa, galeria, video YouTube/Vimeo, vincular modelos participantes e marca parceira
- **Candidaturas** — Visualizacao rica das candidaturas recebidas, com fotos de avaliacao, dados completos, botao direto para Instagram, e botoes de WhatsApp/Ligar/Email para contato imediato
- **Contatos** — Mensagens recebidas pelo formulario de contato, com marcacao de lido/nao lido e botoes de WhatsApp/Ligar/Email
- **Marcas** — Gestao de marcas cadastradas (aprovar, rejeitar, suspender), com pagina de detalhe mostrando dados da empresa, historico de selecoes e notas internas
- **Orcamentos** — Visualizacao das selecoes/orcamentos enviados pelas marcas, com modelos selecionados e campo de resposta
- **Configuracoes** — Gestao de administradores (criar novos admins, remover), resumo da plataforma e links rapidos

**Por que assim?** O painel foi desenhado para dar total autonomia a equipe. Cada funcionalidade tem acoes diretas (botoes de WhatsApp, Instagram, ligar) para agilizar o dia a dia. O CRUD de modelos e projetos permite que a agencia mantenha o site sempre atualizado sem depender de desenvolvedores.

---

### 3. Portal de Marcas

Um acesso exclusivo para empresas/marcas que querem contratar modelos da agencia. Funciona como um sistema de busca e orcamento online.

**Fluxo completo:**
1. A marca se cadastra no portal (nome da empresa, CNPJ, contato, segmento)
2. A agencia analisa e aprova o cadastro no painel admin
3. Apos aprovacao, a marca acessa o portal e pode:
   - **Buscar modelos** com filtros avancados (categoria, altura, cor dos olhos, cabelo, etnia)
   - **Ver detalhe** de cada modelo (fotos, medidas, habilidades, book completo)
   - **Montar selecoes** de modelos para campanhas especificas
   - **Enviar orcamentos** com a selecao de modelos + descricao do job
4. A agencia recebe o orcamento no painel admin e responde
5. A marca acompanha o status da resposta no portal

**Por que assim?** Esse portal profissionaliza o processo de contratacao. Em vez de trocar mensagens no WhatsApp com listas de modelos, a marca faz tudo online — busca, seleciona, orcamenta. Isso agiliza o atendimento, organiza a demanda e da uma experiencia premium ao cliente.

---

### 4. SEO e Indexacao

O site foi otimizado para aparecer bem no Google:

- **Sitemap dinamico** (`/sitemap.xml`) — atualiza automaticamente quando novos modelos ou projetos sao adicionados
- **Robots.txt** — orienta os buscadores sobre o que indexar (bloqueia admin e portal de marcas)
- **Meta tags completas** — titulo, descricao, Open Graph (preview de redes sociais), Twitter Card em todas as paginas
- **JSON-LD** — dados estruturados de Organization e Person para o Google entender que e uma agencia de modelos
- **URLs canonicas** — evita conteudo duplicado
- **Alt text em imagens** — acessibilidade e SEO

---

### 5. Seguranca

- **Autenticacao** com Supabase Auth (email/senha, JWT)
- **Controle de acesso por papel** — admin vs marca, com middleware verificando permissoes em cada rota
- **RLS (Row Level Security)** no banco de dados — cada marca so ve seus proprios dados, admin ve tudo
- **Protecao de rotas** — painel admin e portal de marcas inacessiveis sem login

---

## Tecnologias Utilizadas

| Tecnologia | Funcao |
|---|---|
| Next.js 16 | Framework web (React) |
| Tailwind CSS | Estilizacao |
| Supabase | Banco de dados, autenticacao, storage de imagens |
| Vercel | Hospedagem e deploy automatico |
| Framer Motion | Animacoes |

---

## Proximos Passos

1. **Substituir conteudo mock** — Inserir modelos reais, fotos profissionais e projetos da agencia
2. **Logo oficial** — Ja integrada (versao preta e branca)
3. **Dominio personalizado** — Conectar dominio proprio (ex: hlmodels.com.br) no Vercel
4. **Ajustes visuais** — Refinamentos de layout conforme feedback do cliente
5. **Redes sociais** — Atualizar links do Instagram, WhatsApp e email com os dados oficiais da agencia

---

*Documento gerado em Abril/2026 — Desenvolvimento por Dose de Growth*
