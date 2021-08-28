import axios from "axios";

//Candle Data
import {
  FETCH_CANDLE_DATA,
  FETCH_CANDLE_DATA_SUCCESS,
  FETCH_CANDLE_DATA_FAIL,
  MODIFY_CANDLE_DATA,
  RESET_CANDLE_DATA,
} from "../constants/types/candleData";
import { BINOMO_GET_CANDLE } from "../constants/url/binomoUrl";

//Candle Data Function
export const populateCandleData = (ric) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: FETCH_CANDLE_DATA });
      const url = BINOMO_GET_CANDLE(ric);
      let data = await axios.post(url, { ric });
      data = data.data.data;
      data = data.slice(data.length - 10);

      dispatch({
        type: FETCH_CANDLE_DATA_SUCCESS,
        payload: { data },
      });
    } catch (err) {
      console.log(err);
      dispatch({ type: FETCH_CANDLE_DATA_FAIL, payload: err });
    }
  };
};

export const insertNewCandle = (candle, data) => {
  if (data.length < 10)
    return { type: MODIFY_CANDLE_DATA, payload: [...data, candle] };
  else {
    data.shift();
    return { type: MODIFY_CANDLE_DATA, payload: [...data, candle] };
  }
};

export const replaceLatestCandle = (rate, created_at, data) => {
  let { open, high, low } = data.pop();
  return {
    type: MODIFY_CANDLE_DATA,
    payload: [
      ...data,
      {
        open,
        high: Math.max(rate, high),
        low: Math.min(rate, low),
        close: rate,
        created_at,
      },
    ],
  };
};
