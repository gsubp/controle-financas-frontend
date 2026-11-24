'use server';

import { redirect } from 'next/navigation';
import { api, ErroApi } from '@/lib/api';
import { parseValor } from '@/lib/formato';
import type { EstadoForm } from '@/lib/tipos';

const texto = (fd: FormData, campo: string) => String(fd.get(campo) ?? '');

export async function salvarLancamento(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const id = texto(fd, 'id');
  const valores = {
    tipo: texto(fd, 'tipo'),
    descricao: texto(fd, 'descricao'),
    categoria: texto(fd, 'categoria'),
    valor: texto(fd, 'valor'),
    data: texto(fd, 'data'),
  };
  const valorCentavos = parseValor(valores.valor);
  if (valorCentavos === null) return { erro: 'Informe um valor maior que zero, como 1.234,56.', valores };

  const { tipo, descricao, categoria, data } = valores;
  try {
    await api(id ? `/lancamentos/${encodeURIComponent(id)}` : '/lancamentos', {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify({ tipo, descricao, categoria, data, valorCentavos }),
    });
  } catch (e) {
    if (e instanceof ErroApi) return { erro: e.message, valores };
    throw e;
  }
  redirect(`/lancamentos?mes=${valores.data.slice(0, 7)}`);
}

export async function excluirLancamento(id: string, mes: string): Promise<void> {
  try {
    await api(`/lancamentos/${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (e) {
    // Já excluído (clique duplo, outra aba): segue para a lista atualizada.
    if (!(e instanceof ErroApi && e.status === 404)) throw e;
  }
  redirect(`/lancamentos?mes=${mes}`);
}
