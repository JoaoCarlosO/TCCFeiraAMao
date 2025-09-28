import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking, 
  ImageBackground
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const MinhaBarraca = () => {
  const navigation = useNavigation();

  // Dados ilustrativos da barraca
  const barraca = {
    nome: "Barraca do Manoel!!",
    endereco: "Rua das Laranjeiras, 100 - Centro",
    biografia: "Olá, Eu sou o senhor Manoel, e a nossa barraquinha veio com muito suor. Deus abençõe!",
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
    Linking.openURL(url).catch(err => console.error('Erro ao abrir link:', err));
  };

  const fazerLigacao = (numero) => {
    Linking.openURL(`tel:${numero}`).catch(err => console.error('Erro ao fazer ligação:', err));
  };

  return (
    <ImageBackground
      source={require("../../../../assets/img/fundo-perfil.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.titulo}>🍊 Minha Barraca!</Text>

          <Image
            source={require("../../../../assets/img/Ftperfil.jpg")}
            style={styles.imagem}
          />

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="business" size={20} color="#425010" style={styles.icon} />
              <View>
                <Text style={styles.label}>Nome:</Text>
                <Text style={styles.texto}>{barraca.nome}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="location" size={20} color="#425010" style={styles.icon} />
              <View>
                <Text style={styles.label}>Endereço:</Text>
                <Text style={styles.texto}>{barraca.endereco}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="document-text" size={20} color="#425010" style={styles.icon} />
              <View>
                <Text style={styles.label}>Biografia:</Text>
                <Text style={styles.texto}>{barraca.biografia}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="people" size={20} color="#425010" style={styles.icon} />
              <View>
                <Text style={styles.label}>Integrantes:</Text>
                {barraca.integrantes.map((pessoa, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => fazerLigacao(pessoa.telefone.replace(/\D/g, ''))}
                  >
                    <Text style={[styles.texto, styles.telefone]}>
                      • {pessoa.nome} - {pessoa.telefone}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="share-social" size={20} color="#425010" style={styles.icon} />
              <View>
                <Text style={styles.label}>Redes Sociais:</Text>
                <TouchableOpacity 
                  style={styles.socialButton} 
                  onPress={() => abrirLink(barraca.redesSociais.instagram)}
                >
                  <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                  <Text style={styles.socialText}>Instagram</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.socialButton} 
                  onPress={() => abrirLink(barraca.redesSociais.whatsapp)}
                >
                  <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                  <Text style={styles.socialText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="pricetags" size={20} color="#425010" style={styles.icon} />
              <View>
                <Text style={styles.label}>Categoria:</Text>
                <Text style={styles.texto}>{barraca.categoria}</Text>
              </View>
            </View>
          </View>

          <View style={styles.botoesContainer}>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => navigation.navigate("telaprodutosvend")}
            >
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.botaoTexto}>Consultar Meus Produtos</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[styles.botao, styles.botaoSecundario]}
              onPress={() => navigation.navigate("AlterarVend")}
            >
              <Ionicons name="create" size={20} color="#fff" />
              <Text style={styles.botaoTexto}>Atualizar dados da barraca</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[styles.botao, styles.botaoControle]}
              onPress={() => navigation.navigate("Controle")}
            >
              <Ionicons name="stats-chart" size={20} color="#fff" />
              <Text style={styles.botaoTexto}>Controle</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#425010",
    marginBottom: 20,
    textAlign: "center",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
    marginTop: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  texto: {
    fontSize: 16,
    color: "#555",
  },
  telefone: {
    color: "#0a84ff",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  socialText: {
    fontSize: 16,
    color: "#0a84ff",
    marginLeft: 8,
  },
  botoesContainer: {
    width: "100%",
    alignItems: "center",
  },
  botao: {
    backgroundColor: "#425010",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 300,
  },
  botaoSecundario: {
    backgroundColor: "#607531",
  },
  botaoControle: {
    backgroundColor: "#8A9B4A",
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default MinhaBarraca;