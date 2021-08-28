import {
  FETCH_MARKET_DATA,
  FETCH_MARKET_DATA_SUCCESS,
  FETCH_MARKET_DATA_FAIL,
  MODIFY_SELECTED_MARKET,
  ADD_ANNOTATION,
  REMOVE_ANNOTATION,
} from "../constants/types/marketData";

import {
  BINOMO_AXIOS_CONFIG,
  BINOMO_GET_ALL_MARKET,
} from "../constants/url/binomoUrl";

import axios from "axios";

export const setMarket = () => {
  return async (dispatch, getState) => {
    try {
      const { accountInfo } = getState();
      dispatch({ type: FETCH_MARKET_DATA });
      //get all markets & icons
      let allMarkets = await axios.get(
        BINOMO_GET_ALL_MARKET(),
        BINOMO_AXIOS_CONFIG(accountInfo.authToken, accountInfo.deviceId)
      );
      allMarkets = allMarkets.data.data.assets;
      let marketIcons = {};
      allMarkets.forEach(({ name, icon }) => {
        marketIcons[name] = icon.url;
      });
      //find tradeableMarket
      let tradeableMarket = findTradeableMarket(allMarkets);

      dispatch({
        type: FETCH_MARKET_DATA_SUCCESS,
        payload: {
          tradeableMarket,
          marketIcons,
          selectedMarket: allMarkets[0],
        },
      });
    } catch (err) {
      console.log(err);
      dispatch({ type: FETCH_MARKET_DATA_FAIL, payload: err });
    }
  };
};

const findTradeableMarket = (data) => {
  const d = new Date();
  const day = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  var today =
    10 <= d.getUTCHours()
      ? d.getUTCHours() +
        ":" +
        (10 > d.getUTCMinutes() ? "0" + d.getUTCMinutes() : d.getUTCMinutes())
      : "0" +
        d.getUTCHours() +
        ":" +
        (10 > d.getUTCMinutes() ? "0" + d.getUTCMinutes() : d.getUTCMinutes());

  var tradeableMarket = [];

  data.forEach((el) => {
    if (
      el.active &&
      el.trading_tools_settings.option.base_payment_rate_turbo >= 80 &&
      /*check the demo and real availability &&*/ today >
        el.trading_tools_settings.option.schedule[day[d.getUTCDay()]][0][0] &&
      today <
        el.trading_tools_settings.option.schedule[day[d.getUTCDay()]][0][1]
    ) {
      tradeableMarket.push({
        name: el.name,
        ric: el.ric,
        percent: el.trading_tools_settings.option.base_payment_rate_turbo,
      });
    }
  });
  return tradeableMarket;
};

export const changeSelectedMarket = (newSelectedMarket) => {
  return (dispatch) => {
    dispatch({ type: MODIFY_SELECTED_MARKET, payload: newSelectedMarket });
  };
};

export const addAnnotation = (annotationYValue, annotationTrend) => {
  return {
    type: ADD_ANNOTATION,
    payload: { annotationTrend, annotationYValue },
  };
};

export const removeAnnotation = () => ({
  type: REMOVE_ANNOTATION,
});
