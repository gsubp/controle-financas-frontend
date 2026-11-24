'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { EstadoForm } from '@/lib/tipos';
import { cadastrar, entrar } from './actions';

const CAMPO =
  'h-12 rounded-xl border border-borda-campo bg-superficie px-3.5 text-tinta placeholder:text-suave';

export function FormAuth({ modo }: { modo: 'login' | 'cadastro' }) {
  const cadastro = modo === 'cadastro';
  const [estado, acao, enviando] = useActionState<EstadoForm, FormData>(cadastro ? cadastrar : entrar, {});
  const v = estado.valores ?? {};

  return (
    <form action={acao} className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{cadastro ? 'Criar conta' : 'Entrar'}</h1>

      {cadastro && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome" className="text-sm font-semibold">
            Nome
          </label>
          <input id="nome" name="nome" required autoComplete="name" defaultValue={v.nome} className={CAMPO} />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={v.email}
          className={CAMPO}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="senha" className="text-sm font-semibold">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          minLength={cadastro ? 8 : undefined}
          autoComplete={cadastro ? 'new-password' : 'current-password'}
          className={CAMPO}
        />
        {cadastro && <span className="text-[13px] text-suave">Pelo menos 8 caracteres.</span>}
      </div>

      {estado.erro && (
        <p role="alert" className="rounded-xl bg-despesa-fundo px-3.5 py-2.5 text-sm font-medium text-despesa-texto">
          {estado.erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="h-11 cursor-pointer rounded-[10px] bg-tinta px-5 font-semibold text-white disabled:cursor-wait disabled:opacity-70"
      >
        {enviando ? (cadastro ? 'Criando conta…' : 'Entrando…') : cadastro ? 'Criar conta' : 'Entrar'}
      </button>

      <p className="text-center text-sm text-suave">
        {cadastro ? 'Já tem conta? ' : 'Ainda não tem conta? '}
        <Link href={cadastro ? '/login' : '/cadastro'} className="font-semibold text-receita-texto">
          {cadastro ? 'Entrar' : 'Criar conta'}
        </Link>
      </p>
    </form>
  );
}
