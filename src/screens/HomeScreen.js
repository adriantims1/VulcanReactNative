import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import {
  Box,
  Heading,
  FlatList,
  Text,
  VStack,
  ScrollView,
  Center,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

//Components
import BalanceCard from "../components/Balance Card";
import TradeCard from "../components/Trade Card";
import Error from "../components/Error";
import Empty from "../components/assets/Empty.svg";

//Redux
import { connect } from "react-redux";

const { height, width } = Dimensions.get("window");

const HomeScreen = ({ profileData, marketData, webSocket }) => {
  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  return webSocket.hasError || profileData.hasError || marketData.hasError ? (
    <Error />
  ) : (
    <SafeAreaView>
      <Box style={styles.container}>
        <Box h="20%">
          <Box alignItems="stretch" py={10} justifyContent="space-around">
            <Box>
              <Heading style={{ fontSize: 30 }} alignSelf="flex-start">
                Hi There!
              </Heading>
              <Text alignSelf="flex-start">Welcome Back</Text>
            </Box>
          </Box>
        </Box>

        <Text marginBottom={4}>Balance</Text>
        <Box style={{ height: "22%" }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            height="100%"
          >
            <VStack style={styles.balanceContainer}>
              <BalanceCard balanceType="demo" />
            </VStack>
            <VStack style={styles.balanceContainer}>
              <BalanceCard balanceType="real" />
            </VStack>
          </ScrollView>
        </Box>
        <Box style={{ marginTop: 8 }}>
          <Text>Transactions</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              profileData.settings.balanceType === "demo"
                ? profileData.tradeHistory.demo
                : profileData.tradeHistory.real
            }
            keyExtractor={(el, index) => index.toString()}
            renderItem={({ item }) => {
              const { asset_name, trend, win, status } = item;
              return <TradeCard {...{ asset_name, trend, win, status }} />;
            }}
            ListEmptyComponent={
              <Box w="100%" h="100%">
                <Center>
                  <Empty width="90%" height="50%" />
                  <Heading>Oops! No Trade Found</Heading>
                  <Text>Start Trading Now!</Text>
                </Center>
              </Box>
            }
            viewabilityConfig={viewabilityConfig}
            h="45%"
          />
        </Box>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: "lightgrey",
  },
  container: {
    width: "90%",
    alignSelf: "center",
    height: height * 0.9,
  },
  balanceContainer: {
    backgroundColor: "#0b4870",
    padding: 16,
    borderRadius: 8,
    marginRight: 16,
    width: width * 0.7,
  },
});
const mapStateToProps = (state) => ({
  profileData: state.profileData,
  marketData: state.marketData,
  webSocket: state.webSocket,
});
export default connect(mapStateToProps, {})(HomeScreen);
