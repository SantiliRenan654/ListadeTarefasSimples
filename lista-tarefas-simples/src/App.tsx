import React, { useState, useEffect, useCallback } from 'react';
import { Task } from './types';
import * as taskService from './services/taskService';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const initialTasks = await taskService.getTasks();
        setTasks(initialTasks);
      } catch (err) {
        setError("Não foi possível carregar as tarefas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = useCallback(async (text: string) => {
    try {
      const newTask = await taskService.addTask(text);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError("Não foi possível adicionar a tarefa.");
    }
  }, []);

  const handleToggleTask = useCallback(async (id: number) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    try {
      const updatedTask = await taskService.updateTask(id, { isCompleted: !taskToToggle.isCompleted });
      setTasks(prevTasks => prevTasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError("Não foi possível atualizar a tarefa.");
    }
  }, [tasks]);

  const handleDeleteTask = useCallback(async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      setError("Não foi possível excluir a tarefa.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <TaskForm onAddTask={handleAddTask} />
          {error && <ErrorMessage message={error} />}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-200">
            {isLoading ? (
              <p className="p-6 text-center text-slate-500">Carregando tarefas...</p>
            ) : (
              <TaskList
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;