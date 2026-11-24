import { NextResponse, type NextRequest } from 'next/server';

const ABERTAS = ['/login', '/cadastro', '/sair'];
const SO_DESLOGADO = ['/login', '/cadastro'];

export function proxy(request: NextRequest) {
  // Mesmo nome de COOKIE_SESSAO (src/lib/sessao.ts), que não é importado aqui por depender de next/headers.
  const logado = request.cookies.has('sessao');
  const { pathname } = request.nextUrl;

  if (!logado && !ABERTAS.includes(pathname)) return NextResponse.redirect(new URL('/login', request.url));
  if (logado && SO_DESLOGADO.includes(pathname)) return NextResponse.redirect(new URL('/', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
