import { formatarValorAssinado } from '@/lib/formato';
import type { Tipo } from '@/lib/tipos';

export function ChipTipo({ tipo }: { tipo: Tipo }) {
  return tipo === 'RECEITA' ? (
    <span className="inline-block rounded-full bg-receita-fundo px-2.5 py-0.5 text-xs font-semibold text-receita-texto">
      Receita
    </span>
  ) : (
    <span className="inline-block rounded-full bg-despesa-fundo px-2.5 py-0.5 text-xs font-semibold text-despesa-texto">
      Despesa
    </span>
  );
}

export function ValorAssinado({ centavos, tipo }: { centavos: number; tipo: Tipo }) {
  return (
    <span className={`whitespace-nowrap text-right font-semibold ${tipo === 'RECEITA' ? 'text-receita-texto' : 'text-tinta'}`}>
      {formatarValorAssinado(centavos, tipo)}
    </span>
  );
}
