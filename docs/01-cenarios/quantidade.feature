# language: pt
@VZS-142 @quantidade
Funcionalidade: Limite de 5 unidades por produto (interface e API)

  @CA10 @QT-001
  Cenário: QT-001 5 unidades de um produto são aceitas
    Quando o cliente adiciona 5 unidades de "Camiseta Essencial"
    Então o carrinho contém 5 unidades

  @CA10 @QT-002
  Cenário: QT-002 A interface impede a 6ª unidade
    Dado que o carrinho contém 5 unidades de "Camiseta Essencial"
    Quando o cliente tenta adicionar mais 1 unidade
    Então a quantidade permanece 5

  @CA10 @QT-005
  Cenário: QT-005 Adições repetidas do mesmo produto respeitam o limite somado
    Quando o cliente clica 6 vezes em "Adicionar" para "Boné Aba Curva"
    Então a quantidade no carrinho não passa de 5

  @CA10 @QT-003 @api @automatizado
  Cenário: QT-003 A API recusa quantidade acima de 5
    Quando a API recebe 6 unidades do produto "P001"
    Então a resposta tem status 422
    E o código do erro é "QUANTIDADE_MAXIMA_EXCEDIDA"

  @QT-004 @api @automatizado
  Esquema do Cenário: QT-004 A API recusa quantidades inválidas
    Quando a API recebe quantidade <valor> do produto "P001"
    Então a resposta tem status 422
    E o código do erro é "QUANTIDADE_INVALIDA"

    Exemplos:
      | valor |
      | 0     |
      | -1    |
      | 1.5   |
      | "2"   |
      | null  |
