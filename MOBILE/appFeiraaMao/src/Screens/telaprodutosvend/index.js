import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// Componente CardMeuProduto
const CardMeuProduto = ({ item, navigation, handleEdit, handleDelete }) => (
  <View style={styles.card}>
    <Image
      source={item.imagem ? item.imagem : { uri: item.ImagemURL }}
      style={styles.imagem}
      onError={() => console.log('Erro ao carregar imagem:', item.ImagemURL)}
    />
    <View style={styles.cardContent}>
      <Text style={styles.nome} numberOfLines={1}>{item.Nome}</Text>
      <Text style={styles.preco}>{item.PrecoFormatado}</Text>
      <Text style={styles.peso}>Quantidade: {item.Quant}</Text>
      
      <View style={styles.acoes}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDelete(item.IdPro, item.Nome)}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// Dados mockados com imagens que correspondem aos produtos
const produtosMockados = [
  {
    IdPro: 1,
    Nome: "Bolo de roda",
     imagem: require("../../../assets/img/bolo.png"),
    Preco: 5.99,
    PrecoFormatado: "R$ 5,99/kg",
    Quant: 10,
    Descricao: "Bolo saboroso",
    Categoria: "Salgado"
  },
  {
    IdPro: 2,
    Nome: "Coruja",
    imagem: require("../../../assets/img/coruja.png"),
    Preco: 5.00,
    PrecoFormatado: "R$ 3,50/dúzia",
    Quant: 15,
    Descricao: "Corujas caseiras",
    Categoria: "Salgado"
  },
  {
    IdPro: 3,
    Nome: "Bala de Banana",
    imagem: require("../../../assets/img/bala-de-banana.png"),
    Preco: 7.80,
    PrecoFormatado: "R$ 9,80/caixa",
    Quant: 8,
    Descricao: " doces e suculentas",
    Categoria: "Guloseimas"
  },
  {
    IdPro: 4,
    Nome: "Pamonha",
     imagem: require("../../../assets/img/pamonha.png"),
    Preco: 2.99,
    PrecoFormatado: "R$ 5,99/un",
    Quant: 20,
    Descricao: "Deliciosas pamonhas doces",
    Categoria: "Doce"
  },
  {
    IdPro: 5,
    Nome: "Palmito",
  imagem: require("../../../assets/img/palmito.png"),
    Preco: 4.20,
    PrecoFormatado: "R$ 10,20/pote",
    Quant: 12,
    Descricao: "Palmito saborosíssimo",
    Categoria: "Conserva"
  },
  {
    IdPro: 6,
    Nome: "Makisushi",
    imagem: require("../../../assets/img/makisushi.png"),
    Preco: 9.90,
    PrecoFormatado: "R$ 12,90/caixa",
    Quant: 6,
    Descricao: "Morangos doces e suculentos",
    Categoria: "Frutas"
  }
];

// Componente principal
const Telaprodutosvend = () => {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usarMock, setUsarMock] = useState(__DEV__);

  const fetchProdutos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    if (usarMock) {
      setTimeout(() => {
        setProdutos(produtosMockados);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const apiUrl = Platform.OS === 'android'
        ? 'http://10.0.2.2/BDTCC/listarProdutos.php'
        : 'http://localhost/BDTCC/listarProdutos.php';

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
      }

      const json = await response.json();

      if (json.sucesso) {
        setProdutos(json.produtos);
      } else {
        setError(json.mensagem || "Erro ao carregar produtos.");
        Alert.alert("Erro", json.mensagem || "Erro ao carregar produtos.");
      }
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Erro de conexão: Não foi possível carregar os produtos.");
      setUsarMock(true);
      setProdutos(produtosMockados);
    } finally {
      setIsLoading(false);
    }
  }, [usarMock]);

  const handleEdit = useCallback((product) => {
    navigation.navigate("AdProdutosVend", { productData: product });
  }, [navigation]);

  const handleDelete = useCallback((productId, productName) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o produto "${productName}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const deleteApiUrl = Platform.OS === 'android'
                ? 'http://10.0.2.2/BDTCC/excluir.php'
                : 'http://localhost/BDTCC/excluir.php';

              const response = await fetch(deleteApiUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: productId }),
              });

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
              }

              const json = await response.json();

              if (json.sucesso) {
                Alert.alert("Sucesso", json.mensagem || "Produto excluído com sucesso!");
                fetchProdutos();
              } else {
                Alert.alert("Erro", json.mensagem || "Falha ao excluir produto.");
              }
            } catch (err) {
              console.error("Erro ao excluir produto:", err);
              Alert.alert("Erro", "Não foi possível excluir o produto. Tente novamente.");
            }
          }
        }
      ],
      { cancelable: false }
    );
  }, [fetchProdutos]);

  useFocusEffect(
    useCallback(() => {
      fetchProdutos();
      return () => {};
    }, [fetchProdutos])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#404A12" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

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
          style={styles.addButtonHeader}
          onPress={() => navigation.navigate("AdProdutosVend")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {produtos.length > 0 ? (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.IdPro.toString()}
          renderItem={({ item }) => (
            <CardMeuProduto
              item={item}
              navigation={navigation}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não tem produtos cadastrados</Text>
          <TouchableOpacity
            style={styles.addButtonEmpty}
            onPress={() => navigation.navigate("AdProdutosVend")}
          >
            <Text style={styles.addButtonEmptyText}>Adicionar Primeiro Produto</Text>
          </TouchableOpacity>
        </View>
      )}

      {produtos.length > 0 && (
        <TouchableOpacity
          style={styles.addButtonFloat}
          onPress={() => navigation.navigate("AdProdutosVend")}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#404A12',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
  },
  addButtonHeader: {
    backgroundColor: '#2E7D32',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: '48%',
    borderWidth: 1,
    borderColor: '#404A12',
  },
  imagem: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "#404A12",
  },
  preco: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#404A12",
    marginBottom: 4,
  },
  peso: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  acoes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: "#404A12",
  },
  deleteButton: {
    backgroundColor: "#8B0000",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: '500',
  },
  addButtonFloat: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#404A12',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#404A12",
    textAlign: 'center',
    marginBottom: 20,
  },
  addButtonEmpty: {
    backgroundColor: '#404A12',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  addButtonEmptyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 12,
    color: '#404A12',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  errorText: {
    color: '#8B0000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#404A12',
    padding: 12,
    borderRadius: 6,
    minWidth: 160,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Telaprodutosvend;