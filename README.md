# LEV — Loja de Periféricos

Trabalho prático da disciplina **Teste de Software** — DCC/UFMG.

🔗 **[lev-azure.vercel.app](https://lev-azure.vercel.app/)**

## Integrantes

- Enzo da Costa Arantes
- Leticia dos Santos Caldeira
- Victor Felipe da Cruz Oliveira

## Sobre o sistema

O LEV é uma loja virtual de periféricos para computador (teclados, mouses, mousepads, suportes de monitor, headsets e acessórios). O sistema roda inteiramente no navegador — sem backend externo, sem banco de dados e sem pagamento real. Os dados iniciais são estáticos; carrinho, pedidos, estoque e produtos criados pelo administrador ficam em memória e/ou `localStorage`.

Funcionalidades:

- Catálogo com busca, filtro por categoria e ordenação por preço
- Comparação de até 3 produtos (especificações lado a lado)
- Carrinho de compras com controle de estoque
- Finalização de pedidos
- Página admin para criar, editar e remover produtos (sem autenticação real)

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript strict |
| Estilo | Tailwind CSS 4 |
| Testes de unidade | Vitest 5 + @vitest/coverage-v8 |
| Testes e2e | Playwright (somente Chromium) |
| Linting/Formatação | ESLint + Prettier |
| CI | GitHub Actions (Ubuntu, macOS, Windows) |
| Cobertura | Codecov |
| Deploy | Vercel (branch `main`) |

## Uso de IA

Utilizamos Claude e ChatGPT como assistentes durante o desenvolvimento. As ferramentas foram usadas principalmente para orientar as etapas a seguir no projeto — sugerindo ordem de implementação, estrutura de arquivos e boas práticas — e para auxiliar na configuração do ambiente (Vitest, Playwright, ESLint, Prettier, GitHub Actions). Testes de unidade e decisões de arquitetura também contaram com apoio dessas ferramentas. Todo o código gerado foi revisado, compreendido e adaptado pelos integrantes.

## Execução dos testes

### Pré-requisitos

```bash
npm install
```

### Testes de unidade

```bash
npm test
```

### Testes de unidade com relatório de cobertura

```bash
npm run test:coverage
```

A cobertura mínima exigida é **80%** em linhas, funções, branches e statements. O relatório HTML é gerado em `coverage/lcov-report/index.html`.

### Interface visual dos testes (Vitest UI)

```bash
npm run test:ui
```

### Testes e2e (Playwright)

```bash
npm run test:e2e
```

Requer que o servidor de desenvolvimento esteja acessível. O Playwright sobe o servidor automaticamente via `webServer` configurado em `playwright.config.ts`.

### Lint

```bash
npm run lint
```

### Formatação

```bash
npm run format        # aplica formatação
npm run format:check  # apenas verifica
```
