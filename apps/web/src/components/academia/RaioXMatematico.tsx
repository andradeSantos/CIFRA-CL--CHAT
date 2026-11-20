'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Card } from '@/components/ui/Card';

function MathBlock({ tex, display = true }: { tex: string; display?: boolean }) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
      }),
    [tex, display]
  );

  return (
    <div
      className="overflow-x-auto py-2 text-espresso dark:text-sand-light"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const PARAMS = [
  {
    symbol: 'M',
    name: 'Tamanho do Alfabeto',
    detail:
      'M = 26 valida academicamente (A–Z). M = 95 é o Chat Clã (todos os caracteres ASCII imprimíveis de 32 a 126).',
  },
  {
    symbol: 'a',
    name: 'Dispersor',
    detail:
      'Multiplica o caractere para embaralhar a ordem alfabética. Deve ser coprimo de M (mdc(a, M) = 1) para ter inverso e ser decifrável.',
  },
  {
    symbol: 'b',
    name: 'Deslocamento da Sala',
    detail: 'Soma constante fixada pelo conselho (ex.: b = 8).',
  },
  {
    symbol: 's',
    name: 'Passo Tático',
    detail:
      'Soma s · i para cada posição i. Impede que letras iguais gerem a mesma cifra em lugares diferentes.',
  },
];

export function RaioXMatematico() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-espresso dark:text-sand-light">
          Raio-X Matemático da CCG
        </h2>
        <p className="text-sm text-umber dark:text-ochre">
          A cifra transforma cada letra em número, aplica a fórmula modular e volta para caractere.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5 space-y-3">
          <h3 className="text-base font-semibold text-espresso dark:text-sand-light">
            Como cifra (E)
          </h3>
          <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain">
            <MathBlock tex="c_i = (a \\cdot p_i + b + s \\cdot i) \\bmod M" />
          </div>
          <p className="text-xs text-umber dark:text-ochre">
            pᵢ é o número da letra na posição i; cᵢ é o número da letra cifrada.
          </p>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="text-base font-semibold text-espresso dark:text-sand-light">
            Como decifra (D)
          </h3>
          <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain">
            <MathBlock tex="p_i = a^{-1} \\cdot (c_i - b - s \\cdot i) \\bmod M" />
          </div>
          <p className="text-xs text-umber dark:text-ochre">
            Usa a inversa modular a⁻¹ para desfazer a multiplicação. Valores negativos usam{' '}
            <span className="font-mono">((x % M) + M) % M</span>.
          </p>
        </Card>
      </div>

      <Card className="p-5 space-y-3">
        <h3 className="text-base font-semibold text-espresso dark:text-sand-light">
          Condição para existir a inversa
        </h3>
        <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain">
          <MathBlock tex="\\gcd(a, M) = 1 \\iff \\exists\\, a^{-1} \\in \\mathbb{Z}_M \\text{ com } (a \\cdot a^{-1}) \\equiv 1 \\pmod{M}" />
        </div>
        <p className="text-sm text-umber dark:text-sand-light/80">
          O inverso modular a⁻¹ é achado pelo <strong>Algoritmo de Euclides Estendido</strong>. Exemplo:{' '}
          <span className="font-mono">a = 7, M = 95</span>:{' '}
          <span className="font-mono">7 × 68 = 476 = 5 × 95 + 1 ≡ 1 (mod 95)</span>, logo{' '}
          <span className="font-mono">a⁻¹ = 68</span>.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {PARAMS.map((param) => (
          <Card key={param.symbol} className="p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-terracotta/15 dark:bg-ochre/20 font-mono font-bold text-terracotta dark:text-ochre">
                {param.symbol}
              </span>
              <h4 className="font-semibold text-sm text-espresso dark:text-sand-light">
                {param.name}
              </h4>
            </div>
            <p className="text-xs text-umber dark:text-sand-light/80 leading-relaxed">
              {param.detail}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
