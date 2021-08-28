import React from "react";
import { Box, Heading, Text } from "native-base";
import { Image, StyleSheet } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: "#0b4870",
    textAlign: "center",
  },
  title: {
    color: "#0b4870",
    textAlign: "center",
  },
});

const slides = [
  {
    key: "1",
    title: "Register an account",
    image: require("../components/assets/register.png"),
    text: "Create a free account with us \n and start earning",
    backgroundColor: "white",
  },
  {
    key: "2",
    title: "Change your settings",
    text: "Set acceptable losses",
    image: require("../components/assets/settings.png"),
    backgroundColor: "white",
  },
  {
    key: "3",
    title: "Choose A Market",
    text: "Choose the most profitable market \n or the one you love",
    backgroundColor: "white",
    image: require("../components/assets/market.png"),
  },
  {
    key: "4",
    title: "Start Trading",
    text: "Click the start button and let us do the rest",
    backgroundColor: "white",
    image: require("../components/assets/start.png"),
  },
];

const Tutorial = ({ onDone }) => {
  const _renderItem = ({ item }) => (
    <Box style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Heading style={styles.title}>{item.title}</Heading>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.text}>{item.text}</Text>
    </Box>
  );
  const _renderNextButton = () => <Text style={styles.text}>Next</Text>;

  const _renderDoneButton = () => <Text style={styles.text}>Close</Text>;

  const _renderSkipButton = () => <Text style={styles.text}>Skip</Text>;

  return (
    <AppIntroSlider
      renderItem={_renderItem}
      onDone={onDone}
      data={slides}
      activeDotStyle={{ backgroundColor: "#0b4870" }}
      dotStyle={{ backgroundColor: "lightgrey" }}
      renderNextButton={_renderNextButton}
      renderDoneButton={_renderDoneButton}
      showSkipButton
      renderSkipButton={_renderSkipButton}
    />
  );
};

export default Tutorial;
