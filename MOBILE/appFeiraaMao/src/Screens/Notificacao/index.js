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

const notificacoes = [
  { id: "1", nome: "Confeitaria da Lu", avatar: require("../../../assets/img/imglu.png") },
  { id: "2", nome: "Peixaria Água Viva", avatar: require("../../../assets/img/imgagua.png") },
  { id: "3", nome: "Seu João Artesanais", avatar: require("../../../assets/img/seujo.png") },
];

export default function NotificacoesCliente() {
  const navigation = useNavigation();
  const [expandido, setExpandido] = useState({});

  const toggleExpandir = (id) => {
    setExpandido((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const irParaPedidos = () => {
    navigation.navigate("Pedido");
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.textos}>
        <Text style={styles.nomeNotificacao}>Pedido de {item.nome}</Text>
        <Text style={styles.status}>Seu pedido foi confirmado.</Text>

        {expandido[item.id] && (
          <TouchableOpacity style={styles.botao} onPress={irParaPedidos}>
            <Text style={styles.textoBotao}>Consultar meu pedido</Text>
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

  return (
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

        <FlatList
          data={notificacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />
      </View>
    </ImageBackground>

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
    fontFamily: "Urbanist-Bold", // ou remova se não tiver instalada
    fontWeight: "bold",
  },

  lista: {
    padding: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#5A6E24",
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
    backgroundColor: "#F2C94C",
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
