import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { HStack, Box, Heading, Text } from "native-base";

//Context
import InitDataContext from "../context/InitDataContext";

const Balance_Card = () => {
  const { state } = useContext(InitDataContext);
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <HStack justifyContent="space-evenly" flex={1} mb={5}>
      <Box
        flex={1}
        bgColor="primary.800"
        borderRadius={30}
        style={styles.shadow}
        border={5}
        borderColor="white"
      >
        <Box flex={1} justifyContent="center" p={3}>
          <Text color="white">Real Balance</Text>
          <Box flexDirection="row" mt={3}>
            <Heading style={styles.balanceCardContent} color="white">
              {state.iso}
            </Heading>
            <Heading ml={5} style={styles.balanceCardContent} color="white">
              {state.balance.real % 100 === 0
                ? numberWithCommas(state.balance.real / 100).concat(".00")
                : numberWithCommas(state.balance.real / 100)}
            </Heading>
          </Box>
        </Box>
      </Box>
      <Box flex={0.1}></Box>
      <Box
        flex={1}
        bgColor="white"
        borderRadius={30}
        style={styles.shadow}
        border={5}
        borderColor="primary.800"
      >
        <Box flex={1} justifyContent="center" p={3}>
          <Text color="primary.800">Demo Balance</Text>
          <Box flexDirection="row" mt={3}>
            <Heading style={styles.balanceCardContent} color="primary.800">
              {state.iso}
            </Heading>
            <Heading
              ml={5}
              style={styles.balanceCardContent}
              color="primary.800"
            >
              {state.balance.demo % 100 === 0
                ? numberWithCommas(state.balance.demo / 100).concat(".00")
                : numberWithCommas(state.balance.demo / 100)}
            </Heading>
          </Box>
        </Box>
      </Box>
    </HStack>
  );
};

const styles = StyleSheet.create({
  balanceCardContent: {
    fontSize: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 12,
  },
});

export default Balance_Card;
