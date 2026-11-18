# Especificação Técnica, Arquitetura e Design System — Sistema Chat "Clã"

**Projeto:** Sistema de Mensagens Criptografadas "Clã" (Cifra do Conselho de Guerra - CCG)  
**Disciplina:** Segurança de Sistemas de Informação — Prof. Me. Flávio Morais

---

## 1. Visão Geral da Arquitetura

O sistema **Chat Clã** é projetado sob uma arquitetura cliente-servidor moderna, modular e containerizada, garantindo alto desempenho na comunicação em tempo real, rigor criptográfico na camada de transporte/persistência e uma experiência de usuário refinada.

* **Front-end (Cliente):** Desenvolvido em **Next.js** (React + TypeScript), responsável pela interface reativa, gerenciamento de estados visuais temporários (auto-ocultação das mensagens), captura de eventos de interação (botão direito no desktop e toque longo no mobile) e execução do módulo educacional *Academia da Cifra*.
* **Back-end (API e Tempo Real):** Desenvolvido em **Fastify** (Node.js + TypeScript), escolhido por sua baixíssima latência, validação rigorosa de schemas (JSON Schema) e suporte nativo a plugins de segurança (cookies assinados, JWT e WebSockets).
* **Banco de Dados e Infraestrutura:** **PostgreSQL** executado em contêiner **Docker** (orquestrado via `docker-compose`), garantindo isolamento de ambiente, persistência confiável de usuários e mensagens cifradas, e facilidade de execução local durante apresentações acadêmicas.

---

## 2. Requisitos Funcionais (RF)

* **RF01 - Cadastro e Autenticação de Membros:** O sistema deve permitir o registro de novos integrantes (nome de guerra/usuário único e senha) e autenticação via endpoint REST no Fastify.
* **RF02 - Ingresso Automático no Grupo Clã:** Após autenticação bem-sucedida, o middleware do Next.js deve validar a sessão e redirecionar o usuário diretamente para a sala principal do grupo **Clã**, exibindo os membros ativos e o histórico de transmissões.
* **RF03 - Cifragem Automática no Envio:** Toda mensagem submetida pelo usuário deve ser cifrada utilizando a **Cifra do Conselho de Guerra (CCG)** antes de ser persistida no PostgreSQL e transmitida via WebSocket aos demais membros conectados.
* **RF04 - Exibição Padrão em Texto Cifrado:** Todas as mensagens renderizadas no feed do chat devem permanecer em formato cifrado por padrão, ocultando seu significado semântico até interação explícita.
* **RF05 - Menu Contextual de Descriptografia (Desktop e Mobile):**
  * **Desktop:** Ao clicar com o **botão direito** (`onContextMenu`) sobre um balão de mensagem cifrada, o sistema deve suprimir o menu padrão do navegador e exibir um menu flutuante estilizado com a opção **"Descriptografar Mensagem"**.
  * **Mobile / Touch:** Ao **pressionar e segurar** (`onTouchStart` / *long-press* por $500\text{ ms}$) sobre uma mensagem, o mesmo menu tático deve ser acionado com feedback visual sutil.
* **RF06 - Visualização Efêmera com Temporizador (Auto-Ocultação):** Ao selecionar *"Descriptografar Mensagem"*, o texto original é revelado exclusivamente na sessão local daquele usuário por **$10$ segundos**, acompanhado de um indicador circular ou barra de progresso regressiva. Ao zerar o tempo, o conteúdo retorna imediatamente ao estado cifrado.
* **RF07 - Painel de Inspeção Matemática (Modo Apresentação):** Interface dedicada para validação ao vivo da cifra, permitindo inserir textos arbitrários e visualizar o cálculo passo a passo (valores de $p_i$, $c_i$, módulo $M$ e inversa modular $a^{-1}$).
* **RF08 - Academia da Cifra (Módulo Educacional Interativo):** Seção integrada ao sistema contendo o manual histórico, raio-x visual das equações da CCG, laboratório interativo (Sandbox) e desafios práticos de decodificação para treinamento dos membros.

---

## 3. Requisitos Não Funcionais e de Segurança (RNF)

* **RNF01 - Armazenamento de Senhas em Hash:** As senhas jamais devem ser salvas em texto plano. O back-end em Fastify deve utilizar **Argon2id** ou **bcrypt** (custo mínimo $12$ *rounds*) com *salt* individual gerado automaticamente antes da gravação no PostgreSQL.
* **RNF02 - Gestão de Sessão via Token em Cookies Seguros:** Após o login, o Fastify deve emitir um **JWT (JSON Web Token)** assinado e gravá-lo nos **Cookies** do navegador utilizando `@fastify/cookie` com as diretivas `HttpOnly: true`, `SameSite: 'Strict'`, `Path: '/'` e `Secure: true` (em produção), mitigando ataques XSS e CSRF.
* **RNF03 - Persistência Exclusiva de Dados Cifrados:** A tabela de mensagens no PostgreSQL deve armazenar apenas o conteúdo cifrado (*ciphertext*), impedindo exposição direta do conteúdo das conversas em caso de leitura direta do banco.
* **RNF04 - Comunicação em Tempo Real de Baixa Latência:** Utilização de WebSockets (`@fastify/websocket` ou `Socket.io`) autenticado via cookie de sessão para entrega instantânea das mensagens cifradas no grupo Clã.
* **RNF05 - Portabilidade com Docker:** Todo o ambiente de banco de dados (PostgreSQL) e serviços auxiliares deve subir com um único comando (`docker compose up -d`), garantindo reprodutibilidade total em qualquer máquina.
* **RNF06 - Responsividade e Fidelidade Visual:** A interface Next.js deve seguir rigorosamente os princípios de ergonomia digital (alvos de toque mínimos de $44 \times 44\text{ px}$ no mobile, transições suaves a $60\text{ fps}$ e contraste tipográfico acessível).

---

## 4. Stack Tecnológica Detalhada

| Camada | Tecnologia Principal | Bibliotecas / Recursos Complementares | Finalidade no Sistema |
| :--- | :--- | :--- | :--- |
| **Front-end** | **Next.js 14+ (App Router)** | React, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion | Interface inspirada no ecossistema Apple, roteamento protegido, menu contextual e temporizador de auto-ocultação. |
| **Back-end** | **Fastify (Node.js)** | `@fastify/jwt`, `@fastify/cookie`, `@fastify/cors`, `@fastify/websocket`, `bcrypt` | API REST de alta performance, hashing de senhas, emissão de cookies `HttpOnly` e canal WebSocket do Clã. |
| **Banco de Dados** | **PostgreSQL 16** | Prisma ORM (ou Drizzle ORM) | Armazenamento relacional de usuários (hashes), histórico de mensagens cifradas e parâmetros das chaves. |
| **Infraestrutura** | **Docker & Docker Compose** | Imagem oficial `postgres:16-alpine`, volumes persistentes | Isolamento do banco de dados PostgreSQL, gerenciamento de variáveis de ambiente e inicialização rápida. |

---

## 5. Modelagem do Banco de Dados (PostgreSQL)

A estrutura relacional no PostgreSQL será composta pelas seguintes entidades principais:

1. **Tabela `users` (Membros do Clã):**
   * `id` (`UUID`, Primary Key)
   * `username` (`VARCHAR(50)`, Unique, Not Null) — Nome de identificação no Clã.
   * `password_hash` (`TEXT`, Not Null) — Hash criptográfico gerado via `bcrypt` ou `Argon2`.
   * `rank` (`VARCHAR(30)`, Default `'Recruta'`) — Patente obtida nos desafios da Academia da Cifra.
   * `created_at` (`TIMESTAMP`, Default `NOW()`)

2. **Tabela `messages` (Transmissões Cifradas):**
   * `id` (`UUID`, Primary Key)
   * `sender_id` (`UUID`, Foreign Key $\rightarrow$ `users.id`)
   * `ciphertext` (`TEXT`, Not Null) — Mensagem transformada pela Cifra do Conselho de Guerra.
   * `cipher_version` (`VARCHAR(20)`, Default `'CCG-v1'`)
   * `created_at` (`TIMESTAMP`, Default `NOW()`)

### 5.1. Configuração de Infraestrutura (Docker Compose)
O serviço do banco de dados será provisionado via contêiner Docker com *healthcheck* e volume nomeado para não perder dados entre reinicializações:
* **Serviço:** `postgres-cla`
* **Imagem:** `postgres:16-alpine`
* **Porta exposta:** `5432:5432`
* **Volume:** `pgdata_cla:/var/lib/postgresql/data`

---

## 6. Diretrizes de UX/UI e Design System (Estilo Apple + Paleta Terrosa)

A identidade visual do **Chat Clã** combina a clareza funcional, o minimalismo estrutural e a fluidez das interfaces Apple (macOS / iOS Human Interface Guidelines) com uma paleta de cores orgânica inspirada em areia, terra e marrom, remetendo aos mapas táticos, pergaminhos e mesas de comando dos antigos conselhos de guerra.

### 6.1. Princípios de UX/UI Inspirados na Apple
* **Tipografia Limpa e Hierárquica:** Uso de fontes sem serifa com excelente legibilidade e espaçamento equilibrado (`-apple-system`, `SF Pro Display`, `SF Pro Text` com fallback para `Inter`), acompanhadas de fonte monoespaçada (`SF Mono` ou `JetBrains Mono`) exclusivamente para exibir os caracteres cifrados e cálculos matemáticos.
* **Traços Finos e Superfícies Translúcidas:** Uso de bordas ultrafinas (`1px solid` com baixa opacidade), cantos arredondados generosos (`rounded-2xl` / $16\text{ px}$ a $20\text{ px}$ nos cards e balões de mensagem) e efeitos de translucidez (*vibrancy* / `backdrop-blur`) nas barras superiores e nos menus contextuais flutuantes.
* **Micro-interações e Física Natural:** Animações suaves (curvas *spring* / *ease-out*) ao abrir o menu de descriptografia no clique direito/toque longo e transição gradual de desfoque (*blur-to-clear*) ao revelar e ocultar novamente uma mensagem.
* **Menu Contextual Estilo iOS/macOS:** Ao clicar com o botão direito ou segurar a mensagem, o fundo sofre um leve escurecimento/desfoque, destacando o balão selecionado e exibindo um menu popover compacto com ícones finos (`stroke-width: 1.5`).

### 6.2. Paleta de Cores (Marrom, Areia e Terra)
A paleta foi estruturada para oferecer conforto visual prolongado, evitando contrastes agressivos de preto puro ou branco estourado:

| Token de Cor | Nome Tático | Código Hex | Aplicação na Interface |
| :--- | :--- | :--- | :--- |
| `--bg-sand-light` | Areia Clara (Pergaminho) | `#F6F1E9` | Fundo principal da aplicação no modo claro. |
| `--surface-sand` | Areia Dourada Suave | `#EBE2D3` | Fundo de barras laterais, inputs e balões de mensagens recebidas. |
| `--border-earth` | Linha de Argila | `#D5C7B2` | Traços finos divisórios (`1px`) inspirados nos separadores da Apple. |
| `--accent-terracotta` | Terracota / Cobre | `#A65E2E` | Botões principais, indicadores ativos, barra regressiva de $10\text{s}$ e destaques. |
| `--accent-ochre` | Ocre Queimado | `#C28449` | Estados de *hover*, ícones táticos e badges da Academia da Cifra. |
| `--text-espresso` | Marrom Café Profundo | `#2B1E16` | Tipografia principal no modo claro (alta legibilidade). |
| `--text-umber` | Terra Sépia | `#6E5849` | Textos secundários, timestamps e rótulos auxiliares. |
| `--bg-dark-earth` | Terra Noturna (Dark Mode) | `#1C1511` | Fundo principal no modo escuro (sala de comando noturna). |
| `--surface-bark` | Casca de Madeira | `#291F19` | Cards, balões de chat e menus flutuantes no modo escuro. |

---

## 7. Fluxo de Segurança e Comunicação Ponta a Ponta

1. **Login:** O usuário envia `username` e `password` para o **Fastify** (`POST /auth/login`).
2. **Validação:** O Fastify busca o usuário no **PostgreSQL**, compara a senha com o `password_hash` armazenado e, se válido, gera um JWT assinado.
3. **Cookie:** O Fastify retorna a resposta com o cabeçalho `Set-Cookie: cla_token=<JWT>; HttpOnly; SameSite=Strict; Path=/`.
4. **Conexão ao Chat:** O **Next.js** carrega a sala do Clã e estabelece a conexão WebSocket enviando automaticamente o cookie de autenticação.
5. **Envio e Leitura:**
   * Mensagem digitada $\rightarrow$ Cifrada pela **CCG** $\rightarrow$ Salva no PostgreSQL $\rightarrow$ Distribuída cifrada via WebSocket.
   * Clique direito / Segurar mensagem $\rightarrow$ Abre popover estilo Apple $\rightarrow$ Usuário seleciona *"Descriptografar"* $\rightarrow$ Sistema aplica a função inversa da CCG $\rightarrow$ Exibe texto claro por **$10$ segundos** $\rightarrow$ Retorna ao texto cifrado automaticamente.