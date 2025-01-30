import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useUser } from "../context/UserContext";
import { useIsFocused } from "@react-navigation/native";  // <-- For detecting screen focus

const LOGO_MAP = {
  Uber: require("../assets/Uber-logo.png"),
  Careem: require("../assets/Careem-logo.png"),
  Bolt: require("../assets/Bolt-logo.png"),
  Jeeny: require("../assets/Jeeny-logo.png"),
};

const PastComparisons = () => {
  const isFocused = useIsFocused();
  const { user } = useUser();
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchPastComparisons = async () => {
      if (!user.user_id) return;

      try {
        const response = await fetch(`http://10.0.3.2:5001/db/past_comparisons/${user.user_id}`);
        const data = await response.json();
        setRides(data); // data is an array of { destination, date, time, app, price }
      } catch (error) {
        console.error("Error fetching past comparisons:", error);
      }
    };

    if (isFocused && user.user_id) {
      fetchPastComparisons();
    }
  }, [isFocused, user.user_id]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Past Comparisons</Text>
        <Image
          style={styles.notificationIcon}
          source={require("../assets/notification.png")}
        />
      </View>

      {/* Ride Cards */}
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {rides.map((ride, index) => {
          const priceFormatted = `${parseFloat(ride.price).toFixed(2)} SAR`;

          return (
            <View key={index} style={styles.card}>
              <View style={styles.cardDetails}>
                <Text style={styles.destination}>Ride to {ride.destination}</Text>
                <Text style={styles.date}>
                  {ride.date} • {ride.time}
                </Text>
                <View style={styles.logoAndPrice}>
                  <Image source={LOGO_MAP[ride.app]} style={styles.logo} />
                  <Text style={styles.price}>{priceFormatted}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.researchButton}>
                <Text style={styles.researchText}>Research</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

// --- Styles (unchanged) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4F5",
    paddingTop: verticalScale(50),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(10),
  },
  headerText: {
    fontSize: scale(24),
    fontWeight: "700",
    color: "#10343C",
  },
  notificationIcon: {
    width: scale(24),
    height: scale(24),
  },
  cardContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(100),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: scale(16),
    marginBottom: verticalScale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDetails: {
    flex: 1,
  },
  destination: {
    fontSize: scale(18),
    fontWeight: "700",
    marginBottom: verticalScale(8),
    color: "#10343C",
  },
  date: {
    fontSize: scale(14),
    color: "#666",
    marginBottom: verticalScale(8),
  },
  logoAndPrice: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: scale(24),
    height: scale(24),
    marginRight: scale(8),
  },
  price: {
    fontSize: scale(17),
    fontWeight: "300",
  },
  researchButton: {
    backgroundColor: "#007B5E",
    borderRadius: 8,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
  },
  researchText: {
    color: "#FFFFFF",
    fontSize: scale(14),
    fontWeight: "700",
  },
});

export default PastComparisons;