const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');

// Criação do banco de dados SQLite
const db = new Database('votacoes.db');

// Criação da tabela, se não existir
db.prepare(`
  CREATE TABLE IF NOT EXISTS votos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno TEXT NOT NULL,
    nota1 INTEGER NOT NULL,
    nota2 INTEGER NOT NULL,
    nota3 INTEGER NOT NULL,
    nota4 INTEGER NOT NULL
  )
`).run();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rota para registrar um voto
app.post('/votar', (req, res) => {
  const { aluno, nota1, nota2, nota3, nota4 } = req.body;

  if (!aluno || nota1 == null || nota2 == null || nota3 == null || nota4 == null) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  const stmt = db.prepare(`
    INSERT INTO votos (aluno, nota1, nota2, nota3, nota4)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(aluno, nota1, nota2, nota3, nota4);

  res.json({ mensagem: 'Voto registrado com sucesso.' });
});

// Rota para obter os resultados
app.get('/resultados', (req, res) => {
  const votos = db.prepare(`SELECT * FROM votos`).all();

  if (votos.length === 0) {
    return res.json({ destaque: null, medias: {} });
  }

  const resultados = {};
  votos.forEach(voto => {
    const { aluno, nota1, nota2, nota3, nota4 } = voto;
    const media = (nota1 + nota2 + nota3 + nota4) / 4;

    if (!resultados[aluno]) {
      resultados[aluno] = [];
    }

    resultados[aluno].push(media);
  });

  const medias = {};
  let destaque = { aluno: null, media: -1 };

  for (const aluno in resultados) {
    const todasNotas = resultados[aluno];
    const mediaFinal = todasNotas.reduce((a, b) => a + b, 0) / todasNotas.length;

    medias[aluno] = mediaFinal.toFixed(2);

    if (mediaFinal > destaque.media) {
      destaque = { aluno, media: mediaFinal };
    }
  }

  res.json({ destaque, medias });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});