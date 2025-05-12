import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./src/Screens/Home";
import Perfil from "./src/Screens/Perfil";
import Cadastro from "./src/Screens/Cadastro";
import Login from "./src/Screens/Login";
import SplashScreen from "./src/Screens/Splash";

import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          color = "#F2C844";
          size = 30;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          } else if (route.name === "Login") {
            iconName = focused ? "log-in" : "log-in-outline";
          } else if (route.name === "Cadastro") {
            iconName = focused ? "create" : "create-outline";
          }

          //aqui define os ícones que irão aparecer nas Tabs
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarStyle={{
        labelStyle: {
          fontSize: 12,
        },
        activeTintColor: "#3f64c7",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Home" component={Home}></Tab.Screen>
      <Tab.Screen name="Perfil" component={Perfil}></Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const Stack = createStackNavigator();

  const [fontsLoaded] = useFonts({
    "MontserratAlternates-Regular": require("./assets/fonts/MontserratAlternates-Regular.ttf"),
    "Urbanist-Regular": require("./assets/fonts/Urbanist-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
  name="Home"
  component={Tabs}
  options={{
    headerShown: true,
    headerTintColor: "#FFFFFF",
    headerStyle: {
      backgroundColor: "#425010",
      height:70
    },
    headerTitleStyle: {
      marginTop: -20, // Ajuste esse valor conforme a altura desejada
    },
  }}
/>

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen name="Perfil" component={Perfil}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
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
