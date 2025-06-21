import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from "react-native";

const Alterar = () => {
  const navigation = useNavigation();

  // Estados unificados para os campos
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    endereco: "",
    senha: "",
    novaSenha: "",
    cpf: "",
    datanasc: "",
  });

  const [fotoPerfil, setFotoPerfil] = useState(
    require("../../../../assets/img/imgPerfil.png")
  );
  const [isLoading, setIsLoading] = useState(false);

  // Função genérica para atualizar campos
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Validação dos campos obrigatórios
  const validarCampos = () => {
    if (!formData.nome.trim()) {
      alert("Por favor, informe seu nome completo");
      return false;
    }
    if (!formData.email.trim()) {
      alert("Por favor, informe seu e-mail");
      return false;
    }
    if (!formData.senha) {
      alert("Por favor, informe sua senha atual");
      return false;
    }
    return true;
  };

  // Função para salvar os dados
  const handleSalvar = async () => {
    if (!validarCampos()) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Seus dados foram atualizados com sucesso!");
      navigation.goBack();
    } catch (error) {
      alert("Ocorreu um problema ao salvar as alterações");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para escolher foto da galeria
  const escolherFoto = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("Usuário cancelou a seleção de imagem");
      } else if (response.errorCode) {
        console.log("Erro:", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setFotoPerfil({ uri: response.assets[0].uri });
      }
    });
  };

  return (
    <ImageBackground
      source={require("../../../../assets/img/fundo-perfil.png")}
      style={{ width: "100%", height: "100%", flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Imagem do perfil */}
        <View style={styles.profileImage}>
          <Image source={fotoPerfil} style={styles.image} resizeMode="cover" />
          <TouchableOpacity style={styles.sideIconContainer} onPress={escolherFoto}>
            <Ionicons name="camera-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Formulário COMPLETO */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.areaForm}>
            <Text style={styles.textForm}>Nome completo *</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(text) => handleChange("nome", text)}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#999"
            />

            <Text style={styles.textForm}>Data de Nascimento</Text>
            <TextInput
              style={styles.input}
              value={formData.datanasc}
              onChangeText={(text) => handleChange("datanasc", text)}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <Text style={styles.textForm}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={formData.telefone}
              onChangeText={(text) => handleChange("telefone", text)}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />

            <Text style={styles.textForm}>CPF</Text>
            <TextInput
              style={styles.input}
              value={formData.cpf}
              onChangeText={(text) => handleChange("cpf", text)}
              placeholder="000.000.000-00"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <Text style={styles.textForm}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              placeholder="seu@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.textForm}>Endereço</Text>
            <TextInput
              style={styles.input}
              value={formData.endereco}
              onChangeText={(text) => handleChange("endereco", text)}
              placeholder="Digite seu endereço completo"
              placeholderTextColor="#999"
            />

            <Text style={styles.textForm}>Senha atual *</Text>
            <TextInput
              style={styles.input}
              value={formData.senha}
              onChangeText={(text) => handleChange("senha", text)}
              placeholder="Digite sua senha atual"
              placeholderTextColor="#999"
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.textForm}>Nova senha (opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.novaSenha}
              onChangeText={(text) => handleChange("novaSenha", text)}
              placeholder="Digite uma nova senha"
              placeholderTextColor="#999"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Botões de ação */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSalvar}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, styles.cancelText]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};
// Estilos (MANTIDOS IGUAIS ao seu original)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    height: 320,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#425010",
    alignSelf: "center",
    marginVertical: 20,
    position: "relative",
    backgroundColor: "#fff"
  },
  image: {
    width: "100%",
    height: "100%",
  },
  sideIconContainer: {
    position: "absolute",
    right: 0,
    top: "60%",
    transform: [{ translateY: -12 }],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#425010",
  },
  areaForm: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  textForm: {
    fontSize: 16,
    marginTop: 10,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  buttonsContainer: {
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 40,
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: '#425010',
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: '#425010',
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  cancelText: {
    color: "#425010",
  },
});

export default Alterar;