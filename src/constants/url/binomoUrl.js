export const BINOMO_GET_CANDLE = (ric) =>
  "https://316project.azurewebsites.net/api/mobile/candle";

export const BINOMO_AXIOS_CONFIG = (authToken, deviceId) => ({
  headers: {
    "Authorization-Token": authToken,
    "Device-Id": deviceId,
  },
});

export const BINOMO_WS = (authToken, deviceId) =>
  `wss://ws.strategtry.com/?authtoken=${authToken}&device=android&device_id=${deviceId}&v=2&vsn=2.0.1`;

export const BINOMO_AS = () => "wss://as.strategtry.com/";

export const BINOMO_GET_PROFILE_CONFIG = () =>
  "https://316project.azurewebsites.net/api/mobile/profile";
export const BINOMO_GET_BALANCE = () =>
  "https://316project.azurewebsites.net/api/mobile/balance";
export const BINOMO_GET_TRADE_HISTORY = () =>
  `https://316project.azurewebsites.net/api/mobile/tradeHistory`;
export const BINOMO_GET_ALL_MARKET = () =>
  `https://316project.azurewebsites.net/api/mobile/markets`;
