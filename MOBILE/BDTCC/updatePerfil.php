<?php
// Configurações de CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}
header('Content-Type: application/json; charset=utf-8');

// Certifique-se de que 'conexao.php' estabelece a conexão PDO na variável $pdo
require_once 'conexao.php';
// Se você tem um arquivo 'cors.php', inclua-o também:
// require_once "cors.php"; 

try {
    $debugData = [
        'post' => $_POST,
        'files' => $_FILES,
        'ImagemURL' => null,
        'UploadStatus' => 'Nenhuma imagem enviada',
        'sql' => null,
        'params' => null,
        'affectedRows' => 0
    ];

    // === 1. COLETA E VALIDAÇÃO DE DADOS BÁSICOS ===
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $NomeCli = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefone = trim($_POST['telefone'] ?? '');
    $cpf = trim($_POST['cpf'] ?? '');
    $datanasc = trim($_POST['datanasc'] ?? '');
    $senha = $_POST['senha'] ?? '';
    $novaSenha = $_POST['novaSenha'] ?? '';

    if ($id <= 0 || empty($senha)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID e senha atual são obrigatórios', 'debug' => $debugData]);
        exit;
    }

    // === 2. VERIFICAÇÃO DA SENHA ATUAL ===
    $stmt = $pdo->prepare("SELECT senha, Imagem FROM clientes WHERE idCli = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado', 'debug' => $debugData]);
        exit;
    }

    $storedHash = $user['senha'];
    $senhaValida = password_verify($senha, $storedHash) || ($senha === $storedHash);

    if (!$senhaValida) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Senha atual incorreta', 'debug' => $debugData]);
        exit;
    }

    // === 3. LÓGICA DE UPLOAD DA IMAGEM (FOCO NA CORREÇÃO) ===
    $ImagemURL = $user['Imagem']; // Mantém a URL da imagem atual

    if (isset($_FILES['Imagem'])) {

        // Trata erros de upload de PHP (tamanho, formulário, etc.)
        if ($_FILES['Imagem']['error'] !== UPLOAD_ERR_OK && $_FILES['Imagem']['error'] !== UPLOAD_ERR_NO_FILE) {
            $debugData['UploadStatus'] = 'Erro de upload PHP: Código ' . $_FILES['Imagem']['error'];

            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro no envio da imagem. Código: ' . $_FILES['Imagem']['error'] . '. (Verifique o tamanho do arquivo no php.ini)',
                'debug' => $debugData
            ]);
            exit;
        }

        // Se o arquivo foi enviado corretamente (UPLOAD_ERR_OK)
        if ($_FILES['Imagem']['error'] === UPLOAD_ERR_OK) {

            $photo_name = $_FILES["Imagem"]["name"];
            $photo_tmp_name = $_FILES["Imagem"]["tmp_name"];

            // Cria um nome de arquivo único e seguro
            $file_extension = pathinfo($photo_name, PATHINFO_EXTENSION);
            $random_name = uniqid() . '-' . time() . '.' . $file_extension;
            $safe_name = preg_replace('/\s+/', '-', $random_name);

            // Caminho absoluto no servidor (Windows/XAMPP)
            $upload_dir = __DIR__ . "/uploads/imagens/";
            $destination_path = $upload_dir . $safe_name;

            // URL pública para acessar a imagem
            $base_url = "http://10.239.0.165/BDTCC/uploads/imagens/";
            $ImagemURL = $base_url . $safe_name;

            // MOVE O ARQUIVO: A falha aqui é quase sempre PERMISSÃO/DIRETÓRIO
            if (!move_uploaded_file($photo_tmp_name, $destination_path)) {
                $debugData['UploadStatus'] = 'Falha ao mover arquivo. Verifique as permissões da pasta.';

                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Falha ao salvar a imagem no servidor. A pasta "img/" precisa existir e ter permissão de escrita (777).',
                    'debug' => $debugData
                ]);
                exit; // ABORTA A EXECUÇÃO E RETORNA ERRO CLARO
            }
            $debugData['UploadStatus'] = 'Upload bem-sucedido. Novo URL: ' . $ImagemURL;
        }
    }

    // === 4. CONSTRUÇÃO DA QUERY DE UPDATE ===
    $fields = [];
    $params = [];

    if ($NomeCli !== '') {
        $fields[] = 'NomeCli = ?';
        $params[] = $NomeCli;
    }
    if ($email !== '') {
        $fields[] = 'email = ?';
        $params[] = $email;
    }
    if ($telefone !== '') {
        $fields[] = 'telefone = ?';
        $params[] = $telefone;
    }
    if ($cpf !== '') {
        $fields[] = 'cpf = ?';
        $params[] = $cpf;
    }
    if ($datanasc !== '') {
        $fields[] = 'datanasc = ?';
        $params[] = $datanasc;
    }

    // Adiciona o novo URL se ele mudou (ou seja, se o upload foi bem-sucedido)
    if ($ImagemURL !== $user['Imagem']) {
        $fields[] = 'Imagem = ?';
        $params[] = $ImagemURL;
    }

    if (!empty($novaSenha)) {
        $fields[] = 'senha = ?';
        $params[] = password_hash($novaSenha, PASSWORD_DEFAULT);
    }

    if (count($fields) === 0) {
        echo json_encode(['success' => false, 'message' => 'Nada para atualizar', 'debug' => $debugData]);
        exit;
    }

    // Execução da Query
    $params[] = $id;
    $sql = 'UPDATE clientes SET ' . implode(', ', $fields) . ' WHERE idCli = ?';
    $debugData['sql'] = $sql;
    $debugData['params'] = $params;

    $stmt = $pdo->prepare($sql);

    if ($stmt->execute($params)) {
        $debugData['affectedRows'] = $stmt->rowCount();

        echo json_encode([
            'success' => true,
            'message' => 'Perfil atualizado com sucesso!',
            'debug' => $debugData
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar usuário no banco de dados',
            'debug' => $debugData
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor: ' . $e->getMessage(), 'debug' => ['exception' => $e->getMessage()]]);
}
?>