import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const pedidos = [
  {
    id: "1",
    vendedor: "Confeitaria da Lu",
    status: "Confirmado",
    total: 45.5,
    produtos: [
      {
        nome: "Bolo de Cenoura",
        quantidade: 2,
        preco: 22.75,
        observacao: "Com cobertura extra",
        imagem: require("../../../assets/img/imglu.png"),
      },
    ],
  },
  {
    id: "2",
    vendedor: "Peixaria Água Viva",
    status: "Em preparo",
    total: 32.9,
    produtos: [
      {
        nome: "Filé de Tilápia",
        quantidade: 1,
        preco: 32.9,
        observacao: "Bem embalado",
        imagem: require("../../../assets/img/imgagua.png"),
      },
    ],
  },
  {
    id: "3",
    vendedor: "Seu João Artesanais",
    status: "Entregue",
    total: 27.0,
    produtos: [
      {
        nome: "Frutas secas",
        quantidade: 2,
        preco: 13.5,
        observacao: "Pacotes pequenos",
        imagem: require("../../../assets/img/seujo.png"),
      },
    ],
  },
];

export default function PedidosCliente() {
  const navigation = useNavigation();
  const [listaPedidos, setListaPedidos] = useState(pedidos);

  const cancelarPedido = (id) => {
    const novaLista = listaPedidos.map((pedido) =>
      pedido.id === id ? { ...pedido, status: "Cancelado" } : pedido
    );
    setListaPedidos(novaLista);
  };

  const renderProduto = (produto, index) => (
    <View key={index} style={styles.produto}>
      <Image source={produto.imagem} style={styles.imagemProduto} />
      <View style={{ flex: 1 }}>
        <Text style={styles.nomeProduto}>{produto.nome}</Text>
        <Text style={styles.detalhesProduto}>
          {produto.quantidade}x R$ {produto.preco.toFixed(2)}
        </Text>
        {produto.observacao && (
          <Text style={styles.obsProduto}>Obs: {produto.observacao}</Text>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.vendedor}>{item.vendedor}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      {item.produtos.map(renderProduto)}
      <Text style={styles.total}>Total: R$ {item.total.toFixed(2)}</Text>

      {item.status !== "Cancelado" && item.status !== "Entregue" && (
        <TouchableOpacity
          style={styles.botaoCancelar}
          onPress={() => cancelarPedido(item.id)}
        >
          <Text style={styles.textoCancelar}>Cancelar pedido</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../../assets/img/fundo-perfil.png")}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.tituloHeader}>MEUS PEDIDOS</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={listaPedidos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#425010",
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  tituloHeader: {
    color: "#BCAF77",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  vendedor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  produto: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  imagemProduto: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10,
  },
  nomeProduto: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  detalhesProduto: {
    fontSize: 13,
    color: "#444",
  },
  obsProduto: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#777",
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4C5340",
    marginTop: 8,
  },
  botaoCancelar: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#385438",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  textoCancelar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
