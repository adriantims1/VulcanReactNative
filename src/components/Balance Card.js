import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { VStack, Box, Heading, Text } from "native-base";

//Redux
import { connect } from "react-redux";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Balance_Card = ({ balanceType, profileData }) => {
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <>
      <Box>
        <Text style={styles.heading}>
          {`${capitalizeFirstLetter(balanceType)}`} Balance{" "}
        </Text>
        <Heading size="xl" color="white">
          {` ${profileData.unit} ${
            profileData.balance[balanceType] % 100 === 0
              ? numberWithCommas(profileData.balance[balanceType] / 100).concat(
                  ".00"
                )
              : numberWithCommas(profileData.balance[balanceType] / 100)
          }`}
        </Heading>
      </Box>
      <Box>
        <Text style={styles.heading}>
          {`${capitalizeFirstLetter(balanceType)}`} Profit{" "}
        </Text>
        <Heading size="xl" color="white">
          {` ${profileData.unit} ${
            profileData.todayProfit[balanceType] % 100 === 0
              ? numberWithCommas(
                  profileData.todayProfit[balanceType] / 100
                ).concat(".00")
              : numberWithCommas(profileData.todayProfit[balanceType] / 100)
          }`}
        </Heading>
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  balanceCardContent: {
    fontSize: 20,
  },
  heading: {
    fontSize: 12,
    color: "lightgrey",
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
  profileData: state.profileData,
});

export default connect(mapStateToProps)(Balance_Card);
