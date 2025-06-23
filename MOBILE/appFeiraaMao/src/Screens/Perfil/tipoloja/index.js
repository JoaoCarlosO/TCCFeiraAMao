import React, { useState } from "react";
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

const EscolherLoja = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);

  const CustomCheckbox = ({ label, value }) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => setSelectedOption(value)}
    >
      <View
        style={[
          styles.checkbox,
          selectedOption === value && styles.checkedBox,
        ]}
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.containerPrincipal}>
          <ImageBackground
            source={require("../../../../assets/img/fundo-perfil.png")}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.containerInterno}>
              <Text style={styles.texto}>Escolha o tipo de Loja</Text>

              <View style={styles.radiosconter}>
                <CustomCheckbox label="Loja pessoal (CPF)" value="lojaP" />
                <CustomCheckbox label="Loja Empresarial (CNPJ)" value="lojaE" />
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (selectedOption === "lojaP") {
                navigation.navigate("CadCPF");
              } else if (selectedOption === "lojaE") {
                navigation.navigate("CadCNPJ"); // ou qualquer tela futura para CNPJ
              } else {
                alert("Por favor, selecione um tipo de loja.");
              }
            }}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  containerPrincipal: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 10,
    opacity: 0.8,
    width: "100%",
  },
  texto: {
    fontSize: 30,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  radiosconter: {
    marginTop: 10,
    borderRadius: 8,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  checkedBox: {
    backgroundColor: "#fff",
  },
  buttonsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: "#404A22",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EscolherLoja;
