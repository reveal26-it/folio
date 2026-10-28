import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { seedDevBibleOnce } from '../src/dev/seed';

export default function RootLayout() {
  useEffect(() => { seedDevBibleOnce().catch(console.error); }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="reader/[bookId]" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}