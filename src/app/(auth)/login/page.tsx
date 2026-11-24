import type { Metadata } from 'next';
import { FormAuth } from '../FormAuth';

export const metadata: Metadata = { title: 'Entrar · Finanças' };

export default function PaginaLogin() {
  return <FormAuth modo="login" />;
}
