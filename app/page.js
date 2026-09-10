'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [isComputador, setIsComputador] = useState(false);

  useEffect(() => {
    const checarTamanho = () => setIsComputador(window.innerWidth > 768);
    checarTamanho();
    window.addEventListener('resize', checarTamanho);
    return () => window.removeEventListener('resize', checarTamanho);
  }, []);

  return (
    <div style={estilos.container}>
      <div style={{ ...estilos.card, maxWidth: isComputador ? '650px' : '400px' }}>
        <h1 style={estilos.titulo}>💼 Sistema de Gestão de Clientes</h1>
        <p style={estilos.subtitulo}>
          Ambiente integrado com banco de dados Supabase para controle corporativo de registros.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a href="/clientes/lista" style={estilos.botaoAcesso}>
            Gerenciar Clientes Cadastrados
          </a>
          <a href="/clientes/cadastro" style={{ ...estilos.botaoAcesso, backgroundColor: '#718096' }}>
            Ir Direto para Novo Cadastro
          </a>
        </div>
      </div>
    </div>
  );
}

const estilos = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '20px' },
  card: { backgroundColor: '#ffffff', padding: '45px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', textAlign: 'center', width: '100%', border: '1px solid #e2e8f0', transition: 'max-width 0.2s' },
  titulo: { fontSize: '28px', fontWeight: '700', color: '#2d3748', margin: '0 0 12px 0' },
  subtitulo: { fontSize: '15px', color: '#718096', marginBottom: '35px', lineHeight: '1.6' },
  botaoAcesso: { display: 'block', padding: '14px', backgroundColor: '#3182ce', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', transition: 'background-color 0.2s' }
};
