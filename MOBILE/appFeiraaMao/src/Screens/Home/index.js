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

const data = [
  {
    title: "OFERTA ESPECIAL",
    descricao: "Bala de Banana com Coco 200g",
    preco: "R$12,00",
    imagem: require("../../../assets/img/bala-de-banana.png"),
  },
  {
    title: "OFERTA ESPECIAL",
    descricao: "Doce de Leite Artesanal 300g",
    preco: "R$18,00",
    imagem: require("../../../assets/img/bala-de-banana.png"),
  },
  {
    title: "OFERTA ESPECIAL",
    descricao: "Bolo de Milho Cremoso 400g",
    preco: "R$15,00",
    imagem: require("../../../assets/img/bala-de-banana.png"),
  },
];

const CardOfertaEspecial = ({ item, navigation }) => (
  <View style={styles.cardOferta}>
    <Image source={item.imagem} style={styles.imagemOferta} />
    <Text style={styles.tituloOferta}>{item.title}</Text>
    <View style={styles.infoOferta}>
      
      <Text style={styles.descricao}>{item.descricao}</Text>
      <Text style={styles.precoOferta}>{item.preco}</Text>
      <TouchableOpacity style={styles.botaoComprar}
      onPress={() => navigation.navigate("Pedido")}>
        <Text style={styles.textoBotao}>Comprar</Text>
      </TouchableOpacity>
    </View>
  </View>
);



const produtos = [
  {
    id: "1",
    nome: "Bolo de roda",
    preco: "R$12,00",
    imagem: require("../../../assets/img/bolo.png"),
  },
  {
    id: "2",
    nome: "Bala de banana",
    preco: "R$25,00",
    imagem: require("../../../assets/img/bolo.png"),
  },
  {
    id: "3",
    nome: "Coruja",
    preco: "R$25,00",
    imagem: require("../../../assets/img/bolo.png"),
  },
  {
    id: "4",
    nome: "Pamonha",
    preco: "R$12,00",
    imagem: require("../../../assets/img/bolo.png"),
  },
  {
    id: "5",
    nome: "Palmito em conserva",
    preco: "R$25,00",
    imagem: require("../../../assets/img/bolo.png"),
  },
  {
    id: "6",
    nome: "Coruja",
    preco: "R$25,00",
    imagem: require("../../../assets/img/bolo.png"),
  },
];

const CARD_WIDTH = screenWidth * 0.7;
const CARD_HEIGHT = screenHeight * 0.2;

const CardProduto = ({ item, navigation }) => (
  <View style={styles.card2}>
    <Image source={item.imagem} style={styles.imagem} />
    <Text style={styles.nome}>{item.nome}</Text>
    <View style={styles.linha}>
      <View style={styles.icones}>
        <Text style={styles.preco}>{item.preco}</Text>
        <TouchableOpacity>
          <Image
            source={require("../../../assets/img/adicionar-icon.png")}
            style={styles.icone}
          />
        </TouchableOpacity>
        <TouchableOpacity
      onPress={() => navigation.navigate("Carrinho")}>
          <Image
            source={require("../../../assets/img/heart-icon.png")}
            style={styles.icone}
          />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function Home({ navigation }) {
  return (
    <ScrollView showsVerticalScrollIndicator={true}>
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
            width={screenWidth * 1}
            height={screenHeight * 0.25}
            data={data}
            mode="parallax"
            autoPlay
            scrollAnimationDuration={1000}
            renderItem={({ item }) => <CardOfertaEspecial item={item} navigation={navigation}/>}
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
        <View style={styles.containerPerfil}>
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <Image
              source={require("../../../assets/img/imgPerfil.png")}
              style={{ width: 43, height: 43, alignSelf: "flex-start" }}
            ></Image>
            <Text style={styles.titulo}>Seu Manoel</Text>
          </View>
          <FlatList
            data={produtos}
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
    paddingBottom: 100,
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
    height: 75,
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

  cardOferta: {
  flexDirection: "row",
  backgroundColor: "#425010",
  borderRadius: 20,
  padding: 10,
  alignItems: "center",
  marginHorizontal: 10,
  marginVertical: 5,
  height: "100%"
},

imagemOferta: {
  width: 170,
  height: 170,
  resizeMode: "contain",
  marginRight: 10,
  marginBottom: 35
},

infoOferta: {
  flex: 1,
  justifyContent: "center",
},

tituloOferta: {
  color: "#F7F0CE",
  fontSize: 50,
  fontFamily: "MouseMemoirs",
  position: "absolute",
  marginLeft: "45%",
  alignSelf:"flex-start",
  marginTop: 10
},

descricao: {
  color: "#fff",
  fontSize: 15,
  marginVertical: 2,
  fontFamily: "PTSans",

},

precoOferta: {
  color: "#fff",
  fontSize: 40,
  marginVertical: 5,
  textAlign: "center",
  fontFamily: "PTSans"
},

botaoComprar: {
  backgroundColor: "#F2C844",
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderRadius: 15,
  alignSelf: "flex-end",
  marginTop: 150,
  position: 'absolute'
},

textoBotao: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 20,
},
  card2: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginRight: 10,
    width: CARD_WIDTH * 0.46,
    height: CARD_HEIGHT * 0.97,
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
    marginTop: 115,
    fontFamily: "ABeeZee",
    fontSize: 13,
  },
  preco: {
    color: "#f39c12",
    fontWeight: "bold",
    marginTop: 7,
    fontSize: 18
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 9,
    marginLeft: 5
  },

  icones: {
    position: "absolute",
    flexDirection: "row",
  },

  icone: {
    width: 19,
    height: 18,
    marginTop: 8,
    marginLeft: 8
  },
  text: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
  titulo: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 7,
    fontFamily: "ABeeZee",
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
    textAlign: "left",
    marginTop: 20,
    width: "100%",
    paddingVertical: 20,
    minHeight: 200,
  },
});
