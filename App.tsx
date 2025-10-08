import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { NetflixColors } from './src/styles/theme';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={NetflixColors.background} 
      />
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default App;