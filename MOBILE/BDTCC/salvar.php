<?php
// Define os cabeçalhos para permitir requisições de outras origens (CORS)
header("Access-Control-Allow-Origin: http://localhost:8081");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Se for uma requisição OPTIONS (pré-voo do CORS), apenas envia os cabeçalhos e sai.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Inclui o arquivo de conexão com o banco de dados (certifique-se de que este caminho está correto)
require_once 'conexao.php'; // Altere para o caminho real do seu arquivo de conexão

$response = [
    'sucesso' => false,
    'mensagem' => 'Ocorreu um erro desconhecido.',
    'imagem_url' => null // Adiciona um campo para a URL da imagem salva
];

try {
    // Inicia uma transação para garantir a integridade dos dados
    $pdo->beginTransaction();

    $nome = $_POST['nome'] ?? '';
    $preco = $_POST['preco'] ?? '';
    $quantidade = $_POST['quantidade'] ?? '';
    $categoria = $_POST['categoria'] ?? ''; // Mapeia 'descricao' do app para 'categoria' no PHP
    $id_vendedor = $_POST['id_vendedor'] ?? '1'; // Valor padrão '1' se não for enviado
    $estoque = $_POST['estoque'] ?? '';

    // Validação básica dos campos obrigatórios (a imagem não é mais obrigatória aqui)
    if (empty($nome) || empty($preco) || empty($quantidade) || empty($categoria) || empty($estoque)) {
        throw new Exception("Por favor, preencha todos os campos obrigatórios (exceto a imagem, que é opcional).");
    }

    // Validação e processamento da imagem
    $imagem_path = null; // Inicializa o caminho da imagem como nulo
    $diretorio_destino = 'uploads/imagens/'; // Diretório onde as imagens serão salvas

    // Verifica se o diretório de destino existe, senão, tenta criá-lo
    if (!is_dir($diretorio_destino)) {
        // O 0755 é uma permissão comum para diretórios, pode variar dependendo do seu servidor
        if (!mkdir($diretorio_destino, 0755, true)) {
            throw new Exception("Erro: Não foi possível criar o diretório de uploads. Verifique as permissões.");
        }
    }

    // --- Início da seção de tratamento de upload de imagem mais detalhada (agora opcional) ---
    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
        $arquivo_tmp = $_FILES['imagem']['tmp_name'];
        $nome_original = basename($_FILES['imagem']['name']);
        $tipo_arquivo = strtolower(pathinfo($nome_original, PATHINFO_EXTENSION));

        // Gera um nome único para o arquivo para evitar conflitos
        $nome_novo_arquivo = uniqid('prod_') . '.' . $tipo_arquivo;
        $caminho_completo_imagem = $diretorio_destino . $nome_novo_arquivo;

        // Move o arquivo temporário para o diretório de destino permanente
        if (move_uploaded_file($arquivo_tmp, $caminho_completo_imagem)) {
            $imagem_path = $caminho_completo_imagem; // Imagem salva, armazena o caminho
        } else {
            throw new Exception("Erro: Não foi possível mover a imagem para o diretório final. Verifique as permissões de escrita em '{$diretorio_destino}'.");
        }
    } else if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] !== UPLOAD_ERR_NO_FILE) {
        // Houve um erro no upload (diferente de "nenhum arquivo enviado")
        throw new Exception("Erro no upload da imagem: Código " . $_FILES['imagem']['error'] . ". Verifique o tamanho do arquivo.");
    } else if (isset($_POST['imagem_url_existente'])) {
        // Se for edição e a imagem existente não foi alterada, usa a URL existente.
        $imagem_path = $_POST['imagem_url_existente'];
    }
    // Não lançamos mais um erro se nenhuma imagem for selecionada no caso de adição,
    // pois agora a imagem é opcional. $imagem_path permanecerá null neste caso.
    // --- Fim da seção de tratamento de upload de imagem ---


    // Converte preço e quantidade para tipos numéricos apropriados
    $preco_float = (float) str_replace(',', '.', $preco); // Garante ponto para float
    $quantidade_int = (int) $quantidade;
    $estoque_int = (int) $estoque;

    // Prepara a query SQL para inserção
    // Certifique-se de que 'Cat' e 'ImagemURL' são os nomes corretos das suas colunas no DB
    $stmt = $pdo->prepare(
        "INSERT INTO produtos (Nome, Preco, Quant, Cat, IdVend, Estoque, ImagemURL)
         VALUES (:nome, :preco, :quantidade, :categoria, :id_vendedor, :estoque, :imagem_url)"
    );

    // Binde os parâmetros
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':preco', $preco_float);
    $stmt->bindParam(':quantidade', $quantidade_int);
    $stmt->bindParam(':categoria', $categoria);
    $stmt->bindParam(':id_vendedor', $id_vendedor);
    $stmt->bindParam(':estoque', $estoque_int);
    $stmt->bindParam(':imagem_url', $imagem_path); // Salva o caminho da imagem (pode ser NULL)

    // Executa a query
    if ($stmt->execute()) {
        $response['sucesso'] = true;
        $response['mensagem'] = "Produto salvo com sucesso!";
        $response['imagem_url'] = $imagem_path; // Retorna o caminho da imagem salva
        $pdo->commit(); // Confirma a transação
    } else {
        throw new Exception("Erro ao inserir o produto no banco de dados.");
    }

} catch (Exception $e) {
    // Em caso de erro, desfaz a transação
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    $response['mensagem'] = "Erro: " . $e->getMessage();
    error_log("Erro em salvar.php: " . $e->getMessage()); // Para logs do servidor
} finally {
    // Fecha a conexão com o banco de dados se necessário (depende de como 'conexao.php' lida com isso)
    $pdo = null;
    echo json_encode($response); // Sempre retorna uma resposta JSON
}
?>
