// my-app/screens/SetLocationMapPickup.js
import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image } from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import Headlines from "../components/Headlines";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { Color, Border } from "../GlobalStyles";


// Replace with your actual API key
const GOOGLE_API_KEY = "AIzaSyClg9TxNOL9ZSdJyfldk_ZGtXQ3rDqqfwI";

// Riyadh coordinates:
const LOCATION = "24.7136,46.6753";
const RADIUS = 50000; // 50km

const fetchPlaceSuggestions = async (input) => {
  if (!input) return [];

  // Added location bias
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

const reverseGeocode = async (latitude, longitude) => {
  const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.status === "OK" && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      console.log("Reverse Geocoding error:", data.status, data.error_message);
      return "";
    }
  } catch (error) {
    console.error("Error fetching address from coords:", error);
    return "";
  }
};

const SetLocationMapPickup = () => {

  const navigation = useNavigation();
  const mapRef = useRef(null);
  const route = useRoute();
  const { setPickup } = route.params || {};
  const {setPickupCoords } = route.params || {};

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

  const updateMapAndAddress = async (latitude, longitude) => {
    setSelectedCoords({ latitude, longitude });
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }

    const address = await reverseGeocode(latitude, longitude);
    if (address) {
      setLocalCurrent(address);
      setSuggestions([]); // Clear suggestions after updating address
    }
  };

  const handleSelectSuggestion = async (item) => {
    setLocalCurrent(item.description);
    setSuggestions([]);
    const coords = await fetchPlaceCoordinatesFromPlaceId(item.place_id);
    if (coords) {
      await updateMapAndAddress(coords.latitude, coords.longitude);
    }
  };

  const onConfirmPickup = () => {
    if (setPickup) {
      setPickup(currentLocation); // Update parent state
    }

    if (setPickupCoords){
      setPickupCoords(selectedCoords)
    }
    console.log(selectedCoords)
    console.log(currentLocation)

    navigation.goBack();
  };



  const handleMarkerDragEnd = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    await updateMapAndAddress(latitude, longitude);
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    await updateMapAndAddress(latitude, longitude);
  };

  return (
    <View style={styles.container}>
      <Headlines
        headline="Pickup Address"
        onArrowLeftPress={() => navigation.goBack()}
      />

      <View style={styles.inputContainer}>
        <InputField
          label="Pickup Location"
          placeholder="Enter your Pickup location"
          value={currentLocation}
          onChangeText={handleCurrentLocationChange}
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

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: selectedCoords.latitude,
            longitude: selectedCoords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={selectedCoords}
            draggable
            onDragEnd={handleMarkerDragEnd}
            image={require("../assets/pin48.png")}
          />
        </MapView>
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
    backgroundColor: Color.white,
  },
  inputContainer: {
    backgroundColor: Color.background,
    padding: 16,
    borderRadius: Border.br_base,
    shadowColor: "rgba(0,0,0,0.01)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 5,
    borderRadius: 5,
    marginTop: 0,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding:5
  },
  suggestionIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 100,
    borderRadius: Border.br_base,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -163,
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
    color: Color.white,
  },
});

export default SetLocationMapPickup;
