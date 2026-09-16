import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
	
	const URL_API_PYTHON = process.env.API_PYTHON_URL || 'http://localhost:8000';
    
    const response = await fetch(URL_API_PYTHON, { cache: 'no-store' });
    const data = await response.json();

    return NextResponse.json({ success: true, fromRender: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Falha ao acordar o Render/Supabase' }, 
      { status: 500 }
    );
  }
}
