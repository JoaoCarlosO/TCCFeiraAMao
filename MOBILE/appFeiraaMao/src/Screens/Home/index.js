import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Home({ route, navigation }) {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.containerHeader}>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => navigation.openDrawer()}
            >
              <MaterialIcons name="menu" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
          flex: 1,
      },
  
      header:{
          
          backgroundColor: '#425010',
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowOpacity: 0.1,
          elevation: 6,
          shadowRadius: 15,
          shadowOffset : { width: 1, height: 5},
          borderBottomRightRadius: 5,
          borderBottomLeftRadius: 5,
          height: 85,
      },
  
      menu:{
          position: 'absolute',
          left: 20,
          alignSelf: "center",
          top: 35,
      },

      containerHeader:{
          flexDirection: 'row',
          justifyContent: "center",
          alignItems: "center",
      },
  
      titleTasks:{
          flexDirection: 'row',
          marginBottom: 5,
          marginTop: 50,
      },
  
      
      logout:{
          position: 'absolute',
          right: 0,
          color: "#fff",
          alignSelf: "center"
      },
  

});
