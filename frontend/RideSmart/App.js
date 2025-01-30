import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
//import PastComparisons from './screens/PastComparisons';
//import Account from './screens/Account';
//import Offers from './screens/Offers';
//import SignUp from './screens/SignUp';
//import SplashScreen from './screens/SplashScreen';
import StartScreen from './screens/StartScreen';
import RealApp from "./RealApp";
import PastComparisons from "./screens/PastComparisons";
import Offers from "./screens/Offers";
import Account from "./screens/Account";

export default function App() {
  return (
      <SafeAreaView style={styles.container}>
              <RealApp/>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
