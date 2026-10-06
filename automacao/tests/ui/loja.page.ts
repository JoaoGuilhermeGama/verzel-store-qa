import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object da Verzel Store.
 *
 * ATENÇÃO: os seletores abaixo foram escritos a partir da documentação, SEM inspecionar
 * o HTML da loja. Se algum teste de UI falhar por "locator not found", ajuste SOMENTE
 * este arquivo (use `npx playwright codegen <url-da-loja>` para descobrir os seletores
 * reais). Os testes em si não precisam mudar.
 */

/** Converte 109.9 em regex que casa "R$ 109,90" (inclui espaço não separável). */
export function moeda(valor: number): RegExp {
  const texto = valor.toFixed(2).replace('.', ',');
  const comMilhar = texto.replace(/\B(?=(\d{3})+(?!\d))/g, '\\.');
  return new RegExp(`R\\$\\s*${comMilhar}`);
}

export class LojaPage {
  constructor(private readonly page: Page) {}

  // ---------- seletores (ajustar aqui se necessário) ----------
  private cartaoProduto(nome: string): Locator {
    return this.page.locator('article, li, div').filter({ hasText: nome }).last();
  }
  private get botaoAdicionar(): (nome: string) => Locator {
    return (nome) => this.cartaoProduto(nome).getByRole('button', { name: /adicionar|comprar|carrinho/i }).first();
  }
  private get linkCarrinho(): Locator {
    return this.page.getByRole('link', { name: /carrinho/i }).first();
  }
  get campoCupom(): Locator {
    return this.page.getByPlaceholder(/cupom/i).or(this.page.getByLabel(/cupom/i)).first();
  }
  get botaoAplicarCupom(): Locator {
    return this.page.getByRole('button', { name: /aplicar/i }).first();
  }
  get botaoRemoverCupom(): Locator {
    return this.page.getByRole('button', { name: /remover/i }).first();
  }
  // ------------------------------------------------------------

  async abrir() {
    await this.page.goto('/');
  }

  async adicionarProduto(nome: string, vezes = 1) {
    for (let i = 0; i < vezes; i++) {
      await this.botaoAdicionar(nome).click();
    }
  }

  async abrirCarrinho() {
    await this.linkCarrinho.click();
  }

  async aplicarCupom(codigo: string) {
    await this.campoCupom.fill(codigo);
    await this.botaoAplicarCupom.click();
  }

  async esperarValor(valor: number) {
    await expect(this.page.getByText(moeda(valor)).first()).toBeVisible();
  }
}
