# LEV — Loja de Periféricos

Trabalho prático da disciplina **Teste de Software** — DCC/UFMG.

🔗 **[lev-azure.vercel.app](https://lev-azure.vercel.app/)**

## Integrantes

- Enzo da Costa Arantes
- Leticia dos Santos Caldeira
- Victor Felipe da Cruz Oliveira

## Sobre o sistema

O LEV é uma loja virtual de periféricos para computador (teclados, mouses, mousepads, suportes de monitor, headsets e acessórios). A loja simula compras no navegador. O catálogo inicial é estático. Carrinho, comparação e alterações no catálogo e no estoque são salvos em `localStorage`. A confirmação do pedido fica em memória enquanto a tela está aberta.

Funcionalidades:

- Catálogo com busca, filtro por categoria e ordenação por preço
- Comparação de até 3 produtos (especificações lado a lado)
- Carrinho de compras com controle de estoque
- Finalização de pedidos
- Página admin para criar, editar e remover produtos (sem autenticação real)

## Tecnologias

| Camada             | Tecnologia                                  |
| ------------------ | ------------------------------------------- |
| Framework          | Next.js 16 (App Router) + TypeScript strict |
| Estilo             | Tailwind CSS 4                              |
| Testes de unidade  | Vitest 5 + @vitest/coverage-v8              |
| Testes e2e         | Playwright (somente Chromium)               |
| Linting/Formatação | ESLint + Prettier                           |
| CI                 | GitHub Actions (Ubuntu, macOS, Windows)     |
| Cobertura          | Codecov                                     |
| Deploy             | Vercel (branch `main`)                      |

## Uso de IA

Utilizamos Claude e ChatGPT como assistentes durante o desenvolvimento. As ferramentas foram usadas principalmente para orientar as etapas a seguir no projeto — sugerindo ordem de implementação, estrutura de arquivos e boas práticas — e para auxiliar na configuração do ambiente (Vitest, Playwright, ESLint, Prettier, GitHub Actions). Testes de unidade e decisões de arquitetura também contaram com apoio dessas ferramentas. Todo o código gerado foi revisado, compreendido e adaptado pelos integrantes.

Na etapa de finalização, o Codex auxiliou na análise do repositório, na integração dos testes e2e à CI e na criação de testes de regressão para catálogo, carrinho e persistência.

## Execução dos testes

### Pré-requisitos

Use Node.js 22.22.2 ou uma versão posterior da linha 22, como na CI.

```bash
npm ci
```

Para iniciar a aplicação, rode `npm run dev` e abra `http://localhost:3000`. Para testar o build de produção, rode `npm run build` seguido de `npm start`.

### Testes de unidade

```bash
npm test
```

### Testes de unidade com relatório de cobertura

```bash
npm run test:coverage
```

O Vitest exige **80%** em linhas, funções, ramificações e instruções para as regras de negócio e o adaptador de persistência em `src/lib`. Páginas, componentes e hooks React ficam fora desse relatório. O terminal mostra o resumo e os relatórios são gerados em `coverage/lcov.info` (Codecov) e `coverage/lcov-report/index.html` (HTML).

### Interface visual dos testes (Vitest UI)

```bash
npm run test:ui
```

### Testes e2e (Playwright)

```bash
npx playwright install chromium
npm run test:e2e
```

Em Linux, use `npx playwright install --with-deps chromium` se faltarem bibliotecas do sistema. Localmente, o Playwright sobe o servidor de desenvolvimento na porta 3000 ou reaproveita um que já esteja em execução nesse endereço. Na CI, a suíte usa o servidor de produção após `npm run build`. O relatório HTML dos testes fica em `playwright-report/index.html`.

### Lint

```bash
npm run lint
```

### Formatação

```bash
npm run format        # aplica formatação
npm run format:check  # apenas verifica
```

## Integração contínua

O [workflow CI](.github/workflows/ci.yml) executa lint, cobertura, build e testes e2e no Ubuntu, macOS e Windows a cada push e pull request. Em pushes, cada job envia o LCOV ao Codecov. Para habilitar o envio, conecte o repositório ao Codecov e cadastre o token de upload como secret `CODECOV_TOKEN` no GitHub Actions.
