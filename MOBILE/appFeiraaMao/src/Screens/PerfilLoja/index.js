import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground
} from "react-native";
import {useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.4; // 40% da largura da tela para cada item

export default function PerfilLoja({ route }) {
  const { nome, imagem, produtos } = route.params;

  // Divide os produtos em 4 categorias (exemplo)
  const linhasProdutos = [
    produtos.slice(0, 5), // Linha 1
    produtos.slice(5, 10), // Linha 2
    produtos.slice(10, 15), // Linha 3
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={item.imagem} style={styles.imagem} />
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.preco}>{item.preco}</Text>
    </View>
  );

  const renderLinha = (linha, index) => (
    <View key={index} style={styles.linhaContainer}>
      <Text style={styles.tituloLinha}>{`Categoria ${index + 1}`}</Text>
      <FlatList
        horizontal
        data={linha}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.linhaContent}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ImageBackground source={require("../../../assets/img/fundoLoja.png")} style={styles.headerBackground} resizeMode="cover">
        <Icon name="arrow-back" color="#FFF" size={30} onPress={() => navigation.navigate("Home")}/>   
        <Image source={imagem} style={styles.logo} />
        <Text style={styles.tituloLoja}>{nome}</Text>
        </ImageBackground>
      </View>

      {linhasProdutos.map((linha, index) => renderLinha(linha, index))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: "center",
  },
  logo: {
    width: 85,
    height: 85,
    borderRadius: 40,
  },
  tituloLoja: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  linhaContainer: {
    marginVertical: 15,
  },
  tituloLinha: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
    marginBottom: 10,
    color: '#333',
  },
  linhaContent: {
    paddingHorizontal: 10,
  },
  item: {
    width: ITEM_WIDTH,
    height: 180,
    marginHorizontal: 8,
    backgroundColor: "#F7F0CE",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: 'center',
    padding: 10,
  },
  imagem: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  nome: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: "center",
    marginBottom: 5,
  },
  preco: {
    fontSize: 14,
    color: "#425010",
    fontWeight: 'bold',
  },
  headerBackground: {
  width: '100%',
  height: 240,
  justifyContent: 'center',
  alignItems: 'center',
  
},
});