// PickupEnter.js

import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Headlines from "../components/Headlines";
import { Color, Border, FontFamily, FontSize } from "../GlobalStyles";
import { useNavigation, useRoute } from "@react-navigation/native";

const GOOGLE_API_KEY = "AIzaSyClg9TxNOL9ZSdJyfldk_ZGtXQ3rDqqfwI";
const LOCATION = "24.7136,46.6753";
const RADIUS = 50000;


const fetchPlaceSuggestions = async (input) => {
  if (!input) return [];
  const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${GOOGLE_API_KEY}&language=en&components=country:sa&location=${LOCATION}&radius=${RADIUS}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.status === "OK") {
      return data.predictions;
    } else {
      console.log("Places API error:", data.status, data.error_message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching place suggestions:", error);
    return [];
  }
};

/**
 * Fetch coordinates (latitude and longitude) from a given place_id.
 * @param {string} placeId - The unique identifier for a place.
 * @returns {Object|null} - An object containing latitude and longitude or null if failed.
 */
const fetchPlaceCoordinatesFromPlaceId = async (placeId) => {
  const endpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.status === "OK" && data.result && data.result.geometry) {
      const { lat, lng } = data.result.geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      console.log("Place Details API error:", data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
};

const PickupEnter = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { setPickup, setPickupCoords } = route.params || {};

  const [currentLocation, setLocalCurrent] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
  });



  const handleCurrentLocationChange = async (text) => {
    setLocalCurrent(text);
    const newSuggestions = await fetchPlaceSuggestions(text);
    setSuggestions(newSuggestions);
  };

  const handleSelectSuggestion = async (item) => {
    setLocalCurrent(item.description);
    setSuggestions([]);

    // Fetch coordinates using place_id
    const coords = await fetchPlaceCoordinatesFromPlaceId(item.place_id);
    if (coords) {
      setSelectedCoords(coords);       // Update local state
      setPickupCoords(coords);         // Update parent state
    } else {
      console.warn("Failed to fetch coordinates for the selected pickup location.");
    }
  };


  const onConfirmPickup = () => {
    if (setPickup) {
      setPickup(currentLocation); // Update parent state
    }

    if (setPickupCoords){
      setPickupCoords(selectedCoords); // Update parent state with selected coordinates
    }

    console.log("Selected Coordinates:", selectedCoords);
    console.log("Selected Location:", currentLocation);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Headlines headline={"PickUp Address"} onArrowLeftPress={() => navigation.goBack()} />

      <View style={styles.inputContainer}>
        <InputField
          label="Current Location"
          placeholder="Enter your current location"
          value={currentLocation}
          onChangeText={handleCurrentLocationChange}
          leftIcon={
            <Image
              source={require("../assets/search.png")}
              style={styles.iconStyle}
            />
          }
        />
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <Image
                    source={require("../assets/map-pin.png")}
                    style={styles.suggestionIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.suggestionText}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <View style={styles.bottomButtonContainer}>
        <Button
          title="Confirm Pickup"
          onPress={onConfirmPickup}
          style={styles.confirmButton}
          textStyle={styles.confirmButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: Color.background,
    padding: 16,
    borderRadius: Border.br_base,
    shadowColor: "rgba(0,0,0,0.01)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 3,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  suggestionIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 16,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -163, // Adjust based on button width
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    height: 70,
    width: 326,
    borderRadius: Border.br_13xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.tropicalRainForest600,
  },
  confirmButtonText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: FontFamily.dMSans36pt,
    color: Color.white,
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});

export default PickupEnter;