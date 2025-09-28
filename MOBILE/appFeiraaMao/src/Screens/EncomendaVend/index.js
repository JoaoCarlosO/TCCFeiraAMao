import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
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
    detalhe: "", // sem detalhes
  },
  {
    id: "2",
    cliente: "Aiko Miyuki",
    avatar: require("../../../assets/img/japonesa.png"),
    status: "Pendente",
    total: 85.0,
    detalhe: "", // sem detalhes
  },
  {
    id: "3",
    cliente: "Anahi Caiapó",
    avatar: require("../../../assets/img/Anahi.png"),
    status: "Aceito",
    total: 42.7,
    detalhe: "📝 Pedido especial: Açaí sem doces, apenas o natural.",
  },
];

const historicoEncomendas = [
  {
    id: "4",
    cliente: "Carlos Alberto Almeida",
    avatar: require("../../../assets/img/imgcalvo.png"),
    status: "Entregue",
    total: 70.0,
    detalhe: "", 
  },
  {
    id: "5",
    cliente: "Marcos Antonio Braga",
    avatar: require("../../../assets/img/familis.png"),
    status: "Recusado",
    total: 90.0,
    detalhe: "", 
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
    const pedido = [...encomendas, ...historicoEncomendas].find((p) => p.id === id);
    let mensagem = `Detalhes do pedido ${id}`;
    if (pedido?.detalhe) {
      mensagem += `\n\n${pedido.detalhe.replace("📝 ", "")}`;
    }
    Alert.alert("Detalhes", mensagem);
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

          {/* Mostra o detalhe se existir */}
          {item.detalhe ? (
            <View style={styles.detalheContainer}>
              <Text style={styles.detalheTexto}>{item.detalhe}</Text>
            </View>
          ) : null}

          <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
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

          {item.detalhe ? (
            <View style={styles.detalheContainer}>
              <Text style={styles.detalheTexto}>{item.detalhe}</Text>
            </View>
          ) : null}

          <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
          <Text style={styles.total}>Total: R$ {item.total.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  const listaCompleta = [
    ...encomendas.filter((e) => e.status !== "Entregue" && e.status !== "Recusado"),
    ...historicoEncomendas,
  ];

  return (
    <ImageBackground
      source={require("../../../assets/img/fundo-perfil.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <FlatList
          data={listaCompleta}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            encomendas.find((e) => e.id === item.id)
              ? renderEncomenda({ item })
              : renderHistorico({ item })
          }
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Text style={styles.tituloHeader}>ENCOMENDAS</Text>
              </View>
              <Text style={styles.subtitulo}>
                Pedidos pendentes para sua barraca
              </Text>
              {encomendas.filter((e) => e.status === "Pendente").length === 0 && (
                <Text style={styles.semPedidos}>Nenhum pedido pendente.</Text>
              )}
            </>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 15,
    backgroundColor: "rgba(90, 110, 36, 0.85)",
  },
  header: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "rgba(66, 80, 16, 0.9)",
    borderRadius: 10,
    padding: 10,
  },
  tituloHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F8F8F8",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F8F8F8",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  semPedidos: {
    fontSize: 14,
    color: "#E0E0E0",
    marginBottom: 10,
    fontStyle: "italic",
    textAlign: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#5A6E24",
  },
  textos: {
    flex: 1,
  },
  cliente: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  detalheContainer: {
    backgroundColor: "#FFF3CD",
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FFEEBA",
    marginBottom: 4,
  },
  detalheTexto: {
    fontSize: 13,
    color: "#856404",
  },
  status: {
    fontSize: 14,
    marginVertical: 2,
    fontWeight: "500",
  },
  total: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#5A6E24",
    marginTop: 3,
  },
  botoesRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
  },
  botao: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoAceitar: {
    backgroundColor: "#316533ff",
  },
  botaoRecusar: {
    backgroundColor: "#b52e24ff",
  },
  botaoDetalhes: {
    backgroundColor: "#FFC107",
  },
  textoBotao: {
    fontWeight: "600",
    color: "#FFF",
    fontSize: 14,
  },
});
