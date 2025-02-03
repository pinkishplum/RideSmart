// screens/SignUp.js
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { FontFamily, FontSize, Color, Gap } from "../GlobalStyles";


const SignUp = () => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

await setDoc(doc(db, "users", user.uid), {
  firstName,
  lastName,
  email,
  createdAt: new Date(),
});

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("LogIn");
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Email already in use.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters.";
          break;
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.signUp}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.arrowIcon} source={require("../assets/arrow.png")} />
        </TouchableOpacity>

        <Text style={styles.title}>Create an Account</Text>

        <View style={styles.inputFields}>
          <View style={styles.nameContainer}>
            <InputField
              label="First Name"
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              containerStyle={styles.halfWidth}
            />
            <InputField
              label="Last Name"
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              containerStyle={styles.halfWidth}
            />
          </View>

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
                  source={passwordVisible ? require("../assets/eye.png") : require("../assets/eyeslash.png")}
                />
              </TouchableOpacity>
            }
          />

          <InputField
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
            autoCapitalize="none"
            rightIcon={
              <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <Image
                  style={styles.eyeIcon}
                  source={confirmPasswordVisible ? require("../assets/eye.png") : require("../assets/eyeslash.png")}
                />
              </TouchableOpacity>
            }
          />
        </View>

        <Button title="Sign Up" onPress={handleSignUp} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  signUp: {
    flex: 1,
    backgroundColor: Color.white,
    paddingHorizontal: scale(20),  // استخدام scale من مكتبة size-matters
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: verticalScale(20),  // استخدام verticalScale لضبط المسافة الرأسية
  },
  arrowIcon: {
    width: scale(48),   // استخدام scale لتحجيم الأيقونات بشكل مرن
    height: scale(48),
    marginBottom: verticalScale(20), // استخدام verticalScale للمسافة بين العناصر
  },
  title: {
    fontSize: moderateScale(30),   // استخدام moderateScale لضبط حجم النص
    fontWeight: "700",
    color: Color.casal950,
    textAlign: "center",
    marginBottom: verticalScale(20),  // استخدام verticalScale للمسافة بين النصوص
  },
  inputFields: {
    marginBottom: verticalScale(20),
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scale(6),
  },
  halfWidth: {
    width: "48%",
  },
  eyeIcon: {
    width: scale(20),  // استخدام scale لضبط حجم الأيقونات
    height: scale(20),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: verticalScale(10),
  },
  footerText: {
    fontSize: moderateScale(14),
    color: Color.casal950,
  },
  footerLink: {
    fontSize: moderateScale(14),
    color: Color.primary,
    fontWeight: "700",
  },
});

export default SignUp;
