<?php
// Define os cabeçalhos para permitir requisições de outras origens (CORS)
header("Access-Control-Allow-Origin: *"); // Permite qualquer origem para teste
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Se for uma requisição OPTIONS (pré-voo do CORS), apenas envia os cabeçalhos e sai.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$response = [
    'success' => false,
    'message' => 'Ocorreu um erro desconhecido no servidor.',
    'post_data' => [],
    'files_data' => []
];

try {
    // Captura e armazena os dados POST
    $response['post_data'] = $_POST;

    // Captura e armazena os dados FILES (dos uploads)
    $response['files_data'] = $_FILES;

    // --- Início do processamento do ficheiro de imagem (simples, para teste) ---
    $image_path = null;
    $upload_dir = 'uploads/imagens/'; // Certifique-se de que esta pasta existe e tem permissões de escrita

    // Cria a pasta de upload se não existir
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            throw new Exception("Erro: Não foi possível criar o diretório de uploads. Verifique as permissões.");
        }
    }

    // Verifica se o ficheiro 'image_file' foi carregado e não tem erros
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $file_tmp_name = $_FILES['image_file']['tmp_name'];
        $file_name = basename($_FILES['image_file']['name']); // Usa o nome original ou pode gerar um único
        $target_file = $upload_dir . uniqid('test_') . '_' . $file_name; // Gera nome único para teste

        if (move_uploaded_file($file_tmp_name, $target_file)) {
            $response['success'] = true;
            $response['message'] = "Imagem recebida e movida com sucesso para: " . $target_file;
            $response['image_path'] = $target_file; // Retorna o caminho para o cliente
        } else {
            throw new Exception("Erro ao mover o ficheiro carregado. Verifique as permissões da pasta '{$upload_dir}'.");
        }
    } else if (isset($_FILES['image_file'])) {
        // Se houve um erro no upload, mas o ficheiro foi tentado (não é UPLOAD_ERR_NO_FILE)
        $error_code = $_FILES['image_file']['error'];
        $php_upload_errors = [
            UPLOAD_ERR_INI_SIZE   => "O ficheiro excede o 'upload_max_filesize' no php.ini.",
            UPLOAD_ERR_FORM_SIZE  => "O ficheiro excede o limite MAX_FILE_SIZE do formulário HTML (raro em RN).",
            UPLOAD_ERR_PARTIAL    => "O ficheiro foi enviado apenas parcialmente.",
            UPLOAD_ERR_NO_FILE    => "Nenhum ficheiro foi enviado.", // Este não deve acionar este branch
            UPLOAD_ERR_NO_TMP_DIR => "Diretório temporário em falta.",
            UPLOAD_ERR_CANT_WRITE => "Falha ao escrever o ficheiro em disco.",
            UPLOAD_ERR_EXTENSION  => "Uma extensão PHP interrompeu o upload."
        ];
        $error_message = $php_upload_errors[$error_code] ?? "Código de erro de upload desconhecido: " . $error_code;
        throw new Exception("Erro no upload do ficheiro: " . $error_message);
    } else {
        // Nenhuma imagem enviada via $_FILES (isto é ok, a imagem é opcional)
        $response['success'] = true; // Continua com sucesso se não houver upload de imagem
        $response['message'] = "Dados recebidos, mas nenhuma imagem foi enviada.";
    }

} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = "Erro no servidor: " . $e->getMessage();
    error_log("Erro em upload_test.php: " . $e->getMessage()); // Para logs do servidor
} finally {
    // Envia a resposta JSON de volta ao cliente
    echo json_encode($response);
}
?>
