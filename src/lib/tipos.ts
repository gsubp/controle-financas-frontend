export type Tipo = 'RECEITA' | 'DESPESA';

export type Usuario = { id: string; nome: string; email: string };

export type Lancamento = {
  id: string;
  tipo: Tipo;
  descricao: string;
  categoria: string;
  valorCentavos: number;
  data: string;
};

export type Resumo = {
  mes: string;
  receitasCentavos: number;
  despesasCentavos: number;
  saldoCentavos: number;
  taxaPoupanca: number | null;
  variacao: { receitas: number | null; despesas: number | null; saldo: number | null };
  historico: { mes: string; receitasCentavos: number; despesasCentavos: number }[];
  porCategoria: { categoria: string; totalCentavos: number; percentual: number }[];
  recentes: Lancamento[];
  quantidade: number;
};

export const CATEGORIAS: Record<Tipo, readonly string[]> = {
  RECEITA: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  DESPESA: ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Contas', 'Educação', 'Lazer', 'Outros'],
};
