import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api, ErroApi } from '@/lib/api';
import { hoje } from '@/lib/formato';
import type { Lancamento } from '@/lib/tipos';
import { FormLancamento } from '../../FormLancamento';

export const metadata: Metadata = { title: 'Editar lançamento · Finanças' };

async function buscar(id: string): Promise<Lancamento> {
  try {
    return await api<Lancamento>(`/lancamentos/${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof ErroApi && e.status === 404) notFound();
    throw e;
  }
}

export default async function PaginaEditarLancamento({ params }: PageProps<'/lancamentos/[id]/editar'>) {
  const lancamento = await buscar((await params).id);
  return <FormLancamento lancamento={lancamento} hoje={hoje()} />;
}
