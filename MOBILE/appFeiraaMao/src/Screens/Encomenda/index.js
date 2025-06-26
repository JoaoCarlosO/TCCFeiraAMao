import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Encomenda({ route, navigation }) {
  const produto = route?.params?.produto;
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");

  if (!produto) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Produto não encontrado 😢</Text>
      </View>
    );
  }

  // Extrai o valor numérico do preço
  const precoNumerico = parseFloat(produto.preco.replace("R$", "").replace(",", "."));
  const total = (precoNumerico * quantidade).toFixed(2);

  const aumentarQuantidade = () => setQuantidade(quantidade + 1);
  const diminuirQuantidade = () => {
    if (quantidade > 1) setQuantidade(quantidade - 1);
  };

  const finalizarPedido = () => {
    navigation.navigate("Confirmacao", {
      produto: {
        ...produto,
        quantidade,
        observacao,
        total: `R$${total.replace(".", ",")}`
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground 
        source={require("../../../assets/img/fundo-perfil.png")} 
        style={styles.background}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="#425010" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Finalizar Pedido</Text>
        </View>

        <View style={styles.cardProduto}>
            <Image source={produto.imagem} style={styles.imagem} />
            <View style={styles.infoProduto}>
              <Text style={styles.nome}>{produto.nome}</Text>
              <Text style={styles.descricao}>{produto.descricao}</Text>
              <Text style={styles.preco}>{produto.preco}</Text>
            </View>
          </View>

        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Quantidade</Text>
          <View style={styles.quantidadeContainer}>
            <TouchableOpacity 
              style={styles.botaoQuantidade} 
              onPress={diminuirQuantidade}
            >
              <Icon name="remove" size={20} color="#425010" />
            </TouchableOpacity>
            
            <Text style={styles.quantidade}>{quantidade}</Text>
            
            <TouchableOpacity 
              style={styles.botaoQuantidade} 
              onPress={aumentarQuantidade}
            >
              <Icon name="add" size={20} color="#425010" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Observações</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Alguma observação sobre o pedido?"
            value={observacao}
            onChangeText={setObservacao}
          />
        </View>

        <View style={styles.resumo}>
          <View style={styles.linhaResumo}>
            <Text style={styles.textoResumo}>Subtotal ({quantidade} {quantidade > 1 ? 'itens' : 'item'}):</Text>
            <Text style={styles.valorResumo}>R${total.replace(".", ",")}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.botaoFinalizar} 
            onPress={() => navigation.navigate("Pagamento", { total: `R$${total.replace(".", ",")}`})}
          >
            <Text style={styles.textoBotao}>Confirmar Pedido</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  background: {
    flex: 1,
    padding: 20,
    height: "100%"
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#425010',
    marginLeft: 20,
  },
  cardProduto: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagem: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 15,
  },
  infoProduto: {
    flex: 1,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  preco: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  secao: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#425010',
  },
  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
  },
  botaoQuantidade: {
    backgroundColor: '#F7F0CE',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantidade: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  resumo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
  },
  linhaResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  textoResumo: {
    fontSize: 16,
    color: '#555',
  },
  valorResumo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#425010',
  },
  botaoFinalizar: {
    backgroundColor: '#425010',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});