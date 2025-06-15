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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from '@expo/vector-icons';



const COR_PRIMARIA = "#4CAF50";

const Alterar = () => {
  const navigation = useNavigation();

  // Estados dos campos
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [senha, setSenha] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [datanasc, setDatanasc] = useState("");

  // Estado para a foto do perfil, começa com a imagem padrão
  const [fotoPerfil, setFotoPerfil] = useState(require("../../../../assets/img/iconperfil.jpg"));

  const validarCampos = () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "Por favor, informe seu nome completo");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, informe seu e-mail");
      return false;
    }
    if (!senha) {
      Alert.alert("Erro", "Por favor, informe sua senha atual");
      return false;
    }
    return true;
  };

  const handleSalvar = () => {
    if (validarCampos()) {
      // Aqui você faria a chamada à API para atualizar os dados
      Alert.alert("Sucesso", "Seus dados foram atualizados com sucesso!");
      navigation.goBack();
    }
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  // Função para abrir a galeria e escolher uma foto
  const escolherFoto = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("Usuário cancelou");
      } else if (response.errorCode) {
        console.log("Erro:", response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setFotoPerfil({ uri }); // Atualiza a foto do perfil
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Foto do perfil clicável para trocar */}
   <TouchableOpacity style={styles.profileImage} >

  <Image source={fotoPerfil} style={styles.image} resizeMode="cover" />
  

 
  <TouchableOpacity style={styles.sideIconContainer} onPress={escolherFoto}>
    <Ionicons name="camera-outline" size={24} color="#fff" />
    <Text style={styles.changePhotoText}></Text>
  </TouchableOpacity>
</TouchableOpacity>


          
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.areaForm}>
          <Text style={styles.textForm}>Nome completo *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#999"
          />

          <Text style={styles.textForm}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            value={datanasc}
            onChangeText={setDatanasc}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#999"
          />

          <Text style={styles.textForm}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />

          <Text style={styles.textForm}>CPF</Text>
          <TextInput
            style={styles.input}
            value={cpf}
            onChangeText={setCpf}
            placeholder="000.000.000-00"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />

          <Text style={styles.textForm}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.textForm}>Endereço</Text>
          <TextInput
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Digite seu endereço completo"
            placeholderTextColor="#999"
          />

          <Text style={styles.textForm}>Senha atual *</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha atual"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
          />

          <Text style={styles.textForm}>Nova senha (opcional)</Text>
          <TextInput
            style={styles.input}
            value={novaSenha}
            onChangeText={setNovaSenha}
            placeholder="Digite uma nova senha"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSalvar}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelar}>
            <Text style={[styles.buttonText, styles.cancelText]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    borderColor: "#8918",
    alignSelf: "center",
    marginVertical: 20,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  sideIconContainer: {
    position: "absolute",
    right: 0, // Ícone na lateral direita
    top: "60%",
    transform: [{ translateY: -12 }],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#ff0000',
  },

  changePhotoText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
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
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonsContainer: {
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 40,
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: COR_PRIMARIA,
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: COR_PRIMARIA,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  cancelText: {
    color: COR_PRIMARIA,
  },
});

  export default Alterar;