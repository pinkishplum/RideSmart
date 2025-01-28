// PricesList.js
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRoute } from "@react-navigation/native";
import Headlines from "../components/Headlines";
import Trip from "../components/Trip";
import { Color, Border } from "../GlobalStyles";

const parsePriceText = (rawText, appName) => {
  if (!rawText) return null;
  let cleaned = rawText.trim();

  if (appName === "Careem" && cleaned.includes("\n")) {
    cleaned = cleaned.split("\n")[0];
  }

  cleaned = cleaned
    .replace(/SAR/i, "")
    .replace(/ر\.س/i, "")
    .replace(/SR/i, "")
    .replace(/\xa0/g, "")
    .trim();

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
};

const PricesList = () => {
  const route = useRoute();
  const { results = [], pickupText = "",
    destinationText = "",   distance = 0 // <<-- get the distance
    } = route.params || {};

  useEffect(() => {
    console.log("Results received in PricesList:", results);
  }, [results]);

  if (!results.length) {
    return (
      <View style={styles.container}>
        <Text>No results available. Please try again later.</Text>
      </View>
    );
  }

  const [parsedData, setParsedData] = useState([]);
  const [hasSaved, setHasSaved] = useState(false); // so we only save once

  useEffect(() => {
    let numericData = results.map((item) => {
      if (item.error) {
        return { ...item, numericPrice: null };
      } else {
        const val = parsePriceText(item.price, item.app);
        return { ...item, numericPrice: val };
      }
    });

    const validPrices = numericData
      .map((d) => d.numericPrice)
      .filter((p) => p !== null && !isNaN(p));

    let average = 0;
    if (validPrices.length > 0) {
      average = validPrices.reduce((sum, x) => sum + x, 0) / validPrices.length;
    }

    numericData = numericData.map((d) => {
      if (d.numericPrice == null || isNaN(d.numericPrice)) {
        return { ...d, numericPrice: average };
      }
      return d;
    });

    const minPrice = Math.min(...numericData.map((d) => d.numericPrice));

    numericData = numericData.map((d) => ({
      ...d,
      isBestPrice: d.numericPrice === minPrice,
    }));

    numericData.sort((a, b) => a.numericPrice - b.numericPrice);

    setParsedData(numericData);
  }, [results]);

  useEffect(() => {
    if (!parsedData.length || hasSaved) return;

    let priceUber = 0,
      priceBolt = 0,
      priceJeeny = 0,
      priceCareem = 0;

    parsedData.forEach((item) => {
      switch (item.app) {
        case "Uber":
          priceUber = item.numericPrice;
          break;
        case "Bolt":
          priceBolt = item.numericPrice;
          break;
        case "Jeeny":
          priceJeeny = item.numericPrice;
          break;
        case "Careem":
          priceCareem = item.numericPrice;
          break;
        default:
          break;
      }
    });

    const userId = results[0]?.user_id || 0;

    const now = new Date();
    const date = now.toISOString().slice(0, 10);  // "YYYY-MM-DD"
    const time = now.toTimeString().slice(0, 5);  // "HH:MM"

    fetch("http://10.0.3.2:5001/db/save_ride_and_trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        start_point: pickupText,
        destination: destinationText,
        price_uber: priceUber || 0,
        price_bolt: priceBolt || 0,
        price_jeeny: priceJeeny || 0,
        price_careem: priceCareem || 0,
        distance_km: distance, // <-- ADD THIS
        date,
        time,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Auto-save response:", data);
        setHasSaved(true);
      })
      .catch((err) => {
        console.log("Auto-save error:", err);
      });
  }, [parsedData, hasSaved, results, pickupText, destinationText]);

  return (
    <View style={styles.container}>
      <Headlines headline="Prices List" />

      {/* Show the Trip info at the top */}
      <View style={styles.tripContainer}>
        <Trip pickup={pickupText} destination={destinationText} />
      </View>

      <ScrollView contentContainerStyle={styles.cardList}>
        {parsedData.map((item, idx) => {
          let logoSource;
          if (item.app === "Uber") logoSource = require("../assets/Uber-logo.png");
          else if (item.app === "Bolt") logoSource = require("../assets/Bolt-logo.png");
          else if (item.app === "Jeeny") logoSource = require("../assets/Jeeny-logo.png");
          else if (item.app === "Careem") logoSource = require("../assets/Careem-logo.png");

          return (
            <View style={styles.card} key={idx}>
              <Image source={logoSource} style={styles.logo} />
              <View style={styles.cardContent}>
                <View style={styles.row}>
                  <Text style={styles.priceText}>
                    {item.numericPrice?.toFixed(2)} SAR
                  </Text>
                  {item.isBestPrice && (
                    <View style={styles.bestPriceBadge}>
                      <Image
                        source={require("../assets/Money-Black.png")} // Black Icon
                        style={styles.moneyIcon}
                      />
                      <Text style={styles.bestPriceText}>Best Price!</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity style={styles.openAppButton}>
                  <View style={styles.openAppContent}>
                    <Image
                      source={require("../assets/GoToApp-W.png")}
                      style={styles.openAppIcon}
                    />
                    <Text style={styles.openAppText}>Open App</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

// ---------- STYLES (unchanged) ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  tripContainer: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 13,
    marginTop: 15,
    elevation: 2,
    marginBottom:10,
    borderWidth: 1,
    borderColor: "#d3d3d3",
  },
  cardList: {
    paddingBottom: 25,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 0.2,
    borderColor: "#d3d3d3",
    marginHorizontal: 16,
    marginBottom: 20,
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logo: { width: 70, height: 70, marginRight: 16 },
  cardContent: { flex: 1, justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  priceText: { fontSize: 16, fontWeight: "bold", color: "#292929" },
  bestPriceBadge: {
    backgroundColor: Color.mustard300, //Same Copy Code in Search Screen
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth:1,
    borderColor: Color.mustard300, //Same Copy Code in Search Screen
    marginLeft: 55,
    flexDirection: "row",
    alignItems: "center",
  },
  moneyIcon: { width: 16, height: 16, marginRight: 7 }, // Ziyad please make sure the dimensions are good and Im sorry for that
  bestPriceText: { color: "#292929", fontSize: 12, fontWeight: "bold" }, // changed text to black
  openAppButton: {
    backgroundColor: "#009B73",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  openAppContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  openAppIcon: { width: 17, height: 17, marginRight: 8 },
  openAppText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PricesList;