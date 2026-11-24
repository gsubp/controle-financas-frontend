import Link from 'next/link';
import { formatarDiaMes, nomeMes } from '@/lib/formato';
import type { Resumo } from '@/lib/tipos';
import { ChipTipo, ValorAssinado } from '../ChipTipo';

const COLUNAS = 'grid grid-cols-[88px_minmax(0,2fr)_minmax(0,1.2fr)_104px_160px] items-center gap-3';

export function Recentes({ resumo }: { resumo: Resumo }) {
  if (resumo.quantidade === 0) {
    return (
      <section className="flex flex-col items-center gap-3 rounded-[14px] border border-borda bg-superficie px-6 py-10 text-center">
        <p className="text-suave">Nenhum lançamento em {nomeMes(resumo.mes)}.</p>
        <Link href="/lancamentos/novo"
          className="inline-flex h-11 items-center rounded-[10px] bg-tinta px-[18px] font-semibold text-white">
          Registrar o primeiro
        </Link>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2 rounded-[14px] border border-borda bg-superficie px-6 py-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-[19px] font-semibold">Últimos lançamentos</h2>
        <Link href={`/lancamentos?mes=${resumo.mes}`}
          className="flex min-h-11 items-center gap-1.5 font-semibold text-receita-texto">
          Ver todos
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className={`${COLUNAS} border-b border-borda pb-2.5 text-[13px] font-medium text-suave`}>
            <span>Data</span>
            <span>Descrição</span>
            <span>Categoria</span>
            <span>Tipo</span>
            <span className="text-right">Valor</span>
          </div>
          {resumo.recentes.map((l) => (
            <div key={l.id} className={`${COLUNAS} border-b border-linha py-[13px] text-sm`}>
              <span className="text-suave">{formatarDiaMes(l.data)}</span>
              <span className="truncate font-medium">{l.descricao}</span>
              <span className="text-suave">{l.categoria}</span>
              <span><ChipTipo tipo={l.tipo} /></span>
              <ValorAssinado centavos={l.valorCentavos} tipo={l.tipo} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
