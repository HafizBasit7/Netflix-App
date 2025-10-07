import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { NetflixColors } from './src/styles/theme';
import { ThemeProvider } from './src/theme/ThemeProvider';

const App = () => {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={NetflixColors.background} 
      />
         <ThemeProvider>
      <AppNavigator />
      </ThemeProvider>
    </>
  );
};

export default App;