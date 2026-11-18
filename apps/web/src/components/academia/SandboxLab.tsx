'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowDownUp } from 'lucide-react';
import {
  encryptWithSteps,
  decryptWithSteps,
  validateKey,
  gcd,
  modInv,
  type CCGConfig,
} from '@cifra/ccg-core';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function SandboxLab() {
  const [text, setText] = useState('ATAQUE');
  const [modulus, setModulus] = useState<26 | 95>(26);
  const [a, setA] = useState(5);
  const [b, setB] = useState(8);
  const [s, setS] = useState(3);
  const [showInverse, setShowInverse] = useState(false);

  const isKeyValid = useMemo(() => validateKey({ a, b, s }, modulus), [a, b, s, modulus]);
  const currentGcd = useMemo(() => gcd(a, modulus), [a, modulus]);

  const config: CCGConfig = useMemo(
    () => ({
      M: modulus,
      a,
      b,
      s,
    }),
    [modulus, a, b, s]
  );

  const encryptResult = useMemo(() => {
    if (!isKeyValid || !text) return null;
    try {
      return encryptWithSteps(text, config);
    } catch {
      return null;
    }
  }, [text, config, isKeyValid]);

  const decryptResult = useMemo(() => {
    if (!isKeyValid || !encryptResult?.ciphertext) return null;
    try {
      return decryptWithSteps(encryptResult.ciphertext, config);
    } catch {
      return null;
    }
  }, [encryptResult, config, isKeyValid]);

  const inverseVal = useMemo(() => {
    if (!isKeyValid) return null;
    try {
      return modInv(a, modulus);
    } catch {
      return null;
    }
  }, [a, modulus, isKeyValid]);

  const handleModulusChange = (newMod: 26 | 95) => {
    setModulus(newMod);
    if (newMod === 95 && a === 5) {
      setA(7); // 5 não é coprimo de 95
    } else if (newMod === 26 && a === 7) {
      setA(5);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-espresso dark:text-sand-light">
          Laboratório Interativo (Sandbox)
        </h2>
        <p className="text-sm text-umber dark:text-ochre">
          Teste mensagens e chaves em tempo real observando cada transformação modular passo a passo.
        </p>
      </div>

      <Card className="p-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-umber dark:text-ochre mb-1.5">
              Mensagem Plaintext
            </label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite o texto (ex: ATAQUE)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-umber dark:text-ochre mb-1.5">
              Alfabeto (M)
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={modulus === 26 ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleModulusChange(26)}
              >
                M = 26 (A–Z Acadêmico)
              </Button>
              <Button
                type="button"
                variant={modulus === 95 ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleModulusChange(95)}
              >
                M = 95 (ASCII Produção)
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-umber dark:text-ochre mb-1">
              Multiplicador (a)
            </label>
            <Input
              type="number"
              value={a}
              onChange={(e) => setA(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-umber dark:text-ochre mb-1">
              Deslocamento (b)
            </label>
            <Input
              type="number"
              value={b}
              onChange={(e) => setB(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-umber dark:text-ochre mb-1">
              Passo Tático (s)
            </label>
            <Input
              type="number"
              value={s}
              onChange={(e) => setS(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div
          className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-xs font-medium ${
            isKeyValid
              ? 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : 'bg-red-100/80 dark:bg-red-900/30 text-red-800 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isKeyValid ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Chave válida: mdc({a}, {modulus}) = 1 | Inversa modular a⁻¹ = {inverseVal}
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Chave inválida: mdc({a}, {modulus}) = {currentGcd} ≠ 1. Escolha um valor de{' '}
                  <code className="font-mono">a</code> coprimo de {modulus}.
                </span>
              </>
            )}
          </div>
        </div>
      </Card>

      {encryptResult && (
        <Card className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-umber dark:text-ochre">Resultado Cifrado (Ciphertext)</p>
              <p className="font-mono text-xl font-bold text-terracotta dark:text-ochre break-all">
                {encryptResult.ciphertext}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowInverse((prev) => !prev)}
            >
              <ArrowDownUp className="w-4 h-4" />
              {showInverse ? 'Ocultar Inversa' : 'Mostrar Inversa'}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-earth-border dark:border-bordermain text-umber dark:text-ochre">
                  <th className="py-2 px-2">i</th>
                  <th className="py-2 px-2">char</th>
                  <th className="py-2 px-2">pᵢ</th>
                  <th className="py-2 px-2">conta</th>
                  <th className="py-2 px-2">cᵢ</th>
                  <th className="py-2 px-2">cifra</th>
                </tr>
              </thead>
              <tbody>
                {encryptResult.steps.map((step, idx) => (
                  <motion.tr
                    key={`${step.position}-${step.char}-${idx}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-earth-border/50 dark:border-bordermain/50 font-mono"
                  >
                    <td className="py-2 px-2">{step.position}</td>
                    <td className="py-2 px-2 font-bold">{step.char}</td>
                    <td className="py-2 px-2">{step.plainValue}</td>
                    <td className="py-2 px-2 text-umber dark:text-ochre">{step.formula}</td>
                    <td className="py-2 px-2">{step.cipherValue}</td>
                    <td className="py-2 px-2 font-bold text-terracotta dark:text-ochre">
                      {step.cipherChar}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {showInverse && decryptResult && (
            <div className="pt-4 border-t border-earth-border dark:border-bordermain space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-espresso dark:text-sand-light">
                  Cálculo da Inversa (a⁻¹ = {inverseVal})
                </h3>
                <span className="font-mono text-sm font-bold text-green-700 dark:text-green-400">
                  Decifrado: {decryptResult.plaintext}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-earth-border dark:border-bordermain text-umber dark:text-ochre">
                      <th className="py-2 px-2">i</th>
                      <th className="py-2 px-2">cifra</th>
                      <th className="py-2 px-2">cᵢ</th>
                      <th className="py-2 px-2">inversa</th>
                      <th className="py-2 px-2">pᵢ</th>
                      <th className="py-2 px-2">char</th>
                    </tr>
                  </thead>
                  <tbody>
                    {decryptResult.steps.map((step, idx) => (
                      <tr
                        key={`inv-${step.position}-${idx}`}
                        className="border-b border-earth-border/50 dark:border-bordermain/50 font-mono"
                      >
                        <td className="py-2 px-2">{step.position}</td>
                        <td className="py-2 px-2">{step.cipherChar}</td>
                        <td className="py-2 px-2">{step.cipherValue}</td>
                        <td className="py-2 px-2 text-umber dark:text-ochre">{step.formula}</td>
                        <td className="py-2 px-2">{step.plainValue}</td>
                        <td className="py-2 px-2 font-bold text-green-700 dark:text-green-400">
                          {step.char}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
