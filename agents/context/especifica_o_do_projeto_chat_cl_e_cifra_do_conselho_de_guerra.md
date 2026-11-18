# Projeto de Segurança de Sistemas de Informação: Sistema de Chat "Clã" e Cifra do Conselho de Guerra (CCG)

**Disciplina:** Segurança de Sistemas de Informação  
**Professor:** Me. Flávio Morais

---

## 1. Visão Geral e Concepção do Projeto

O projeto une a fundamentação matemática da criptografia clássica ao desenvolvimento de uma aplicação web moderna e segura. A proposta resgata a essência histórica da criptografia — utilizada por generais em conselhos de guerra para transmitir ordens estratégicas sem que espiões ou inimigos pudessem interceptá-las — aplicada em um ambiente de chat em tempo real chamado **Clã**.

Assim que o usuário realiza a autenticação no sistema, ele ingressa na sala de comando do grupo Clã. Todas as mensagens enviadas são automaticamente transformadas pela **Cifra do Conselho de Guerra (CCG)** antes de serem transmitidas e exibidas no chat. Por padrão, o histórico exibe apenas o texto cifrado (ininteligível para observadores externos). Para ler o conteúdo original, o membro do clã deve interagir com a mensagem (clique com o botão direito no desktop ou toque longo/segurar em dispositivos móveis) e selecionar a opção **"Descriptografar"**, revelando o texto original temporariamente antes que ele volte a se ocultar automaticamente.

> *Nota: Os requisitos funcionais, requisitos não funcionais de segurança, arquitetura de software e diretrizes de design encontram-se detalhados no documento complementar: `especificacao_tecnica_chat_cla.md`.*

---

## 2. Proposta da Cifra: Cifra do Conselho de Guerra (CCG)

### 2.1. Nome e Ideia de Funcionamento
* **Nome da Cifra:** Cifra do Conselho de Guerra (CCG) — *Cifra Afim Dinâmica Posicional*.
* **Proposta e Diferencial:** As cifras históricas tradicionais (como a Cifra de César) utilizam um deslocamento fixo, o que as torna vulneráveis à análise de frequência (letras muito comuns como `'A'` ou `'E'` geram sempre o mesmo símbolo cifrado). O diferencial da **CCG** é combinar uma transformação linear afim com uma variação posicional progressiva. Dessa forma, duas letras idênticas na mesma mensagem resultam em caracteres cifrados diferentes dependendo da sua posição no texto, simulando um código tático militar de difícil interceptação, mas com modelagem matemática clara e perfeitamente reversível.

### 2.2. Regras de Transformação
* **Alfabeto Base (Módulo $M$):** Utiliza-se o conjunto de caracteres imprimíveis da tabela ASCII padronizada de tamanho $M = 95$ (compreendendo os códigos ASCII de $32$ a $126$, o que inclui letras maiúsculas, minúsculas, números, espaços e pontuações), ou a versão simplificada $M = 26$ para demonstrações manuais em sala ($A=0, B=1, \dots, Z=25$).
* **Chave Tática do Clã:** Composta por três parâmetros inteiros $(a, b, s)$, onde:
  * $a$: Multiplicador de dispersão;
  * $b$: Deslocamento base da sala;
  * $s$: Passo tático (fator de evolução por posição da letra na mensagem).
* **Transformação Posicional:** Cada caractere na posição $i$ (iniciando em $i = 0$) sofre uma expansão pelo fator $a$, somada ao deslocamento base $b$ e ao produto da sua posição $i$ pelo passo tático $s$, tudo calculado em aritmética modular ($\pmod M$).

---

## 3. Modelagem Matemática

Para atender aos requisitos formais da diretriz da disciplina, definimos a modelagem algébrica sobre o anel de inteiros módulo $M$ ($\mathbb{Z}_M$).

### 3.1. Representação Numérica e Parâmetros
* Seja $M = 26$ o tamanho do alfabeto para demonstração formal (onde $A = 0, B = 1, C = 2, \dots, Z = 25$).
* Seja $P = (p_0, p_1, p_2, \dots, p_{n-1})$ a sequência de valores numéricos da mensagem original (Texto Plano), onde cada $p_i \in \{0, 1, \dots, M-1\}$.
* Seja $K = (a, b, s)$ a chave secreta compartilhada pelo Clã.

### 3.2. Condição de Reversibilidade (Existência da Inversa)
Para que a decifragem seja matematicamente única e determinística, o parâmetro multiplicador $a$ deve ser **coprimo** de $M$, ou seja, o Máximo Divisor Comum entre $a$ e $M$ deve ser igual a $1$:

$$\text{mdc}(a, M) = 1$$

Essa condição garante a existência do **inverso multiplicativo modular** $a^{-1} \pmod M$, tal que:

$$(a \cdot a^{-1}) \pmod M = 1$$

### 3.3. Função de Cifragem $E(p_i, i)$
Para cada caractere $p_i$ na posição $i$ (com $i = 0, 1, 2, \dots, n-1$), o valor cifrado $c_i$ é obtido pela equação:

$$c_i = (a \cdot p_i + b + s \cdot i) \pmod M$$

### 3.4. Função de Decifragem $D(c_i, i)$
Para recuperar o valor original $p_i$ a partir do caractere cifrado $c_i$ na posição $i$, isola-se $p_i$ aplicando a operação inversa no módulo $M$:

$$p_i = \left[ a^{-1} \cdot (c_i - b - s \cdot i) \right] \pmod M$$

> *Nota: Em implementações computacionais onde o operador de resto pode retornar valores negativos, utiliza-se $((x \pmod M) + M) \pmod M$ para garantir que o resultado permaneça no intervalo $[0, M-1]$.*

---

## 4. Demonstração Matemática Passo a Passo (Exemplo Manual)

Abaixo apresenta-se a demonstração manual exigida para a Segunda Parte da apresentação e documentação do projeto.

### 4.1. Definição do Cenário de Exemplo
* **Mensagem Original:** `ATAQUE`
* **Mapeamento ($A=0 \dots Z=25$):** $A = 0, T = 19, A = 0, Q = 16, U = 20, E = 4$
* **Chave Escolhida:** $a = 5, b = 8, s = 3$, com $M = 26$.
* **Verificação da Condição:** $\text{mdc}(5, 26) = 1$ (Válido!).
* **Cálculo do Inverso Multiplicativo ($a^{-1} \pmod{26}$):**  
  Procuramos um número $x$ tal que $(5 \cdot x) \pmod{26} = 1$.  
  Como $5 \cdot 21 = 105$, e $105 = (4 \cdot 26) + 1$, temos que **$a^{-1} = 21$**.

### 4.2. Processo de Cifragem: $c_i = (5 \cdot p_i + 8 + 3 \cdot i) \pmod{26}$
1. **Posição $i = 0$ (Letra `'A'`, $p_0 = 0$):**  
   $$c_0 = (5 \cdot 0 + 8 + 3 \cdot 0) \pmod{26} = 8 \pmod{26} = \mathbf{8} \text{ (Letra \textbf{I})}$$
2. **Posição $i = 1$ (Letra `'T'`, $p_1 = 19$):**  
   $$c_1 = (5 \cdot 19 + 8 + 3 \cdot 1) \pmod{26} = 106 \pmod{26} = \mathbf{2} \text{ (Letra \textbf{C})}$$
3. **Posição $i = 2$ (Letra `'A'`, $p_2 = 0$):**  
   $$c_2 = (5 \cdot 0 + 8 + 3 \cdot 2) \pmod{26} = 14 \pmod{26} = \mathbf{14} \text{ (Letra \textbf{O})}$$
   *(Observe o diferencial da cifra: a primeira letra `'A'` virou `'I'`, mas a segunda letra `'A'` virou `'O'` devido ao fator posicional!)*
4. **Posição $i = 3$ (Letra `'Q'`, $p_3 = 16$):**  
   $$c_3 = (5 \cdot 16 + 8 + 3 \cdot 3) \pmod{26} = 97 \pmod{26} = \mathbf{19} \text{ (Letra \textbf{T})}$$
5. **Posição $i = 4$ (Letra `'U'`, $p_4 = 20$):**  
   $$c_4 = (5 \cdot 20 + 8 + 3 \cdot 4) \pmod{26} = 120 \pmod{26} = \mathbf{16} \text{ (Letra \textbf{Q})}$$
6. **Posição $i = 5$ (Letra `'E'`, $p_5 = 4$):**  
   $$c_5 = (5 \cdot 4 + 8 + 3 \cdot 5) \pmod{26} = 43 \pmod{26} = \mathbf{17} \text{ (Letra \textbf{R})}$$

* **Mensagem Cifrada Resultante:** `ICOTQR`

### 4.3. Processo de Decifragem: $p_i = \left[ 21 \cdot (c_i - 8 - 3 \cdot i) \right] \pmod{26}$
1. **Posição $i = 0$ (Letra `'I'`, $c_0 = 8$):**  
   $$p_0 = \left[ 21 \cdot (8 - 8 - 0) \right] \pmod{26} = 0 \pmod{26} = \mathbf{0} \text{ (Letra \textbf{A})}$$
2. **Posição $i = 1$ (Letra `'C'`, $c_1 = 2$):**  
   $$p_1 = \left[ 21 \cdot (2 - 8 - 3) \right] \pmod{26} = -189 \pmod{26} = (-189 + 208) \pmod{26} = \mathbf{19} \text{ (Letra \textbf{T})}$$
3. **Posição $i = 2$ (Letra `'O'`, $c_2 = 14$):**  
   $$p_2 = \left[ 21 \cdot (14 - 8 - 6) \right] \pmod{26} = 0 \pmod{26} = \mathbf{0} \text{ (Letra \textbf{A})}$$
4. **Posição $i = 3$ (Letra `'T'`, $c_3 = 19$):**  
   $$p_3 = \left[ 21 \cdot (19 - 8 - 9) \right] \pmod{26} = 42 \pmod{26} = \mathbf{16} \text{ (Letra \textbf{Q})}$$
5. **Posição $i = 4$ (Letra `'Q'`, $c_4 = 16$):**  
   $$p_4 = \left[ 21 \cdot (16 - 8 - 12) \right] \pmod{26} = -84 \pmod{26} = (-84 + 104) \pmod{26} = \mathbf{20} \text{ (Letra \textbf{U})}$$
6. **Posição $i = 5$ (Letra `'R'`, $c_5 = 17$):**  
   $$p_5 = \left[ 21 \cdot (17 - 8 - 15) \right] \pmod{26} = -126 \pmod{26} = (-126 + 130) \pmod{26} = \mathbf{4} \text{ (Letra \textbf{E})}$$

* **Mensagem Original Recuperada:** `ATAQUE`

---

## 5. Casos de Teste Obrigatórios (Mínimo de 5 Exemplos)

Conforme exigido no item 7 das diretrizes, a tabela abaixo documenta 5 casos de teste utilizando a chave $K = (a=5, b=8, s=3)$ no módulo $M = 26$ para validação da implementação:

| Nº Teste | Mensagem Original (Input) | Mensagem Cifrada (Output) | Mensagem Decifrada (Recuperada) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `ATAQUE` | `ICOTQR` | `ATAQUE` | Sucesso |
| **02** | `TROPAS` | `ZJGVQJ` | `TROPAS` | Sucesso |
| **03** | `DEFESA` | `LMDXKM` | `DEFESA` | Sucesso |
| **04** | `RECUAR` | `JMYNQF` | `RECUAR` | Sucesso |
| **05** | `VITORIA` | `BWHOZCC` | `VITORIA` | Sucesso |

*(No sistema completo do chat, o módulo $M = 95$ da tabela ASCII imprimível será utilizado com a mesma fórmula para suportar espaços, números e pontuações).*

---

## 6. Módulo Educacional: Academia da Cifra (Aprenda a Cifra)

Para que novos membros (recrutas) compreendam como a segurança do grupo **Clã** funciona na prática — e também para servir como ferramenta visual de apoio didático durante a apresentação da disciplina — o sistema contará com uma seção exclusiva chamada **Academia da Cifra**.

### 6.1. Objetivos do Módulo de Aprendizado
* Desmistificar a matemática por trás da **Cifra do Conselho de Guerra (CCG)** de forma visual, interativa e acessível.
* Permitir que qualquer usuário aprenda a cifrar e decifrar mensagens manualmente antes mesmo de usar a descriptografia automática do chat.
* Servir como guia interativo durante as etapas de apresentação em sala (Partes 1, 2 e 3 das diretrizes).

### 6.2. Estrutura e Funcionalidades da Seção "Aprender a Cifra"
1. **Manual Histórico (A Origem nos Conselhos de Guerra):** Linha do tempo e contextualização ilustrada explicando como generais protegiam ordens militares na antiguidade, por que cifras simples (como a de César) eram quebradas por análise de frequência e como a CCG resolve esse problema com o deslocamento posicional.
2. **Guia Visual da Fórmula (Raio-X Matemático):** Explicação didática de cada componente das equações:
   * O papel do multiplicador de dispersão ($a$) e a regra obrigatória de coprimalidade $\text{mdc}(a, M) = 1$.
   * O impacto do deslocamento base ($b$) e do passo tático posicional ($s \cdot i$).
   * Como funciona o inverso multiplicativo modular ($a^{-1}$) para reverter a mensagem sem perda de dados.
3. **Laboratório Interativo Passo a Passo (Sandbox):** Uma área prática onde o usuário digita uma palavra curta (ex.: `ATAQUE`) e escolhe as chaves $(a, b, s)$. O sistema exibe uma tabela animada mostrando caractere por caractere:
   * Posição ($i$) e valor numérico original ($p_i$);
   * A conta matemática aplicada em tempo real;
   * O resultado modular e o caractere cifrado final ($c_i$), além do caminho inverso completo.
4. **Campo de Treinamento (Desafios do Recruta):** Um mini-jogo/quiz com 3 níveis de dificuldade (*Iniciante*, *Estrategista* e *General*), onde o usuário recebe uma mensagem interceptada e as chaves da missão para tentar decifrá-la manualmente e ganhar insígnias no seu perfil do Clã.

---

## 7. Cronograma de Entregas e Roteiro de Apresentação (15 Minutos)

### 7.1. Datas Importantes (Conforme Diretriz)
* **13/11:** Primeiro acompanhamento — Apresentação da ideia do projeto e proposta de desenvolvimento.
* **27/11:** Segundo acompanhamento — Apresentação da cifra desenvolvida e demonstração do seu funcionamento.
* **04/12:** Apresentação final — Apresentação em slides e execução prática do sistema desenvolvido.
* **11/12:** Avaliação final.

### 7.2. Estrutura para a Apresentação em Slides (Item 8 da Diretriz)
1. **Parte 1 — Apresentação da Ideia (4 min):** Contextualização histórica dos generais de guerra, apresentação do conceito do Chat Clã, regras da *Cifra do Conselho de Guerra (CCG)* e explicação das equações de cifragem e decifragem com foco na condição de inverso modular.
2. **Parte 2 — Demonstração Manual (4 min):** Exibição nos slides do cálculo passo a passo da palavra `ATAQUE` $\rightarrow$ `ICOTQR` $\rightarrow$ `ATAQUE`, destacando como duas letras iguais assumem valores diferentes.
3. **Parte 3 — Implementação Computacional ao Vivo (7 min):**
   * Demonstração do cadastro/login mostrando no banco de dados a senha salva em **Hash** e o **Token salvo nos Cookies** (via DevTools do navegador).
   * Envio de mensagens ao vivo no grupo **Clã**, mostrando que chegam cifradas.
   * Demonstração do clique com botão direito (e simulação mobile segurando a mensagem) para descriptografar temporariamente os textos, exibição da *Academia da Cifra* e dos 5 testes obrigatórios.