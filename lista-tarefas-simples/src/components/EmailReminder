
import React, { useState } from 'react';
import { subscribeToDailyReminders } from '../services/emailService';

const EmailReminder: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    const email = window.prompt("Para receber alertas diários automáticos das suas tarefas pendentes, digite seu e-mail:");
    
    if (!email) return;
    if (!email.includes('@')) {
      alert("Por favor, digite um email válido.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await subscribeToDailyReminders(email);
      alert(response.message);
    } catch (error) {
      alert("Erro ao se inscrever. Verifique se o serviço de email (porta 5000) está rodando.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className="flex items-center gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Receber alertas automáticos todo dia"
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        )}
        <span>{isLoading ? 'Processando...' : 'Ativar Alerta Diário'}</span>
      </button>
    </div>
  );
};

export default EmailReminder;
