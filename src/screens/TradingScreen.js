import React, { useState, useEffect, useCallback } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Box,
  Button,
  FlatList,
  Heading,
  Image,
  HStack,
  Pressable,
  Text,
  VStack,
  Spinner,
} from "native-base";

//Components
import Header from "../components/Header";
import Chart from "../components/Chart Tools/Chart";
import Error from "../components/Error";

//Redux
import { connect } from "react-redux";
import {
  subscribeAsSocket,
  listenAsResponse,
  stopListeningAsResponse,
  startRobot,
  stopRobot,
} from "../actions/webSocketAction";
import { changeSelectedMarket } from "../actions/marketDataAction";
import { populateCandleData } from "../actions/candleDataAction";

const { height } = Dimensions.get("window");

const TradingScreen = ({
  marketData,
  profileData,
  changeSelectedMarket,
  populateCandleData,
  listenAsResponse,
  stopListeningAsResponse,
  webSocket,
  startRobot,
  stopRobot,
}) => {
  const [prevRic, setPrevRic] = useState(marketData.selectedMarket.ric);

  useEffect(() => {
    listenAsResponse();
    return () => {
      stopListeningAsResponse();
    };
  }, []);

  useEffect(() => {
    subscribeAsSocket(prevRic, marketData.selectedMarket.ric, true);
    setPrevRic(marketData.selectedMarket.ric);
    populateCandleData(marketData.selectedMarket.ric);
  }, [marketData.selectedMarket.ric]);

  const saveMarket = (selectedMarket) => {
    changeSelectedMarket(selectedMarket);
  };
  const handleTradeButton = () => {
    if (marketData.robotStatus === "open") {
      stopRobot();
    } else {
      startRobot();
    }
  };

  return webSocket.hasError || profileData.hasError || marketData.hasError ? (
    <Error />
  ) : (
    <SafeAreaView>
      <Header title="Trade" />
      <ScrollView>
        <Box w="90%" h={height * 0.55} m={0} p={0} alignSelf="center">
          <Heading color="primary.800" marginBottom={3} marginLeft={3}>
            {marketData.selectedMarket.name}
          </Heading>
          <Chart />
        </Box>

        <Box w="90%" alignSelf="center" mb={3} mt={3}>
          <Heading size="md">Available Market: </Heading>
          <Box mt={3}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={marketData.tradeableMarket}
              keyExtractor={(el) => el.ric}
              renderItem={({ item, index }) => (
                <Pressable
                  disabled={
                    marketData.robotStatus !== "close" ||
                    marketData.showAnnotation
                  }
                  mr={3}
                  onPress={() => {
                    saveMarket(item);
                  }}
                  _pressed={{
                    backgroundColor: "#0b4870",
                  }}
                >
                  {() => (
                    <HStack
                      style={styles.card}
                      opacity={
                        marketData.robotStatus !== "close" ||
                        marketData.showAnnotation
                          ? 0.5
                          : 1
                      }
                      borderWidth={
                        marketData.selectedMarket.ric === item.ric ? 0 : 2
                      }
                      borderColor="black"
                      borderRadius={10}
                      space={3}
                      bgColor={
                        marketData.selectedMarket.ric === item.ric
                          ? "primary.800"
                          : "white"
                      }
                      p={4}
                    >
                      <Image
                        source={{
                          uri: marketData.marketIcons[item.name],
                        }}
                        alt="testing"
                        w={10}
                        h={10}
                        resizeMode="contain"
                      ></Image>

                      <VStack>
                        <Text
                          color={
                            marketData.selectedMarket.ric === item.ric
                              ? "white"
                              : "black"
                          }
                        >
                          {item.name}
                        </Text>
                        <Text
                          color={
                            marketData.selectedMarket.ric === item.ric
                              ? "white"
                              : "black"
                          }
                        >
                          {`${item.percent}%`}
                        </Text>
                      </VStack>
                    </HStack>
                  )}
                </Pressable>
              )}
            />
          </Box>
        </Box>

        <Button
          w="90%"
          alignSelf="center"
          onPress={handleTradeButton}
          mb={3}
          disabled={
            profileData.todayProfit[profileData.settings.balanceType] / 100 >=
              profileData.settings.maxProfit ||
            marketData.robotStatus === "wait"
          }
        >
          {marketData.robotStatus === "open" ? (
            "Stop Trade"
          ) : marketData.robotStatus === "close" ? (
            "Start Trade"
          ) : (
            <Spinner color="primary.800" size="sm" />
          )}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    maxHeight: 50,
    maxWidth: "auto",
  },
});

const mapStateToProps = (state) => ({
  marketData: state.marketData,
  profileData: state.profileData,
  webSocket: state.webSocket,
});

const mapDispatchToProps = {
  changeSelectedMarket,
  populateCandleData,
  listenAsResponse,
  stopListeningAsResponse,
  startRobot,
  stopRobot,
};

export default connect(mapStateToProps, mapDispatchToProps)(TradingScreen);
