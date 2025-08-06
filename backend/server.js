const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');

// Criação ou abertura do banco SQLite
const db = new Database('votacoes.db');

// Criação da tabela com campos compatíveis com seu formulário
db.prepare(`
  CREATE TABLE IF NOT EXISTS votos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alunoFavor TEXT NOT NULL,
    alunoContra TEXT NOT NULL,
    debateNota INTEGER NOT NULL,
    tecnicoNota INTEGER NOT NULL,
    argumentoNota INTEGER NOT NULL,
    posicaoFinal TEXT NOT NULL,
    dataVoto TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).run();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rota para registrar um voto
app.post('/votar', (req, res) => {
  const {
    alunoFavor,
    alunoContra,
    debateNota,
    tecnicoNota,
    argumentoNota,
    posicaoFinal
  } = req.body;

  if (!alunoFavor || !alunoContra || debateNota == null || tecnicoNota == null || argumentoNota == null || !posicaoFinal) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  const stmt = db.prepare(`
    INSERT INTO votos (alunoFavor, alunoContra, debateNota, tecnicoNota, argumentoNota, posicaoFinal)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(alunoFavor, alunoContra, debateNota, tecnicoNota, argumentoNota, posicaoFinal);

  res.json({ mensagem: 'Voto registrado com sucesso.' });
});

// Rota para obter todos os votos
app.get('/resultados', (req, res) => {
  const votos = db.prepare(`SELECT * FROM votos`).all();
  res.json({ votos });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});