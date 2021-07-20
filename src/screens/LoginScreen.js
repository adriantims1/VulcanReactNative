import React, { useState, useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Text,
  VStack,
} from "native-base";
import { style } from "styled-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//Context
import InitDataContext from "../context/InitDataContext";
import ChartDataContext from "../context/ChartDataContext";

//Websockets
import {
  connectWsSocket,
  connectAsSocket,
  subscribeAsSocket,
  wsSocket,
  asSocket,
} from "../components/WebSockets";

//Helper Functions
import { initCandles } from "../helper functions/Binomo Requests/Non-Websockets";
import { initTradeHistory } from "../helper functions/tradeHistory";

const TradingScreen = ({ navigation }) => {
  const {
    setAvailableMarket,
    setData,
    setScale,
    setYAnnotation,
    setShowAnnotation,
  } = useContext(ChartDataContext);

  const {
    state,
    setTodayProfit,
    setTradeHistory,
    setBalance,
    setIso,
    modifyTradeHistory,
    addTradeHistory,
  } = useContext(InitDataContext);
  const [authToken, setAuthTokenState] = useState("");
  const [deviceId, setDeviceIdState] = useState("");
  const [error2Connect, setError2Connect] = useState(false);

  //useEffect
  useEffect(() => {
    setShowAnnotation(false, "");
    async function getStoredData() {
      const authtoken = await AsyncStorage.getItem("authtoken");
      const deviceid = await AsyncStorage.getItem("deviceid");
      setAuthTokenState(authtoken ? authtoken : "");
      setDeviceIdState(deviceid ? deviceid : "");
    }
    getStoredData();
  }, []);

  //<------------------------------->
  //Functions

  const handleConnect = () => {
    let asSocketOpen,
      wsSocketOpen = false;

    connectAsSocket();
    connectWsSocket(authToken, deviceId, setYAnnotation, setTodayProfit);
    asSocket.onerror = (event) => {
      setError2Connect(true);
      console.log("AsSocket cannot connect", event);
    };
    wsSocket.onerror = (event) => {
      setError2Connect(true);
      console.log("wssocket broken", event);
    };
    asSocket.addEventListener("open", () => {
      subscribeAsSocket("", "Z-CRY/IDX", false);
      initCandles("Z-CRY/IDX", setData, setScale);
      asSocketOpen = true;
      if (wsSocketOpen) {
        wsSocket.removeEventListener("open", () => {});
        asSocket.removeEventListener("open", () => {});

        navigation.navigate("InApp", {
          firstNavigation: navigation.navigate(),
        });
      }
    });
    wsSocket.addEventListener("open", () => {
      async function setStorage() {
        try {
          let config = {
            headers: {
              "Authorization-Token": authToken,
              "Device-Id": deviceId,
              "Device-Type": "android",
              "Authorization-Version": 2,
            },
          };
          let bankData = await axios.get(
            "https://api.binomo.com/bank/v1/read?locale=en",
            config
          );
          let demoTradeData = await axios.get(
            "https://api.binomo.com//platform/private/v2/deals/option?type=demo&tournament_id=&locale=en",
            config
          );
          let realTradeData = await axios.get(
            "https://api.binomo.com//platform/private/v2/deals/option?type=real&tournament_id=&locale=en",
            config
          );
          bankData = bankData.data.data;
          demoTradeData = demoTradeData.data.data.binary_option_deals;
          realTradeData = realTradeData.data.data.binary_option_deals;

          //tradeData = {asset_name, status, trend, win, uuid}
          tempDemo = [];
          tempReal = [];

          demoTradeData.forEach(({ asset_name, status, trend, win, uuid }) => {
            tempDemo.push({ asset_name, status, trend, win, uuid });
          });
          realTradeData.forEach(({ asset_name, status, trend, win, uuid }) => {
            realDemo.push({ asset_name, status, trend, win, uuid });
          });
          setBalance({ demo: bankData[0].amount, real: bankData[1].amount });
          setIso(bankData[0].currency);
          setTradeHistory({ real: tempReal, demo: tempDemo });
          initTradeHistory({ real: tempReal, demo: tempDemo }, setTradeHistory);
          await AsyncStorage.setItem("authtoken", authToken);
          await AsyncStorage.setItem("deviceid", deviceId);
          await setAvailableMarket();
          wsSocketOpen = true;
          if (asSocketOpen) {
            asSocket.removeEventListener("open", () => {});
            wsSocket.removeEventListener("open", () => {});
            navigation.navigate("InApp");
          }
        } catch (err) {
          console.log(err);
          setError2Connect(true);
        }
      }
      setStorage();
    });
    //navigation.navigate("InApp");
  };
  const handleAuthToken = (value) => {
    setAuthTokenState(value);
  };
  const handleDeviceId = (value) => {
    setDeviceIdState(value);
  };
  return (
    <SafeAreaView>
      <Box style={style.container} mx={5} my={5}>
        <Heading color="primary.800" size="xl">
          Welcome
        </Heading>
        <Heading size="md">Connect to start trading</Heading>
        <FormControl isRequired isInvalid={error2Connect}>
          <VStack mt={5}>
            <FormControl.Label>Authorization Token</FormControl.Label>
            <Input
              variant="outline"
              value={authToken}
              onChangeText={handleAuthToken}
            ></Input>
          </VStack>
        </FormControl>
        <FormControl isRequired isInvalid={error2Connect}>
          <VStack my={5}>
            <FormControl.Label>Device Id</FormControl.Label>
            <Input
              variant="outline"
              value={deviceId}
              onChangeText={handleDeviceId}
            ></Input>
            <FormControl.ErrorMessage>
              Authorization Token or Device Id Invalid Check Again
            </FormControl.ErrorMessage>
          </VStack>
        </FormControl>
        <Button onPress={handleConnect} variant="solid">
          Connect
        </Button>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    flex: 1,
    alignContent: "center",
    backgroundColor: "red",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 30,
  },
});

export default TradingScreen;
