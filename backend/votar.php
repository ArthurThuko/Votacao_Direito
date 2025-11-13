<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$db = new PDO("sqlite:votacoes.db");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$db->exec("
CREATE TABLE IF NOT EXISTS votos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  alunoFavor TEXT NOT NULL,
  alunoContra TEXT NOT NULL,
  alunoGeral TEXT NOT NULL,
  debateNota INTEGER NOT NULL,
  tecnicoNota INTEGER NOT NULL,
  argumentoNota INTEGER NOT NULL,
  posicaoFinal TEXT NOT NULL,
  dataVoto TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
");

$data = json_decode(file_get_contents("php://input"), true);

if (
  !$data || empty($data['nome']) || empty($data['email']) || empty($data['cpf']) ||
  empty($data['alunoFavor']) || empty($data['alunoContra']) || empty($data['alunoGeral']) ||
  !isset($data['debateNota']) || !isset($data['tecnicoNota']) || !isset($data['argumentoNota']) ||
  empty($data['posicaoFinal'])
) {
  http_response_code(400);
  echo json_encode(["error" => "Dados incompletos."]);
  exit;
}

try {
  $stmt = $db->prepare("
    INSERT INTO votos (nome, email, cpf, alunoFavor, alunoContra, alunoGeral, debateNota, tecnicoNota, argumentoNota, posicaoFinal)
    VALUES (:nome, :email, :cpf, :alunoFavor, :alunoContra, :alunoGeral, :debateNota, :tecnicoNota, :argumentoNota, :posicaoFinal)
  ");
  $stmt->execute($data);

  echo json_encode(["mensagem" => "Voto registrado com sucesso."]);
} catch (PDOException $e) {
  if (str_contains($e->getMessage(), 'UNIQUE')) {
    http_response_code(400);
    echo json_encode(["error" => "Este CPF já registrou um voto."]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => "Erro no servidor ao registrar voto."]);
  }
}