import { FormControl, Input, VStack, Button, Center, Box } from "native-base";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LogoutIcon from "../components/icons/LogoutIcon";

//Url

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
  const [disableLogout, setDisableLogout] = useState(false);
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
    } else {
      console.log("Wrong");
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
                  type="password"
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
                  type="password"
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
                  type="password"
                />
              </VStack>
            </FormControl>
            <Button
              variant="solid"
              isLoading={saving}
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
