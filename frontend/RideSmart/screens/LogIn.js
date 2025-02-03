// screens/LogIn.js
import React, { useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { FontFamily, FontSize, Color, Gap } from "../GlobalStyles";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Add Firestore imports
import { auth, db } from "../firebaseConfig"; // Import firestore


const LogIn = () => {
  const navigation = useNavigation();
  const { updateUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      // 1) Sign in the user via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user?.uid) {
        Alert.alert("Error", "Invalid user credentials");
        return;
      }

      console.log("Attempting to access Firestore with UID:", user.uid);

      // 2) Get user document from Firestore
      //    doc(firestore, "users", user.uid) references the 'users' collection doc with ID = user.uid
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If there's no doc in the 'users' collection for this UID,
        // you can decide how you want to handle it.
        throw new Error("User data not found in Firestore");
      }

      // 3) Extract user data from Firestore
      const userData = userDoc.data();
      console.log("Firestore user data:", userData);

      // 4) Update global context with user data
      updateUser({
        user_id: user.uid,
        email: user.email,
        first_name: userData.firstName || userData.first_name || "",
        last_name: userData.lastName  || userData.last_name  || "",
      });

      // 5) Success feedback and navigation
      Alert.alert("Success", "Logged in successfully!");
      navigation.reset({
        index: 0,
        routes: [{ name: "Main", params: { screen: "Search" } }],
      });

    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.code) {
        // Check for Firebase Auth errors
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage = "User not found.";
            break;
          case "auth/wrong-password":
            errorMessage = "Invalid password.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
        }
      } else {
        // Possibly a Firestore error or other
        console.log("Error retrieving Firestore doc:", error.message);
      }
      Alert.alert("Error", errorMessage);
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