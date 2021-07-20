import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Box,
  Text,
  Heading,
  HStack,
  VStack,
  Center,
  ScrollView,
} from "native-base";

const Steps = () => {
  return (
    <HStack width="100%" alignSelf="center" justifyContent="space-between">
      <VStack alignItems="center" flex={1}>
        <Box style={styles.circle}>
          <Center flex={1}>
            <Text style={styles.text}>Step</Text>
            <Text style={styles.text}>1</Text>
          </Center>
        </Box>
        <Box mt={3} alignItems="center">
          <Text> Set Your Daily</Text>
          <Text> Target Profit</Text>
        </Box>
      </VStack>
      <VStack alignItems="center" flex={1}>
        <Box style={styles.circle}>
          <Center flex={1}>
            <Text style={styles.text}>Step</Text>
            <Text style={styles.text}>2</Text>
          </Center>
        </Box>
        <Box mt={3} alignItems="center">
          <Text>Choose A </Text>
          <Text>Market</Text>
        </Box>
      </VStack>
      <VStack alignItems="center" flex={1}>
        <Box style={styles.circle}>
          <Center flex={1}>
            <Text style={styles.text}>Step</Text>
            <Text style={styles.text}>3</Text>
          </Center>
        </Box>
        <Box mt={3} alignItems="center">
          <Text>Start </Text>
          <Text>Earning</Text>
        </Box>
      </VStack>
    </HStack>
  );
};

const styles = StyleSheet.create({
  circle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "#0b4870",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 12,
    borderWidth: 5,
    borderColor: "white",
  },
  text: {
    fontSize: 20,
    color: "white",
  },
});

export default Steps;
