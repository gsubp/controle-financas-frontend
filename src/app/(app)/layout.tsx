import { api } from '@/lib/api';
import type { Usuario } from '@/lib/tipos';
import { Cabecalho } from './Cabecalho';

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const usuario = await api<Usuario>('/auth/me');
  return (
    <>
      <Cabecalho nome={usuario.nome} />
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 pb-14 pt-8 sm:px-8">{children}</main>
    </>
  );
}
