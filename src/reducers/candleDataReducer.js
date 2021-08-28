import {
  FETCH_CANDLE_DATA,
  FETCH_CANDLE_DATA_SUCCESS,
  FETCH_CANDLE_DATA_FAIL,
  MODIFY_CANDLE_DATA,
  RESET_CANDLE_DATA,
} from "../constants/types/candleData";

const initialState = {
  data: [],
  isFetching: false,
  hasError: false,
  errorMessage: null,
};

const candleDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CANDLE_DATA:
      return {
        ...state,
        isFetching: true,
        hasError: false,
        errorMessage: null,
      };
    case FETCH_CANDLE_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.payload.data,
      };
    case FETCH_CANDLE_DATA_FAIL:
      return {
        ...state,
        isFetching: false,
        data: [],
        hasError: true,
        errorMessage: action.payload,
      };
    case MODIFY_CANDLE_DATA:
      return { ...state, data: action.payload };
    case RESET_CANDLE_DATA:
      return { ...state, data: [] };
    default:
      return state;
  }
};

export default candleDataReducer;
