<?php
// Define o cabeçalho para permitir requisições de origens diferentes (CORS)
// Isso é crucial para que seu app React Native consiga se comunicar com o backend
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permite métodos POST e OPTIONS
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Inclui o arquivo de conexão com o banco de dados
include_once('conexao.php');

// Verifica se a requisição é um método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lê o conteúdo RAW da requisição (espera JSON)
    $data = json_decode(file_get_contents("php://input"));

    // Verifica se o ID foi recebido e se é um número
    // Usamos 'isset' para verificar se a propriedade 'id' existe no objeto decodificado
    // E 'is_numeric' para garantir que é um valor numérico antes de usar na query
    if (isset($data->id) && is_numeric($data->id)) {
        $id = $data->id;

        try {
            // Prepara a declaração SQL para evitar SQL Injection
            // O '?' é um placeholder para o valor que será vinculado posteriormente
            $stmt = $pdo->prepare("DELETE FROM produtos WHERE IdPro = ?");

            // Vincula o parâmetro ID à declaração preparada
            // 'i' indica que o parâmetro é um inteiro. Se fosse string, seria 's'.
            $stmt->bindParam(1, $id, PDO::PARAM_INT);

            // Executa a declaração
            $success = $stmt->execute();

            // Verifica se a exclusão foi bem-sucedida
            if ($success) {
                // Verifica se alguma linha foi afetada para confirmar a exclusão
                if ($stmt->rowCount() > 0) {
                    echo json_encode(array('sucesso' => true, 'mensagem' => 'Produto excluído com sucesso!'));
                } else {
                    echo json_encode(array('sucesso' => false, 'mensagem' => 'Produto não encontrado ou já excluído.'));
                }
            } else {
                // Se a execução da query falhou (erro no banco, etc.)
                echo json_encode(array('sucesso' => false, 'mensagem' => 'Erro ao executar a exclusão no banco de dados.'));
                // Opcional: Para depuração, você pode logar $stmt->errorInfo();
            }
        } catch (PDOException $e) {
            // Captura exceções PDO (erros de conexão, erros SQL, etc.)
            error_log("Erro PDO na exclusão: " . $e->getMessage()); // Loga o erro para depuração
            echo json_encode(array('sucesso' => false, 'mensagem' => 'Erro interno do servidor ao tentar excluir o produto.'));
        }
    } else {
        // Retorna erro se o ID não foi fornecido ou é inválido
        echo json_encode(array('sucesso' => false, 'mensagem' => 'ID do produto inválido ou não fornecido.'));
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
