import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { cliente_id, acao } = await request.json();
    
    // 🔒 Lendo com total segurança de dentro do servidor (Vercel ou Local)
    const URL_API_PYTHON = process.env.API_PYTHON_URL || 'http://localhost:8000';
    const token = process.env.API_TOKEN_SECRETO; 

    let urlDestino = `${URL_API_PYTHON}/clientes/analisar`;
    let metodo = 'POST';

    if (acao === 'excluir') {
      urlDestino = `${URL_API_PYTHON}/clientes/excluir/${cliente_id}`;
      metodo = 'DELETE';
    }

    // Faz o disparo de servidor para servidor
    const respostaRender = await fetch(urlDestino, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': token
      },
      body: metodo === 'POST' ? JSON.stringify({ cliente_id }) : null
    });

    if (!respostaRender.ok) {
      return NextResponse.json({ erro: 'Falha na comunicação com a API' }, { status: respostaRender.status });
    }

    const dados = await respostaRender.json();
    return NextResponse.json(dados);

  } catch (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}
