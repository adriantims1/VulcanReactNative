import axios from "axios";
import { isToday } from "date-fns";
import {
  FETCH_PROFILE_DATA_FAIL,
  FETCH_PROFILE_DATA_SUCCESS,
  FETCH_PROFILE_DATA,
  MODIFY_SETTINGS,
  MODIFY_TRADE_HISTORY,
  MODIFY_TODAY_PROFIT,
} from "../constants/types/profileData";
import {
  BINOMO_AXIOS_CONFIG,
  BINOMO_GET_PROFILE_CONFIG,
  BINOMO_GET_BALANCE,
  BINOMO_GET_TRADE_HISTORY,
} from "../constants/url/binomoUrl";

var dispatchGlobal;

export const initData = (authToken, deviceId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_PROFILE_DATA });
      dispatchGlobal = dispatch;
      //iso, unit, limit, settings
      let profileConfig = await axios.get(
        BINOMO_GET_PROFILE_CONFIG(),
        BINOMO_AXIOS_CONFIG(authToken, deviceId)
      );
      profileConfig = profileConfig.data.data;
      const iso = profileConfig.currencies.list[0].iso;
      const unit = profileConfig.currencies.list[0].unit;
      const limit = {
        min: profileConfig.currencies.list[0].limits.standard_trade.min,
        max: profileConfig.currencies.list[0].limits.standard_trade.max,
      };
      let settings = {
        maxLoss: (limit.min * 20) / 100,
        maxProfit: (limit.min * 5) / 100,
        balanceType: "demo",
      };
      //balance
      let balance = await axios.get(
        BINOMO_GET_BALANCE(),
        BINOMO_AXIOS_CONFIG(authToken, deviceId)
      );
      balance = {
        real: balance.data.data.balance,
        demo: balance.data.data.demo_balance,
      };

      //tradeHistory & todayProfit
      let realTradeHistory = await requestDeals("real", authToken, deviceId);
      let demoTradeHistory = await requestDeals("demo", authToken, deviceId);
      let batchKey = {
        real: realTradeHistory.batch_key,
        demo: demoTradeHistory.batch_key,
      };

      realTradeHistory = realTradeHistory.binary_option_deals;
      demoTradeHistory = demoTradeHistory.binary_option_deals;
      const tradeHistory = { demo: demoTradeHistory, real: realTradeHistory };
      const todayProfit = await calculateBatchProfit(
        realTradeHistory,
        demoTradeHistory,
        batchKey
      );
      dispatch({
        type: FETCH_PROFILE_DATA_SUCCESS,
        payload: {
          todayProfit,
          tradeHistory,
          iso,
          unit,
          limit,
          balance,
          settings,
        },
      });
    } catch (err) {
      console.log("initData", err);
      dispatch({ type: FETCH_PROFILE_DATA_FAIL, payload: err });
    }
  };
};

const requestDeals = async (dealType, authToken, deviceId, batchKey = null) => {
  try {
    let tradeData = await axios.get(
      BINOMO_GET_TRADE_HISTORY(dealType, batchKey),
      BINOMO_AXIOS_CONFIG(authToken, deviceId)
    );

    return tradeData.data.data;
  } catch (err) {
    console.log("request deals", err);
    dispatchGlobal({ type: FETCH_PROFILE_DATA_FAIL, payload: err });
  }
};

const calculateBatchProfit = async (real, demo, batchKey) => {
  let todayProfit = { demo: 0, real: 0 };
  let flagDemo,
    flagReal = true;

  do {
    if (real.length > 0)
      real.forEach((el) => {
        if (!isToday(new Date(el.close_quote_created_at))) {
          flagReal = false;
          return;
        } else if (el.status === "won") {
          todayProfit.real += el.win - el.amount;
        } else if (el.status === "lost") {
          todayProfit.real -= el.amount;
        }
      });
    else flagReal = false;
    if (demo.length > 0)
      demo.forEach((el) => {
        if (!isToday(new Date(el.close_quote_created_at))) {
          flagDemo = false;
          return;
        } else if (el.status === "won") {
          todayProfit.demo += el.win - el.amount;
        } else if (el.status === "lost") {
          todayProfit.demo -= el.amount;
        }
      });
    else flagDemo = false;
    (real = []), (demo = []);
    if (flagDemo) {
      let tempDemo = await requestDeals("demo", batchKey.demo);
      demo = tempDemo.binary_option_deals;
      batchKey.demo = tempDemo.batch_key;
    }
    if (flagReal) {
      let tempReal = await requestDeals("demo", batchKey.real);
      demo = tempReal.binary_option_deals;
      batchKey.demo = tempReal.batch_key;
    }
  } while (flagDemo || flagReal);
  return todayProfit;
};

export const modifySettings = (newSettings) => {
  return (dispatch) => {
    dispatch({ type: MODIFY_SETTINGS, payload: newSettings });
  };
};

export const addNewTradeHistory = (newTradeHistory, dealType) => {
  return (dispatch, getState) => {
    const { profileData } = getState();
    dispatch({
      type: MODIFY_TRADE_HISTORY,
      payload: {
        ...profileData.tradeHistory,
        [dealType]: [newTradeHistory, ...profileData.tradeHistory[dealType]],
      },
    });
  };
};

export const closeLatestTradeHistory = (end_rate) => {
  //Caluclate win or lose
  return (dispatch, getState) => {
    const { profileData, tradeData } = getState();
    let toModify = profileData.tradeHistory[profileData.settings.balanceType];
    const status =
      tradeData.open_rate < end_rate && tradeData.trend === "call"
        ? "win"
        : tradeData.open_rate > end_rate
        ? "lost"
        : "tie";
    const win =
      status === "win"
        ? tradeData.payment
        : status === "tie"
        ? tradeData.amount
        : 0;
    toModify[0].status = status;
    toModify[0].win = win;

    dispatch({
      type: MODIFY_TRADE_HISTORY,
      payload: {
        ...profileData.tradeHistory,
        [profileData.settings.balanceType]: toModify,
      },
    });
    const profit =
      profileData.todayProfit[tradeData.deal_type] + win - tradeData.amount;
    dispatch({
      type: MODIFY_TODAY_PROFIT,
      payload: {
        ...profileData.todayProfit,
        [profileData.settings.balanceType]: profit,
      },
    });
  };
};
