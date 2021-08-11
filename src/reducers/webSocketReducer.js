import {
  CONNECT_WEBSOCKET,
  CONNECT_WEBSOCKET_SUCCESS,
  CONNECT_WEBSOCKET_FAIL,
} from "../constants/types/webSocket";

const initialState = {
  as: null,
  ws: null,
  isConnecting: false,
  hasError: false,
  ErrorMessage: null,
};

const WebSocketReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CONNECT_WEBSOCKET:
      return {
        ...state,
        isConnecting: true,
        hasError: false,
        ErrorMessage: null,
      };
    case CONNECT_WEBSOCKET_SUCCESS:
      return {
        ...state,
        as: payload.as,
        ws: payload.ws,
        isConnecting: false,
        hasError: false,
        ErrorMessage: null,
      };
    case CONNECT_WEBSOCKET_FAIL:
      return {
        ...state,
        isConnecting: false,
        hasError: true,
        ErrorMessage: payload,
      };
    default:
      return state;
  }
};

export default WebSocketReducer;
