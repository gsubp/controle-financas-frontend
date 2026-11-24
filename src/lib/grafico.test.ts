import { describe, expect, it } from 'vitest';
import { escalaGrafico, rotuloEixo, saldoCompacto } from './grafico';

describe('grafico', () => {
  it('escolhe uma escala redonda com 5 marcas', () => {
    expect(escalaGrafico(1044237)).toEqual([1200000, 900000, 600000, 300000, 0]);
    expect(escalaGrafico(0)).toEqual([400000, 300000, 200000, 100000, 0]);
    expect(escalaGrafico(5000)).toEqual([8000, 6000, 4000, 2000, 0]);
  });

  it('rotula o eixo em reais, com "mil" a partir de mil', () => {
    expect(rotuloEixo(1200000)).toBe('12 mil');
    expect(rotuloEixo(750000)).toBe('7,5 mil');
    expect(rotuloEixo(8000)).toBe('80');
    expect(rotuloEixo(0)).toBe('0');
  });

  it('resume o saldo com sinal', () => {
    expect(saldoCompacto(448952)).toBe('+4,5 mil');
    expect(saldoCompacto(-181985)).toBe('−1,8 mil');
    expect(saldoCompacto(95000)).toBe('+950');
    expect(saldoCompacto(0)).toBe('0');
  });
});
