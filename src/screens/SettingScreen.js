import React, { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Box,
  Button,
  Center,
  FormControl,
  Input,
  Radio,
  VStack,
  AlertDialog,
  Text,
} from "native-base";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

//Components
import Header from "../components/Header";
import LogoutIcon from "../components/icons/LogoutIcon";

//Context
import InitDataContext from "../context/InitDataContext";
import ChartDataContext from "../context/ChartDataContext";

//Websocket
import { asSocket, wsSocket } from "../components/WebSockets";

const SettingsScreen = ({ navigation, route }) => {
  const { state: chartDataState } = useContext(ChartDataContext);
  const { state, setSettings } = useContext(InitDataContext);
  const [stateSettings, setStateSettings] = useState(state.settings);
  const [saving, setSaving] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const handleLogout = () => {
    if (chartDataState.isTradeOpen || chartDataState.showAnnotation) {
      setOpenAlertDialog(true);
    } else {
      disconnect();
    }
  };
  const disconnect = () => {
    asSocket.close();
    wsSocket.close();
    navigation.navigate("Login");
  };
  const handleSaveButton = () => {
    setSaving((prev) => !prev);
    setSettings(stateSettings);
    setSaving((prev) => !prev);
  };
  const setBalanceType = (value) => {
    setStateSettings({ ...stateSettings, balanceType: value });
  };
  const setMaxProfit = (value) => {
    setStateSettings({
      ...stateSettings,
      maxProfit: Number(value),
    });
  };
  const setMaxLoss = (value) => {
    if (Number(value) < 20) {
      return;
    }
    setStateSettings({ ...stateSettings, maxLoss: Number(value) });
  };
  return (
    <>
      <SafeAreaView>
        <Header
          title="Settings"
          icons={[<LogoutIcon />]}
          iconFunctions={[handleLogout]}
        />
        <Center style={styles.bodyContainer}>
          <Box w="90%">
            <VStack space="lg">
              <FormControl>
                <VStack>
                  <FormControl.Label>Balance Type</FormControl.Label>
                  <Radio.Group
                    name="Balance Type"
                    value={stateSettings.balanceType}
                    onChange={setBalanceType}
                  >
                    <Radio
                      value="demo"
                      my={1}
                      accessibilityLabel="Demo Account"
                    >
                      Demo
                    </Radio>
                    <Radio
                      value="real"
                      my={1}
                      accessibilityLabel="Real Account"
                    >
                      Real
                    </Radio>
                  </Radio.Group>
                </VStack>
              </FormControl>
              <FormControl>
                <VStack>
                  <FormControl.Label>Real Max Profit / Day</FormControl.Label>
                  <Input
                    InputLeftElement={
                      <Text ml={3} fontWeight="500">
                        {state.iso}
                      </Text>
                    }
                    keyboardType="numeric"
                    value={stateSettings.maxProfit.toString()}
                    onChangeText={setMaxProfit}
                  />
                </VStack>
              </FormControl>
              <FormControl>
                <VStack>
                  <FormControl.Label>Real Max Loss / Day</FormControl.Label>
                  <Input
                    keyboardType="numeric"
                    InputLeftElement={
                      <Text ml={3} fontWeight="500">
                        {state.iso}
                      </Text>
                    }
                    value={stateSettings.maxLoss.toString()}
                    onChangeText={setMaxLoss}
                  />
                </VStack>
              </FormControl>
              <Button
                variant="solid"
                isLoading={saving}
                isLoadingText="Saving"
                onPress={handleSaveButton}
                disabled={
                  chartDataState.isTradeOpen || chartDataState.showAnnotation
                }
              >
                Save
              </Button>
            </VStack>
          </Box>
        </Center>
      </SafeAreaView>
      <AlertDialog isOpen={openAlertDialog} motionPreset="fade">
        <AlertDialog.Content>
          <AlertDialog.Header>Confirmation</AlertDialog.Header>
          <AlertDialog.Body>
            You have active trade sure want to log out?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => {
                  setOpenAlertDialog(false);
                }}
                colorScheme="primary"
              >
                Cancel
              </Button>
              <Button
                size="md"
                variant="ghost"
                onPress={disconnect}
                colorScheme="primary"
              >
                Logout
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {},
  text: {
    fontSize: 30,
  },
});

export default SettingsScreen;
