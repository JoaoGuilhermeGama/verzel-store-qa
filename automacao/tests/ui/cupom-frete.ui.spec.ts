import { test, expect } from '@playwright/test';
import { LojaPage } from './loja.page';

/**
 * Cenários de UI automatizados (ver docs/01-cenarios/*.feature).
 * Cada teste usa um contexto novo do navegador => carrinho vazio (carrinho vive só na aba).
 */
test.describe('Cupom e frete grátis - UI', () => {
  let loja: LojaPage;

  test.beforeEach(async ({ page }) => {
    loja = new LojaPage(page);
    await loja.abrir();
  });

  // CP-001 / CALC-01 - @CA01 @CA07 @CA09
  test('UI-01 cupom BEMVINDO10 aplica 10% e mantém frete abaixo de R$ 200', async () => {
    await loja.adicionarProduto('Mochila Urbana 20L');
    await loja.abrirCarrinho();
    await loja.aplicarCupom('BEMVINDO10');

    await loja.esperarValor(100); // subtotal
    await loja.esperarValor(10); // desconto
    await loja.esperarValor(19.9); // frete (CA09: desconto não incide sobre o frete)
    await loja.esperarValor(109.9); // total
  });

  // FR-002 e FR-003 / CALC-04 e CALC-05 - @CA06 @CA07
  test('UI-02 frete grátis a partir de R$ 200,00 (limite inclusivo)', async ({ page }) => {
    await loja.adicionarProduto('Mochila Urbana 20L', 2); // subtotal exato: 200,00
    await loja.abrirCarrinho();
    await loja.esperarValor(200);
    // Frete grátis: o carrinho não deve cobrar R$ 19,90 nem pedir "falta para o frete grátis".
    await expect(page.getByText(/R\$\s*19,90/)).toHaveCount(0);
    await expect(page.getByText(/grátis|gratis/i).first()).toBeVisible();
  });

  // CP-004 e CP-005 - @CA03 @CA04
  test('UI-03 cupom inexistente e cupom expirado não aplicam desconto', async ({ page }) => {
    await loja.adicionarProduto('Jaqueta Corta-Vento'); // R$ 229,90
    await loja.abrirCarrinho();

    await loja.aplicarCupom('XPTO');
    await expect(page.getByText('Cupom inválido.')).toBeVisible();
    await loja.esperarValor(229.9);

    await loja.aplicarCupom('VERAO2026');
    await expect(page.getByText('Cupom expirado.')).toBeVisible();
    await loja.esperarValor(229.9); // total continua sem desconto
  });

  // CP-002 / CP-003 - @CA02
  test('UI-04 código do cupom ignora maiúsculas/minúsculas e espaços nas pontas', async () => {
    await loja.adicionarProduto('Mochila Urbana 20L');
    await loja.abrirCarrinho();
    await loja.aplicarCupom('  bemvindo10  ');
    await loja.esperarValor(109.9);
  });
});
