// TripSummary.js
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Animated, Easing } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Headlines from "../components/Headlines";
import Trip from "../components/Trip";
import { Border, Color } from "../GlobalStyles";
import MakeSummaryMap from "./MakeSummaryMap";

const CAR_ICON_WIDTH = 40;
const BAR_MAX_WIDTH = 380;
const TOTAL_DURATION = 20000; // 15 seconds

function cleanupAddress(address) {
  if (!address) return address;
  return address;
}

const TripSummary = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { user_id, pickupText, destinationText, pickupCoords, destinationCoords } =
    route.params || {};

  // Distance from the map
  const [distance, setDistance] = useState(0);

  // We'll store the results from the server
  const [finalResults, setFinalResults] = useState([]);
  // Track whether we've started our loading bar animation yet
  const [animationStarted, setAnimationStarted] = useState(false);

  // For the bar animation
  const [localProgress, setLocalProgress] = useState(0); // 0..100
  const animatedProgress = useRef(new Animated.Value(0)).current;

  // Cleaned addresses
  const [cleanedPickup, setCleanedPickup] = useState("");
  const [cleanedDestination, setCleanedDestination] = useState("");

  // 1) Fetch prices ONCE distance > 0.
  useEffect(() => {
    if (!user_id || distance <= 0) return;

    const _cleanedPickup = cleanupAddress(pickupText);
    const _cleanedDestination = cleanupAddress(destinationText);

    setCleanedPickup(_cleanedPickup);
    setCleanedDestination(_cleanedDestination);

    const fetchPrices = async () => {
      try {
        // If on Android emulator, use 10.0.2.2.
        // If on a real device, use your local machine IP (e.g. 192.168.x.x)
        const endpoint = "https://ridesmart-q66b.onrender.com/api/get_prices";
        console.log("Calling /get_prices with:", {
          user_id,
          distance,
          pick_up: _cleanedPickup,
          destination: _cleanedDestination,
        });

        const resp = await axios.post(endpoint, {
          user_id,
          distance,
          pick_up: _cleanedPickup,
          destination: _cleanedDestination,
        });
        console.log("Server responded =>", resp.data);

        // Save the results. We'll wait until they're non-empty to start the animation.
        setFinalResults(resp.data.results || []);
      } catch (error) {
        console.error("Error calling /get_prices:", error);
      }
    };

    fetchPrices();
  }, [user_id, distance, pickupText, destinationText]);

  // 2) Once we have non-empty finalResults, we start the local progress bar.
  //    This prevents the bar from finishing while finalResults is still empty.
  useEffect(() => {
    if (!finalResults.length) return;  // Only run if we actually have results
    if (animationStarted) return;      // Don't start twice

    console.log("TripSummary => Received finalResults, starting animation now...");
    setAnimationStarted(true);
    setLocalProgress(0);

    Animated.timing(animatedProgress, {
      toValue: 100,
      duration: TOTAL_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      console.log("TripSummary => Animation complete. finalResults:", finalResults);

      // Navigate to PricesList after the animation finishes
      navigation.replace("PricesList", {
        results: finalResults,
        pickupText: cleanedPickup,
        destinationText: cleanedDestination,
        distance,
      });
    });
  }, [finalResults, animationStarted, cleanedPickup, cleanedDestination, distance, navigation, animatedProgress]);

  // Keep localProgress in sync for display
  useEffect(() => {
    const listenerId = animatedProgress.addListener(({ value }) => {
      setLocalProgress(Math.floor(value));
    });
    return () => {
      animatedProgress.removeListener(listenerId);
    };
  }, [animatedProgress]);

  // Move the car icon from 0..(BAR_MAX_WIDTH - CAR_ICON_WIDTH)
  const translateXCar = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [0, BAR_MAX_WIDTH - CAR_ICON_WIDTH],
  });

  return (
    <View style={styles.tripSummary}>
      <Headlines
        headline="Trip Summary"
        onArrowLeftPress={() => navigation.navigate("Search")}
      />

      <View style={styles.progressBarParent}>
        <View style={styles.progressBarContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.collectingPrices}>Collecting Prices</Text>
            <Text style={styles.percentageText}>{localProgress}%</Text>
          </View>

          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: animatedProgress.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
            <Animated.Image
              source={require("../assets/car-collection1.png")}
              style={[
                styles.carIcon,
                { transform: [{ translateX: translateXCar }] },
              ]}
            />
          </View>
        </View>

        <View style={styles.tripContainer}>
          <Trip pickup={pickupText} destination={destinationText} />
          <MakeSummaryMap
            pickupCoords={pickupCoords}
            destinationCoords={destinationCoords}
            onDistanceCalculated={(dist) => {
              console.log("Distance from map:", dist);
              setDistance(dist);
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tripSummary: {
    backgroundColor: Color.white,
    flex: 1,
  },
  progressBarParent: {
    position: "absolute",
    top: 100,
    width: "100%",
    alignItems: "center",
  },
  progressBarContainer: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  collectingPrices: {
    fontSize: 16,
    fontWeight: "600",
    color: Color.black,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "600",
    color: Color.black,
  },
  progressBarBackground: {
    height: 30,
    width: "100%",
    backgroundColor: Color.lightGray,
    borderRadius: Border.br_13xl,
    borderWidth: 1,
    borderColor: Color.black,
    overflow: "hidden",
    position: "relative",
    marginTop: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: Color.tropicalRainForest400,
    position: "absolute",
    left: 0,
  },
  carIcon: {
    width: 40,
    height: 30,
    position: "absolute",
    top: 0,
  },
  tripContainer: {
    width: "90%",
    marginTop: 15,
    padding: 16,
    backgroundColor: Color.white,
    borderRadius: Border.br_13xl,
    elevation: 2,
  },
});

export default TripSummary;