<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://jurisimulado.kinghost.net");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$caminhoBanco = __DIR__ . "/votacoes.db";
if (!file_exists($caminhoBanco)) {
    echo json_encode(["erro" => "Banco de dados não encontrado."]);
    exit;
}

try {
    $db = new PDO("sqlite:" . $caminhoBanco);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $votos = $db->query("SELECT * FROM votos")->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    echo json_encode(["erro" => $e->getMessage()]);
    exit;
}

if (count($votos) === 0) {
    echo json_encode([
        "destaques" => [
            "aFavor" => ["nome" => "-", "foto" => "/frontend/image/usuario_generico.png"],
            "contra" => ["nome" => "-", "foto" => "/frontend/image/usuario_generico.png"],
            "geral" => ["nome" => "-", "foto" => "/frontend/image/usuario_generico.png"]
        ],
        "notas" => ["debate" => 0, "tecnica" => 0, "argumento" => 0],
        "vencedor" => "-",
        "fotoVencedor" => "/frontend/image/usuario_generico.png"
    ]);
    exit;
}

$sum = ["debate" => 0, "tecnica" => 0, "argumento" => 0];
$votosAFavor = $votosContra = $votosGerais = $posicoes = [];

foreach ($votos as $v) {
    $sum["debate"] += $v["debateNota"];
    $sum["tecnica"] += $v["tecnicoNota"];
    $sum["argumento"] += $v["argumentoNota"];

    $votosAFavor[$v["alunoFavor"]] = ($votosAFavor[$v["alunoFavor"]] ?? 0) + 1;
    $votosContra[$v["alunoContra"]] = ($votosContra[$v["alunoContra"]] ?? 0) + 1;
    $votosGerais[$v["alunoGeral"]] = ($votosGerais[$v["alunoGeral"]] ?? 0) + 1;

    $posicao = strtoupper(trim($v["posicaoFinal"]));
    $posicoes[$posicao] = ($posicoes[$posicao] ?? 0) + 1;
}

$qtd = count($votos);
$medias = [
    "debate" => number_format($sum["debate"] / $qtd, 2),
    "tecnica" => number_format($sum["tecnica"] / $qtd, 2),
    "argumento" => number_format($sum["argumento"] / $qtd, 2)
];

function destaque($votos) {
    if (empty($votos)) return "-";
    arsort($votos);
    return array_key_first($votos);
}

function foto($nome) {
    if (!$nome || $nome === "-") return "/frontend/image/usuario_generico.png";
    $arquivo = strtolower(str_replace(" ", "_", $nome)) . ".JPG";
    return "/frontend/image/" . $arquivo;
}

$aFavor = ["nome" => destaque($votosAFavor), "foto" => foto(destaque($votosAFavor))];
$contra = ["nome" => destaque($votosContra), "foto" => foto(destaque($votosContra))];
$geral = ["nome" => destaque($votosGerais), "foto" => foto(destaque($votosGerais))];

$vencedor = "-";
$fotoVencedor = "";
$defesa = $posicoes["DEFESA"] ?? 0;
$acusacao = $posicoes["ACUSACAO"] ?? 0;

if ($defesa > $acusacao) {
    $vencedor = "DEFESA";
    $fotoVencedor = "/frontend/image/icone_corrente.png";
} elseif ($acusacao > $defesa) {
    $vencedor = "ACUSACAO";
    $fotoVencedor = "/frontend/image/icone_sirene.png";
}

echo json_encode([
    "destaques" => [
        "aFavor" => $aFavor,
        "contra" => $contra,
        "geral" => $geral
    ],
    "notas" => $medias,
    "vencedor" => $vencedor,
    "fotoVencedor" => $fotoVencedor
], JSON_UNESCAPED_UNICODE);
