import { combineReducers } from "redux";
import candleDataReducer from "./candleDataReducer";
import WebSocketReducer from "./webSocketReducer";
import profileDataReducer from "./profileDataReducer";
import marketDataReducer from "./marketDataReducer";
import tradeDataReducer from "./tradeDataReducer";
import accountInfoReducer from "./accountInfoReducer";

const rootReducer = combineReducers({
  candleData: candleDataReducer,
  webSocket: WebSocketReducer,
  profileData: profileDataReducer,
  marketData: marketDataReducer,
  tradeData: tradeDataReducer,
  accountInfo: accountInfoReducer,
});

export default rootReducer;
