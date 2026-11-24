# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Web do Controle de Finanças (projeto pessoal): login/cadastro, lançamentos de receitas e despesas e dashboard do mês.
Next.js **16.4** (App Router, Turbopack) + React 19 + Tailwind 4. Consome a API
[controle-financas](https://github.com/gsubp/controle-financas) (Nest), que é a fonte de verdade do contrato e do design
(`docs/superpowers/specs/2026-11-24-controle-financas-design.md` naquele repo). Plano deste repo em `docs/superpowers/plans/`.

**Next 16 tem mudanças incompatíveis com versões anteriores** (ver `AGENTS.md`, regenerado pelo `next dev`): consulte
`node_modules/next/dist/docs/` antes de usar uma API do Next. Pontos que já pegaram aqui: o middleware se chama
`src/proxy.ts`; `params`, `searchParams` e `cookies()` são assíncronos; `PageProps`/`LayoutProps` são tipos globais
gerados pelo `next build`/`next dev` (um `tsc` num clone novo reclama deles até um dos dois rodar); `error.tsx` recebe
`retry`. `cacheComponents` está **desligado** de propósito em `next.config.ts` — todas as telas são por usuário e dinâmicas.

## Comandos

Node **22.12** (`.nvmrc`): rode `nvm use` antes de qualquer `npm`/`npx`. A API precisa estar rodando (padrão
`http://localhost:3333`; outro endereço vai em `API_URL` no `.env.local`, modelo em `.env.example`).

```bash
npm run dev                          # http://localhost:3000
npm run build && npm run lint
npm test                             # Vitest: só os utilitários de src/lib
npx vitest run src/lib/formato.test.ts   # um arquivo
```

Não há testes de tela: fluxos (login, formulário, filtros, dashboard) são conferidos no navegador com a API local,
inclusive em 390 px de largura.

## Arquitetura e convenções que atravessam arquivos

- **O navegador nunca fala com a API.** O JWT fica no cookie httpOnly `sessao` (`src/lib/sessao.ts`); Server Components
  e Server Actions chamam a API por `api<T>()` (`src/lib/api.ts`), que injeta o Bearer, usa `cache: 'no-store'` e lança
  `ErroApi(status, mensagem da API)`. Não crie `NEXT_PUBLIC_*` nem chamadas `fetch` do cliente para a API.
- **Sessão recusada (401 com token)**: `api()` chama `encerrarSessao()`. Numa Server Action ela apaga o cookie e manda
  para `/login`; num Server Component (onde alterar cookie lança) ela redireciona para a rota `/sair`, que apaga o cookie.
  Não troque isso por `redirect('/sair')` dentro de action: o Next pré-renderiza o destino com o cookie antigo e entra em
  ciclo. `/sair` responde `Location: /login` relativo para funcionar atrás de proxy reverso.
- **`src/proxy.ts`** só faz o portão de navegação (sem cookie não vazio → `/login`; logado em `/login`/`/cadastro` → `/`);
  a autorização de verdade é da API.
- **Server Actions** (`actions.ts` em cada grupo): o `catch` trata só `ErroApi` e relança o resto (o `redirect()` do Next
  funciona lançando); devolvem `EstadoForm = { erro?, valores? }` (`src/lib/tipos.ts`) para repor o que foi digitado.
- **Formulário de lançamento envia por `onSubmit` + `startTransition`**, não por `<form action>`: o React 19 reinicia o
  form após a action e o `<select>` controlado de categoria voltava ao padrão, gravando a categoria errada.
- **Dinheiro e datas**: valores em centavos inteiros como na API; `parseValor` (`src/lib/formato.ts`) converte o texto
  digitado em pt-BR. Datas chegam como `YYYY-MM-DD` e são formatadas manipulando a string — nunca `new Date('YYYY-MM-DD')`
  para exibir (desloca o dia em -03). "Hoje" e "mês atual" usam America/Sao_Paulo. `?mes=` inválido (ou fora de
  1900–2099, mesma faixa da API) cai no mês atual via `mesOuAtual`.
- **Contrato duplicado**: `Lancamento`, `Resumo` e `CATEGORIAS` em `src/lib/tipos.ts` espelham a API — mude os dois juntos.
- **Visual**: tokens de cor do canvas aprovado em `@theme` (`src/app/globals.css`: `fundo`, `tinta`, `suave`, `receita*`,
  `despesa*`…); Inter (`font-sans`) e Space Grotesk (`font-display`). Gráfico do dashboard é CSS puro
  (`src/app/(app)/_dashboard/`), escala em `src/lib/grafico.ts`. Sem bibliotecas de gráfico, formulário ou estado.
  Cópia em português; alvos de toque ≥ 44 px; telas cabem em 390 px (tabelas rolam dentro do card).

## Versionamento

Git flow (`main` = produção, `develop` = integração, prefixos `feature/`, `bugfix/`, `release/`, `hotfix/`, tags `v*`).
Cada mudança vai num branch do git flow com PR para `develop` (hotfix: para `main`) via `gh`, descrição em português
(O que foi feito / Por quê / Como testar). Commits em português no formato `tipo: descrição`. Remote via SSH.
