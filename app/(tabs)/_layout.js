import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { T } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: T.tabBg,
          borderTopColor: T.tabBorder,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: T.tabActive,
        tabBarInactiveTintColor: T.tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Dashboard', tabBarIcon: () => <Text style={{fontSize:20}}>🛸</Text> }} />
      <Tabs.Screen name="sensors" options={{ title: 'Sensores',  tabBarIcon: () => <Text style={{fontSize:20}}>📡</Text> }} />
      <Tabs.Screen name="alerts"  options={{ title: 'Alertas',   tabBarIcon: () => <Text style={{fontSize:20}}>🚨</Text> }} />
      <Tabs.Screen name="mission" options={{ title: 'Missão',    tabBarIcon: () => <Text style={{fontSize:20}}>🚀</Text> }} />
    </Tabs>
  );
}
