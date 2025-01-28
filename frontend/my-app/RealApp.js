import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import SplashScreen from "./screens/SplashScreen";
import StartScreen from "./screens/StartScreen";
import LogIn from "./screens/LogIn";
import SignUp from "./screens/SignUp";
import Search from "./screens/Search";
import PastComparisons from "./screens/PastComparisons";
import Offers from "./screens/Offers";
import Account from "./screens/Account";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserProvider } from "./context/UserContext";
import PickupEnter from "./screens/PickupEnter";
import DestinationEnter from "./screens/DestinationEnter";
import SetLocationMapPickup from "./screens/SetLocationMapPickup";
import SetLocationMapDestination from "./screens/SetLocationMapDestination";
import TripSummary from "./screens/TripSummary";
import PricesList from "./screens/PricesList";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 65, paddingBottom: 10, backgroundColor: "#FCFCFC" },
        tabBarIconStyle: { width: 28, height: 28 },
        tabBarActiveTintColor: "#007B5E",
        tabBarInactiveTintColor: "#AAAAAA",
      }}
    >
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("./assets/search.png")}
              style={{ tintColor: color, width: 28, height: 28 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Offers"
        component={Offers}
        options={{
          tabBarLabel: "Offers",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("./assets/offers.png")}
              style={{ tintColor: color, width: 28, height: 28 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PastComparisons"
        component={PastComparisons}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("./assets/history.png")}
              style={{ tintColor: color, width: 28, height: 28 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("./assets/icon.png")}
              style={{ tintColor: color, width: 28, height: 28 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RealApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SplashScreen />
      </View>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LogIn" component={LogIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen name="PickupEnter" component={PickupEnter} />
          <Stack.Screen name="SetLocationMapPickup" component={SetLocationMapPickup} />
          <Stack.Screen name="DestinationEnter" component={DestinationEnter} />
          <Stack.Screen name="SetLocationMapDestination" component={SetLocationMapDestination}/>
            <Stack.Screen name="TripSummary" component={TripSummary}/>
            <Stack.Screen name="PricesList" component={PricesList}/>

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RealApp;