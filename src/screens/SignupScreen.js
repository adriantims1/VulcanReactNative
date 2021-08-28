import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Spinner,
  VStack,
  IconButton,
} from "native-base";
import { connect } from "react-redux";
import { EventRegister } from "react-native-event-listeners";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PasswordValidator from "password-validator";
import validator from "email-validator";

//Components
import EyeOpenIcon from "../components/icons/EyeOpenIcon";
import EyeCloseIcon from "../components/icons/EyeCloseIcon";

//Redux
import { sendRegisterInfo } from "../actions/accountInfoAction";
import { connectWebSocket } from "../actions/webSocketAction";
import { initData } from "../actions/profileDataAction";
import { setMarket } from "../actions/marketDataAction";
import { populateCandleData } from "../actions/candleDataAction";
import { Pressable, Text } from "react-native";

const SignupScreen = ({
  accountInfo,
  navigation,
  sendRegisterInfo,
  connectWebSocket,
  initData,
  setMarket,
  populateCandleData,
}) => {
  const schema = new PasswordValidator();
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(1) // Must have at least 2 digits
    .has()
    .not()
    .spaces(); // Should not have spaces

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [equal, setEqual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState("password");
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState("password");

  const handleName = (value) => {
    setName(value);
  };

  const handleEmail = (value) => {
    setEmail(value);
  };

  const handlePassword = (value) => {
    setPassword(value);
  };

  const connect = (name, authToken, deviceId) => {
    connectWebSocket(() => {
      setMarket();
      initData();
      populateCandleData("Z-CRY/IDX");
      const listener = EventRegister.addEventListener("canLogin", () => {
        EventRegister.removeEventListener(listener);
        setTimeout(async () => {
          setLoading(false);
          await AsyncStorage.setItem("login", "true");
          console.log({ name, authToken, deviceId });
          await AsyncStorage.setItem(
            "profile",
            JSON.stringify({ name, authToken, deviceId })
          );
          navigation.navigate("InApp");
        }, 1000);
      });
    });
  };

  const register = () => {
    setInvalidPassword(false);
    setEqual(true);
    setLoading(true);
    setInvalidEmail(false);
    if (confirmPassword !== password) {
      setEqual(false);
      setLoading(false);
      return;
    }
    // } else if (!schema.validate(password)) {
    //   setInvalidPassword(true);
    //   setLoading(false);
    //   return;
    // } else if (!validator.validate(email)) {
    //   setInvalidEmail(true);
    //   setLoading(false);
    //   return;
    // }
    sendRegisterInfo(
      name,
      email,
      password,
      (name, authToken, deviceId) => {
        connect(name, authToken, deviceId);
      },
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Box mx={5} my={5}>
        <Heading color="primary.800" size="lg">
          Create your account
        </Heading>
        {/* <Heading size="md">Create your Account</Heading> */}
        <FormControl>
          <VStack mt={5}>
            <FormControl.Label>Name</FormControl.Label>
            <Input
              variant="outline"
              value={name}
              onChangeText={handleName}
            ></Input>
          </VStack>
        </FormControl>
        <FormControl isInvalid={invalidEmail}>
          <VStack mt={5}>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              variant="outline"
              value={email}
              onChangeText={handleEmail}
            ></Input>
          </VStack>
        </FormControl>
        <FormControl isInvalid={invalidPassword}>
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
        <FormControl isInvalid={!equal}>
          <VStack mb={5}>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input
              variant="outline"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
              }}
              type={confirmPasswordVisible}
              InputRightElement={
                <IconButton
                  icon={
                    confirmPasswordVisible === "password" ? (
                      <EyeOpenIcon />
                    ) : (
                      <EyeCloseIcon />
                    )
                  }
                  onPress={() => {
                    if (confirmPasswordVisible === "password")
                      setConfirmPasswordVisible("string");
                    else {
                      setConfirmPasswordVisible("password");
                    }
                  }}
                />
              }
            ></Input>
            <FormControl.ErrorMessage>
              Password confirmation incorrect
            </FormControl.ErrorMessage>
          </VStack>
        </FormControl>
        <Button onPress={register} variant="solid" disabled={loading}>
          {loading ? <Spinner color="primary.800" size="sm" /> : "Register"}
        </Button>
        <Pressable
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text>Already have an account? Log in</Text>
        </Pressable>
      </Box>
    </KeyboardAwareScrollView>
  );
};

const mapStateToProps = (state) => ({
  accountInfo: state.accountInfo,
});

const mapDispatchToProps = {
  sendRegisterInfo,
  connectWebSocket,
  initData,
  populateCandleData,
  setMarket,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
