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

const produtos = [
    { id: "1", nome: "Bolo de roda", preco: "R$12,00", imagem: require("../../../assets/img/bolo.png") },
    { id: "2", nome: "Bala de banana", preco: "R$25,00", imagem: require("../../../assets/img/banana-bala.png") },
    { id: "3", nome: "Coruja", preco: "R$25,00", imagem: require("../../../assets/img/coruja.png") },
    { id: "4", nome: "Pamonha", preco: "R$12,00", imagem: require("../../../assets/img/pamonha.png") },
    { id: "5", nome: "Palmito em conserva", preco: "R$25,00", imagem: require("../../../assets/img/palmito.png") },
    { id: "6", nome: "Makisushi", preco: "R$25,00", imagem: require("../../../assets/img/makisushi.png") },
];

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

export default function PerfilLoja() {
    return (
        <View style={styles.container}>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFE7C5",
        justifyContent: "center",
        alignItems: "center",
    },
    texto: {
        fontSize: 24,
        fontWeight: "bold",
    },
});
