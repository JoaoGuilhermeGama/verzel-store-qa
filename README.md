# Verzel Store - Teste técnico de QA

Testes da entrega **VZS-142 - Cupom de desconto e frete grátis (v2.3.0)** da Verzel Store.

- **Loja:** https://verzel-store.qa-test-verzel-store.workers.dev/
- **Documentação:** https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- **API:** https://verzel-store.qa-test-verzel-store.workers.dev/api

## Onde encontrar cada entrega

| Entrega | Onde |
|---|---|
| Cenários de teste (Gherkin) | [`docs/01-cenarios/`](docs/01-cenarios/) |
| Execução e resultado de cada cenário | [`docs/02-execucao.md`](docs/02-execucao.md) |
| Report de bugs | [`docs/03-bugs.md`](docs/03-bugs.md) |
| Documento de evidências | [`docs/04-evidencias.md`](docs/04-evidencias.md) (arquivos em [`evidencias/`](evidencias/)) |
| Ambiguidades e interpretações | [`docs/05-interpretacoes.md`](docs/05-interpretacoes.md) |
| Automação com Playwright | [`automacao/`](automacao/) |

## Abordagem

1. Li a documentação inteira, incluindo "Sobre este ambiente", e levantei as regras (CA01–CA11), a fórmula `total = subtotal - desconto + frete` e os contratos da API.
2. Escrevi os cenários em Gherkin organizados por regra: cupom, frete, quantidade, API e dados do cliente. Cada cenário tem ID rastreável (`CP-`, `FR-`, `QT-`, `API-`, `CL-`, `CALC-`).
3. Priorizei **valores-limite** (R$ 200,00 exatos, R$ 199,80, 5 e 6 unidades) e as regras mais sujeitas a erro (CA08: frete grátis antes do desconto; CA09: desconto não incide no frete).
4. Executei manualmente e de forma exploratória, comparando sempre a tela com a resposta da API.
5. Automatizei com Playwright em duas camadas: **API** (matriz de cálculo e contratos de erro) e **UI** (fluxos principais de cupom e frete).

## Como rodar a automação

Pré-requisito: [Node.js](https://nodejs.org) LTS (18 ou superior).

```bash
cd automacao
npm install
npx playwright install chromium

npm test              # roda tudo (API + UI)
npm run test:api      # só API
npm run test:ui       # só UI
npm run test:headed   # UI com o navegador visível
npm run report        # abre o relatório HTML da última execução
```

Para apontar para outro endereço: `BASE_URL=https://... npm test`.

### O que está automatizado

| Camada | Arquivo | Cobertura |
|---|---|---|
| API | `tests/api/calculo.api.spec.ts` | 12 casos da matriz de cálculo, variações do código do cupom, cupom inválido e expirado |
| API | `tests/api/validacoes.api.spec.ts` | Produtos, contrato de erros, validação de itens e quantidades, pedidos e dados do cliente |
| UI | `tests/ui/cupom-frete.ui.spec.ts` | Cupom válido, limite do frete grátis, cupom inválido/expirado, normalização do código |

Todos os seletores da UI ficam centralizados em `tests/ui/loja.page.ts` (Page Object).

### Ambiente compartilhado

Outros candidatos usam a mesma loja ao mesmo tempo. Por isso: a API não grava nada, cada teste de UI roda em um contexto novo (carrinho próprio), a execução usa poucos workers e **não há testes de carga, estresse ou segurança** (fora do escopo).

## Uso de IA

Usei IA (Claude) como apoio para estruturar o plano de teste, sugerir valores-limite e gerar a base dos arquivos Gherkin, da matriz de cálculo e do código Playwright. Os resultados esperados vieram da documentação. A execução na loja, a análise dos resultados, a confirmação dos bugs e os ajustes de seletores foram feitos por mim.
