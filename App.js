import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import semua screen
import SplashScreen from "./src/screens/SplashScreen";
import Splash1Screen from "./src/screens/Splash1Screen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import InputScreen from "./src/screens/InputScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import DataLocalScreen from "./src/screens/DataLocalScreen";
import RiwayatScreen from "./src/screens/RiwayatScreen";

// Import context provider
import { NotificationProvider } from "./src/context/NotificationContext";

const Stack = createStackNavigator();

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Splash");

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentScreen("Splash1"), 1500);
    const timer2 = setTimeout(() => setCurrentScreen("Welcome"), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <NotificationProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {currentScreen === "Splash" && (
            <Stack.Screen name="Splash" component={SplashScreen} />
          )}
          {currentScreen === "Splash1" && (
            <Stack.Screen name="Splash1" component={Splash1Screen} />
          )}
          {currentScreen === "Welcome" && (
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
          )}

          {/* Screen utama */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Input" component={InputScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="DataLocal" component={DataLocalScreen} />
          <Stack.Screen name="Riwayat" component={RiwayatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  );
}
