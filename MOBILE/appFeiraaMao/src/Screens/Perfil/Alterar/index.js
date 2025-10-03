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
  // ImageBackground removido para evitar erro de asset local
  Alert,
  ActivityIndicator, // Adicionado para melhor UX no loading
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL = "http://10.239.0.165/BDTCC";

const Alterar = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    id: null,
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
      // 1. Solicita Permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        
        // Verifica a estrutura dos dados retornados para garantir que não haja undefined
        setFormData({
          id: idDoUsuario,
          nome: data.NomeCli || "", // Usando 'NomeCli' conforme o banco
          telefone: data.Telefone || "",
          email: data.Email || "",
          senha: "", // Senha não é preenchida por segurança
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
        // Armazena a URI local da nova foto selecionada
        setFotoPerfil({ uri: result.assets[0].uri });
      }
    } catch (err) {
      console.log("Erro ao escolher foto:", err);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  const validarCampos = () => {
    if (!formData.nome.trim()) {
      Alert.alert("Atenção", "Por favor, informe seu nome completo");
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert("Atenção", "Por favor, informe seu e-mail");
      return false;
    }
    if (!formData.senha) {
      Alert.alert("Atenção", "Por favor, informe sua senha atual");
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    if (!formData.id) {
        Alert.alert("Erro de autenticação", "ID do usuário não carregado. Tente recarregar a tela.");
        return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();

      // Campos obrigatórios para autenticação e identificação
      form.append("id", formData.id);
      form.append("senha", formData.senha);
      
      // O restante dos campos de texto (usando 'nome' minúsculo para o PHP)
      form.append("nome", formData.nome);
      form.append("telefone", formData.telefone);
      form.append("email", formData.email);
      form.append("novaSenha", formData.novaSenha);
      form.append("cpf", formData.cpf);
      form.append("datanasc", formData.datanasc);

      // CORREÇÃO CRÍTICA: O campo deve ser 'Imagem' para corresponder ao PHP
      if (
        fotoPerfil &&
        fotoPerfil.uri &&
        !/^https?:\/\//i.test(fotoPerfil.uri) // Verifica se é uma URI local (nova foto)
      ) {
        const localUri = fotoPerfil.uri;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        
        // CORREÇÃO APLICADA: Usar o nome do campo 'Imagem'
        form.append("Imagem", { uri: localUri, name: filename, type });
      }

      const res = await fetch(`${SERVER_URL}/updatePerfil.php`, {
        method: "POST",
        body: form,
        // NÃO defina o Content-Type manualmente, o FormData fará isso
      });

      // Se a requisição falhou, mas não deu erro de rede (caiu no catch)
      if (!res.ok) {
        // Tenta ler o JSON de erro do PHP, se existir
        const errorText = await res.text();
        try {
            const errorData = JSON.parse(errorText);
            Alert.alert("Erro de Servidor", errorData.message || "Falha na atualização do perfil.");
            console.error("Erro na atualização do perfil (PHP):", errorData.message || "Erro desconhecido", errorText);
            return;
        } catch (e) {
            // Se não for JSON (como o erro de upload do ficheiro), exibe erro genérico do servidor/rede
            Alert.alert("Erro de Servidor", `Ocorreu um erro no servidor (Status: ${res.status}). Verifique o log do servidor para detalhes.`);
            console.error("Erro de requisição não JSON/Servidor:", res.status, errorText);
            return;
        }
      }

      // Se a resposta foi OK (status 200), processa o JSON de sucesso ou erro
      const data = await res.json();
      console.log("Resposta do servidor:", data); // Log para debug

      if (data.success) {
        // Se a nova imagem foi enviada, o PHP retornará o novo URL.
        // O ideal seria recarregar os dados do perfil aqui para ter o novo URL da imagem.
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        navigation.goBack();
      } else {
        // Usa a mensagem de erro detalhada do PHP
        Alert.alert("Erro", data.message || "Erro desconhecido ao atualizar perfil");
      }
    } catch (error) {
      // Este catch é para erros de rede (fetch failed) ou JSON.parse falhou
      console.error("Erro na requisição (Network/Parse):", error);
      Alert.alert("Erro", "Ocorreu um problema de rede ao salvar as alterações");
    } finally {
      setIsLoading(false);
    }
  };

  // Renderiza um placeholder de carregamento se o ID ainda não tiver sido carregado
  if (formData.id === null) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
            <ActivityIndicator size="large" color="#425010" />
            <Text>Carregando dados do perfil...</Text>
        </View>
    );
  }

  return (
    // FIX: Substituímos ImageBackground por SafeAreaView e definimos a cor de fundo no estilo.
    <SafeAreaView style={styles.container}>
      <View style={styles.profileImage}>
        {fotoPerfil ? (
          <Image
            // Se a URI for local (nova foto) ou remota (foto existente)
            source={{ uri: fotoPerfil.uri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.image,
              { justifyContent: "center", alignItems: "center", backgroundColor: '#eee' },
            ]}
          >
            <Ionicons name="person-circle-outline" size={70} color="#999" />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Adicionado fundo claro para substituir a imagem
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
