import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Animated,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function Cadastro({ navigation }) {
  const [offset] = useState(new Animated.ValueXY({ x: 0, y: 90 }));
  const [opac] = useState(new Animated.Value(0));
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [datanasct, setDatanasct] = useState("");
  const [cpf, setCpf] = useState("");
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
            <Text style={styles.Titulo}>Cadastre-se!</Text>
            <Text style={styles.subTitulo}>Informe seus dados para prosseguir com o cadastro</Text>
          </View>
          <View style={styles.areaForm}>
            <Text style={styles.textForm}>Digite o seu nome completo:</Text>
            <TextInput style={styles.input} onChangeText={setNome}></TextInput>
            <Text style={styles.textForm}>Digite o seu número de telefone:</Text>
            <TextInput style={styles.input} onChangeText={setTelefone}></TextInput>
            <Text style={styles.textForm}>Digite o seu email:</Text>
            <TextInput style={styles.input} onChangeText={setEmail}></TextInput>
            <Text style={styles.textForm}>Digite a sua data de nascimento:</Text>
            <TextInput style={styles.input} onChangeText={setDatanasct}></TextInput>
            <Text style={styles.textForm}>Digite o seu CPF:</Text>
            <TextInput style={styles.input} onChangeText={setCpf}></TextInput>
            <Text style={styles.textForm}>Digite a sua senha:</Text>
            <TextInput style={styles.input} onChangeText={setSenha} secureTextEntry={true}></TextInput>
            
            <View style={styles.viewBotao}>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate("Home", { nome })}
              >
                <Text style={styles.textoBotao}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        <TouchableOpacity onPress={() => {navigation.navigate("Login")}}>
              <Text style={styles.textLink}>Já possue uma conta? Faça o Login</Text>
            </TouchableOpacity>
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
    fontSize: 45,
    fontFamily: "MontserratAlternates-Regular",
    color: "#f5f5f5",
    textAlign: "right",
    marginTop: 15,
  },

  subTitulo: {
    fontSize: 20,
    fontFamily: "Urbanist-Regular",
    color: "#f5f5f5",
    textAlign: "right",
  },

  areaForm: {
    backgroundColor: "#425010",
    width: 309,
    height: 525,
    borderRadius: 19,
    marginTop: 35,
    padding: 15
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
    marginBottom: 15
  },

  formulario: {
    flex: 1,
    paddingBottom: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginTop: 25,
  },

  input: {
    backgroundColor: "#F7F0CE",
    borderRadius: 7,
    width: "100%",
    height: "6%",
    marginBottom: 5,
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