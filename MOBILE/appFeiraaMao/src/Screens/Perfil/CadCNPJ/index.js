import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";

const CadastroCNPJ = () => {
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState(null);
  const [razaoSocial, setRazaoSocial] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [barraca, setBarraca] = useState("");
  const [documento, setDocumento] = useState(null);

  const selecionarDocumento = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        setDocumento(result);
        alert("Documento anexado com sucesso!");
      }
    } catch (error) {
      console.log("Erro ao selecionar o documento:", error);
    }
  };

  const CustomCheckbox = ({ label, value }) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => setSelectedOption(value)}
    >
      <View
        style={[styles.checkbox, selectedOption === value && styles.checkedBox]}
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.containerPrincipal}>
            <ImageBackground
              source={require("../../../../assets/img/fundo-perfil.png")}
              style={styles.imageBackground}
              imageStyle={styles.imageStyle}
            >
              <View style={styles.containerInterno}>
                <Text style={styles.textForm}>Razão Social *</Text>
                <TextInput
                  style={styles.input}
                  value={razaoSocial}
                  onChangeText={setRazaoSocial}
                  placeholder="Digite a razão social"
                  placeholderTextColor="#999"
                />

                <Text style={styles.textForm}>Nome da barraca</Text>
                <TextInput
                  style={styles.input}
                  value={barraca}
                  onChangeText={setBarraca}
                  placeholder="Digite o nome da barraca"
                  placeholderTextColor="#999"
                />

                <Text style={styles.textForm}>Licença de feirante</Text>
                <TouchableOpacity
                  style={styles.anexoBotao}
                  onPress={selecionarDocumento}
                >
                  <Text style={styles.anexoTexto}>+ Anexar documento</Text>
                </TouchableOpacity>
                {documento && (
                  <Text style={styles.documentoNome}>📎 {documento.name}</Text>
                )}

                <Text style={styles.textForm}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={telefone}
                  onChangeText={setTelefone}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />

                <Text style={styles.textForm}>CNPJ *</Text>
                <TextInput
                  style={styles.input}
                  value={cnpj}
                  onChangeText={setCnpj}
                  placeholder="Digite o CNPJ"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  autoCorrect={false}
                />

                <Text style={styles.textForm}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="empresa@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Text style={styles.termos}>
                  Eu li e concordo com os Termos de serviço, política de
                  privacidade do app e os termos.
                </Text>

                <View style={styles.radiosconter}>
                  <CustomCheckbox label="Aceito" value="lojaCNPJ" />
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    if (
                      razaoSocial.trim() !== "" &&
                      telefone.trim() !== "" &&
                      email.trim() !== "" &&
                      cnpj.trim() !== "" &&
                      selectedOption !== null
                    ) {
                      navigation.navigate("tipoloja");
                    } else {
                      alert(
                        "Preencha os campos obrigatórios e aceite os termos."
                      );
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  containerPrincipal: {
    padding: 20,
    borderRadius: 10,
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    padding: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  imageStyle: {
    borderRadius: 10,
  },
  containerInterno: {
    backgroundColor: "rgba(64, 74, 34, 0.9)",
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  textForm: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  anexoBotao: {
    backgroundColor: "#BCAF77",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 8,
  },
  anexoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  documentoNome: {
    marginTop: 6,
    color: "#fff",
    fontStyle: "italic",
    fontSize: 14,
  },
  termos: {
    color: "#fff",
    fontSize: 14,
    marginTop: 10,
  },
  radiosconter: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#fff",
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: "#fff",
  },
  label: {
    color: "#fff",
  },
  buttonsContainer: {
    marginTop: 20,
    width: "100%",
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

export default CadastroCNPJ;
