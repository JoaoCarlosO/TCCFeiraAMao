import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Cadastro = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.containerPrincipal}>
          <ImageBackground
            source={require("../../../../assets/img/fundo-perfil.png")}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.containerInterno}>
              <Text style={styles.texto}>
                Para começar, faça o cadastro como feirante e preencha algumas informações necessárias
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("tipoloja")}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerPrincipal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  containerInterno: {
    backgroundColor: "#404A22",
    padding: 20,
    borderRadius: 8,
    opacity: 0.9,
    maxWidth: 300,
  },
  texto: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  buttonsContainer: {
    padding: 16,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#404A22",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Cadastro;
