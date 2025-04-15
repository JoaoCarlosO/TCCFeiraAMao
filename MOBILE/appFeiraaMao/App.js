import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./src/Telas/Home";
import Perfil from "./src/Telas/Perfil";
import Cadastro from "./src/Telas/Cadastro";
import Login from "./src/Telas/Login";
import SplashScreen from "./src/Telas/Splash";

import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          color = "#d0d";
          size = 30;
          if (route.name === "Home") {
            iconName = focused ? "home-outline" : "home-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person-outline" : "person-outline";
          } else if (route.name === "Login") {
            iconName = focused ? "person-outline" : "person-outline";
          } else if (route.name === "Cadastro") {
            iconName = focused ? "person-outline" : "person-outline";
          }

          //aqui define os ícones que irão aparecer nas Tabs
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        labelStyle: {
          fontSize: 12,
        },
        activeTintColor: "#3f64c7",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Cadastro" component={Cadastro}></Tab.Screen>
      <Tab.Screen name="Login" component={Login}></Tab.Screen>
      <Tab.Screen name="Perfil" component={Perfil}></Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Perfil"
          component={Tabs}
          options={{
            title: "Meu Aplicativo",
            headerStyle: {
              backgroundColor: "#D80303",
            },
            headerTintColor: "#FFF",
            headerShown: true,
          }}
        ></Stack.Screen>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
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
