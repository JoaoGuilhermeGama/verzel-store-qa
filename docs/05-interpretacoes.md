# 05 - Ambiguidades e interpretações

O teste pede que ambiguidades sejam registradas junto com a interpretação adotada. Cada item traz a **interpretação proposta** (a ser confirmada ou ajustada depois de observar a loja) e o que foi **observado**.

| # | Ambiguidade | Interpretação adotada | Observado na loja | Bug? |
|---|---|---|---|---|
| 1 | **CA05:** ao digitar um 2º cupom sem remover o 1º, a tela bloqueia com aviso ou troca em silêncio? A doc diz que é preciso remover antes. | Deve manter o cupom atual e não aplicar o novo (idealmente com aviso). Troca silenciosa = desvio. | | |
| 2 | **CA02:** espaços **no meio** do código (`BEM VINDO10`) devem ser aceitos? A doc só fala das pontas. | Não aceitos: tratados como cupom inválido. | | |
| 3 | **CA11:** critério de arredondamento (meio para cima x para o par). | Sem impacto relevante com os dados atuais; registrar o comportamento observado. | | |
| 4 | **CA10:** o limite de 5 vale pela soma quando o mesmo produto é adicionado várias vezes na UI? Qual a mensagem? | Vale pela soma por produto; mensagem não especificada, qualquer aviso claro é aceitável. | | |
| 5 | **CA07:** texto exato do aviso "falta X para frete grátis" não é especificado. | Basta informar o valor correto (igual a `valorFaltanteFreteGratis` da API). | | |
| 6 | **Cupom vazio:** clicar em "Aplicar" sem digitar nada não tem critério. | Não aplica desconto e não gera erro técnico. | | |
| 7 | **Carrinho vazio:** o frete de R$ 19,90 aparece com carrinho vazio? | Não deveria cobrar frete sem itens. | | |
| 8 | **Mensagens da API x tela:** o texto de `cupom.mensagem` deve ser idêntico a "Cupom inválido." / "Cupom expirado."? | Deve conter o mesmo texto dos critérios CA03/CA04. | | |
| 9 | **`campos` em DADOS_INVALIDOS:** a doc diz que os detalhes vêm em "campos", sem dizer o formato nem se fica dentro de `erro`. | Aceito dentro de `erro` ou na raiz da resposta. | | |
| 10 | **Cupom em `/pedidos` vs `/calcular`:** a doc define comportamentos diferentes (422 x 200); tratado como intencional. | Intencional, não é bug. | | |
