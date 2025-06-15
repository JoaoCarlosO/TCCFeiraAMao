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

import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const data = [
  { title: "Card 1", backgroundColor: "#425010" },
  { title: "Card 2", backgroundColor: "#425010" },
  { title: "Card 3", backgroundColor: "#425010" },
];

const produtos = [
  {
    id: "1",
    nome: "Bolo de roda",
    preco: "R$12,00",
    imagem: require("../../../assets/img/bolo.png"), // Substitua com sua imagem
  },
  {
    id: "2",
    nome: "Bolsa de fibra de banana",
    preco: "R$25,00",
    imagem: require("../../../assets/img/bolo.png"),
  },
  {
    id: "3",
    nome: "Coruja",
    preco: "R$25,00",
    imagem: require("../../../assets/img/bolo.png"),
  },
];

const CARD_WIDTH = screenWidth * 0.7; // 70% da tela
const CARD_HEIGHT = screenHeight * 0.2; // 20% da tela

const CardProduto = ({ item }) => (
  <View style={styles.card2}>
    <Image source={item.imagem} style={styles.imagem} />
    <Text style={styles.nome}>{item.nome}</Text>
    <Text style={styles.preco}>{item.preco}</Text>
    <View style={styles.linha}>
      <TouchableOpacity style={styles.botaoMais}>
        <Text style={styles.botaoTexto}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.icone}>♡</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function Home({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.containerHeader}>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <MaterialIcons name="menu" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={35}
            color="white"
            marginRight="8"
          />
        </View>

        <View>
          <Carousel
            width={width * 1}
            height={200}
            data={data}
            mode="parallax"
            autoPlay
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <View
                style={[styles.card, { backgroundColor: item.backgroundColor }]}
              >
                <Text style={styles.text}>{item.title}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.containerPerfil}>
          <Text style={styles.titulo}>Seu Manoel</Text>
          <FlatList
            data={produtos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CardProduto item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.containerPerfil}></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    backgroundColor: "#425010",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.1,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 5 },
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    height: 85,
    justifyContent: "center",
  },

  containerHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  menu: {
    position: "absolute",
    left: 15,
    top: -5,
  },

  card: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  card2: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 1,
    marginRight: 10,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: "space-between",
  },
  imagem: {
    width: "100%",
    height: "50%",
    borderRadius: 8,
  },
  nome: {
    fontWeight: "bold",
    marginTop: 5,
  },
  preco: {
    color: "#f39c12",
    fontWeight: "bold",
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  botaoMais: {
    backgroundColor: "#fdd835",
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  botaoTexto: {
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    backgroundColor: "#F2C844",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 5,
    width: "90%",
    height: 40,
    borderRadius: 50,
  },
  containerPerfil: {
    backgroundColor: "#EFE7C5",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    height: "20%",
  },
});
