import {
  FETCH_MARKET_DATA,
  FETCH_MARKET_DATA_FAIL,
  FETCH_MARKET_DATA_SUCCESS,
  MODIFY_SELECTED_MARKET,
  MODIFY_TRADEABLE_MARKET,
  START_ROBOT,
  STOP_ROBOT,
  ADD_ANNOTATION,
  REMOVE_ANNOTATION,
  WAIT_ROBOT,
} from "../constants/types/marketData";

const initialState = {
  isFetching: false,
  hasError: false,
  ErrorMessage: null,
  selectedMarket: {},
  marketIcons: {},
  tradeableMarket: [],
  showAnnotation: false,
  robotStatus: "close",
  annotationYValue: null,
  annotationTrend: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_MARKET_DATA:
      return {
        ...state,
        isFetching: true,
        hasFetchError: false,
        fetchErrorMessage: null,
      };
    case FETCH_MARKET_DATA_SUCCESS:
      return {
        ...state,
        ...payload,
        isFetching: false,
        hasFetchError: false,
        fetchErrorMessage: null,
      };
    case FETCH_MARKET_DATA_FAIL:
      return { ...state, hasFetchError: true, fetchErrorMessage: payload };
    case MODIFY_TRADEABLE_MARKET:
      return { ...state, tradeableMarket: payload };
    case MODIFY_SELECTED_MARKET:
      return { ...state, selectedMarket: payload };
    case WAIT_ROBOT:
      return { ...state, robotStatus: "wait" };
    case START_ROBOT:
      return { ...state, robotStatus: "open" };
    case STOP_ROBOT:
      return { ...state, robotStatus: "close" };
    case ADD_ANNOTATION:
      return {
        ...state,
        annotationYValue: payload.annotationYValue,
        annotationTrend: payload.annotationTrend,
        showAnnotation: true,
      };
    case REMOVE_ANNOTATION:
      return {
        ...state,
        annotationYValue: {},
        annotationTrend: null,
        showAnnotation: false,
      };

    default:
      return state;
  }
};
