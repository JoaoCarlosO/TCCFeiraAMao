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
  Platform,
  Alert // Importar Alert do React Native para mensagens
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Não está sendo usado neste componente, mas mantido.

const CadastroCPF = () => {
  const navigation = useNavigation();

  // Estados para os campos do formulário
  const [selectedOption, setSelectedOption] = useState(null); // Para o checkbox de termos
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState(""); // Usado como cpfcnpj no backend
  const [barraca, setBarraca] = useState("");
  const [documento, setDocumento] = useState(null); // Para o arquivo anexado
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false); // Para controlar o estado de carregamento/envio

  // Função para selecionar um documento usando DocumentPicker
  const selecionarDocumento = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Permite selecionar qualquer tipo de arquivo
        copyToCacheDirectory: false, // Não é necessário copiar para o cache se for enviar diretamente
      });

      // Verifica se a seleção do documento foi bem-sucedida e não foi cancelada
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        setDocumento(result.assets[0]); // Pega o primeiro asset selecionado
        Alert.alert("Sucesso", "Documento anexado com sucesso!"); // Usar Alert do React Native
      } else if (result.canceled === true) {
          console.log("Seleção de documento cancelada.");
      }
    } catch (error) {
      console.error("Erro ao selecionar o documento:", error);
      Alert.alert("Erro", "Não foi possível anexar o documento.");
    }
  };

  // Função principal para enviar o formulário
  const handleSubmit = async () => {
    // 1. Validação inicial dos campos obrigatórios e aceitação dos termos
    if (!nome.trim() || !telefone.trim() || !email.trim() || !cpf.trim() || !senha.trim() || !selectedOption) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos obrigatórios e aceite os termos.");
      return; // Interrompe a execução se a validação falhar
    }

    // 2. Validação de formato de e-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Atenção", "Digite um e-mail válido.");
      return; // Interrompe a execução se a validação falhar
    }

    setLoading(true); // Ativa o estado de carregamento

    try {
      // Define a URL da API PHP baseada na plataforma (Android emulador vs. localhost)
      const apiUrl = Platform.OS === 'android' 
        ? 'http://10.0.2.2/BDTCC/cadastrarvendedor.php' 
        : 'http://localhost/BDTCC/cadastrarvendedor.php';

      // Cria um objeto FormData para enviar os dados, incluindo o arquivo
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('telefone', telefone);
      formData.append('email', email);
      formData.append('cpfcnpj', cpf); // O campo CPF no frontend é 'cpfcnpj' no backend
      formData.append('barraca', barraca || ""); // Envia a barraca, ou string vazia se não preenchida
      formData.append('senha', senha);

      // Anexa o documento se um foi selecionado
      if (documento) {
        // Verifica se o objeto documento tem as propriedades esperadas para um arquivo
        if (documento.uri && documento.name && documento.mimeType) {
          formData.append('documento', {
            uri: documento.uri,
            name: documento.name,
            type: documento.mimeType
          });
        } else {
            console.warn("Objeto de documento inválido, ignorando anexo.");
        }
      }

      // --- CORREÇÃO AQUI: Não usar _parts, usar .entries() ---
      // DEBUG: Mostra o que está sendo enviado no FormData para o console
      console.log("Conteúdo do FormData para envio:");
      for (let [key, value] of formData.entries()) { // MUDANÇA AQUI: de _parts para .entries()
        console.log(`${key}: ${value}`);
      }

      // 3. Faz a requisição POST para a API PHP
      const response = await fetch(apiUrl, {
        method: "POST",
        // Ao enviar FormData, o navegador/React Native geralmente define o Content-Type
        // como 'multipart/form-data' automaticamente, com o boundary correto.
        // É melhor NÃO definir o 'Content-Type' manualmente para FormData,
        // pois isso pode quebrar o boundary.
        // O 'Accept' pode ser útil para informar ao servidor que você espera JSON.
        headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data', // Removido para evitar problemas com boundary
        },
        body: formData, // O corpo da requisição é o objeto FormData
      });

      // 4. Lê a resposta do servidor como texto primeiro para depuração e para lidar com não-JSON
      const textResponse = await response.text(); 
      console.log("Resposta bruta do servidor:", textResponse);
      
      // 5. Tenta parsear a resposta como JSON
      try {
        const res = JSON.parse(textResponse);
        console.log("Resposta parseada do servidor:", res);

        if (res.erro === false) {
          Alert.alert("Sucesso", res.mensagem || "Cadastro feito com sucesso!");
          // Navega para a tela 'HomeVend' após o sucesso
          navigation.navigate("HomeVend");
        } else {
          Alert.alert("Erro", res.mensagem || "Erro ao cadastrar.");
        }
      } catch (e) {
        // Captura erros ao parsear o JSON (se a resposta do PHP não for JSON válido)
        console.error("Erro ao parsear JSON da resposta:", e);
        Alert.alert("Erro de Resposta", "Resposta inválida do servidor. Detalhes: " + textResponse);
      }
    } catch (error) {
      // Captura erros de rede ou outros erros durante a requisição
      console.error("Erro na requisição Fetch:", error);
      Alert.alert(
        "Erro de Conexão",
        "Erro ao conectar com o servidor. Por favor, verifique:\n1. Servidor PHP está rodando.\n2. Arquivo PHP está no local correto e acessível.\n3. Configurações de CORS no PHP (Access-Control-Allow-Origin)."
      );
    } finally {
      setLoading(false); // Desativa o estado de carregamento, independentemente do sucesso ou erro
    }
  };

  // Componente CustomCheckbox para os termos de serviço
  const CustomCheckbox = ({ label, value }) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => setSelectedOption(value)}
      disabled={loading}
    >
      <View style={[styles.checkbox, selectedOption === value && styles.checkedBox, loading && styles.disabled]} />
      <Text style={[styles.label, loading && styles.disabledText]}>{label}</Text>
    </TouchableOpacity>
  );

  // Renderização da interface do usuário do componente
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ImageBackground
            source={require("../../../../assets/img/fundo-perfil.png")}
            style={styles.containerPrincipal}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.containerInterno}>
              <Text style={styles.textForm}>Nome completo *</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite seu nome completo" placeholderTextColor="#999" editable={!loading} />

              <Text style={styles.textForm}>Nome da barraca</Text>
              <TextInput style={styles.input} value={barraca} onChangeText={setBarraca} placeholder="Digite o nome da sua barraca" placeholderTextColor="#999" editable={!loading} />

              <Text style={styles.textForm}>Telefone *</Text>
              <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" placeholderTextColor="#999" keyboardType="phone-pad" editable={!loading} />

              <Text style={styles.textForm}>CPF *</Text>
              <TextInput style={styles.input} value={cpf} onChangeText={setCpf} placeholder="Digite seu CPF" placeholderTextColor="#999" keyboardType="numeric" autoCorrect={false} editable={!loading} />

              <Text style={styles.textForm}>Email *</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="seu@email.com" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} editable={!loading} />

              <Text style={styles.textForm}>Senha *</Text>
              <TextInput style={styles.input} value={senha} onChangeText={setSenha} placeholder="Digite sua senha" placeholderTextColor="#999" secureTextEntry={true} editable={!loading} />

              <Text style={styles.termos}>Eu li e concordo sobre os Termos de serviço, política de privacidade do app e os termos.</Text>

              <View style={styles.radiosconter}>
                <CustomCheckbox label="Aceito os termos" value="aceito" />
              </View>

              <TouchableOpacity style={[styles.anexoLink, loading && styles.disabled]} onPress={selecionarDocumento} disabled={loading}>
                <Feather name="paperclip" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.anexoTexto}>Anexar documento</Text>
              </TouchableOpacity>

              {/* Exibe o nome do documento selecionado, se houver */}
              {documento && <Text style={styles.documentoNome}>📎 {documento.name}</Text>}

              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleSubmit} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "Processando..." : "Confirmar"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20, paddingHorizontal: 20 },
  containerPrincipal: { padding: 20, borderRadius: 10, width: '100%', maxWidth: 500, alignItems: 'center' },
  imageStyle: { resizeMode: 'cover', borderRadius: 10 },
  containerInterno: { backgroundColor: '#404A22', padding: 20, borderRadius: 8, width: '100%' },
  textForm: { color: '#fff', fontSize: 16, marginTop: 10 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 10 },
  anexoLink: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  anexoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  documentoNome: { marginTop: 6, color: "#fff", fontStyle: "italic", fontSize: 14 },
  termos: { color: '#fff', fontSize: 14, marginTop: 10 },
  radiosconter: { marginTop: 10, flexDirection: 'row', alignItems: 'center' },
  optionContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#fff', marginRight: 8 },
  checkedBox: { backgroundColor: '#fff' },
  label: { color: '#fff' },
  buttonsContainer: { marginTop: 20, width: '100%', alignItems: 'center' },
  button: { backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#404A22', fontWeight: 'bold', fontSize: 16 },
  disabled: { opacity: 0.5 },
  disabledButton: { backgroundColor: '#ccc' },
  disabledText: { color: '#ccc' }
});

export default CadastroCPF;
