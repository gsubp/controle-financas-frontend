import { formatarMoeda, formatarPercentual, nomeMes } from '@/lib/formato';
import type { Resumo } from '@/lib/tipos';

export function PorCategoria({ resumo }: { resumo: Resumo }) {
  const nome = nomeMes(resumo.mes);
  return (
    <section className="flex min-w-0 flex-[1_1_340px] flex-col gap-5 rounded-[14px] border border-borda bg-superficie px-6 py-[22px]">
      <div>
        <h2 className="font-display text-[19px] font-semibold">Despesas por categoria</h2>
        <p className="mt-0.5 text-sm text-suave">
          {nome[0].toUpperCase() + nome.slice(1)} · {formatarMoeda(resumo.despesasCentavos)}
        </p>
      </div>
      {resumo.porCategoria.length === 0 ? (
        <p className="text-sm text-suave">Nenhuma despesa no mês.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
          {resumo.porCategoria.map((c) => (
            <li key={c.categoria} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{c.categoria}</span>
                <span className="whitespace-nowrap">
                  <span className="font-semibold">{formatarMoeda(c.totalCentavos)}</span>
                  {/* w-16 cabe "100,0%"; mais estreito, o texto transborda e cola no valor. */}
                  <span className="inline-block w-16 text-right text-suave">{formatarPercentual(c.percentual)}</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-trilho">
                <div className="h-full rounded-full bg-despesa" style={{ width: `${c.percentual}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
