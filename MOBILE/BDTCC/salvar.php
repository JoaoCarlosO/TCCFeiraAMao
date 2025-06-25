<?php
// Define os cabeçalhos para permitir requisições de outras origens (CORS)
header("Access-Control-Allow-Origin: http://localhost:8081"); // AJUSTE ESTA URL SE NECESSÁRIO
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

require_once("conexao.php");

// Configura o PHP para exibir e logar erros, útil para depuração
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Define o nome da pasta de uploads
$nomePasta = 'uploads/';

// Tenta criar a pasta se não existir
if (!file_exists($nomePasta)) {
    if (!mkdir($nomePasta, 0777, true)) {
        error_log("Erro: Falha ao criar o diretório de uploads: " . $nomePasta);
        echo json_encode([
            'mensagem' => 'Erro interno do servidor: Falha ao preparar o diretório de imagens.',
            'sucesso' => false
        ]);
        exit();
    }
}

// Obtém os dados do produto
$nome = $_POST['nome'] ?? '';
$preco = $_POST['preco'] ?? '';
$quant = $_POST['quantidade'] ?? '';
$cat = $_POST['categoria'] ?? '';
$idvend = $_POST['id_vendedor'] ?? '';
$estoque = $quant;

$caminhoImagem = ''; // Inicializa a variável para o caminho da imagem no banco

// --- DEBUGGING DA IMAGEM ---
error_log("Recebido POST: " . print_r($_POST, true)); // Loga todos os dados POST
error_log("Recebido FILES: " . print_r($_FILES, true)); // Loga todos os dados FILES

// Verifica se um arquivo de imagem foi enviado e se não houve erros de upload
if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['imagem']['tmp_name'];
    $fileName = $_FILES['imagem']['name'];
    $fileSize = $_FILES['imagem']['size'];
    $fileType = $_FILES['imagem']['type'];
    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    $nomeImagemUnico = uniqid() . '.' . $ext;
    $caminhoCompletoImagem = $nomePasta . $nomeImagemUnico;

    error_log("Tentando mover arquivo: " . $fileTmpPath . " para " . $caminhoCompletoImagem);

    // Tenta mover o arquivo temporário para o destino final
    if (move_uploaded_file($fileTmpPath, $caminhoCompletoImagem)) {
        $caminhoImagem = $caminhoCompletoImagem;
        error_log("Imagem movida com sucesso. Caminho salvo: " . $caminhoImagem);
    } else {
        // Se houver falha ao mover, registra o erro e envia resposta de falha
        $phpFileUploadErrors = array(
            UPLOAD_ERR_INI_SIZE => 'O arquivo enviado excede o limite definido na diretiva upload_max_filesize do php.ini.',
            UPLOAD_ERR_FORM_SIZE => 'O arquivo enviado excede o limite definido na diretiva MAX_FILE_SIZE do formulário HTML.',
            UPLOAD_ERR_PARTIAL => 'O upload do arquivo foi feito apenas parcialmente.',
            UPLOAD_ERR_NO_FILE => 'Nenhum arquivo foi enviado.',
            UPLOAD_ERR_NO_TMP_DIR => 'Faltando uma pasta temporária.',
            UPLOAD_ERR_CANT_WRITE => 'Falha ao escrever o arquivo em disco.',
            UPLOAD_ERR_EXTENSION => 'Uma extensão do PHP interrompeu o upload do arquivo.'
        );
        $errorMessage = $phpFileUploadErrors[$_FILES['imagem']['error']] ?? 'Erro desconhecido ao mover o arquivo.';
        error_log("Erro ao mover imagem: " . $errorMessage . " (Código: " . $_FILES['imagem']['error'] . ")");
        echo json_encode([
            'mensagem' => 'Erro ao salvar a imagem do produto no servidor: ' . $errorMessage,
            'sucesso' => false
        ]);
        exit();
    }
} else if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] !== UPLOAD_ERR_NO_FILE) {
    // Trata erros de upload que não sejam "nenhum arquivo enviado"
    $phpFileUploadErrors = array(
        UPLOAD_ERR_INI_SIZE => 'O arquivo enviado excede o limite definido na diretiva upload_max_filesize do php.ini.',
        UPLOAD_ERR_FORM_SIZE => 'O arquivo enviado excede o limite definido na diretiva MAX_FILE_SIZE do formulário HTML.',
        UPLOAD_ERR_PARTIAL => 'O upload do arquivo foi feito apenas parcialmente.',
        UPLOAD_ERR_NO_TMP_DIR => 'Faltando uma pasta temporária.',
        UPLOAD_ERR_CANT_WRITE => 'Falha ao escrever o arquivo em disco.',
        UPLOAD_ERR_EXTENSION => 'Uma extensão do PHP interrompeu o upload do arquivo.'
    );
    $errorMessage = $phpFileUploadErrors[$_FILES['imagem']['error']] ?? 'Erro desconhecido durante o upload do arquivo.';
    error_log("Erro no upload da imagem antes de mover: " . $errorMessage . " (Código: " . $_FILES['imagem']['error'] . ")");
    echo json_encode([
        'mensagem' => 'Erro no upload da imagem: ' . $errorMessage,
        'sucesso' => false
    ]);
    exit();
} else {
    error_log("Nenhuma imagem foi enviada ou UPLOAD_ERR_NO_FILE ocorreu.");
    // Se não houver imagem ou se UPLOAD_ERR_NO_FILE, $caminhoImagem permanece vazio, o que é OK se a imagem for opcional.
    // Se a imagem for obrigatória, esta parte precisaria retornar um erro.
}


// Inserção dos dados no banco de dados
$sql = "INSERT INTO produtos (Nome, Preco, Quant, Cat, Estoque, IdVend, Imagem) 
        VALUES (:nome, :preco, :quant, :cat, :estoque, :idvend, :imagem)";
$stmt = $pdo->prepare($sql);

$stmt->bindValue(":nome", $nome);
$stmt->bindValue(":preco", $preco);
$stmt->bindValue(":quant", $quant);
$stmt->bindValue(":cat", $cat);
$stmt->bindValue(":estoque", $estoque);
$stmt->bindValue(":idvend", $idvend);
$stmt->bindValue(":imagem", $caminhoImagem); // Vincula o caminho da imagem (pode ser vazio)

error_log("SQL Executando. Caminho da Imagem para DB: " . $caminhoImagem);

if ($stmt->execute()) {
    error_log("Produto cadastrado com sucesso. ID: " . $pdo->lastInsertId());
    echo json_encode([
        'mensagem' => 'Produto cadastrado com sucesso!',
        'sucesso' => true,
        'idProduto' => $pdo->lastInsertId()
    ]);
} else {
    $errorInfo = $stmt->errorInfo();
    error_log("Erro ao cadastrar produto no banco de dados: " . implode(" - ", $errorInfo));
    echo json_encode([
        'mensagem' => 'Erro ao cadastrar o produto no banco de dados: ' . $errorInfo[2],
        'sucesso' => false
    ]);
}
?>
