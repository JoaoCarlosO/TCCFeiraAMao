import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Platform,
  ActivityIndicator, // Importado para o indicador de carregamento
  Alert // Importado para exibir mensagens ao usuário
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from '@expo/vector-icons';

export default function AdProdutosVend() {
  const navigation = useNavigation();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    // 'descricao' será usada para a categoria do produto, como 'doce', 'salgado', etc.
    descricao: "", 
    preco: "",
    quantidade: "",
  });

  const [imagemProduto, setImagemProduto] = useState(null); // Estado para armazenar a URI da imagem selecionada
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento (requisição)
  const [message, setMessage] = useState(""); // Estado para exibir mensagens de sucesso ou erro

  // Formata o preço para exibição no formato R$ X.XX
  const precoF = formData.preco 
    ? `R$ ${parseFloat(formData.preco).toFixed(2).replace(".", ",")}`
    : "";

  // Função genérica para atualizar o estado do formulário
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Função para lidar com o salvamento do produto
  const handleSalvar = async () => {
    setMessage(""); // Limpa mensagens anteriores

    // Validação dos campos obrigatórios e da imagem
    if (!formData.nome || !formData.descricao || !formData.preco || !formData.quantidade || !imagemProduto) {
      setMessage("Por favor, preencha todos os campos e selecione uma imagem!");
      return; // Interrompe a função se algum campo estiver vazio
    }

    setIsLoading(true); // Ativa o indicador de carregamento

    try {
      // Define a URL da API PHP baseada na plataforma (emulador Android ou outros)
      // É CRUCIAL que este caminho corresponda exatamente ao local do seu salvar.php no XAMPP: htdocs/BDTCC/salvar.php
      const apiUrl = Platform.OS === 'android'
        ? 'http://10.0.2.2/BDTCC/salvar.php' // Para emulador Android (10.0.2.2 é o localhost do host para o emulador)
        : 'http://localhost/BDTCC/salvar.php'; // Para iOS Simulator, navegador (Expo Web)

      // Cria um objeto FormData para enviar dados de formulário, incluindo arquivos (imagem)
      const formDataToSend = new FormData();
      formDataToSend.append("nome", formData.nome); // Nome do produto
      formDataToSend.append("preco", formData.preco); // Preço do produto
      formDataToSend.append("quantidade", formData.quantidade); // Quantidade do produto
      formDataToSend.append("categoria", formData.descricao); // 'Descricao' do formulário é enviada como 'categoria' para o PHP
      formDataToSend.append("id_vendedor", "1"); // ID do vendedor hardcoded por enquanto (pode ser dinâmico depois)

      // Adiciona a imagem ao FormData
      formDataToSend.append("imagem", {
        uri: imagemProduto.uri, // URI local da imagem
        name: `produto_${Date.now()}.jpg`, // Nome de arquivo único para o servidor
        type: "image/jpeg", // Tipo MIME da imagem
      });

      // Realiza a requisição POST para a API PHP
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formDataToSend, // O FormData define automaticamente o Content-Type como 'multipart/form-data'
      });

      // Tenta obter a resposta como texto primeiro, para depuração em caso de JSON inválido
      const textResponse = await response.text();
      let jsonResponse;

      try {
        jsonResponse = JSON.parse(textResponse); // Tenta fazer o parse da resposta como JSON
      } catch (parseError) {
        // Se o parse falhar, significa que a resposta do servidor não é um JSON válido
        console.error("Erro ao fazer parse da resposta do servidor:", parseError);
        console.error("Resposta bruta do servidor:", textResponse);
        setMessage("Erro: Resposta inválida do servidor. Verifique o console para detalhes.");
        setIsLoading(false);
        return;
      }

      // Verifica o status de sucesso da resposta JSON do servidor
      if (jsonResponse.sucesso) {
        setMessage("Produto adicionado com sucesso!");
        Alert.alert("Sucesso!", "Produto cadastrado com sucesso.");

        // Reseta os campos do formulário e a imagem após o sucesso
        setFormData({ nome: "", descricao: "", preco: "", quantidade: "" });
        setImagemProduto(null);

        // Navega para a tela MeusProdutos para ver a lista atualizada
        // A tela MeusProdutos (listar_produtos.php) fará sua própria requisição para atualizar os dados.
        navigation.navigate("telaprodutosvend"); 
      } else {
        // Exibe a mensagem de erro retornada pelo servidor
        setMessage("Erro ao salvar: " + (jsonResponse.mensagem || "Erro desconhecido."));
        Alert.alert("Erro", jsonResponse.mensagem || "Ocorreu um erro ao salvar o produto.");
      }
    } catch (error) {
      // Captura erros de conexão ou outros erros na requisição
      console.error("Erro de conexão ou durante a requisição:", error);
      setMessage("Erro de conexão com o servidor! Verifique sua rede ou o endereço do servidor.");
      Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique sua rede e o caminho da API.");
    } finally {
      setIsLoading(false); // Desativa o indicador de carregamento
    }
  };

  // Função para abrir a galeria de imagens para seleção
  const escolherImagemProduto = () => {
    const options = {
      mediaType: "photo", // Apenas fotos
      quality: 1, // Qualidade máxima da imagem
    };
    launchImageLibrary(options, (response) => {
      // Verifica se o usuário cancelou a seleção
      if (response.didCancel) {
        console.log("Usuário cancelou a seleção da imagem");
      } 
      // Verifica se houve algum erro no ImagePicker
      else if (response.errorCode) {
        console.log("Erro no ImagePicker: ", response.errorMessage);
        setMessage("Erro ao selecionar imagem: " + response.errorMessage);
      } 
      // Se a imagem foi selecionada com sucesso
      else if (response.assets && response.assets.length > 0) {
        setImagemProduto({ uri: response.assets[0].uri }); // Armazena a URI da imagem
      }
    });
  };

  return (
    // Imagem de fundo da tela
    <ImageBackground
      source={require("../../../assets/img/fundo-perfil.png")} // Certifique-se de que este caminho está correto
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // Mantém o teclado aberto ao tocar em outros campos
        >
          <View style={styles.areaForm}>

            {/* Seção para adicionar/visualizar a imagem do produto */}
            <Text style={styles.textForm}>Imagem do Produto</Text>
            <TouchableOpacity 
              style={styles.imagemBox} 
              onPress={escolherImagemProduto}
              disabled={isLoading} // Desabilita o botão enquanto carrega
            >
              {imagemProduto ? (
                <Image source={imagemProduto} style={styles.imagemPreview} />
              ) : (
                <View style={styles.placeholder}>
                  <Ionicons name="camera-outline" size={30} color="#666" />
                  <Text style={{ color: "#666" }}>Selecionar imagem</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Campo Nome do Produto */}
            <Text style={styles.textForm}>Nome do produto</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(text) => handleChange("nome", text)}
              placeholder="Informe o nome do produto"
              placeholderTextColor="#999"
              editable={!isLoading} // Desabilita o campo enquanto carrega
            />

            {/* Campo Preço */}
            <Text style={styles.textForm}>Preço</Text>
            <TextInput
              style={styles.input}
              value={formData.preco}
              // Substitui vírgula por ponto para garantir que seja um número válido para parseFloat
              onChangeText={(text) => handleChange("preco", text.replace(",", "."))}
              placeholder="Digite o preço (ex: 12.50)"
              keyboardType="numeric" // Teclado numérico
              placeholderTextColor="#999"
              editable={!isLoading}
            />
            {/* Exibe o valor formatado do preço */}
            {precoF ? (
              <Text style={{ color: "#333", marginBottom: 10 }}>
                Valor formatado: <Text style={{ fontWeight: "bold" }}>{precoF}</Text>
              </Text>
            ) : null}

            {/* Campo Descrição (usado como Categoria) */}
            <Text style={styles.textForm}>Descrição (Categoria: doce, salgado, etc.)</Text>
            <TextInput
              style={styles.input}
              value={formData.descricao}
              onChangeText={(text) => handleChange("descricao", text)}
              placeholder="Descreva o seu produto ou informe a categoria (ex: Doce)"
              placeholderTextColor="#999"
              editable={!isLoading}
            />

            {/* Campo Quantidade */}
            <Text style={styles.textForm}>Quantidade</Text>
            <TextInput
              style={styles.input}
              value={formData.quantidade}
              onChangeText={(text) => handleChange("quantidade", text)}
              placeholder="Digite a quantidade atual de produto"
              keyboardType="numeric"
              placeholderTextColor="#999"
              editable={!isLoading}
            />

            {/* Exibe mensagens de sucesso ou erro */}
            {message ? (
              <Text style={styles.messageText}>{message}</Text>
            ) : null}

            {/* Botões de Ação */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSalvar}
                disabled={isLoading} // Desabilita o botão durante o carregamento
              >
                <Text style={styles.buttonText}>
                  {/* Exibe 'Salvando...' ou um indicador de atividade durante o carregamento */}
                  {isLoading ? <ActivityIndicator color="#fff" /> : "Salvar Produto"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => navigation.goBack()} // Volta para a tela anterior
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, styles.cancelText]}>Cancelar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// Estilos do componente
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
  imagemBox: {
    height: 160,
    borderRadius: 15,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  imagemPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
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
  messageText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  }
});
