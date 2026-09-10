'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  
  // 🟢 Detecta se a tela é um computador (largura maior que 768px)
  const [isComputador, setIsComputador] = useState(false);

  useEffect(() => {
    // Função para atualizar o estado com base na largura da janela
    const checarTamanho = () => {
      setIsComputador(window.innerWidth > 768);
    };

    checarTamanho(); // Roda ao carregar a página
    window.addEventListener('resize', checarTamanho); // Monitora mudanças de tamanho
    
    return () => window.removeEventListener('resize', checarTamanho);
  }, []);

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
      console.error('Erro ao buscar:', error.message);
    } finally {
      setCarregandoLista(false);
    }
  };

  const lidarComExclusao = async (id, nome) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`);
    if (!confirmar) return;

    try {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) throw error;
      setClientes(clientes.filter(cliente => cliente.id !== id));
      alert('✨ Cliente excluído com sucesso!');
    } catch (error) {
      alert(`❌ Erro ao excluir: ${error.message}`);
    }
  };

  useEffect(() => {
    buscarClientes();
  }, []);

  return (
    <div style={estilos.container}>
      <div style={{ ...estilos.topoAcoes, maxWidth: isComputador ? '800px' : '450px' }}>
        <a href="/" style={estilos.linkVoltar}>← Início</a>
        <a href="/clientes/cadastro" style={estilos.botaoCadastro}>+ Novo Cliente</a>
      </div>

      {/* 🟢 O card agora expande para 800px se for computador */}
      <div style={{ ...estilos.card, maxWidth: isComputador ? '800px' : '450px' }}>
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
                {/* 🟢 No computador, espalhamos os dados horizontalmente */}
                <div style={{ display: 'flex', gap: isComputador ? '40px' : '4px', flexDirection: isComputador ? 'row' : 'column', alignItems: isComputador ? 'center' : 'flex-start' }}>
                  <h4 style={estilos.clienteNome}>{cliente.nome}</h4>
                  <p style={estilos.clienteDetalhe}><strong>CPF:</strong> {cliente.cpf}</p>
                </div>
                
                <div style={estilos.acoesGrupo}>
                  <div style={estilos.badgeIdade}>{cliente.idade} anos</div>
                  <a href={`/clientes/cadastro?id=${cliente.id}`} style={estilos.botaoEditar}>Editar</a>
                  <button onClick={() => lidarComExclusao(cliente.id, cliente.nome)} style={estilos.botaoExcluir}>Excluir</button>
                </div>
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
  topoAcoes: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', transition: 'max-width 0.2s' },
  linkVoltar: { color: '#718096', textDecoration: 'none', fontSize: '14px', fontWeight: '600' },
  botaoCadastro: { padding: '8px 16px', backgroundColor: '#3182ce', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600' },
  card: { backgroundColor: '#ffffff', width: '100%', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '35px', border: '1px solid #e2e8f0', boxSizing: 'border-box', transition: 'max-width 0.2s' },
  header: { marginBottom: '25px', textAlign: 'center' },
  titulo: { fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: '0 0 8px 0' },
  subtitulo: { fontSize: '14px', color: '#718096', margin: 0 },
  listaContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  itemCliente: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' },
  clienteNome: { margin: 0, fontSize: '16px', fontWeight: '600', color: '#2d3748', minWidth: '150px' },
  clienteDetalhe: { margin: 0, fontSize: '14px', color: '#4a5568' },
  acoesGrupo: { display: 'flex', gap: '10px', alignItems: 'center' },
  badgeIdade: { backgroundColor: '#e2e8f0', color: '#4a5568', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  botaoEditar: { padding: '6px 12px', backgroundColor: '#edf2f7', color: '#4a5568', textDecoration: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', border: '1px solid #cbd5e0' },
  botaoExcluir: { padding: '6px 12px', backgroundColor: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }
};
