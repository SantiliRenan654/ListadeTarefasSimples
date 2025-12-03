
// Serviço responsável por comunicar com o microserviço de Notificações (Email)
const EMAIL_API_URL = 'http://localhost:5000/api';

export interface EmailResponse {
  message: string;
}

export const subscribeToDailyReminders = async (email: string): Promise<EmailResponse> => {
  console.log(`Chamando Serviço de Email: POST /api/subscribe para ${email}`);
  
  try {
    const response = await fetch(`${EMAIL_API_URL}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Falha ao comunicar com o serviço de email');
    }

    return response.json();
  } catch (error) {
    console.error("Erro de conexão com o microserviço de email:", error);
    throw error;
  }
};
