import { api } from '@/lib/api';
import { mesOuAtual, nomeMes, somarMeses } from '@/lib/formato';
import type { Resumo } from '@/lib/tipos';
import { Cartoes } from './_dashboard/Cartoes';
import { GraficoMeses } from './_dashboard/GraficoMeses';
import { PorCategoria } from './_dashboard/PorCategoria';
import { Recentes } from './_dashboard/Recentes';

function subtitulo(quantidade: number) {
  if (quantidade === 0) return 'Nenhum lançamento registrado';
  return quantidade === 1 ? '1 lançamento registrado' : `${quantidade} lançamentos registrados`;
}

export default async function Dashboard({ searchParams }: PageProps<'/'>) {
  const mes = mesOuAtual((await searchParams).mes);
  const resumo = await api<Resumo>(`/resumo?mes=${mes}`);

  return (
    <>
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-tight tracking-tight">
          Balanço de {nomeMes(mes)}
        </h1>
        <p className="mt-1.5 text-suave">{subtitulo(resumo.quantidade)}</p>
      </div>
      <Cartoes resumo={resumo} mesAnterior={somarMeses(mes, -1)} />
      <div className="flex flex-wrap gap-4">
        <GraficoMeses resumo={resumo} />
        <PorCategoria resumo={resumo} />
      </div>
      <Recentes resumo={resumo} />
    </>
  );
}
