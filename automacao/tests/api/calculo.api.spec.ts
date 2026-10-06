import { test, expect } from '@playwright/test';

/**
 * Matriz de cálculo (docs/02-execucao.md - seção CALC).
 * Valores esperados derivados da documentação (CA01–CA11), não de observação da loja.
 * Qualquer falha aqui é um bug candidato: confirmar manualmente e reportar em docs/03-bugs.md.
 */
type Item = { produtoId: string; quantidade: number };
type Caso = {
  id: string;
  titulo: string;
  itens: Item[];
  cupom?: string;
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  faltante: number;
};

const casos: Caso[] = [
  { id: 'CALC-01', titulo: 'cupom válido, abaixo de 200', itens: [{ produtoId: 'P005', quantidade: 1 }], cupom: 'BEMVINDO10', subtotal: 100, desconto: 10, frete: 19.9, total: 109.9, faltante: 100 },
  { id: 'CALC-02', titulo: 'sem cupom, abaixo de 200', itens: [{ produtoId: 'P005', quantidade: 1 }], subtotal: 100, desconto: 0, frete: 19.9, total: 119.9, faltante: 100 },
  { id: 'CALC-03', titulo: 'exemplo da documentação', itens: [{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P004', quantidade: 2 }], cupom: 'BEMVINDO10', subtotal: 239.7, desconto: 23.97, frete: 0, total: 215.73, faltante: 0 },
  { id: 'CALC-04', titulo: 'subtotal exatamente 200 (limite inclusivo)', itens: [{ produtoId: 'P005', quantidade: 2 }], subtotal: 200, desconto: 0, frete: 0, total: 200, faltante: 0 },
  { id: 'CALC-05', titulo: 'subtotal 199,80 (logo abaixo)', itens: [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P002', quantidade: 1 }], subtotal: 199.8, desconto: 0, frete: 19.9, total: 219.7, faltante: 0.2 },
  { id: 'CALC-06', titulo: 'subtotal 199,70 (logo abaixo)', itens: [{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P006', quantidade: 2 }], subtotal: 199.7, desconto: 0, frete: 19.9, total: 219.6, faltante: 0.3 },
  { id: 'CALC-07', titulo: 'CA08: frete grátis usa subtotal ANTES do cupom', itens: [{ produtoId: 'P005', quantidade: 2 }], cupom: 'BEMVINDO10', subtotal: 200, desconto: 20, frete: 0, total: 180, faltante: 0 },
  { id: 'CALC-08', titulo: 'CA09: desconto não incide sobre o frete', itens: [{ produtoId: 'P003', quantidade: 1 }], cupom: 'BEMVINDO10', subtotal: 189.9, desconto: 18.99, frete: 19.9, total: 190.81, faltante: 10.1 },
  { id: 'CALC-09', titulo: 'CA11: arredondamento (59,9 x 3)', itens: [{ produtoId: 'P001', quantidade: 3 }], subtotal: 179.7, desconto: 0, frete: 19.9, total: 199.6, faltante: 20.3 },
  { id: 'CALC-10', titulo: 'quantidade máxima (5) com cupom', itens: [{ produtoId: 'P001', quantidade: 5 }], cupom: 'BEMVINDO10', subtotal: 299.5, desconto: 29.95, frete: 0, total: 269.55, faltante: 0 },
  { id: 'CALC-11', titulo: 'item barato, sem cupom', itens: [{ produtoId: 'P006', quantidade: 1 }], subtotal: 29.9, desconto: 0, frete: 19.9, total: 49.8, faltante: 170.1 },
  { id: 'CALC-12', titulo: 'cupom expirado não desconta', itens: [{ produtoId: 'P007', quantidade: 1 }], cupom: 'VERAO2026', subtotal: 229.9, desconto: 0, frete: 0, total: 229.9, faltante: 0 },
];

test.describe('POST /api/carrinho/calcular - matriz de cálculo', () => {
  for (const c of casos) {
    test(`${c.id} ${c.titulo}`, async ({ request }) => {
      const res = await request.post('/api/carrinho/calcular', {
        data: { itens: c.itens, ...(c.cupom !== undefined && { cupom: c.cupom }) },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();

      expect(body.subtotal).toBeCloseTo(c.subtotal, 2);
      expect(body.desconto).toBeCloseTo(c.desconto, 2);
      expect(body.frete).toBeCloseTo(c.frete, 2);
      expect(body.total).toBeCloseTo(c.total, 2);
      expect(body.valorFaltanteFreteGratis).toBeCloseTo(c.faltante, 2);
      expect(body.freteGratis).toBe(c.frete === 0);

      // CA11: no máximo 2 casas decimais (sem ruído de ponto flutuante)
      for (const campo of ['subtotal', 'desconto', 'frete', 'total', 'valorFaltanteFreteGratis']) {
        expect(Number(body[campo].toFixed(2))).toBe(body[campo]);
      }
      // Fórmula: total = subtotal - desconto + frete
      expect(body.total).toBeCloseTo(body.subtotal - body.desconto + body.frete, 2);
    });
  }
});

test.describe('POST /api/carrinho/calcular - cupom (CA02, CA03, CA04)', () => {
  const base = { itens: [{ produtoId: 'P005', quantidade: 1 }] };

  for (const codigo of ['bemvindo10', 'BemVindo10', '  BEMVINDO10  ']) {
    test(`CA02 aceita "${codigo}"`, async ({ request }) => {
      const res = await request.post('/api/carrinho/calcular', { data: { ...base, cupom: codigo } });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.cupom.aplicado).toBe(true);
      expect(body.desconto).toBeCloseTo(10, 2);
    });
  }

  test('CA03 cupom inexistente: 200, sem desconto, mensagem "Cupom inválido."', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', { data: { ...base, cupom: 'XPTO' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.desconto).toBe(0);
    expect(body.cupom.aplicado).toBe(false);
    expect(body.cupom.mensagem).toContain('Cupom inválido.');
  });

  test('CA04 cupom expirado: 200, sem desconto, mensagem "Cupom expirado."', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', { data: { ...base, cupom: 'VERAO2026' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.desconto).toBe(0);
    expect(body.cupom.aplicado).toBe(false);
    expect(body.cupom.mensagem).toContain('Cupom expirado.');
  });
});
