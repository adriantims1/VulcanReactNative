import {
  FETCH_ACCOUNT_INFO_DATA,
  FETCH_ACCOUNT_INFO_DATA_SUCCESS,
  FETCH_ACCOUNT_INFO_DATA_FAIL,
  CHANGE_ACCOUNT_NAME,
  CHANGE_ACCOUNT_PASSWORD,
} from "../constants/types/accountInfo";

const initialState = {
  authToken: "",
  deviceId: "",
  name: "",
  email: "",
  isAuthenticating: false,
  hasError: false,
  errorMessage: "",
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_ACCOUNT_INFO_DATA_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        name: payload.name,
        email: payload.email,
        authToken: payload.authToken,
        deviceId: payload.deviceId,
      };
    case FETCH_ACCOUNT_INFO_DATA_FAIL:
      return {
        ...state,
        isAuthenticating: false,
        hasError: true,
        errorMessage: payload,
      };
    case FETCH_ACCOUNT_INFO_DATA:
      return {
        ...state,
        isAuthenticating: true,
      };
    case CHANGE_ACCOUNT_NAME:
      return {
        ...state,
        hasError: false,
        errorMessage: "",
        isAuthenticating: false,
        name: payload,
      };
    case CHANGE_ACCOUNT_PASSWORD:
      return {
        ...state,
        hasError: false,
        errorMessage: "",
        isAuthenticating: false,
        authToken: payload,
      };
    default:
      return state;
  }
};
