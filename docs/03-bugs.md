# 03 - Report de bugs

Entrega testada: **VZS-142 - Cupom de desconto e frete grátis (v2.3.0)**

Antes de reportar, conferi a seção **"Sobre este ambiente"** da documentação: carrinho só na aba, pedidos fictícios sem consulta, sem e-mail/cobrança, preços/cupons fixos, sem estoque e API sem estado **não são bugs**. Os bugs abaixo violam critérios de aceite explícitos (CA06, CA08 e CA10).

## Índice

| ID | Título | Severidade | Prioridade | Cenários | Status |
|---|---|---|---|---|---|
| BUG-001 | Frete é cobrado quando o subtotal é exatamente R$ 200,00 | Alta | Alta | CALC-04, CALC-07, FR-002, FR-004 | Aberto |
| BUG-002 | API aceita mais de 5 unidades de um produto | Alta | Média | QT-003 | Aberto |

**Escala de severidade:** Crítica (impede concluir o pedido ou causa cobrança incorreta generalizada) · Alta (regra de negócio descumprida, com impacto ao cliente) · Média (mensagem/validação incorreta, com contorno) · Baixa (cosmético/texto).

**Origem dos achados:** os dois bugs foram detectados pela automação (3 testes falham em `automacao/tests/api/calculo.api.spec.ts` e `validacoes.api.spec.ts`) e confirmados manualmente com `curl`. Os testes falham de propósito enquanto os bugs existirem.

---

### BUG-001 - Frete é cobrado quando o subtotal é exatamente R$ 200,00

- **Severidade:** Alta | **Prioridade:** Alta
- **Critério violado:** CA06 (frete grátis a partir de R$ 200,00, **inclusive**) e, no caso com cupom, CA08 (a regra usa o subtotal antes do desconto)
- **Ambiente:** Verzel Store v2.3.0 · API `POST /api/carrinho/calcular` · curl no Git Bash (Windows 10) · 09/10/2026
- **Camada:** API (verificação na tela: ver observações)
- **Cenários relacionados:** CALC-04, CALC-07, FR-002, FR-004

**Pré-condições:** nenhuma (a API não guarda estado).

**Passos para reproduzir:**
1. Enviar `POST /api/carrinho/calcular` com 2 unidades de `P005` (Mochila Urbana 20L, R$ 100,00 cada), **sem cupom**.
2. Observar `subtotal`, `frete`, `freteGratis` e `total` na resposta.
3. Repetir o passo 1 incluindo `"cupom": "BEMVINDO10"`.

**Resultado esperado:**
- Sem cupom: `subtotal` 200, `frete` 0, `freteGratis` true, `total` 200.
- Com cupom: `subtotal` 200, `desconto` 20, `frete` 0, `freteGratis` true, `total` 180.

**Resultado obtido:**
- Sem cupom: `subtotal` 200, `frete` **19.9**, `freteGratis` **false**, `valorFaltanteFreteGratis` 0, `total` **219.9**.
- Com cupom: `subtotal` 200, `desconto` 20, `frete` **19.9**, `freteGratis` **false**, `total` **199.9** (esperado 180).

**Evidência:** ![respostas da API](../evidencias/BUG-001.png)

```bash
curl -s -X POST https://verzel-store.qa-test-verzel-store.workers.dev/api/carrinho/calcular \
  -H "Content-Type: application/json" \
  -d '{"itens":[{"produtoId":"P005","quantidade":2}]}'

curl -s -X POST https://verzel-store.qa-test-verzel-store.workers.dev/api/carrinho/calcular \
  -H "Content-Type: application/json" \
  -d '{"itens":[{"produtoId":"P005","quantidade":2}],"cupom":"BEMVINDO10"}'
```

**Observações:**
- Reproduz sempre. Os testes automatizados CALC-04 e CALC-07 falham pelo mesmo motivo, então são tratados como **um único bug**.
- A resposta é inconsistente consigo mesma: `valorFaltanteFreteGratis` é 0 (limite atingido), mas `freteGratis` é false e o frete é cobrado.
- O limite funciona fora do valor exato: com subtotal de R$ 199,80 o frete é cobrado (correto) e com R$ 239,70 é grátis (correto). Hipótese: a comparação usa "maior que" (`>`) em vez de "maior ou igual" (`>=`). É só uma hipótese, não verificável pelo lado de fora.
- Impacto: o cliente paga R$ 19,90 indevidos sempre que o subtotal for exatamente R$ 200,00.
- Verificação na tela: [preencher: reproduz / não reproduz com 2 unidades de "Mochila Urbana 20L"].

---

### BUG-002 - API aceita mais de 5 unidades de um produto

- **Severidade:** Alta | **Prioridade:** Média
- **Critério violado:** CA10 (máximo de 5 unidades por produto por pedido; a regra vale para a interface **e para a API**). Código de erro previsto na documentação: `QUANTIDADE_MAXIMA_EXCEDIDA`.
- **Ambiente:** Verzel Store v2.3.0 · API `POST /api/carrinho/calcular` · curl no Git Bash (Windows 10) · 09/10/2026
- **Camada:** API (verificação na tela e em `/api/pedidos`: ver observações)
- **Cenário relacionado:** QT-003

**Pré-condições:** nenhuma.

**Passos para reproduzir:**
1. Enviar `POST /api/carrinho/calcular` com 6 unidades de `P001` (Camiseta Essencial).
2. Observar o status HTTP e o corpo da resposta.

**Resultado esperado:** status **422** e corpo de erro com `erro.codigo` = `QUANTIDADE_MAXIMA_EXCEDIDA` (campo `itens[0].quantidade`).

**Resultado obtido:** status **200 OK**, com a quantidade 6 calculada normalmente: `subtotal` 359.4, `frete` 0, `freteGratis` true, `total` 359.4.

**Evidência:** ![resposta da API](../evidencias/BUG-002.png)

```bash
curl -s -i -X POST https://verzel-store.qa-test-verzel-store.workers.dev/api/carrinho/calcular \
  -H "Content-Type: application/json" \
  -d '{"itens":[{"produtoId":"P001","quantidade":6}]}'
```

**Observações:**
- Reproduz sempre. O teste automatizado QT-003 falha pelo mesmo motivo.
- Com 5 unidades a API responde normalmente (comportamento correto), então a falha está na validação do limite superior.
- Impacto: a regra de negócio pode ser contornada chamando a API diretamente, e o carrinho aceita pedidos acima do limite.
- Verificação em `POST /api/pedidos` com 6 unidades: [preencher: status e código obtidos].
- Verificação na tela (tentar passar de 5 unidades): [preencher: a tela bloqueia / não bloqueia].
