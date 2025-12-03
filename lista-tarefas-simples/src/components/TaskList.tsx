import React from 'react';
import { Task } from '../src/types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-slate-700">Tudo pronto!</h3>
        <p className="mt-1 text-sm text-slate-500">Você não tem tarefas pendentes. Adicione uma nova acima.</p>
      </div>
    );
  }

  return (
    <ul role="list" className="divide-y divide-slate-200">
      {tasks.map((task) => (
        <li key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`task-${task.id}`}
              checked={task.isCompleted}
              onChange={() => onToggleTask(task.id)}
              className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <label
              htmlFor={`task-${task.id}`}
              className={`ml-3 block text-base font-medium cursor-pointer ${
                task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
              }`}
            >
              {task.text}
            </label>
          </div>
          <button
            onClick={() => onDeleteTask(task.id)}
            aria-label={`Excluir tarefa ${task.text}`}
            className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
