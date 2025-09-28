import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function validaLogin() {
    try {
      const response = await fetch("http://10.239.20.142/BDTCC/Login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: email,
          senha: senha,
        }),
      });

      const json = await response.json();

      if (json.erro) {
        // Se a resposta do servidor contém um erro explícito.
        alert(json.mensagem || "Login inválido!");
      } else if (json.IdCli) {
        // Se a resposta contém o ID do cliente, o login foi um sucesso.
        const idDoUsuario = json.IdCli;

        // Salva o ID do usuário no AsyncStorage para ser usado em outras telas.
        await AsyncStorage.setItem(
          "usuario",
          JSON.stringify({ id: idDoUsuario })
        );

        // Navega para a tela 'AreaUsuario', passando o ID como um parâmetro.
        navigation.navigate("Home");
      } else {
        // Caso a resposta do servidor não tenha a chave IdCli.
        alert("Resposta do servidor inesperada. Verifique os logs.");
        console.log("Resposta completa do servidor:", json);
      }
    } catch (error) {
      // Erro de rede ou na requisição.
      alert("Erro de rede. Verifique a conexão com o servidor.");
      console.error("Erro ao tentar logar:", error);
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
          <View style={{ marginRight: 10, marginBottom: 45 }}>
            <Text style={styles.Titulo}>Bem-vindo de volta!</Text>
            <Text style={styles.subTitulo}>Faça seu login ou cadastre-se</Text>
          </View>
          <View style={styles.areaForm}>
            <Text style={styles.textForm}>Digite o seu email</Text>
            <TextInput
              style={styles.input}
              placeholder="manoel.ferreira31@gmail.com"
              onChangeText={setEmail}
            ></TextInput>
            <Text style={styles.textForm}>Digite sua senha</Text>
            <TextInput
              style={styles.input}
              placeholder="********"
              onChangeText={setSenha}
              secureTextEntry={true}
            ></TextInput>
            <View style={styles.viewBotao}>
              <TouchableOpacity style={styles.botao} onPress={validaLogin}>
                <Text style={styles.textoBotao}>Entrar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
              <Text style={styles.link}>Não possui conta? Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
  },

  container: {
    flexGrow: 1, // garante que ocupe a tela toda
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  Titulo: {
    fontSize: 62,
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
    height: 450,
    borderRadius: 19,
    alignItems: "center",
    marginTop: 40,
  },

  textForm: {
    fontSize: 17,
    fontFamily: "MontserratAlternates-Regular",
    color: "#f5f5f5",
    textAlign: "right",
    marginTop: 50,
  },

  formulario: {
    flex: 1,
    paddingBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginTop: -50,
  },

  input: {
    backgroundColor: "#F7F0CE",
    borderRadius: 7,
    padding: 10,
    width: "85%",
    height: "8%",
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
    padding: 10,
    alignItems: "center",
    marginTop: 75,
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
    backgroundColor: "#fff",
  },

  link: {
    fontSize: 15,
    fontFamily: "MontserratAlternates-Regular",
    color: "#f5f5f5",
    textAlign: "right",
    marginTop: 90,
  },
});
