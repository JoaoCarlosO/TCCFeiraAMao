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

import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Home({ route, navigation }) {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.containerHeader}>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <MaterialIcons name="menu" size={35} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.texto}>Bem Vindo {route.params?.nome}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E1C3",
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
  header: {
    backgroundColor: "#fafafa",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.1,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 5 },
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    height: 55,
  },
});
