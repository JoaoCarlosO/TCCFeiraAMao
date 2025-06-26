import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Pagamento = ({ route }) => {
  const navigation = useNavigation();
  const { total } = route.params || {};

  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeTitular, setNomeTitular] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [senha, setSenha] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('debito');

  const finalizarPagamento = () => {
    if (!numeroCartao || !nomeTitular || !validade || !cvv) {
      Alert.alert('Atenção', 'Preencha todos os campos do cartão');
      return;
    }
    Alert.alert('Pagamento realizado!');
    return;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Pagamento</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.resumoContainer}>
          <Text style={styles.subtitulo}>Resumo do Pedido</Text>
          <View style={styles.linhaResumo}>
            <Text style={[styles.textoResumo, { fontWeight: 'bold' }]}>Total:</Text>
            <Text style={styles.valorTotal}>{total}</Text>
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Método de Pagamento</Text>

          <TouchableOpacity
            style={[
              styles.botaoMetodo,
              metodoPagamento === 'debito' && styles.botaoMetodoSelecionado,
            ]}
            onPress={() => setMetodoPagamento('debito')}
          >
            <MaterialIcons
              name={metodoPagamento === 'debito' ? 'radio-button-checked' : 'radio-button-unchecked'}
              size={20}
              color="#425010"
            />
            <Text style={styles.textoMetodo}>Cartão de Débito</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoMetodo,
              metodoPagamento === 'pix' && styles.botaoMetodoSelecionado,
            ]}
            onPress={() => setMetodoPagamento('pix')}
          >
            <MaterialIcons
              name={metodoPagamento === 'pix' ? 'radio-button-checked' : 'radio-button-unchecked'}
              size={20}
              color="#425010"
            />
            <Text style={styles.textoMetodo}>PIX</Text>
          </TouchableOpacity>
        </View>

        {metodoPagamento === 'debito' && (
          <View style={styles.secao}>
            <Text style={styles.subtitulo}>Dados do Cartão</Text>

            <Text style={styles.label}>Número do Cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              keyboardType="numeric"
              maxLength={16}
              value={numeroCartao}
              onChangeText={setNumeroCartao}
            />

            <Text style={styles.label}>Nome do Titular</Text>
            <TextInput
              style={styles.input}
              placeholder="Como no cartão"
              value={nomeTitular}
              onChangeText={setNomeTitular}
            />

            <View style={styles.linhaInputs}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Validade</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/AA"
                  keyboardType="numeric"
                  maxLength={5}
                  value={validade}
                  onChangeText={setValidade}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
            </View>

            <Text style={styles.label}>Digite sua Senha</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
            />
          </View>
        )}

        {metodoPagamento === 'pix' && (
          <View style={styles.secaoPix}>
            <Text style={styles.textoPix}>
              Copie o código PIX abaixo para finalizar seu pagamento:
            </Text>
            <View style={styles.codigoPixContainer}>
              <Text style={styles.codigoPix}>a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6</Text>
              <TouchableOpacity style={styles.botaoCopiar}>
                <Text style={styles.textoBotaoCopiar}>Copiar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.botaoFinalizar} onPress={finalizarPagamento}>
          <Text style={styles.textoBotaoFinalizar}>Finalizar Pagamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F0CE'
  },
  scrollContainer: {
    paddingBottom: 30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#425010',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff'
  },
  resumoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#425010'
  },
  linhaResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textoResumo: {
    fontSize: 16,
    color: '#555'
  },
  valorTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#425010'
  },
  secao: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 5
  },
  secaoPix: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 5,
    alignItems: 'center'
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  linhaInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputContainer: {
    width: '48%'
  },
  botaoMetodo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  botaoMetodoSelecionado: {
    borderColor: '#425010',
    backgroundColor: '#F7F0CE'
  },
  textoMetodo: {
    marginLeft: 10,
    fontSize: 16
  },
  parcelamentoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  botaoParcela: {
    padding: 10,
    borderRadius: 5
  },
  parcelaTexto: {
    color: '#666'
  },
  parcelaSelecionada: {
    color: '#425010',
    fontWeight: 'bold'
  },
  textoPix: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15
  },
  codigoPixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  codigoPix: {
    flex: 1,
    color: '#333'
  },
  botaoCopiar: {
    backgroundColor: '#425010',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10
  },
  textoBotaoCopiar: {
    color: '#fff',
    fontSize: 12
  },
  botaoFinalizar: {
    backgroundColor: '#425010',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  textoBotaoFinalizar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default Pagamento;
