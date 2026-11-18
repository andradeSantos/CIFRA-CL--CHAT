import { cookies } from 'next/headers';

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/me`, {
      headers: {
        Cookie: `token=${token}`,
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

export async function getServerUser() {
  const session = await getServerSession();
  return session;
}