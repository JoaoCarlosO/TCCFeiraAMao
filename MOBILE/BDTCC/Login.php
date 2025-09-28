<?php
header('Access-Control-Allow-Origin: http://localhost:8081'); // ou seu IP específico se quiser restringir
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once('conexao.php');

$dados = json_decode(file_get_contents("php://input"), true);

$usuario = $dados['usuario'] ?? '';
$senha = $dados['senha'] ?? '';

if ($usuario == '' || $senha == '') {
    echo json_encode(['erro' => true, 'mensagem' => 'Preencha todos os campos obrigatórios.']);
    exit();
}

$sql = $pdo->prepare("SELECT * FROM clientes WHERE Email = :usuario OR CPF = :usuario");
$sql->bindParam(':usuario', $usuario);
$sql->execute();

if ($sql->rowCount() == 0) {
    echo json_encode(['erro' => true, 'mensagem' => 'Usuário não encontrado.']);
    exit();
}

$cliente = $sql->fetch(PDO::FETCH_ASSOC);

if (password_verify($senha, $cliente['Senha'])) {
    echo json_encode([
        'erro' => false,
        'mensagem' => 'Login efetuado com sucesso!',
        'IdCli' => $cliente['IdCli'] // CORREÇÃO: retorna o ID do cliente
    ]);
} else {
    echo json_encode(['erro' => true, 'mensagem' => 'Senha incorreta.']);
}
?>