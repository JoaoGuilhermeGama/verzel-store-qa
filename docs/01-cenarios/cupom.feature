# language: pt
@VZS-142 @cupom
Funcionalidade: Aplicação de cupom de desconto no carrinho
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto
  Para pagar menos nas minhas compras

  Contexto:
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L" (R$ 100,00)

  @CA01 @CP-001 @automatizado
  Cenário: CP-001 Cupom BEMVINDO10 aplica 10% sobre o subtotal
    Quando o cliente aplica o cupom "BEMVINDO10"
    Então o desconto é R$ 10,00
    E o total é R$ 109,90

  @CA02 @CP-002 @automatizado
  Esquema do Cenário: CP-002 Código do cupom não diferencia maiúsculas de minúsculas
    Quando o cliente aplica o cupom "<codigo>"
    Então o desconto é R$ 10,00

    Exemplos:
      | codigo     |
      | bemvindo10 |
      | BemVindo10 |
      | BEMVINDO10 |

  @CA02 @CP-003 @automatizado
  Cenário: CP-003 Espaços no início e no fim do código são ignorados
    Quando o cliente aplica o cupom "  BEMVINDO10  "
    Então o desconto é R$ 10,00

  @CA02 @CP-008 @exploratorio
  Esquema do Cenário: CP-008 Códigos malformados não aplicam desconto nem quebram a tela
    Quando o cliente aplica o cupom "<codigo>"
    Então nenhum desconto é aplicado
    E nenhuma mensagem de erro técnico é exibida

    Exemplos:
      | codigo        |
      | BEM VINDO10   |
      | (vazio)       |
      | (só espaços)  |
      | BEMVINDO10!   |
      | <script>      |

  @CA03 @CP-004 @automatizado
  Cenário: CP-004 Cupom inexistente exibe "Cupom inválido."
    Quando o cliente aplica o cupom "XPTO"
    Então a mensagem exibida é "Cupom inválido."
    E nenhum desconto é aplicado

  @CA04 @CP-005 @automatizado
  Cenário: CP-005 Cupom expirado exibe "Cupom expirado."
    Quando o cliente aplica o cupom "VERAO2026"
    Então a mensagem exibida é "Cupom expirado."
    E nenhum desconto é aplicado

  @CA05 @CP-006
  Cenário: CP-006 Apenas um cupom por vez; para trocar, remover o atual
    Dado que o cupom "BEMVINDO10" está aplicado
    Quando o cliente tenta aplicar o cupom "VERAO2026" sem remover o atual
    Então o desconto de "BEMVINDO10" é mantido
    E o cupom "VERAO2026" não é aplicado

  @CA05 @CP-007
  Cenário: CP-007 Remover o cupom recalcula o total
    Dado que o cupom "BEMVINDO10" está aplicado
    Quando o cliente remove o cupom
    Então o desconto é R$ 0,00
    E o total é R$ 119,90

  @CP-009
  Cenário: CP-009 Alterar a quantidade com cupom aplicado recalcula os valores
    Dado que o cupom "BEMVINDO10" está aplicado
    Quando o cliente altera a quantidade de "Mochila Urbana 20L" para 2
    Então o subtotal é R$ 200,00
    E o desconto é R$ 20,00
    E o total é R$ 180,00
