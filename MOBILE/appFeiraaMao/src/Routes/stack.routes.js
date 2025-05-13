
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import DrawerRoutes from './drawer.routes';

import Home from './screens/Home';
import Cadastro from './screens/Cadastro';


const Stack = createNativeStackNavigator();

function StackNavigator(){
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>   

            <Stack.Screen name="Home" component={DrawerRoutes} />                     
            <Stack.Screen name="Cadastro" component={Cadastro} /> 
          
        </Stack.Navigator>
    )
}

function AppRoutes(){
    return(
        <NavigationContainer>
        <DrawerRoutes />
      </NavigationContainer>
    )
}
export default AppRoutes;