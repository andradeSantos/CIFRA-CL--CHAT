import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-light dark:bg-dark-earth px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/login" className="inline-flex items-center gap-2 text-2xl font-bold text-espresso dark:text-sand-light">
            <svg className="w-8 h-8 text-terracotta dark:text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Chat Clã</span>
          </Link>
          <p className="mt-2 text-umber dark:text-ochre text-sm">Cifra do Conselho de Guerra</p>
        </div>
        <div className="card p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-sm text-umber dark:text-ochre">
          <Link href="/academia" className="text-terracotta dark:text-ochre hover:underline font-medium">
            Academia da Cifra
          </Link>
        </p>
      </div>
    </div>
  );
}