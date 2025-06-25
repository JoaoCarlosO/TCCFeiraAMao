import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Carrinho() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Carrinho de Compras</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
