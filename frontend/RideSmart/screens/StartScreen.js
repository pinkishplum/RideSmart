import * as React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";
import { FontFamily, FontSize, Color, Gap, Border } from "../GlobalStyles";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const StartScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.startScreen}>
      <View style={styles.container}>
        <View style={styles.illustration}>
          <Image
            style={styles.mapIcon}
            source={require("../assets/start-map.png")}
          />
          <Text style={styles.caption}>
            Search then choose the cheapest ride
          </Text>
        </View>
        <View style={styles.cta}>
          {/* Log In Button */}
          <Button
            title="Log In"
            onPress={() => navigation.navigate("LogIn")}
            style={styles.button}
            textStyle={styles.buttonText} // Pass custom text style
          />
          {/* Sign Up Link */}
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUp}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  startScreen: {
    flex: 1,
    backgroundColor: Color.casal950,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: scale(Gap.gap_lg),
    width: "100%",
  },
  illustration: {
    alignItems: "center",
    marginBottom: verticalScale(Gap.gap_xl),
  },
  mapIcon: {
    width: scale(270),
    height: verticalScale(290),
    marginBottom: verticalScale(Gap.gap_md),
  },
  caption: {
    fontSize: moderateScale(FontSize.size_sm),
    lineHeight: moderateScale(22),
    fontWeight: "500",
    color: Color.white,
    textAlign: "center",
    fontFamily: FontFamily.dMSans36pt,
  },
  cta: {
    alignItems: "stretch",
    width: "100%",
    paddingHorizontal: scale(Gap.gap_lg),
  },
  button: {
    width: "100%",
  },
  buttonText: {
    fontSize: moderateScale(FontSize.size_5xl),
    fontWeight: "700",
    color: Color.white,
    textAlign: "center",
    fontFamily: FontFamily.dMSans36pt,
  },
  signUp: {
    fontSize: moderateScale(FontSize.size_5xl),
    fontWeight: "700",
    color: Color.tropicalRainForest500,
    textAlign: "center",
    fontFamily: FontFamily.dMSans36pt,
    marginTop: verticalScale(Gap.gap_md),
  },
});

export default StartScreen;
