import React from "react";
import { StyleSheet } from "react-native";
import { Box, HStack, IconButton, StatusBar, Heading } from "native-base";

const Header = ({ title, icons, iconFunctions }) => {
  return (
    <>
      <HStack
        bg="primary.800"
        alignItems="center"
        space="lg"
        justifyContent="space-between"
        px={3}
        py={3}
        mb={3}
      >
        <Heading color="white">{`${title}`}</Heading>
        <Box>
          {icons && icons.length > 0 ? (
            icons.map((el, index) => (
              <IconButton
                icon={el}
                onPress={iconFunctions[index]}
                key={index}
              />
            ))
          ) : (
            <Box />
          )}
        </Box>
      </HStack>
    </>
  );
};

export default Header;
