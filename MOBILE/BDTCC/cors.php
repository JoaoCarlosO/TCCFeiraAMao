<?php
$allowedOrigins = [
    "http://localhost:8081",     // Web localhost
    "http://10.0.2.2:8081",     // Emulador Android padrão
];

// Pega origem da requisição
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: http://localhost:8081"); // Default seguro
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400"); // Cache 1 dia
header("Content-Type: application/json; charset=utf-8");

// Responde rápido ao preflight e encerra
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}
