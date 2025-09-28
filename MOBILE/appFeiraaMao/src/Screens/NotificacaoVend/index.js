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
  { id: "1", nome: "Confeitaria da Lu", avatar: require("../../../assets/img/imglu.png"), mensagem: "Você efetuou o pagamento do pedido #2453", tipo: "compra" },
  { id: "2", nome: "Peixaria Água Viva", avatar: require("../../../assets/img/imgagua.png"), mensagem: "Você cancelou o pedido #2454", tipo: "cancelamento" },
];

const notificacoesBarraca = [
  { id: "3", nome: "Cliente Ana Souza", avatar: require("../../../assets/img/seujo.png"), mensagem: "Efetuou o pagamento do pedido #2412", tipo: "venda" },
  { id: "4", nome: "Cliente Pedro Lima", avatar: require("../../../assets/img/imglu.png"), mensagem: "Cancelou o pedido #2413", tipo: "cancelamento" },
  { id: "5", nome: "Sistema", avatar: require("../../../assets/img/imgagua.png"), mensagem: "Novo produto adicionado: Bolo de Chocolate", tipo: "produto" },
];

export default function NotificacoesVend() {
  const navigation = useNavigation();
  const [expandido, setExpandido] = useState({});

  const toggleExpandir = (id) => setExpandido((prev) => ({ ...prev, [id]: !prev[id] }));

  const irParaPedidos = () => navigation.navigate("Pedido");
  const irParaEncomendas = () => navigation.navigate("EncomendaVend");

  const renderItem = ({ item }, tipoLista) => {
    let backgroundColor = "#506C2D"; // default
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

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>🛒 Minhas Compras</Text>
            <FlatList
              data={notificacoesPessoa}
              keyExtractor={(item) => item.id}
              renderItem={(props) => renderItem(props, "pessoa")}
              contentContainerStyle={styles.lista}
            />
          </View>

          <View style={styles.secao}>
            <Text style={[styles.tituloSecao, styles.tituloLoja]}>🏪 Minha Loja</Text>
            <FlatList
              data={notificacoesBarraca}
              keyExtractor={(item) => item.id}
              renderItem={(props) => renderItem(props, "barraca")}
              contentContainerStyle={styles.lista}
            />
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },

  header: {
    backgroundColor: "#425010",
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  tituloHeader: { color: "#BCAF77", fontSize: 20, fontWeight: "bold" },

  secao: { marginVertical: 15 },

  tituloSecao: { fontSize: 18, fontWeight: "bold", color: "#425010", marginLeft: 12, marginBottom: 10 },
  tituloLoja: { color: "#F2C94C", fontSize: 20 },

  lista: { paddingHorizontal: 10 },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12, marginTop: 3 },

  textos: { flex: 1 },

  nomeNotificacao: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  status: { color: "#fff", fontSize: 14, marginBottom: 6 },

  botao: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  textoBotao: { fontSize: 14, fontWeight: "bold", color: "#4C5340" },
});
