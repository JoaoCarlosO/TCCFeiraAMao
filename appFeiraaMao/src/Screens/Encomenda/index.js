import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Home({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.containerHeader}>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <MaterialIcons name="menu" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Conteúdo da tela aqui */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E1C3"
  },

  header: {
    backgroundColor: "#F2C844",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.1,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 5 },
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    height: 85,
    justifyContent: "center",
  },

  containerHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  menu: {
    position: "absolute",
    left: 15,
    top: -5,
  },
});
