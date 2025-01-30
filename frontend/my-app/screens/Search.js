// Search.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { Color, Border, FontSize, Padding, Gap } from "../GlobalStyles";
import { useUser } from "../context/UserContext";
import PickupEnter from "./PickupEnter";
import axios from "axios";

const Search = () => {
  const navigation = useNavigation();
  const { user } = useUser(); // Access user data from context

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupCoords, setPickupCoords] = useState({ latitude: 0, longitude: 0 });
  const [destinationCoords, setDestinationCoords] = useState({ latitude: 0, longitude: 0 });

  const handleSearch = () => {
    console.log("Searching rides with:", {
      pickup,
      destination,
      pickupCoords,
      destinationCoords,
      user_id: user.user_id,
    });

    if (!pickup || !destination) {
      alert("Please fill in both pickup and destination fields.");
      return;
    }

    // 1) Navigate to TripSummary with these inputs
    navigation.navigate("TripSummary", {
      user_id: user.user_id,
      pickupText: pickup,
      destinationText: destination,
      pickupCoords,
      destinationCoords,
      // We'll start progress at 0, but TripSummary does the request.
      progress: 0,
    });
  };



  useEffect(() => {
    console.log("User Context Loaded:", user);
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topRow}>
          <Text style={styles.helloText}>
            Hello, {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.locationText}>
            To provide you with the best ride options, we need access to your
            location.
          </Text>
          <Image
            style={styles.notificationIcon}
            source={require("../assets/notification.png")}
          />
        </View>

        <View style={styles.codeContainer}>
          <View style={styles.firstRow}>
            <Text style={styles.welcomeText}>
              Welcome To The RideSmart Application
            </Text>
            <Image
              style={styles.greenLogoIcon}
              source={require("../assets/green-logo.png")}
            />
          </View>
          <View style={styles.secondRow}>
            <View style={styles.offersRow}>
              <Text style={styles.offerText}>
                Use code <Text style={styles.rs10}>RS10</Text> for 10% off your
                first ride after your first comparison
              </Text>
              <TouchableOpacity>
                <View style={styles.copyCode}>
                  <Text style={styles.copyCodeText}>Copy Code</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inputFieldsContainer}>
          <InputField
            label="Current Location"
            placeholder="Enter your current location"
            value={pickup}
            onChangeText={setPickup}
            containerStyle={styles.inputFieldStyle}
            onFocus={() => {
              navigation.navigate("PickupEnter", {
                setPickup: (value) => setPickup(value),
                setPickupCoords: (coords) => setPickupCoords(coords),
              });
            }}
            leftIcon={
              <Image
                source={require("../assets/search.png")}
                style={styles.iconStyle}
              />
            }
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SetLocationMapPickup", {
                    setPickup: (value) => setPickup(value),
                    setPickupCoords: (coords) => setPickupCoords(coords),
                  });
                }}
              >
                <Image
                  source={require("../assets/map_input.png")}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
            }
          />

          <InputField
            label="Where to?"
            placeholder="Enter your destination"
            value={destination}
            onChangeText={setDestination}
            containerStyle={styles.inputFieldStyle}
            onFocus={() => {
              navigation.navigate("DestinationEnter", {
                setDestination: (value) => setDestination(value),
                setDestinationCoords: (coords) => setDestinationCoords(coords),
              });
            }}
            leftIcon={
              <Image
                source={require("../assets/search.png")}
                style={styles.iconStyle}
              />
            }
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SetLocationMapDestination", {
                    setDestination: (value) => setDestination(value),
                    setDestinationCoords: (coords) => setDestinationCoords(coords),
                  });
                }}
              >
                <Image
                  source={require("../assets/map_input.png")}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
            }
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Search"
            onPress={handleSearch}
            textStyle={{ fontSize: 30 }}
            style={styles.searchButtonStyle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- STYLES (unchanged) ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  topRow: {
    marginTop: 4,
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Gap.gap_xl,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    marginTop: 10,
    position: "absolute",
    left: 320,
  },
  codeContainer: {
    borderRadius: Border.br_base,
    padding: 20,
    backgroundColor: Color.casal700,
    marginBottom: Gap.gap_xl,
  },
  firstRow: {
    flexDirection: "row",
    width: 330,
    height: 49,
  },
  secondRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  offersRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  greenLogoIcon: {
    width: 80,
    height: 80,
    position: "absolute",
    left: 250,
    top: -19,
    margin: "auto",
  },
  welcomeText: {
    fontSize: FontSize.size_xl,
    fontWeight: "900",
    color: Color.white,
    marginRight: 10,
    marginBottom: 0,
  },
  offerText: {
    fontSize: FontSize.size_smi,
    color: Color.white,
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  rs10: {
    fontWeight: "600",
  },
  copyCode: {
    backgroundColor: Color.mustard300,
    borderRadius: Border.br_5xs,
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: Padding.p_4xs,
  },
  copyCodeText: {
    fontSize: FontSize.size_base,
    fontWeight: "700",
    color: Color.casal950,
    textAlign: "left",
  },
  inputFieldsContainer: {
    marginBottom: 16,
  },
  inputFieldStyle: {
    marginBottom: Gap.gap_xl,
  },
  buttonContainer: {
    marginBottom: Gap.gap_xl,
  },
  searchButtonStyle: {
    borderRadius: 30,
    paddingVertical: 15,
    color: Color.green,
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  helloText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Color.black,
  },
  locationText: {
    textDecorationLine: "underline",
  },
});

export default Search;