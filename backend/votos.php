<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$db = new PDO("sqlite:votacoes.db");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$votos = $db->query("SELECT * FROM votos ORDER BY dataVoto DESC")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($votos);