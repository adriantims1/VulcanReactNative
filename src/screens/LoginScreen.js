import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Spinner,
  VStack,
} from "native-base";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventRegister } from "react-native-event-listeners";

//Redux
import { connect } from "react-redux";
import { connectWebSocket } from "../actions/webSocketAction";
import { setMarket } from "../actions/marketDataAction";
import { initData } from "../actions/profileDataAction";
import { populateCandleData } from "../actions/candleDataAction";

const TradingScreen = ({
  navigation,
  connectWebSocket,
  webSocket,
  setMarket,
  initData,
  populateCandleData,
  marketData,
  profileData,
}) => {
  const [authToken, setAuthTokenState] = useState("");
  const [deviceId, setDeviceIdState] = useState("");

  //useEffect
  useEffect(() => {
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
    connectWebSocket(authToken, deviceId, () => {
      console.log("success called");
      setMarket(authToken, deviceId);
      initData(authToken, deviceId);
      populateCandleData("Z-CRY/IDX");
      const listener = EventRegister.addEventListener("canLogin", () => {
        console.log("login");
        EventRegister.removeEventListener(listener);

        setTimeout(() => {
          navigation.navigate("InApp");
        }, 1000);
      });
    });
  };
  const handleAuthToken = (value) => {
    setAuthTokenState(value);
  };
  const handleDeviceId = (value) => {
    setDeviceIdState(value);
  };
  return (
    <SafeAreaView>
      <Box mx={5} my={5}>
        <Heading color="primary.800" size="xl">
          Welcome
        </Heading>
        <Heading size="md">Connect to start trading</Heading>
        <FormControl isRequired isInvalid={webSocket.hasError}>
          <VStack mt={5}>
            <FormControl.Label>Authorization Token</FormControl.Label>
            <Input
              variant="outline"
              value={authToken}
              onChangeText={handleAuthToken}
            ></Input>
          </VStack>
        </FormControl>
        <FormControl isRequired isInvalid={webSocket.hasError}>
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
        <Button
          onPress={handleConnect}
          variant="solid"
          disabled={webSocket.isConnecting}
        >
          {webSocket.isConnecting ? (
            <Spinner color="primary.800" size="sm" />
          ) : (
            "Connect"
          )}
        </Button>
      </Box>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  webSocket: state.webSocket,
  profileData: state.profileData,
  marketData: state.marketData,
});

const mapDispatchToProps = {
  connectWebSocket,
  initData,
  setMarket,
  populateCandleData,
};

export default connect(mapStateToProps, mapDispatchToProps)(TradingScreen);
