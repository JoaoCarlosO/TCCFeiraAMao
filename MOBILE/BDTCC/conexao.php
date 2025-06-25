<?php
$servidor = "localhost";
$usuario = "root";
$senha = "";
$dbname = "feiraamao"; // <- Corrigido aqui

try {
    $pdo = new PDO("mysql:host=$servidor;dbname=$dbname", $usuario, $senha);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["erro" => true, "mensagem" => "Erro na conexão: " . $e->getMessage()]);
    exit();
}
?>
