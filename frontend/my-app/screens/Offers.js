import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScaledSheet, verticalScale, moderateScale, scale } from "react-native-size-matters";
import { StatusBar } from "react-native";

<StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

const Offers = () => {
  const navigation = useNavigation();

  const offers = [
    { id: 1, title: "20% OFF on first order", subtitle: "Uber", image: require("../assets/Uber-logo.png") },
    { id: 2, title: "20% OFF on first order", subtitle: "Bolt", image: require("../assets/Bolt-logo.png") },
    { id: 3, title: "20% OFF on first order", subtitle: "Jeeny", image: require("../assets/Jeeny-logo.png") },
    { id: 4, title: "20% OFF on first order", subtitle: "Kaiian", image: require("../assets/Kaiian-logo.png") },
    { id: 5, title: "15% OFF", subtitle: "Jeeny", image: require("../assets/Jeeny-logo.png") },
    { id: 6, title: "20% OFF on first order", subtitle: "Careem", image: require("../assets/Careem-logo.png") },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Offers</Text>
        <TouchableOpacity>
          <Image source={require("../assets/notification.png")} style={styles.notificationIcon} />
        </TouchableOpacity>
      </View>

      {/* Offers List */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {offers.map((offer) => (
          <View key={offer.id} style={styles.offerCard}>
            <View style={styles.offerLogoContainer}>
              <Image source={offer.image} style={styles.offerLogo} />
            </View>
            <View style={styles.offerDetails}>
              <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
              <Text style={styles.offerTitle}>{offer.title}</Text>
            </View>
            <TouchableOpacity style={styles.copyButton}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4F5",
    borderRadius: 0,
    paddingTop: "70@vs",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "16@s",
    paddingBottom: "30@vs",
  },
  headerText: {
    fontSize: "21@ms",
    fontWeight: "700",
    color: "#10343C",
  },
  notificationIcon: {
    width: "24@s",
    height: "24@vs",
  },
  scrollViewContent: {
    paddingHorizontal: "16@s",
    gap: "10@vs",
  },
  offerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "rgba(38, 38, 38, 0.1)",
    borderRadius: "7@ms",
    padding: "12@ms",
    marginBottom: "10@vs",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  offerLogoContainer: {
    width: "66@s",
    height: "66@vs",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "33@s",
  },
  offerLogo: {
    width: "63@s",
    height: "63@vs",
    borderRadius: "33@s",
  },
  offerDetails: {
    flex: 1,
    marginLeft: "10@s",
  },
  offerSubtitle: {
    fontSize: "16@ms",
    fontWeight: "700",
    color: "#292929",
  },
  offerTitle: {
    fontSize: "12@ms",
    fontWeight: "400",
    color: "#5D5D5D",
  },
  copyButton: {
    backgroundColor: "#007B5E",
    borderRadius: "18@ms",
    paddingVertical: "6@vs",
    paddingHorizontal: "20@s",
  },
  copyButtonText: {
    color: "#FCFCFC",
    fontSize: "15@ms",
    fontWeight: "700",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: "6@s",
    height: "65@vs",
    backgroundColor: "#FCFCFC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  navBarItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navBarIcon: {
    width: "27@s",
    height: "27@vs",
  },
});

export default Offers;
