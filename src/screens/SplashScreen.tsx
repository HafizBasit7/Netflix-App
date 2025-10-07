import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Main');
    }, 2500);
  }, []);

  return (
    <LinearGradient
      colors={['#141414', '#E50914']}
      style={styles.container}
    >
      <Text style={styles.logo}>N</Text>
      <Text style={styles.title}>NETFLIX</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#E50914',
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E50914',
    marginTop: 20,
    letterSpacing: 4,
  },
});

export default SplashScreen;