import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { BookProvider } from './src/context/BookContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <BookProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </BookProvider>
    </SafeAreaProvider>
  );
};

export default App;
