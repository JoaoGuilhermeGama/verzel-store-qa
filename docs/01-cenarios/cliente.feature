# language: pt
@VZS-142 @cliente
Funcionalidade: Validação dos dados do cliente na finalização do pedido
  (regras preexistentes à entrega VZS-142)

  @CL-001 @automatizado
  Cenário: CL-001 Nome precisa ter nome e sobrenome
    Quando o cliente informa o nome "Maria"
    Então o pedido é recusado com DADOS_INVALIDOS

  @CL-002 @automatizado
  Cenário: CL-002 E-mail precisa ter formato válido
    Quando o cliente informa o e-mail "mariaexemplo.com"
    Então o pedido é recusado com DADOS_INVALIDOS

  @CL-003 @automatizado
  Esquema do Cenário: CL-003 CEP com 8 dígitos, com ou sem hífen, é aceito
    Quando o cliente informa o CEP "<cep>"
    Então o pedido é confirmado
    E o CEP é gravado como "01310100"

    Exemplos:
      | cep       |
      | 01310100  |
      | 01310-100 |

  @CL-004 @automatizado
  Esquema do Cenário: CL-004 CEP inválido é recusado
    Quando o cliente informa o CEP "<cep>"
    Então o pedido é recusado com DADOS_INVALIDOS

    Exemplos:
      | cep       |
      | 0131010   |
      | 013101000 |
      | abcdefgh  |

  @CL-005
  Cenário: CL-005 Pedido confirmado na interface mostra número VZ-000000 e resumo correto
    Dado um carrinho válido e dados de cliente válidos
    Quando o cliente confirma o pedido
    Então a tela exibe o número no formato "VZ-000000"
    E o resumo de valores coincide com o do carrinho
