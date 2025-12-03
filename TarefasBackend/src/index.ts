
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// --- Validação das Variáveis de Ambiente ---
// Pegamos todas as variáveis necessárias do process.env
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, API_PORT } = process.env;

// Verificamos se alguma delas está faltando
if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_DATABASE) {
  console.error("ERRO: As variáveis de ambiente do banco de dados não estão completamente definidas no arquivo .env.");
  process.exit(1); // Encerra o processo do servidor com um código de erro
}

const app = express();
const port = API_PORT || 4000; // Porta padrão 4000 se não definida 

// Middlewares
app.use(cors());
app.use(express.json());

// --- Configuração da Conexão com o Banco de Dados ---
// Agora que já verificamos, o TypeScript sabe que essas variáveis são strings.
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- ROTAS DA API ---

// GET /api/tasks - Buscar todas as tarefas
app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar tarefas' });
  }
});

// POST /api/tasks - Adicionar uma nova tarefa
app.post('/api/tasks', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'O texto da tarefa é obrigatório' });
    }
    const [result] = await pool.query('INSERT INTO tasks (text) VALUES (?)', [text]);
    const insertId = (result as mysql.ResultSetHeader).insertId;
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [insertId]);
    res.status(201).json((rows as any)[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar tarefa' });
  }
});

// PUT /api/tasks/:id - Atualizar uma tarefa (marcar como concluída/não concluída)
app.put('/api/tasks/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isCompleted } = req.body;

        await pool.query('UPDATE tasks SET isCompleted = ? WHERE id = ?', [isCompleted, id]);
        
        const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
        if ((rows as any).length === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.json((rows as any)[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar tarefa' });
    }
});

// DELETE /api/tasks/:id - Excluir uma tarefa
app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
        if ((result as mysql.ResultSetHeader).affectedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir tarefa' });
    }
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${port}`);
});
