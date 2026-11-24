'use server';

import { redirect } from 'next/navigation';
import { api, ErroApi } from '@/lib/api';
import { salvarSessao } from '@/lib/sessao';
import type { EstadoForm } from '@/lib/tipos';

const texto = (fd: FormData, campo: string) => String(fd.get(campo) ?? '');

async function autenticar(caminho: string, corpo: Record<string, string>): Promise<EstadoForm> {
  try {
    const { token } = await api<{ token: string }>(caminho, {
      method: 'POST',
      body: JSON.stringify(corpo),
      semToken: true,
    });
    await salvarSessao(token);
  } catch (e) {
    if (!(e instanceof ErroApi)) throw e;
    // Repõe o que foi digitado, menos a senha.
    const valores = Object.fromEntries(Object.entries(corpo).filter(([campo]) => campo !== 'senha'));
    return { erro: e.message, valores };
  }
  redirect('/');
}

export async function entrar(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  return autenticar('/auth/login', { email: texto(fd, 'email'), senha: texto(fd, 'senha') });
}

export async function cadastrar(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  return autenticar('/auth/cadastro', {
    nome: texto(fd, 'nome'),
    email: texto(fd, 'email'),
    senha: texto(fd, 'senha'),
  });
}
