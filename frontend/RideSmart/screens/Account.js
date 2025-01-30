import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView, // <-- Import ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useUser } from "../context/UserContext"; // Import your user context

const Account = () => {
  const navigation = useNavigation();

  const { user, updateUser } = useUser();
  // user => { user_id, first_name, last_name, email }
  // updateUser => function to update the user in context

  // Local state for form fields
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSaveChanges = async () => {
    // Basic validation
    if (!firstName || !lastName || !email) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      // PUT request to your Flask endpoint to update user data
      // Example endpoint: /db/user/<user_id>
      const response = await fetch(
        `http://10.0.3.2:5001/db/user/${user.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            // If needed, you could also include password here
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update context with new info
        updateUser({
          ...user,
          first_name: firstName,
          last_name: lastName,
          email: email,
        });
        Alert.alert("Success", "Your account details have been updated.");
      } else {
        Alert.alert("Error", data.error || "Failed to update user.");
      }
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert("Error", "Unable to update at this time.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
        <TouchableOpacity>
          <Image
            source={require("../assets/notification.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Use a ScrollView to make the entire form scrollable */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* First Name */}
        <View style={styles.inputGroupFull}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputGroupFull}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroupFull}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Password Fields (Optional if you want password updating) */}
        <View style={styles.inputGroupFull}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="**********"
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Image
                source={
                  passwordVisible
                    ? require("../assets/eye.png")
                    : require("../assets/eyeslash.png")
                }
                style={styles.toggleIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroupFull}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!confirmPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }
            >
              <Image
                source={
                  confirmPasswordVisible
                    ? require("../assets/eye.png")
                    : require("../assets/eyeslash.png")
                }
                style={styles.toggleIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Changes Button */}
        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save changes</Text>
        </TouchableOpacity>

        {/* Extra bottom padding so we can scroll comfortably past the button */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default Account;

/* --- STYLES --- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4F5",
    paddingTop: verticalScale(60),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(27),
    fontWeight: "bold",
    color: "#10343C",
  },
  icon: {
    width: scale(24),
    height: scale(24),
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    // If you need more space at the bottom:
    // paddingBottom: verticalScale(60),
  },
  inputGroupFull: {
    marginBottom: verticalScale(20),
  },
  label: {
    marginBottom: verticalScale(8),
    fontSize: moderateScale(15),
    fontWeight: "bold",
    color: "#454545",
  },
  input: {
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderRadius: scale(9),
    padding: scale(12),
    backgroundColor: "#FFFFFF",
    fontSize: moderateScale(14),
    height: verticalScale(50),
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  eyeButton: {
    position: "absolute",
    right: scale(10),
    alignSelf: "center",
  },
  toggleIcon: {
    width: scale(20),
    height: scale(20),
  },
  button: {
    backgroundColor: "#007B5E",
    borderRadius: scale(32),
    paddingVertical: verticalScale(17),
    alignItems: "center",
    marginTop: verticalScale(35),
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: moderateScale(23),
  },
});