import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function AreaUsuario() {
  const navigation = useNavigation();
  const [user] = useState({
    name: "Kelly Soares",
    email: "Kelly.Soares35@example.com"
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.sellerButton}
            onPress={() => navigation.navigate("cadvend")}
          >
            <Ionicons name="storefront-outline" size={24} color="#425010" />
            <Text style={styles.sellerButtonText}>Torne-se vendedor</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.profileImage}>
            <Image
              source={require("../../../assets/img/iconperfil.jpg")}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </ScrollView>

      {/* Botões fixos no rodapé */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Alterar", { nome: user.name })}
        >
          <Text style={styles.buttonText}>Alterar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={[styles.buttonText, styles.logoutText]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E1C3',
  },
  scroll: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'flex-end',
  },
  sellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  sellerButtonText: {
    marginLeft: 8,
    color: '#425010',
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#E8E1C3',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#E8E1C3',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  button: {
    backgroundColor: '#425010',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: '100%',  // ou 'auto' se quiser ajustar ao texto
    alignItems: 'center',
    marginBottom: 10,  
    borderRadius: 20// espaço entre os botões
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#425010',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  
  logoutText: {
    color: '#425010',
  },
});
