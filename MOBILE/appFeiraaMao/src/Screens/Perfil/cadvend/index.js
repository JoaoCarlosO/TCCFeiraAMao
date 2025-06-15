import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';


const Cadastro = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.containerPrincipal}>
          {/* Container Interno */}
          <View style={styles.containerInterno}>
            <Text style={styles.texto}> Para começar, faça o cadastro como feirante e preencha algumas informações necessárias</Text>
          </View>

        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("tipoloja")}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
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
        padding: 16,
        justifyContent: 'space-between', 
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
});

export default Cadastro;
