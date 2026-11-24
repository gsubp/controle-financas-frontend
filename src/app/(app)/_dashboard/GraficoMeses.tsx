import { formatarMoeda, nomeMes } from '@/lib/formato';
import { escalaGrafico, rotuloEixo, saldoCompacto } from '@/lib/grafico';
import type { Resumo } from '@/lib/tipos';

const Legenda = ({ cor, texto }: { cor: string; texto: string }) => (
  <span className="flex items-center gap-1.5">
    <span className={`size-2.5 rounded-[3px] ${cor}`} />
    {texto}
  </span>
);

export function GraficoMeses({ resumo }: { resumo: Resumo }) {
  const { historico, mes } = resumo;
  const marcas = escalaGrafico(Math.max(0, ...historico.flatMap((h) => [h.receitasCentavos, h.despesasCentavos])));
  const topo = marcas[0];
  const altura = (c: number) => `${(c / topo) * 100}%`;
  const descricao =
    `Gráfico de barras com receitas e despesas de ${nomeMes(historico[0].mes)} a ${nomeMes(mes)}. ` +
    `Em ${nomeMes(mes)}, receitas de ${formatarMoeda(resumo.receitasCentavos)} ` +
    `e despesas de ${formatarMoeda(resumo.despesasCentavos)}.`;

  return (
    <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-5 rounded-[14px] border border-borda bg-superficie px-6 py-[22px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[19px] font-semibold">Receitas x despesas</h2>
          <p className="mt-0.5 text-sm text-suave">Últimos 6 meses, em R$</p>
        </div>
        <div className="flex gap-4 text-[13px] text-suave">
          <Legenda cor="bg-receita" texto="Receitas" />
          <Legenda cor="bg-despesa" texto="Despesas" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div role="img" aria-label={descricao} className="relative h-[260px] pl-[52px]">
          {marcas.map((m) => {
            const topoMarca = `${(1 - m / topo) * 100}%`;
            return (
              <div key={m}>
                <div className="absolute left-[52px] right-0 border-t border-linha" style={{ top: topoMarca }} />
                <span className="absolute left-0 w-[42px] -translate-y-1/2 text-right text-xs leading-none text-suave"
                  style={{ top: topoMarca }}>
                  {rotuloEixo(m)}
                </span>
              </div>
            );
          })}
          <div className="absolute bottom-0 left-[52px] right-0 top-0 flex items-end justify-around">
            {historico.map((h) => (
              <div key={h.mes} className="flex h-full items-end gap-1 sm:gap-1.5">
                <div title={`Receitas em ${nomeMes(h.mes)}: ${formatarMoeda(h.receitasCentavos)}`}
                  className="w-3 rounded-t-[5px] bg-receita sm:w-6" style={{ height: altura(h.receitasCentavos) }} />
                <div title={`Despesas em ${nomeMes(h.mes)}: ${formatarMoeda(h.despesasCentavos)}`}
                  className="w-3 rounded-t-[5px] bg-despesa sm:w-6" style={{ height: altura(h.despesasCentavos) }} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-around pl-[52px]">
          {historico.map((h) => (
            // flex-1: cada rótulo ocupa a mesma fatia que o justify-around dá às barras, então os centros alinham.
            <div key={h.mes} className="flex min-w-0 flex-1 flex-col items-center leading-snug">
              <span className={`text-[13px] ${h.mes === mes ? 'font-bold text-tinta' : 'font-medium text-suave'}`}>
                {nomeMes(h.mes).slice(0, 3)}
              </span>
              <span className="hidden whitespace-nowrap text-xs text-suave sm:block">
                {saldoCompacto(h.receitasCentavos - h.despesasCentavos)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
