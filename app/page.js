'use client';

export default function Home() {
  return (
    <div style={estilos.container}>
      <div style={estilos.card}>
        <h1 style={estilos.titulo}>Painel do Sistema</h1>
        <p style={estilos.subtitulo}>Bem-vindo! Escolha uma das opções abaixo para gerenciar o sistema.</p>
        
        <a href="/clientes/lista" style={estilos.botaoAcesso}>
          Acessar Lista de Clientes →
        </a>
      </div>
    </div>
  );
}

const estilos = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    border: '1px solid #e2e8f0',
  },
  titulo: { fontSize: '26px', fontWeight: '700', color: '#2d3748', margin: '0 0 10px 0' },
  subtitulo: { fontSize: '15px', color: '#718096', marginBottom: '30px', lineHeight: '1.5' },
  botaoAcesso: {
    display: 'block',
    padding: '14px',
    backgroundColor: '#3182ce',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  }
};
