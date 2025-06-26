import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const encomendasIniciais = [
  {
    id: "1",
    cliente: "Luiza de Andrade",
    avatar: require("../../../assets/img/jovem.png"),
    status: "Pendente",
    total: 120.5,
  },
  {
    id: "2",
    cliente: "Aiko Miyuki",
    avatar: require("../../../assets/img/japonesa.png"),
    status: "Pendente",
    total: 85.0,
  },
  {
    id: "3",
    cliente: "Anahi Caiapó",
    avatar: require("../../../assets/img/Anahi.png"),
    status: "Aceito",
    total: 42.7,
  },
];

const historicoEncomendas = [
  {
    id: "4",
    cliente: "Carlos Alberto Almeida",
    avatar: require("../../../assets/img/imgcalvo.png"),
    status: "Entregue",
    total: 70.0,
  },
  {
    id: "5",
    cliente: "Marcos Antonio Braga",
    avatar: require("../../../assets/img/familis.png"),
    status: "Recusado",
    total: 90.0,
  },
];

export default function EncomendasVendedor() {
  const navigation = useNavigation();
  const [encomendas, setEncomendas] = useState(encomendasIniciais);

  const aceitarPedido = (id) => {
    setEncomendas((prev) =>
      prev.map((encomenda) =>
        encomenda.id === id ? { ...encomenda, status: "Aceito" } : encomenda
      )
    );
  };

  const recusarPedido = (id) => {
    setEncomendas((prev) =>
      prev.map((encomenda) =>
        encomenda.id === id ? { ...encomenda, status: "Recusado" } : encomenda
      )
    );
  };

  const irParaDetalhes = (id) => {
    Alert.alert("Detalhes", `Detalhes do pedido ${id} ainda não implementados.`);
  };

  const renderEncomenda = ({ item }) => {
    const statusColor =
      item.status === "Pendente"
        ? "#a3964d"
        : item.status === "Aceito"
        ? "#25573e"
        : item.status === "Recusado"
        ? "#8c1818"
        : "#CDA527";

    return (
      <View style={styles.card}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.textos}>
          <Text style={styles.cliente}>{item.cliente}</Text>
          <Text style={[styles.status, { color: statusColor }]}>
            {item.status}
          </Text>
          <Text style={styles.total}>Total: R$ {item.total.toFixed(2)}</Text>

          <View style={styles.botoesRow}>
            {item.status === "Pendente" && (
              <>
                <TouchableOpacity
                  style={[styles.botao, styles.botaoAceitar]}
                  onPress={() => aceitarPedido(item.id)}
                >
                  <Text style={styles.textoBotao}>Aceitar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botao, styles.botaoRecusar]}
                  onPress={() => recusarPedido(item.id)}
                >
                  <Text style={styles.textoBotao}>Recusar</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.botao, styles.botaoDetalhes]}
              onPress={() => irParaDetalhes(item.id)}
            >
              <Text style={styles.textoBotao}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderHistorico = ({ item }) => {
    const statusColor =
      item.status === "Entregue"
        ? "#25573e"
        : item.status === "Recusado"
        ? "#8c1818"
        : "#105c15";

    return (
      <View style={[styles.card, { backgroundColor: "#EFEFEF" }]}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.textos}>
          <Text style={styles.cliente}>{item.cliente}</Text>
          <Text style={[styles.status, { color: statusColor }]}>
            {item.status}
          </Text>
          <Text style={styles.total}>Total: R$ {item.total.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={require("../../../assets/img/fundo-perfil.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.tituloHeader}>ENCOMENDAS</Text>
          </View>

          <Text style={styles.subtitulo}>Pedidos pendentes para sua barraca</Text>

          {encomendas.filter(e => e.status === "Pendente").length === 0 && (
            <Text style={styles.semPedidos}>Nenhum pedido pendente.</Text>
          )}

          <FlatList
            data={encomendas.filter(e => e.status !== "Entregue" && e.status !== "Recusado")}
            keyExtractor={(item) => item.id}
            renderItem={renderEncomenda}
            contentContainerStyle={{ paddingBottom: 10 }}
          />

          <Text style={styles.subtitulo}>Histórico de encomendas</Text>

          <FlatList
            data={historicoEncomendas}
            keyExtractor={(item) => item.id}
            renderItem={renderHistorico}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 15,
    backgroundColor: 'rgba(90, 110, 36, 0.85)', // Verde com 85% de opacidade
  },
  header: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: 'rgba(66, 80, 16, 0.9)', // Verde mais escuro com transparência
    borderRadius: 10,
    padding: 10,
  },
  tituloHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F8F8F8", // Branco mais suave
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600", // Semi-bold
    color: "#F8F8F8", // Branco mais suave
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  semPedidos: {
    fontSize: 14,
    color: "#E0E0E0", // Cinza claro em vez de cinza escuro
    marginBottom: 10,
    fontStyle: "italic",
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fundo branco semi-transparente
    borderRadius: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Branco com 90% de opacidade
    padding: 12,
    borderRadius: 10, // Bordas mais arredondadas
    marginBottom: 10,
    alignItems: "center",
    elevation: 3, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatar: {
    width: 60, // Aumentei um pouco o tamanho
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#5A6E24', // Borda verde
  },
  textos: {
    flex: 1,
  },
  cliente: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Texto escuro para melhor contraste
    marginBottom: 3,
  },
  status: {
    fontSize: 14,
    marginVertical: 2,
    fontWeight: '500',
  },
  total: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#5A6E24", // Verde em vez de amarelo
    marginTop: 3,
  },
  botoesRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: 'space-between',
  },
  botao: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoAceitar: {
    backgroundColor: "#4CAF50", // Verde mais vibrante
  },
  botaoRecusar: {
    backgroundColor: "#F44336", // Vermelho mais vibrante
  },
  botaoDetalhes: {
    backgroundColor: "#FFC107", // Amarelo mais vibrante
  },
  textoBotao: {
    fontWeight: "600",
    color: "#FFF", // Texto branco para melhor contraste
    fontSize: 14,
  },
});