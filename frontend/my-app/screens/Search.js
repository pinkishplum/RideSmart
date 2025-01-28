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
import { scale, verticalScale, moderateScale } from "react-native-size-matters";


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
                Use <Text style={styles.rs10}>RS10</Text> for 10% off your
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
<TouchableOpacity style={styles.searchButtonStyle} onPress={handleSearch}>
    <Image
      source={require("../assets/Search-w.png")}
      style={styles.rightIcon}
    />
                  <Text style={styles.searchButtonText}>Search</Text>
                 </TouchableOpacity>
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
    padding: scale(16),
  },
  topRow: {
    marginTop: verticalScale(35),
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: verticalScale(Gap.gap_md),
  },
  notificationIcon: {
    width: scale(24),
    height: scale(24),
    marginTop: 0,
    position: "absolute",
    left: scale(310),
  },
  codeContainer: {
    borderRadius: Border.br_base,
    padding: scale(20),
    backgroundColor: Color.casal700,
    marginBottom: verticalScale(30),
    marginTop: verticalScale(20),
    alignSelf: "center",
    width: "95%",
  },
  firstRow: {
    flexDirection: "row",
    width: scale(300),
    height: verticalScale(50),
  },
  secondRow: {
    flexDirection: "row",
    alignItems: "center",
    width: scale(310),
  },
  offersRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  greenLogoIcon: {
    width: scale(90),
    height: scale(90),
    position: "absolute",
    left: scale(200),
    top: verticalScale(-35),
    margin: "auto",
  },
  welcomeText: {
    fontSize: moderateScale(FontSize.size_xl),
    fontWeight: "900",
    color: Color.white,
    marginRight: scale(10),
    marginBottom: 0,
  },
  offerText: {
    fontSize: moderateScale(FontSize.size_smi),
    color: Color.white,
    flex: 1,
    marginRight: scale(70),
    marginBottom: 0,
  },
  rs10: {
    fontWeight: "800",
  },
  copyCode: {
    backgroundColor: Color.mustard300,
    borderRadius: Border.br_5xs,
    paddingHorizontal: scale(Padding.p_3xs),
    paddingVertical: verticalScale(Padding.p_4xs),
    alignSelf: "flex-start",
    marginLeft: scale(0),
    marginRight: scale(7),
  },
  copyCodeText: {
    fontSize: moderateScale(FontSize.size_base),
    fontWeight: "700",
    color: Color.casal950,
    textAlign: "left",
  },
  inputFieldsContainer: {
    marginBottom: verticalScale(80),
    alignItems: "center",
  },
  inputFieldStyle: {
    marginBottom: verticalScale(Gap.gap_lg),
    width: "97%",
  },
  buttonContainer: {
    marginBottom: verticalScale(Gap.gap_lg),
  },
  searchButtonStyle: {
    alignSelf: "center",
    borderRadius: scale(30),
    width: "87%",
    backgroundColor: Color.tropicalRainForest600,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(25),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.2,
    shadowRadius: scale(4),
  },
  searchButtonText: {
    fontSize: moderateScale(35),
    fontWeight: "bold",
    color: "#fff",
  },
  rightIcon: {
    width: scale(30),
    height: scale(30),
    marginRight: scale(10),
    tintColor: "#fff",
  },
  iconStyle: {
    width: scale(20),
    height: scale(20),
    resizeMode: "contain",
  },
  helloText: {
    fontSize: moderateScale(25),
    fontWeight: "bold",
    color: Color.black,
    marginLeft: scale(16),
  },
  locationText: {
    textDecorationLine: "underline",
    fontSize: moderateScale(11),
    marginLeft: scale(16),
  },
});

export default Search;