<?php
// Define o cabeçalho para permitir requisições de outras origens (CORS)
// Isso é crucial para que seu aplicativo React Native possa se comunicar com este script.
// Substitua 'http://localhost:8081' pela origem exata do seu frontend em desenvolvimento.
// Se estiver usando Expo Go no celular, use o IP da sua máquina local seguido da porta do Expo.
// Para fins de desenvolvimento, '*' pode ser usado, mas NÃO É SEGURO para produção.
header("Access-Control-Allow-Origin: http://localhost:8081");
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Permite os métodos HTTP GET e OPTIONS
header("Access-Control-Allow-Headers: Content-Type"); // Permite o cabeçalho Content-Type

// Se a requisição for um OPTIONS (pré-voo CORS), apenas envia os cabeçalhos e sai.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// Inclui o arquivo de conexão com o banco de dados.
// Certifique-se de que 'conexao.php' está no mesmo diretório que este 'listar_produtos.php'.
require_once("conexao.php");

// Define que o tipo de conteúdo da resposta será JSON.
header('Content-Type: application/json');

try {
    // Prepara a query SQL para selecionar todos os produtos da tabela 'produtos'.
    // Ordena os produtos pelo IdPro em ordem decrescente para mostrar os mais recentes primeiro.
    $res = $pdo->query("SELECT IdPro, Nome, Preco, Quant, Cat, Estoque, Imagem FROM produtos ORDER BY IdPro DESC");
    
    // Pega todos os resultados da consulta como um array associativo.
    $produtos = $res->fetchAll(PDO::FETCH_ASSOC);

    // Itera sobre cada produto para formatar o preço e construir a URL completa da imagem.
    foreach ($produtos as &$produto) {
        // Formata o preço para o formato monetário R$ X.XX, usando vírgula como separador decimal.
        $produto['PrecoFormatado'] = "R$ " . number_format($produto['Preco'], 2, ',', '.');
        
        // Constrói a URL completa da imagem para o frontend.
        // Assumimos que a pasta 'uploads/' está dentro de 'BDTCC/' no seu servidor web (htdocs).
        // A base URL deve ser o endereço do seu servidor web onde 'BDTCC' está acessível.
        $baseURL = "http://localhost/BDTCC/"; // Altere para o IP do seu computador se estiver no emulador Android (ex: http://192.168.1.XX/BDTCC/)
        
        // Verifica se o caminho da imagem não está vazio antes de construir a URL.
        if (!empty($produto['Imagem'])) {
            $produto['ImagemURL'] = $baseURL . $produto['Imagem']; // Concatena a base URL com o caminho salvo no banco de dados.
        } else {
            // Se não houver imagem, pode definir uma URL de placeholder ou vazia.
            $produto['ImagemURL'] = ''; // Ou uma URL para uma imagem padrão.
        }
    }

    // Retorna os produtos (já formatados) em formato JSON para o frontend.
    echo json_encode([
        'sucesso' => true,
        'produtos' => $produtos
    ]);

} catch (PDOException $e) {
    // Em caso de erro na execução da query SQL ou conexão com o banco de dados.
    // Registra o erro no log do servidor para depuração.
    error_log("Erro ao listar produtos: " . $e->getMessage());
    
    // Retorna uma resposta JSON de erro para o frontend.
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao buscar produtos do banco de dados: ' . $e->getMessage()
    ]);
}
?>
