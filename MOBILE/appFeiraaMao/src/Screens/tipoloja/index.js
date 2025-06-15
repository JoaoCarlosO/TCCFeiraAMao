import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
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
      <View style={[styles.checkbox, selectedOption === value && styles.checkedBox]} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.containerPrincipal}>
          <View style={styles.containerInterno}>
            <Text style={styles.texto}>Escolha o tipo de Loja</Text>

            <View style={styles.radiosconter}>
              <CustomCheckbox label="Loja pessoal (CPF)" value="lojaP" />
              <CustomCheckbox label="Loja Empresarial (CNPJ)" value="lojaE" />
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CadCPF")}
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
    backgroundColor: "#E8E1C3",
    padding: 20,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  radiosconter: {
    marginTop: 10,
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
