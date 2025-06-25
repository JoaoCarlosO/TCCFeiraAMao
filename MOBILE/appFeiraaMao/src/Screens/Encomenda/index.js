import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Text,
  FlatList,
  Image,
} from "react-native";
export default function Encomenda({ route }) {
  const produto = route?.params?.produto;

  if (!produto) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Produto não encontrado 😢</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{produto.nome}</Text>
      <Image source={produto.imagem} style={styles.imagem} />
      <Text style={styles.preco}>{produto.preco}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  preco: {
    fontSize: 20,
    color: "#27ae60",
    marginTop: 10,
  },
  imagem: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
