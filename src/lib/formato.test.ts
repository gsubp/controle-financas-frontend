import { describe, expect, it } from 'vitest';
import {
  formatarData,
  formatarDiaMes,
  formatarMoeda,
  formatarPercentual,
  formatarValorAssinado,
  formatarValorCampo,
  formatarVariacao,
  hoje,
  mesAtual,
  mesOuAtual,
  nomeMes,
  parseValor,
  somarMeses,
} from './formato';

const NBSP = ' ';
// 23h de 30/11 em São Paulo.
const VIRADA = new Date('2026-12-01T02:00:00Z');

describe('moeda', () => {
  it('formata centavos em reais', () => {
    expect(formatarMoeda(123456)).toBe(`R$${NBSP}1.234,56`);
    expect(formatarMoeda(0)).toBe(`R$${NBSP}0,00`);
  });

  it('formata com sinal pelo tipo', () => {
    expect(formatarValorAssinado(180000, 'RECEITA')).toBe(`+ R$${NBSP}1.800,00`);
    expect(formatarValorAssinado(41230, 'DESPESA')).toBe(`− R$${NBSP}412,30`);
  });

  it('formata para o campo e volta pelo parse', () => {
    expect(formatarValorCampo(123456)).toBe('1.234,56');
    for (const x of [1, 99, 123456, 2000000000]) expect(parseValor(formatarValorCampo(x))).toBe(x);
  });

  it('entende valores digitados em pt-BR', () => {
    expect(parseValor('1.234,56')).toBe(123456);
    expect(parseValor('1234,56')).toBe(123456);
    expect(parseValor('1234')).toBe(123400);
    expect(parseValor('0,99')).toBe(99);
    expect(parseValor('1234,5')).toBe(123450);
    expect(parseValor('R$ 10,00')).toBe(1000);
    expect(parseValor('12.5')).toBe(1250);
    expect(parseValor('1.234')).toBe(123400);
  });

  it('recusa valores inválidos', () => {
    for (const texto of ['', 'abc', '0', '1,234', '-5', '20.000.000,01']) expect(parseValor(texto)).toBeNull();
  });
});

describe('datas', () => {
  it('formata YYYY-MM-DD sem deslocar o dia', () => {
    expect(formatarData('2026-11-01')).toBe('01/11/2026');
    expect(formatarDiaMes('2026-11-23')).toBe('23/11');
  });

  it('usa o fuso de São Paulo para o mês e o dia atuais', () => {
    expect(mesAtual(VIRADA)).toBe('2026-11');
    expect(hoje(VIRADA)).toBe('2026-11-30');
  });

  it('aceita só mês válido no parâmetro', () => {
    expect(mesOuAtual('2026-02', VIRADA)).toBe('2026-02');
    for (const p of ['abc', '2026-13', ['2026-02'], undefined]) expect(mesOuAtual(p, VIRADA)).toBe('2026-11');
  });

  it('soma meses e nomeia o mês', () => {
    expect(somarMeses('2026-01', -1)).toBe('2025-12');
    expect(somarMeses('2026-11', 1)).toBe('2026-12');
    expect(nomeMes('2026-11')).toBe('novembro');
    expect(nomeMes('2026-03')).toBe('março');
  });
});

describe('percentuais', () => {
  it('formata percentual e variação', () => {
    expect(formatarPercentual(43)).toBe('43,0%');
    expect(formatarVariacao(3.4)).toBe('+3,4%');
    expect(formatarVariacao(-13.8)).toBe('−13,8%');
    expect(formatarVariacao(null)).toBeNull();
  });
});
