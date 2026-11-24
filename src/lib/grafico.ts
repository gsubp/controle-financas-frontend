const ATE_UMA_CASA = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const UMA_CASA = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const INTEIRO = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

/** 5 marcas do eixo (topo → zero), com passo "redondo" que cabe o maior valor. */
export function escalaGrafico(maxCentavos: number): number[] {
  let passo = 100000;
  if (maxCentavos > 0) {
    const bruto = maxCentavos / 4;
    const pot = 10 ** Math.floor(Math.log10(bruto));
    passo = [1, 2, 2.5, 3, 5, 10].map((m) => m * pot).find((p) => p >= bruto)!;
  }
  return [4, 3, 2, 1, 0].map((i) => i * passo);
}

export function rotuloEixo(centavos: number): string {
  const reais = centavos / 100;
  return reais >= 1000 ? `${ATE_UMA_CASA.format(reais / 1000)} mil` : INTEIRO.format(reais);
}

export function saldoCompacto(centavos: number): string {
  if (centavos === 0) return '0';
  const reais = Math.abs(centavos) / 100;
  const sinal = centavos > 0 ? '+' : '−';
  return reais >= 1000 ? `${sinal}${UMA_CASA.format(reais / 1000)} mil` : `${sinal}${INTEIRO.format(reais)}`;
}
