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

app.get('/votos', (req, res) => {
  const votos = db.prepare('SELECT * FROM votos ORDER BY dataVoto DESC').all();
  res.json(votos);
});

// Rota para obter todos os votos
app.get('/resultados', (req, res) => {
  const votos = db.prepare(`SELECT * FROM votos`).all();

  if (votos.length === 0) {
    return res.json({
      destaques: { aFavor: {}, contra: {} },
      notas: { debate: 0, tecnica: 0, argumento: 0 },
      vencedor: "-"
    });
  }

  // Calcular médias das notas
  const somaNotas = votos.reduce((acc, v) => {
    acc.debate += v.debateNota;
    acc.tecnica += v.tecnicoNota;
    acc.argumento += v.argumentoNota;
    return acc;
  }, { debate: 0, tecnica: 0, argumento: 0 });

  const qtd = votos.length;
  const medias = {
    debate: (somaNotas.debate / qtd).toFixed(2),
    tecnica: (somaNotas.tecnica / qtd).toFixed(2),
    argumento: (somaNotas.argumento / qtd).toFixed(2),
  };

  // Contar votos para alunos a favor e contra
  const votosAFavor = {};
  const votosContra = {};

  votos.forEach(voto => {
    votosAFavor[voto.alunoFavor] = (votosAFavor[voto.alunoFavor] || 0) + 1;
    votosContra[voto.alunoContra] = (votosContra[voto.alunoContra] || 0) + 1;
  });

  // Função para achar aluno destaque (mais votos)
  function destaque(votosObj) {
    let maxVotos = 0;
    let alunoDestaque = null;
    for (const aluno in votosObj) {
      if (votosObj[aluno] > maxVotos) {
        maxVotos = votosObj[aluno];
        alunoDestaque = aluno;
      }
    }
    return alunoDestaque || {};
  }

  // Aqui você pode mapear o nome para uma foto, ou enviar só o nome
  const aFavor = { nome: destaque(votosAFavor), foto: "../image/usuario_generico.png" };
  const contra = { nome: destaque(votosContra), foto: "../image/usuario_generico.png" };

  // Contar votos por posição final para definir vencedor
  const posicoes = votos.reduce((acc, v) => {
    acc[v.posicaoFinal] = (acc[v.posicaoFinal] || 0) + 1;
    return acc;
  }, {});

  let vencedor = "-";
  if (posicoes["A FAVOR"] && (!posicoes["CONTRA"] || posicoes["A FAVOR"] > posicoes["CONTRA"])) {
    vencedor = "A FAVOR";
  } else if (posicoes["CONTRA"] && (!posicoes["A FAVOR"] || posicoes["CONTRA"] > posicoes["A FAVOR"])) {
    vencedor = "CONTRA";
  }

  res.json({
    destaques: { aFavor, contra },
    notas: medias,
    vencedor
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});