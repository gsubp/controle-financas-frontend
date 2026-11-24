import { NextResponse } from 'next/server';
import { COOKIE_SESSAO } from '@/lib/sessao';

export function GET() {
  // Location relativo: em Route Handler o request.url é montado com localhost, não com o domínio público,
  // e atrás de um proxy reverso (Caddy/nginx) o logout iria para http://localhost:3000/login.
  const resposta = new NextResponse(null, { status: 303, headers: { Location: '/login' } });
  resposta.cookies.delete(COOKIE_SESSAO);
  return resposta;
}

export const POST = GET;
