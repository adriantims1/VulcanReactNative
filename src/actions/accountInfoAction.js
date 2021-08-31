import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//Types
import {
  CHANGE_ACCOUNT_NAME,
  FETCH_ACCOUNT_INFO_DATA,
  FETCH_ACCOUNT_INFO_DATA_FAIL,
  FETCH_ACCOUNT_INFO_DATA_SUCCESS,
} from "../constants/types/accountInfo";

//URL
import {
  ACCOUNT_LOGIN,
  ACCOUNT_SIGNUP,
  ACCOUNT_LOGOUT,
  ACCOUNT_NAME,
  ACCOUNT_PASSWORD,
} from "../constants/url/authenticationUrl";
import { BINOMO_AXIOS_CONFIG } from "../constants/url/binomoUrl";

import { connectWebSocket } from "./webSocketAction";

export const sendLoginInfo = (email, password, success, fail) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_ACCOUNT_INFO_DATA });

      let data = await axios.post(ACCOUNT_LOGIN(), { email, password });

      dispatch({
        type: FETCH_ACCOUNT_INFO_DATA_SUCCESS,
        payload: {
          email,
          name: data.data.data.name,
          authToken: data.data.data.authToken,
          deviceId: data.data.data.deviceId,
        },
      });
      success(
        email,
        data.data.data.name,
        data.data.data.authToken,
        data.data.data.deviceId
      );
    } catch (err) {
      fail();
      console.log(err);
      dispatch({
        type: FETCH_ACCOUNT_INFO_DATA_FAIL,
        payload: err.message,
      });
    }
  };
};

export const sendRegisterInfo = (name, email, password, success, fail) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_ACCOUNT_INFO_DATA });
      let data = await axios.post(ACCOUNT_SIGNUP(), { name, email, password });
      dispatch({
        type: FETCH_ACCOUNT_INFO_DATA_SUCCESS,
        payload: {
          name,
          authToken: data.data.data.authToken,
          deviceId: data.data.data.deviceId,
        },
      });
      success(name, data.data.data.authToken, data.data.data.deviceId);
    } catch (err) {
      dispatch({ type: FETCH_ACCOUNT_INFO_DATA_FAIL, payload: err.message });
      fail(err.message);
    }
  };
};

export const sendLogoutInfo = (success) => {
  return async (dispatch, getState) => {
    try {
      const { accountInfo } = getState();
      dispatch({ type: FETCH_ACCOUNT_INFO_DATA });
      const config = {
        headers: {
          "Authorization-Token": accountInfo.authToken,
          "Device-Id": accountInfo.deviceId,
        },
      };
      await axios.get(ACCOUNT_LOGOUT(), config);
      await AsyncStorage.setItem("login", "false");
      dispatch({
        type: FETCH_ACCOUNT_INFO_DATA_SUCCESS,
        payload: { authToken: "", deviceId: "", name: "" },
      });
      success();
    } catch (err) {
      console.log(err);
      dispatch({
        type: FETCH_ACCOUNT_INFO_DATA_FAIL,
        payload: err.message,
      });
    }
  };
};

export const justConnect = (email, name, authToken, deviceId) => ({
  type: FETCH_ACCOUNT_INFO_DATA_SUCCESS,
  payload: { email, name, authToken, deviceId },
});

export const changePassword = (new_password, current_password, success) => {
  return async (dispatch, getState) => {
    try {
      console.log("hello");
      const { accountInfo } = getState();
      console.log(accountInfo.email);
      const data = await axios.post(
        ACCOUNT_PASSWORD(),
        {
          email: accountInfo.email,
          new_password,
          new_password_confirmation: new_password,
          current_password,
        },
        BINOMO_AXIOS_CONFIG(accountInfo.authToken, accountInfo.deviceId)
      );
      dispatch({
        type: CHANGE_ACCOUNT_PASSWORD,
        payload: data.data.authtoken,
      });
      connectWebSocket(() => {
        AsyncStorage.setItem(
          "profile",
          JSON.stringify({
            name: accountInfo.name,
            email: accountInfo.email,
            authToken: data.data.authToken,
            deviceId: accountInfo.deviceId,
          })
        );
        console.log("connected");
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: FETCH_ACCOUNT_INFO_DATA_FAIL,
        payload: err.message,
      });
    } finally {
      success();
    }
  };
};

export const changeName = (name, saving) => {
  return async (dispatch, getState) => {
    try {
      const { accountInfo } = getState();
      console.log({
        name,
        email: accountInfo.email,
      });
      await axios.post(ACCOUNT_NAME(), {
        name,
        email: accountInfo.email,
      });
      dispatch({
        type: CHANGE_ACCOUNT_NAME,
        payload: name,
      });
      await AsyncStorage.setItem(
        "profile",
        JSON.stringify({
          email: accountInfo.email,
          name,
          authToken: accountInfo.authToken,
          deviceId: accountInfo.deviceId,
        })
      );
      console.log("success");
      saving();
    } catch (err) {
      dispatch({
        type: FETCH_ACCOUNT_INFO_DATA_FAIL,
        payload: err.message,
      });
      saving();
    }
  };
};
