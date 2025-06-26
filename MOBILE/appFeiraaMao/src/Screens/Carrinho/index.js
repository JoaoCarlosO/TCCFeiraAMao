import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Carrinho({ route, navigation }) {
  const produto = route?.params?.produto;

  useEffect(() => {
    if (produto) {
      Alert.alert('Sucesso', `${produto.nome} foi adicionado ao carrinho!`);
    }
  }, [produto]);

  if (!produto) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> Seu carrinho está vazio 😢</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.cardProduto}>
        <Image source={produto.imagem} style={styles.imagem} />
        <View style={styles.infoProduto}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.descricao}>{produto.descricao}</Text>
          <Text style={styles.preco}>{produto.preco}</Text>
          <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate("Encomenda", { produto: produto })}>
            <Text style={styles.textoBotao}>Comprar</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F0CE",
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    fontSize: 24,
    fontWeight: "bold",
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
  botao: {
    backgroundColor: "#425010",
    width: 80,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: "flex-end",
    textAlign: "center",
    alignItems: "center"
  },
  textoBotao: {
    color: 'white',
    fontSize: 14,
  }
});
