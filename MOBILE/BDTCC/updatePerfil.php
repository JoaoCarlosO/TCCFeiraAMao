<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // resposta para preflight
}
header('Content-Type: application/json; charset=utf-8');

require_once 'conexao.php';
require_once "cors.php";

try {
    // === DEPURACAO INICIAL ===
    $debugData = [
        'post' => $_POST,
        'files' => $_FILES,
        'ImagemNome' => null,
        'sql' => null,
        'params' => null,
        'affectedRows' => 0
    ];

    // dados básicos
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0; 
    $NomeCli = trim($_POST['NomeCli'] ?? '');
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

    // buscar senha atual (hash) e nome do arquivo antigo da Imagem
    $stmt = $pdo->prepare("SELECT senha, Imagem FROM clientes WHERE idCli = ?");
    $stmt->execute([$id]); 
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado', 'debug' => $debugData]);
        exit;
    }

    $storedHash = $user['senha'];
    $senhaValida = false;

    if (password_verify($senha, $storedHash)) {
        $senhaValida = true;
    } elseif ($senha === $storedHash) {
        $senhaValida = true;
    }

    if (!$senhaValida) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Senha atual incorreta', 'debug' => $debugData]);
        exit;
    }

    $ImagemNome = null;
    if (!empty($_FILES['Imagem']['name']) && $_FILES['Imagem']['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['Imagem']['tmp_name'];
        $fileSize = $_FILES['Imagem']['size'];

        if ($fileSize > 5 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Arquivo muito grande. Máx 5MB', 'debug' => $debugData]);
            exit;
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $tmpName);
        finfo_close($finfo);

        $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
        if (!array_key_exists($mime, $allowed)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Tfo de arquivo não permitido', 'debug' => $debugData]);
            exit;
        }

        $ext = $allowed[$mime];
        $uploadDir = __DIR__ . '/uploads/imagens/';
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erro ao criar o diretório de upload. Verifique as permissões.', 'debug' => $debugData]);
                exit;
            }
        }

        $ImagemNome = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $dest = $uploadDir . $ImagemNome;
        $debugData['ImagemNome'] = $ImagemNome;

        if (!move_uploaded_file($tmpName, $dest)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao salvar a imagem. Verifique as permissões da pasta.', 'debug' => $debugData]);
            exit;
        }

        if (!empty($user['Imagem'])) {
            $old = $uploadDir . $user['Imagem'];
            if (file_exists($old)) @unlink($old);
        }
    }

    $fields = [];
    $params = [];

    if ($NomeCli !== '') { $fields[] = 'NomeCli = ?'; $params[] = $NomeCli; }
    if ($email !== '') { $fields[] = 'email = ?'; $params[] = $email; }
    if ($telefone !== '') { $fields[] = 'telefone = ?'; $params[] = $telefone; }
    if ($cpf !== '') { $fields[] = 'cpf = ?'; $params[] = $cpf; }
    if ($datanasc !== '') { $fields[] = 'datanasc = ?'; $params[] = $datanasc; }
    if ($ImagemNome) { $fields[] = 'Imagem = ?'; $params[] = $ImagemNome; }
    if (!empty($novaSenha)) { $fields[] = 'senha = ?'; $params[] = password_hash($novaSenha, PASSWORD_DEFAULT); }

    if (count($fields) === 0) {
        echo json_encode(['success' => false, 'message' => 'Nada para atualizar', 'debug' => $debugData]);
        exit;
    }

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
            'message' => 'Erro ao atualizar usuário',
            'debug' => $debugData
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor: ' . $e->getMessage(), 'debug' => ['exception' => $e->getMessage()]]);
}
?>
