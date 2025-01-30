import React, { useMemo } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { Image } from "expo-image";
import { Color, Padding, FontSize, FontFamily, Gap } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};

const Headlines = ({
  headline, // Accept any string passed as a headline
  headlinesJustifyContent,
  onArrowLeftPress,
  containerStyle = {},
}) => {
  const headlinesStyle = useMemo(() => {
    return {
      ...getStyleValue("justifyContent", headlinesJustifyContent),
    };
  }, [headlinesJustifyContent]);


  return (
    <View style={[styles.headlines, headlinesStyle, containerStyle]}>
      <View style={[styles.headlinesInner, styles.headlinesInnerFlexBox]}>
        <View style={styles.headlinesInnerFlexBox} />
      </View>
      <View style={styles.arrowLeftParent}>
        <Pressable style={styles.arrowLeft} onPress={onArrowLeftPress}>
          <Image
            style={styles.icon}
            contentFit="cover"
            source={require("../assets/arrow-left.png")}
          />
        </Pressable>
        {<Text>headline</Text> ? (
          <Text style={styles.headlineText}>{headline}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headlinesInnerFlexBox: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: Color.tropicalRainForest600,
    width:'100%',
    height:50
  },
  icon: {
    width: "100%",
    height: "100%",
  },
  arrowLeft: {
    width: 27,
    height: 27,
  },
  headlineText: {
    flex:1,
    fontSize: FontSize.size_xl,
    fontWeight: "900",
    color: Color.colorWhite,
    textAlign: "center",
    fontFamily: FontFamily.dMSans36pt,
    padding:15
  },
  arrowLeftParent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: 0,
    marginTop: -8,
  },
  headlines: {
    backgroundColor: Color.tropicalRainForest600,
  },
});

export default Headlines;

//Mycode