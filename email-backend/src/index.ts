console.log(">>> INICIANDO O SCRIPT DE EMAIL...");

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import axios from 'axios';
import cron from 'node-cron';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

console.log(">>> IMPORTAÇÕES CONCLUÍDAS");

dotenv.config();

const app = express();
const PORT = 5000;   // Porta do serviço de email
const TASK_SERVICE_URL = 'http://localhost:4000/api/tasks'; // URL do microserviço de tarefas

app.use(cors()); 
app.use(express.json()); 

// --- 1. CONFIGURAÇÃO DO BANCO DE DADOS (MySQL) ---
console.log(">>> CONFIGURANDO BANCO DE DADOS...");
const pool = mysql.createPool({
    host: process.env.DB_HOST || '',     // <--- COLOQUE SEU HOST DO MYSQL AQUI SE NÃO USAR .ENV
    user: process.env.DB_USER || '',    // <--- COLOQUE SEU USUÁRIO DO MYSQL AQUI SE NÃO USAR .ENV
    password: process.env.DB_PASSWORD || '', // <--- COLOQUE SUA SENHA DO MYSQL AQUI SE NÃO USAR .ENV
    database: process.env.DB_DATABASE || 'gerenciador_tarefas_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- 2. CONFIGURAÇÃO DO EMAIL (GMAIL) ---
// Substitua a senha abaixo pela sua Senha de App do Google
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // Seu e-mail
        pass: ''          // <--- COLOQUE AQUI SUA SENHA DE APP DE 16 DÍGITOS
    }
});

// --- ROTA: Inscrição de Usuário ---
app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email obrigatório' });

    try {
        console.log(`>>> Tentando inscrever: ${email}`);
        
        // Salva no banco
        await pool.query('INSERT INTO subscribers (email) VALUES (?)', [email]);
        console.log(`>>> Inscrito com sucesso no banco.`);
        
        // Envia email de boas-vindas
        await transporter.sendMail({
            from: '"Gerenciador de Tarefas" <>', // Seu e-mail entre <> 
            to: email,
            subject: 'Bem-vindo aos Alertas de Tarefas!',
            text: 'Sua inscrição foi confirmada. Você receberá avisos diários às 08:00 se houver tarefas pendentes.'
        });

        return res.json({ message: 'Inscrição realizada com sucesso!' });
    } catch (error: any) {
        console.error("ERRO AO INSCREVER:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.json({ message: 'Este email já está inscrito.' });
        }
        return res.status(500).json({ message: 'Erro ao salvar inscrição.' });
    }
});

// --- FUNÇÃO DO CRON JOB (Lógica de envio) ---
const checkAndSendEmails = async () => {
    try {
        console.log(">>> CRON: Iniciando verificação diária...");
        
        // 1. Busca inscritos
        const [rows] = await pool.query('SELECT email FROM subscribers');
        const subscribers = rows as { email: string }[];

        if (subscribers.length === 0) {
            console.log(">>> CRON: Nenhum inscrito para notificar.");
            return;
        }

        console.log(`>>> CRON: ${subscribers.length} inscritos encontrados. Buscando tarefas...`);
        
        // 2. Busca tarefas do outro microserviço
        const response = await axios.get(TASK_SERVICE_URL);
        const tasks = response.data;
        const pendingTasks = tasks.filter((t: any) => !t.isCompleted);

        if (pendingTasks.length === 0) {
            console.log('>>> CRON: Nenhuma tarefa pendente hoje.');
            return;
        }   

        // 3. Envia emails
        for (const sub of subscribers) {
            console.log(`>>> CRON: Enviando email para ${sub.email}...`);
            try {
                await transporter.sendMail({
                    from: '"Gerenciador de Tarefas" <>', // Seu e-mail entre <>
                    to: sub.email,
                    subject: `Lembrete: ${pendingTasks.length} tarefas pendentes`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                            <h2 style="color: #0284c7;">Lembrete Diário</h2>
                            <p>Olá! Você tem <strong>${pendingTasks.length}</strong> tarefas pendentes hoje:</p>
                            <ul style="background-color: #f8fafc; padding: 15px 30px; border-radius: 5px;">
                                ${pendingTasks.map((t: any) => `<li style="margin-bottom: 5px;">${t.text}</li>`).join('')}
                            </ul>
                            <p style="color: #64748b; font-size: 12px;">Enviado automaticamente.</p>
                        </div>
                    `
                });
                console.log(`>>> CRON: Email enviado com sucesso.`);
            } catch (err) {
                console.error(`>>> CRON: Falha ao enviar para ${sub.email}`, err);
            }
        }
    } catch (error) {
        console.error('>>> ERRO NO CRON JOB:', error);
    }
};

// --- AGENDAMENTO ---
// Roda todo dia às 08:00 da manhã
cron.schedule('*/10 * * * * *', () => {
    checkAndSendEmails();
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`✅✅✅ SERVIÇO DE EMAIL RODANDO NA PORTA ${PORT}`);
    console.log(`⏰ Agendamento Ativo: Todo dia às 08:00`);
    console.log(`--------------------------------------------------`);
});
