'use client';

import { Card } from '@/components/ui/Card';

const VARIABLES = [
  {
    symbol: 'pᵢ',
    label: 'Texto Plano',
    desc: 'Valor numérico do caractere original na tabela ASCII/alfabeto.',
  },
  {
    symbol: 'cᵢ',
    label: 'Texto Cifrado',
    desc: 'Valor numérico resultante após aplicar a cifra.',
  },
  {
    symbol: 'i',
    label: 'Posição',
    desc: 'Índice do caractere na mensagem (0, 1, 2…). Faz letras iguais virarem códigos diferentes.',
  },
  {
    symbol: 'a',
    label: 'Chave Multiplicativa',
    desc: 'Multiplica pᵢ. Precisa ser coprimo de M (mdc(a, M) = 1) para ter inverso e ser decifrável.',
  },
  {
    symbol: 'b',
    label: 'Chave de Deslocamento',
    desc: 'Soma fixa que empurra o resultado para frente.',
  },
  {
    symbol: 's',
    label: 'Salto Posicional',
    desc: 'Peso multiplicado pela posição i (deslocamento progressivo).',
  },
  {
    symbol: 'M',
    label: 'Módulo / Tamanho do Alfabeto',
    desc: 'Total de caracteres suportados (ex.: 95 ASCII imprimíveis ou 26 letras).',
  },
  {
    symbol: 'a⁻¹',
    label: 'Inverso Modular',
    desc: 'Número que desfaz a multiplicação por a na decifragem (a · a⁻¹ ≡ 1 mod M).',
  },
] as const;

export function RaioXMatematico() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-espresso dark:text-sand-light">
          Raio-X Matemático da CCG
        </h2>
        <p className="text-sm text-umber dark:text-ochre">
          As fórmulas, as variáveis e as regras práticas para cifrar e decifrar com a Cifra do Conselho de Guerra.
        </p>
      </div>

      {/* 1. As Fórmulas - lado a lado (HTML/Unicode limpo) */}
      <Card className="p-5 space-y-4 border-l-4 border-terracotta dark:border-ochre">
        <h3 className="text-base font-semibold text-espresso dark:text-sand-light flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-terracotta dark:bg-ochre text-white text-xs font-bold">
            1
          </span>
          As Fórmulas (Cifragem e Decifragem)
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-terracotta dark:text-ochre">Cifrar (E)</h4>
            <div className="rounded-xl bg-sand dark:bg-bark p-4 border border-earth-border dark:border-bordermain text-center">
              <code className="font-mono text-lg md:text-xl font-semibold tracking-wide whitespace-nowrap text-espresso dark:text-sand-light">
                cᵢ = (a · pᵢ + b + s · i) mod M
              </code>
            </div>
            <p className="text-xs text-umber dark:text-sand-light/80">
              Transforma o caractere plano pᵢ no cifrado cᵢ usando a chave (a, b, s) e a posição i.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-terracotta dark:text-ochre">Decifrar (D)</h4>
            <div className="rounded-xl bg-sand dark:bg-bark p-4 border border-earth-border dark:border-bordermain text-center">
              <code className="font-mono text-lg md:text-xl font-semibold tracking-wide whitespace-nowrap text-espresso dark:text-sand-light">
                pᵢ = [a⁻¹ · (cᵢ - b - s · i)] mod M
              </code>
            </div>
            <p className="text-xs text-umber dark:text-sand-light/80">
              Usa o inverso modular a⁻¹ para reverter a operação. Negativos: <code className="font-mono bg-sand/50 dark:bg-bark/50 px-1 rounded">((x % M) + M) % M</code>.
            </p>
          </div>
        </div>
      </Card>

      {/* 2. Dicionário de Variáveis */}
      <Card className="p-5 space-y-4 border-l-4 border-terracotta dark:border-ochre">
        <h3 className="text-base font-semibold text-espresso dark:text-sand-light flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-terracotta dark:bg-ochre text-white text-xs font-bold">
            2
          </span>
          Dicionário de Variáveis (O que é cada letra?)
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VARIABLES.map((v) => (
            <div
              key={v.symbol}
              className="p-3 rounded-xl bg-sand dark:bg-bark border border-earth-border dark:border-bordermain space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-terracotta/15 dark:bg-ochre/20 font-mono font-bold text-terracotta dark:text-ochre text-sm">
                  {v.symbol}
                </span>
                <span className="font-semibold text-sm text-espresso dark:text-sand-light">{v.label}</span>
              </div>
              <p className="text-xs text-umber dark:text-sand-light/80 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Exemplo Prático Passo a Passo — ATAQUE (A em i=0) */}
      <Card className="p-5 space-y-4 border-l-4 border-terracotta dark:border-ochre bg-terracotta/5 dark:bg-ochre/5">
        <h3 className="text-base font-semibold text-espresso dark:text-sand-light flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-terracotta dark:bg-ochre text-white text-xs font-bold">
            3
          </span>
          Exemplo Prático Passo a Passo — Cifrando <strong>\"A\"</strong> (i = 0) de <code className="font-mono">ATAQUE</code>
        </h3>
        <p className="text-sm text-umber dark:text-sand-light/80">
          Parâmetros: <code className="font-mono">M = 26</code> (A–Z), <code className="font-mono">a = 7</code>, <code className="font-mono">b = 8</code>, <code className="font-mono">s = 3</code>, <code className="font-mono">a⁻¹ = 15</code> (pois 7 × 15 = 105 ≡ 1 mod 26). Letra <strong>\"A\" = 0</strong>.
        </p>
        <div className="space-y-4">
          {/* Passo 1: Cifrar */}
          <div className="rounded-xl bg-sand dark:bg-bark p-4 border border-earth-border dark:border-bordermain space-y-2">
            <h4 className="text-sm font-semibold text-terracotta dark:text-ochre flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white text-xs font-bold">1</span>
              Cifrar <strong>\"A\"</strong> (p₀ = 0, i = 0)
            </h4>
            <div className="space-y-1 font-mono text-sm text-espresso dark:text-sand-light">
              <div><code>c₀ = (7 · 0 + 8 + 3 · 0) mod 26</code></div>
              <div><code>c₀ = (0 + 8 + 0) mod 26</code></div>
              <div><code>c₀ = 8 mod 26 = 8</code></div>
            </div>
            <p className="text-sm font-medium text-espresso dark:text-sand-light">
              Índice 8 → letra <strong><code className="text-2xl font-mono">I</code></strong> (A=0, B=1, …, I=8).
            </p>
          </div>

          {/* Passo 2: Como funciona o mod */}
          <div className="rounded-xl bg-sand dark:bg-bark p-4 border border-earth-border dark:border-bordermain space-y-2">
            <h4 className="text-sm font-semibold text-terracotta dark:text-ochre flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white text-xs font-bold">2</span>
              Como funciona o <code className="font-mono">mod 26</code>
            </h4>
            <p className="text-sm text-umber dark:text-sand-light/80">
              O <code className="font-mono">mod M</code> pega apenas o <strong>resto da divisão inteira por M</strong>.
              O resultado sempre fica entre <code className="font-mono">0</code> e <code className="font-mono">M - 1</code> (0 a 25).
            </p>
            <div className="grid gap-1 sm:grid-cols-2 text-xs font-mono">
              <div className="p-2 rounded bg-terracotta/10 dark:bg-ochre/10">
                Se a soma der <strong>30</strong>:<br />
                <code>30 ÷ 26 = 1</code> com <strong>resto 4</strong><br />
                <code>30 mod 26 = 4</code>
              </div>
              <div className="p-2 rounded bg-terracotta/10 dark:bg-ochre/10">
                Se a soma der <strong>52</strong>:<br />
                <code>52 ÷ 26 = 2</code> com <strong>resto 0</strong><br />
                <code>52 mod 26 = 0</code>
              </div>
            </div>
          </div>

          {/* Passo 3: Decifrar */}
          <div className="rounded-xl bg-sand dark:bg-bark p-4 border border-earth-border dark:border-bordermain space-y-2">
            <h4 className="text-sm font-semibold text-terracotta dark:text-ochre flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white text-xs font-bold">3</span>
              Decifrar <strong>\"I\"</strong> (c₀ = 8, i = 0)
            </h4>
            <div className="space-y-1 font-mono text-sm text-espresso dark:text-sand-light">
              <div><code>p₀ = [15 · (8 - 8 - 3 · 0)] mod 26</code></div>
              <div><code>p₀ = [15 · (0)] mod 26</code></div>
              <div><code>p₀ = 0 mod 26 = 0</code></div>
            </div>
            <p className="text-sm font-medium text-espresso dark:text-sand-light">
              Índice 0 → volta para <strong><code className="text-2xl font-mono">A</code></strong>. ✅
            </p>
          </div>

          {/* Regra para negativo */}
          <div className="rounded-xl bg-sand dark:bg-bark p-4 border border-earth-border dark:border-bordermain space-y-2 border-terracotta/30 dark:border-ochre/30">
            <h4 className="text-sm font-semibold text-terracotta dark:text-ochre flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white text-xs font-bold">⚠</span>
              Regra para número negativo na decifragem
            </h4>
            <p className="text-sm text-umber dark:text-sand-light/80">
              Se o parêntese <code className="font-mono bg-sand/50 dark:bg-bark/50 px-1.5 rounded">(cᵢ - b - s · i)</code> der negativo, <strong>some M</strong> antes de multiplicar por a⁻¹:
            </p>
            <div className="grid gap-1 sm:grid-cols-2 text-xs font-mono">
              <div className="p-2 rounded bg-terracotta/10 dark:bg-ochre/10">
                Exemplo: resultado = <strong>-5</strong><br />
                <code>-5 + 26 = 21</code><br />
                Agora use <code>21</code> na multiplicação
              </div>
              <div className="p-2 rounded bg-terracotta/10 dark:bg-ochre/10">
                Fórmula canônica (funciona para qualquer x):<br />
                <code>((x % M) + M) % M</code><br />
                Ex: <code>((-5 % 26) + 26) % 26 = 21</code>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Como usar o mod (movido para depois do exemplo) */}
      <Card className="p-5 space-y-4 border-l-4 border-terracotta dark:border-ochre">
        <h3 className="text-base font-semibold text-espresso dark:text-sand-light flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-terracotta dark:bg-ochre text-white text-xs font-bold">
            4
          </span>
          Como usar o <code className="font-mono text-terracotta dark:text-ochre bg-sand/50 dark:bg-bark/50 px-1.5 rounded">mod M</code> na fórmula
        </h3>
        <div className="space-y-3 text-sm text-umber dark:text-sand-light/80">
          <p>
            O <code className="font-mono bg-sand/50 dark:bg-bark/50 px-1.5 rounded">mod M</code> pega apenas o <strong>resto da divisão inteira por M</strong>, garantindo que o resultado
            fique sempre entre <code className="font-mono">0</code> e <code className="font-mono">M - 1</code> (os índices válidos do alfabeto).
          </p>
          <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain space-y-2">
            <p className="font-medium text-espresso dark:text-sand-light">Miniexemplo numérico (M = 26):</p>
            <div className="grid gap-1 sm:grid-cols-2 text-xs">
              <div>
                <code className="font-mono">30 ÷ 26 = 1</code> com <strong>resto 4</strong>
              </div>
              <div>
                <code className="font-mono">30 mod 26 = 4</code>
              </div>
            </div>
          </div>
          <p>
            <strong>Caso negativo na decifragem:</strong> quando <code className="font-mono bg-sand/50 dark:bg-bark/50 px-1.5 rounded">(cᵢ - b - s·i)</code> dá negativo,
            somamos <code className="font-mono">M</code> até ficar positivo — ou usamos a fórmula canônica:
          </p>
          <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain text-center">
            <code className="font-mono text-lg font-semibold text-espresso dark:text-sand-light whitespace-nowrap">
              ((x mod M) + M) mod M
            </code>
          </div>
          <p className="text-xs text-umber dark:text-sand-light/80">
            Isso garante um resultado válido em <code className="font-mono">[0, M-1]</code> para qualquer inteiro x.
          </p>
        </div>
      </Card>

      {/* 5. Condição de Reversibilidade (sem LaTeX cru) */}
      <Card className="p-5 space-y-4 border-l-4 border-terracotta dark:border-ochre bg-terracotta/5 dark:bg-ochre/5">
        <h3 className="text-base font-semibold text-espresso dark:text-sand-light flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-terracotta dark:bg-ochre text-white text-xs font-bold">
            5
          </span>
          Condição de Reversibilidade (Por que <code className="font-mono text-terracotta dark:text-ochre bg-sand/50 dark:bg-bark/50 px-1.5 rounded">mdc(a, M) = 1</code>?)
        </h3>
        <div className="space-y-3 text-sm text-umber dark:text-sand-light/80">
          <p>
            Para decifrar, precisamos do <strong>inverso modular a⁻¹</strong> — o número que, multiplicado por <code className="font-mono">a</code>, dá 1 módulo <code className="font-mono">M</code>:
          </p>
          <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain text-center">
            <code className="font-mono text-lg font-semibold text-espresso dark:text-sand-light whitespace-nowrap">
              (a · a⁻¹) mod M = 1
            </code>
          </div>
          <p>
            O inverso <strong>só existe se <code className="font-mono">a</code> e <code className="font-mono">M</code> forem coprimos</strong> (máximo divisor comum = 1).
            Se tiverem um divisor em comum {'>'} 1, a multiplicação por <code className="font-mono">a</code> <q>cola</q> valores diferentes no mesmo resultado,
            e a mensagem <strong>não tem volta</strong> (duas letras viram a mesma cifra).
          </p>
          <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain">
            <p className="font-medium text-espresso dark:text-sand-light mb-2">Exemplo prático (M = 95):</p>
            <div className="grid gap-1 sm:grid-cols-3 text-xs">
              <div className="p-2 rounded bg-terracotta/10 dark:bg-ochre/10">
                <code className="font-mono">a = 7</code> → mdc(7, 95) = 1 ✓<br />
                <span className="text-terracotta dark:text-ochre">Tem inverso: 7 × 68 = 476 ≡ 1 (mod 95)</span>
              </div>
              <div className="p-2 rounded bg-terracotta/10 dark:bg-ochre/10">
                <code className="font-mono">a = 5</code> → mdc(5, 95) = 5 ✗<br />
                <span className="text-red-600 dark:text-red-400">Sem inverso — cifra irreversível</span>
              </div>
              <div className="p-2 rounded bg-terracotta/10 dark:bg-ochre/10">
                <code className="font-mono">a = 19</code> → mdc(19, 95) = 1 ✓<br />
                <span className="text-terracotta dark:text-ochre">Tem inverso: 19 × 74 = 1406 ≡ 1</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-umber dark:text-sand-light/80">
            O sistema valida automaticamente: chaves com <code className="font-mono">mdc(a, M) ≠ 1</code> são rejeitadas.
          </p>
        </div>
      </Card>
    </div>
  );
}