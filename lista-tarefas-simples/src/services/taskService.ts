import { Task } from '../src/types';

const API_BASE_URL = 'http://localhost:4000/api';


export const getTasks = async (): Promise<Task[]> => {
  console.log("Chamando API real: GET /api/tasks");
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error('Falha ao buscar tarefas do servidor');
  }
  return response.json();
};

export const addTask = async (text: string): Promise<Task> => {
  console.log("Chamando API real: POST /api/tasks");
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error('Falha ao adicionar tarefa no servidor');
  }
  return response.json();
};

export const updateTask = async (id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task> => {
  console.log(`Chamando API real: PUT /api/tasks/${id}`);
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Falha ao atualizar tarefa no servidor');
  }
  return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  console.log(`Chamando API real: DELETE /api/tasks/${id}`);
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Falha ao excluir tarefa no servidor');
  }
};
