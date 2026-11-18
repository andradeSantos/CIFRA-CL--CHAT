import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Chat Clã — Cifra do Conselho de Guerra',
  description: 'Sistema de mensagens criptografadas com a Cifra do Conselho de Guerra (CCG)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-sand-light text-espresso dark:bg-dark-earth dark:text-sand-light min-h-screen`}>
        {children}
      </body>
    </html>
  );
}