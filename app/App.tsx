import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useAuthentication from "./hooks/useAuthentication";
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import SignInScreen from "./screens/SignInScreen";
import useNotifications from "./hooks/useNotifications";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  // TODO Move to real authentication service
  const isLoggedIn = useAuthentication();

  useNotifications();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        {isLoggedIn ? <Navigation colorScheme={colorScheme} /> : <SignInScreen />}
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
