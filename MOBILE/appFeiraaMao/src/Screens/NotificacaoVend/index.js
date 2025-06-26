import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const notificacoesPessoa = [
  {
    id: "1",
    nome: "Confeitaria da Lu",
    avatar: require("../../../assets/img/imglu.png"),
    mensagem: "Você efetuou o pagamento do pedido #2453",
    tipo: "compra", // tipo para personalizar cor
  },
  {
    id: "2",
    nome: "Peixaria Água Viva",
    avatar: require("../../../assets/img/imgagua.png"),
    mensagem: "Você cancelou o pedido #2454",
    tipo: "cancelamento",
  },
];

const notificacoesBarraca = [
  {
    id: "3",
    nome: "Cliente Ana Souza",
    avatar: require("../../../assets/img/seujo.png"),
    mensagem: "Efetuou o pagamento do pedido #2412",
    tipo: "venda",
  },
  {
    id: "4",
    nome: "Cliente Pedro Lima",
    avatar: require("../../../assets/img/imglu.png"),
    mensagem: "Cancelou o pedido #2413",
    tipo: "cancelamento",
  },
  {
    id: "5",
    nome: "Sistema",
    avatar: require("../../../assets/img/imgagua.png"),
    mensagem: "Novo produto adicionado: Bolo de Chocolate",
    tipo: "produto",
  },
];

export default function NotificacoesVendedor() {
  const navigation = useNavigation();
  const [expandido, setExpandido] = useState({});

  const toggleExpandir = (id) => {
    setExpandido((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Navegar para a tela de PedidosCliente (minhas compras)
  const irParaPedidos = () => {
    navigation.navigate("Pedido");
  };

  // Navegar para a tela de EncomendasVendedor (encomendas feitas para mim)
  const irParaEncomendas = () => {
    navigation.navigate("EncomendaVend");
  };

  // Renderizar item, recebe uma prop extra para saber se é pessoa ou barraca
  const renderItem = ({ item }, tipoLista) => {
    let backgroundColor = "#5A6E24"; // padrão

    if (item.tipo === "compra") backgroundColor = "#506C2D";
    if (item.tipo === "venda") backgroundColor = "#425010";
    if (item.tipo === "cancelamento") backgroundColor = "#C8A745";
    if (item.tipo === "produto") backgroundColor = "#C8A745";

    return (
      <View style={[styles.card, { backgroundColor }]}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.textos}>
          <Text style={styles.nomeNotificacao}>{item.nome}</Text>
          <Text style={styles.status}>{item.mensagem}</Text>

          {expandido[item.id] && (
            <TouchableOpacity
              style={styles.botao}
              onPress={tipoLista === "pessoa" ? irParaPedidos : irParaEncomendas}
            >
              <Text style={styles.textoBotao}>Consultar detalhes</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => toggleExpandir(item.id)}>
          <MaterialIcons
            name={expandido[item.id] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={require("../../../assets/img/fundo-perfil.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.tituloHeader}>NOTIFICAÇÕES</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={28} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.tituloSecao}>🛒 Minhas Compras</Text>
          <FlatList
            data={notificacoesPessoa}
            keyExtractor={(item) => item.id}
            renderItem={(props) => renderItem(props, "pessoa")}
            contentContainerStyle={styles.lista}
          />

          <Text style={[styles.tituloSecao, styles.tituloLoja]}>🏪 Minha Loja</Text>
          <FlatList
            data={notificacoesBarraca}
            keyExtractor={(item) => item.id}
            renderItem={(props) => renderItem(props, "barraca")}
            contentContainerStyle={styles.lista}
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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
    fontFamily: "Urbanist-Bold",
    fontWeight: "bold",
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#425010",
    marginLeft: 12,
    marginTop: 20,
    marginBottom: 10,
  },

  tituloLoja: {
    color: "#F2C94C",
    fontSize: 20,
  },

  lista: {
    paddingHorizontal: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginTop: 5,
  },

  textos: {
    flex: 1,
  },

  nomeNotificacao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 3,
  },

  status: {
    color: "#fff",
    fontSize: 13,
    marginBottom: 6,
  },

  botao: {
    backgroundColor: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 5,
  },

  textoBotao: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#4C5340",
  },
});
