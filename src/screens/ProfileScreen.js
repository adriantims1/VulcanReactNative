import {
  FormControl,
  Input,
  VStack,
  Button,
  Center,
  Box,
  IconButton,
  PresenceTransition,
  Alert,
} from "native-base";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LogoutIcon from "../components/icons/LogoutIcon";

//Components
import EyeCloseIcon from "../components/icons/EyeCloseIcon";
import EyeOpenIcon from "../components/icons/EyeOpenIcon";

//Redux
import { connect } from "react-redux";
import { disconnectWebSocket } from "../actions/webSocketAction";
import { sendLogoutInfo } from "../actions/accountInfoAction";

//Actions
import { changeName, changePassword } from "../actions/accountInfoAction";

//Components
import Error from "../components/Error";
import Header from "../components/Header";

const ProfileScreen = ({
  navigation,
  webSocket,
  profileData,
  marketData,
  accountInfo,
  changeName,
  changePassword,
  disconnectWebSocket,
  sendLogoutInfo,
}) => {
  const [name, setName] = useState(accountInfo.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [disableLogout, setDisableLogout] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState("password");
  const [currentPasswordVisible, setCurrentPasswordVisible] =
    useState("password");
  const [newPasswordVisible, setNewPasswordVisible] = useState("password");
  const [alert, setAlert] = useState("close");
  const [errMessage, setErrMessage] = useState("");

  const handleLogout = () => {
    if (disableLogout) return;
    if (marketData.robotStatus !== "close" || marketData.showAnnotation) {
      setOpenAlertDialog(true);
    } else {
      disconnectWebSocket();
      sendLogoutInfo(() => {
        setDisableLogout(false);
        navigation.navigate("Login");
      });
    }
  };
  const handleSaveName = () => {
    console.log(name !== accountInfo.name);
    if (name !== accountInfo.name) {
      //Dispatch the name to server
      setSaving(true);
      changeName(name, () => {
        setSaving(false);
      });
    }
  };

  const handleSavePassword = () => {
    if (newPassword === confirmPassword) {
      setSavingPassword(true);
      changePassword(newPassword, currentPassword, () => {
        setSavingPassword(false);
        setAlert("success");
      });
    } else {
      setAlert("error");
      setErrMessage("Confirm password do not match");
    }
  };

  return webSocket.hasError || profileData.hasError || marketData.hasError ? (
    <Error />
  ) : (
    <>
      <Header
        title="Profile"
        icons={[<LogoutIcon />]}
        iconFunctions={[handleLogout]}
      />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={"always"}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Center>
          <Box width="90%">
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
                <FormControl.Label>Name</FormControl.Label>
                <Input
                  value={name}
                  onChangeText={(value) => {
                    console.log(value);
                    setName(value);
                  }}
                  mb={4}
                />
              </VStack>
            </FormControl>
            <Button
              variant="solid"
              isLoading={saving}
              isLoadingText="Changing"
              onPress={handleSaveName}
            >
              Change Name
            </Button>
            <FormControl>
              <VStack>
                <FormControl.Label>Current Password</FormControl.Label>
                <Input
                  value={currentPassword}
                  onChangeText={(value) => {
                    setCurrentPassword(value);
                  }}
                  type={currentPasswordVisible}
                  InputRightElement={
                    <IconButton
                      icon={
                        currentPasswordVisible === "password" ? (
                          <EyeOpenIcon />
                        ) : (
                          <EyeCloseIcon />
                        )
                      }
                      onPress={() => {
                        if (currentPasswordVisible === "password")
                          setCurrentPasswordVisible("string");
                        else {
                          setCurrentPasswordVisible("password");
                        }
                      }}
                    />
                  }
                />
              </VStack>
            </FormControl>
            <FormControl>
              <VStack>
                <FormControl.Label>New Password</FormControl.Label>
                <Input
                  value={newPassword}
                  onChangeText={(value) => {
                    setNewPassword(value);
                  }}
                  type={newPasswordVisible}
                  InputRightElement={
                    <IconButton
                      icon={
                        newPasswordVisible === "password" ? (
                          <EyeOpenIcon />
                        ) : (
                          <EyeCloseIcon />
                        )
                      }
                      onPress={() => {
                        if (newPasswordVisible === "password")
                          setNewPasswordVisible("string");
                        else {
                          setNewPasswordVisible("password");
                        }
                      }}
                    />
                  }
                />
              </VStack>
            </FormControl>
            <FormControl>
              <VStack>
                <FormControl.Label>Confirm Password</FormControl.Label>
                <Input
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);
                  }}
                  mb={4}
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
                />
              </VStack>
            </FormControl>
            <Button
              variant="solid"
              isLoading={savingPassword}
              isLoadingText="Changing"
              onPress={handleSavePassword}
            >
              Change Password
            </Button>
          </Box>
        </Center>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({});

const mapStateToProps = (state) => ({
  webSocket: state.webSocket,
  profileData: state.profileData,
  marketData: state.marketData,
  accountInfo: state.accountInfo,
});

const mapDispatchToProps = {
  changePassword,
  changeName,
  disconnectWebSocket,
  sendLogoutInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
