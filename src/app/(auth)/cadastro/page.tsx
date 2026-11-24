import type { Metadata } from 'next';
import { FormAuth } from '../FormAuth';

export const metadata: Metadata = { title: 'Criar conta · Finanças' };

export default function PaginaCadastro() {
  return <FormAuth modo="cadastro" />;
}
