# language: pt
@VZS-142 @api
Funcionalidade: API da Verzel Store

  @API-001 @automatizado
  Cenário: API-001 Listar produtos
    Quando faço GET em "/api/produtos"
    Então o status é 200
    E a lista contém 8 produtos com id, nome e preco

  @API-002 @API-003 @automatizado
  Esquema do Cenário: API-002/003 Consultar produto por id
    Quando faço GET em "/api/produtos/<id>"
    Então o status é <status>

    Exemplos:
      | id   | status |
      | P001 | 200    |
      | P999 | 404    |

  @API-004 @automatizado
  Cenário: API-004 Calcular carrinho (exemplo da documentação)
    Quando envio itens P002×1 e P004×2 com o cupom "BEMVINDO10" para "/api/carrinho/calcular"
    Então subtotal=239.70, desconto=23.97, frete=0 e total=215.73

  @API-005 @automatizado
  Cenário: API-005 Calcular com cupom inválido não gera erro
    Quando envio o cupom "XPTO" para "/api/carrinho/calcular"
    Então o status é 200
    E o desconto é 0
    E cupom.mensagem é "Cupom inválido."

  @API-006 @automatizado
  Esquema do Cenário: API-006 Pedido com cupom inválido ou expirado gera 422
    Quando envio um pedido válido com o cupom "<cupom>"
    Então o status é 422
    E o código do erro é "<codigo>"

    Exemplos:
      | cupom     | codigo          |
      | XPTO      | CUPOM_INVALIDO  |
      | VERAO2026 | CUPOM_EXPIRADO  |

  @API-007 @automatizado
  Cenário: API-007 Confirmar pedido válido
    Quando envio um pedido válido
    Então o status é 201
    E "numero" segue o formato VZ-000000

  @API-008 @API-009 @API-010 @automatizado
  Esquema do Cenário: API-008/009/010 Erros de contrato
    Quando faço <requisicao>
    Então o status é <status>
    E o código do erro é "<codigo>"

    Exemplos:
      | requisicao                                  | status | codigo                |
      | POST com corpo JSON malformado em /calcular | 400    | JSON_INVALIDO         |
      | GET em /api/rota-que-nao-existe             | 404    | ROTA_NAO_ENCONTRADA   |
      | GET em /api/carrinho/calcular               | 405    | METODO_NAO_PERMITIDO  |

  @API-011 @API-012 @API-013 @API-014 @automatizado
  Esquema do Cenário: API-011..014 Validação de itens
    Quando envio <itens> para "/api/carrinho/calcular"
    Então o status é 422
    E o código do erro é "<codigo>"

    Exemplos:
      | itens                              | codigo                 |
      | lista ausente ou vazia             | ITENS_OBRIGATORIOS     |
      | item que não é objeto              | ITEM_INVALIDO          |
      | produtoId inexistente              | PRODUTO_NAO_ENCONTRADO |
      | mesmo produto duas vezes           | ITEM_DUPLICADO         |

  @API-ui @API-consistencia
  Cenário: API-016 Valores exibidos na interface coincidem com os da API
    Dado um carrinho montado na interface
    Quando comparo com a resposta de "/api/carrinho/calcular" para os mesmos itens
    Então subtotal, desconto, frete e total são idênticos
