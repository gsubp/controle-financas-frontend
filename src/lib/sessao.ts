import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

/**
 * Sessão recusada pela API (token vencido ou forjado).
 * Em Server Action o cookie pode ser apagado aqui mesmo; um redirect de action para a rota /sair
 * vira navegação do router, que não abre Route Handler e trava. Em Server Component o Next proíbe
 * alterar cookies (delete lança), então a rota /sair apaga.
 */
export async function encerrarSessao(): Promise<never> {
  try {
    (await cookies()).delete(COOKIE_SESSAO);
  } catch {
    redirect('/sair');
  }
  redirect('/login');
}
