import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AreaUsuario() {
  const navigation = useNavigation();
  const [user] = useState({
    name: "Manoel Marcos Xavier",
    email: "Manoelmarcos005@gmail.com",
  });

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../../assets/img/fundo-perfil.png")}
        style={{ width: "100%", height: "100%" }}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}></View>

          <View style={styles.profileContainer}>
            <View style={styles.profileImage}>
              <Image
                source={require("../../../assets/img/imgPerfil.png")}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </ScrollView>

        {/* Botões fixos no rodapé */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Alterar", { nome: user.name })}
          >
            <Text style={styles.buttonText}>Alterar dados da conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sellerButton]}
            onPress={() => navigation.navigate("cadvend")}
          >
            <View style={styles.iconButtonContent}>
              <MaterialCommunityIcons
                name="storefront"
                size={24}
                color="#425010"
              />
              <Text style={[styles.buttonText, { color: "#425010" }]}>
                Torne-se vendedor
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={[styles.buttonText, styles.logoutText]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: "flex-end",
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    bottom: 60,
  },
  button: {
    backgroundColor: "#404A12",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  sellerButton: {
    backgroundColor: "#CDA527", // cor especial para "Torne-se vendedor"
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#425010",
  },
  buttonText: {
    marginLeft: 8,
    color: "#BCAF77",
    fontWeight: "Urbanist",
  },
  logoutText: {
    color: "#425010",
  },
  iconButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
});
