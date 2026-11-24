import type { Metadata } from 'next';
import { hoje } from '@/lib/formato';
import { FormLancamento } from '../FormLancamento';

export const metadata: Metadata = { title: 'Novo lançamento · Finanças' };

export default function PaginaNovoLancamento() {
  return <FormLancamento hoje={hoje()} />;
}
