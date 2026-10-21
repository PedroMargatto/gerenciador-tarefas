import React, { useState, createContext, useContext } from 'react';
import './App.css';

/**
 * Criação do Contexto Global (Context API)
 * Utilizado para gerenciar o estado global da aplicação em conformidade
 * com os requisitos da disciplina.
 */
const TarefasContext = createContext();

/**
 * Componente Provedor do Contexto (TarefasProvider)
 * Responsável por armazenar o estado global das tarefas e disponibilizar
 * as funções de manipulação para toda a árvore de componentes.
 */
export function TarefasProvider({ children }) {
  // Estado global para armazenar a lista de tarefas da aplicação
  const [tarefas, setTarefas] = useState([]);
  
  // Estado global para controlar o filtro ativo ('todas', 'pendentes', 'concluidas')
  const [filtro, setFiltro] = useState('todas');

  /**
   * Função para adicionar uma nova tarefa à lista.
   * Realiza validação de campos vazios e atualização imutável do estado.
   */
  const adicionarTarefa = (texto) => {
    if (!texto.trim()) return;
    const novaTarefaItem = {
      id: Date.now(), // Identificador único baseado no timestamp atual
      texto: texto,
      concluida: false // Status inicial da tarefa como pendente
    };
    setTarefas((anteriores) => [...anteriores, novaTarefaItem]);
  };

  /**
   * Função para alternar o status de conclusão da tarefa (Check/Uncheck).
   * Mapeia o array procurando pelo ID correspondente e inverte a propriedade 'concluida'.
   */
  const alternarConcluida = (id) => {
    setTarefas((anteriores) =>
      anteriores.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  /**
   * Lógica de Filtragem Dinâmica das Tarefas.
   * Retorna os itens de acordo com o filtro selecionado (todas, pendentes ou concluídas).
   */
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === 'pendentes') return !tarefa.concluida;
    if (filtro === 'concluidas') return tarefa.concluida;
    return true; // Retorna todas se o filtro selecionado for 'todas'
  });

  return (
    <TarefasContext.Provider
      value={{
        tarefasFiltradas,
        filtro,
        setFiltro,
        adicionarTarefa,
        alternarConcluida
      }}
    >
      {children}
    </TarefasContext.Provider>
  );
}

/**
 * Hook customizado para facilitar o consumo do contexto nos componentes.
 */
export function useTarefas() {
  return useContext(TarefasContext);
}

/**
 * Componente principal da interface do utilizador (UI).
 */
function AppContent() {
  const { tarefasFiltradas, filtro, setFiltro, adicionarTarefa, alternarConcluida } = useTarefas();
  const [textoInput, setTextoInput] = useState('');

  // Manipulador do envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    adicionarTarefa(textoInput);
    setTextoInput(''); // Limpa o input após adicionar
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {/* Cabeçalho visível na tela com a Identificação do Aluno */}
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Gerenciador de Tarefas</h1>
        <p style={{ margin: 0, fontWeight: 'bold' }}>Pedro Margatto da Fonseca — RA: 1209966</p>
      </header>

      {/* Formulário para adição de novas tarefas */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Digite uma nova tarefa..."
          value={textoInput}
          onChange={(e) => setTextoInput(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit">Adicionar</button>
      </form>

      {/* Botões de filtragem de status */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <button onClick={() => setFiltro('todas')} style={{ fontWeight: filtro === 'todas' ? 'bold' : 'normal' }}>Todas</button>
        <button onClick={() => setFiltro('pendentes')} style={{ fontWeight: filtro === 'pendentes' ? 'bold' : 'normal' }}>Pendentes</button>
        <button onClick={() => setFiltro('concluidas')} style={{ fontWeight: filtro === 'concluidas' ? 'bold' : 'normal' }}>Concluídas</button>
      </div>

      {/* Listagem de tarefas filtradas */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tarefasFiltradas.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Nenhuma tarefa encontrada.</p>
        ) : (
          tarefasFiltradas.map((tarefa) => (
            <li key={tarefa.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={tarefa.concluida}
                onChange={() => alternarConcluida(tarefa.id)}
              />
              <span style={{ textDecoration: tarefa.concluida ? 'line-through' : 'none', color: tarefa.concluida ? '#888' : '#000' }}>
                {tarefa.texto}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/**
 * Componente raiz que envolve a aplicação com o Provedor do Contexto.
 */
export default function App() {
  return (
    <TarefasProvider>
      <AppContent />
    </TarefasProvider>
  );
}