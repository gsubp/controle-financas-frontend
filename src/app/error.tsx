'use client';

export default function Erro({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-semibold">Não foi possível carregar a página</h1>
      <p className="max-w-md text-suave">
        Verifique se a API está rodando e tente de novo. Se o problema continuar, recarregue a página.
      </p>
      <button type="button" onClick={() => retry()}
        className="h-11 cursor-pointer rounded-[10px] bg-tinta px-[18px] font-semibold text-white">
        Tentar de novo
      </button>
    </main>
  );
}
