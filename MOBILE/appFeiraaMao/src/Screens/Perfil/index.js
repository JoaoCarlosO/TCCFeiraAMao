import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AreaUsuario({ route }) {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure the server URL
  const baseUrl =
    Platform.OS === "android"
      ? "http://10.239.0.165" // Android emulator
      : "http://localhost"; // iOS emulator

  useEffect(() => {
    async function carregarPerfil() {
      // 1. Pegue o ID do AsyncStorage
      const usuarioSalvo = await AsyncStorage.getItem("usuario");
      let idDoUsuario = null;

      if (usuarioSalvo) {
        const usuarioObjeto = JSON.parse(usuarioSalvo);
        idDoUsuario = usuarioObjeto.id;
      }
      
      // Se não encontrou o ID no armazenamento, mostre um erro e saia.
      if (!idDoUsuario) {
        Alert.alert("Erro", "ID do usuário não encontrado.");
        setLoading(false);
        return;
      }

      // 2. Use o ID recuperado para a requisição
      try {
        const url = `${baseUrl}/BDTCC/getPerfil.php?IdCli=${idDoUsuario}`;
        console.log("Buscando perfil em:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, []); // O array de dependências está vazio para que isso só execute uma vez

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#425010" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text>Não foi possível carregar os dados.</Text>
      </View>
    );
  }

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
                source={require("../../../assets/img/perfil.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{user.NomeCLi}</Text>
            <Text style={styles.email}>{user.Email}</Text>
          </View>
        </ScrollView>

        {/* Fixed buttons at the bottom */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              // É aqui que você precisa do idDoUsuario, mas ele não existe nesse escopo.
              // A forma correta é pegar o ID do 'route.params' ou do state.
              // Como a tela de perfil já é responsável por carregar o ID,
              // é mais seguro passá-lo para outras telas a partir daqui.
              // Mas o seu login ja passa o ID, então o `route.params` é a melhor forma.
              navigation.navigate("Alterar", { IdCli: route.params?.IdCli })
            }
          >
            <Text style={styles.buttonText}>Alterar dados da conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sellerButton]}
            onPress={() =>
              navigation.navigate("cadvend", { IdCli: route.params?.IdCli })
            }
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
  container: { flex: 1 },
  scroll: { flex: 1 },
  header: { padding: 20, alignItems: "flex-end" },
  profileContainer: { alignItems: "center" },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    marginTop: 20,
  },
  image: { width: "100%", height: "100%" },
  infoContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  email: { fontSize: 16, color: "#666" },
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
  sellerButton: { backgroundColor: "#CDA527" },
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#425010",
  },
  buttonText: { marginLeft: 8, color: "#BCAF77", fontWeight: "bold" },
  logoutText: { color: "#425010" },
  iconButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
});