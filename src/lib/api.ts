import { encerrarSessao, lerToken } from './sessao';

export class ErroApi extends Error {
  constructor(
    public readonly status: number,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = 'ErroApi';
  }
}

const BASE = process.env.API_URL ?? 'http://localhost:3333';

/** Chamada à API Nest feita no servidor, com o Bearer do cookie de sessão. */
export async function api<T>(caminho: string, init: RequestInit & { semToken?: boolean } = {}): Promise<T> {
  const { semToken, ...resto } = init;
  const token = semToken ? undefined : await lerToken();
  const res = await fetch(BASE + caminho, {
    ...resto,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
  });

  // Token vencido ou inválido: apaga o cookie e manda para /login (ver encerrarSessao).
  if (res.status === 401 && token) await encerrarSessao();
  if (res.status === 204) return undefined as T;

  const corpo = await res.json().catch(() => ({}));
  if (!res.ok) {
    const mensagem = Array.isArray(corpo.message) ? corpo.message.join('; ') : (corpo.message ?? 'Erro inesperado');
    throw new ErroApi(res.status, mensagem);
  }
  return corpo as T;
}
