import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login'); // troca pra tela principal após 3 segundos
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../assets/img/splash.png')} style={styles.imgBg} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBg: {
    width: "100%",
    height: "100%",
    opacity: 1,
  },
});

export default SplashScreen;
