'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { mesOuAtual, nomeMes, somarMeses } from '@/lib/formato';
import { Marca } from '../Marca';

const NAV = [
  { href: '/', rotulo: 'Dashboard' },
  { href: '/lancamentos', rotulo: 'Lançamentos' },
];

const Chevron = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export function Cabecalho({ nome }: { nome: string }) {
  const pathname = usePathname();
  const mes = mesOuAtual(useSearchParams().get('mes') ?? undefined);
  const comMes = pathname === '/' || pathname === '/lancamentos';
  const nomeDoMes = nomeMes(mes);
  const rotuloMes = `${nomeDoMes[0].toUpperCase()}${nomeDoMes.slice(1)} ${mes.slice(0, 4)}`;
  const ativo = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="border-b border-borda bg-superficie">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3.5 sm:px-8">
        <Marca />
        <nav aria-label="Principal" className="flex gap-1">
          {NAV.map(({ href, rotulo }) => (
            <Link
              key={href}
              href={href}
              aria-current={ativo(href) ? 'page' : undefined}
              className={`flex h-11 items-center rounded-[10px] px-3.5 ${
                ativo(href) ? 'bg-ativo font-semibold text-tinta' : 'font-medium text-suave hover:text-tinta'
              }`}
            >
              {rotulo}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          {comMes && (
            <div className="flex items-center rounded-[10px] border border-borda bg-superficie">
              <Link href={`${pathname}?mes=${somarMeses(mes, -1)}`} aria-label="Mês anterior"
                className="grid size-11 place-items-center rounded-[10px] text-tinta hover:bg-ativo">
                <Chevron d="M10 3 5 8l5 5" />
              </Link>
              <span className="min-w-[132px] text-center font-semibold">{rotuloMes}</span>
              <Link href={`${pathname}?mes=${somarMeses(mes, 1)}`} aria-label="Próximo mês"
                className="grid size-11 place-items-center rounded-[10px] text-tinta hover:bg-ativo">
                <Chevron d="m6 3 5 5-5 5" />
              </Link>
            </div>
          )}
          <Link href="/lancamentos/novo"
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-tinta px-[18px] font-semibold text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" aria-hidden="true">
              <path d="M8 3v10M3 8h10" />
            </svg>
            Novo lançamento
          </Link>
          <div className="flex items-center gap-1">
            <span className="text-sm text-suave">{nome}</span>
            <form action="/sair" method="post">
              <button type="submit"
                className="h-11 cursor-pointer rounded-[10px] px-3 text-sm font-semibold text-tinta hover:bg-ativo">
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
