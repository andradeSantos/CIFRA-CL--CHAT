'use client';

import { useState } from 'react';
import { Play, CheckCircle2, XCircle, FlaskConical } from 'lucide-react';
import { encrypt, decrypt, ACADEMIC_CONFIG, DEFAULT_PROD_CONFIG } from '@cifra/ccg-core';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

const MANDATORY_VECTORS = [
  { id: 1, plain: 'ATAQUE', expectedCipher: 'ICOTQR' },
  { id: 2, plain: 'TROPAS', expectedCipher: 'ZSGOUJ' },
  { id: 3, plain: 'DEFESA', expectedCipher: 'XFNLGX' },
  { id: 4, plain: 'RECUAR', expectedCipher: 'PFYNUE' },
  { id: 5, plain: 'VITORIA', expectedCipher: 'JZFJBLA' },
];

interface TestRunResult {
  id: number;
  plain: string;
  expectedCipher: string;
  actualCipher: string;
  actualDecipher: string;
  pass: boolean;
}

export function PainelDemo() {
  const [results, setResults] = useState<TestRunResult[] | null>(null);
  const [inspectInput, setInspectInput] = useState('ATAQUE');

  const runMandatoryTests = () => {
    const executed = MANDATORY_VECTORS.map((vec) => {
      const actualCipher = encrypt(vec.plain, ACADEMIC_CONFIG);
      const actualDecipher = decrypt(actualCipher, ACADEMIC_CONFIG);
      const pass = actualCipher === vec.expectedCipher && actualDecipher === vec.plain;
      return {
        ...vec,
        actualCipher,
        actualDecipher,
        pass,
      };
    });
    setResults(executed);
  };

  const inspectM26 = inspectInput
    ? encrypt(inspectInput.toUpperCase().replace(/[^A-Z]/g, '') || 'A', ACADEMIC_CONFIG)
    : '';
  const inspectM95 = inspectInput ? encrypt(inspectInput, DEFAULT_PROD_CONFIG) : '';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-espresso dark:text-sand-light">
          Painel de Apresentação (Modo Demo)
        </h2>
        <p className="text-sm text-umber dark:text-ochre">
          Inspeção comparativa (M=26 vs M=95) e validação dos 5 vetores obrigatórios da especificação.
        </p>
      </div>

      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-terracotta dark:text-ochre" />
          <h3 className="text-base font-semibold text-espresso dark:text-sand-light">
            Inspeção Comparativa Rápida
          </h3>
        </div>

        <Input
          value={inspectInput}
          onChange={(e) => setInspectInput(e.target.value)}
          placeholder="Digite um texto para comparar M=26 e M=95"
        />

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain">
            <span className="text-xs text-umber dark:text-ochre block mb-1">
              M = 26 (a=5, b=8, s=3) — Acadêmico
            </span>
            <code className="font-mono text-sm font-bold text-espresso dark:text-sand-light break-all">
              {inspectM26 || '—'}
            </code>
          </div>
          <div className="rounded-xl bg-sand dark:bg-bark p-3 border border-earth-border dark:border-bordermain">
            <span className="text-xs text-umber dark:text-ochre block mb-1">
              M = 95 (a=7, b=8, s=3) — Produção Chat Clã
            </span>
            <code className="font-mono text-sm font-bold text-terracotta dark:text-ochre break-all">
              {inspectM95 || '—'}
            </code>
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-espresso dark:text-sand-light">
              5 Testes Obrigatórios (M = 26, a = 5, b = 8, s = 3)
            </h3>
            <p className="text-xs text-umber dark:text-ochre">
              Executa cifragem e roundtrip de decifragem com <code className="font-mono">@cifra/ccg-core</code>.
            </p>
          </div>
          <Button type="button" onClick={runMandatoryTests}>
            <Play className="w-4 h-4" />
            Executar 5 Testes
          </Button>
        </div>

        {results && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-earth-border dark:border-bordermain text-umber dark:text-ochre">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Plaintext</th>
                  <th className="py-2 px-2">Esperado</th>
                  <th className="py-2 px-2">Obtido</th>
                  <th className="py-2 px-2">Decifrado</th>
                  <th className="py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-earth-border/50 dark:border-bordermain/50 font-mono"
                  >
                    <td className="py-2 px-2">{r.id}</td>
                    <td className="py-2 px-2 font-bold">{r.plain}</td>
                    <td className="py-2 px-2">{r.expectedCipher}</td>
                    <td className="py-2 px-2 text-terracotta dark:text-ochre font-bold">
                      {r.actualCipher}
                    </td>
                    <td className="py-2 px-2">{r.actualDecipher}</td>
                    <td className="py-2 px-2">
                      <Badge variant={r.pass ? 'success' : 'danger'} className="gap-1">
                        {r.pass ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> PASS
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> FAIL
                          </>
                        )}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
