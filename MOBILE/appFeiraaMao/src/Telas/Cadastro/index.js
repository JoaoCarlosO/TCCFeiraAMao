import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  Animated,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function Cadastro({ navigation }) {
  const [offset] = useState(new Animated.ValueXY({ x: 0, y: 90 }));
  const [opac] = useState(new Animated.Value(0));
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.spring(offset.y, {
        toValue: 0,
        speed: 4,
        bounciness: 20,
      }),
      Animated.timing(opac, {
        toValue: 1,
        duration: 2000,
      }),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/img/fundo1.png")}
      style={styles.imgBg}
    >
      <KeyboardAvoidingView style={styles.background}>
        <Animated.View
          style={[
            styles.formulario,
            {
              opacity: opac,
              transform: [{ translateY: offset.y }],
            },
          ]}
        >
          <View>
            <Text style={styles.Titulo}>Seja Bem-Vindo!</Text>
            <Text style={styles.subTitulo}>Informe seus dados para prosseguir com o cadastro</Text>
          </View>
          <View style={styles.areaForm}>
            <Text style={styles.textForm}>Digite o seu email</Text>
            <TextInput style={styles.input} onChangeText={setNome}></TextInput>
            <Text style={styles.textForm}>Digite sua senha</Text>
            <TextInput style={styles.input} onChangeText={setSenha}></TextInput>
            <View style={styles.viewBotao}>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate("Home", { nome })}
              >
                <Text style={styles.textoBotao}>Entrar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => {navigation.navigate("Cadastro")}}>
              <Text style={styles.textForm}>Não possui conta? </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  Titulo: {
    fontSize: 46,
    fontFamily: "MontserratAlternates-Regular",
    color: "#f5f5f5",
    textAlign: "right",
    marginTop: 40,
  },

  subTitulo: {
    fontSize: 24,
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
    marginTop: 55,
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
    height: "7%",
    justifyContent: "center",
    opacity: 0.7,
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
    marginTop: 65,
    opacity: 0.7,
  },
  textoBotao: {
    color: "#425010",
    fontSize: 18,
  },

  botaoRecuperar: {
    marginTop: 15,
  },

  textoRecuperar: {
    color: "#FFF",
  },

  imgBg: {
    flex: 1,
    width: null,
    height: null,
    opacity: 50,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
});
