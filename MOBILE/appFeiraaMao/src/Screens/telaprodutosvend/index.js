import React, { useState, useEffect, useCallback } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    FlatList,
    Image,
    Dimensions,
    ActivityIndicator,
    Alert,
    Platform
} from "react-native";
// useFocusEffect é útil para recarregar dados quando a tela é focada
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");
// A função normalize parece não ser utilizada no estilo atual, mas mantida por segurança
const normalize = (size) => (screenWidth / 375) * size;

// Componente para renderizar cada card de produto
const CardMeuProduto = ({ item, navigation }) => (
    <View style={styles.card}>
        {/* Renderiza a imagem do produto. 
            item.ImagemURL virá do seu listar_produtos.php, contendo a URL completa da imagem.
        */}
        <Image 
            source={{ uri: item.ImagemURL }} 
            style={styles.imagem} 
            onError={() => console.log('Erro ao carregar imagem:', item.ImagemURL)}
        />
        <Text style={styles.nome}>{item.Nome}</Text> {/* Nome do produto do banco de dados */}
        <Text style={styles.preco}>{item.PrecoFormatado}</Text> {/* Preço formatado do PHP */}
        <Text style={styles.peso}>Quantidade: {item.Quant}</Text> {/* Quantidade do produto */}
        {/*
        <Text style={styles.peso}>Categoria: {item.Cat}</Text>
        */}
        <View style={styles.acoes}>
            <TouchableOpacity style={styles.botaoEditar}>
                <Text style={styles.textoBotao}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoExcluir}>
                <Text style={styles.textoBotao}>Excluir</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function telaprodutosvend() {
    const navigation = useNavigation();
    // Estado para armazenar os produtos carregados do backend
    const [produtos, setProdutos] = useState([]); 
    // Estado para controlar o carregamento dos dados
    const [isLoading, setIsLoading] = useState(true); 
    // Estado para armazenar mensagens de erro, se houver
    const [error, setError] = useState(null); 

    // Função para buscar os produtos do backend (listar_produtos.php)
    const fetchProdutos = useCallback(async () => {
        setIsLoading(true); // Inicia o carregamento
        setError(null); // Limpa erros anteriores
        try {
            // URL para o seu backend PHP que lista produtos
            // É CRUCIAL que este caminho corresponda ao local do seu listar_produtos.php no XAMPP: htdocs/BDTCC/listar_produtos.php
            const apiUrl = Platform.OS === 'android'
                ? 'http://10.0.2.2/BDTCC/listarProdutos.php' // Para emulador Android
                : 'http://localhost/BDTCC/listarProdutos.php'; // Para iOS Simulator, navegador (Expo Web)

            const response = await fetch(apiUrl);
            
            // Verifica se a resposta HTTP foi bem-sucedida (código 2xx)
            if (!response.ok) {
                const errorText = await response.text(); // Tenta ler o corpo da resposta para mais detalhes
                throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
            }

            const json = await response.json(); // Converte a resposta para JSON

            if (json.sucesso) {
                setProdutos(json.produtos); // Atualiza o estado com os produtos recebidos
            } else {
                // Se o backend PHP retornar 'sucesso: false'
                setError(json.mensagem || "Erro ao carregar produtos.");
                Alert.alert("Erro", json.mensagem || "Erro ao carregar produtos.");
            }
        } catch (err) {
            // Captura erros de rede ou de parsing JSON
            console.error("Erro ao buscar produtos:", err);
            setError("Erro de conexão: Não foi possível carregar os produtos.");
            Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor para carregar os produtos. Verifique sua rede e o endereço do servidor.");
        } finally {
            setIsLoading(false); // Finaliza o carregamento
        }
    }, []); // O array de dependências vazio significa que a função só é criada uma vez

    // Usa useFocusEffect para chamar fetchProdutos sempre que a tela entrar em foco
    // Isso garante que a lista de produtos seja atualizada após adicionar um novo.
    useFocusEffect(
        useCallback(() => {
            fetchProdutos(); // Busca os produtos quando a tela é focada
            return () => {
                // Opcional: função de limpeza, se necessário (ex: cancelar requisições pendentes)
            };
        }, [fetchProdutos]) // Dependência em fetchProdutos para garantir que o callback é o mais recente
    );

    // Renderiza um indicador de carregamento enquanto os produtos estão sendo buscados
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#425010" />
                <Text>Carregando produtos...</Text>
            </View>
        );
    }

    // Renderiza uma mensagem de erro se algo der errado ao carregar os produtos
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchProdutos}>
                    <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Meus Produtos</Text>
                <TouchableOpacity 
                    style={styles.botaoAdicionar}
                    onPress={() => navigation.navigate("AdProdutosVend")} // Navega para a tela de adicionar produtos
                >
                    <Text style={styles.textoBotaoAdicionar}>+ Adicionar</Text>
                </TouchableOpacity>
            </View>

            {/* Condição para verificar se há produtos para exibir */}
            {produtos.length > 0 ? (
                <FlatList
                    data={produtos} // Agora usando o estado 'produtos' carregado do backend
                    keyExtractor={(item) => item.IdPro.toString()} // Usa IdPro do banco como chave única
                    renderItem={({ item }) => <CardMeuProduto item={item} navigation={navigation} />}
                    numColumns={2} // Duas colunas para os cards
                    contentContainerStyle={styles.lista}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                // Mensagem e botão para quando não há produtos cadastrados
                <View style={styles.vazio}>
                    <Text style={styles.textoVazio}>Você ainda não tem produtos cadastrados</Text>
                    <TouchableOpacity 
                        style={styles.botaoAdicionarGrande}
                        onPress={() => navigation.navigate("AdProdutosVend")}
                    >
                        <Text style={styles.textoBotaoAdicionar}>Adicionar Produto</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

// Estilos do componente (mantidos como estavam)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFE7C5",
        padding: 15,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    lista: {
        paddingBottom: 20,
    },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        margin: 8,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        elevation: 3,
        maxWidth: "48%", // Ajuste para 2 colunas
    },
    imagem: {
        width: 80,
        height: 80,
        marginBottom: 10,
        resizeMode: 'contain', // Garante que a imagem se ajuste ao espaço
    },
    nome: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    preco: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2e8b57",
        marginBottom: 3,
    },
    peso: {
        fontSize: 14,
        color: "#666",
        marginBottom: 10,
    },
    acoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    botaoEditar: {
        backgroundColor: "#4a90e2",
        padding: 8,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    botaoExcluir: {
        backgroundColor: "#e74c3c",
        padding: 8,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    textoBotao: {
        color: "#fff",
        textAlign: "center",
        fontSize: 12,
    },
    botaoAdicionar: {
        backgroundColor: "#2e8b57",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    textoBotaoAdicionar: {
        color: "#fff",
        fontWeight: "bold",
    },
    vazio: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50, // Adicionado um pouco de margem superior
    },
    textoVazio: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
        textAlign: "center",
    },
    botaoAdicionarGrande: {
        backgroundColor: "#2e8b57",
        padding: 15,
        borderRadius: 10,
        width: "80%",
        alignItems: 'center', // Centraliza o texto do botão
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#EFE7C5",
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#EFE7C5",
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#425010',
        padding: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
