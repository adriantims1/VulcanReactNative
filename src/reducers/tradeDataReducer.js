import {
  SEND_TRADE,
  SEND_TRADE_FAIL,
  SEND_TRADE_SUCCESS,
} from "../constants/types/tradeData";

const initialState = {
  lastTrade: {},
  isSending: false,
  hasError: false,
  errorMessage: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SEND_TRADE:
      return { ...state, isSending: true };
    case SEND_TRADE_SUCCESS:
      return { ...state, ...payload };
    case SEND_TRADE_FAIL:
      return { ...state, hasError: true, errorMessage: payload };
    default:
      return state;
  }
};
