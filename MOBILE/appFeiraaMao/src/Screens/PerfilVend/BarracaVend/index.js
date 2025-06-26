import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking, ImageBackground
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const MinhaBarraca = () => {
  const navigation = useNavigation();

  // Dados ilustrativos da barraca
  const barraca = {
    nome: "Barraca do Manoel!!",
    endereco: "Rua das Laranjeiras, 100 - Centro",
    biografia: "Olá, Eu sou o senhor Manoel, e a nossa barraquinha veio com muito suor.Deus abençõe!",
    integrantes: [
      { nome: "Manoel", telefone: "(11) 91234-5678" },
      { nome: "Josefina", telefone: "(11) 98765-4321" },
    ],
    redesSociais: {
      instagram: "https://instagram.com/barracaManoel",
      whatsapp: "https://wa.me/5511912345678"
    },
    categoria: "Produtos Artesanais e Naturais"
  };

  const abrirLink = (url) => {
    Linking.openURL(url);
  };

  return (
      <ImageBackground
          source={require("../../../../assets/img/fundo-perfil.png")}
          style={{ width: "100%", height: "100%", flex: 1 }}
        >
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.titulo}>🍊 Minha Barraca!</Text>

        <Image
          source={require("../../../../assets/img/Ftperfil.jpg")}
          style={styles.imagem}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.texto}>{barraca.nome}</Text>

          <Text style={styles.label}>Endereço:</Text>
          <Text style={styles.texto}>{barraca.endereco}</Text>


          <Text style={styles.label}>Biografia:</Text>
          <Text style={styles.texto}>{barraca.biografia}</Text>


          <Text style={styles.label}>Integrantes:</Text>
          {barraca.integrantes.map((pessoa, index) => (
            <Text key={index} style={styles.texto}>
              • {pessoa.nome} - {pessoa.telefone}
            </Text>
          ))}

          <Text style={styles.label}>Redes Sociais:</Text>
          <TouchableOpacity onPress={() => abrirLink(barraca.redesSociais.instagram)}>
            <Text style={styles.link}>Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => abrirLink(barraca.redesSociais.whatsapp)}>
            <Text style={styles.link}>WhatsApp</Text>
          </TouchableOpacity>

        
          <Text style={styles.label}>Categoria:</Text>
          <Text style={styles.texto}>{barraca.categoria}</Text>
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate("telaprodutosvend")}
        >
          <Text style={styles.botaoTexto}>🔍 Consultar Meus Produtos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botao, styles.botaoSecundario]}
          onPress={() => navigation.navigate("AlterarVend")}
        >
          <Text style={styles.botaoTexto}>✏️ Atualizar dados da barraca</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#425010",
    marginBottom: 20,
  },
  imagem: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "#425010",
    borderWidth: 3,
    marginBottom: 20,
  },
  infoContainer: {
    alignSelf: "stretch",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  texto: {
    fontSize: 16,
    color: "#555",
    marginTop: 2,
  },
  link: {
    fontSize: 16,
    color: "#0a84ff",
    textDecorationLine: "underline",
    marginTop: 4,
  },
  botao: {
    backgroundColor: "#425010",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
  },
  botaoSecundario: {
    backgroundColor: "#607531",
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MinhaBarraca;
