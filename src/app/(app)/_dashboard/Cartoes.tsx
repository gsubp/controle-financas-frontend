import { formatarMoeda, formatarPercentual, formatarVariacao, nomeMes } from '@/lib/formato';
import type { Resumo } from '@/lib/tipos';

const VALOR = 'font-display text-[32px] font-semibold leading-tight tracking-tight';
const CARTAO = 'flex flex-col gap-2.5 rounded-[14px] border border-borda bg-superficie px-[22px] py-5';

const moedaComSinal = (c: number) => (c < 0 ? '− ' : '') + formatarMoeda(Math.abs(c));

function textoVariacao(v: number | null, mesAnterior: string) {
  const formatada = formatarVariacao(v);
  return formatada ? `${formatada} em relação a ${mesAnterior}` : `Sem dados de ${mesAnterior}`;
}

const Marcador = ({ cor }: { cor: string }) => <span className={`size-2.5 rounded-[3px] ${cor}`} />;

export function Cartoes({ resumo, mesAnterior }: { resumo: Resumo; mesAnterior: string }) {
  const anterior = nomeMes(mesAnterior);
  const taxa = resumo.taxaPoupanca;

  return (
    <section aria-label="Resumo do mês" className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      <div className="flex flex-col gap-2.5 rounded-[14px] bg-tinta px-[22px] py-5 text-white">
        <span className="text-sm font-medium text-suave-escuro">Saldo do mês</span>
        <span className={VALOR}>{moedaComSinal(resumo.saldoCentavos)}</span>
        <span className="text-[13px] text-suave-escuro">{textoVariacao(resumo.variacao.saldo, anterior)}</span>
      </div>

      <div className={CARTAO}>
        <span className="flex items-center gap-2 text-sm font-medium text-suave">
          <Marcador cor="bg-receita" />
          Receitas
        </span>
        <span className={VALOR}>{formatarMoeda(resumo.receitasCentavos)}</span>
        <span className="text-[13px] text-suave">{textoVariacao(resumo.variacao.receitas, anterior)}</span>
      </div>

      <div className={CARTAO}>
        <span className="flex items-center gap-2 text-sm font-medium text-suave">
          <Marcador cor="bg-despesa" />
          Despesas
        </span>
        <span className={VALOR}>{formatarMoeda(resumo.despesasCentavos)}</span>
        <span className="text-[13px] text-suave">{textoVariacao(resumo.variacao.despesas, anterior)}</span>
      </div>

      <div className={CARTAO}>
        <span className="text-sm font-medium text-suave">Taxa de poupança</span>
        <span className={VALOR}>{taxa === null ? '—' : formatarPercentual(taxa)}</span>
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-linha">
            <div className="h-full rounded-full bg-tinta"
              style={{ width: `${Math.min(100, Math.max(0, taxa ?? 0))}%` }} />
          </div>
          <span className="text-[13px] text-suave">
            {taxa === null
              ? 'Sem receitas no mês'
              : taxa < 0
                ? 'gasto acima das receitas do mês'
                : 'das receitas do mês não foi gasto'}
          </span>
        </div>
      </div>
    </section>
  );
}
