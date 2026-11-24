import Link from 'next/link';

export default function NaoEncontrado() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-semibold">Página não encontrada</h1>
      <p className="text-suave">O endereço não existe ou o lançamento foi excluído.</p>
      <Link href="/" className="inline-flex h-11 items-center rounded-[10px] bg-tinta px-[18px] font-semibold text-white">
        Voltar ao início
      </Link>
    </main>
  );
}
