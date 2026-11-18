'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
      setError('Nome de guerra deve ter 3-50 caracteres (letras, números, underscore)');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao cadastrar');
        return;
      }

      router.push('/chat');
      router.refresh();
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-terracotta/10 dark:bg-ochre/10 text-terracotta dark:text-ochre mb-4">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-espresso dark:text-sand-light">Ingressar no Clã</h1>
        <p className="text-umber dark:text-ochre text-sm mt-1">Crie seu nome de guerra</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-espresso dark:text-sand-light mb-2">
          Nome de Guerra
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          placeholder="Ex: general_silva"
          required
          autoComplete="username"
          disabled={loading}
          maxLength={50}
        />
        <p className="mt-1 text-xs text-umber dark:text-ochre">3-50 caracteres: letras, números, underscore</p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-espresso dark:text-sand-light mb-2">
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input pr-12"
            placeholder="••••••••"
            required
            autoComplete="new-password"
            disabled={loading}
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-umber dark:text-ochre hover:text-terracotta dark:hover:text-ochre"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-umber dark:text-ochre">Mínimo 8 caracteres</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-espresso dark:text-sand-light mb-2">
          Confirmar Senha
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input pr-12"
            placeholder="••••••••"
            required
            autoComplete="new-password"
            disabled={loading}
          />
        </div>
      </div>

      <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Criando conta...
          </span>
        ) : (
          'Criar Conta e Entrar'
        )}
      </button>

      <p className="text-center text-sm text-umber dark:text-ochre">
        Já tem nome de guerra?{' '}
        <a href="/login" className="text-terracotta dark:text-ochre hover:underline font-medium">
          Entrar
        </a>
      </p>
    </form>
  );
}