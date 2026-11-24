import type { Tipo } from './tipos';

const MOEDA = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const CAMPO = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const UMA_CASA = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const DIA_SP = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const MES_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const MAX_CENTAVOS = 2_000_000_000;
const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

export const formatarMoeda = (centavos: number) => MOEDA.format(centavos / 100);

export const formatarValorAssinado = (centavos: number, tipo: Tipo) =>
  `${tipo === 'RECEITA' ? '+' : '−'} ${formatarMoeda(centavos)}`;

export const formatarValorCampo = (centavos: number) => CAMPO.format(centavos / 100);

/** Valor digitado ("1.234,56", "1234,5", "R$ 10", "12.5") → centavos; `null` se inválido ou fora do limite. */
export function parseValor(texto: string): number | null {
  const t = texto.replace(/R\$/g, '').replace(/\s/g, '');
  let numero: string;
  if (/^\d{1,3}(\.\d{3})*(,\d{1,2})?$/.test(t) || /^\d+(,\d{1,2})?$/.test(t)) {
    numero = t.replace(/\./g, '').replace(',', '.');
  } else if (/^\d+\.\d{1,2}$/.test(t)) {
    numero = t;
  } else {
    return null;
  }
  const centavos = Math.round(Number(numero) * 100);
  return centavos >= 1 && centavos <= MAX_CENTAVOS ? centavos : null;
}

// Datas chegam como 'YYYY-MM-DD': manipular a string evita o deslocamento de fuso de `new Date()`.
export const formatarData = (data: string) => data.split('-').reverse().join('/');
export const formatarDiaMes = (data: string) => `${data.slice(8, 10)}/${data.slice(5, 7)}`;

export const hoje = (agora = new Date()) => DIA_SP.format(agora);
export const mesAtual = (agora = new Date()) => hoje(agora).slice(0, 7);

export const mesOuAtual = (param: string | string[] | undefined, agora?: Date) =>
  typeof param === 'string' && MES_REGEX.test(param) ? param : mesAtual(agora);

export function somarMeses(mes: string, n: number): string {
  const [ano, m] = mes.split('-').map(Number);
  const total = ano * 12 + (m - 1) + n;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`;
}

export const nomeMes = (mes: string) => MESES[Number(mes.slice(5, 7)) - 1];

export const formatarPercentual = (p: number) => `${UMA_CASA.format(p)}%`;

export const formatarVariacao = (p: number | null) =>
  p === null ? null : `${p > 0 ? '+' : p < 0 ? '−' : ''}${UMA_CASA.format(Math.abs(p))}%`;
