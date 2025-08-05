const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('votacao.db');

// Criação da tabela (se não existir)
db.run(`
  CREATE TABLE IF NOT EXISTS votos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_favor TEXT,
    aluno_contra TEXT,
    nota_debate INTEGER,
    nota_tecnica INTEGER,
    nota_argumento INTEGER,
    posicao_final TEXT,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Rota para receber votos
app.post('/votar', (req, res) => {
  const { alunoFavor, alunoContra, notaDebate, notaTecnica, notaArgumento, posicaoFinal } = req.body;

  const query = `
    INSERT INTO votos (aluno_favor, aluno_contra, nota_debate, nota_tecnica, nota_argumento, posicao_final)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [alunoFavor, alunoContra, notaDebate, notaTecnica, notaArgumento, posicaoFinal], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Voto registrado com sucesso!" });
  });
});

// Rota para obter resultados consolidados
app.get('/resultado', (req, res) => {
  db.all(`SELECT * FROM votos`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Processar os resultados
    let total = rows.length;
    let somaDebate = 0;
    let somaTecnico = 0;
    let somaArgumento = 0;
    let posicoes = { favor: 0, contra: 0 };
    let destaqueFavor = {};
    let destaqueContra = {};

    rows.forEach(voto => {
      somaDebate += voto.nota_debate;
      somaTecnico += voto.nota_tecnica;
      somaArgumento += voto.nota_argumento;
      posicoes[voto.posicao_final]++;

      destaqueFavor[voto.aluno_favor] = (destaqueFavor[voto.aluno_favor] || 0) + 1;
      destaqueContra[voto.aluno_contra] = (destaqueContra[voto.aluno_contra] || 0) + 1;
    });

    const maisVotado = (obj) =>
      Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sem dados';

    res.json({
      mediaDebate: somaDebate / total,
      mediaTecnico: somaTecnico / total,
      mediaArgumento: somaArgumento / total,
      posicaoVencedora: posicoes.favor > posicoes.contra ? 'favor' : 'contra',
      alunoFavorDestaque: maisVotado(destaqueFavor),
      alunoContraDestaque: maisVotado(destaqueContra)
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});