import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL = "http://10.239.20.142/BDTCC";

const Alterar = () => {
  const navigation = useNavigation();

  // Adicionando 'id' ao estado inicial para ter a propriedade
  const [formData, setFormData] = useState({
    id: null, // CORREÇÃO: Adicionando a propriedade 'id'
    nome: "",
    telefone: "",
    email: "",
    senha: "",
    novaSenha: "",
    cpf: "",
    datanasc: "",
  });

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão",
          "A permissão para acessar a galeria é necessária."
        );
      }
    })();

    const carregarDados = async () => {
      try {
        const usuarioStr = await AsyncStorage.getItem("usuario");
        if (!usuarioStr) {
          throw new Error("Usuário não encontrado no armazenamento local.");
        }
        const usuario = JSON.parse(usuarioStr);
        const idDoUsuario = usuario.id;

        if (!idDoUsuario) {
          throw new Error("ID do usuário não encontrado.");
        }

        const res = await fetch(
          `${SERVER_URL}/getPerfil.php?IdCli=${idDoUsuario}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error || `Erro de requisição: ${res.status}`
          );
        }
        const data = await res.json();

        setFormData({
          id: idDoUsuario, // CORREÇÃO: Salvando o ID no estado aqui
          nome: data.NomeCLi || "",
          telefone: data.Telefone || "",
          email: data.Email || "",
          senha: "",
          novaSenha: "",
          cpf: data.CPF || "",
          datanasc: data.datanasc || "",
        });

        if (data.Imagem) {
          setFotoPerfil({ uri: data.Imagem });
        } else {
          setFotoPerfil(null);
        }
      } catch (error) {
        console.log("Erro ao carregar perfil:", error);
        Alert.alert(
          "Erro",
          "Não foi possível carregar os dados do perfil: " + error.message
        );
      }
    };
    carregarDados();
  }, []);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const escolherFoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFotoPerfil({ uri: result.assets[0].uri });
      }
    } catch (err) {
      console.log("Erro ao escolher foto:", err);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

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

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    // Adicione um console.log para verificar o valor do ID antes de enviar
    console.log("ID sendo enviado:", formData.id); 

    setIsLoading(true);
    try {
      const form = new FormData();

      // Enviando o ID e a senha, agora com o valor correto
      form.append("id", formData.id);
      form.append("senha", formData.senha);
      
      // O restante dos campos
      form.append("nome", formData.nome);
      form.append("telefone", formData.telefone);
      form.append("email", formData.email);
      form.append("novaSenha", formData.novaSenha);
      form.append("cpf", formData.cpf);
      form.append("datanasc", formData.datanasc);

      if (
        fotoPerfil &&
        fotoPerfil.uri &&
        !/^https?:\/\//i.test(fotoPerfil.uri)
      ) {
        const localUri = fotoPerfil.uri;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        form.append("foto", { uri: localUri, name: filename, type });
      }

      const res = await fetch(`${SERVER_URL}/updatePerfil.php`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        navigation.goBack();
      } else {
        Alert.alert("Erro", data.message || "Erro ao atualizar perfil");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Ocorreu um problema ao salvar as alterações");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/img/fundo-perfil.png")}
      style={{ width: "100%", height: "100%", flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.profileImage}>
          {fotoPerfil ? (
            <Image
              source={fotoPerfil}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.image,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text>+</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.sideIconContainer}
            onPress={escolherFoto}
          >
            <Ionicons name="camera-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

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
              <Text style={[styles.buttonText, styles.cancelText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

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
    backgroundColor: "#fff",
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
    backgroundColor: "#425010",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#425010",
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
