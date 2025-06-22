<?php
/**
 * Script PHP para cadastrar um novo vendedor no banco de dados 'feiraamao'.
 *
 * Este script:
 * 1. Define os cabeçalhos CORS para permitir requisições de qualquer origem.
 * 2. Habilita a exibição de erros do PHP para fins de depuração (REMOVA EM PRODUÇÃO!).
 * 3. Conecta-se ao banco de dados MySQL usando PDO.
 * 4. Recebe dados via POST (JSON ou FormData).
 * 5. Valida campos obrigatórios.
 * 6. Lida com o upload de um arquivo de documento.
 * 7. Hashing da senha para segurança.
 * 8. Insere os dados do vendedor no banco de dados.
 * 9. Retorna uma resposta em formato JSON (sucesso ou erro).
 */

// --- 1. Configurações de Depuração e Cabeçalhos ---
// ATENÇÃO: Essas configurações são para depuração.
// REMOVA ou COMENTE as três linhas abaixo quando seu site estiver em produção,
// pois elas podem expor informações sensíveis sobre seu servidor.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Define os cabeçalhos para permitir requisições de outras origens (CORS)
// e especifica que a resposta será em JSON.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Inicializa a resposta padrão como erro, caso algo falhe antes de ser sobrescrito.
$response = ['erro' => true, 'mensagem' => 'Erro desconhecido.'];

// --- 2. Conexão com o Banco de Dados ---
// ATENÇÃO: SUBSTITUA ESSAS CREDENCIAIS PELAS DO SEU BANCO DE DADOS!
$dbHost = 'localhost'; // Geralmente 'localhost'
$dbUser = 'root';      // Nome de usuário do seu banco de dados
$dbPass = '';          // Senha do seu banco de dados (geralmente vazia para XAMPP/WAMP padrão)
$dbName = 'feiraamao'; // Nome do banco de dados que você forneceu

try {
    // Tenta criar uma nova conexão PDO (PHP Data Objects) com o MySQL.
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8", $dbUser, $dbPass);
    // Define o modo de erro do PDO para lançar exceções em caso de erros SQL.
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Desativa a emulação de prepared statements para garantir que o MySQL prepare as queries.
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

} catch (PDOException $e) {
    // Se a conexão falhar, define a mensagem de erro e termina o script.
    $response['mensagem'] = 'Erro de conexão com o banco de dados: ' . $e->getMessage();
    echo json_encode($response);
    exit(); // Encerra o script para não prosseguir com a lógica se não houver DB.
}

// --- 3. Processamento da Requisição POST ---
try {
    // Verifica se o método da requisição HTTP é POST.
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método não permitido. Apenas requisições POST são aceitas.");
    }

    // Tenta decodificar o corpo da requisição como JSON.
    // Isso é comum para requisições 'fetch' que enviam 'JSON.stringify(data)'.
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Se a decodificação JSON falhar (retornar null) ou não for um array,
    // significa que os dados podem ter vindo via 'FormData' (multipart/form-data).
    // Nesse caso, usamos a superglobal $_POST.
    if ($input === null || !is_array($input)) {
        $input = $_POST;
    }

    // --- 4. Validação de Campos Obrigatórios ---
    // Os campos Nome, Email, CPFCNPJ e Senha são marcados como NOT NULL na sua tabela 'vendedor'.
    // O campo Telefone, embora não seja NOT NULL na DB, era obrigatório no seu código anterior.
    // Vamos mantê-lo como obrigatório aqui para consistência com o que você tinha.
    $required_fields = ['nome', 'email', 'cpfcnpj', 'senha', 'telefone'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Por favor, preencha o campo obrigatório: " . ucfirst($field) . ".");
        }
    }

    // --- 5. Hashing da Senha ---
    // É CRÍTICO NUNCA ARMAZENAR SENHAS EM TEXTO PURO NO BANCO DE DADOS.
    // password_hash() cria um hash seguro da senha.
    $senhaHash = password_hash($input['senha'], PASSWORD_DEFAULT);

    // --- 6. Processamento do Upload do Documento (Opcional) ---
    $documentoPath = null; // Inicializa o caminho do documento como nulo
    // Verifica se um arquivo foi enviado para o campo 'documento'.
    if (!empty($_FILES['documento'])) {
        $documento = $_FILES['documento'];
        
        // Verifica se houve algum erro no upload do arquivo.
        if ($documento['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'uploads/'; // Diretório onde os arquivos serão salvos.
                                      // CERTIFIQUE-SE DE CRIAR ESTA PASTA E DAR PERMISSÃO DE ESCRITA A ELA!
                                      // Ex: chmod 775 uploads/ no Linux/macOS
            
            // Garante que o diretório de upload existe.
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0775, true); // Cria o diretório recursivamente com permissões
            }

            // Gera um nome de arquivo único para evitar colisões e sobrescritas.
            $fileName = uniqid('doc_', true) . '_' . basename($documento['name']);
            $destination = $uploadDir . $fileName;

            // Tenta mover o arquivo temporário para o diretório de destino permanente.
            if (move_uploaded_file($documento['tmp_name'], $destination)) {
                $documentoPath = $destination; // Salva o caminho do arquivo no servidor.
            } else {
                // Se não conseguir mover, lança uma exceção.
                throw new Exception("Erro ao mover o arquivo de documento para o diretório de uploads.");
            }
        } else {
            // Lida com erros de upload (ex: arquivo muito grande, upload parcial).
            throw new Exception("Erro no upload do documento: " . $documento['error']);
        }
    }

    // --- 7. Inserção dos Dados no Banco de Dados ---
    // Prepara a consulta SQL para inserir um novo vendedor.
    // A interrogação (?) é um placeholder para os valores que serão passados depois (prepared statement).
    $sql = "INSERT INTO vendedor (Nome, Barraca, Email, CPFCNPJ, Telefone, Documento, Senha) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    // Obtém o valor do campo 'barraca', se existir. Se não, será null.
    $barraca = $input['barraca'] ?? null;

    // Executa a consulta, passando os valores para os placeholders.
    // A ordem dos valores deve corresponder à ordem dos placeholders na query.
    $stmt->execute([
        $input['nome'],
        $barraca, // Pode ser null se não for fornecido
        $input['email'],
        $input['cpfcnpj'],
        $input['telefone'],
        $documentoPath, // Será null se nenhum documento for enviado ou se houver erro no upload
        $senhaHash
    ]);

    // Verifica se a inserção foi bem-sucedida (se uma linha foi afetada).
    if ($stmt->rowCount() > 0) {
        $response = [
            'erro' => false,
            'mensagem' => 'Cadastro de vendedor realizado com sucesso!',
            'dados' => [
                'idVend' => $pdo->lastInsertId(), // Obtém o ID gerado para o novo vendedor
                'nome' => $input['nome'],
                'email' => $input['email'],
                'cpfcnpj' => $input['cpfcnpj'],
                'documento_path' => $documentoPath // Retorna o caminho do documento salvo
            ]
        ];
    } else {
        // Se nenhuma linha foi afetada, algo deu errado na inserção (mas sem lançar exceção).
        throw new Exception("Nenhuma linha afetada: Falha ao inserir vendedor no banco de dados.");
    }

} catch (Exception $e) {
    // Qualquer exceção lançada dentro do bloco 'try' será capturada aqui.
    // A mensagem de erro da exceção é usada para a resposta.
    $response['mensagem'] = 'Erro no processo de cadastro: ' . $e->getMessage();
    // Para depuração, você pode querer logar o erro completo:
    error_log('Erro no cadastrarvendedor.php: ' . $e->getMessage() . ' na linha ' . $e->getLine());
}

// --- 8. Envio da Resposta JSON ---
// Finalmente, codifica o array $response para JSON e o imprime, enviando-o para o cliente.
echo json_encode($response);
?>
