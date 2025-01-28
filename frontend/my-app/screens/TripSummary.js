// TripSummary.js
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Animated, Easing } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Headlines from "../components/Headlines";
import Trip from "../components/Trip";
import { Border, Color } from "../GlobalStyles";
import MakeSummaryMap from "./MakeSummaryMap";

const CLIENT_CAP = 89;
const CLIENT_DURATION = 30000;
const POLL_INTERVAL = 2000;
const FINAL_JUMP_STEP = 5;
const FINAL_JUMP_TOTAL = 10000;
const CAR_ICON_WIDTH = 40;
const BAR_MAX_WIDTH = 380;

function cleanupAddress(address) {
  if (!address) return address;
  else
    return address

  // let [_, ...rest] = address.split(",");
  // if (!address) {
  //    return address;
  // }
  //
  // const cleanedParts = rest
  //   .map((chunk) => chunk.trim())
  //   .filter((chunk) => chunk.toLowerCase() !== "saudi arabia");
  //
  // return cleanedParts.join(", ");
}

const TripSummary = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [distance, setDistance] = useState(0); // <-- local state for distance


  const {
    user_id,
    pickupText,
    destinationText,
    pickupCoords,
    destinationCoords,
  } = route.params || {};

  // Local states
  const [fakeProgress, setFakeProgress] = useState(0);
  const [serverDone, setServerDone] = useState(false);
  const [finalJumpStarted, setFinalJumpStarted] = useState(false);
  const [finalResults, setFinalResults] = useState([]);
  const animatedProgress = useRef(new Animated.Value(0)).current;

  const [cleanedPickup, setCleanedPickup] = useState("");
  const [cleanedDestination, setCleanedDestination] = useState("");

  useEffect(() => {
    if (!user_id) {
      console.warn("No user_id provided; cannot proceed!");
      return;
    }

    const doRequest = async () => {
      try {
        const _cleanedPickup = cleanupAddress(pickupText);
        const _cleanedDestination = cleanupAddress(destinationText);

        setCleanedPickup(_cleanedPickup);
        setCleanedDestination(_cleanedDestination);

        console.log("CLEANED ADDRESSES", _cleanedPickup, _cleanedDestination);

        const resp = await axios.post("http://192.168.100.165:5001/proccess/get_prices", {
          pick_up: _cleanedPickup,
          destination: _cleanedDestination,
          user_id,
        });

        console.log("TripSummary => server response:", resp.data);
        setFinalResults(resp.data.results);
      } catch (err) {
        console.error("Error requesting get_prices in TripSummary:", err);
      }
    };

    doRequest();
  }, [user_id, pickupText, destinationText]);

  // 2) Animate bar from 0..80% over 25s
  useEffect(() => {
    let localTimer = null;
    let startTime = Date.now();
    let currentProg = 0;
    const stepDuration = CLIENT_DURATION / CLIENT_CAP;

    const tick = () => {
      if (serverDone) {
        clearInterval(localTimer);
        finalJumpTo100(currentProg);
        return;
      }
      const elapsed = Date.now() - startTime;
      const steps = Math.floor(elapsed / stepDuration);

      if (steps >= CLIENT_CAP) {
        clearInterval(localTimer);
        setFakeProgress(CLIENT_CAP);
      } else {
        if (steps !== currentProg) {
          currentProg = steps;
          setFakeProgress(currentProg);
        }
      }
    };

    localTimer = setInterval(tick, 100);
    return () => clearInterval(localTimer);
  }, [serverDone]);

  // 3) Poll server until progress=100
  useEffect(() => {
    if (!user_id) return;

    const pollId = setInterval(async () => {
      if (serverDone) {
        clearInterval(pollId);
        return;
      }
      try {
        const resp = await axios.get(
          `http://192.168.100.165:5001/proccess/get_progress?user_id=${user_id}`
        );
        const pVal = resp.data.progress || 0;
        console.log("TripSummary poll => progress:", pVal);

        if (pVal >= 100) {
          setServerDone(true);
          clearInterval(pollId);
          finalJumpTo100(fakeProgress);
        }
      } catch (err) {
        console.error("Error polling progress:", err);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(pollId);
  }, [serverDone, user_id, fakeProgress]);

  useEffect(() => {
    if (serverDone && finalResults.length > 0) {
      // PASS the CLEANED addresses to PricesList
      navigation.replace("PricesList", {
        results: finalResults,
        pickupText: cleanedPickup,          // <--- cleaned
        destinationText: cleanedDestination,
        distance: distance,

      });
    }
  }, [serverDone, finalResults, cleanedPickup, cleanedDestination, navigation,distance]);

  // Animate bar
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: fakeProgress,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  }, [fakeProgress]);

  const finalJumpTo100 = (startVal) => {
    if (finalJumpStarted) return;
    setFinalJumpStarted(true);

    let currentVal = startVal;
    const stepsNeeded = Math.ceil((100 - currentVal) / FINAL_JUMP_STEP);
    const stepDuration = FINAL_JUMP_TOTAL / stepsNeeded;

    const intervalId = setInterval(() => {
      currentVal += FINAL_JUMP_STEP;
      if (currentVal >= 100) currentVal = 100;
      setFakeProgress(currentVal);

      if (currentVal >= 100) {
        clearInterval(intervalId);
        setServerDone(true);
      }
    }, stepDuration);
  };

  let displayedProgress = serverDone ? fakeProgress : Math.min(fakeProgress, CLIENT_CAP);
  if (displayedProgress > 100) displayedProgress = 100;

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
            <Text style={styles.percentageText}>{displayedProgress}%</Text>
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

// ---STYLES (unchanged)---
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