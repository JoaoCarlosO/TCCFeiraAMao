<?php
$allowedOrigins = [
  "http://localhost:8081",     // Web localhost
  "http://10.0.2.2:8081"      // Emulador Android padrão
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: http://localhost:8081");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400"); // Cache 1 dia
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}


date_default_timezone_set('America/Sao_Paulo');

$usuario = 'root';
$senha = '';
$host = 'localhost';
$banco = 'feiraamao';

try {
    $pdo = new PDO("mysql:dbname=$banco;host=$host", $usuario, $senha, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    echo json_encode(['erro' => true, 'mensagem' => 'Erro ao conectar com o banco: ' . $e->getMessage()]);
    exit();
}

