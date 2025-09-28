import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Pressable,
  Text,
  Dimensions,
  Image,
  Platform,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Controle = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../../assets/img/fundo-perfil.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#425010" />
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        {/* Logo dentro da box */}
        <Image
          source={require("../../../assets/img/logotcc.png")}
          style={styles.logo}
        />

        {/* Botões com texto em cima */}
        <View style={styles.buttonsContainer}>
          <ButtonGroup
            title="Acessar meu estoque de vendas"
            label="Verificar"
            onPress={() => navigation.navigate("Estoque")}
          />

          <ButtonGroup
            title="Acessar meu controle de vendas"
            label="Verificar"
            onPress={() => navigation.navigate("Vendas")}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const ButtonGroup = ({ title, label, onPress }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  return (
    <View style={styles.buttonGroup}>
      <Text style={styles.buttonTitle}>{title}</Text>
      <Animated.View style={{ transform: [{ scale: scale }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8 }, // efeito de clique
          ]}
        >
          <Text style={styles.buttonText}>{label}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  backgroundImage: {
    resizeMode: "cover",
  },

  // header corrigido (antes não existia)
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    zIndex: 10,
  },

  box: {
    width: "90%",
    backgroundColor: "rgba(64, 74, 34, 0.88)",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    resizeMode: "contain",
  },
  buttonsContainer: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonGroup: {
    alignItems: "center",
    marginBottom: 30,
  },
  buttonTitle: {
    color: "#f6f6cf",
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Helvetica" : "Roboto",
  },
  button: {
    width: width * 0.6,
    height: 60,
    backgroundColor: "#FFD966",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  buttonText: {
    color: "#264d00",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Controle;
