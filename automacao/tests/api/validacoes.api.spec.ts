import { test, expect } from '@playwright/test';

/** Valida o formato padrão de erro: { erro: { codigo, mensagem, campo? } } */
async function esperaErro(res: any, status: number, codigo: string) {
  expect(res.status()).toBe(status);
  const body = await res.json();
  expect(body.erro).toBeDefined();
  expect(body.erro.codigo).toBe(codigo);
  expect(typeof body.erro.mensagem).toBe('string');
}

const clienteOk = { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' };

test.describe('GET /api/produtos', () => {
  test('API-001 lista os 8 produtos', async ({ request }) => {
    const res = await request.get('/api/produtos');
    expect(res.status()).toBe(200);
    const produtos = await res.json();
    expect(produtos).toHaveLength(8);
    for (const p of produtos) {
      expect(p).toEqual(expect.objectContaining({ id: expect.any(String), nome: expect.any(String), preco: expect.any(Number) }));
    }
  });

  test('API-002 consulta produto existente', async ({ request }) => {
    const res = await request.get('/api/produtos/P001');
    expect(res.status()).toBe(200);
    const p = await res.json();
    expect(p.nome).toBe('Camiseta Essencial');
    expect(p.preco).toBe(59.9);
  });

  test('API-003 produto inexistente retorna 404 PRODUTO_NAO_ENCONTRADO', async ({ request }) => {
    await esperaErro(await request.get('/api/produtos/P999'), 404, 'PRODUTO_NAO_ENCONTRADO');
  });
});

test.describe('Contrato de erros', () => {
  test('API-008 JSON malformado: 400 JSON_INVALIDO', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      headers: { 'Content-Type': 'application/json' },
      data: '{ itens: [',
    });
    await esperaErro(res, 400, 'JSON_INVALIDO');
  });

  test('API-009 rota inexistente: 404 ROTA_NAO_ENCONTRADA', async ({ request }) => {
    await esperaErro(await request.get('/api/rota-que-nao-existe'), 404, 'ROTA_NAO_ENCONTRADA');
  });

  test('API-010 método não permitido: 405 METODO_NAO_PERMITIDO', async ({ request }) => {
    await esperaErro(await request.get('/api/carrinho/calcular'), 405, 'METODO_NAO_PERMITIDO');
  });
});

test.describe('POST /api/carrinho/calcular - validação de itens', () => {
  test('API-011 itens ausentes ou vazios: 422 ITENS_OBRIGATORIOS', async ({ request }) => {
    await esperaErro(await request.post('/api/carrinho/calcular', { data: {} }), 422, 'ITENS_OBRIGATORIOS');
    await esperaErro(await request.post('/api/carrinho/calcular', { data: { itens: [] } }), 422, 'ITENS_OBRIGATORIOS');
  });

  test('API-012 item que não é objeto válido: 422 ITEM_INVALIDO', async ({ request }) => {
    await esperaErro(await request.post('/api/carrinho/calcular', { data: { itens: ['P001'] } }), 422, 'ITEM_INVALIDO');
  });

  test('API-013 produto inexistente: 422 PRODUTO_NAO_ENCONTRADO', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', { data: { itens: [{ produtoId: 'P999', quantidade: 1 }] } });
    await esperaErro(res, 422, 'PRODUTO_NAO_ENCONTRADO');
  });

  test('API-014 produto repetido: 422 ITEM_DUPLICADO', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }] },
    });
    await esperaErro(res, 422, 'ITEM_DUPLICADO');
  });

  for (const qtd of [0, -1, 1.5, '2', null]) {
    test(`QT-004 quantidade ${JSON.stringify(qtd)}: 422 QUANTIDADE_INVALIDA`, async ({ request }) => {
      const res = await request.post('/api/carrinho/calcular', { data: { itens: [{ produtoId: 'P001', quantidade: qtd }] } });
      await esperaErro(res, 422, 'QUANTIDADE_INVALIDA');
    });
  }

  test('QT-001 quantidade 5 é aceita (limite)', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', { data: { itens: [{ produtoId: 'P001', quantidade: 5 }] } });
    expect(res.status()).toBe(200);
  });

  test('QT-003 quantidade 6: 422 QUANTIDADE_MAXIMA_EXCEDIDA (CA10)', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', { data: { itens: [{ produtoId: 'P001', quantidade: 6 }] } });
    await esperaErro(res, 422, 'QUANTIDADE_MAXIMA_EXCEDIDA');
  });
});

test.describe('POST /api/pedidos', () => {
  const itens = [{ produtoId: 'P005', quantidade: 1 }];

  test('API-007 pedido válido: 201, número VZ-000000 e totais corretos', async ({ request }) => {
    const res = await request.post('/api/pedidos', { data: { cliente: clienteOk, itens, cupom: 'BEMVINDO10' } });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.numero).toMatch(/^VZ-\d{6}$/);
    expect(body.cliente.cep).toBe('01310100'); // normalizado, sem hífen
    expect(body.subtotal).toBeCloseTo(100, 2);
    expect(body.desconto).toBeCloseTo(10, 2);
    expect(body.frete).toBeCloseTo(19.9, 2);
    expect(body.total).toBeCloseTo(109.9, 2);
  });

  test('API-006a pedido com cupom inválido: 422 CUPOM_INVALIDO', async ({ request }) => {
    const res = await request.post('/api/pedidos', { data: { cliente: clienteOk, itens, cupom: 'XPTO' } });
    await esperaErro(res, 422, 'CUPOM_INVALIDO');
  });

  test('API-006b pedido com cupom expirado: 422 CUPOM_EXPIRADO', async ({ request }) => {
    const res = await request.post('/api/pedidos', { data: { cliente: clienteOk, itens, cupom: 'VERAO2026' } });
    await esperaErro(res, 422, 'CUPOM_EXPIRADO');
  });

  const invalidos: Array<[string, object]> = [
    ['CL-001 nome sem sobrenome', { ...clienteOk, nome: 'Maria' }],
    ['CL-002 e-mail sem @', { ...clienteOk, email: 'mariaexemplo.com' }],
    ['CL-004 CEP com 7 dígitos', { ...clienteOk, cep: '0131010' }],
    ['CL-004 CEP com 9 dígitos', { ...clienteOk, cep: '013101000' }],
    ['CL-004 CEP com letras', { ...clienteOk, cep: 'abcdefgh' }],
  ];
  for (const [titulo, cliente] of invalidos) {
    test(`${titulo}: 422 DADOS_INVALIDOS`, async ({ request }) => {
      const res = await request.post('/api/pedidos', { data: { cliente, itens } });
      await esperaErro(res, 422, 'DADOS_INVALIDOS');
    });
  }

  for (const cep of ['01310100', '01310-100']) {
    test(`CL-003 CEP "${cep}" é aceito`, async ({ request }) => {
      const res = await request.post('/api/pedidos', { data: { cliente: { ...clienteOk, cep }, itens } });
      expect(res.status()).toBe(201);
    });
  }

  test('API-015 vários campos inválidos: detalhes em "campos"', async ({ request }) => {
    const res = await request.post('/api/pedidos', {
      data: { cliente: { nome: 'Maria', email: 'x', cep: '1' }, itens },
    });
    await esperaErro(res, 422, 'DADOS_INVALIDOS');
    const body = await res.json();
    expect(body.erro.campos ?? body.campos).toBeDefined();
  });
});
