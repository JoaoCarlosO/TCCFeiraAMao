<?php
// Ativa a exibição de erros para ajudar na depuração.
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

try {
    require_once 'conexao.php';
    require_once "cors.php";

    $IdCli = isset($_GET['IdCli']) ? intval($_GET['IdCli']) : 0;
    if ($IdCli <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID inválido.']);
        exit;
    }

    // Corrija os nomes das colunas aqui para corresponderem EXATAMENTE ao seu banco de dados.
    // Baseado em seu código React Native, os nomes abaixo são os esperados.
    $stmt = $pdo->prepare("SELECT IdCli, NomeCLi, Telefone, Email, CPF, datanasc, Imagem FROM clientes WHERE IdCli = ?");
    $stmt->execute([$IdCli]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Usuário não encontrado.']);
        exit;
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Garante que o caminho da imagem está correto.
    if (isset($user['Imagem']) && !empty($user['Imagem'])) {
        $user['Imagem'] = 'http://10.239.0.165/BDTCC/uploads/imagens/' . $user['Imagem'];
    } else {
        $user['Imagem'] = null;
    }

    echo json_encode($user);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro de banco de dados: ' . $e->getMessage()]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno do servidor: ' . $e->getMessage()]);
    exit;
}
?>