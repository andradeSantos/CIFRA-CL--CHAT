'use client';

import { Card } from '@/components/ui/Card';
import { ShieldCheck, Zap, Link2, ArrowRight } from 'lucide-react';

const PASSOS = [
  {
    num: 1,
    titulo: 'Transforma letra em número',
    texto:
      'Cada caractere vira um número (pᵢ) de acordo com o alfabeto usado (A=0 … Z=25 para M=26, ou a tabela ASCII de 32 a 126 para M=95).',
  },
  {
    num: 2,
    titulo: 'Aplica a fórmula de cifragem',
    texto:
      'cᵢ = (a × pᵢ + b + s × i) mod M. Multiplica pela Chave Multiplicativa (a), soma a Chave de Deslocamento (b) e o Salto Posicional (s·i), depois tira o resto da divisão por M.',
  },
  {
    num: 3,
    titulo: 'O resultado é a cifra',
    texto:
      'O número restante (cᵢ) vira caractere novamente. Como o salto depende da posição i, letras iguais em lugares diferentes (ex: dois “A” em “ATAQUE”) geram cifras distintas.',
  },
  {
    num: 4,
    titulo: 'Decifra com a inversa',
    texto:
      'Quem tem a chave usa o inverso modular a⁻¹ para voltar ao número original e ler a mensagem. Sem a chave correta, não há como reverter.',
  },
];

const DIFERENCIAIS = [
  {
    icon: ShieldCheck,
    titulo: 'Não repete a mesma letra',
    texto:
      'Graças ao Salto Posicional (s·i), o “A” na posição 0 e o “A” na posição 2 cifram diferente. Isso resiste à análise de frequência que quebra a Cifra de César.',
  },
  {
    icon: Zap,
    titulo: 'Rápido e leve',
    texto:
      'Usa apenas soma, multiplicação e resto de divisão. Não precisa de chaves públicas pesadas nem criptografia de curva elíptica.',
  },
  {
    icon: Link2,
    titulo: 'Chave validada automaticamente',
    texto:
      'A Chave Multiplicativa (a) deve ser coprima de M (mdc(a, M) = 1) para ter inverso modular. O sistema só aceita chaves válidas, garantindo que toda mensagem cifrada possa ser decifrada.',
  },
];

export function ResumoCifra() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-espresso dark:text-sand-light">
          Resumo da Cifra do Conselho de Guerra
        </h2>
        <p className="text-sm text-umber dark:text-ochre">
          O que é, como funciona em 4 passos e por que é diferente de outras cifras clássicas.
        </p>
      </div>

      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-terracotta dark:text-ochre" />
          <h3 className="text-base font-semibold text-espresso dark:text-sand-light">
            Como funciona (em 4 passos)
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {PASSOS.map((p) => (
            <Card
              key={p.num}
              className="p-4 space-y-2 border-l-2 border-terracotta dark:border-ochre"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-terracotta dark:bg-ochre text-white font-bold text-xs">
                  {p.num}
                </span>
                <h4 className="font-semibold text-sm text-espresso dark:text-sand-light">
                  {p.titulo}
                </h4>
              </div>
              <p className="text-sm text-umber dark:text-sand-light/80 leading-relaxed">
                {p.texto}
              </p>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-terracotta dark:text-ochre" />
          <h3 className="text-base font-semibold text-espresso dark:text-sand-light">
            O que a diferencia de outras cifras
          </h3>
        </div>
        <div className="space-y-3">
          {DIFERENCIAIS.map((d) => (
            <div key={d.titulo} className="flex items-start gap-3">
              <d.icon className="w-5 h-5 shrink-0 text-terracotta dark:text-ochre" />
              <div>
                <h4 className="font-semibold text-sm text-espresso dark:text-sand-light">
                  {d.titulo}
                </h4>
                <p className="text-sm text-umber dark:text-sand-light/80 leading-relaxed">
                  {d.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-3 border border-terracotta/30 dark:border-ochre/30 bg-terracotta/5 dark:bg-ochre/5">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 shrink-0 rounded-full bg-terracotta dark:bg-ochre flex items-center justify-center text-[10px] font-bold text-white dark:text-white">
            !
          </span>
          <div>
            <h4 className="font-semibold text-sm text-terracotta dark:text-ochre">
              Chave de produção do Chat Clã
            </h4>
            <p className="text-sm text-umber dark:text-sand-light/80 leading-relaxed">
              M = 95 (todos os caracteres ASCII imprimíveis), Chave Multiplicativa a = 7, Chave de Deslocamento b = 8, Salto Posicional s = 3. A inversa modular de 7
              mod 95 é 68, pois 7 × 68 = 476 = 5 × 95 + 1.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
