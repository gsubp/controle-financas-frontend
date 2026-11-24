import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_SESSAO } from '@/lib/sessao';

export function GET(request: NextRequest) {
  const resposta = NextResponse.redirect(new URL('/login', request.url), 303);
  resposta.cookies.delete(COOKIE_SESSAO);
  return resposta;
}

export const POST = GET;
