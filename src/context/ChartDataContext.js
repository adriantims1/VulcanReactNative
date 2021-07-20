import React, { useReducer } from "react";
import Animated from "react-native-reanimated";

//Helper Functions
import { getAvailableMarket } from "../helper functions/Binomo Requests/Non-Websockets";

const ChartDataContext = React.createContext();

const ChartDataReducer = (state, action) => {
  switch (action.type) {
    case "set_allMarket":
      return { ...state, allMarkets: action.payload };
    case "set_selectedMarket":
      return { ...state, selectedMarket: action.payload };
    case "set_trade":
      return { ...state, isTradeOpen: action.payload };

    case "set_data":
      return { ...state, data: action.payload };
    case "set_scale":
      return {
        ...state,
        scaleY: action.payload.scaleY,
        scaleBody: action.payload.scaleBody,
        scaleIsReady: true,
      };
    case "set_annotationYValue":
      return { ...state, annotationYValue: action.payload };
    case "set_showAnnotation":
      return {
        ...state,
        showAnnotation: action.payload.showAnnotation,
        annotationTrend: action.payload.annotationTrend,
      };
    case "set_scaleIsReady":
      return { ...state, scaleIsReady: action.payload };
    default:
      return state;
  }
};

export const ChartDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ChartDataReducer, {
    allMarkets: [],
    selectedMarket: {},
    isTradeOpen: false,
    data: [],
    scaleY: () => {},
    scaleBody: () => {},
    scaleIsReady: false,
    annotationYValue: 0,
    showAnnotation: false,
    annotationTrend: "",
  });
  const setAvailableMarket = async () => {
    let allMarkets = await getAvailableMarket();
    //Settings = String
    dispatch({ type: "set_allMarket", payload: allMarkets.payload.allMarket });

    if (Object.keys(state.selectedMarket).length === 0) {
      setSelectedMarket(allMarkets.payload.allMarket[0]);
    }
  };
  const setData = (candles) => {
    dispatch({ type: "set_data", payload: candles });
  };
  const setSelectedMarket = (market) => {
    //deviceId = String
    dispatch({ type: "set_selectedMarket", payload: market });
  };
  const setTrade = (trade) => {
    //authToken = String
    dispatch({ type: "set_trade", payload: trade });
  };

  const setScale = (domain) => {
    dispatch({
      type: "set_scale",
      payload: { scaleY: domain.scaleY, scaleBody: domain.scaleBody },
    });
    setScaleIsReady(true);
  };
  const setScaleIsReady = (isReady) => {
    dispatch({
      type: "set_scaleIsReady",
      payload: isReady,
    });
  };
  const setYAnnotation = (yValue) => {
    dispatch({
      type: "set_annotationYValue",
      payload: yValue,
    });
  };
  const setShowAnnotation = (shallShow, annotationTrend) => {
    dispatch({
      type: "set_showAnnotation",
      payload: { showAnnotation: shallShow, annotationTrend },
    });
  };

  return (
    <ChartDataContext.Provider
      value={{
        state,
        setAvailableMarket,
        setData,
        setSelectedMarket,
        setTrade,
        setScale,
        setYAnnotation,
        setShowAnnotation,
        setScaleIsReady,
      }}
    >
      {children}
    </ChartDataContext.Provider>
  );
};

export default ChartDataContext;
