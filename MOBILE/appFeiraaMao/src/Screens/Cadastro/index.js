import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Defina a baseUrl global aqui
// 👉 se for rodar no CELULAR FÍSICO, troque pelo IP da sua máquina (ex: http://192.168.1.10)
const baseUrl =
  Platform.OS === "android"
    ? "http://10.239.0.165" // emulador Android Studio
    : "http://localhost"; // emulador iOS

const Cadastro = () => {
  const navigation = useNavigation();

  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [datanasc, setDatanasc] = useState("");
  const [senha, setSenha] = useState("");

  function formatDate(text) {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.length > 4) {
      formatted = cleaned.slice(0, 4) + "-";
      if (cleaned.length > 6) {
        formatted += cleaned.slice(4, 6) + "-";
        formatted += cleaned.slice(6, 8);
      } else {
        formatted += cleaned.slice(4);
      }
    }
    return formatted;
  }

  async function cadastrarCliente(dados) {
    try {
      const url = `${baseUrl}/BDTCC/CadastrarCliente.php`;
      console.log("Enviando para:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro HTTP ${response.status}: ${response.statusText} - ${errorText}`
        );
      }

      try {
        const resJson = await response.json();
        return resJson;
      } catch (jsonError) {
        const text = await response.text();
        throw new Error(
          `Erro ao analisar JSON: ${jsonError.message}, resposta: ${text}`
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  }

  async function saveData() {
    if (!nome || !telefone || !email || !datanasc || !senha || !cpf) {
      showMessage({
        message: "Erro ao Salvar",
        description: "Preencha todos os campos!",
        type: "warning",
      });
      return;
    }

    const obj = {
      NomeCli: nome,
      Telefone: telefone,
      datanasc: datanasc,
      Email: email,
      CPF: cpf,
      Senha: senha,
    };

    try {
      const res = await cadastrarCliente(obj);
      if (res.sucesso) {
        showMessage({
          message: "Cadastro Realizado",
          description: "Registro salvo com sucesso!",
          type: "success",
          duration: 800,
        });
        navigation.navigate("Home", { nome });
      } else {
        showMessage({
          message: "Erro ao Cadastrar",
          description: res.mensagem || "Erro desconhecido",
          type: "danger",
          duration: 3000,
        });
      }
    } catch (error) {
      Alert.alert("Ops", `Erro ao conectar com o servidor. ${error.message}`);
    }
  }

  return (
    <ImageBackground
      source={require("../../../assets/img/fundo1.png")}
      style={styles.imgBg}
    >
      <KeyboardAvoidingView
        style={styles.background}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginRight: 10 }}>
            <Text style={styles.Titulo}>Cadastre-se!</Text>
            <Text style={styles.subTitulo}>
              Informe seus dados para prosseguir com o cadastro
            </Text>
          </View>

          <View style={styles.areaForm}>
            <Text style={styles.textForm}>Digite o seu nome completo:</Text>
            <TextInput
              style={styles.input}
              placeholder="Manoel Ferreira da Silva"
              onChangeText={setNome}
              value={nome}
            />

            <Text style={styles.textForm}>Digite o seu número de telefone:</Text>
            <TextInput
              style={styles.input}
              placeholder="(13) 9797-4040"
              keyboardType="phone-pad"
              onChangeText={setTelefone}
              value={telefone}
            />

            <Text style={styles.textForm}>Digite o seu email:</Text>
            <TextInput
              style={styles.input}
              placeholder="manoel.ferreira31@gmail.com"
              onChangeText={setEmail}
              value={email}
            />

            <Text style={styles.textForm}>Digite a sua data de nascimento:</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={datanasc}
              onChangeText={(text) => setDatanasc(formatDate(text))}
            />

            <Text style={styles.textForm}>Digite o seu CPF:</Text>
            <TextInput
              style={styles.input}
              placeholder="432.432.432-61"
              onChangeText={setCpf}
              value={cpf}
            />

            <Text style={styles.textForm}>Digite a sua senha:</Text>
            <TextInput
              style={styles.input}
              placeholder="********"
              onChangeText={setSenha}
              secureTextEntry={true}
              value={senha}
            />

            <View style={styles.viewBotao}>
              <TouchableOpacity style={styles.botao} onPress={saveData}>
                <Text style={styles.textoBotao}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.textLink}>
              Já possui uma conta? Faça o Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: "100%",
  },
  Titulo: {
    fontSize: 55,
    fontFamily: "MontserratAlternates-Regular",
    color: "#f5f5f5",
    textAlign: "right",
    marginTop: 40,
  },
  subTitulo: {
    fontSize: 25,
    fontFamily: "Urbanist-Regular",
    color: "#f5f5f5",
    textAlign: "right",
  },
  areaForm: {
    backgroundColor: "#425010",
    width: 309,
    height: 550,
    borderRadius: 19,
    marginTop: 35,
    padding: 15,
  },
  textForm: {
    fontSize: 15,
    fontFamily: "MontserratAlternates-Regular",
    color: "#f5f5f5",
    textAlign: "left",
    marginTop: 15,
  },
  textLink: {
    fontSize: 15,
    fontFamily: "MontserratAlternates-Regular",
    color: "#f5f5f5",
    textAlign: "left",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F7F0CE",
    borderRadius: 7,
    padding: 10,
    width: "100%",
    height: 40,
    justifyContent: "center",
    opacity: 0.7,
    color: "#000",
  },
  viewBotao: {
    width: "90%",
    borderRadius: 7,
  },
  botao: {
    backgroundColor: "#F7F0CE",
    borderRadius: 7,
    padding: 8,
    alignItems: "center",
    marginTop: 20,
    width: "110%",
    opacity: 0.7,
  },
  textoBotao: {
    color: "#425010",
    fontSize: 18,
  },
  imgBg: {
    flex: 1,
    width: null,
    height: null,
    opacity: 50,
    justifyContent: "flex-start",
  },
});

export default Cadastro;
