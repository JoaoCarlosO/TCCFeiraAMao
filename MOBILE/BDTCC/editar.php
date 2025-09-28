<?php
// Define o cabeçalho para permitir requisições de origens diferentes (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permite métodos POST e OPTIONS
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Inclui o arquivo de conexão com o banco de dados
include_once('conexao.php');

// Verifica se a requisição é um método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lê o conteúdo RAW da requisição e decodifica o JSON
    $postjson = json_decode(file_get_contents("php://input"), true);

    // Validação básica dos dados recebidos
    // Verifica se todos os campos necessários estão presentes e não vazios
    if (
        !isset($postjson['IdPro']) || !is_numeric($postjson['IdPro']) ||
        !isset($postjson['Nome']) || empty($postjson['Nome']) ||
        !isset($postjson['Preco']) || !is_numeric($postjson['Preco']) ||
        !isset($postjson['Quant']) || !is_numeric($postjson['Quant']) ||
        !isset($postjson['Cat']) || empty($postjson['Cat']) ||
        !isset($postjson['Estoque']) || !is_numeric($postjson['Estoque']) ||
        !isset($postjson['IdVend']) || !is_numeric($postjson['IdVend']) ||
        !isset($postjson['Imagem']) || empty($postjson['Imagem']) // Supondo que a imagem é uma URL
    ) {
        echo json_encode(array('sucesso' => false, 'mensagem' => 'Dados do produto incompletos ou inválidos.'));
        exit(); // Encerra a execução
    }

    // Atribui os valores das variáveis para facilitar a leitura e uso
    $idPro = $postjson['IdPro'];
    $nome = $postjson['Nome'];
    $preco = $postjson['Preco'];
    $quant = $postjson['Quant'];
    $cat = $postjson['Cat'];
    $estoque = $postjson['Estoque'];
    $idVend = $postjson['IdVend'];
    $imagemURL = $postjson['Imagem']; // Mudado de 'Imagem' para 'ImagemURL' para consistência

    try {
        // Prepara a declaração SQL para evitar SQL Injection
        // CORRIGIDO: Adicionada a vírgula faltante entre Quant e Cat
        // CORRIGIDO: Colocado ImagemURL no UPDATE para corresponder ao campo
        $query = $pdo->prepare("UPDATE produtos SET 
            Nome = :Nome, 
            Preco = :Preco, 
            Quant = :Quant, 
            Cat = :Cat, 
            Estoque = :Estoque, 
            IdVend = :IdVend, 
            Imagem = :Imagem 
            WHERE IdPro = :IdPro"
        );
        
        // Vincula os parâmetros aos placeholders
        $query->bindValue(":Nome", $nome);
        $query->bindValue(":Preco", $preco);
        $query->bindValue(":Quant", $quant);
        $query->bindValue(":Cat", $cat);
        $query->bindValue(":Estoque", $estoque);
        $query->bindValue(":IdVend", $idVend);
        $query->bindValue(":Imagem", $imagemURL); // Consistente com ImagemURL no React Native
        $query->bindValue(":IdPro", $idPro);

        // Executa a declaração
        $success = $query->execute();

        // Verifica se a atualização foi bem-sucedida
        if ($success) {
            // Verifica se alguma linha foi afetada para confirmar a atualização
            if ($query->rowCount() > 0) {
                echo json_encode(array('sucesso' => true, 'mensagem' => 'Produto atualizado com sucesso!'));
            } else {
                echo json_encode(array('sucesso' => false, 'mensagem' => 'Nenhuma alteração foi feita ou produto não encontrado.'));
            }
        } else {
            // Se a execução da query falhou
            echo json_encode(array('sucesso' => false, 'mensagem' => 'Erro ao executar a atualização no banco de dados.'));
        }
    } catch (PDOException $e) {
        // Captura exceções PDO (erros de conexão, erros SQL, etc.)
        error_log("Erro PDO na atualização: " . $e->getMessage()); // Loga o erro para depuração
        echo json_encode(array('sucesso' => false, 'mensagem' => 'Erro interno do servidor ao tentar atualizar o produto.'));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Responde a requisições OPTIONS (preflight CORS)
    http_response_code(200);
    exit();
} else {
    // Retorna erro para métodos de requisição não permitidos
    http_response_code(405); // Método Não Permitido
    echo json_encode(array('sucesso' => false, 'mensagem' => 'Método de requisição não permitido. Use POST.'));
}
?>
