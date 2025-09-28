import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import Home from "../Screens/Home";
import Pedido from "../Screens/Pedido";
import Encomenda from "../Screens/Encomenda";
import Notificacao from "../Screens/Notificacao";
import Carrinho from "../Screens/Carrinho";
import Perfil from "../Screens/Perfil";

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        drawerStyle: {
          backgroundColor: "#F4C542", // fundo amarelo
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: "bold",
        },
        drawerActiveTintColor: "#333",
        drawerInactiveTintColor: "white",
        drawerIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Pedidos":
              iconName = "bag";
              break;
            case "Encomendas":
              iconName = "cube";
              break;
            case "Notificações":
              iconName = "notifications";
              break;
            case "Carrinho":
              iconName = "cart";
              break;
            case "Meu Perfil":
              iconName = "person";
              break;
            default:
              iconName = "ellipse"; // fallback
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Pedidos" component={Pedido} />
      <Drawer.Screen name="Encomendas" component={Encomenda} />
      <Drawer.Screen name="Notificações" component={Notificacao} />
      <Drawer.Screen name="Carrinho" component={Carrinho} />
      <Drawer.Screen name="Meu Perfil" component={Perfil} />
    </Drawer.Navigator>
  );
}
