<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "cors.php";

date_default_timezone_set("America/Sao_Paulo");

$usuario = "root";
$senha = "";
$host = "localhost";
$banco = "feiraamao";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$banco;charset=utf8", $usuario, $senha, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    echo json_encode(["erro" => true, "mensagem" => "Erro ao conectar com o banco: " . $e->getMessage()]);
    exit();
}

$dados = json_decode(file_get_contents("php://input"), true);



$nome = $dados["NomeCli"] ?? "";
$telefone = $dados["Telefone"] ?? "";
$datanasc = $dados["datanasc"] ?? "";
$email = $dados["Email"] ?? "";
$cpf = $dados["CPF"] ?? "";
$senha = $dados["Senha"] ?? "";

if ($nome == "" || $telefone == "" || $datanasc == "" || $email == "" || $cpf == "" || $senha == "") {
    echo json_encode(["erro" => true, "mensagem" => "Preencha todos os campos obrigatórios."]);
    exit();
}

$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

try {
    $res = $pdo->prepare("INSERT INTO clientes (NomeCli, Telefone, datanasc, Email, CPF, Senha) VALUES (:nome, :telefone, :datanasc, :email, :cpf, :senha)");
    $res->bindValue(":nome", $nome);
    $res->bindValue(":telefone", $telefone);
    $res->bindValue(":datanasc", $datanasc);
    $res->bindValue(":email", $email);
    $res->bindValue(":cpf", $cpf);
    $res->bindValue(":senha", $senhaHash);

    if ($res->execute()) {
        echo json_encode(["sucesso" => true, "mensagem" => "Cadastro realizado com sucesso!"]);
    } else {
        $erro = $res->errorInfo();
        echo json_encode(["erro" => true, "mensagem" => "Erro ao salvar", "detalhe" => $erro]);
    }
} catch (Exception $e) {
    echo json_encode(["erro" => true, "mensagem" => "Erro ao cadastrar: " . $e->getMessage()]);
}
