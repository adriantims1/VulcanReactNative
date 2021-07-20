import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Box, HStack, Heading, Text, Center } from "native-base";

//Context
import InitDataContext from "../context/InitDataContext";

const Trade_Card = ({ asset_name, status, trend, win }) => {
  const { state } = useContext(InitDataContext);
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <Box style={styles.container} padding={3} justifyContent="center">
      <Center
        bgColor={status === "won" ? "primary.800" : "white"}
        borderRadius={10}
        p={3}
        style={styles.shadow}
      >
        <HStack justifyContent="space-between" w="100%">
          <Heading size="sm" color={status === "won" ? "white" : "primary.800"}>
            {asset_name}
          </Heading>
        </HStack>

        <HStack w="100%">
          <Text color={status === "won" ? "white" : "primary.800"}>{`${
            state.iso
          } ${
            win % 100 === 0
              ? numberWithCommas(win / 100).concat(".00")
              : numberWithCommas(win / 100)
          } `}</Text>
        </HStack>
      </Center>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,

    width: 150,
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

export default Trade_Card;
