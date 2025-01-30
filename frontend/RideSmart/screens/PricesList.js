// PricesList.js
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRoute } from "@react-navigation/native";
import Headlines from "../components/Headlines";
import Trip from "../components/Trip";
import { Color } from "../GlobalStyles";

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
  const {
    results = [],
    pickupText = "",
    destinationText = "",
    distance = 0,
  } = route.params || {};

  const [parsedData, setParsedData] = useState([]);
  const [aiIndex, setAiIndex] = useState(null);

  // Log initial route params
  useEffect(() => {
    console.log("=== PricesList Mounted ===");
    console.log("PricesList => route.params.results:", results);
    console.log("PricesList => route.params.pickupText:", pickupText);
    console.log("PricesList => route.params.destinationText:", destinationText);
    console.log("PricesList => route.params.distance:", distance);
  }, [results, pickupText, destinationText, distance]);

  useEffect(() => {
    console.log("Parsing results to numeric prices...");

    // 1) Parse all prices to numeric
    let numericData = results.map((item) => {
      const val = parsePriceText(item.price, item.app);
      return { ...item, numericPrice: val };
    });

    console.log("Parsed numericData:", numericData);

    // 2) Replace null/NaN prices with average
    const validPrices = numericData
      .map((d) => d.numericPrice)
      .filter((p) => p !== null && !isNaN(p));

    let average = 0;
    if (validPrices.length > 0) {
      average = validPrices.reduce((sum, x) => sum + x, 0) / validPrices.length;
    }
    console.log("Calculated average price:", average);

    numericData = numericData.map((d) => {
      if (d.numericPrice == null || isNaN(d.numericPrice)) {
        return { ...d, numericPrice: average };
      }
      return d;
    });

    // 3) Determine the best (lowest) price
    if (numericData.length) {
      const minPrice = Math.min(...numericData.map((d) => d.numericPrice));
      numericData = numericData.map((d) => ({
        ...d,
        isBestPrice: d.numericPrice === minPrice,
      }));
    }

    // 4) Sort ascending by price
    numericData.sort((a, b) => a.numericPrice - b.numericPrice);

    console.log("Final numericData after sort:", numericData);
    setParsedData(numericData);
  }, [results]);

  // Once parsedData is ready, pick 1 random non-best item for AI Predicted
  useEffect(() => {
    if (!parsedData.length) return;

    // Indices of items that are NOT best price
    const nonBestIndices = parsedData
      .map((item, index) => (item.isBestPrice ? -1 : index))
      .filter((idx) => idx !== -1);

    if (nonBestIndices.length > 0) {
      // Randomly pick one among the non-best-price items
      const randomIndex = Math.floor(Math.random() * nonBestIndices.length);
      const chosen = nonBestIndices[randomIndex];
      setAiIndex(chosen);
      console.log("AI Predicted index chosen:", chosen);
    } else {
      // If *all* items are best price, we won't show the AI badge at all
      setAiIndex(null);
      console.log("All items have best price. No AI predicted chosen.");
    }
  }, [parsedData]);

  // Fallback if no results
  if (!results.length) {
    console.log("No results passed in. Displaying fallback text.");
    return (
      <View style={styles.container}>
        <Text>No results available. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {console.log("Rendering the PricesList screen...")}

      <Headlines headline="Prices List" />
      <View style={styles.tripContainer}>
        <Trip pickup={pickupText} destination={destinationText} />
      </View>

      <ScrollView contentContainerStyle={styles.cardList}>
        {parsedData.map((item, idx) => {
          const showAiBadge = (idx === aiIndex);

          console.log(`Rendering card #${idx} =>`, item);

          let logoSource;
          if (item.app === "Uber") {
            logoSource = require("../assets/Uber-logo.png");
          } else if (item.app === "Bolt") {
            logoSource = require("../assets/Bolt-logo.png");
          } else if (item.app === "Jeeny") {
            logoSource = require("../assets/Jeeny-logo.png");
          } else if (item.app === "Careem") {
            logoSource = require("../assets/Careem-logo.png");
          } else {
            console.log(`No logo found for app: ${item.app}`);
          }

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
                        source={require("../assets/Money-Black.png")}
                        style={styles.moneyIcon}
                      />
                      <Text style={styles.bestPriceText}>Best Price!</Text>
                    </View>
                  )}

                  {/* Show the AI badge only on 1 random non-best-price item */}
                  {showAiBadge && (
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>AI Predicted</Text>
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

// ---- Styles ----
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
    marginBottom: 10,
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
  logo: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#292929",
  },
  bestPriceBadge: {
    backgroundColor: Color.mustard300,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color.mustard300,
    marginLeft: 39,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginTop: 4,
  },
  moneyIcon: {
    width: 16,
    height: 16,
    marginRight: 7,
  },
  bestPriceText: {
    color: "#292929",
    fontSize: 12,
    fontWeight: "bold",
  },
  // AI badge aligned similarly as Best Price
  aiBadge: {
    backgroundColor: "#188cf1",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginLeft: 60, // same as bestPriceBadge
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
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
  openAppIcon: {
    width: 17,
    height: 17,
    marginRight: 8,
  },
  openAppText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PricesList;