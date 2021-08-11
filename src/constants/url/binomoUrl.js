export const BINOMO_GET_CANDLE = (ric) =>
  `https://api.binomo.com/platform/candles/${ric}/${
    new Date().toISOString().split("T")[0]
  }T00:00:00/60?locale=en`;

export const BINOMO_AXIOS_CONFIG = (authToken, deviceId) => ({
  headers: {
    "Authorization-Token": authToken,
    "Device-Id": deviceId,
    "Device-Type": "android",
    "Authorization-Version": 2,
  },
});

export const BINOMO_WS = (authToken, deviceId) =>
  `wss://ws.strategtry.com/?authtoken=${authToken}&device=android&device_id=${deviceId}&v=2&vsn=2.0.0`;

export const BINOMO_AS = () => "wss://as.strategtry.com/";

export const BINOMO_GET_PROFILE_CONFIG = () =>
  "https://api.binomo.com/platform/private/v3/config?locale=en";
export const BINOMO_GET_BALANCE = () =>
  "https://api.binomo.com/platform/private/v2/profile?locale=en";
export const BINOMO_GET_TRADE_HISTORY = (dealType, batchKey = null) =>
  `https://api.binomo.com/platform/private/v2/deals/option?type=${dealType}&${
    batchKey ? `batch_key=${batchKey}&` : null
  }tournament_id=&locale=en`;
export const BINOMO_GET_ALL_MARKET = () =>
  `https://api.binomo.com/platform/private/v3/assets?locale=en`;

export const BINOMO_GET_TIME = () =>
  "https://api.binomo.com/platform/time?locale=en";
