'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { formatarValorCampo, nomeMes } from '@/lib/formato';
import { CATEGORIAS, type EstadoForm, type Lancamento, type Tipo } from '@/lib/tipos';
import { salvarLancamento } from './actions';

const CAMPO = 'h-12 rounded-xl border border-borda-campo bg-superficie px-3.5 text-tinta';
const ROTULO = 'text-sm font-semibold';

const ESTILO_TIPO: Record<Tipo, string> = {
  DESPESA: 'border-despesa bg-despesa-fundo text-despesa-texto',
  RECEITA: 'border-receita bg-receita-fundo text-receita-texto',
};

export function FormLancamento({ lancamento, hoje }: { lancamento?: Lancamento; hoje: string }) {
  const [estado, acao, enviando] = useActionState<EstadoForm, FormData>(salvarLancamento, {});
  const [tipo, setTipo] = useState<Tipo>(lancamento?.tipo ?? 'DESPESA');
  const [categoria, setCategoria] = useState(lancamento?.categoria ?? CATEGORIAS.DESPESA[0]);
  const [data, setData] = useState(lancamento?.data ?? hoje);
  const v = estado.valores;

  const trocarTipo = (t: Tipo) => {
    setTipo(t);
    setCategoria(CATEGORIAS[t][0]);
  };
  const mesDaData = /^\d{4}-\d{2}/.test(data) ? data.slice(0, 7) : null;
  const voltar = `/lancamentos?mes=${(lancamento?.data ?? hoje).slice(0, 7)}`;

  return (
    <form action={acao}
      className="mx-auto flex w-full max-w-[560px] flex-col gap-[22px] rounded-2xl border border-borda bg-superficie px-6 py-7 sm:px-8">
      <input type="hidden" name="id" value={lancamento?.id ?? ''} />
      <input type="hidden" name="tipo" value={tipo} />

      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {lancamento ? 'Editar lançamento' : 'Novo lançamento'}
        </h1>
        <Link href={voltar} aria-label="Fechar"
          className="grid size-11 place-items-center rounded-[10px] text-suave hover:bg-ativo">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75"
            strokeLinecap="round" aria-hidden="true">
            <path d="m4 4 8 8M12 4l-8 8" />
          </svg>
        </Link>
      </div>

      <div role="group" aria-label="Tipo de lançamento" className="grid grid-cols-2 gap-2">
        {(['DESPESA', 'RECEITA'] as const).map((t) => (
          <button key={t} type="button" aria-pressed={tipo === t} onClick={() => trocarTipo(t)}
            className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] font-semibold ${
              tipo === t ? ESTILO_TIPO[t] : 'border-borda bg-superficie text-suave'
            }`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={t === 'DESPESA' ? 'M8 3v10M4 9l4 4 4-4' : 'M8 13V3M4 7l4-4 4 4'} />
            </svg>
            {t === 'DESPESA' ? 'Despesa' : 'Receita'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="valor" className={ROTULO}>
          Valor
        </label>
        <div className="flex h-16 items-center gap-2.5 rounded-xl border border-borda-campo px-4 focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-receita">
          <span className="font-display text-xl font-medium text-suave">R$</span>
          <input id="valor" name="valor" inputMode="decimal" placeholder="0,00" required autoComplete="off"
            defaultValue={v?.valor ?? (lancamento ? formatarValorCampo(lancamento.valorCentavos) : '')}
            className="h-full min-w-0 flex-1 bg-transparent font-display text-[30px] font-semibold text-tinta outline-none" />
        </div>
        <span className="text-[13px] text-suave">
          {mesDaData
            ? `Entra no balanço de ${nomeMes(mesDaData)} de ${mesDaData.slice(0, 4)}.`
            : 'Escolha a data do lançamento.'}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="descricao" className={ROTULO}>
          Descrição
        </label>
        <input id="descricao" name="descricao" required maxLength={120}
          placeholder={tipo === 'DESPESA' ? 'Ex.: Supermercado' : 'Ex.: Salário de novembro'}
          defaultValue={v?.descricao ?? lancamento?.descricao ?? ''} className={CAMPO} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="categoria" className={ROTULO}>
            Categoria
          </label>
          <select id="categoria" name="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}
            className={`${CAMPO} cursor-pointer px-3`}>
            {CATEGORIAS[tipo].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="data" className={ROTULO}>
            Data
          </label>
          <input id="data" name="data" type="date" required min="1900-01-01" max="2099-12-31" value={data}
            onChange={(e) => setData(e.target.value)}
            className={`${CAMPO} px-3`} />
        </div>
      </div>

      {estado.erro && (
        <p role="alert" className="rounded-xl bg-despesa-fundo px-3.5 py-2.5 text-sm font-medium text-despesa-texto">
          {estado.erro}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Link href={voltar}
          className="inline-flex h-11 items-center rounded-[10px] border border-borda px-[18px] font-semibold text-tinta">
          Cancelar
        </Link>
        <button type="submit" disabled={enviando}
          className="h-11 cursor-pointer rounded-[10px] bg-tinta px-5 font-semibold text-white disabled:cursor-wait disabled:opacity-70">
          {enviando ? 'Salvando…' : tipo === 'DESPESA' ? 'Salvar despesa' : 'Salvar receita'}
        </button>
      </div>
    </form>
  );
}
