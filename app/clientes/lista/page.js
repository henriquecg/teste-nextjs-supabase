'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient'; // Voltando 3 níveis para achar o arquivo na raiz

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(true);

  const buscarClientes = async () => {
    setCarregandoLista(true);
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setCarregandoLista(false);
    }
  };

  useEffect(() => {
    buscarClientes();
  }, []);

  return (
    <div style={estilos.container}>
      <div style={estilos.topoAcoes}>
        <a href="/" style={estilos.linkVoltar}>← Início</a>
        <a href="/clientes/cadastro" style={estilos.botaoCadastro}>+ Novo Cliente</a>
      </div>

      <div style={estilos.card}>
        <div style={estilos.header}>
          <h2 style={estilos.titulo}>Clientes Cadastrados</h2>
          <p style={estilos.subtitulo}>Registros armazenados no Supabase.</p>
        </div>

        {carregandoLista ? (
          <p style={{ textAlign: 'center', color: '#718096', fontSize: '14px' }}>Carregando dados...</p>
        ) : clientes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#718096', fontSize: '14px' }}>Nenhum cliente cadastrado.</p>
        ) : (
          <div style={estilos.listaContainer}>
            {clientes.map((cliente) => (
			  <div key={cliente.id} style={estilos.itemCliente}>
				<div>
				  <h4 style={estilos.clienteNome}>{cliente.nome}</h4>
				  <p style={estilos.clienteDetalhe}>CPF: {cliente.cpf}</p>
				  {/* Exibindo a idade de forma discreta embaixo */}
				  <span style={{ fontSize: '12px', color: '#4a5568', fontWeight: '500' }}>{cliente.idade} anos</span>
				</div>
				
				{/* NOVO: Link para editar passando o ID do cliente por parâmetro */}
				<a 
				  href={`/clientes/cadastro?id=${cliente.id}`} 
				  style={estilos.botaoEditar}
				>
				  Editar
				</a>
			  </div>
			))}
          </div>
        )}
      </div>
    </div>
  );
}

const estilos = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: '-apple-system, sans-serif', padding: '40px 20px', gap: '20px' },
  topoAcoes: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '450px', width: '100%' },
  linkVoltar: { color: '#718096', textDecoration: 'none', fontSize: '14px', fontWeight: '600' },
  botaoCadastro: { padding: '8px 16px', backgroundColor: '#3182ce', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600' },
  card: { backgroundColor: '#ffffff', width: '100%', maxWidth: '450px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '35px', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
  header: { marginBottom: '25px', textAlign: 'center' },
  titulo: { fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: '0 0 8px 0' },
  subtitulo: { fontSize: '14px', color: '#718096', margin: 0 },
  listaContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  itemCliente: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' },
  clienteNome: { margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#2d3748' },
  clienteDetalhe: { margin: 0, fontSize: '13px', color: '#718096' },
  badgeIdade: { backgroundColor: '#e2e8f0', color: '#4a5568', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  
	// Adicione isto no final do objeto de estilos da sua LISTA:
	botaoEditar: {
	  padding: '6px 12px',
	  backgroundColor: '#edf2f7',
	  color: '#4a5568',
	  textDecoration: 'none',
	  borderRadius: '6px',
	  fontSize: '13px',
	  fontWeight: '600',
	  border: '1px solid #cbd5e0',
	  transition: 'background-color 0.2s',
	}

};
