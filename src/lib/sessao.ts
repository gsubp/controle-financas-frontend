import { cookies } from 'next/headers';

export const COOKIE_SESSAO = 'sessao';
const SETE_DIAS = 60 * 60 * 24 * 7;

export async function salvarSessao(token: string): Promise<void> {
  (await cookies()).set(COOKIE_SESSAO, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SETE_DIAS,
    path: '/',
  });
}

export async function lerToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_SESSAO)?.value;
}
