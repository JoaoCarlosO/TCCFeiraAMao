import "react-native-gesture-handler";
import React from "react";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "react-native-reanimated";

import Home from "./src/Screens/Home";
import Notificacao from "./src/Screens/Notificacao";
import Cadastro from "./src/Screens/Cadastro";
import Login from "./src/Screens/Login";
import SplashScreen from "./src/Screens/Splash";
import Perfil from "./src/Screens/Perfil";
import Pedido from "./src/Screens/Pedido";
import Encomenda from "./src/Screens/Encomenda";
import Alterar from "./src/Screens/Perfil/Alterar";
import CadVend from "./src/Screens/Perfil/cadvend";
import TipoLoja from "./src/Screens/Perfil/tipoloja";
import CadCPF from "./src/Screens/Perfil/CadCPF";
import CadCNPJ from "./src/Screens/Perfil/CadCNPJ";
import Carrinho from "./src/Screens/Carrinho";

import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

 
   function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "white",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: "#F2C844",
          borderTopWidth: 0,
          height: 75,
          position: "absolute",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          color = focused ? "#425010" : "#fff";
          size = 30;

          switch (route.name) {
            case "Perfil":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Carrinho":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Notificacao":
              iconName = focused ? "notifications" : "notifications-outline";
              break;
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Pedido":
              iconName = focused ? "bag" : "bag-outline";
              break;
            case "Encomenda":
              iconName = focused ? "cube" : "cube-outline";
              break;
            default:
              iconName = "alert-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Pedido" component={Pedido} />
      <Tab.Screen name="Encomenda" component={Encomenda} />
      <Tab.Screen name="Notificacao" component={Notificacao} />
      <Tab.Screen name="Carrinho" component={Carrinho} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}


function DrawerRoutes() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Tabs" component={Tabs} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "MontserratAlternates-Regular": require("./assets/fonts/MontserratAlternates-Regular.ttf"),
    "Urbanist-Regular": require("./assets/fonts/Urbanist-Regular.ttf"),
    "ABeeZee": require("./assets/fonts/ABeeZee-Regular.ttf"),
    "Poppins": require("./assets/fonts/Poppins-Regular.ttf"),
    "MouseMemoirs": require("./assets/fonts/MouseMemoirs-Regular.ttf"),
    "PTSans": require("./assets/fonts/PTSans-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Encomenda"
              component={Encomenda}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Pedido"
              component={Pedido}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Perfil"
              component={Perfil}
              options={{ headerShown: false, tabBarStyle: false }}
            />
            <Stack.Screen
              name="Notificacao"
              component={Notificacao}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cadastro"
              component={Cadastro}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CadCPF"
              component={CadCPF}
              options={{
                headerShown: true,
                headerTintColor: "#FFFFFF",
                headerStyle: {
                  backgroundColor: "#425010",
                  height: 70,
                },
              }}
            /><Stack.Screen
              name="CadCNPJ"
              component={CadCNPJ}
              options={{
                headerShown: true,
                headerTintColor: "#FFFFFF",
                headerStyle: {
                  backgroundColor: "#425010",
                  height: 70,
                },
              }}
            />
            <Stack.Screen
              name="Alterar"
              component={Alterar}
              options={{
                headerShown: true,
                headerTintColor: "#FFFFFF",
                headerStyle: {
                  backgroundColor: "#425010",
                  height: 70,
                },
              }}
            />
            <Stack.Screen
              name="tipoloja"
              component={TipoLoja}
              options={{
                headerShown: true,
                headerTintColor: "#FFFFFF",
                headerStyle: {
                  backgroundColor: "#425010",
                  height: 70,
                },
              }}
            />
            <Stack.Screen
              name="cadvend"
              component={CadVend}
              options={{
                headerShown: true,
                headerTintColor: "#FFFFFF",
                headerStyle: {
                  backgroundColor: "#425010",
                  height: 70,
                },
              }}
            />

            <Stack.Screen
              name="Home"
              component={DrawerRoutes}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Carrinho"
              component={Carrinho}
              options={{
                headerShown: true,
                headerTintColor: "#FFFFFF",
                headerStyle: {
                  backgroundColor: "#425010",
                  height: 70,
                },
              }}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
