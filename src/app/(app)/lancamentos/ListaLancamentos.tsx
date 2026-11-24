'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { formatarDiaMes, formatarMoeda, nomeMes } from '@/lib/formato';
import { CATEGORIAS, type Lancamento, type Tipo } from '@/lib/tipos';
import { ChipTipo, ValorAssinado } from '../ChipTipo';
import { excluirLancamento } from './actions';

type FiltroTipo = 'TODOS' | Tipo;

const SEGMENTOS: { valor: FiltroTipo; rotulo: string }[] = [
  { valor: 'TODOS', rotulo: 'Todos' },
  { valor: 'RECEITA', rotulo: 'Receitas' },
  { valor: 'DESPESA', rotulo: 'Despesas' },
];
const SEM_OUTROS = (tipo: Tipo) => CATEGORIAS[tipo].filter((c) => c !== 'Outros');
const COLUNAS = 'grid grid-cols-[88px_minmax(0,2fr)_minmax(0,1.2fr)_104px_150px_100px] items-center gap-3';
const CAMPO = 'h-[46px] rounded-xl border border-borda bg-superficie px-3.5 text-sm text-tinta';

const Icone = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export function ListaLancamentos({ lancamentos, mes }: { lancamentos: Lancamento[]; mes: string }) {
  const [tipo, setTipo] = useState<FiltroTipo>('TODOS');
  const [categoria, setCategoria] = useState('TODAS');
  const [busca, setBusca] = useState('');
  const [excluindo, iniciar] = useTransition();

  const termo = busca.trim().toLowerCase();
  const filtrados = lancamentos.filter(
    (l) =>
      (tipo === 'TODOS' || l.tipo === tipo) &&
      (categoria === 'TODAS' || l.categoria === categoria) &&
      (!termo || l.descricao.toLowerCase().includes(termo)),
  );
  const soma = (t: Tipo) => filtrados.filter((l) => l.tipo === t).reduce((s, l) => s + l.valorCentavos, 0);
  const receitas = soma('RECEITA');
  const despesas = soma('DESPESA');
  const saldo = receitas - despesas;

  const limpar = () => {
    setTipo('TODOS');
    setCategoria('TODAS');
    setBusca('');
  };
  const excluir = (l: Lancamento) => {
    if (confirm(`Excluir "${l.descricao}"?`)) iniciar(() => excluirLancamento(l.id, mes));
  };

  if (lancamentos.length === 0) {
    return (
      <section className="flex flex-col items-center gap-3 rounded-[14px] border border-borda bg-superficie px-6 py-12 text-center">
        <p className="text-suave">Nenhum lançamento em {nomeMes(mes)}.</p>
        <Link href="/lancamentos/novo"
          className="inline-flex h-11 items-center rounded-[10px] bg-tinta px-[18px] font-semibold text-white">
          Novo lançamento
        </Link>
      </section>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Tipo de lançamento"
          className="flex gap-0.5 rounded-xl border border-borda bg-superficie p-[3px]">
          {SEGMENTOS.map((s) => (
            <button key={s.valor} type="button" aria-pressed={tipo === s.valor} onClick={() => setTipo(s.valor)}
              className={`h-11 min-w-11 cursor-pointer rounded-[9px] px-4 text-sm font-semibold ${
                tipo === s.valor ? 'bg-tinta text-white' : 'text-suave hover:text-tinta'
              }`}>
              {s.rotulo}
            </button>
          ))}
        </div>

        <label htmlFor="filtro-categoria" className="sr-only">
          Categoria
        </label>
        <select id="filtro-categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}
          className={`${CAMPO} cursor-pointer`}>
          <option value="TODAS">Todas as categorias</option>
          <optgroup label="Receitas">
            {SEM_OUTROS('RECEITA').map((c) => <option key={c}>{c}</option>)}
          </optgroup>
          <optgroup label="Despesas">
            {SEM_OUTROS('DESPESA').map((c) => <option key={c}>{c}</option>)}
          </optgroup>
          <option value="Outros">Outros</option>
        </select>

        <label className={`${CAMPO} flex max-w-[360px] flex-[1_1_240px] items-center gap-2 text-suave`}>
          <Icone d="M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM10.5 10.5l3 3" />
          <span className="sr-only">Buscar por descrição</span>
          <input type="search" placeholder="Buscar por descrição" value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent text-tinta outline-offset-4 placeholder:text-suave" />
        </label>
      </div>

      <section aria-label="Totais filtrados"
        className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px overflow-hidden rounded-[14px] border border-borda bg-borda">
        {[
          { rotulo: 'Lançamentos', valor: String(filtrados.length), cor: '' },
          { rotulo: 'Receitas', valor: formatarMoeda(receitas), cor: 'text-receita-texto' },
          { rotulo: 'Despesas', valor: formatarMoeda(despesas), cor: 'text-despesa-texto' },
          { rotulo: 'Saldo', valor: (saldo < 0 ? '− ' : '') + formatarMoeda(Math.abs(saldo)), cor: '' },
        ].map((t) => (
          <div key={t.rotulo} className="flex flex-col gap-0.5 bg-superficie px-[22px] py-4">
            <span className="text-[13px] font-medium text-suave">{t.rotulo}</span>
            <span className={`font-display text-[22px] font-semibold ${t.cor}`}>{t.valor}</span>
          </div>
        ))}
      </section>

      <section aria-label="Lista de lançamentos" aria-busy={excluindo}
        className="rounded-[14px] border border-borda bg-superficie px-6 pb-3 pt-2">
        <div className="overflow-x-auto">
          <div className="min-w-[780px]">
            <div className={`${COLUNAS} border-b border-borda pb-2.5 pt-3 text-[13px] font-medium text-suave`}>
              <span>Data</span>
              <span>Descrição</span>
              <span>Categoria</span>
              <span>Tipo</span>
              <span className="text-right">Valor</span>
              <span className="text-right">Ações</span>
            </div>
            {filtrados.map((l) => (
              <div key={l.id} className={`${COLUNAS} border-b border-linha py-1.5 text-sm`}>
                <span className="text-suave">{formatarDiaMes(l.data)}</span>
                <span className="truncate font-medium">{l.descricao}</span>
                <span className="text-suave">{l.categoria}</span>
                <span><ChipTipo tipo={l.tipo} /></span>
                <ValorAssinado centavos={l.valorCentavos} tipo={l.tipo} />
                <span className="flex justify-end gap-1">
                  <Link href={`/lancamentos/${l.id}/editar`} aria-label={`Editar ${l.descricao}`}
                    className="grid size-11 place-items-center rounded-[10px] text-suave hover:bg-ativo hover:text-tinta">
                    <Icone d="m10.5 2.5 3 3L6 13H3v-3z" />
                  </Link>
                  <button type="button" aria-label={`Excluir ${l.descricao}`} disabled={excluindo}
                    onClick={() => excluir(l)}
                    className="grid size-11 cursor-pointer place-items-center rounded-[10px] text-suave hover:bg-ativo hover:text-tinta disabled:cursor-wait">
                    <Icone d="M2.5 4.5h11M6.5 4.5V2.5h3v2M4 4.5l.7 9h6.6l.7-9" />
                  </button>
                </span>
              </div>
            ))}
            {filtrados.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-12 text-center text-suave">
                <span>Nenhum lançamento encontrado com esses filtros.</span>
                <button type="button" onClick={limpar}
                  className="h-11 cursor-pointer rounded-[10px] border border-borda bg-superficie px-[18px] text-sm font-semibold text-tinta">
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
