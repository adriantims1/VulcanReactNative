import {
  FETCH_PROFILE_DATA,
  FETCH_PROFILE_DATA_FAIL,
  FETCH_PROFILE_DATA_SUCCESS,
  MODIFY_BALANCE,
  MODIFY_ISO,
  MODIFY_LIMIT,
  MODIFY_SETTINGS,
  MODIFY_TRADE_HISTORY,
  MODIFY_TODAY_PROFIT,
} from "../constants/types/profileData";

import { EventRegister } from "react-native-event-listeners";

const initialState = {
  iso: "",
  unit: "",
  limit: { min: -1, max: -1 },
  balance: { demo: -1, real: -1 },
  settings: { maxProfit: -1, maxLoss: -1, balanceType: "demo" },
  todayProfit: { real: 0, demo: 0 },
  tradeHistory: { demo: [], real: [] },
  isFetching: false,
  hasError: false,

  errorMessage: null,
};

const profileDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_DATA:
      return {
        ...state,
        isFetching: true,
        hasError: false,
        errorMessage: true,
      };
    case FETCH_PROFILE_DATA_SUCCESS:
      const { iso, unit, limit, balance, tradeHistory, todayProfit, settings } =
        action.payload;
      EventRegister.emit("canLogin");
      return {
        ...state,
        iso,
        unit,
        limit,
        balance,
        tradeHistory,
        todayProfit,
        settings,
        isFetching: false,
      };
    case FETCH_PROFILE_DATA_FAIL:
      return { ...state, hasError: true, errorMessage: action.payload };
    case MODIFY_TRADE_HISTORY:
      return { ...state, tradeHistory: action.payload };
    case MODIFY_BALANCE:
      return { ...state, balance: action.payload };
    case MODIFY_ISO:
      return { ...state, iso: action.payload };
    case MODIFY_SETTINGS:
      return { ...state, settings: action.payload };
    case MODIFY_LIMIT:
      return { ...state, limit: action.payload };
    case MODIFY_TODAY_PROFIT:
      return { ...state, todayProfit: action.payload };

    default:
      return state;
  }
};

export default profileDataReducer;
