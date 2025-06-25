<?php
require_once('conexao.php'); // importa a conexão

// Recebe os dados enviados via POST (JSON)
$dados = json_decode(file_get_contents("php://input"), true);

// Pega os campos
$nome = $dados['nome'] ?? '';
$telefone = $dados['telefone'] ?? '';
$datanasc = $dados['datanasc'] ?? '';
$localBusca = $dados['localBusca'] ?? '';
$email = $dados['email'] ?? '';
$cpf = $dados['cpf'] ?? '';
$senha = $dados['senha'] ?? '';

// Validação simples
if ($nome == '' || $email == '' || $cpf == '' || $senha == '' || $datanasc == '') {
    echo json_encode(['erro' => true, 'mensagem' => 'Preencha todos os campos obrigatórios.']);
    exit();
}

// Verifica se já existe CPF ou email
$sql = $pdo->prepare("SELECT * FROM clientes WHERE Email = :email OR CPF = :cpf");
$sql->bindParam(':email', $email);
$sql->bindParam(':cpf', $cpf);
$sql->execute();

if ($sql->rowCount() > 0) {
    echo json_encode(['erro' => true, 'mensagem' => 'E-mail ou CPF já cadastrados.']);
    exit();
}

// Insere no banco
$stmt = $pdo->prepare("INSERT INTO clientes (NomeCli, Telefone, datanasc, LocalBusca, Email, CPF, Senha)
VALUES (:nome, :telefone, :datanasc, :localBusca, :email, :cpf, :senha)");

$stmt->bindParam(':nome', $nome);
$stmt->bindParam(':telefone', $telefone);
$stmt->bindParam(':datanasc', $datanasc);
$stmt->bindParam(':localBusca', $localBusca);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':cpf', $cpf);
$stmt->bindParam(':senha', $senha); // você pode criptografar depois com password_hash()

if ($stmt->execute()) {
    echo json_encode(['erro' => false, 'mensagem' => 'Cliente cadastrado com sucesso!']);
} else {
    echo json_encode(['erro' => true, 'mensagem' => 'Erro ao cadastrar cliente.']);
}
?>
