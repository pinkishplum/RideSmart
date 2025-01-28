// screens/LogIn.js

import React, { useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from '../context/UserContext'; // Import UserContext
import InputField from '../components/InputField';
import Button from '../components/Button';
import { FontFamily, FontSize, Color, Gap, Border } from "../GlobalStyles";
import Search from "./Search";

const LogIn = () => {
  const navigation = useNavigation();
  const { updateUser } = useUser(); // Access updateUser from UserContext

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch('https://ridesmart-q66b.onrender.com/db/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user_id, first_name, last_name, message } = data;

        // Update global context with user data
        updateUser({
          user_id,
          first_name,
          last_name,
          email,
        });

        Alert.alert("Success", message);

        // Navigate to Search screen
        navigation.reset(
            {
        index: 0,
        routes: [{ name: "Main", params: { screen: "Search" } }],
        }
        )


      } else {
        Alert.alert("Error", data.error || "Login failed");
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert("Error", "Could not connect to the server.");
    }
  };

  return (
    <View style={styles.logIn}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.arrowIcon}
            source={require("../assets/arrow.png")}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.inputFields}>
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            rightIcon={
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Image
                  style={styles.eyeIcon}
                  source={
                    passwordVisible
                      ? require("../assets/eye.png")
                      : require("../assets/eyeslash.png")
                  }
                />
              </TouchableOpacity>
            }
          />
        </View>

        <Button
          title="Log In"
          onPress={handleLogin}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logIn: {
    flex: 1,
    backgroundColor: Color.white,
    padding: Gap.gap_lg,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  arrowIcon: {
    width: 48,
    height: 48,
    marginBottom: 40,
  },
  title: {
    fontSize: FontSize.size_13xl,
    fontWeight: "700",
    color: Color.tropicalRainForest600,
    textAlign: "center",
    marginBottom: Gap.gap_xl,
  },
  inputFields: {
    marginBottom: 30,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  footerText: {
    fontSize: FontSize.size_md,
    color: Color.casal950,
  },
  footerLink: {
    fontSize: FontSize.size_md,
    color: Color.primary,
    fontWeight: "700",
  },
});

export default LogIn;