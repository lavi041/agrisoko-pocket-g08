import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { RootStackParamList } from './src/types';
import { colors } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import AskScreen from './src/screens/AskScreen';
import ResultScreen from './src/screens/ResultScreen';
import DirectoryScreen from './src/screens/DirectoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: colors.onPrimary, headerTitleStyle: { fontWeight: '800' } }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'AgriSoko Pocket' }} />
          <Stack.Screen name="Ask" component={AskScreen} options={{ title: 'Ask the team' }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Result' }} />
          <Stack.Screen name="Directory" component={DirectoryScreen} options={{ title: 'Directory' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About and evidence' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
