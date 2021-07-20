import React, { useContext, useEffect } from "react";
import { StyleSheet, Dimensions, InteractionManager } from "react-native";
import { Box, Heading, FlatList } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

//Components
import Steps from "../components/Steps";
import BalanceCard from "../components/Balance Card";
import TradeCard from "../components/Trade Card";

//Context
import InitDataContext from "../context/InitDataContext";
import ChartDataContext from "../context/ChartDataContext";

//Icon
import UpIcon from "../components/icons/UpIcon";
import DownIcon from "../components/icons/DownIcon";

//WebSockets
import { setTradeHistoryFunc } from "../components/WebSockets";
import { startDetecting } from "react-native/Libraries/Utilities/PixelRatio";

const { height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { state, setTradeHistory } = useContext(InitDataContext);

  const { setShowAnnotation } = useContext(ChartDataContext);
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    setTradeHistoryFunc(setShowAnnotation);
  }, []);
  return (
    <SafeAreaView>
      <Box style={styles.container}>
        <Box flex={2}>
          <Box
            flex={1}
            alignItems="stretch"
            py={10}
            justifyContent="space-around"
          >
            <Box>
              <Heading style={{ fontSize: 25 }} alignSelf="flex-start">
                Hi there,
              </Heading>
              <Heading style={styles.heading} alignSelf="flex-start">
                Ready to make profit?
              </Heading>
            </Box>

            <Box mt={10}>
              <Steps />
            </Box>
          </Box>
        </Box>
        <BalanceCard />
        <Box flex={1}>
          <Box flex={1} justifyContent="center">
            <Heading size="lg">Recent Trades:</Heading>
          </Box>

          <Box flex={3}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={
                state.settings.balanceType === "demo"
                  ? state.tradeHistory.demo
                  : state.tradeHistory.real
              }
              keyExtractor={(el, index) => index.toString()}
              renderItem={({ item }) => {
                const { asset_name, trend, win, status } = item;
                return <TradeCard {...{ asset_name, trend, win, status }} />;
              }}
            />
          </Box>
        </Box>
        <Box flex={1}>
          <Heading size="lg">
            Today Profit:{" "}
            {` ${state.iso} ${
              state.todayProfit % 100 === 0
                ? numberWithCommas(state.todayProfit / 100).concat(".00")
                : numberWithCommas(state.todayProfit / 100)
            }`}
          </Heading>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: "#0b4870",
  },

  container: {
    width: "90%",
    alignSelf: "center",
    height: height,
  },
});

export default HomeScreen;
