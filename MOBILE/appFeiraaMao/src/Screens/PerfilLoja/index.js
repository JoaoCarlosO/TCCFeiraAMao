import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground,
  Button,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.4; // 40% da largura da tela para cada item

export default function PerfilLoja({ route }) {
  const { nome, imagem, produtos } = route.params;
  const navigation = useNavigation(); // Adicione esta linha

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
      <Text style={styles.descricao}>{item.descricao}</Text>
      <View style={{ flexDirection: "row", marginTop: 3 }}>
        <Text style={styles.preco}>{item.preco}</Text>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate("Encomenda", { produto: item })}>
          <Text style={styles.textoBotao}>Comprar</Text></TouchableOpacity>
      </View>
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
        <ImageBackground source={require("../../../assets/img/fundoLoja.png")}
          style={styles.headerBackground}
          resizeMode="cover">
          <Icon name="arrow-back" color="#fff" size={30} style={styles.icone} onPress={() => navigation.goBack()} />
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
    width: 90,
    height: 90,
    borderRadius: 40,
  },
  icone: {
    position: "absolute",
    alignSelf: "flex-start",
    marginBottom: 120,
    marginLeft: 10
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
    height: 225,
    marginHorizontal: 8,
    backgroundColor: "#F7F0CE",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: 'center',
    padding: 10,
  },
  imagem: {
    width: 135,
    height: 120,
    resizeMode: 'contain',
    marginBottom: -10,
  },
  nome: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: "center",
  },
  descricao: {
    fontSize: 12,
  },
  preco: {
    fontSize: 20,
    color: "#425010",
    fontWeight: 'bold',
  },
  headerBackground: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    backgroundColor: 'rgba(0,0,0,0.4)', // Fundo semi-transparente para melhor contraste
    borderRadius: 10,
    alignItems: 'center',
  },
  botao: {
    backgroundColor: "#425010",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  textoBotao: {
    color: 'white',
    fontSize: 14,
  }
});