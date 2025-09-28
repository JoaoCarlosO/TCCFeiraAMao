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
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const CadastroCNPJ = () => {
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState(null);
  const [razaoSocial, setRazaoSocial] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [barraca, setBarraca] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !razaoSocial.trim() ||
      !telefone.trim() ||
      !email.trim() ||
      !cnpj.trim() ||
      !senha.trim() ||
      !selectedOption
    ) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios e aceite os termos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Erro", "Digite um e-mail válido.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl =
        Platform.OS === "android"
          ? "http://10.0.2.2/BDTCC/CadastrarVendedor.php"
          : "http://localhost/BDTCC/CadastrarVendedor.php";

      const formData = new FormData();
      formData.append("nome", razaoSocial);
      formData.append("telefone", telefone);
      formData.append("email", email);
      formData.append("cpfcnpj", cnpj);
      formData.append("barraca", barraca || "");
      formData.append("senha", senha);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const textResponse = await response.text();
      console.log("Resposta bruta do servidor:", textResponse);

      try {
        const res = JSON.parse(textResponse);
        if (res.erro === false) {
          Alert.alert("Sucesso", res.mensagem || "Cadastro realizado!");
          navigation.navigate("HomeVend");
        } else {
          Alert.alert("Erro", res.mensagem || "Erro ao cadastrar.");
        }
      } catch (e) {
        console.error("Erro ao parsear resposta JSON:", e);
        Alert.alert("Erro", "Resposta inválida do servidor: " + textResponse);
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      Alert.alert(
        "Erro de conexão",
        "Verifique se o servidor está online, o PHP está correto e o endereço da API está acessível."
      );
    } finally {
      setLoading(false);
    }
  };

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
              <Text style={styles.textForm}>Razão Social (Nome oficial e jurídico da empresa) *</Text>
              <TextInput style={styles.input} value={razaoSocial} onChangeText={setRazaoSocial} placeholder="Digite a razão social" placeholderTextColor="#999" editable={!loading} />

              <Text style={styles.textForm}>Nome da barraca</Text>
              <TextInput style={styles.input} value={barraca} onChangeText={setBarraca} placeholder="Digite o nome da barraca" placeholderTextColor="#999" editable={!loading} />

              <Text style={styles.textForm}>Telefone *</Text>
              <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" placeholderTextColor="#999" keyboardType="phone-pad" editable={!loading} />

              <Text style={styles.textForm}>CNPJ *</Text>
              <TextInput style={styles.input} value={cnpj} onChangeText={setCnpj} placeholder="Digite o CNPJ" placeholderTextColor="#999" keyboardType="numeric" editable={!loading} />

              <Text style={styles.textForm}>Email *</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="empresa@email.com" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" editable={!loading} />

              <Text style={styles.textForm}>Senha *</Text>
              <TextInput style={styles.input} value={senha} onChangeText={setSenha} placeholder="Digite sua senha" placeholderTextColor="#999" secureTextEntry={true} editable={!loading} />

              <Text style={styles.termos}>
                Eu li e concordo com os Termos de serviço, política de privacidade do app e os termos.
              </Text>

              <View style={styles.radiosconter}>
                <CustomCheckbox label="Aceito os termos" value="aceito" />
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, loading && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20, paddingHorizontal: 20 },
  containerPrincipal: { padding: 20, borderRadius: 10, width: "100%", maxWidth: 500, alignItems: "center" },
  imageStyle: { resizeMode: "cover", borderRadius: 10 },
  containerInterno: { backgroundColor: "#404A22", padding: 20, borderRadius: 8, width: "100%" },
  textForm: { color: "#fff", fontSize: 16, marginTop: 10 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 10 },
  termos: { color: "#fff", fontSize: 14, marginTop: 10 },
  radiosconter: { marginTop: 10, flexDirection: "row", alignItems: "center" },
  optionContainer: { flexDirection: "row", alignItems: "center" },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: "#fff", marginRight: 8 },
  checkedBox: { backgroundColor: "#fff" },
  label: { color: "#fff" },
  buttonsContainer: { marginTop: 20, width: "100%", alignItems: "center" },
  button: { backgroundColor: "#fff", paddingVertical: 15, paddingHorizontal: 40, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#404A22", fontWeight: "bold", fontSize: 16 },
  disabled: { opacity: 0.5 },
  disabledButton: { backgroundColor: "#ccc" },
  disabledText: { color: "#ccc" }
});

export default CadastroCNPJ;