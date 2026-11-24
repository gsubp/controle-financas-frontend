# controle-financas-frontend

Web do Controle de Finanças: login, lançamentos de receitas e despesas e dashboard com o balanço do mês.
Next.js 16 (App Router) + Tailwind CSS. Consome a API [controle-financas](https://github.com/gsubp/controle-financas).

O navegador nunca fala direto com a API: o Next guarda o token num cookie httpOnly e faz as chamadas no servidor.

## Rodando localmente

Requisitos: Node 22.12 (`.nvmrc`) e a API rodando (por padrão em `http://localhost:3333`).

```bash
nvm use
npm install
cp .env.example .env.local   # API_URL, se a API não estiver em localhost:3333
npm run dev                  # http://localhost:3000
```

## Testes

```bash
npm test        # utilitários de formatação e do gráfico (Vitest)
npm run lint
npm run build
```
