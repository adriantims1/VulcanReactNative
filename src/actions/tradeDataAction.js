import {
  SEND_TRADE,
  SEND_TRADE_FAIL,
  SEND_TRADE_SUCCESS,
} from "../constants/types/tradeData";

export const dealCreated = (dealDetail) => {
  return { type: SEND_TRADE_SUCCESS, payload: dealDetail };
};
