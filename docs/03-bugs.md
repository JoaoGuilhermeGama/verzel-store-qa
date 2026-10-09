# 03 - Report de bugs

Antes de reportar, conferi a seção **"Sobre este ambiente"** da documentação: carrinho só na aba, pedidos fictícios sem consulta, sem e-mail/cobrança, preços/cupons fixos, sem estoque e API sem estado **não são bugs**.

## Índice

| ID | Título | Severidade | Prioridade | Cenário | Status |
|---|---|---|---|---|---|
| BUG-001 | | | | | Aberto |

**Escala de severidade:** Crítica (cálculo de valor errado / pedido impossível) · Alta (regra de negócio descumprida) · Média (mensagem/validação incorreta, com contorno) · Baixa (cosmético/texto).

---

## Modelo (copie para cada bug)

### BUG-001 - [Título curto: o que acontece, onde]

- **Severidade:** Alta | **Prioridade:** Alta
- **Critério violado:** CA__ (ou cenário `XX-000`)
- **Ambiente:** Verzel Store v2.3.0 · Chrome __ · Windows 10 · data `__/__/____`
- **Camada:** UI / API

**Pré-condições:** carrinho com ...

**Passos para reproduzir:**
1. ...
2. ...
3. ...

**Resultado esperado:** ... (conforme CA__ da documentação)

**Resultado obtido:** ...

**Evidência:** ![print](../evidencias/BUG-001.png) · [`curl`/payload da API abaixo]

```bash
curl -X POST https://verzel-store.qa-test-verzel-store.workers.dev/api/carrinho/calcular \
  -H "Content-Type: application/json" \
  -d '{"itens":[{"produtoId":"P005","quantidade":2}],"cupom":"BEMVINDO10"}'
```

**Observações:** frequência (sempre/às vezes), contorno, impacto.
