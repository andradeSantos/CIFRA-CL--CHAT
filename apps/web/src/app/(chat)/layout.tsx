import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-sand-light dark:bg-dark-earth">
      {children}
    </div>
  );
}