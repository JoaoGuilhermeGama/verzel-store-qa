# 02 - Execução dos testes

Entrega testada: **VZS-142 - Cupom de desconto e frete grátis (v2.3.0)**
Ambiente: https://verzel-store.qa-test-verzel-store.workers.dev/
Data da execução: `__/__/____` | Navegador: `________` | Executor: João Guilherme Gama

**Legenda:** ✅ Passou · ❌ Falhou · ⛔ Bloqueado · ⬜ Não executado
Os cenários completos (Gherkin) estão em [`docs/01-cenarios`](01-cenarios/). Evidências em [`04-evidencias.md`](04-evidencias.md). Bugs em [`03-bugs.md`](03-bugs.md).

## 1. Matriz de cálculo (tela e API)

Resultado esperado derivado da documentação. A coluna "UI" é o que a tela mostrou (execução manual); "API" é a resposta de `/api/carrinho/calcular` (automatizado em `automacao/tests/api/calculo.api.spec.ts`).

| ID | Itens | Cupom | Subtotal | Desconto | Frete | Total | Faltante | UI | API | Bug |
|---|---|---|---|---|---|---|---|---|---|---|
| CALC-01 | P005×1 | BEMVINDO10 | 100,00 | 10,00 | 19,90 | 109,90 | 100,00 | ⬜ | ⬜ | |
| CALC-02 | P005×1 | – | 100,00 | 0,00 | 19,90 | 119,90 | 100,00 | ⬜ | ⬜ | |
| CALC-03 | P002×1 + P004×2 | BEMVINDO10 | 239,70 | 23,97 | 0,00 | 215,73 | 0,00 | ⬜ | ⬜ | |
| CALC-04 | P005×2 | – | 200,00 | 0,00 | 0,00 | 200,00 | 0,00 | ⬜ | ⬜ | |
| CALC-05 | P001×1 + P002×1 | – | 199,80 | 0,00 | 19,90 | 219,70 | 0,20 | ⬜ | ⬜ | |
| CALC-06 | P002×1 + P006×2 | – | 199,70 | 0,00 | 19,90 | 219,60 | 0,30 | ⬜ | ⬜ | |
| CALC-07 | P005×2 | BEMVINDO10 | 200,00 | 20,00 | 0,00 | 180,00 | 0,00 | ⬜ | ⬜ | |
| CALC-08 | P003×1 | BEMVINDO10 | 189,90 | 18,99 | 19,90 | 190,81 | 10,10 | ⬜ | ⬜ | |
| CALC-09 | P001×3 | – | 179,70 | 0,00 | 19,90 | 199,60 | 20,30 | ⬜ | ⬜ | |
| CALC-10 | P001×5 | BEMVINDO10 | 299,50 | 29,95 | 0,00 | 269,55 | 0,00 | ⬜ | ⬜ | |
| CALC-11 | P006×1 | – | 29,90 | 0,00 | 19,90 | 49,80 | 170,10 | ⬜ | ⬜ | |
| CALC-12 | P007×1 | VERAO2026 | 229,90 | 0,00 | 0,00 | 229,90 | 0,00 | ⬜ | ⬜ | |

## 2. Cenários funcionais

| ID | Cenário | CA | Tipo | Esperado | Resultado | Bug | Obs. |
|---|---|---|---|---|---|---|---|
| CP-001 | Cupom BEMVINDO10 aplica 10% | CA01 | Manual + API auto | Desconto 10% sobre subtotal | ⬜ | | |
| CP-002 | Cupom sem diferenciar maiúsculas/minúsculas | CA02 | Manual + API auto | `bemvindo10` e `BemVindo10` aplicam | ⬜ | | |
| CP-003 | Espaços nas pontas ignorados | CA02 | Manual + API auto | `  BEMVINDO10  ` aplica | ⬜ | | |
| CP-004 | Cupom inexistente | CA03 | Manual + API auto | "Cupom inválido." sem desconto | ⬜ | | |
| CP-005 | Cupom expirado | CA04 | Manual + API auto | "Cupom expirado." sem desconto | ⬜ | | |
| CP-006 | Só um cupom por vez / trocar | CA05 | Manual | Mantém o atual; troca só após remover | ⬜ | | |
| CP-007 | Remover cupom recalcula | CA05 | Manual | Desconto zera, total recalculado | ⬜ | | |
| CP-008 | Códigos malformados | CA02 | Exploratório | Sem desconto e sem erro técnico | ⬜ | | |
| CP-009 | Alterar quantidade com cupom | CA01 | Manual | Recalcula tudo | ⬜ | | |
| FR-001 | Abaixo de R$ 200 cobra R$ 19,90 | CA07 | Manual | Frete 19,90 + faltante exibido | ⬜ | | |
| FR-002 | Subtotal = R$ 200,00 | CA06 | Manual + API auto | Frete grátis | ⬜ | | |
| FR-003 | Subtotal = R$ 199,80 | CA07 | Manual | Frete 19,90; falta 0,20 | ⬜ | | |
| FR-004 | Frete usa subtotal antes do cupom | CA08 | Manual + API auto | Frete 0 com subtotal 200 e cupom | ⬜ | | |
| FR-005 | Desconto não incide no frete | CA09 | Manual + API auto | Total = 190,81 | ⬜ | | |
| FR-006 | Faltante nunca negativo | CA07 | Manual | Faltante 0,00 | ⬜ | | |
| AR-001 | Arredondamento 2 casas | CA11 | Manual + API auto | Sem ruído de ponto flutuante | ⬜ | | |
| QT-001 | 5 unidades aceitas | CA10 | Manual + API auto | OK | ⬜ | | |
| QT-002 | UI impede 6ª unidade | CA10 | Manual | Quantidade fica em 5 | ⬜ | | |
| QT-003 | API recusa 6 | CA10 | API auto | 422 QUANTIDADE_MAXIMA_EXCEDIDA | ⬜ | | |
| QT-004 | API recusa 0, -1, 1.5, "2", null | CA10 | API auto | 422 QUANTIDADE_INVALIDA | ⬜ | | |
| QT-005 | Adições repetidas somam até 5 | CA10 | Manual | Não passa de 5 | ⬜ | | |

## 3. API

| ID | Cenário | Esperado | Resultado | Bug |
|---|---|---|---|---|
| API-001 | GET /api/produtos | 200, 8 produtos | ⬜ | |
| API-002 | GET /api/produtos/P001 | 200 | ⬜ | |
| API-003 | GET /api/produtos/P999 | 404 PRODUTO_NAO_ENCONTRADO | ⬜ | |
| API-004 | POST /calcular exemplo da doc | Valores da doc | ⬜ | |
| API-005 | /calcular com cupom inválido | 200, sem desconto, mensagem | ⬜ | |
| API-006 | /pedidos com cupom inválido/expirado | 422 CUPOM_INVALIDO / CUPOM_EXPIRADO | ⬜ | |
| API-007 | /pedidos válido | 201, `VZ-000000` | ⬜ | |
| API-008 | JSON malformado | 400 JSON_INVALIDO | ⬜ | |
| API-009 | Rota inexistente | 404 ROTA_NAO_ENCONTRADA | ⬜ | |
| API-010 | Método não permitido | 405 METODO_NAO_PERMITIDO | ⬜ | |
| API-011 | Itens ausentes/vazios | 422 ITENS_OBRIGATORIOS | ⬜ | |
| API-012 | Item inválido | 422 ITEM_INVALIDO | ⬜ | |
| API-013 | Produto inexistente | 422 PRODUTO_NAO_ENCONTRADO | ⬜ | |
| API-014 | Item duplicado | 422 ITEM_DUPLICADO | ⬜ | |
| API-015 | Vários campos de cliente inválidos | 422 DADOS_INVALIDOS com "campos" | ⬜ | |
| API-016 | UI × API consistentes | Valores idênticos | ⬜ | |

## 4. Cliente / pedido

| ID | Cenário | Esperado | Resultado | Bug |
|---|---|---|---|---|
| CL-001 | Nome sem sobrenome | Recusado | ⬜ | |
| CL-002 | E-mail inválido | Recusado | ⬜ | |
| CL-003 | CEP 8 dígitos com/sem hífen | Aceito | ⬜ | |
| CL-004 | CEP inválido (7, 9, letras) | Recusado | ⬜ | |
| CL-005 | Pedido pela UI mostra `VZ-000000` e resumo correto | OK | ⬜ | |

## 5. Testes exploratórios

| Charter | Duração | Achados | Bugs |
|---|---|---|---|
| Carrinho: recarregar, voltar/avançar, carrinho vazio | | | |
| Cupom: entradas incomuns (vazio, espaços, símbolos, textos longos) | | | |
| Quantidade: campo numérico, cliques rápidos, valores extremos | | | |
| Checkout: alterar carrinho durante o preenchimento | | | |
| Layout: mobile, zoom, mensagens de erro, estados vazios | | | |

## 6. Resumo

| Total | ✅ | ❌ | ⛔ | ⬜ |
|---|---|---|---|---|
| | | | | |
