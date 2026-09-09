'use client';

import { useState, useEffect, Suspense } from 'react'; // 1. Adicionado o Suspense aqui
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../../supabaseClient';

// Criamos um subcomponente interno que contém o formulário real
function FormularioCadastro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idCliente = searchParams.get('id');

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [cpf, setCpf] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    if (idCliente) {
      const carregarDadosCliente = async () => {
        try {
          const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('id', idCliente)
            .single();

          if (error) throw error;

          if (data) {
            setNome(data.nome);
            setIdade(data.idade.toString());
            setCpf(data.cpf);
          }
        } catch (error) {
          setMensagem({ tipo: 'erro', texto: `❌ Erro ao carregar dados: ${error.message}` });
        }
      };

      carregarDadosCliente();
    }
  }, [idCliente]);

  const lidarComCpf = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      setCpf(valor);
    }
  };

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    if (cpf.length < 14) {
      setMensagem({ tipo: 'erro', texto: '⚠️ Digite um CPF válido.' });
      setCarregando(false);
      return;
    }

    try {
      if (idCliente) {
        const { error } = await supabase
          .from('clientes')
          .update({ nome, idade: parseInt(idade), cpf })
          .eq('id', idCliente);

        if (error) throw error;
        setMensagem({ tipo: 'sucesso', texto: '✨ Cadastro atualizado com sucesso!' });
      } else {
        const { error } = await supabase
          .from('clientes')
          .insert([{ nome, idade: parseInt(idade), cpf }]);

        if (error) throw error;
        setMensagem({ tipo: 'sucesso', texto: '✨ Cliente cadastrado com sucesso!' });
        setNome('');
        setIdade('');
        setCpf('');
      }

      setTimeout(() => {
        router.push('/clientes/lista');
      }, 1500);

    } catch (error) {
      setMensagem({ tipo: 'erro', texto: `❌ Erro: ${error.message}` });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={estilos.container}>
      <a href="/clientes/lista" style={estilos.linkVoltar}>← Cancelar e Voltar</a>

      <div style={estilos.card}>
        <div style={estilos.header}>
          <h2 style={estilos.titulo}>{idCliente ? 'Editar Cliente' : 'Novo Cliente'}</h2>
          <p style={estilos.subtitulo}>
            {idCliente ? 'Modifique os dados abaixo para atualizar o registro.' : 'Preencha para salvar no banco de dados.'}
          </p>
        </div>
        
        <form onSubmit={lidarComEnvio} style={estilos.formulario}>
          <div style={estilos.campoGrupo}>
            <label style={estilos.label}>Nome Completo</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João Silva" required style={estilos.input} />
          </div>

          <div style={estilos.campoGrupo}>
            <label style={estilos.label}>Idade</label>
            <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Ex: 25" min="0" required style={estilos.input} />
          </div>

          <div style={estilos.campoGrupo}>
            <label style={estilos.label}>CPF</label>
            <input type="text" value={cpf} onChange={lidarComCpf} placeholder="000.000.000-00" required style={estilos.input} />
          </div>

          <button type="submit" disabled={carregando} style={{ ...estilos.botao, backgroundColor: carregando ? '#a0aec0' : '#3182ce', cursor: carregando ? 'not-allowed' : 'pointer' }}>
            {carregando ? 'Processando...' : idCliente ? 'Atualizar Cadastro' : 'Salvar Cadastro'}
          </button>
        </form>

        {mensagem.texto && (
          <div style={{ ...estilos.alerta, backgroundColor: messageColor(mensagem.tipo).bg, color: messageColor(mensagem.tipo).text, borderColor: messageColor(mensagem.tipo).border }}>
            {mensagem.texto}
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Exportamos a página principal envolvendo o formulário com o <Suspense>
export default function CadastroCliente() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>Carregando formulário...</div>}>
      <FormularioCadastro />
    </Suspense>
  );
}

const messageColor = (tipo) => {
  if (tipo === 'sucesso') return { bg: '#f0fff4', text: '#38a169', border: '#c6f6d5' };
  return { bg: '#fff5f5', text: '#e53e3e', border: '#fed7d7' };
};

const estilos = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: '-apple-system, sans-serif', padding: '40px 20px', gap: '20px' },
  linkVoltar: { color: '#3182ce', textDecoration: 'none', fontSize: '14px', fontWeight: '600', maxWidth: '450px', width: '100%' },
  card: { backgroundColor: '#ffffff', width: '100%', maxWidth: '450px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '35px', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
  header: { marginBottom: '25px', textAlign: 'center' },
  titulo: { fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: '0 0 8px 0' },
  subtitulo: { fontSize: '14px', color: '#718096', margin: 0 },
  formulario: { display: 'flex', flexDirection: 'column', gap: '20px' },
  campoGrupo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#4a5568' },
  input: { width: '100%', padding: '12px 16px', fontSize: '15px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' },
  botao: { width: '100%', padding: '14px', fontSize: '16px', fontWeight: '600', color: '#ffffff', border: 'none', borderRadius: '8px', marginTop: '10px' },
  alerta: { marginTop: '20px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', textAlign: 'center', border: '1px solid', fontWeight: '500' }
};
