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
4. Executei manualmente e de forma exploratória pela loja, comparando sempre a tela com a resposta da API.
5. Automatizei com Playwright a **camada de API**, onde ficam os cálculos (a interface apenas exibe o resultado, segundo a documentação).

Os cenários marcados com `@automatizado` nos arquivos `.feature` estão cobertos por testes de API em `automacao/tests/api/`. Os demais foram executados manualmente.

## Como rodar a automação

Pré-requisito: [Node.js](https://nodejs.org) LTS (18 ou superior).

```bash
cd automacao
npm install
npm test            # roda todos os testes de API
npm run report      # abre o relatório HTML da última execução
```

Para apontar para outro endereço: `BASE_URL=https://... npm test`.

### O que está automatizado

| Arquivo | Cobertura |
|---|---|
| `automacao/tests/api/calculo.api.spec.ts` | 12 casos da matriz de cálculo (limites do frete, CA08, CA09, arredondamento, quantidade máxima), variações do código do cupom (CA02), cupom inválido e expirado (CA03 e CA04) |
| `automacao/tests/api/validacoes.api.spec.ts` | Produtos, contrato de erros (400, 404, 405, 422), validação de itens e quantidades (CA10), pedidos e dados do cliente |

### Ambiente compartilhado

Outros candidatos usam a mesma loja ao mesmo tempo. Por isso: a API não grava nada entre chamadas, a execução usa poucos workers e **não há testes de carga, estresse ou segurança** (fora do escopo).

## Uso de IA

Usei IA (Claude) como apoio para estruturar o plano de teste, sugerir valores-limite e gerar a base dos arquivos Gherkin, da matriz de cálculo e do código Playwright. Os resultados esperados vieram da documentação. A execução na loja, a análise dos resultados e a confirmação dos bugs foram feitas por mim.
