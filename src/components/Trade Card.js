import React from "react";
import { StyleSheet } from "react-native";
import { Box, HStack, Heading, Text, Center, Image } from "native-base";

//Icon
import DownIcon from "./icons/DownIcon";
import UpIcon from "./icons/UpIcon";

//Redux
import { connect } from "react-redux";

const Trade_Card = ({
  asset_name,
  status,
  trend,
  win,
  marketData,
  profileData,
}) => {
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <Box
      style={styles.container}
      justifyContent="center"
      borderWidth={status !== "won" ? 2 : 0}
      borderColor="primary.800"
      borderRadius={10}
    >
      <Center
        bgColor={
          status === "lost" || status === "open" ? "white" : "primary.800"
        }
        borderRadius={10}
        p={3}
      >
        <HStack w="100%" justifyContent="space-between" alignItems="center">
          <Image
            source={{ uri: marketData.marketIcons[asset_name] }}
            size={"xs"}
            alt="asset logo"
          />
          <Heading size="sm" color={status !== "won" ? "primary.800" : "white"}>
            {asset_name}
          </Heading>
          {trend === "call" ? (
            <UpIcon color="#14C679" />
          ) : (
            <DownIcon color="#FF646C" />
          )}
          <Text color={status !== "won" ? "primary.800" : "white"}>{`${
            profileData.unit
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
    width: "100%",
    marginVertical: 4,
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
const mapStateToProps = (state) => ({
  marketData: state.marketData,
  profileData: state.profileData,
});

export default connect(mapStateToProps, {})(Trade_Card);
