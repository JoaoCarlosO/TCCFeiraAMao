import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

const CadastroCPF = () => {
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [barraca, setBarraca] = useState("");

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
        <View style={styles.containerPrincipal}>
          <View style={styles.containerInterno}>
            <Text style={styles.textForm}>Nome completo *</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#999"
            />

            <Text style={styles.textForm}>Nome</Text>
            <TextInput
              style={styles.input}
              value={barraca}
              onChangeText={setBarraca}
              placeholder="Digite o nome da sua barraca:"
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
          </View>

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
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  containerPrincipal: {
    backgroundColor: '#E8E1C3',
    padding: 20,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerInterno: {
    backgroundColor: '#404A22',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    opacity: 0.5,
  },
  texto: {
    fontSize: 30,
    color: '#fff',
  },
  textoInformativo: {
    fontSize: 16,
    marginTop: 10,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#404A22',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
  }
});

export default CadastroCPF;
