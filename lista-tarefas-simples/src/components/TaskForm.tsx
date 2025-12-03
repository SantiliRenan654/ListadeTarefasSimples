import React, { useState } from 'react';

interface TaskFormProps {
  onAddTask: (text: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      await onAddTask(text);
      setText('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <label htmlFor="new-task" className="block text-lg font-semibold text-slate-700 mb-2">
        Nova Tarefa
      </label>
      <div className="flex gap-2">
        <input
          id="new-task"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que precisa ser feito?"
          className="flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out text-base"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="flex-shrink-0 bg-sky-600 text-white font-bold py-3 px-6 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-150 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
