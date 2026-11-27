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

## Como rodar a aplicação

### Instalação

Abra um terminal na pasta `LEV`, onde está o `package.json`. Use Node.js **22.22.2 ou uma versão posterior da linha 22**, como na CI.

```bash
node -v
npm ci
```

### Desenvolvimento

```bash
npm run dev
```

Abra [localhost:3000](http://localhost:3000). O servidor recarrega a aplicação quando você edita o código.

### Produção local

```bash
npm run build
npm start
```

Execute `npm start` depois que o build terminar com sucesso e abra [localhost:3000](http://localhost:3000). Se o servidor de desenvolvimento estiver usando essa porta, encerre-o com `Ctrl+C` antes de iniciar o de produção. Gere um novo build após alterações no código para vê-las no modo de produção.

### Como usar a loja

Abra **Catálogo**, selecione um produto e clique em **Adicionar ao carrinho**. Em **Carrinho**, ajuste a quantidade, confira o total e clique em **Finalizar pedido**. A confirmação mostra o número do pedido. Ao voltar ao catálogo, o estoque reflete a compra simulada.

Você também pode selecionar até três itens com **Comparar** e gerenciar produtos em **Admin**. Uma janela anônima começa com o catálogo e o estoque originais.

### Se o editor indicar erro em `next/link`

Abra a pasta `LEV` no editor e rode os comandos abaixo no mesmo diretório. O Next.js fornece `next/link` e suas declarações de tipo.

```bash
npm ci
npm run typecheck
```

O segundo comando gera os tipos do Next.js e verifica o projeto. Se passar e o erro continuar apenas no editor, reinicie o servidor do TypeScript ou reabra o projeto.

## Execução dos testes

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
npm run build
npm run test:e2e
```

Em Linux, use `npx playwright install --with-deps chromium` se faltarem bibliotecas do sistema. O Playwright inicia e encerra o servidor de produção na porta **3100**, que deve estar livre. A instalação do Chromium é necessária na primeira vez ou após uma atualização do navegador usado pelo Playwright.

O relatório HTML fica em `playwright-report/index.html`. Para repetir apenas um arquivo após o build, rode, por exemplo, `npm run test:e2e -- tests/e2e/carrinho.spec.ts`.

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
