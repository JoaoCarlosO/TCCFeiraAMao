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
import { DrawerActions, useNavigation } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const normalize = (size) => (screenWidth / 375) * size;

const data = [
  {
    title: "OFERTA ESPECIAL",
    descricao: "Bala de Banana com Coco 200g",
    preco: "R$12,00",
    imagem: require("../../../assets/img/bala-de-banana.png"),
  },
  {
    title: "OFERTA ESPECIAL",
    descricao: "Pão Caseiro 400g",
    preco: "R$18,00",
    imagem: require("../../../assets/img/pao-caseiro.png"),
  },
  {
    title: "OFERTA ESPECIAL",
    descricao: "Makisushi 300g",
    preco: "R$20,00",
    imagem: require("../../../assets/img/makisushi.png"),
  },
];

const CardOfertaEspecial = ({ item, navigation }) => (
  <View style={styles.cardOferta}>
    <Image source={item.imagem} style={styles.imagemOferta} />
    <Text style={styles.tituloOferta}>{item.title}</Text>
    <View style={styles.infoOferta}>
      <Text style={styles.descricao}>{item.descricao}</Text>
      <Text style={styles.precoOferta}>{item.preco}</Text>
      <TouchableOpacity style={styles.botaoComprar} onPress={() => navigation.navigate("Pedido")}> 
        <Text style={styles.textoBotao}>Comprar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const produtos = [
  { id: "1", nome: "Bolo de roda", preco: "R$12,00", imagem: require("../../../assets/img/bolo.png") },
  { id: "2", nome: "Bala de banana", preco: "R$25,00", imagem: require("../../../assets/img/banana-bala.png") },
  { id: "3", nome: "Coruja", preco: "R$25,00", imagem: require("../../../assets/img/coruja.png") },
  { id: "4", nome: "Pamonha", preco: "R$12,00", imagem: require("../../../assets/img/pamonha.png") },
  { id: "5", nome: "Palmito em conserva", preco: "R$25,00", imagem: require("../../../assets/img/palmito.png") },
  { id: "6", nome: "Makisushi", preco: "R$25,00", imagem: require("../../../assets/img/makisushi.png") },
];

const produtos2 = [
  { id: "1", nome: "Bolo de roda", preco: "R$12,00", imagem: require("../../../assets/img/bolo.png") },
  { id: "2", nome: "Bala de banana", preco: "R$25,00", imagem: require("../../../assets/img/banana-bala.png") },
  { id: "3", nome: "Coruja", preco: "R$25,00", imagem: require("../../../assets/img/coruja.png") },
  { id: "4", nome: "Pamonha", preco: "R$12,00", imagem: require("../../../assets/img/bolo.png") },
  { id: "5", nome: "Palmito em conserva", preco: "R$25,00", imagem: require("../../../assets/img/bolo.png") },
  { id: "6", nome: "Coruja", preco: "R$25,00", imagem: require("../../../assets/img/bolo.png") },
];

const CARD_WIDTH = normalize(262);
const CARD_HEIGHT = normalize(150);

const CardProduto = ({ item, navigation }) => (
  <View style={styles.card2}>
    <Image source={item.imagem} style={styles.imagem} />
    <Text style={styles.nome}>{item.nome}</Text>
    <View style={styles.linha}>
      <View style={styles.icones}>
        <Text style={styles.preco}>{item.preco}</Text>
        <TouchableOpacity>
          <Image source={require("../../../assets/img/adicionar-icon.png")} style={styles.icone} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Carrinho")}> 
          <Image source={require("../../../assets/img/heart-icon.png")} style={styles.icone} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function Home({ navigation }) {
  return (
    <ScrollView showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.containerHeader}>
            <TouchableOpacity style={styles.menu} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}> 
              <MaterialIcons name="menu" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={35} color="white" style={{ marginRight: 8 }} />
        </View>
        <View>
          <Carousel
            width={normalize(375)}
            height={normalize(200)}
            data={data}
            mode="parallax"
            autoPlay
            scrollAnimationDuration={1000}
            renderItem={({ item }) => <CardOfertaEspecial item={item} navigation={navigation} />}
          />
        </View>
        <View style={styles.containerPerfil}>
          <View style={{ flexDirection: "row" }}>
            <Image source={require("../../../assets/img/imgPerfil.png")} style={styles.imgPerfil} />
            <TouchableOpacity onPress={() => navigation.navigate("PerfilLoja")}> 
              <Text style={styles.titulo}>Seu Manoel</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={produtos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CardProduto item={item} navigation={navigation} />}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.containerPerfil}>
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <Image source={require("../../../assets/img/seujo.png")} style={styles.imgPerfil} />
            <Text style={styles.titulo}>Seu João</Text>
          </View>
          <FlatList
            data={produtos2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CardProduto item={item} navigation={navigation} />}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: normalize(100),
  },
  header: {
    backgroundColor: "#425010",
    elevation: 6,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    height: normalize(75),
    justifyContent: "center",
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    position: "absolute",
    left: normalize(15),
    top: normalize(-5),
  },
  searchContainer: {
    backgroundColor: "#F2C844",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: normalize(20),
    marginLeft: normalize(20),
    marginBottom: normalize(5),
    width: "90%",
    height: normalize(40),
    borderRadius: 50,
  },
  cardOferta: {
    flexDirection: "row",
    backgroundColor: "#425010",
    borderRadius: 20,
    padding: normalize(10),
    alignItems: "center",
    marginHorizontal: normalize(10),
    marginVertical: normalize(5),
    height: "100%"
  },
  imagemOferta: {
    width: normalize(170),
    height: normalize(170),
    resizeMode: "contain",
    marginRight: normalize(10),
    marginBottom: normalize(35)
  },
  infoOferta: {
    flex: 1,
    justifyContent: "center",
  },
  tituloOferta: {
    color: "#F7F0CE",
    fontSize: normalize(45),
    fontFamily: "MouseMemoirs",
    position: "absolute",
    marginLeft: screenWidth * 0.4,
    alignSelf: "flex-start",
    marginTop: normalize(10),
  },
  descricao: {
    color: "#fff",
    fontSize: normalize(15),
    marginVertical: normalize(2),
    fontFamily: "PTSans",
  },
  precoOferta: {
    color: "#fff",
    fontSize: normalize(40),
    marginVertical: normalize(5),
    textAlign: "center",
    fontFamily: "PTSans"
  },
  botaoComprar: {
    backgroundColor: "#F2C844",
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(12),
    borderRadius: 15,
    alignSelf: "flex-end",
    marginTop: normalize(150),
    position: 'absolute'
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: normalize(20),
  },
  card2: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginRight: normalize(10),
    width: normalize(125),
    height: normalize(153),
    justifyContent: "flex-start",
  },
  imagem: {
    width: "100%",
    height: "70%",
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    position: "absolute",
    resizeMode: "cover",
  },
  nome: {
    marginTop: normalize(115),
    fontFamily: "ABeeZee",
    fontSize: normalize(13),
  },
  preco: {
    color: "#f39c12",
    fontWeight: "bold",
    marginTop: normalize(7),
    fontSize: normalize(18)
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: normalize(9),
    marginLeft: normalize(5)
  },
  icones: {
    position: "absolute",
    flexDirection: "row",
  },
  icone: {
    width: normalize(19),
    height: normalize(18),
    marginTop: normalize(8),
    marginLeft: normalize(8)
  },
  text: {
    fontSize: normalize(24),
    color: "#333",
    fontWeight: "bold",
  },
  titulo: {
    fontSize: normalize(22),
    fontFamily: "ABeeZee",
    alignSelf: "flex-start",
    marginTop: normalize(10),
    marginLeft: normalize(10)
  },
  imgPerfil: {
    width: normalize(45),
    height: normalize(45),
    alignSelf: "flex-start",
    marginLeft: normalize(10),
    marginBottom: normalize(10),
    borderRadius: 50
  },
  containerPerfil: {
    backgroundColor: "#EFE7C5",
    textAlign: "left",
    marginTop: normalize(20),
    width: "100%",
    paddingVertical: normalize(20),
    minHeight: normalize(200),
  },
});
