import React, {useState} from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Text,
  FlatList,
  Image,
  TextInput 
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";

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
    <View style={styles.infoOfertaContainer}>
      <Text style={styles.tituloOferta}>{item.title}</Text>
      <View style={styles.infoOferta}>
        <Text style={styles.descricaoOferta}>{item.descricao}</Text>
        <Text style={styles.precoOferta}>{item.preco}</Text>
        <TouchableOpacity
          style={styles.botaoComprar}
          onPress={() => navigation.navigate("Encomenda", { produto: item })}
        >
          <Text style={styles.textoBotao}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);


const produtos = [
  {
    id: "1",
    nome: "Banana Chips",
    descricao: "Pacote de 150g de banana desidratada.",
    preco: "R$18,90",
    imagem: require("../../../assets/img/banana-chips.png"),
  },
  {
    id: "2",
    nome: "Cuca de Banana",
    descricao: "Bolo tradicional com banana, peso aproximado 500g.",
    preco: "R$32,50",
    imagem: require("../../../assets/img/cuca-banana.png"),
  },
  {
    id: "3",
    nome: "Cachaça de banana",
    descricao: "Garrafa de 500mL de cachaça artesanal.",
    preco: "R$45,00",
    imagem: require("../../../assets/img/cachaca-banana.png"),
  },
  {
    id: "4",
    nome: "Bala de banana",
    descricao: "Pacote com 20 balas caseiras (100g).",
    preco: "R$12,50",
    imagem: require("../../../assets/img/banana-bala.png"),
  },
  {
    id: "5",
    nome: "Nhoque",
    descricao: "Pacote de 400g, feito com biomassa de banana verde.",
    preco: "R$15,90",
    imagem: require("../../../assets/img/nhoque.png"),
  },
  {
    id: "6",
    nome: "Bolo de roda",
    descricao: "Bolo artesanal de 400g.",
    preco: "R$28,00",
    imagem: require("../../../assets/img/bolo.png"),
  },
  {
    id: "7",
    nome: "Coruja",
    descricao: "Pacote de 200g de pão feito a base de mandioca.",
    preco: "R$10,90",
    imagem: require("../../../assets/img/coruja.png"),
  },
  {
    id: "8",
    nome: "Pão Caseiro",
    descricao: "Pão artesanal de fermentação natural, unidade 400g.",
    preco: "R$14,50",
    imagem: require("../../../assets/img/pao-caseiro.png"),
  },
  {
    id: "9",
    nome: "Doce de abóbora",
    descricao: "Pote de 250g de doce cremoso de abóbora.",
    preco: "R$18,00",
    imagem: require("../../../assets/img/doce-de-abobora.png"),
  },
  {
    id: "10",
    nome: "Bala de coco",
    descricao: "Pacote com 15 balas de coco caseiras (90g).",
    preco: "R$9,90",
    imagem: require("../../../assets/img/bala-coco.png"),
  },
  {
    id: "11",
    nome: "Pamonha",
    descricao: "Unidade de 300g de pamonha tradicional (doce ou salgada).",
    preco: "R$8,50",
    imagem: require("../../../assets/img/pamonha.png"),
  },
  {
    id: "12",
    nome: "Cocada",
    descricao: "Pacote com 10 unidades de cocada (200g).",
    preco: "R$14,90",
    imagem: require("../../../assets/img/cocada.png"),
  },
  {
    id: "13",
    nome: "Mel",
    descricao: "Pote de 300g de mel puro de abelhas nativas.",
    preco: "R$22,00",
    imagem: require("../../../assets/img/mel.png"),
  },
  {
    id: "14",
    nome: "Hidromel",
    descricao: "Garrafa de 500mL de hidromel artesanal.",
    preco: "R$55,00",
    imagem: require("../../../assets/img/hidromel.png"),
  },
  {
    id: "15",
    nome: "Farinha de mandioca",
    descricao: "Pacote de 1kg de farinha de mandioca torrada.",
    preco: "R$12,90",
    imagem: require("../../../assets/img/farinha-de-mandioca.png"),
  },
];

const produtos2 = [
  {
    id: "1",
    nome: "Mandioca",
    descricao: "Pacote de 1kg de mandioca fresca.",
    preco: "R$7,90",
    imagem: require("../../../assets/img/mandioca.png"),
  },
  {
    id: "2",
    nome: "Banana-da-terra",
    descricao: "Cacho com aproximadamente 5 unidades (1kg).",
    preco: "R$9,50",
    imagem: require("../../../assets/img/banana.png"),
  },
  {
    id: "3",
    nome: "Inhame",
    descricao: "Pacote de 1kg de inhame orgânico.",
    preco: "R$10,90",
    imagem: require("../../../assets/img/inhame.png"),
  },
  {
    id: "4",
    nome: "Açafrão",
    descricao: "Pacote de 100g de açafrão-da-terra fresco.",
    preco: "R$8,50",
    imagem: require("../../../assets/img/Acafrao.png"),
  },
  {
    id: "5",
    nome: "Pitaya",
    descricao: "Unidade de pitaya vermelha (300g em média).",
    preco: "R$15,00",
    imagem: require("../../../assets/img/pitaya.png"),
  },
  {
    id: "6",
    nome: "Milho",
    descricao: "Pacote com 5 espigas de milho verde.",
    preco: "R$12,00",
    imagem: require("../../../assets/img/milho.png"),
  },
  {
    id: "7",
    nome: "Cambuci",
    descricao: "Pacote de 500g.",
    preco: "R$18,00",
    imagem: require("../../../assets/img/cambuci.png"),
  },
  {
    id: "8",
    nome: "Jaca",
    descricao: "Fatias de jaca madura (300g).",
    preco: "R$14,90",
    imagem: require("../../../assets/img/jaca.png"),
  },
  {
    id: "9",
    nome: "Manga",
    descricao: "Unidade de manga Palmer (500g em média).",
    preco: "R$6,50",
    imagem: require("../../../assets/img/manga.png"),
  },
  {
    id: "10",
    nome: "Alface crespa",
    descricao: "Maço de alface crespa orgânica (200g).",
    preco: "R$4,90",
    imagem: require("../../../assets/img/alface-crespa.png"),
  },
  {
    id: "11",
    nome: "Palmito Juçara",
    descricao: "Pote de vidro com 300g de palmito sustentável.",
    preco: "R$35,00",
    imagem: require("../../../assets/img/palmito.png"),
  },
  {
    id: "12",
    nome: "Gengibre",
    descricao: "Pedaço de 100g de gengibre fresco.",
    preco: "R$5,50",
    imagem: require("../../../assets/img/gengibre.png"),
  },
  {
    id: "13",
    nome: "Pokan",
    descricao: "Pacote de 500g do fruto exótico.",
    preco: "R$22,00",
    imagem: require("../../../assets/img/pokan.png"),
  },
  {
    id: "14",
    nome: "Shimeji",
    descricao: "Bandeja de 200g de shimeji fresco.",
    preco: "R$16,90",
    imagem: require("../../../assets/img/shimeji.png"),
  },
  {
    id: "15",
    nome: "Batata-baroa",
    descricao: "Pacote de 1kg.",
    preco: "R$11,50",
    imagem: require("../../../assets/img/mandioquinha.png"),
  },
];

const CardProduto = ({ item, navigation }) => (
  <View style={styles.card2}>
    <Image source={item.imagem} style={styles.imagem} />
    <View style={styles.contentContainer}>
      <Text style={styles.nome} numberOfLines={1}>{item.nome}</Text>
      <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
      <View style={styles.linha}>
        <Text style={styles.preco}>{item.preco}</Text>
        <View style={styles.icones}>
          <TouchableOpacity
            style={styles.iconeContainer}
            onPress={() => navigation.navigate("Encomenda", { produto: item })}
          >
            <Image
              source={require("../../../assets/img/adicionar-icon.png")}
              style={styles.icone}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconeContainer}
            onPress={() => navigation.navigate("Carrinho", {produto: item})}
          >
            <Image
              source={require("../../../assets/img/carrinho.png")}
              style={styles.icone}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

export default function Home({ navigation }) {
  const [pesquisa, setPesquisa] = useState("");

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.container}>
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
            size={25}
            color="#143517"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar produtos..."
            placeholderTextColor="#143517"
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        </View>

        <View style={styles.carouselContainer}>
          <Carousel
            width={screenWidth}
            height={normalize(200)}
            data={data}
            mode="parallax"
            autoPlay
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <CardOfertaEspecial item={item} navigation={navigation} />
            )}
          />
        </View>

        <View style={styles.containerPerfil}>
          <View style={styles.perfilHeader}>
            <Image
              source={require("../../../assets/img/imgPerfil.png")}
              style={styles.imgPerfil}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PerfilLoja", {
                  nome: "Seu Manoel",
                  imagem: require("../../../assets/img/imgPerfil.png"),
                  produtos: produtos,
                })
              }
            >
              <Text style={styles.titulo}>Seu Manoel</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={produtos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardProduto item={item} navigation={navigation} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        </View>

        <View style={styles.containerPerfil}>
          <View style={styles.perfilHeader}>
            <Image
              source={require("../../../assets/img/seujo.png")}
              style={styles.imgPerfil}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PerfilLoja", {
                  nome: "Seu João",
                  imagem: require("../../../assets/img/seujo.png"),
                  produtos: produtos2,
                })
              }
            >
              <Text style={styles.titulo}>Seu João</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={produtos2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardProduto item={item} navigation={navigation} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  container: {
    backgroundColor: "#fff",
    paddingBottom: normalize(20),
    minHeight: screenHeight,
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
    flexDirection: "row",
    alignItems: "center",
    margin: normalize(20),
    height: normalize(45),
    borderRadius: 25,
    elevation: 3,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: normalize(16),
    color: "#143517",
  },
  carouselContainer: {
    height: normalize(200),
    marginBottom: normalize(10),
  },
  cardOferta: {
    flexDirection: "row",
    backgroundColor: "#425010",
    borderRadius: 20,
    padding: normalize(15),
    alignItems: "center",
    marginHorizontal: normalize(10),
    height: "90%",
    elevation: 4,
  },
  imagemOferta: {
    width: normalize(120),
    height: normalize(120),
    resizeMode: "contain",
  },
  infoOfertaContainer: {
    flex: 1,
    marginLeft: normalize(10),
  },
  tituloOferta: {
    color: "#F7F0CE",
    fontSize: normalize(30),
    fontFamily: "MouseMemoirs",
    marginBottom: normalize(5),
  },
  infoOferta: {
    flex: 1,
    justifyContent: "center",
  },
  descricaoOferta: {
    color: "#fff",
    fontSize: normalize(17),
    fontFamily: "PTSans",
    marginBottom: normalize(5),
  },
  precoOferta: {
    color: "#F2C844",
    fontSize: normalize(22),
    fontWeight: "bold",
    marginVertical: normalize(5),
    fontFamily: "PTSans",
  },
  botaoComprar: {
    backgroundColor: "#F2C844",
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(15),
    borderRadius: 15,
    alignSelf: "flex-start",
    marginTop: normalize(5),
  },
  textoBotao: {
    color: "#425010",
    fontWeight: "bold",
    fontSize: normalize(16),
  },
  containerPerfil: {
    backgroundColor: "#EFE7C5",
    marginTop: normalize(20),
    paddingVertical: normalize(15),
    minHeight: normalize(300),
  },
  perfilHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(15),
    paddingHorizontal: normalize(15),
  },
  imgPerfil: {
    width: normalize(45),
    height: normalize(45),
    borderRadius: 25,
    marginRight: normalize(10),
  },
  titulo: {
    fontSize: normalize(20),
    fontFamily: "ABeeZee",
    fontWeight: "bold",
    color: "#425010",
  },
  flatListContent: {
    paddingHorizontal: normalize(10),
  },
  card2: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: normalize(5),
    width: normalize(160),
    height: normalize(230),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  imagem: {
    width: "100%",
    height: normalize(120),
    resizeMode: "cover",
  },
  contentContainer: {
    padding: normalize(10),
    flex: 1,
    justifyContent: "space-between",
  },
  nome: {
    fontFamily: "ABeeZee",
    fontSize: normalize(16),
    fontWeight: "bold",
    marginBottom: normalize(5),
    color: "#333",
  },
  descricao: {
    fontFamily: "PTSans",
    fontSize: normalize(12),
    color: "#666",
    marginBottom: normalize(8),
    lineHeight: normalize(14),
  },
  preco: {
    color: "#f39c12",
    fontWeight: "bold",
    fontSize: normalize(16),
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  icones: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconeContainer: {
    padding: normalize(5),
    marginLeft: normalize(5),
  },
  icone: {
    width: normalize(20),
    height: normalize(20),
  },
});


