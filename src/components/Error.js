import React from "react";
import NotRound from "./assets/Not_Found.svg";
import { Dimensions } from "react-native";
import { Heading, Text, Center, Box } from "native-base";

const { height } = Dimensions.get("window");

const Error = () => {
  return (
    <Center
      justifyContent="center"
      alignItem="center"
      height={height}
      flexDirection="column"
    >
      <Box w="90%" h="30%">
        <NotRound
          width="100%"
          height="100%"
          style={{
            padding: 0,
            margin: 0,
          }}
        />
      </Box>
      <Heading>Something Went Wrong</Heading>
      <Text>Restart the app or Contact Us</Text>
    </Center>
  );
};

export default Error;
