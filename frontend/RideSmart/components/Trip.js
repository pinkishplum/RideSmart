// Trip.js

import React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import {
  Gap,
  FontSize,
  FontFamily,
  Color,
  Padding,
  Border,
} from "../GlobalStyles";

const Trip = ({ pickup, destination }) => {
  return (
    <View style={styles.trip}>
      <View style={styles.locations}>
        {/* Pickup Location */}
        <View style={[styles.circleParent, styles.parentFlexBox]}>
          <Image
            style={styles.circleIcon}
            contentFit="cover"
            source={require("../assets/circle.png")}
          />
          <View style={styles.locationTextWrapper}>
            <Text style={styles.locationText}>{pickup}</Text>
          </View>
        </View>

        {/* Dotted Line Between Pickup and Destination */}
        <View style={styles.locationsChild} />
        <Image
          style={styles.locationsItem}
          contentFit="cover"
          source={require("../assets/frame-39.png")}
        />

        {/* Destination Location */}
        <View style={[styles.maskGroupParent, styles.locationsChildPosition]}>
          <Image
            style={styles.circleIcon}
            contentFit="cover"
            source={require("../assets/map-pin.png")}
          />
          <View style={styles.locationTextWrapper}>
            <Text style={styles.locationText}>{destination}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentFlexBox: {
    gap: Gap.gap_md,
    alignItems: "center",
    flexDirection: "row",
    left: 0,
  },
  locationsChildPosition: {
    top: 56,
    position: "absolute",
  },
  circleIcon: {
    width: 24,
    height: 24,
  },
  locationText: {
    fontSize: FontSize.size_base,
    fontWeight: "500",
    color: Color.black,
    textAlign: "left",
  },
  locationTextWrapper: {
    width: 246,
    height: 21,
  },
  circleParent: {
    top: 0,
    padding: Padding.p_base,
    position: "absolute",
  },
  maskGroupParent: {
    paddingHorizontal: Padding.p_base,
    paddingTop: Padding.p_5xs,
    gap: Gap.gap_md,
    alignItems: "center",
    flexDirection: "row",
    left: 0,
  },
  locationsChild: {
    left: 52,
    top: 45,
    borderColor: Color.colorDarkgray_100,
    borderTopWidth: 1,
    width: 230,
    height: 1,
    borderStyle: "solid",
    position: "absolute",
  },
  locationsItem: {
    top: 45,
    left: 26,
    width: 5,
    height: 14,
    position: "absolute",
  },
  locations: {
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    borderRadius: Border.br_smi,
    backgroundColor: Color.colorWhitesmoke,
    borderColor: Color.colorGray_300,
    borderWidth: 1,
    height: 100,
    borderStyle: "solid",
    alignSelf: "stretch",
    padding: Padding.p_base,
  },

});

export default Trip;