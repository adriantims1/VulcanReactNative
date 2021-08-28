import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import {
  Box,
  Button,
  Center,
  FormControl,
  Input,
  Radio,
  VStack,
  AlertDialog,
  Alert,
  Text,
  PresenceTransition,
} from "native-base";

//Components
import Header from "../components/Header";

import Error from "../components/Error";

//Redux
import { connect } from "react-redux";
import { modifySettings } from "../actions/profileDataAction";

const SettingsScreen = ({
  navigation,
  profileData,
  modifySettings,
  marketData,

  webSocket,
}) => {
  const [stateSettings, setStateSettings] = useState(profileData.settings);
  const [saving, setSaving] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [alert, setAlert] = useState("close");
  const [errMessage, setErrMessage] = useState("");
  const dispatch = useDispatch();

  const handleSaveButton = () => {
    setSaving((prev) => !prev);
    if (
      stateSettings.maxLoss * 0.05 < profileData.limit.min / 100 ||
      stateSettings.maxLoss * 0.6 > profileData.limit.max / 100
    ) {
      setErrMessage("Max loss too large/small");
      setAlert("error");
      setSaving((prev) => !prev);
      return;
    }
    if (
      profileData.balance[stateSettings.balanceType] <
      profileData.settings.maxLoss
    ) {
      setErrMessage("Max loss must be greater than balance");
      setAlert("error");
      setSaving((prev) => !prev);
      return;
    }
    modifySettings(stateSettings);
    setAlert("success");
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
    setStateSettings({ ...stateSettings, maxLoss: Number(value) });
  };
  return webSocket.hasError || profileData.hasError || marketData.hasError ? (
    <Error />
  ) : (
    <>
      <SafeAreaView>
        <Header title="Settings" />
        <Center style={styles.bodyContainer}>
          <Box w="90%">
            <VStack space="lg">
              <PresenceTransition
                visible={alert !== "close"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 250 } }}
                onTransitionComplete={(phase) => {
                  if (phase === "entered") {
                    setTimeout(() => {
                      setAlert("close");
                    }, 5000);
                  }
                }}
              >
                {alert !== "close" && (
                  <Alert status={alert} w="100%">
                    <Alert.Icon />
                    <Alert.Title flexShrink={1}>
                      {alert === "error" ? errMessage : "Succesful!"}
                    </Alert.Title>
                  </Alert>
                )}
              </PresenceTransition>
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
                  <FormControl.Label>Max Profit / Day</FormControl.Label>
                  <Input
                    InputLeftElement={
                      <Text ml={3} fontWeight="500">
                        {profileData.unit}
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
                  <FormControl.Label>Max Loss / Day</FormControl.Label>
                  <Input
                    keyboardType="numeric"
                    InputLeftElement={
                      <Text ml={3} fontWeight="500">
                        {profileData.unit}
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
                  marketData.robotStatus !== "close" ||
                  marketData.showAnnotation ||
                  saving
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
const mapStateToProps = (state) => ({
  profileData: state.profileData,
  marketData: state.marketData,
  webSocket: state.webSocket,
});

export default connect(mapStateToProps, {
  modifySettings,
})(SettingsScreen);
