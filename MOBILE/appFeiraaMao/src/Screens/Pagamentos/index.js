import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Linking } from "react-native";

export default function Pagamento({ route, navigation }) {
  // Verifica se route.params existe e tem o produto
  const { produto } = route?.params || {};
  const [tempoEstimado, setTempoEstimado] = useState("30-40 min");
  const [numeroPedido, setNumeroPedido] = useState("");
  const [taxaEntrega, setTaxaEntrega] = useState(5.00);


  useEffect(() => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setNumeroPedido(`#${randomNum}`);
  }, []);

 
  if (!produto) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Erro: Produto não encontrado 😢</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#425010', marginTop: 20 }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  
  const precoNumerico = parseFloat(
    (produto.preco || "R$0,00")
      .replace("R$", "")
      .replace(",", ".")
  );
  const subtotal = (precoNumerico * (produto.quantidade || 1));
  const total = (subtotal + taxaEntrega).toFixed(2);

const handlePagarAgora = () => {
  if (produto.metodoPagamento === "pix" || produto.metodoPagamento === "cartao") {
    // Abrir o WhatsApp com mensagem pronta (PIX e Cartão agora seguem o mesmo fluxo)
    const numero = "5513981014031"; // SEM +, só DDI + DDD + número
    const metodo = produto.metodoPagamento === "pix" ? "PIX" : "Cartão";
    const msg = `Olá, quero pagar meu pedido ${numeroPedido}:\n\n` +
                `Produto: ${produto.nome}\n` +
                `Quantidade: ${produto.quantidade}\n` +
                `Total: R$ ${total.replace(".", ",")}\n` +
                `Método: ${metodo}`;

    const url = `whatsapp://send?phone=${numero}&text=${encodeURIComponent(msg)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp. Verifique se ele está instalado.");
    });
  } 
  else if (produto.metodoPagamento === "dinheiro") {
    // Pagamento na entrega
    Alert.alert(
      "Pagamento na Entrega",
      "Seu pedido foi confirmado e o pagamento será feito na hora da entrega.",
      [
        { text: "OK", onPress: () => navigation.navigate("Home") }
      ]
    );
  } 
  else {
    Alert.alert("Erro", "Selecione um método de pagamento válido.");
  }
};



  const formatarMetodoPagamento = (metodo) => {
    const metodos = {
      'pix': 'PIX',
      'dinheiro': 'Dinheiro na Entrega',
      'cartao': 'Cartão via WhatsApp'
    };
    return metodos[metodo] || metodo;
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require("../../../assets/img/fundo-perfil.png")}
        style={styles.background}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="#425010" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Pagamento</Text>
        </View>

        {/* Número do Pedido e Tempo */}
        <View style={styles.infoPedidoContainer}>
          <View style={styles.infoRow}>
            <Icon name="receipt" size={20} color="#425010" />
            <Text style={styles.infoText}>Pedido: {numeroPedido}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="access-time" size={20} color="#425010" />
            <Text style={styles.infoText}>Tempo estimado: {tempoEstimado}</Text>
          </View>
        </View>
 {/* Tipo de Entrega */}
<View style={styles.secao}>
  <Text style={styles.subtitulo}>Tipo de Entrega</Text>
  <View style={styles.tipoEntregaContainer}>
    <Icon 
      name={produto.tipoEntrega === 'entrega' ? 'local-shipping' : 'store'} 
      size={24} 
      color="#425010" 
    />
    <Text style={styles.tipoEntregaText}>
      {produto.tipoEntrega === 'entrega' ? 'Entrega em Casa' : 'Retirada na Feira'}
    </Text>
  </View>
  
  {produto.tipoEntrega === 'retirada' && (
    <Text style={styles.infoRetirada}>
      Local de retirada: Feira Local - Endereço da Feira
    </Text>
  )}
</View>
        {/* Resumo do Produto */}
        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Resumo do Pedido</Text>
          
          <View style={styles.produtoResumo}>
            <Image source={produto.imagem} style={styles.imagemResumo} />
            <View style={styles.produtoInfo}>
              <Text style={styles.nomeProduto}>{produto.nome || "Produto"}</Text>
              <Text style={styles.detalhesProduto}>
                Quantidade: {produto.quantidade || 1}
              </Text>
              <Text style={styles.detalhesProduto}>
                {produto.preco || "R$0,00"} cada
              </Text>
            </View>
          </View>

          {produto.observacao && (
            <View style={styles.observacaoContainer}>
              <Text style={styles.observacaoLabel}>Observações:</Text>
              <Text style={styles.observacaoText}>{produto.observacao}</Text>
            </View>
          )}
        </View>

        {/* Endereço de Entrega */}
        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Endereço de Entrega</Text>
          <View style={styles.enderecoContainer}>
            <Icon name="location-on" size={20} color="#425010" style={styles.enderecoIcon} />
            <View style={styles.enderecoInfo}>
              <Text style={styles.enderecoText}>
                {produto.endereco?.rua || "Endereço não informado"}
              </Text>
              <Text style={styles.enderecoText}>
                {produto.endereco?.cidade || ""} - {produto.endereco?.cep || ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Método de Pagamento */}
        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Método de Pagamento</Text>
          <View style={styles.metodoContainer}>
            <Icon 
              name={
                produto.metodoPagamento === 'pix' ? 'qr-code' : 
                produto.metodoPagamento === 'dinheiro' ? 'attach-money' : 
                'credit-card'
              } 
              size={24} 
              color="#425010" 
            />
            <Text style={styles.metodoText}>
              {formatarMetodoPagamento(produto.metodoPagamento)}
            </Text>
          </View>
        </View>

        {/* Detalhes do Pagamento */}
        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Detalhes do Pagamento</Text>
          
          <View style={styles.linhaPagamento}>
            <Text style={styles.labelPagamento}>Subtotal:</Text>
            <Text style={styles.valorPagamento}>R$ {subtotal.toFixed(2).replace(".", ",")}</Text>
          </View>
          
          <View style={styles.linhaPagamento}>
            <Text style={styles.labelPagamento}>Taxa de entrega:</Text>
            <Text style={styles.valorPagamento}>R$ {taxaEntrega.toFixed(2).replace(".", ",")}</Text>
          </View>
          
          <View style={styles.divisor} />
          
          <View style={styles.linhaPagamento}>
            <Text style={styles.labelTotal}>Total:</Text>
            <Text style={styles.valorTotal}>R$ {total.replace(".", ",")}</Text>
          </View>
        </View>

        {/* Botão Pagar Agora */}
        <TouchableOpacity 
          style={styles.botaoPagar} 
          onPress={handlePagarAgora}
        >
          <Icon name="payment" size={24} color="#FFF" style={styles.botaoIcon} />
          <Text style={styles.botaoTexto}>Pagar Agora</Text>
        </TouchableOpacity>

      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, padding: 20, minHeight: "100%" },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#425010', 
    marginLeft: 20 
  },
  
  // Informações do pedido
  infoPedidoContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  
  // Seções
  secao: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#425010',
    marginBottom: 15,
  },
  
  // Produto
  produtoResumo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagemResumo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 15,
    borderRadius: 8,
  },
  produtoInfo: {
    flex: 1,
  },
  nomeProduto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detalhesProduto: {
    fontSize: 14,
    color: '#666',
  },
  
  // Observações
  observacaoContainer: {
    backgroundColor: '#F7F0CE',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#425010',
  },
  observacaoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#425010',
    marginBottom: 4,
  },
  observacaoText: {
    fontSize: 14,
    color: '#333',
  },
  
  // Endereço
  enderecoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  enderecoIcon: {
    marginRight: 12,
  },
  enderecoInfo: {
    flex: 1,
  },
  enderecoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  
  // Método de pagamento
  metodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  metodoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#425010',
    marginLeft: 12,
  },
  
  // Detalhes do pagamento
  linhaPagamento: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelPagamento: {
    fontSize: 16,
    color: '#666',
  },
  valorPagamento: {
    fontSize: 16,
    color: '#333',
  },
  divisor: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  labelTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#425010',
  },
  valorTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#425010',
  },
  
  // Botão Pagar
  botaoPagar: {
    backgroundColor: '#425010',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  botaoIcon: {
    marginRight: 10,
  },
  botaoTexto: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipoEntregaContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 15,
  backgroundColor: '#f9f9f9',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ddd',
},
tipoEntregaText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#425010',
  marginLeft: 12,
},
infoRetirada: {
  fontSize: 14,
  color: '#666',
  marginTop: 8,
  fontStyle: 'italic',
},
});