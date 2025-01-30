import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Color } from "../GlobalStyles";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const SplashScreen = () => {
  return (
    <View style={[styles.splashScreen, styles.splashScreenLayout]}>
      <View style={styles.illustrationWrapper}>
        <View style={styles.illustration}>
          <Image
            style={[styles.raidSmartFainal011, styles.splashScreenLayout]}
            contentFit="cover"
            source={require("../assets/splash-icon.png")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashScreenLayout: {
    overflow: "hidden",
    width: "100%",
  },
  raidSmartFainal011: {
    maxWidth: "100%",
    height: verticalScale(270),
    alignSelf: "stretch",
  },
  illustration: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  illustrationWrapper: {
    position: "absolute",
    marginTop: verticalScale(-135),
    marginLeft: scale(-179),
    top: "50%",
    left: "50%",
    width: moderateScale(358),
  },
  splashScreen: {
    backgroundColor: Color.casal950,
    flex: 1,
    height: "100%",
  },
});

export default SplashScreen;
