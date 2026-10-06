# language: pt
@VZS-142 @frete
Funcionalidade: Frete fixo e frete grátis
  O frete é grátis para subtotal a partir de R$ 200,00 (inclusive).
  Abaixo disso, frete fixo de R$ 19,90.

  @CA07 @FR-001
  Cenário: FR-001 Abaixo de R$ 200 cobra frete fixo
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Então o frete é R$ 19,90
    E o carrinho informa que faltam R$ 100,00 para o frete grátis

  @CA06 @FR-002 @limite @automatizado
  Cenário: FR-002 Subtotal exatamente R$ 200,00 tem frete grátis
    Dado que o carrinho contém 2 unidades de "Mochila Urbana 20L"
    Então o subtotal é R$ 200,00
    E o frete é R$ 0,00

  @CA07 @FR-003 @limite
  Cenário: FR-003 Subtotal R$ 199,80 ainda cobra frete
    Dado que o carrinho contém "Camiseta Essencial" e "Calça Jeans Slim"
    Então o subtotal é R$ 199,80
    E o frete é R$ 19,90
    E o carrinho informa que faltam R$ 0,20 para o frete grátis

  @CA08 @FR-004 @automatizado
  Cenário: FR-004 A regra do frete grátis usa o subtotal antes do desconto
    Dado que o carrinho contém 2 unidades de "Mochila Urbana 20L"
    Quando o cliente aplica o cupom "BEMVINDO10"
    Então o subtotal é R$ 200,00
    E o desconto é R$ 20,00
    E o frete é R$ 0,00
    E o total é R$ 180,00

  @CA09 @FR-005
  Cenário: FR-005 O desconto do cupom não incide sobre o frete
    Dado que o carrinho contém 1 unidade de "Tênis Casual Urbano"
    Quando o cliente aplica o cupom "BEMVINDO10"
    Então o desconto é R$ 18,99
    E o frete é R$ 19,90
    E o total é R$ 190,81

  @CA07 @FR-006
  Cenário: FR-006 Valor faltante nunca é negativo
    Dado que o carrinho contém 1 unidade de "Jaqueta Corta-Vento"
    Então o frete é R$ 0,00
    E o valor faltante para frete grátis é R$ 0,00

  @CA11 @AR-001
  Cenário: AR-001 Valores arredondados para 2 casas decimais
    Dado que o carrinho contém 3 unidades de "Camiseta Essencial"
    Então o subtotal é R$ 179,70
    E o total é R$ 199,60
