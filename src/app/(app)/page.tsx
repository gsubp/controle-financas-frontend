import { mesOuAtual, nomeMes } from '@/lib/formato';

export default async function Dashboard({ searchParams }: PageProps<'/'>) {
  const mes = mesOuAtual((await searchParams).mes);
  return (
    <h1 className="font-display text-[34px] font-semibold leading-tight tracking-tight">Balanço de {nomeMes(mes)}</h1>
  );
}
