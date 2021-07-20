import React, { useState, useContext, useEffect } from "react";
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
} from "native-base";

//Components
import Header from "../components/Header";
import Chart from "../components/Chart Tools/Chart";

//Context
import ChartDataContext from "../context/ChartDataContext";
import InitDataContext from "../context/InitDataContext";

//Helper Functions
import { getCandles } from "../helper functions/Binomo Requests/Non-Websockets";
import {
  startRobot,
  stopRobot,
} from "../helper functions/Robot Logics/Start Trade";

//Sockets
import { subscribeAsSocket } from "../components/WebSockets";

const { width, height } = Dimensions.get("window");

const TradingScreen = ({ navigation }) => {
  const {
    state,
    setSelectedMarket,
    setTrade,
    setScale,
    setData,
    setScaleIsReady,
  } = useContext(ChartDataContext);

  const { state: InitDataState } = useContext(InitDataContext);
  const [prevRic, setPrevRic] = useState(state.selectedMarket.ric);

  useEffect(() => {
    const initChart = async () => {
      subscribeAsSocket(prevRic, state.selectedMarket.ric, true);
      setPrevRic(state.selectedMarket.ric);
    };
    initChart();
  }, [state.selectedMarket.ric]);

  const getCandleData = () => {
    return state.data;
  };

  const saveMarket = (selectedMarket) => {
    setSelectedMarket(selectedMarket);
    getCandles(selectedMarket.ric, setData, setScale);
  };
  const handleTradeButton = () => {
    if (state.isTradeOpen) {
      stopRobot();
    } else {
      startRobot({
        getCandleData,
        balanceType: InitDataState.settings.balanceType,
        iso: "USD",
        ric: state.selectedMarket.ric,
        maxLoss: InitDataState.settings.maxLoss,
      });
    }
    setTrade(!state.isTradeOpen);
  };

  return (
    <SafeAreaView>
      <Header title="Trade" />
      <ScrollView>
        <Box w="90%" h={height * 0.55} m={0} p={0} alignSelf="center">
          <Heading color="primary.800" marginBottom={3} marginLeft={3}>
            {state.selectedMarket.name}
          </Heading>
          <Chart />
        </Box>

        <Box w="90%" alignSelf="center" mb={3} mt={3}>
          <Heading size="md">Available Market: </Heading>
          <Box mt={3}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={state.allMarkets}
              keyExtractor={(el) => el.ric}
              renderItem={({ item, index }) => (
                <Pressable
                  disabled={state.isTradeOpen || state.showAnnotation}
                  mr={3}
                  onPress={() => {
                    setScaleIsReady(false);
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
                        state.isTradeOpen || state.showAnnotation ? 0.5 : 1
                      }
                      border={3}
                      borderColor={
                        state.selectedMarket.ric === item.ric
                          ? "primary.800"
                          : "black"
                      }
                      space={3}
                      bgColor={
                        state.selectedMarket.ric === item.ric
                          ? "primary.800"
                          : "white"
                      }
                      p={3}
                    >
                      <Image
                        source={{
                          uri: item.url,
                        }}
                        alt="testing"
                        w={10}
                        h={10}
                        resizeMode="contain"
                      ></Image>

                      <VStack>
                        <Text
                          color={
                            state.selectedMarket.ric === item.ric
                              ? "white"
                              : "black"
                          }
                        >
                          {item.name}
                        </Text>
                        <Text
                          color={
                            state.selectedMarket.ric === item.ric
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
            InitDataState.settings.balanceType === "real" &&
            InitDataState.todayProfit / 100 >= InitDataState.settings.maxProfit
          }
        >
          {state.isTradeOpen ? "Stop Trade" : "Start Trade"}
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

export default TradingScreen;
