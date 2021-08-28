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
  Pressable,
  IconButton,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventRegister } from "react-native-event-listeners";
import * as SplashScreen from "expo-splash-screen";

//Redux
import { connect } from "react-redux";
import { connectWebSocket } from "../actions/webSocketAction";
import { setMarket } from "../actions/marketDataAction";
import { initData } from "../actions/profileDataAction";
import { populateCandleData } from "../actions/candleDataAction";
import { sendLoginInfo, justConnect } from "../actions/accountInfoAction";

//Components
import Tutorial from "../components/Tutorial";
import { Text } from "react-native";
import EyeOpenIcon from "../components/icons/EyeOpenIcon";
import EyeCloseIcon from "../components/icons/EyeCloseIcon";

const TradingScreen = ({
  navigation,
  connectWebSocket,
  setMarket,
  initData,
  populateCandleData,
  accountInfo,
  sendLoginInfo,
  justConnect,
}) => {
  const [loading, setLoading] = useState(false);
  const [showRealApp, setShowRealApp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState("password");

  useEffect(() => {
    async function prepare() {
      try {
        // await AsyncStorage.setItem("login", "false");
        let login = await AsyncStorage.getItem("login");
        login = JSON.parse(login);
        console.log("this is login: ", login);
        if (login) {
          let data = await AsyncStorage.getItem("profile");
          data = JSON.parse(data);
          console.log(data);
          justConnect(data.email, data.name, data.authToken, data.deviceId);
          connect(data.email, data.name, data.authToken, data.deviceId);
        } else {
          SplashScreen.hideAsync();
        }
      } catch (err) {
        console.log(err);
      }
    }
    prepare();
  }, []);

  const connect = (email, name, authToken, deviceId) => {
    connectWebSocket(() => {
      setMarket();
      initData();
      populateCandleData("Z-CRY/IDX");
      const listener = EventRegister.addEventListener("canLogin", () => {
        EventRegister.removeEventListener(listener);
        setTimeout(async () => {
          setLoading(false);
          await AsyncStorage.setItem("login", "true");
          console.log({ email, name, authToken, deviceId });
          navigation.navigate("InApp");
          SplashScreen.hideAsync();
        }, 1000);
      });
    });
  };
  //<------------------------------->
  //Functions

  const handleConnect = () => {
    setLoading(true);
    sendLoginInfo(
      email,
      password,
      (email, name, authToken, deviceId) => {
        connect(email, name, authToken, deviceId);
      },
      () => {
        setLoading(false);
      }
    );
  };
  const handleEmail = (value) => {
    setEmail(value);
  };

  const handlePassword = (value) => {
    setPassword(value);
  };

  const _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state

    setShowRealApp(true);
  };

  return (
    <>
      {showRealApp ? (
        <SafeAreaView>
          <Box mx={5} my={5}>
            <Heading color="primary.800" size="xl">
              Welcome
            </Heading>
            <Heading size="md">Sign in to Start</Heading>
            <FormControl isInvalid={accountInfo.hasError}>
              <VStack mt={5}>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  variant="outline"
                  value={email}
                  onChangeText={handleEmail}
                ></Input>
              </VStack>
            </FormControl>
            <FormControl isInvalid={accountInfo.hasError}>
              <VStack my={5}>
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  variant="outline"
                  value={password}
                  onChangeText={handlePassword}
                  type={passwordVisible}
                  InputRightElement={
                    <IconButton
                      icon={
                        passwordVisible === "password" ? (
                          <EyeOpenIcon />
                        ) : (
                          <EyeCloseIcon />
                        )
                      }
                      onPress={() => {
                        if (passwordVisible === "password")
                          setPasswordVisible("string");
                        else {
                          setPasswordVisible("password");
                        }
                      }}
                    />
                  }
                ></Input>
                <FormControl.ErrorMessage>
                  Incorrect email or password
                </FormControl.ErrorMessage>
              </VStack>
            </FormControl>
            <Button onPress={handleConnect} variant="solid" disabled={loading}>
              {loading ? <Spinner color="primary.800" size="sm" /> : "Connect"}
            </Button>
            <Pressable
              onPress={() => {
                navigation.navigate("Signup");
              }}
            >
              <Text>Don't have an account? Sign Up</Text>
            </Pressable>
          </Box>
        </SafeAreaView>
      ) : (
        <Tutorial onDone={_onDone} />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  webSocket: state.webSocket,
  accountInfo: state.accountInfo,
});

const mapDispatchToProps = {
  connectWebSocket,
  initData,
  setMarket,
  populateCandleData,
  sendLoginInfo,
  justConnect,
};

export default connect(mapStateToProps, mapDispatchToProps)(TradingScreen);
