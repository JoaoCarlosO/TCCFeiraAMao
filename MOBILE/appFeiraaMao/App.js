import "react-native-gesture-handler";
import React from "react";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

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
import PerfilLoja from "./src/Screens/PerfilLoja";
import HomeVend from "./src/Screens/HomeVend";
import telaprodutosvend from "./src/Screens/telaprodutosvend";
import AdProdutosVend from "./src/Screens/AdProdutosVend";
import PerfilVend from "./src/Screens/PerfilVend";
import BarracaVend from "./src/Screens/PerfilVend/BarracaVend";
import AlterarVend from "./src/Screens/PerfilVend/AlterarVend";
import BarracaAlterar from "./src/Screens/PerfilVend/BarracaAlterar";
import NotificacaoVend from "./src/Screens/NotificacaoVend";
import EncomendaVend from "./src/Screens/EncomendaVend";
import Pagamento from "./src/Screens/Pagamento";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function ClienteTabs() {
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
            case "Meu Perfil":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Carrinho":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Notificações":
              iconName = focused ? "notifications" : "notifications-outline";
              break;
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Pedidos":
              iconName = focused ? "bag" : "bag-outline";
              break;
            case "Encomendas":
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
      <Tab.Screen name="Pedidos" component={Pedido} />
      <Tab.Screen name="Encomendas" component={Encomenda} />
      <Tab.Screen name="Notificações" component={Notificacao} />
      <Tab.Screen name="Carrinho" component={Carrinho} />
      <Tab.Screen name="Meu Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

function VendedorTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeVend"
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
            case "Meu Perfil (Vendedor)":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Meus Produtos":
              iconName = focused ? "list" : "list-outline";
              break;
            case "Notificações (Vendedor)":
              iconName = focused ? "notifications" : "notifications-outline";
              break;
            case "HomeVend":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Pedidos (Vendedor)":
              iconName = focused ? "bag" : "bag-outline";
              break;
            case "Encomendas (Vendedor)":
              iconName = focused ? "cube" : "cube-outline";
              break;
            default:
              iconName = "alert-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeVend" component={HomeVend} />
      <Tab.Screen name="Pedidos (Vendedor)" component={Pedido} />
      <Tab.Screen name="Encomendas (Vendedor)" component={EncomendaVend} />
      <Tab.Screen name="Notificações (Vendedor)" component={NotificacaoVend} />
      <Tab.Screen name="Meus Produtos" component={telaprodutosvend} />
      <Tab.Screen name="Meu Perfil (Vendedor)" component={PerfilVend} />
    </Tab.Navigator>
  );
}

function DrawerRoutes() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="ClienteTabs" component={ClienteTabs} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "MontserratAlternates-Regular": require("./assets/fonts/MontserratAlternates-Regular.ttf"),
    "Urbanist-Regular": require("./assets/fonts/Urbanist-Regular.ttf"),
    ABeeZee: require("./assets/fonts/ABeeZee-Regular.ttf"),
    Poppins: require("./assets/fonts/Poppins-Regular.ttf"),
    MouseMemoirs: require("./assets/fonts/MouseMemoirs-Regular.ttf"),
    PTSans: require("./assets/fonts/PTSans-Regular.ttf"),
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
              name="Cadastro"
              component={Cadastro}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CadCPF"
              component={CadCPF}
              options={headerConfig}
            />
            <Stack.Screen
              name="CadCNPJ"
              component={CadCNPJ}
              options={headerConfig}
            />
            <Stack.Screen
              name="PerfilLoja"
              component={PerfilLoja}
              options={headerConfig}
            />
            <Stack.Screen
              name="Alterar"
              component={Alterar}
              options={headerConfig}
            />
            <Stack.Screen
              name="tipoloja"
              component={TipoLoja}
              options={headerConfig}
            />
            <Stack.Screen
              name="cadvend"
              component={CadVend}
              options={headerConfig}
            />
            <Stack.Screen
              name="Home"
              component={DrawerRoutes}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Carrinho"
              component={Carrinho}
              options={headerConfig}
            />
            <Stack.Screen
              name="HomeVend"
              component={VendedorTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdProdutosVend"
              component={AdProdutosVend}
              options={headerConfig}
            />
            <Stack.Screen
              name="PerfilVend"
              component={PerfilVend}
              options={headerConfig}
            />
            <Stack.Screen
              name="telaprodutosvend"
              component={telaprodutosvend}
              options={headerConfig}
            />
            <Stack.Screen
              name="BarracaVend"
              component={BarracaVend}
              options={headerConfig}
            />
            <Stack.Screen
              name="AlterarVend"
              component={AlterarVend}
              options={headerConfig}
            />
            <Stack.Screen
              name="BarracaAlterar"
              component={BarracaAlterar}
              options={headerConfig}
            />
            <Stack.Screen
              name="NotificacaoVend"
              component={NotificacaoVend}
              options={headerConfig}
            />
            <Stack.Screen
              name="Pagamento"
              component={Pagamento}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EncomendaVend"
              component={EncomendaVend}
              options={headerConfig}
            />
            <Stack.Screen
              name="Pedido"
              component={Pedido}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Encomenda"
              component={Encomenda}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const headerConfig = {
  headerShown: true,
  hearderTitle: "",
  headerTintColor: "#FFFFFF",
  headerStyle: {
    backgroundColor: "#425010",
    height: 70,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
