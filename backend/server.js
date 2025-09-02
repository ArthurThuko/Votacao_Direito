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
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
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

// ---------------- ROTA PARA REGISTRAR VOTO ----------------
app.post('/votar', (req, res) => {
  const {
    nome,
    email,
    cpf,
    alunoFavor,
    alunoContra,
    debateNota,
    tecnicoNota,
    argumentoNota,
    posicaoFinal
  } = req.body;

  if (
    nome == null || email == null || cpf == null ||
    !alunoFavor || !alunoContra ||
    debateNota == null || tecnicoNota == null || argumentoNota == null ||
    !posicaoFinal
  ) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO votos 
      (nome, email, cpf, alunoFavor, alunoContra, debateNota, tecnicoNota, argumentoNota, posicaoFinal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(nome, email, cpf, alunoFavor, alunoContra, debateNota, tecnicoNota, argumentoNota, posicaoFinal);

    res.json({ mensagem: 'Voto registrado com sucesso.' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Este CPF já registrou um voto.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor ao registrar voto.' });
  }
});

// ---------------- LISTAR VOTOS ----------------
app.get('/votos', (req, res) => {
  const votos = db.prepare('SELECT * FROM votos ORDER BY dataVoto DESC').all();
  res.json(votos);
});

// ---------------- RESULTADOS DA VOTAÇÃO ----------------
app.get('/resultados', (req, res) => {
  const votos = db.prepare(`SELECT * FROM votos`).all();

  if (votos.length === 0) {
    return res.json({
      destaques: { aFavor: {}, contra: {} },
      notas: { debate: 0, tecnica: 0, argumento: 0 },
      vencedor: "-",
      fotoVencedor: "../image/usuario_generico.png"
    });
  }

  // Médias das notas
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

  // Destaques individuais
  const votosAFavor = {};
  const votosContra = {};

  votos.forEach(voto => {
    votosAFavor[voto.alunoFavor] = (votosAFavor[voto.alunoFavor] || 0) + 1;
    votosContra[voto.alunoContra] = (votosContra[voto.alunoContra] || 0) + 1;
  });

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

  const aFavor = { nome: destaque(votosAFavor), foto: "../image/usuario_generico.png" };
  const contra = { nome: destaque(votosContra), foto: "../image/usuario_generico.png" };

  // Posição vencedora
  const posicoes = votos.reduce((acc, v) => {
    acc[v.posicaoFinal] = (acc[v.posicaoFinal] || 0) + 1;
    return acc;
  }, {});

  let vencedor = "-";
  let fotoVencedor = "../image/usuario_generico.png";

  if (posicoes["A FAVOR"] && (!posicoes["CONTRA"] || posicoes["A FAVOR"] > posicoes["CONTRA"])) {
    vencedor = "A FAVOR";
    fotoVencedor = "../image/icone_corrente.png";   // Ícone de "libertação"
  } else if (posicoes["CONTRA"] && (!posicoes["A FAVOR"] || posicoes["CONTRA"] > posicoes["A FAVOR"])) {
    vencedor = "CONTRA";
    fotoVencedor = "../image/icone_sirene.png";    // Ícone de "condenação"
  }

  res.json({
    destaques: { aFavor, contra },
    notas: medias,
    vencedor,
    fotoVencedor
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});