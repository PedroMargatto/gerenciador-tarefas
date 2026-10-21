import React, { useState, createContext, useContext } from 'react';

const TarefasContext = createContext();

export function TarefasProvider({ children }) {
  const [tarefas, setTarefas] = useState([]);
  const [filtro, setFiltro] = useState('todas');

  const adicionarTarefa = (texto) => {
    if (!texto.trim()) return;
    const item = {
      id: Date.now(),
      texto: texto,
      concluida: false,
    };
    setTarefas((tarefasAnteriores) => [...tarefasAnteriores, item]);
  };

  const alternarConcluida = (id) => {
    setTarefas((tarefasAnteriores) =>
      tarefasAnteriores.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === 'pendentes') return !tarefa.concluida;
    if (filtro === 'concluidas') return tarefa.concluida;
    return true;
  });

  return (
    <TarefasContext.Provider
      value={{
        tarefas: tarefasFiltradas,
        filtro,
        setFiltro,
        adicionarTarefa,
        alternarConcluida,
      }}
    >
      {children}
    </TarefasContext.Provider>
  );
}

function useTarefas() {
  return useContext(TarefasContext);
}

function FormularioTarefa() {
  const [texto, setTexto] = useState('');
  const { adicionarTarefa } = useTarefas();

  const handleSubmit = (e) => {
    e.preventDefault();
    adicionarTarefa(texto);
    setTexto('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Digite uma nova tarefa..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        style={{ flex: 1, padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button
        type="submit"
        style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Adicionar
      </button>
    </form>
  );
}

function Filtros() {
  const { filtro, setFiltro } = useTarefas();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
      <button
        onClick={() => setFiltro('todas')}
        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #007bff', backgroundColor: filtro === 'todas' ? '#007bff' : '#fff', color: filtro === 'todas' ? '#fff' : '#007bff', cursor: 'pointer' }}
      >
        Todas
      </button>
      <button
        onClick={() => setFiltro('pendentes')}
        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #007bff', backgroundColor: filtro === 'pendentes' ? '#007bff' : '#fff', color: filtro === 'pendentes' ? '#fff' : '#007bff', cursor: 'pointer' }}
      >
        Pendentes
      </button>
      <button
        onClick={() => setFiltro('concluidas')}
        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #007bff', backgroundColor: filtro === 'concluidas' ? '#007bff' : '#fff', color: filtro === 'concluidas' ? '#fff' : '#007bff', cursor: 'pointer' }}
      >
        Concluídas
      </button>
    </div>
  );
}

function Tarefa({ tarefa }) {
  const { alternarConcluida } = useTarefas();

  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid #eee' }}>
      <input
        type="checkbox"
        checked={tarefa.concluida}
        onChange={() => alternarConcluida(tarefa.id)}
        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
      />
      <span style={{ textDecoration: tarefa.concluida ? 'line-through' : 'none', color: tarefa.concluida ? '#888' : '#333', fontSize: '16px' }}>
        {tarefa.texto}
      </span>
    </li>
  );
}

function ListaDeTarefas() {
  const { tarefas } = useTarefas();

  if (tarefas.length === 0) {
    return <p style={{ textAlign: 'center', color: '#777', marginTop: '20px' }}>Nenhuma tarefa encontrada.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
      {tarefas.map((tarefa) => (
        <Tarefa key={tarefa.id} tarefa={tarefa} />
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <TarefasProvider>
      <div style={{ maxWidth: '450px', margin: '40px auto', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>Gerenciador de Tarefas</h2>
        <FormularioTarefa />
        <Filtros />
        <ListaDeTarefas />
      </div>
    </TarefasProvider>
  );
}