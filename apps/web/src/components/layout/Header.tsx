'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, User, LogOut, BookOpen, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const navigation = [
    { href: '/chat', label: 'Sala de Comando', icon: Shield },
    { href: '/academia', label: 'Academia da Cifra', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-sand-light/80 dark:bg-dark-earth/80 backdrop-blur-md border-b border-earth-border dark:border-border-color">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navegação principal">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/chat" className="flex items-center gap-2 text-xl font-bold text-espresso dark:text-sand-light">
              <svg className="w-7 h-7 text-terracotta dark:text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Chat Clã</span>
            </Link>

            <div className="hidden md:flex md:items-center md:gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-terracotta text-white dark:bg-ochre'
                      : 'text-umber dark:text-ochre hover:bg-[var(--surface-hover)] dark:hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const newTheme = theme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
                localStorage.setItem('theme', newTheme);
              }}
              className="p-2 rounded-xl text-umber dark:text-ochre hover:bg-surface-hover dark:hover:bg-surface-hover transition-colors"
              aria-label={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-espresso dark:text-sand-light">{user.username}</p>
                  <p className="text-xs text-umber dark:text-ochre capitalize">{user.rank}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex sm:items-center sm:gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-1" />
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    <Shield className="w-4 h-4 mr-1" />
                    Ingressar
                  </Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-umber dark:text-ochre hover:bg-surface-hover dark:hover:bg-surface-hover transition-colors"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-earth-border dark:border-bordermain py-4">
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-terracotta text-white dark:bg-ochre'
                    : 'text-umber dark:text-ochre hover:bg-[var(--surface-hover)] dark:hover:bg-[var(--surface-hover)]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            <hr className="border-earth-border dark:border-bordermain my-2" />
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-umber dark:text-ochre hover:bg-surface-hover dark:hover:bg-surface-hover w-full text-left">
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center">
                    <User className="w-4 h-4 mr-1" />
                    Entrar
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Ingressar no Clã
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}