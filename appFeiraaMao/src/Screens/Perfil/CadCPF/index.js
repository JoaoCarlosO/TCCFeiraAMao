import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';

const CadastroCPF = () => {
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [barraca, setBarraca] = useState("");
  const [documento, setDocumento] = useState(null);

  const selecionarDocumento = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        setDocumento(result);
        alert("Documento anexado com sucesso!");
      }
    } catch (error) {
      console.log("Erro ao selecionar o documento:", error);
    }
  };

  const CustomCheckbox = ({ label, value }) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => setSelectedOption(value)}
    >
      <View style={[styles.checkbox, selectedOption === value && styles.checkedBox]} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ImageBackground
            source={require("../../../../assets/img/fundo-perfil.png")}
            style={styles.containerPrincipal}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.containerInterno}>
              <Text style={styles.textForm}>Nome completo *</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#999"
              />

              <Text style={styles.textForm}>Nome da barraca</Text>
              <TextInput
                style={styles.input}
                value={barraca}
                onChangeText={setBarraca}
                placeholder="Digite o nome da sua barraca"
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
                placeholder="Digite seu CPF"
                placeholderTextColor="#999"
                keyboardType="numeric"
                autoCorrect={false}
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
                autoCorrect={false}
              />

              <Text style={styles.termos}>
                Eu li e concordo sobre os Termos de serviço, política de privacidade do app e os termos.
              </Text>

              <View style={styles.radiosconter}>
                <CustomCheckbox label="Aceito" value="lojaP" />
              </View>

              {/* Anexar documento no final */}
              <TouchableOpacity style={styles.anexoLink} onPress={selecionarDocumento}>
                <Feather name="paperclip" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.anexoTexto}>Anexar documento</Text>
              </TouchableOpacity>

              {documento && (
                <Text style={styles.documentoNome}>
                  📎 {documento.name}
                </Text>
              )}

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    if (
                      nome.trim() !== "" &&
                      telefone.trim() !== "" &&
                      email.trim() !== "" &&
                      cpf.trim() !== "" &&
                      selectedOption !== null
                    ) {
                      navigation.navigate("tipoloja");
                    } else {
                      alert("Por favor, preencha todos os campos obrigatórios e aceite os termos.");
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  containerPrincipal: {
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
    borderRadius: 10,
  },
  containerInterno: {
    backgroundColor: '#404A22',
    padding: 20,
    borderRadius: 8,
    width: '100%',
  },
  textForm: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  anexoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  anexoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  documentoNome: {
    marginTop: 6,
    color: "#fff",
    fontStyle: "italic",
    fontSize: 14,
  },
  termos: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
  },
  radiosconter: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: '#fff',
  },
  label: {
    color: '#fff',
  },
  buttonsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#404A22',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CadastroCPF;
