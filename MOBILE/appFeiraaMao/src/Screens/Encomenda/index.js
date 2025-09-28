import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Linking } from "react-native";
import { Animated } from "react-native";

export default function Encomenda({ route, navigation }) {
  const produto = route?.params?.produto;
  const [metodoSelecionado, setMetodoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("entrega"); // 'entrega' ou 'retirada'
  const [endereco, setEndereco] = useState({
    rua: 'Rua das flores, 123',
    cidade: 'São Paulo',
    cep: '01234-567'
  });
  const [editandoEndereco, setEditandoEndereco] = useState(false);

  const metodos = [
    { id: "pix", nome: "PIX", icon: 'qr-code' },
    { id: "dinheiro", nome: "Dinheiro", icon: 'attach-money' },
    { id: "cartao", nome: "Cartão via WhatsApp", icon: 'credit-card' },
  ];

  const handleEditarEndereco = () => {
    setEditandoEndereco(true);
  };

  const handleSalvarEndereco = () => {
    setEditandoEndereco(false);
  };

  if (!produto) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Produto não encontrado 😢</Text>
      </View>
    );
  }

  const precoNumerico = parseFloat(produto.preco.replace("R$", "").replace(",", "."));
  const taxaEntrega = tipoEntrega === "entrega" ? 5.00 : 0.00;
  const total = (precoNumerico * quantidade + taxaEntrega).toFixed(2);

  const aumentarQuantidade = () => setQuantidade(quantidade + 1);
  const diminuirQuantidade = () => {
    if (quantidade > 1) setQuantidade(quantidade - 1);
  };

  const finalizarPedido = () => {
    if (!metodoSelecionado) {
      alert("Selecione um método de pagamento, por favor!");
      return;
    }

    // Para pagamento com cartão (WhatsApp)
    if (metodoSelecionado === "cartao") {
      const telefone = "55DDDNUMEROAQUI";
      const tipo = tipoEntrega === "entrega" ? "Entrega em Casa" : "Retirada na Feira";
      const enderecoInfo = tipoEntrega === "entrega" 
        ? `Endereço: ${endereco.rua}, ${endereco.cidade} - ${endereco.cep}`
        : "Retirada: Feira Local - Endereço da Feira";
      
      const mensagem = `Olá! Quero fazer um pedido 💳.
Produto: ${produto.nome}
Quantidade: ${quantidade}
Tipo de Entrega: ${tipo}
${enderecoInfo}
Total: R$${total.replace(".", ",")}
Observações: ${observacao || "Nenhuma"}
`;
      const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

      Linking.openURL(url)
        .catch(() => alert("Não foi possível abrir o WhatsApp 😢"));
      return;
    }

    // Para PIX e Dinheiro, navega para a tela de Pagamento
    navigation.navigate("Pagamentos", {
      produto: {
        ...produto,
        quantidade,
        observacao,
        metodoPagamento: metodoSelecionado,
        total: `R$${total.replace(".", ",")}`,
        endereco: endereco,
        precoUnitario: produto.preco,
        tipoEntrega: tipoEntrega,
        taxaEntrega: taxaEntrega
      }
    });
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
          <Text style={styles.titulo}>Finalizar Pedido</Text>
        </View>

        {/* Produto */}
        <View style={styles.cardProduto}>
          <Image source={produto.imagem} style={styles.imagem} />
          <View style={styles.infoProduto}>
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.descricao}>{produto.descricao}</Text>
            <Text style={styles.preco}>{produto.preco}</Text>
          </View>
        </View>

        {/* Tipo de Entrega */}
        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Tipo de Entrega</Text>
          
          <View style={styles.tipoEntregaContainer}>
            <TouchableOpacity
              style={[
                styles.botaoTipoEntrega,
                tipoEntrega === "entrega" && styles.tipoEntregaSelecionado
              ]}
              onPress={() => setTipoEntrega("entrega")}
            >
              <Icon 
                name="local-shipping" 
                size={24} 
                color={tipoEntrega === "entrega" ? "#FFF" : "#425010"} 
              />
              <Text style={[
                styles.textoTipoEntrega,
                tipoEntrega === "entrega" && styles.textoSelecionado
              ]}>
                Entregar em Casa
              </Text>
              <Text style={styles.taxaEntregaText}>
                + R$ 5,00
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.botaoTipoEntrega,
                tipoEntrega === "retirada" && styles.tipoEntregaSelecionado
              ]}
              onPress={() => setTipoEntrega("retirada")}
            >
              <Icon 
                name="store" 
                size={24} 
                color={tipoEntrega === "retirada" ? "#FFF" : "#425010"} 
              />
              <Text style={[
                styles.textoTipoEntrega,
                tipoEntrega === "retirada" && styles.textoSelecionado
              ]}>
                Retirar na Feira
              </Text>
              <Text style={styles.taxaEntregaText}>
                Grátis
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Endereço de Entrega (só mostra se for entrega em casa) */}
        {tipoEntrega === "entrega" && (
          <View style={styles.secao}>
            <Text style={styles.subtitulo}>Endereço de Entrega</Text>
            
            {editandoEndereco ? (
              <View style={styles.enderecoEditContainer}>
                <TextInput
                  style={styles.input}
                  value={endereco.rua}
                  onChangeText={(text) => setEndereco({...endereco, rua: text})}
                  placeholder="Rua e número"
                />
                <TextInput
                  style={styles.input}
                  value={endereco.cidade}
                  onChangeText={(text) => setEndereco({...endereco, cidade: text})}
                  placeholder="Cidade"
                />
                <TextInput
                  style={styles.input}
                  value={endereco.cep}
                  onChangeText={(text) => setEndereco({...endereco, cep: text})}
                  placeholder="CEP"
                />
                <TouchableOpacity 
                  style={styles.salvarButton}
                  onPress={handleSalvarEndereco}
                >
                  <Text style={styles.salvarButtonText}>Salvar Endereço</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.enderecoContainer}
                onPress={handleEditarEndereco}
              >
                <Icon name="location-on" size={20} color="#666" style={styles.enderecoIcon} />
                <View style={styles.enderecoTextContainer}>
                  <Text style={styles.enderecoText}>{endereco.rua}</Text>
                  <Text style={styles.enderecoText}>{endereco.cidade} - {endereco.cep}</Text>
                </View>
                <Icon name="edit" size={18} color="#007AFF" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Quantidade */}
        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Quantidade</Text>
          <View style={styles.quantidadeContainer}>
            <TouchableOpacity style={styles.botaoQuantidade} onPress={diminuirQuantidade}>
              <Icon name="remove" size={20} color="#425010" />
            </TouchableOpacity>

            <Text style={styles.quantidade}>{quantidade}</Text>

            <TouchableOpacity style={styles.botaoQuantidade} onPress={aumentarQuantidade}>
              <Icon name="add" size={20} color="#425010" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Observações */}
        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Observações</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Alguma observação sobre o pedido?"
            value={observacao}
            onChangeText={setObservacao}
          />
        </View>

        {/* Métodos de Pagamento */}
        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Método de Pagamento</Text>
          {metodos.map((metodo) => (
            <TouchableOpacity
              key={metodo.id}
              style={[
                styles.botaoMetodo,
                metodoSelecionado === metodo.id && styles.metodoSelecionado,
              ]}
              onPress={() => setMetodoSelecionado(metodo.id)}
            >
              <View style={styles.metodoLeft}>
                <Icon 
                  name={metodo.icon} 
                  size={24} 
                  color={metodoSelecionado === metodo.id ? '#FFF' : '#425010'} 
                  style={styles.metodoIcon}
                />
                <Text
                  style={[
                    styles.textoMetodo,
                    metodoSelecionado === metodo.id && styles.textoSelecionado,
                  ]}
                >
                  {metodo.nome}
                </Text>
              </View>
              
              <View style={[
                styles.checkbox,
                metodoSelecionado === metodo.id && styles.checkboxSelecionado
              ]}>
                {metodoSelecionado === metodo.id && (
                  <Icon name="check" size={16} color="#FFF" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Resumo do Pedido */}
        <View style={styles.resumo}>
          <View style={styles.linhaResumo}>
            <Text style={styles.textoResumo}>Subtotal:</Text>
            <Text style={styles.valorResumo}>R$ {(precoNumerico * quantidade).toFixed(2).replace(".", ",")}</Text>
          </View>
          
          {tipoEntrega === "entrega" && (
            <View style={styles.linhaResumo}>
              <Text style={styles.textoResumo}>Taxa de entrega:</Text>
              <Text style={styles.valorResumo}>R$ 5,00</Text>
            </View>
          )}
          
          <View style={styles.linhaResumo}>
            <Text style={styles.textoTotal}>Total:</Text>
            <Text style={styles.valorTotal}>R$ {total.replace(".", ",")}</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.botaoFinalizar,
              !metodoSelecionado && styles.botaoDesabilitado
            ]} 
            onPress={finalizarPedido}
            disabled={!metodoSelecionado}
          >
            <Text style={styles.textoBotao}>
              {metodoSelecionado === "cartao" ? "Enviar para WhatsApp" : "Ir para Pagamento"}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, padding: 20, height: "100%" },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#425010', marginLeft: 20 },
  cardProduto: { backgroundColor: '#fff', borderRadius: 10, padding: 15, flexDirection: 'row', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  imagem: { width: 100, height: 100, resizeMode: 'contain', marginRight: 15 },
  infoProduto: { flex: 1, justifyContent: 'center' },
  nome: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  descricao: { fontSize: 14, color: '#666', marginBottom: 10 },
  preco: { fontSize: 20, fontWeight: 'bold', color: '#27ae60' },
  secao: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  subtitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#425010' },
  
  // Tipo de Entrega
  tipoEntregaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoTipoEntrega: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#425010',
    marginHorizontal: 5,
    backgroundColor: '#FFF',
  },
  tipoEntregaSelecionado: {
    backgroundColor: '#425010',
    borderColor: '#425010',
  },
  textoTipoEntrega: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#425010',
    marginTop: 5,
    textAlign: 'center',
  },
  textoSelecionado: {
    color: '#FFF',
  },
  taxaEntregaText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  
  // Endereço
  enderecoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  enderecoEditContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  enderecoIcon: {
    marginRight: 12,
  },
  enderecoTextContainer: {
    flex: 1,
  },
  enderecoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  salvarButton: {
    backgroundColor: '#425010',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  salvarButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  
  quantidadeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 120 },
  botaoQuantidade: { backgroundColor: '#F7F0CE', borderRadius: 20, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  quantidade: { fontSize: 18, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, minHeight: 80, textAlignVertical: 'top' },
  resumo: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  linhaResumo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  textoResumo: { fontSize: 16, color: '#555' },
  textoTotal: { fontSize: 18, fontWeight: 'bold', color: '#425010' },
  valorResumo: { fontSize: 16, color: '#333' },
  valorTotal: { fontSize: 20, fontWeight: 'bold', color: '#425010' },
  
  // Métodos de Pagamento
  botaoMetodo: { padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metodoSelecionado: { backgroundColor: "#425010", borderColor: "#425010" },
  metodoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  metodoIcon: { marginRight: 12 },
  textoMetodo: { fontSize: 16, color: "#333" },
  textoSelecionado: { color: "#fff", fontWeight: "bold" },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  checkboxSelecionado: { backgroundColor: '#FFF', borderColor: '#FFF' },
  
  botaoFinalizar: { backgroundColor: '#425010', borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 10 },
  botaoDesabilitado: { backgroundColor: '#ccc', opacity: 0.6 },
  textoBotao: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});