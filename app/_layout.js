import { Stack } from 'expo-router';
import { MissionProvider } from '../context/MissionContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <MissionProvider>
      <StatusBar style="light" backgroundColor="#0a0e1a" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </MissionProvider>
  );
}
