import { Marca } from '../Marca';

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[440px] flex-col gap-6 rounded-2xl border border-borda bg-superficie px-6 py-8 sm:px-8">
        <Marca />
        {children}
      </div>
    </main>
  );
}
