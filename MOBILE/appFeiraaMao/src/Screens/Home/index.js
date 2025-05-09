import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

import { styles } from './style';

import {
    SafeAreaView,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
    Alert,

} from 'react-native';

const { width, height } = Dimensions.get("window");

export default function Home({ route, navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView>  
        
          <Text style={styles.texto}>Bem Vindo {route.params?.nome}</Text>
          <View style={styles.viewBotao}>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => navigation.navigate("Usuario")}
            >
              <Text style={styles.textoBotao}> Entrar no App</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  caixa: {
    textAlign: "center",
    width: 100,
    borderWidth: 5,
    borderColor: "black",
  },
  logo: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
  },
  imgBg: {
    width: "100%",
    height: "100%",
    opacity: 1,
  },
  texto: {
    fontFamily: "Arial",
    fontSize: 40,
    color: "#fff",
    Top: 10,
  },
  botao: {
    backgroundColor: "#1a7",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    padding: 10,
  },
  textoBotao: {
    color: "#FFF",
    fontSize: 18,
  },
});