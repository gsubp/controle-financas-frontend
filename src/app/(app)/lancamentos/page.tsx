import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { mesOuAtual, nomeMes } from '@/lib/formato';
import type { Lancamento } from '@/lib/tipos';
import { ListaLancamentos } from './ListaLancamentos';

export const metadata: Metadata = { title: 'Lançamentos · Finanças' };

export default async function PaginaLancamentos({ searchParams }: PageProps<'/lancamentos'>) {
  const mes = mesOuAtual((await searchParams).mes);
  const lancamentos = await api<Lancamento[]>(`/lancamentos?mes=${mes}`);

  return (
    <>
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-tight tracking-tight">Lançamentos</h1>
        <p className="mt-1.5 text-suave">
          Receitas e despesas de {nomeMes(mes)} de {mes.slice(0, 4)}
        </p>
      </div>
      {/* key: trocar de mês zera os filtros. */}
      <ListaLancamentos key={mes} lancamentos={lancamentos} mes={mes} />
    </>
  );
}
