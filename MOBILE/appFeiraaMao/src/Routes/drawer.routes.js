import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './screens/Home';
import CustomDrawer from './components/CustomDrawer';
import Cadastro from './screens/Cadastro';

const Drawer = createDrawerNavigator();

const DrawerRoutes = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVendorStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('isVendor');
        console.log('Valor de isVendor no AsyncStorage:', status); // 🔍 debug
      } catch (error) {
        console.error('Erro ao ler isVendor:', error);
      } finally {
        setLoading(false);
      }
    };

    checkVendorStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#425010" />
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          width: 250,
          height: '100%',
          justifyContent: 'center',
          backgroundColor: '#f2f2f2',
          zIndex: 11,
        },
      }}
      drawerContent={props => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen name="Cadastro" component={Cadastro} />
    </Drawer.Navigator>
  );
};

export default DrawerRoutes;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
